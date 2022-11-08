import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import {emitter} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {format_quick_time} from '../utils/functions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Line from './line';
import Proceed_to_purchase from './proceed_to_purchase';
import Text_btn from './Text_btn';
import Topup from './topup';

class Onsale_currency extends React.Component {
  constructor(props) {
    super(props);

    let {onsale} = this.props;
    onsale.likes = onsale.likes || 0;
    onsale.dislikes = onsale.dislikes || 0;
    this.state = {onsale};
  }

  componentDidMount = () => {
    let {onsale} = this.props;

    this.show_onsale_btn = _id => {
      if (_id !== onsale._id && this.state.show_btn)
        this.setState({show_btn: false});
    };

    this.remove_sale_listener = onsale_id =>
      onsale._id === onsale_id && this.setState({removed: true});

    emitter.listen('show_onsale_btn', this.show_onsale_btn);
    emitter.listen('remove_sale', this.remove_sale_listener);
  };

  componentWillUnmount = () => {
    emitter.remove_listener('show_onsale_btn', this.show_onsale_btn);
    emitter.remove_listener('remove_sale', this.remove_sale_listener);
  };

  remove_sale = async () => {
    this.setState({loading: true});
    let {onsale, user, on_remove} = this.props;
    let {seller, currency, value, _id} = onsale;
    if (seller._id !== user._id) {
      toast('Something is not right!');
      this.setState({loading: false});
      return;
    }

    let response = await post_request('remove_sale', {
      onsale: _id,
      currency,
    });

    if (response && response.onsale) {
      on_remove && on_remove();
      emitter.emit('remove_sale', onsale._id);
      toast('Currency removed from sale');
    } else
      toast(
        response
          ? 'Err, something went wrong'
          : 'It appears your currency has been purchased',
      );
    this.setState({loading: false});
  };

  purchase = async () => {
    let {onsale, user, conversion_rate} = this.props;
    let {wallet} = user;
    let {to_currency, value} = onsale;
    let purchase_value = value * conversion_rate;

    if (wallet[to_currency] < purchase_value) {
      toast('Insufficient Balance');
      this.top_up_modal && this.top_up_modal.toggle_show_modal();
      return this.setState({loading: false});
    } else
      this.proceed_to_purchase && this.proceed_to_purchase.toggle_show_modal();
  };

  remove = () => this.setState({removed: true});

  like = async () => {
    let {user} = this.props;
    let {onsale} = this.state;
    try {
      await post_request('like_sale', {
        onsale: onsale._id,
        currency,
        user: user._id,
      });
    } catch (e) {}

    onsale.likes++;
    this.setState({onsale});
  };

  dislike = async () => {
    let {user} = this.props;
    let {onsale} = this.state;
    try {
      await post_request('dislike_sale', {
        onsale: onsale._id,
        currency,
        user: user._id,
      });
    } catch (e) {}

    onsale.dislikes++;
    this.setState({onsale});
  };

  toggle_show_btn = () =>
    this.setState(
      {show_btn: !this.state.show_btn},
      () =>
        this.state.show_btn &&
        emitter.emit('show_onsale_btn', this.props.onsale._id),
    );

  go_to_details = () => {
    let {navigation, user} = this.props;
    let {onsale} = this.state;

    navigation.navigate('onsale_details', {onsale, user});
  };

  offers = () => {
    let {navigation, onsale} = this.props;

    navigation.navigate('offers', {onsale});
  };

