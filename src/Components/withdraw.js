import React from 'react';
import {TextInput, View, TouchableNativeFeedback} from 'react-native';
import {emitter} from '../../Udara';
import {alphabetic_naming} from '../Screens/Wallet';
import {hp, wp} from '../utils/dimensions';
import toast from '../utils/toast';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Currencies from './currencies';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Stretched_button from './Stretched_button';

class Withdraw extends React.Component {
  constructor(props) {
    super(props);

    let {currency, default_value} = this.props;
    this.state = {
      currency: currency || 'naira',
      value: default_value ? String(default_value) : '',
    };
  }

  set_currency = currency => {
    this.setState({currency});

    this.currency_modal && this.currency_modal.toggle_show_modal();
  };

  set_value = value =>
    this.setState({
      value,
      valid:
        Number(value) &&
        Number(value) > 0 &&
        Number(value) <= this.props.wallet.naira,
    });

  withdraw = () => {
    this.setState({loading: true});
    let {decorator} = this.props;
    let {value, currency} = this.state;
    if (!Number(value)) {
      toast('Invalid transactio value');
      return this.setState({loading: false});
    }

    emitter.emit('withdraw', {value: Number(value), currency});

    decorator && decorator();
  };

  render = () => {
    let {value, valid, loading} = this.state;

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
          Amount to withdraw
        </Fr_text>
        <Bg_view
          horizontal
          style={{
            alignItems: 'center',
            borderRadius: wp(1.4),
            shadowColor: '#000',
            elevation: 5,
            margin: wp(2.8),
          }}>
          <TextInput
            placeholder="Enter amount"
            autoFocus
            value={value}
            keyboardType="phone-pad"
            onChangeText={this.set_value}
            style={{
              flex: 1,
              borderRadius: wp(1),
              padding: wp(2.8),
              fontSize: wp(5),
            }}
          />
          <View>
            <Bg_view
              horizontal
              style={{
                borderRadius: wp(1),
                height: hp(7.5),
                padding: wp(2.8),
                borderLeftColor: '#ccc',
                borderLeftWidth: 1,
              }}>
              <Icon icon={'nigeria_flag_rectangle.png'} />
              <Fr_text style={{marginLeft: wp(1.4)}}>{'NGN'}</Fr_text>
            </Bg_view>
          </View>
        </Bg_view>
        <Stretched_button
          disabled={!valid}
          loading={loading}
          title="continue"
          action={this.withdraw}
        />
      </Bg_view>
    );
  };
}

export default Withdraw;
