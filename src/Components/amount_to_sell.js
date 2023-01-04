import React from 'react';
import {TextInput, TouchableNativeFeedback, View} from 'react-native';
import {Admin_id} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Currencies from './currencies';
import Fr_text from './Fr_text';
import Stretched_button from './Stretched_button';
import Text_btn from './Text_btn';

class Amount_to_sell extends React.Component {
  constructor(props) {
    super(props);

    let {default_value} = this.props;
    let {currency, value, rate} = default_value || {
      currency: {
        name: 'dollar',
        icon: 'dollar_icon.png',
        flag: 'usa_flag_rectangle.png',
        alphabetic_name: 'USD',
      },
      value: 0,
      rate: 0,
    };

    this.state = {
      value,
      rate,
      currency: currency.name,
      currency_full: currency,
    };
  }

  set_value = value => {
    let {set_value_wallet} = this.props;

    this.setState({value});
    set_value_wallet && set_value_wallet(value);
  };

  set_rate = rate => {
    let {set_rate_wallet} = this.props;
    this.setState({rate});
    set_rate_wallet && set_rate_wallet(rate);
  };

  set_currency = (currency, currency_full) => {
    let {set_currency_wallet} = this.props;
    this.setState({currency, currency_full});
    set_currency_wallet && set_currency_wallet(currency, currency_full);
  };

  sell = () => {
    let {navigation, user} = this.props;
    let {value, rate, currency_full, currency} = this.state;

    navigation.navigate('sell', {
      value: String(value),
      rate,
      user,
      currency,
      wallet: user.wallet,
      currency_full,
    });
  };

  render = () => {
    let {user, navigation} = this.props;
    let {rate, value, currency_full} = this.state;

    return (
      <Bg_view
        style={{
          elevation: 10,
          margin: wp(5.6),
          padding: wp(2.8),
          shadowColor: '#000',
          borderRadius: wp(4),
        }}>
        <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
          Amount to sell
        </Fr_text>
        <Bg_view horizontal style={{alignItems: 'center'}}>
          <TextInput
            placeholder="Enter amount"
            value={String(value || '')}
            keyboardType="phone-pad"
            onChangeText={this.set_value}
            style={{
              flex: 1,
              borderRadius: wp(1),
              elevation: 5,
              padding: wp(4),
              fontSize: wp(5),
              shadowColor: '#ccc',
              color: '#000',
            }}
          />
          <TouchableNativeFeedback
            onPress={() =>
              this.cool_modal && this.cool_modal.toggle_show_modal()
            }>
            <View>
              <Bg_view
                horizontal
                style={{
                  elevation: 5,
                  shadowColor: '#000',
                  borderRadius: wp(1),
                  height: hp(7.5),
                  padding: wp(2.8),
                  marginLeft: wp(2.8),
                }}>
                <Fr_text>{currency_full.alphabetic_name}</Fr_text>
              </Bg_view>
            </View>
          </TouchableNativeFeedback>
        </Bg_view>

        <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
          Rate
        </Fr_text>
        <Bg_view horizontal style={{alignItems: 'center'}}>
          <TextInput
            placeholder="Rate"
            value={String(rate || '')}
            keyboardType="phone-pad"
            onChangeText={this.set_rate}
            style={{
              flex: 1,
              borderRadius: wp(1),
              elevation: 5,
              padding: wp(4),
              fontSize: wp(5),
              shadowColor: '#ccc',
              color: '#000',
            }}
          />
          <View>
            <Bg_view
              horizontal
              style={{
                elevation: 5,
                shadowColor: '#000',
                borderRadius: wp(1),
                height: hp(7.5),
                padding: wp(2.8),
                marginLeft: wp(2.8),
              }}>
              <Fr_text>NGN</Fr_text>
            </Bg_view>
          </View>
        </Bg_view>

        <Stretched_button
          disabled={
            !value ||
            Number(value) <= 0 ||
            !rate ||
            Number(rate) <= 0 ||
            (value > 500 && user.status !== 'verified')
          }
          title="continue"
          action={this.sell}
        />

        {value > 500 && user.status !== 'verified' && user._id !== Admin_id ? (
          <Bg_view style={{alignItems: 'center'}}>
            <Fr_text italic centralise color="red">
              Transactions have limited value as an unverified user account.
            </Fr_text>

            <Text_btn
              bold
              capitalise
              text="verify account"
              action={() =>
                navigation.navigate('account_verification', {user: user._id})
              }
            />
          </Bg_view>
        ) : null}

        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
          <Currencies
            select={this.set_currency}
            exclude={new Array(currency_full.name, 'naira')}
            close_modal={this.cool_modal?.toggle_show_modal}
          />
        </Cool_modal>
      </Bg_view>
    );
  };
}

export default Amount_to_sell;
