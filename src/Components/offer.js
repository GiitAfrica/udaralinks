import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Small_btn from './small_button';
import {emitter} from './../../Udara';
import {post_request} from '../utils/services';
import Text_btn from './Text_btn';
import Cool_modal from './cool_modal';
import Deposit_to_escrow from './deposit_to_escrow';
import Fulfil from './fulfil';
import Confirm_transaction from './confirm_transaction';
import Countdown from './countdown';

class Offer extends React.Component {
  constructor(props) {
    super(props);

    let {offer, user} = this.props,
      new_messages =
        (offer.user._id === user._id
          ? offer.buyer_new_messages
          : offer.seller_new_messages) || 0;

    this.state = {
      new_messages,
      timestamp: offer.timestamp,
      requested_time: offer.requested_time,
    };
  }

  componentDidMount = () => {
    let {offer} = this.props;

    this.show_offer_btn = _id => {
      if (_id !== offer._id && this.state.show_btns)
        this.setState({show_btns: false});
    };

    this.offer_deposit = ({offer: offer_id, timestamp}) => {
      offer_id === offer._id && this.setState({status: 'in-escrow', timestamp});
    };

    this.offer_fulfilled = ({offer: offer_id, timestamp}) => {
      offer_id === offer._id &&
        this.setState({status: 'awaiting confirmation', timestamp});
    };

    this.offer_confirmed = offer_id => {
      offer_id === offer._id && this.setState({status: 'completed'});
    };

    this.new_message = msg =>
      msg.offer === offer._id &&
      this.setState({new_messages: this.state.new_messages + 1});

    this.clear_new_messages = offer_id =>
      offer_id === offer._id && this.setState({new_messages: 0});

    this.offer_time_extended = ({offer: offer_id, timestamp}) =>
      offer_id === offer._id &&
      this.setState({timestamp, requested_time: null});

    this.offer_in_dispute = ({offer: offer_id}) =>
      offer._id === offer_id && this.setState({status: 'in-dispute'});

    this.resolve_dispute = offer_id =>
      offer_id === offer._id &&
      this.setState({status: offer.prior_offer_status});

    this.offer_status_update = ({offer: offer_id, status}) =>
      offer._id === offer_id && this.setState({status});

    emitter.listen('show_offer_btn', this.show_offer_btn);
    emitter.listen('offer_deposit', this.offer_deposit);
    emitter.listen('offer_status_update', this.offer_status_update);
    emitter.listen('resolve_dispute', this.resolve_dispute);
    emitter.listen('offer_in_dispute', this.offer_in_dispute);
    emitter.listen('offer_time_extended', this.offer_time_extended);
    emitter.listen('offer_fulfilled', this.offer_fulfilled);
    emitter.listen('offer_confirmed', this.offer_confirmed);
    emitter.listen('new_message', this.new_message);
    emitter.listen('clear_new_messages', this.clear_new_messages);
  };

  componentWillUnmount = () => {
    emitter.remove_listener('clear_new_messages', this.clear_new_messages);
    emitter.remove_listener('new_message', this.new_message);
    emitter.remove_listener('offer_confirmed', this.offer_confirmed);
    emitter.remove_listener('offer_fulfilled', this.offer_fulfilled);
    emitter.remove_listener('offer_time_extended', this.offer_time_extended);
    emitter.remove_listener('offer_in_dispute', this.offer_in_dispute);
    emitter.remove_listener('resolve_dispute', this.resolve_dispute);
    emitter.remove_listener('offer_status_update', this.offer_status_update);
    emitter.remove_listener('offer_deposit', this.offer_deposit);
    emitter.remove_listener('show_offer_btn', this.show_offer_btn);
  };

  toggle_offer_buttons = () =>
    this.setState(
      {show_btns: !this.state.show_btns},
      () =>
        this.state.show_btns &&
        emitter.emit('show_offer_btn', this.props.offer._id),
    );

