import React from 'react';
import {
  StatusBar,
  View,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Line from '../Components/line';
import Loadindicator from '../Components/load_indicator';
import Small_btn from '../Components/small_button';
import Transaction from '../Components/transaction';
import {hp, wp} from '../utils/dimensions';
import Cool_modal from '../Components/cool_modal';
import Select_currency from '../Components/select_currency';
import List_empty from '../Components/list_empty';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from_currency: 'USD Dollar',
      to_currency: 'NGN Naira',
    };
  }

  componentDidMount = () => {
    this.setState({
      transactions: new Array(
        {
          _id: 1,
          from_currency: 'USD',
          to_currency: 'Naira',
          from_value: '100.00',
          to_value: '58,000.00',
          status: 'completed',
        },
        {
          _id: 2,
          from_currency: 'Pounds',
          to_currency: 'Naira',
          from_value: '100.00',
          to_value: '58,000.00',
          status: 'pending',
        },
      ),
    });
  };

  send = () => {};

  receive = () => {};

  convert = () => {};

  set_from_currency = from_currency => this.setState({from_currency});

  set_to_currency = to_currency => this.setState({to_currency});

  render = () => {
    let {transactions, from_currency, to_currency} = this.state;

    return (
      <Bg_view flex>
        <StatusBar backgroundColor="purple" barStyle="light-content" />
        <ScrollView showVerticalScrollIndicator={false}>
          <Bg_view flex>
            <Bg_view
              style={{minHeight: hp(45), borderBottomRightRadius: wp(20)}}
              background_color="purple">
              <Icon
                style={{marginTop: hp(5.6)}}
                icon={require('./../Assets/Icons/master_card_circles.png')}
              />
              <Bg_view
                no_bg
                horizontal
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: wp(5.6),
                }}>
                <Bg_view no_bg style={{marginLeft: wp(5.6)}}>
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
                  icon={require('./../Assets/Icons/udara_wallet_icon.png')}
                />
              </Bg_view>
              <Bg_view
                no_bg
                horizontal
                style={{
                  justifyContent: 'space-evenly',
                  paddingTop: hp(2),
                }}>
                <TouchableNativeFeedback onPress={this.send}>
                  <View
                    style={{
                      padding: wp(5.6),
                      alignItems: 'center',
                      paddingHorizontal: wp(2.8),
                    }}>
                    <Icon
                      icon={require('./../Assets/Icons/receive_white_icon.png')}
                    />
                    <Fr_text color="#fff">Send</Fr_text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.receive}>
                  <View
                    style={{
                      padding: wp(5.6),
                      alignItems: 'center',
                      paddingHorizontal: wp(2.8),
                    }}>
                    <Icon
                      icon={require('./../Assets/Icons/send_white_icon.png')}
                    />
                    <Fr_text color="#fff">Receive</Fr_text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.convert}>
                  <View
                    style={{
                      padding: wp(5.6),
                      alignItems: 'center',
                      paddingHorizontal: wp(2.8),
                    }}>
                    <Icon
                      icon={require('./../Assets/Icons/convert_icon.png')}
                    />
                    <Fr_text color="#fff">Convert</Fr_text>
                  </View>
                </TouchableNativeFeedback>
              </Bg_view>
            </Bg_view>
            <Bg_view
              horizontal
              style={{
                justifyContent: 'space-between',
                padding: wp(5.6),
                paddingTop: wp(2.8),
                paddingBottom: hp(1.4),
              }}>
              <Bg_view style={{paddingTop: hp(4)}}>
                <Fr_text opacity={0.8}>USD Dollar</Fr_text>
                <Fr_text bold size={wp(4.5)}>{`1.00 USD`}</Fr_text>
              </Bg_view>
              <Icon
                action={this.cool_modal && this.cool_modal.toggle_show_modal}
                icon={require('./../Assets/Icons/currency_convert_icon.png')}
              />
              <Bg_view style={{paddingTop: hp(4)}}>
                <Fr_text opacity={0.8}>NGN Naira</Fr_text>
                <Fr_text bold size={wp(4.5)}>{`600.00 NGN`}</Fr_text>
              </Bg_view>
            </Bg_view>
            <Bg_view
              horizontal
              style={{paddingHorizontal: wp(2.8), alignItems: 'center'}}>
              <Small_btn title="sell" action={this.sell} />
              <Small_btn title="buy" action={this.buy} inverted />
              <Icon
                icon={require('./../Assets/Icons/change_currency_icon.png')}
                action={this.cool_modal && this.cool_modal.toggle_show_modal}
                style={{height: hp(7.5)}}
              />
            </Bg_view>
            <Line />
            <Bg_view
              style={{marginVertical: hp(2.8), paddingHorizontal: wp(5.6)}}>
              <Fr_text capitalise bold size={wp(5)}>
                transaction history
              </Fr_text>
              <Bg_view>
                {transactions ? (
                  transactions.length ? (
                    transactions.map(transaction => (
                      <Transaction
                        transaction={transaction}
                        key={transaction._id}
                      />
                    ))
                  ) : (
                    <List_empty text="You don't have any transaction at the moment" />
                  )
                ) : (
                  <Loadindicator />
                )}
              </Bg_view>
            </Bg_view>
          </Bg_view>
        </ScrollView>
        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
          <Bg_view
            style={{
              minHeight: hp(25),
              paddingHorizontal: wp(11.2),
              paddingVertical: hp(5.6),
              borderTopRightRadius: wp(7.5),
              borderTopLeftRadius: wp(7.5),
            }}
            background_color="#eee">
            <Bg_view no_bg style={{alignItems: 'flex-end'}}>
              <Icon
                icon={require('./../Assets/Icons/close_icon.png')}
                action={this.cool_modal && this.cool_modal.toggle_show_modal}
              />
            </Bg_view>
            <Fr_text
              bold="900"
              size={wp(6.2)}
              style={{marginBottom: hp(2.8)}}
              capitalise>
              change currency
            </Fr_text>
            <Fr_text size={wp(5.6)} opacity={0.8}>
              From
            </Fr_text>
            <Select_currency
              selected_currency={from_currency}
              select={this.set_from_currency}
            />
            <Fr_text size={wp(5.6)} opacity={0.8}>
              To
            </Fr_text>
            <Select_currency
              selected_currency={to_currency}
              select={this.set_to_currency}
            />
          </Bg_view>
        </Cool_modal>
      </Bg_view>
    );
  };
}

export default Wallet;
