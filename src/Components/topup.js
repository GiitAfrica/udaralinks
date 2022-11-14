import React from 'react';
import {TextInput, View} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Currencies from './currencies';
import Fr_text from './Fr_text';
import Stretched_button from './Stretched_button';
import Icon from './Icon';

class Topup extends React.Component {
  constructor(props) {
    super(props);

    let {currency, default_value} = this.props;
    this.state = {
      currency: currency || 'naira',
      value: String(default_value) || '',
      valid: !!default_value,
    };
  }

  handle_redirect = data => console.log(data);

  set_currency = (currency, curr_full) => {
    this.setState({currency, curr_full});

    this.currency_modal && this.currency_modal.toggle_show_modal();
  };

  set_value = value =>
    this.setState({value, valid: /^[0-9]{1,}\.?[0-9]{0,}$/.test(value)});

  topup = () => {
    this.setState({loading: true});
    let {decorator, navigation, user} = this.props;
    let {value} = this.state;
    if (!Number(value)) {
      toast('Invalid transaction value');
      return this.setState({loading: false});
    }

    navigation.push('generate_account_number', {value, user});
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
          Amount to topup
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
              color: '#000',
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
              <Icon
                icon={require('../assets/Icons/nigeria_flag_rectangle.png')}
              />
              <Fr_text style={{marginLeft: wp(1.4)}}>{'NGN'}</Fr_text>
            </Bg_view>
          </View>
        </Bg_view>

        <Stretched_button
          disabled={!valid}
          loading={loading}
          title="Generate Account Number"
          action={this.topup}
        />

        <Cool_modal
          ref={currency_modal => (this.currency_modal = currency_modal)}>
          <Currencies
            select={this.set_currency}
            close_modal={
              this.currency_modal && this.currency_modal.toggle_show_modal
            }
          />
        </Cool_modal>
      </Bg_view>
    );
  };
}

export default Topup;