  request_time_extension = async () => {
    let {offer, onsale, user} = this.props;
    if (this.state.requested_time) return;

    (await post_request('request_time_extension', {
      offer: offer._id,
      onsale: onsale._id,
      user: user._id,
    })) && this.setState({requested_time: true});
  };

  extend_time = async () => {
    let {offer, onsale, user} = this.props,
      timestamp = Date.now();

    (await post_request('extend_time', {
      offer: offer._id,
      onsale: onsale._id,
      user: user._id,
    })) &&
      this.setState({timestamp, requested_time: false}, () =>
        emitter.emit('offer_time_extended', {offer: offer._id, timestamp}),
      );
  };

  accept = async () => {
    let {offer, onsale} = this.props;

    let res = await post_request('accept_offer', {
      offer: offer._id,
      onsale: onsale._id,
    });
    res && this.setState({status: 'accepted'});
  };

  decline = async () => {
    let {offer, onsale} = this.props;

    let res = await post_request('decline_offer', {
      offer: offer._id,
      onsale: onsale._id,
    });
    res && this.setState({status: 'declined'});
  };

  remove_offer = async () => {
    let {offer, onsale} = this.props;

    let res = await post_request('remove_offer', {
      offer: offer._id,
      onsale: onsale._id,
    });

    res && this.setState({removed: true});
  };

  submit_dispute = () => {
    let {offer, onsale, user, navigation} = this.props;

    navigation.navigate('submit_dispute', {offer, onsale, user});
  };

  go_to_chat = () => {
    let {onsale, offer, navigation} = this.props;
    offer.status = this.state.status || offer.status;

    navigation.navigate('chat', {onsale, offer});
  };

  dispute = () => {
    let {offer, navigation, onsale, admin_in_dispute, user} = this.props;

    navigation.navigate('dispute', {offer, onsale, user, admin_in_dispute});
  };

  aday = 60 * /* 60 * 24 *  */ 1000;

