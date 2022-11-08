import React from 'react';
import {TextInput, View} from 'react-native';
import {emitter} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import Bank_account from './bank_account';
import Bank_accounts from './bank_accounts';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Stretched_button from './Stretched_button';
import Text_btn from './Text_btn';

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

  set_bank_account = bank_account =>
    this.setState({bank_account}, () =>
      this.bank_accounts?.toggle_show_modal(),
    );

  withdraw = async () => {
    this.setState({loading: true});
    let {decorator, user} = this.props;
    let {value, currency, bank_account} = this.state;
    if (!Number(value)) {
      toast('Invalid transaction value');
      return this.setState({loading: false});
    }

    let result = await post_request('withdraw', {
      user: user._id,
      wallet: user.wallet._id,
      bank_account,
      amount: value,
    });

    if (result && result.ok)
      emitter.emit('withdraw', {value: Number(value), currency});
    else toast('Err, Something went wrong.');

    decorator && decorator();
  };

  render = () => {
    let {user} = this.props;
    let {value, valid, bank_account, loading} = this.state;

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
              <Icon
                icon={require('../assets/Icons/nigeria_flag_rectangle.png')}
              />
              <Fr_text style={{marginLeft: wp(1.4)}}>{'NGN'}</Fr_text>
            </Bg_view>
          </View>
        </Bg_view>

        {bank_account ? (
          <Bank_account
            account={bank_account}
            action={() => this.bank_accounts?.toggle_show_modal()}
          />
        ) : (
          <Text_btn
            text="Select Bank Account"
            centralise
            action={() => this.bank_accounts?.toggle_show_modal()}
          />
        )}
        <Stretched_button
          disabled={!valid || !bank_account}
          loading={loading}
          title="continue"
          action={this.withdraw}
        />

        <Cool_modal ref={bank_accounts => (this.bank_accounts = bank_accounts)}>
          <Bank_accounts
            user={user}
            action={this.set_bank_account}
            toggle={() => this.bank_accounts?.toggle_show_modal()}
          />
        </Cool_modal>
      </Bg_view>
    );
  };
}

export default Withdraw;
