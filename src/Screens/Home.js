import React from 'react';
import {ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Currency from '../Components/currency';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Listfooter from '../Components/listfooter';
import {hp, wp} from '../utils/dimensions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  currencies = new Array(
    {
      name: 'euro',
      icon: require('./../Assets/Icons/euro_icon.png'),
      balances: {ngn: 0, base: 0},
    },
    {
      name: 'pound',
      icon: require('./../Assets/Icons/pound_icon.png'),
      balances: {ngn: 0, base: 0},
    },
    {
      name: 'dollar',
      icon: require('./../Assets/Icons/dollar_icon.png'),
      balances: {ngn: 0, base: 0},
    },
  );

  payment_types = new Array(
    {
      title: 'bank\ntransfer',
      icon: require('./../Assets/Icons/bank_icon.png'),
    },
    {
      title: 'online\nwallet',
      icon: require('./../Assets/Icons/wallet_icon.png'),
    },
    {
      title: 'bank\ndeposit',
      icon: require('./../Assets/Icons/bank_deposit_icon.png'),
    },
  );

  render() {
    return (
      <ScrollView showHorizontalScrollIndicator={false}>
        <Bg_view flex background_color="#eee">
          <Bg_view
            no_bg
            horizontal
            style={{justifyContent: 'space-between', padding: wp(5.6)}}>
            <Icon
              icon={require('./../Assets/Icons/Acccount_orange_icon.png')}
            />
            <Fr_text size={wp(4.5)}>Paul Smith</Fr_text>
            <Icon icon={require('./../Assets/Icons/notification_icon.png')} />
          </Bg_view>
          <Bg_view
            style={{
              height: wp(50),
              backgroundColor: 'purple',
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
                <Fr_text color="#fff" bold size={wp(7.5)}>
                  1,000,000 NGN
                </Fr_text>
                <Fr_text color="#fff" capitalise>
                  paul smith
                </Fr_text>
              </Bg_view>
              <Icon
                style={{marginTop: hp(5.6)}}
                icon={require('./../Assets/Icons/naira_home_page.png')}
              />
            </Bg_view>
            <Bg_view no_bg style={{alignSelf: 'flex-end'}}>
              <Icon
                style={{marginTop: hp(1.0), marginRight: wp(5.6)}}
                icon={require('./../Assets/Icons/master_card_circles.png')}
              />
            </Bg_view>
          </Bg_view>

          <Bg_view
            no_bg
            style={{justifyContent: 'space-evenly', marginVertical: hp(4)}}
            horizontal>
            {this.currencies.map(currency => (
              <Currency currency={currency} key={currency.name} />
            ))}
          </Bg_view>
          <Bg_view
            style={{paddingHorizontal: wp(5.6), marginTop: hp(1.4)}}
            no_bg>
            <Bg_view no_bg>
              <Fr_text accent bold size={wp(5.6)}>
                Payments
              </Fr_text>
              <Bg_view no_bg style={{padding: wp(2.8)}}>
                <Bg_view
                  horizontal
                  style={{
                    alignItems: 'center',
                    padding: wp(2.8),
                    borderRadius: wp(4),
                  }}>
                  <Icon
                    style={{height: wp(10)}}
                    icon={require('./../Assets/Icons/paybill_icon.png')}
                  />
                  <Bg_view flex style={{marginLeft: wp(2.8)}}>
                    <Fr_text bold size={wp(4.5)}>
                      Pay a Bill
                    </Fr_text>
                    <Fr_text opacity={0.8}>Look after your necesities</Fr_text>
                  </Bg_view>
                  <Icon
                    icon={require('./../Assets/Icons/forward_arrow_icon.png')}
                    style={{marginLeft: wp(2.8)}}
                  />
                </Bg_view>
              </Bg_view>
            </Bg_view>
            <Bg_view no_bg>
              <Fr_text accent bold size={wp(5.6)}>
                Buy/Sell Currency
              </Fr_text>
              <Bg_view
                no_bg
                style={{justifyContent: 'space-evenly', marginVertical: hp(4)}}
                horizontal>
                {this.payment_types.map(payment_type => (
                  <Bg_view
                    key={payment_type.title}
                    style={{
                      paddingLeft: wp(4),
                      paddingRight: wp(5.6),
                      paddingVertical: hp(1.4),
                      alignItems: 'flex-start',
                      borderRadius: wp(4),
                      minWidth: wp(24),
                    }}>
                    <Icon icon={payment_type.icon} />
                    <Fr_text
                      capitalise
                      size={wp(4)}
                      style={{marginVertical: hp(0.7)}}>
                      {payment_type.title}
                    </Fr_text>
                  </Bg_view>
                ))}
              </Bg_view>
              <Bg_view
                style={{
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  padding: hp(1.4),
                  borderRadius: wp(4),
                }}
                horizontal>
                <Bg_view no_bg />
                <Fr_text size={wp(4)}>All payment methods</Fr_text>
                <Icon
                  icon={require('./../Assets/Icons/forward_arrow_icon.png')}
                  style={{marginLeft: wp(2.8)}}
                />
              </Bg_view>
            </Bg_view>
          </Bg_view>
          <Listfooter />
        </Bg_view>
      </ScrollView>
    );
  }
}

export default Home;
