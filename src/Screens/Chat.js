import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import {emitter, User} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import List_empty from '../Components/list_empty';
import Loadindicator from '../Components/load_indicator';
import Message from '../Components/message';
import Small_btn from '../Components/small_button';
import Text_btn from '../Components/Text_btn';
import {hp, wp} from '../utils/dimensions';
import {capitalise} from '../utils/functions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import DocumentPicker from 'react-native-document-picker';
import Cool_modal from '../Components/cool_modal';
import Deposit_to_escrow from '../Components/deposit_to_escrow';
import Fulfil from '../Components/fulfil';
import Confirm_transaction from '../Components/confirm_transaction';
import Countdown from '../Components/countdown';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    let {offer} = this.props.route.params;
    this.state = {
      text: '',
      attachment: new Array(),
      timestamp: offer.timestamp,
      requested_time: offer.requested_time,
    };
  }

  componentDidMount = async () => {
    let {route} = this.props;
    let {onsale, offer} = route.params;
    let chat = await post_request('chat', {
        onsale: onsale._id,
        offer: offer._id,
      }),
      messages;

    if (chat) {
      messages = await post_request('messages', {
        chat: chat._id,
        user: this.loggeduser._id,
        reset_pager: true,
      });
      this.other_person =
        chat.from === this.loggeduser._id ? chat.to : chat.from;

      messages = messages.map(msg => {
        if (msg.attachment)
          msg.attachment = msg.attachment.map(att => {
            if (att.startsWith && att.startsWith('offer')) att = offer;
            return att;
          });
        return msg;
      });

      await post_request('clear_new_messages', {
        offer: offer._id,
        user: this.loggeduser._id,
      });

      emitter.emit('clear_new_messages', offer._id);
    }

    this.setState(
      {
        messages:
          messages && messages.sort
            ? messages.sort((m1, m2) => m1.created > m2.created)
            : new Array(),
        chat,
      },
      () => this.flat_list.scrollToOffset({offset: 0, animated: true}),
    );

    this.new_message = message => {
      let {chat, messages} = this.state;
      if (chat._id !== message.chat) return;
      if (message.attachment)
        message.attachment = message.attachment.map(att => {
          if (att.startsWith && att.startsWith('offer'))
            att = this.props.route.params.offer;
          return att;
        });
      messages = new Array(...messages, message);
      this.setState({messages}, () =>
        this.flat_list.scrollToOffset({offset: 0, animated: true}),
      );
    };

    this.is_typing = chat_id => {
      let {chat} = this.state;
      if (!chat) return;

      chat._id === chat_id && this.setState({is_typing: true});
    };

    this.not_typing = chat_id => {
      let {chat} = this.state;
      if (!chat) return;

      chat._id === chat_id && this.setState({is_typing: false});
    };

    this.offer_deposit = ({offer: offer_id, timestamp}) => {
      offer_id === this.props.route.params.offer._id &&
        this.setState({status: 'in-escrow', timestamp});
    };

    this.offer_fulfilled = ({offer: offer_id, timestamp}) => {
      offer_id === this.props.route.params.offer._id &&
        this.setState({status: 'awaiting confirmation', timestamp});
    };

    this.offer_confirmed = offer_id => {
      offer_id === this.props.route.params.offer._id &&
        this.setState({status: 'completed'});
    };

    this.offer_time_extended = ({offer: offer_id, timestamp}) =>
      offer_id === offer._id &&
      this.setState({timestamp, requested_time: null});

    this.offer_in_dispute = ({offer: offer_id}) =>
      offer._id === offer_id && this.setState({status: 'in-dispute'});

    this.offer_status_update = ({offer: offer_id, status}) =>
      offer._id === offer_id && this.setState({status});

    emitter.listen('new_message', this.new_message);
    emitter.listen('offer_time_extended', this.offer_time_extended);
    emitter.listen('offer_deposit', this.offer_deposit);
    emitter.listen('offer_status_update', this.offer_status_update);
    emitter.listen('offer_in_dispute', this.offer_in_dispute);
    emitter.listen('offer_fulfilled', this.offer_fulfilled);
    emitter.listen('offer_confirmed', this.offer_confirmed);
    emitter.listen('is_typing', this.is_typing);
    emitter.listen('not_typing', this.not_typing);
  };

  componentWillUnmount = () => {
    emitter.remove_listener('offer_confirmed', this.offer_confirmed);
    emitter.remove_listener('offer_fulfilled', this.offer_fulfilled);
    emitter.remove_listener('offer_in_dispute', this.offer_in_dispute);
    emitter.remove_listener('offer_status_update', this.offer_status_update);
    emitter.remove_listener('offer_deposit', this.offer_deposit);
    emitter.remove_listener('offer_time_extended', this.offer_time_extended);
    emitter.remove_listener('new_message', this.new_message);
    emitter.remove_listener('is_typing', this.is_typing);
    emitter.remove_listener('not_typing', this.not_typing);
  };

  request_time_extension = async () => {
    let {offer, onsale} = this.props.route.params;

    if (this.state.requested_time) return;

    (await post_request('request_time_extension', {
      offer: offer._id,
      onsale: onsale._id,
      user: this.loggeduser._id,
    })) && this.setState({requested_time: true});
  };

  extend_time = async () => {
    let {offer, onsale} = this.props.route.params,
      timestamp = Date.now();

    (await post_request('extend_time', {
      offer: offer._id,
      onsale: onsale._id,
      user: this.loggeduser._id,
    })) &&
      this.setState({timestamp, requested_time: false}, () =>
        emitter.emit('offer_time_extended', {offer: offer._id, timestamp}),
      );
  };

  offer_details = () => {
    let {navigation, route} = this.props;
    let {onsale} = route.params;

    navigation.navigate('onsale_details', {user: this.loggeduser, onsale});
  };

  toggle_attachments = async () => {
    console.log('HERE');
    let files = await DocumentPicker.pick({mode: 'open'});

    console.log(files);
  };

  set_message_text = text => this.setState({text});

  send_message = async () => {
    this.setState({sending: true});
    let {route} = this.props;
    let {onsale, offer} = route.params;
    let {chat, text, attachment} = this.state;

    if (!chat) {
      chat = {
        offer: offer._id,
        from: this.loggeduser._id,
        to:
          this.loggeduser._id === onsale.seller._id
            ? offer.user._id
            : onsale.seller._id,
      };
      let res = await post_request('new_chat', chat);
      if (!res || (res && !res._id)) {
        this.setState({sending: false});
        return toast('Something went wrong');
      }
      chat._id = res._id;
      chat.updated = res.updated;
      chat.created = res.created;

      this.other_person =
        chat.from === this.loggeduser._id ? chat.to : chat.from;
      this.setState({chat});
    }
    let message = {
      text,
      chat: chat._id,
      offer: offer._id,
      onsale: onsale._id,
      from: this.loggeduser._id,
      to:
        this.loggeduser._id === onsale.seller._id
          ? offer.user._id
          : onsale.seller._id,
      attachment,
    };

    emitter.emit('send_message', message, msg => {
      let {messages} = this.state;
      messages = new Array(...messages, msg);
      this.setState(
        {messages, sending: false, text: '', attachment: new Array()},
        this.flat_list.scrollToOffset({offset: 0, animated: true}),
      );
    });
  };

  render_message = message => {
    let {route, navigation} = this.props;
    let {onsale} = route.params;

    return (
      <Message
        loggeduser={this.loggeduser}
        message={message}
        onsale={onsale}
        navigation={navigation}
      />
    );
  };

  fetch_more = async () => {
    let {offer} = this.props.route.params;
    let {has_no_more, loading_more, messages, chat} = this.state;

    if (!chat || has_no_more || loading_more || !messages) return;
    this.setState({loading_more: true});

    let more_messages = await post_request('messages', {
      chat: chat._id,
      user: this.loggeduser._id,
    });

    if (!more_messages?.length) has_no_more = true;

    more_messages = more_messages.map(msg => {
      if (msg.attachment)
        msg.attachment = msg.attachment.map(att => {
          if (att.startsWith && att.startsWith('offer')) att = offer;
          return att;
        });
      return msg;
    });

    messages = new Array(...messages, ...more_messages);
    messages = messages.sort((m1, m2) => m1.created > m2.created);

    this.setState({has_no_more, messages, loading_more: false});
  };

  accept = async () => {
    let {offer, onsale} = this.props.route.params;

    let res = await post_request('accept_offer', {
      offer: offer._id,
      onsale: onsale._id,
    });
    res && this.setState({status: 'accepted'});
  };

  on_blur = () => {
    let {chat} = this.state;
    chat &&
      emitter.emit('blur_message_input', {
        to: this.other_person,
        chat: chat._id,
      });
  };

  on_focus = () => {
    let {chat} = this.state;
    chat &&
      emitter.emit('focus_message_input', {
        to: this.other_person,
        chat: chat._id,
      });
  };

  in_dispute = () => {
    let {offer, navigation, onsale, user} = this.props;

    navigation.navigate('in_dispute', {offer, onsale, user});
  };

  submit_dispute = () => {
    let {navigation, route} = this.props;
    let {offer, onsale} = route.params;

    navigation.navigate('submit_dispute', {
      offer,
      onsale,
      user: this.loggeduser,
    });
  };

  render_chat_offer = () => {
    let {timestamp, requested_time, status: status_} = this.state;
    let {route} = this.props;
    let {onsale, offer} = route.params;
    let {amount, offer_rate, status, user} = offer;
    let {seller, alphabetic_name} = onsale;
    if (status_) status = status_;

    let disputable = timestamp + this.aday < Date.now();

    return (
      <Bg_view
        shadowed
        style={{
          borderRadius: wp(4),
          margin: wp(2.8),
          padding: wp(4),
        }}>
        <Bg_view horizontal style={{justifyContent: 'space-between'}}>
          <Bg_view horizontal>
            <Bg_view
              style={{
                height: wp(7.5),
                width: wp(7.5),
                borderRadius: wp(7.5),
                backgroundColor: '#ddd',
              }}
            />
            <Fr_text size={wp(3.8)} style={{marginLeft: wp(1.4)}} capitalise>
              {seller.username}
            </Fr_text>
          </Bg_view>
          <Bg_view horizontal>
            <Fr_text size={wp(3.8)} style={{marginRight: wp(1.4)}} capitalise>
              {user.username}
            </Fr_text>
            <Bg_view
              style={{
                height: wp(7.5),
                width: wp(7.5),
                borderRadius: wp(7.5),
                backgroundColor: '#ddd',
              }}
            />
          </Bg_view>
        </Bg_view>
        <Bg_view
          horizontal
          style={{
            justifyContent: 'space-between',
            marginVertical: hp(1.4),
          }}>
          <Fr_text
            style={{flex: 1}}
            size={wp(5.2)}
            bold>{`${amount} ${alphabetic_name}`}</Fr_text>
          <Icon
            icon="exchange_chat_icon.png"
            style={{
              marginHorizontal: wp(2.8),
              height: wp(7.5),
              width: wp(7.5),
            }}
          />
          <Fr_text
            style={{flex: 1, textAlign: 'right'}}
            size={wp(5.2)}
            bold>{`${offer_rate * amount} NGN`}</Fr_text>
        </Bg_view>

        {status === 'in-dispute' ? (
          <Text_btn
            text="in-dispute"
            capitalise
            accent
            centralise
            action={this.in_dispute}
          />
        ) : this.loggeduser._id === seller._id ? (
          <Bg_view horizontal style={{justifyContent: 'space-between'}}>
            <Bg_view flex />
            <Bg_view horizontal style={{justifyContent: 'center'}} flex>
              {status === 'in-escrow' ? (
                disputable ? (
                  <Text_btn
                    text={
                      requested_time
                        ? 'Awaiting time extension'
                        : 'request time extension'
                    }
                    action={this.request_time_extension}
                    capitalise
                    centralise
                    accent
                    disabled={requested_time}
                  />
                ) : (
                  <Small_btn
                    title="fulfilled?"
                    action={
                      this.fulfil_modal && this.fulfil_modal.toggle_show_modal
                    }
                  />
                )
              ) : status === 'awaiting confirmation' ? (
                disputable && !requested_time ? (
                  <Bg_view horizontal>
                    <Text_btn
                      text="extend time"
                      action={this.extend_time}
                      accent
                      capitalise
                      style={{borderRightWidth: 1, borderRightColor: '#ccc'}}
                    />
                    <Text_btn
                      text="dispute"
                      action={this.submit_dispute}
                      accent
                      capitalise
                    />
                  </Bg_view>
                ) : (
                  <Countdown
                    on_touch={() => toast('Awaiting buyer confirmation.')}
                    timestamp={timestamp + this.aday}
                  />
                )
              ) : status === 'pending' ? (
                <Text_btn
                  accent
                  capitalise
                  text="accept"
                  action={this.accept}
                />
              ) : null}
              {status === 'declined' ? (
                <Text_btn accent capitalise text="Declined!" />
              ) : status === 'pending' ? (
                <Text_btn
                  accent
                  capitalise
                  text="decline"
                  action={this.decline}
                />
              ) : null}
            </Bg_view>
            <Text_btn
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}
              text={status}
              capitalise
              italic
              accent
            />
          </Bg_view>
        ) : (
          <Bg_view horizontal style={{justifyContent: 'space-between'}}>
            <Text_btn
              style={{flex: 1}}
              text="Offer details"
              action={this.offer_details}
            />
            <Bg_view horizontal style={{justifyContent: 'space-between'}}>
              {status === 'accepted' ? (
                <Text_btn
                  text="deposit"
                  action={
                    this.cool_modal_deposit &&
                    this.cool_modal_deposit.toggle_show_modal
                  }
                  accent
                  capitalise
                />
              ) : status === 'in-escrow' ? (
                disputable && !requested_time ? (
                  <Bg_view horizontal>
                    <Text_btn
                      text="extend time"
                      action={this.extend_time}
                      accent
                      capitalise
                      style={{borderRightWidth: 1, borderRightColor: '#ccc'}}
                    />
                    <Text_btn
                      text="dispute"
                      action={this.submit_dispute}
                      accent
                      capitalise
                    />
                  </Bg_view>
                ) : (
                  <Countdown
                    on_touch={() => toast('Awaiting seller to fulfil.')}
                    timestamp={timestamp + this.aday}
                  />
                )
              ) : status === 'awaiting confirmation' ? (
                disputable ? (
                  <Text_btn
                    text={
                      requested_time
                        ? 'awaiting time extension'
                        : 'request time extension'
                    }
                    action={this.request_time_extension}
                    capitalise
                    accent
                    disabled={requested_time}
                  />
                ) : (
                  <Text_btn
                    text="confirm"
                    action={
                      this.cool_modal_confirm &&
                      this.cool_modal_confirm.toggle_show_modal
                    }
                    accent
                    capitalise
                  />
                )
              ) : null}
            </Bg_view>
            <Text_btn
              style={{flex: 1, alignItems: 'flex-end'}}
              text={status}
              capitalise
              italic
              accent
            />
          </Bg_view>
        )}

        {seller._id === this.loggeduser._id &&
        status === 'in-escrow' ? null : seller._id !== this.loggeduser._id &&
          status === 'awaiting confirmation' ? null : requested_time &&
          status !== 'in-dispute' ? (
          <Bg_view style={{alignItems: 'center'}}>
            <Fr_text centralise>
              Party requested a time extension to respond to transaction.
            </Fr_text>
            <Bg_view horizontal>
              <Text_btn
                action={this.extend_time}
                text="extend time"
                accent
                capitalise
                style={{borderRightWidth: 1, borderRightColor: '#ccc'}}
              />
              <Text_btn
                action={this.submit_dispute}
                text="dispute"
                accent
                capitalise
              />
            </Bg_view>
          </Bg_view>
        ) : null}
      </Bg_view>
    );
  };

  aday = 60 * 60 * 24 * 1000;

  render() {
    let {text, attachment, sending, loading_more, is_typing, messages} =
      this.state;
    let {route, navigation} = this.props;
    let {onsale, offer} = route.params;
    let {amount, user} = offer;
    let {seller, alphabetic_name} = onsale;

    return (
      <User.Consumer>
        {loggeduser => {
          this.loggeduser = loggeduser;

          return (
            <KeyboardAvoidingView style={{flex: 1}}>
              <Bg_view flex>
                <Header
                  no_transform
                  title={`Purchase ${amount} ${
                    alphabetic_name || 'USD'
                  } from ${capitalise(seller.username)}`}
                  navigation={navigation}
                />
                <Bg_view flex style={{paddingHorizontal: wp(2.8)}}>
                  {loading_more ? <Loadindicator /> : null}
                  <FlatList
                    data={
                      messages
                        ? new Array({_id: 'offer'}, ...messages).reverse()
                        : new Array({_id: 'offer'})
                    }
                    keyExtractor={item => item._d}
                    fadingEdgeLength={wp(10)}
                    ref={flat_list => (this.flat_list = flat_list)}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.fetch_more}
                    onEndReachedThreshold={0.3}
                    inverted={messages && messages.length}
                    renderItem={({item}) =>
                      !item
                        ? null
                        : item._id === 'offer'
                        ? this.render_chat_offer()
                        : this.render_message(item)
                    }
                  />
                  <Bg_view flex>
                    {messages ? (
                      messages.length ? null : (
                        <List_empty text="No messages yet" />
                      )
                    ) : (
                      <Loadindicator />
                    )}
                  </Bg_view>
                </Bg_view>
                {is_typing ? (
                  <Fr_text
                    style={{marginHorizontal: wp(2.8), marginTop: hp(1.4)}}
                    accent
                    italic>
                    {`${capitalise(
                      this.other_person === seller._id
                        ? seller.username
                        : user.username,
                    )} is typing`}
                  </Fr_text>
                ) : null}
                <Bg_view
                  horizontal
                  style={{
                    margin: wp(2.8),
                    justifyContent: 'space-between',
                    marginTop: wp(1),
                  }}>
                  <Bg_view
                    horizontal
                    style={{
                      backgroundColor: '#ddd',
                      borderRadius: wp(5.6),
                      marginRight: wp(1.4),
                      minHeight: hp(6),
                      flex: 1,
                    }}>
                    <TextInput
                      placeholder="Enter message"
                      multiline
                      onBlur={this.on_blur}
                      onFocus={this.on_focus}
                      onChangeText={this.set_message_text}
                      value={text}
                      style={{
                        fontSize: wp(4),
                        paddingHorizontal: wp(4),
                        flex: 1,
                      }}
                    />
                    <Icon
                      icon="attachement_icon.png"
                      action={() => this.toggle_attachments()}
                    />
                  </Bg_view>
                  {sending ? (
                    <Loadindicator />
                  ) : !text && !attachment.length ? null : (
                    <Icon
                      icon="chat_send_icon.png"
                      action={this.send_message}
                      style={{height: wp(9), width: wp(9)}}
                    />
                  )}
                </Bg_view>
              </Bg_view>

              <Cool_modal
                ref={cool_modal_deposit =>
                  (this.cool_modal_deposit = cool_modal_deposit)
                }>
                <Deposit_to_escrow
                  onsale={onsale}
                  offer={offer}
                  navigation={navigation}
                  wallet={loggeduser.wallet}
                  close_modal={
                    this.cool_modal_deposit &&
                    this.cool_modal_deposit.toggle_show_modal
                  }
                />
              </Cool_modal>

              <Cool_modal
                ref={fulfil_modal => (this.fulfil_modal = fulfil_modal)}>
                <Fulfil
                  offer={offer}
                  onsale={onsale}
                  navigation={navigation}
                  close_modal={
                    this.fulfil_modal && this.fulfil_modal.toggle_show_modal
                  }
                />
              </Cool_modal>
              <Cool_modal
                ref={cool_modal_confirm =>
                  (this.cool_modal_confirm = cool_modal_confirm)
                }>
                <Confirm_transaction
                  offer={offer}
                  onsale={onsale}
                  navigation={navigation}
                  user={loggeduser}
                  close_modal={
                    this.cool_modal_confirm &&
                    this.cool_modal_confirm.toggle_show_modal
                  }
                />
              </Cool_modal>
            </KeyboardAvoidingView>
          );
        }}
      </User.Consumer>
    );
  }
}

export default Chat;
