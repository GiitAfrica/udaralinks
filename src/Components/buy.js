import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
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

  componentDidMount = async () => {};

  set_currency = (currency, currency_full) =>
    this.setState({currency, currency_full});

  buy = async () => {
    this.setState({loading: true});

    let {currency_full} = this.state;

    this.props.navigation.navigate('market', {currency: currency_full});
  };

  render() {
    let {currency_full} = this.state;

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
          Select Currency
        </Fr_text>
        <Bg_view style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableNativeFeedback
            onPress={() => this.cool_modal?.toggle_show_modal()}>
            <View>
              <Bg_view
                shadowed
                style={{
                  borderRadius: wp(1),
                  height: hp(7.5),
                  padding: wp(2.8),
                  marginLeft: wp(2.8),
                  width: wp(70),
                }}>
                <Fr_text centralise>{currency_full.alphabetic_name}</Fr_text>
              </Bg_view>
            </View>
          </TouchableNativeFeedback>
        </Bg_view>

        <Stretched_button title="Proceed to market" action={this.buy} />
        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
          <Currencies
            select={this.set_currency}
            exclude={new Array('naira', currency_full.name)}
            close_modal={() => this.cool_modal?.toggle_show_modal()}
          />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Buy;
