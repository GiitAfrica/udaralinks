import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {TextInput, TouchableNativeFeedback, View} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Currencies from './currencies';
import Fr_text from './Fr_text';
import Stretched_button from './Stretched_button';

class Buy extends React.Component {
  constructor(props) {
    super(props);

    let {default_value} = this.props;
    let {currency, value, rate} = default_value || {
      currency: {
        name: 'dollar',
        icon: 'dollar_icon.png',
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

  componentDidMount = async () => {
    let {value} = this.state;
    if (!value) {
      let buy_filter = await AsyncStorage.getItem('buy_filter');

      if (buy_filter) {
        buy_filter = JSON.parse(buy_filter);
        this.setState({...buy_filter});
      }
    }
  };

  set_value = value => this.setState({value});

  set_rate = rate => this.setState({rate});

  set_currency = (currency, currency_full) =>
    this.setState({currency, currency_full});

  buy = async () => {
    this.setState({loading: true});
    let {navigation, close_modal, set_filter} = this.props;
    let {value, currency_full} = this.state;

    let buy_filter = {
      value,
      currency_full,
    };
    await AsyncStorage.setItem('buy_filter', JSON.stringify(buy_filter));

    set_filter
      ? set_filter(buy_filter)
      : navigation.navigate('market', {buy_filter});
    close_modal && close_modal();
  };

  render() {
    let {value, currency_full} = this.state;

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
          Buy Filter
        </Fr_text>
        <Bg_view horizontal style={{alignItems: 'center'}}>
          <TextInput
            placeholder="Enter amount"
            value={value}
            keyboardType="phone-pad"
            onChangeText={this.set_value}
            style={{
              flex: 1,
              borderRadius: wp(1),
              elevation: 5,
              padding: wp(4),
              fontSize: wp(5),
              color: '#000',
              shadowColor: '#ccc',
            }}
          />
          <TouchableNativeFeedback
            onPress={() => this.cool_modal?.toggle_show_modal()}>
            <View>
              <Bg_view
                horizontal
                shadowed
                style={{
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

        <Stretched_button
          disabled={!value || Number(value) <= 0}
          title="continue"
          action={this.buy}
        />
        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
          <Currencies
            select={this.set_currency}
            exclude={new Array('naira', currency_full.name)}
            close_modal={this.cool_modal?.toggle_show_modal}
          />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Buy;
