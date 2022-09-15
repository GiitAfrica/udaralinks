import React from 'react';
import {TextInput, TouchableNativeFeedback, View} from 'react-native';
import {fsk} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import toast from '../utils/toast';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Currencies from './currencies';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Select_currency from './select_currency';
import Stretched_button from './Stretched_button';

class Convert extends React.Component {
  constructor(props) {
    super(props);

    let {from_currency, to_currency} = this.props;

    this.state = {from_currency, to_currency};
  }

  set_from_currency = from_currency =>
    this.setState({from_currency}, this.convert);

  set_to_currency = to_currency => this.setState({to_currency}, this.convert);

  set_value = value => this.setState({value});

  convert = async () => {
    let {currencies} = this.props.wallet;
    let {from_currency, to_currency, value} = this.state;

    if (!value || value <= 0) return;
    this.setState({converting: true, conversion: 0});

    try {
      let ftch = await fetch(
        `https://api.flutterwave.com/v3/transfers/rates?amount=${value}&destination_currency=${
          currencies.find(curr => curr.name === from_currency).alphabetic_name
        }&source_currency=${
          currencies.find(curr => curr.name === to_currency).alphabetic_name
        }`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${fsk}`,
          },
        },
      );
      let response = await ftch.json();
      this.setState({
        conversion: response?.data?.source?.amount,
        converting: false,
      });
    } catch (e) {
      console.log(e);
      this.setState({converting: false});
      toast('Cannot convert at this time.');
    }
  };

  render() {
    let {from_currency, to_currency, conversion, converting, value} =
      this.state;
    let {toggle} = this.props;

    return (
      <Bg_view
        style={{
          minHeight: hp(25),
          paddingHorizontal: wp(11.2),
          paddingVertical: hp(5.6),
          borderTopRightRadius: wp(7.5),
          borderTopLeftRadius: wp(7.5),
        }}>
        <Bg_view no_bg style={{alignItems: 'flex-end'}}>
          <Icon icon="close_icon.png" action={toggle} />
        </Bg_view>
        <Fr_text
          bold="900"
          size={wp(6.2)}
          style={{marginBottom: hp(2.8)}}
          capitalise>
          convert
        </Fr_text>
        <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
          From
        </Fr_text>
        <Bg_view horizontal style={{alignItems: 'center'}}>
          <TextInput
            placeholder="Enter Value"
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
            }}
          />
          <TouchableNativeFeedback
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
                <Fr_text capitalise>{from_currency}</Fr_text>
              </Bg_view>
            </View>
          </TouchableNativeFeedback>
        </Bg_view>
        <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
          To
        </Fr_text>
        {conversion ? (
          <Bg_view horizontal style={{alignItems: 'center'}}>
            <TextInput
              placeholder="Enter amount"
              editable={false}
              value={String(conversion)}
              style={{
                flex: 1,
                borderRadius: wp(1),
                elevation: 5,
                padding: wp(4),
                fontSize: wp(5),
                fontWeight: 'bold',
                color: '#000',
                shadowColor: '#ccc',
              }}
            />
            <TouchableNativeFeedback
              onPress={() =>
                this.to_currency_modal &&
                this.to_currency_modal.toggle_show_modal()
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
                  <Fr_text capitalise>{to_currency}</Fr_text>
                </Bg_view>
              </View>
            </TouchableNativeFeedback>
          </Bg_view>
        ) : (
          <Select_currency
            selected_currency={to_currency}
            exclude={from_currency}
            select={this.set_to_currency}
          />
        )}

        <Stretched_button
          title="convert"
          action={this.convert}
          disabled={!value || value <= 0}
          loading={converting}
        />

        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
          <Currencies
            select={this.set_from_currency}
            exclude={to_currency}
            close_modal={this.cool_modal && this.cool_modal.toggle_show_modal}
          />
        </Cool_modal>
        <Cool_modal
          ref={to_currency_modal =>
            (this.to_currency_modal = to_currency_modal)
          }>
          <Currencies
            select={this.set_to_currency}
            exclude={to_currency}
            close_modal={
              this.to_currency_modal && this.to_currency_modal.toggle_show_modal
            }
          />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Convert;