  render = () => {
    let {show_btn, onsale, removed} = this.state;
    if (removed) return null;

    let {user} = this.props;

    if (!onsale) return null;

    let {
      to_currency,
      icon,
      value,
      likes,
      dislikes,
      rate,
      status,
      seller,
      created,
    } = onsale;

    return (
      <Bg_view
        style={{
          marginHorizontal: wp(4),
          padding: wp(4),
          paddingBottom: wp(2.8),
          marginBottom: hp(1.4),
          borderRadius: wp(4),
          elevation: 10,
          shadowColor: '#000',
        }}>
        <TouchableNativeFeedback
          onPress={
            seller._id === user._id ? this.toggle_show_btn : this.go_to_details
          }>
          <View>
            <Bg_view
              horizontal
              style={{
                justifyContent: 'space-between',
              }}>
              <Bg_view>
                <Fr_text bold capitalise>
                  {seller.username}
                </Fr_text>
              </Bg_view>
              <Fr_text capitalise size={wp(3.5)} italic accent>
                {status || 'onsale'}
              </Fr_text>
            </Bg_view>
            <Bg_view horizontal style={{justifyContent: 'space-between'}}>
              <Bg_view horizontal style={{alignItems: 'center'}}>
                <Icon
                  icon={require('../assets/Icons/like_icon.png')}
                  action={user._id !== seller._id && this.like}
                  text={
                    likes ? (
                      <Fr_text
                        size={wp(3.5)}
                        style={{padding: 0, marginLeft: wp(1.4)}}>
                        {likes}
                      </Fr_text>
                    ) : null
                  }
                  style={{
                    height: wp(3.5),
                    width: wp(3.5),
                    padding: 0,
                    paddingVertical: hp(1),
                    marginRight: wp(2.8),
                  }}
                />
                <Icon
                  icon={require('../assets/Icons/dislike_icon.png')}
                  action={user._id !== seller._id && this.dislike}
                  text={
                    dislikes ? (
                      <Fr_text
                        size={wp(3.5)}
                        style={{padding: 0, marginLeft: wp(1.4)}}>
                        {dislikes}
                      </Fr_text>
                    ) : null
                  }
                  style={{
                    height: wp(3.5),
                    width: wp(3.5),
                    padding: 0,
                    paddingVertical: hp(1),
                    marginRight: wp(2.8),
                  }}
                />
              </Bg_view>
              <Bg_view style={{alignItems: 'flex-end'}}>
                <Fr_text
                  size={wp(3.5)}
                  style={{maxWidth: wp(50)}}
                  opacity={0.8}>{`${Number(value * rate || 0).toFixed(
                  2,
                )} NGN`}</Fr_text>
              </Bg_view>
            </Bg_view>
            <Bg_view style={{justifyContent: 'space-between'}} horizontal>
              <Fr_text opacity={0.8} size={wp(3.5)} color="#333">
                {format_quick_time(created || Date.now())}
              </Fr_text>
              <Bg_view no_bg horizontal style={{alignItems: 'center'}}>
                <Icon icon={icon} />
                <Fr_text bold size={wp(4.5)} style={{maxWidth: wp(50)}}>
                  {` ${Number(value).toFixed(2)}`}
                </Fr_text>
              </Bg_view>
            </Bg_view>
          </View>
        </TouchableNativeFeedback>
        {show_btn ? (
          <Bg_view style={{alignItems: 'center'}}>
            <Bg_view horizontal>
              <Text_btn accent text="Offers" action={this.offers} />
              <Text_btn
                accent
                text="Remove sale"
                action={this.remove_sale}
                style={{marginHorizontal: wp(1.4)}}
              />
            </Bg_view>
            <Line />
          </Bg_view>
        ) : null}

        <Cool_modal ref={top_up_modal => (this.top_up_modal = top_up_modal)}>
          <Topup
            currency={to_currency}
            default_value={rate * value - user.wallet[to_currency]}
            decorator={this.top_up_modal && this.top_up_modal.toggle_show_modal}
          />
        </Cool_modal>

        <Cool_modal
          ref={proceed_to_purchase =>
            (this.proceed_to_purchase = proceed_to_purchase)
          }>
          <Proceed_to_purchase
            onsale={onsale}
            wallet={user.wallet}
            decorator={
              this.proceed_to_purchase &&
              this.proceed_to_purchase.toggle_show_modal
            }
            remove={this.remove}
          />
        </Cool_modal>
      </Bg_view>
    );
  };
}

export default Onsale_currency;
