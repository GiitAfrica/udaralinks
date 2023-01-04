import React from 'react';
import {
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Admin_id, emitter, User} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Listfooter from '../Components/listfooter';
import Payment from '../Components/payment';
import {hp, wp} from '../utils/dimensions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {new_txs: new Array()};
  }

  componentDidMount = () => {
    this.new_transaction = tx => {
      let {new_txs} = this.state;
      new_txs.push(tx._id);
      this.setState({new_txs});
    };

    this.transaction_mounted = tx_id => {
      let {new_txs} = this.state;
      if (!new_txs.length) return;

      new_txs = new_txs.filter(tx => tx !== tx_id);
      this.setState({new_txs: new Array(...new_txs)});
    };

    emitter.listen('new_transaction', this.new_transaction);
    emitter.listen('transaction_mounted', this.transaction_mounted);
  };

  componentWillUnmount = () => {
    emitter.remove_listener('transaction_mounted', this.transaction_mounted);
    emitter.remove_listener('new_transaction', this.new_transaction);
  };

  payments = new Array(
    {
      title: 'Pay a Bill',
      icon: 'paybill_icon.png',
      text: 'Look after your necessities',
    },
    {
      title: 'Buy Airtime',
      text: 'Easy phone recharge',
      icon: 'paybill_icon.png',
    },
  );

  render() {
    let {navigation} = this.props;
    let {new_txs} = this.state;

    return (
      <User.Consumer>
        {user => {
          let {wallet, username, _id} = user;
          let {fav_currency, profits} = wallet;

          return (
            <Bg_view flex>
              <ScrollView showsVerticalScrollIndicator={false}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <Bg_view flex>
                  <Bg_view
                    no_bg
                    horizontal
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: wp(2.8),
                    }}>
                    <Icon
                      icon={require('../../android/app/src/main/assets/Icons/acccount_orange_icon.png')}
                      action={() => navigation.navigate('account')}
                    />
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Fr_text capitalise size={wp(4.5)}>
                        {username}
                      </Fr_text>
                    </View>
                    {new_txs.length ? (
                      <Icon
                        icon={require('../../android/app/src/main/assets/Icons/notification_icon.png')}
                        action={() => {
                          navigation.navigate('wallet'),
                            this.setState({new_txs: new Array()});
                        }}
                      />
                    ) : (
                      <View style={{width: wp(5)}} />
                    )}

                    {user._id === Admin_id ? (
                      <Icon
                        icon={require('../../android/app/src/main/assets/Icons/chat_send_icon.png')}
                        action={() => navigation.navigate('admin_messages')}
                      />
                    ) : null}
                  </Bg_view>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate('wallet', {currency: 'naira'})
                    }>
                    <View>
                      <Bg_view
                        style={{
                          height: wp(52.5),
                          backgroundColor: '#28100B',
                          marginHorizontal: wp(5.6),
                          borderRadius: wp(5.6),
                        }}>
                        <Bg_view
                          style={{
                            justifyContent: 'space-between',
                            padding: wp(4),
                          }}
                          horizontal
                          no_bg>
                          <Bg_view no_bg>
                            <Fr_text color="#fff">Udara Wallet</Fr_text>
                            <Fr_text
                              color="#fff"
                              style={{marginTop: hp(2.8)}}
                              size={wp(4)}
                              bold="600">
                              Total balance
                            </Fr_text>
                            <Fr_text color="#fff" bold="900" size={wp(6.5)}>
                              {`${wallet.naira.toFixed(2)} NGN`}
                            </Fr_text>
                            <Bg_view no_bg>
                              <Fr_text
                                bold={_id === Admin_id && profits && '600'}
                                color="#fff"
                                capitalise>
                                {_id === Admin_id && profits
                                  ? 'admin balance'
                                  : username}
                              </Fr_text>
                              {_id === Admin_id && profits ? (
                                <Fr_text bold size={wp(5)} color="#fff">
                                  {`${profits} NGN`}
                                </Fr_text>
                              ) : null}
                            </Bg_view>
                          </Bg_view>
                          <Icon
                            style={{
                              marginTop: hp(5.6),
                              height: wp(20),
                              width: wp(15),
                              borderRadius: wp(2.8),
                            }}
                            icon={
                              fav_currency === 'naira'
                                ? 'naira_home_page.png'
                                : `${fav_currency}_icon.png`
                            }
                          />
                        </Bg_view>
                        <Bg_view no_bg style={{alignSelf: 'flex-end'}}>
                          <Icon
                            style={{
                              marginRight: wp(5),
                              marginTop: hp(0.2),
                              height: hp(7),
                              width: wp(50),
                            }}
                            icon={require('../../android/app/src/main/assets/Icons/master_card_circles.png')}
                          />
                        </Bg_view>
                      </Bg_view>
                    </View>
                  </TouchableWithoutFeedback>
                  <Bg_view style={{paddingHorizontal: wp(5.6)}}>
                    <Bg_view no_bg style={{marginTop: hp(1)}}>
                      <Fr_text accent bold size={wp(5.6)}>
                        Payments
                      </Fr_text>
                      <Bg_view no_bg style={{padding: wp(2.8)}}>
                        {this.payments.map(payment => (
                          <Payment payment={payment} key={payment.title} />
                        ))}
                      </Bg_view>
                    </Bg_view>
                  </Bg_view>

                  <Listfooter />
                </Bg_view>
              </ScrollView>
            </Bg_view>
          );
        }}
      </User.Consumer>
    );
  }
}

export default Home;