  render = () => {
    let {
      show_btns,
      status: status_,
      new_messages,
      timestamp,
      removed,
      requested_time,
    } = this.state;
    if (removed) return null;

    let {
      offer,
      no_foot,
      user,
      onsale,
      status: status__,
      admin_in_dispute,
      navigation,
    } = this.props;
    let {flag, seller, currency} = onsale;
    let {amount, status, offer_rate} = offer;
    if (status_) status = status_;
    new_messages = new_messages || '';

    let disputable = timestamp + this.aday < Date.now();

    if (admin_in_dispute && status === 'closed') return null;

    return (
      <TouchableWithoutFeedback onPress={this.toggle_offer_buttons}>
        <View>
          <Bg_view
            shadowed
            style={{
              padding: wp(2.8),
              margin: wp(2.8),
              marginTop: wp(1.4),
              borderRadius: wp(4),
              maxWidth: wp(),
            }}>
            <Bg_view horizontal style={{justifyContent: 'space-between'}}>
              <Icon icon={flag} style={{height: wp(10), width: wp(10)}} />
              <Bg_view style={{marginLeft: wp(1.4)}}>
                <Fr_text bold size={wp(4.5)}>
                  {`${amount} ${currency}`}
                </Fr_text>
                <Fr_text size={wp(3.5)}>{`x ${offer_rate}`}</Fr_text>
              </Bg_view>
              <Icon
                icon="exchange_chat_icon.png"
                style={{marginHorizontal: wp(2.8)}}
              />
              <Bg_view style={{alignItems: 'flex-end', flexWrap: 'wrap'}}>
                <Fr_text capitalise italic size={wp(3.5)} accent>
                  {status__ || status || 'pending'}
                </Fr_text>
                <Fr_text bold size={wp(4.5)}>
                  {`${amount * offer_rate} NGN`}
                </Fr_text>
              </Bg_view>
            </Bg_view>

            {no_foot ? null : status === 'in-dispute' ? (
              <Text_btn
                text="in-dispute"
                capitalise
                centralise
                accent
                action={this.dispute}
              />
            ) : status__ && status__ !== status ? null : show_btns ? (
              <Bg_view style={{alignItems: 'center'}}>
                {user._id !== seller._id /* loggeduser is buyer */ ? (
                  <Bg_view horizontal style={{justifyContent: 'center'}}>
                    {status === 'declined' || status__ ? null : (
                      <Icon
                        icon="chat_send_icon.png"
                        action={this.go_to_chat}
                        text={<Fr_text>{` ${new_messages}`}</Fr_text>}
                        style={{height: wp(7.5), width: wp(7.5)}}
                      />
                    )}
                    {status === 'accepted' ? (
                      <Bg_view horizontal>
                        <Text_btn
                          text="deposit"
                          action={
                            this.cool_modal_deposit &&
                            this.cool_modal_deposit.toggle_show_modal
                          }
                          accent
                          capitalise
                        />
                      </Bg_view>
                    ) : status === 'in-escrow' ? (
                      disputable && !requested_time ? (
                        <Bg_view horizontal>
                          <Text_btn
                            text="extend time"
                            action={this.extend_time}
                            accent
                            capitalise
                            style={{
                              borderRightWidth: 1,
                              borderRightColor: '#ccc',
                            }}
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
                    ) : status === 'completed' ? null : (
                      <Text_btn
                        text="remove offer"
                        action={this.remove_offer}
                        accent
                        capitalise
                      />
                    )}
                  </Bg_view>
                ) : (
                  /* loggeduser is seller */ <Bg_view horizontal>
                    {status === 'declined' ? null : !status__ ? (
                      <Icon
                        icon="chat_send_icon.png"
                        action={this.go_to_chat}
                        text={
                          <Fr_text italic bold style={{marginLeft: wp(1.4)}}>
                            {new_messages}
                          </Fr_text>
                        }
                        style={{height: wp(7.5), width: wp(7.5)}}
                      />
                    ) : null}
                    {status === 'declined' ? null : status ===
                      'accepted' ? null : status === 'in-escrow' ? (
                      disputable ? (
                        <Text_btn
                          text={
                            requested_time
                              ? 'Awaiting time extension'
                              : 'request time extension'
                          }
                          action={this.request_time_extension}
                          capitalise
                          accent
                          disabled={requested_time}
                        />
                      ) : (
                        <Small_btn
                          title="fulfilled?"
                          action={
                            this.fulfil_modal &&
                            this.fulfil_modal.toggle_show_modal
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
                            style={{
                              borderRightWidth: 1,
                              borderRightColor: '#ccc',
                            }}
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
                    ) : status === 'completed' ? null : (
                      <Small_btn title="accept" action={this.accept} />
                    )}
                    {status === 'pending' ? (
                      <Small_btn
                        inverted
                        title="decline"
                        action={this.decline}
                      />
                    ) : status === 'declined' ? (
                      <Text_btn text="Declined!" />
                    ) : null}
                  </Bg_view>
                )}
              </Bg_view>
            ) : null}

            {seller._id === user._id &&
            status === 'in-escrow' ? null : seller._id !== user._id &&
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
          <Cool_modal
            ref={cool_modal_deposit =>
              (this.cool_modal_deposit = cool_modal_deposit)
            }>
            <Deposit_to_escrow
              onsale={onsale}
              offer={offer}
              wallet={user.wallet}
              navigation={navigation}
              close_modal={
                this.cool_modal_deposit &&
                this.cool_modal_deposit.toggle_show_modal
              }
            />
          </Cool_modal>

          <Cool_modal ref={fulfil_modal => (this.fulfil_modal = fulfil_modal)}>
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
              user={user}
              close_modal={
                this.cool_modal_confirm &&
                this.cool_modal_confirm.toggle_show_modal
              }
            />
          </Cool_modal>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default Offer;
