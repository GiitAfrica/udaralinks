import React from 'react';
import {
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Admin_id, emitter} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Currencies from '../Components/currencies';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import Stretched_button from '../Components/Stretched_button';
import Text_btn from '../Components/Text_btn';
import {hp, wp} from '../utils/dimensions';
import {get_request, post_request} from '../utils/services';
import toast from '../utils/toast';

class Sell extends React.Component {
  constructor(props) {
    super(props);

    let {currency, rate, currency_full, value} = this.props.route.params;

    this.state = {
      currency,
      value,
      rate,
      offer_terms: '',
      currency_full: currency_full || {
        alphabetic_name: 'USD',
        icon: 'dollar_icon.png',
        flag: 'usa_flag_rectangle.png',
      },
      minimum_sell_value: 0,
      purposes: new Array(),
    };
  }

  componentDidMount = async () => {
    let all_purposes = await get_request('purposes');
    all_purposes && all_purposes.reverse(), this.setState({all_purposes});
  };

  is_set = () => {
    let {value, rate} = this.state;

    return value <= 0 || rate <= 0 || !value || !rate;
  };

  set_value = value => this.setState({value});

  set_rate = rate => this.setState({rate});

  set_terms = offer_terms => this.setState({offer_terms});

  set_minimum_sell_value = minimum_sell_value => {
    let {value} = this.state;
    this.setState({
      minimum_sell_value:
        Number(value) < Number(minimum_sell_value) ? value : minimum_sell_value,
    });
  };

  set_currency = (currency, currency_full) =>
    this.setState({currency, currency_full});

  place_sale = async () => {
    if (this.state.loading) return;

    this.setState({loading: true});
    let {navigation, route} = this.props;
    let {wallet} = route.params;
    let {
      rate,
      value,
      currency,
      minimum_sell_value,
      currency_full,
      offer_terms,
    } = this.state;

    let sale = {
      rate: Number(rate),
      value: Number(value),
      currency: currency || 'dollar',
      offer_terms,
      seller: wallet.user,
      wallet: wallet._id,
      alphabetic_name: currency_full.alphabetic_name,
      icon: currency_full.icon,
      flag: currency_full.flag,
      minimum_sell_value: Number(minimum_sell_value) || 0,
    };

    let res = await post_request('/place_sale', sale);
    if (res) {
      sale._id = res._id;
      sale.created = res.created;

      emitter.emit('new_currency_onsale', sale);
      navigation.goBack();
    } else toast("Couldn't place sale at this time");
    this.setState({loading: false});
  };

  render() {
    let {navigation, route} = this.props;
    let {user} = route.params;
    let {value, currency_full, minimum_sell_value, offer_terms, rate, loading} =
      this.state;

    return (
      <Bg_view flex style={{paddingHorizontal: wp(2.8)}}>
        <Header title="sell beacon" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Bg_view
            style={{
              borderColor: '#eee',
              borderWidth: 0.5,
              borderRadius: wp(4),
              padding: wp(4),
            }}>
            <Fr_text accent>Value to Sell</Fr_text>
            <Bg_view
              horizontal
              style={{alignItems: 'center', marginBottom: hp(1.4)}}>
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
                  shadowColor: '#ccc',
                  color: '#000',
                }}
              />
              <TouchableWithoutFeedback
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
              </TouchableWithoutFeedback>
            </Bg_view>

            <Fr_text accent>Rate</Fr_text>
            <Bg_view
              horizontal
              style={{
                alignItems: 'center',
                borderRadius: wp(1.4),
                shadowColor: '#000',
                elevation: 5,
                marginBottom: hp(2),
              }}>
              <TextInput
                placeholder="Enter rate"
                value={rate}
                keyboardType="phone-pad"
                onChangeText={this.set_rate}
                style={{
                  flex: 1,
                  borderRadius: wp(1),
                  padding: wp(4),
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
                  <Icon icon={'nigeria_flag_rectangle.png'} />
                  <Fr_text style={{marginLeft: wp(1.4)}}>NGN</Fr_text>
                </Bg_view>
              </View>
            </Bg_view>

            <Fr_text accent>Minimum Sell Value</Fr_text>
            <Bg_view
              horizontal
              style={{
                alignItems: 'center',
                borderRadius: wp(1.4),
                shadowColor: '#000',
                elevation: 5,
                marginBottom: hp(1.4),
              }}>
              <TextInput
                placeholder="Set minimum sell value (Optional)"
                value={String(minimum_sell_value)}
                keyboardType="phone-pad"
                onChangeText={this.set_minimum_sell_value}
                style={{
                  flex: 1,
                  borderRadius: wp(1),
                  padding: wp(4),
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
                  <Icon icon={currency_full.flag} />
                  <Fr_text style={{marginLeft: wp(1.4)}}>
                    {currency_full.alphabetic_name}
                  </Fr_text>
                </Bg_view>
              </View>
            </Bg_view>
          </Bg_view>

          <Bg_view
            style={{
              shadowColor: '#ccc',
              elevation: 5,
              marginTop: hp(1.4),
              padding: wp(4),
              borderRadius: wp(4),
            }}
            no_bg>
            <Fr_text accent>Offer Terms</Fr_text>
            <TextInput
              placeholder="Explain terms (Optional)"
              value={offer_terms}
              onChangeText={this.set_terms}
              multiline
              style={{
                flex: 1,
                borderRadius: wp(1),
                padding: wp(4),
                fontSize: wp(4.5),
                minHeight: hp(5),
                color: '#000',
              }}
            />
          </Bg_view>

          <Stretched_button
            disabled={
              this.is_set() || (value > 500 && user.status !== 'verified')
            }
            title="place sale"
            action={this.place_sale}
            loading={loading}
          />

          {value > 500 &&
          user.status !== 'verified' &&
          user._id !== Admin_id ? (
            <Bg_view
              style={{
                alignItems: 'center',
                marginBottom: hp(2.8),
                marginHorizontal: wp(10),
              }}>
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
        </ScrollView>

        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
          <Currencies
            select={this.set_currency}
            close_modal={this.cool_modal && this.cool_modal.toggle_show_modal}
            exclude="naira"
          />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Sell;
