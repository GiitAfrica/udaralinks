import React from 'react';
import {
  StatusBar,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Line from '../Components/line';
import Small_btn from '../Components/small_button';
import {hp, wp} from '../utils/dimensions';
import Cool_modal from '../Components/cool_modal';
import {Admin_id, emitter, User} from '../../Udara';
import Amount_to_sell from '../Components/amount_to_sell';
import Topup from '../Components/topup';
import Withdraw from '../Components/withdraw';
import Transactions from '../Components/transactions';
import Currencies from '../Components/currencies';
import Buy from '../Components/buy';
import Paycheck from '../Components/paycheck';

let alphabetic_naming = new Object();
let currencies = new Array();

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      current_index: 0,
      currency_full: {
        alphabetic_name: 'USD',
        icon: 'dollar_icon.png',
        flag: 'usa_flag_rectangle.png',
      },
    };
  }

  componentDidMount = async () => {};

  topup = () => this.topup_modal?.toggle_show_modal();

  withdraw = () => this.withdraw_modal?.toggle_show_modal();

  sell = () => this.cool_modal_sell_value?.toggle_show_modal();

  buy = () => this.cool_modal_buy?.toggle_show_modal();

  format_balance = balance => {
    return Number(balance).toFixed(2);
  };

  wallet_balance = (balance, profits) => {
    return (
      <Bg_view
        no_bg
        horizontal
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: wp(5.6),
          width: wp(),
        }}>
        <Bg_view no_bg style={{marginLeft: wp(5.6)}}>
          <Fr_text
            color="#fff"
            style={{marginTop: hp(2.8)}}
            size={wp(4)}
            bold="600">
            Total balance
          </Fr_text>
          <Fr_text color="#fff" bold="900" size={wp(6.5)}>
            {`${this.format_balance(balance)} NGN`}
          </Fr_text>
          <Bg_view no_bg>
            <Fr_text
              bold={this.user._id === Admin_id && profits && '600'}
              color="#fff"
              capitalise>
              {this.user._id === Admin_id && profits
                ? 'Admin Balance: '
                : this.user.username}
            </Fr_text>
            {this.user._id === Admin_id && profits ? (
              <Fr_text
                size={wp(5)}
                color="#fff"
                bold>{`${profits} NGN`}</Fr_text>
            ) : null}
          </Bg_view>
        </Bg_view>
        <Icon
          icon="udara_wallet_icon.png"
          style={{height: wp(20), width: wp(20)}}
        />
      </Bg_view>
    );
  };

  set_sell_value = values => this.setState({...values});

  toggle_to_currency = () => this.to_currency_modal?.toggle_show_modal();

  paycheck = () => this.paycheck_modal?.toggle_show_modal();

  set_to_currency = (to_currency, to_full) => {
    this.setState(
      {to_currency, to_full},
      this.to_currency_modal.toggle_show_modal,
    );
  };

  refresh_txs = () => {
    this.setState({refreshing_txs: true}, () =>
      this.setState({refreshing_txs: false}),
    );
  };

  set_value = value => this.setState({value});

  set_rate = rate => this.setState({rate});

  set_currency = (currency, currency_full) =>
    this.setState({currency, currency_full});

  render = () => {
    let {navigation} = this.props;
    let {value, refreshing_txs, rate, currency_full} = this.state;

    return (
      <User.Consumer>
        {user => {
          this.user = user;
          this.wallet = user.wallet;

          return (
            <Bg_view flex>
              <StatusBar backgroundColor="#240B28" barStyle="light-content" />
              <ScrollView showsVerticalScrollIndicator={false}>
                <Bg_view flex>
                  <Bg_view
                    style={{
                      minHeight: hp(30),
                      maxHeight: hp(42),
                      borderBottomRightRadius: wp(20),
                    }}
                    background_color="#240B28">
                    <Icon
                      style={{
                        height: hp(5),
                        width: wp(50),
                        transform: [{rotate: '90deg'}],
                      }}
                      icon={require('../../android/app/src/main/assets/Icons/master_card_circles.png')}
                    />

                    <TouchableWithoutFeedback
                      onPress={() => emitter.emit('refresh_wallet')}>
                      <View
                        style={{
                          backgroundColor: '#fff',
                          alignSelf: 'flex-end',
                          borderRadius: wp(7.5),
                          width: wp(7.5),
                          height: wp(7.5),
                          marginRight: wp(7.5),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon icon="refresh.png" />
                      </View>
                    </TouchableWithoutFeedback>

                    {this.wallet_balance(
                      this.wallet.naira,
                      this.wallet.profits,
                    )}

                    <Bg_view
                      no_bg
                      horizontal
                      style={{
                        justifyContent: 'space-evenly',
                        paddingTop: hp(user._id === Admin_id ? 1 : 2),
                      }}>
                      <TouchableWithoutFeedback onPress={this.topup}>
                        <View
                          style={{
                            padding: wp(5.6),
                            alignItems: 'center',
                            paddingHorizontal: wp(2.8),
                          }}>
                          <Icon
                            icon={require('../../android/app/src/main/assets/Icons/send_white_icon.png')}
                            style={{height: wp(10), width: wp(10)}}
                          />
                          <Fr_text color="#fff">Top-up</Fr_text>
                        </View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={this.withdraw}>
                        <View
                          style={{
                            padding: wp(5.6),
                            alignItems: 'center',
                            paddingHorizontal: wp(2.8),
                          }}>
                          <Icon
                            icon={require('../../android/app/src/main/assets/Icons/receive_white_icon.png')}
                            style={{height: wp(10), width: wp(10)}}
                          />
                          <Fr_text color="#fff">Withdraw</Fr_text>
                        </View>
                      </TouchableWithoutFeedback>
                      {user._id === Admin_id ? (
                        <TouchableWithoutFeedback onPress={this.paycheck}>
                          <View
                            style={{
                              padding: wp(5.6),
                              alignItems: 'center',
                              paddingHorizontal: wp(2.8),
                            }}>
                            <Icon
                              icon={require('../../android/app/src/main/assets/Icons/receive_white_icon.png')}
                              style={{height: wp(10), width: wp(10)}}
                            />
                            <Fr_text color="#fff">Paycheck</Fr_text>
                          </View>
                        </TouchableWithoutFeedback>
                      ) : null}
                    </Bg_view>
                  </Bg_view>
                  <Bg_view
                    style={{
                      elevation: 10,
                      shadowColor: '#000',
                      borderRadius: wp(4),
                      margin: wp(2.8),
                    }}>
                    <Bg_view
                      horizontal
                      style={{
                        justifyContent: 'space-between',
                        paddingTop: wp(2.8),
                        paddingBottom: hp(1.4),
                      }}>
                      <TouchableWithoutFeedback onPress={this.sell}>
                        <View
                          style={{
                            paddingTop: hp(4),
                            paddingHorizontal: wp(5.6),
                          }}>
                          <Fr_text opacity={0.8}>
                            {currency_full.alphabetic_name}
                          </Fr_text>
                          <Fr_text bold size={wp(4.5)}>{`${value || 0} ${
                            currency_full?.alphabetic_name
                          }`}</Fr_text>
                        </View>
                      </TouchableWithoutFeedback>
                      <Icon
                        icon={require('../../android/app/src/main/assets/Icons/currency_convert_icon.png')}
                        style={{height: wp(13), width: wp(13)}}
                      />
                      <TouchableWithoutFeedback
                        onPress={this.toggle_to_currency}>
                        <View
                          style={{
                            paddingTop: hp(4),
                            paddingHorizontal: wp(5.6),
                          }}>
                          <Fr_text opacity={0.8}>{'NGN'}</Fr_text>
                          <Fr_text bold size={wp(4.5)}>
                            {`${
                              Number((value || 0) * (rate || 0)).toFixed(2) || 0
                            } ${'NGN'}`}
                          </Fr_text>
                        </View>
                      </TouchableWithoutFeedback>
                    </Bg_view>
                    <Bg_view
                      horizontal
                      style={{
                        paddingHorizontal: wp(2.8),
                        alignItems: 'center',
                      }}>
                      <Small_btn title="sell" action={this.sell} />
                      <Small_btn title="buy" action={this.buy} inverted />
                    </Bg_view>
                  </Bg_view>
                  <Line />
                  {refreshing_txs ? null : (
                    <Transactions
                      user={user}
                      ref={transactions => (this.transactions = transactions)}
                      refresh={this.refresh_txs}
                      navigation={navigation}
                    />
                  )}
                </Bg_view>
              </ScrollView>

              <Cool_modal
                ref={paycheck_modal => (this.paycheck_modal = paycheck_modal)}>
                <Withdraw
                  wallet={this.wallet}
                  user={user}
                  navigation={navigation}
                  paycheck
                  decorator={() => this.paycheck_modal?.toggle_show_modal()}
                />
              </Cool_modal>

              <Cool_modal
                ref={cool_modal_buy => (this.cool_modal_buy = cool_modal_buy)}>
                <Buy
                  user={user}
                  default_value={{currency: currency_full, value, rate}}
                  close_modal={this.buy}
                  navigation={navigation}
                />
              </Cool_modal>
              <Cool_modal ref={topup_modal => (this.topup_modal = topup_modal)}>
                <Topup
                  default_value={value}
                  user={user}
                  navigation={navigation}
                  decorator={() => this.topup_modal?.toggle_show_modal()}
                />
              </Cool_modal>

              <Cool_modal
                ref={withdraw_modal => (this.withdraw_modal = withdraw_modal)}>
                <Withdraw
                  wallet={this.wallet}
                  user={user}
                  navigation={navigation}
                  decorator={() => this.withdraw_modal?.toggle_show_modal()}
                />
              </Cool_modal>

              <Cool_modal
                ref={to_currency_modal =>
                  (this.to_currency_modal = to_currency_modal)
                }>
                <Currencies
                  select={this.set_to_currency}
                  close_modal={() =>
                    this.to_currency_modal?.toggle_show_modal()
                  }
                />
              </Cool_modal>

              <Cool_modal
                ref={cool_modal_sell_value =>
                  (this.cool_modal_sell_value = cool_modal_sell_value)
                }>
                <Amount_to_sell
                  ref={amount_to_sell => (this.amount_to_sell = amount_to_sell)}
                  user={user}
                  default_value={{currency: currency_full, value, rate}}
                  set_rate_wallet={this.set_rate}
                  set_value_wallet={this.set_value}
                  set_currency_wallet={this.set_currency}
                  close_modal={this.sell}
                  navigation={navigation}
                />
              </Cool_modal>
            </Bg_view>
          );
        }}
      </User.Consumer>
    );
  };
}

export default Wallet;
export {alphabetic_naming, currencies};
