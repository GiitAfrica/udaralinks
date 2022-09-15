import React from 'react';
import {
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Country_codes from '../Components/country_codes';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {phone_regex, validate_phone} from '../utils/functions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import {default_country_code} from './Login';

const set_phone_et_country_code = (phone, country_code) => {
  phone = phone.replace(/ /g, '');
  // if (phone.startsWith('0')) phone = phone.slice(1);

  return phone.startsWith('+') ? phone : `${country_code}${phone}`;
};

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {country_code: default_country_code};
  }

  set_phone = phone => this.setState({phone});

  request_code = async () => {
    let {phone, country_code} = this.state;
    return await post_request('request_otp', {
      phone: set_phone_et_country_code(phone, country_code.code),
    });
  };

  toggle_country_codes = () =>
    this.cool_modal && this.cool_modal.toggle_show_modal();

  set_country_code = country_code =>
    this.setState({country_code}, this.toggle_country_codes);

  get_code = async () => {
    this.setState({loading: true});
    let {navigation} = this.props;
    let {phone, country_code} = this.state;

    if (!phone_regex.test(phone))
      return this.setState({loading: false}, () => toast('Invalid inputs'));

    let res = await this.request_code();
    this.setState({loading: false});

    phone = set_phone_et_country_code(phone, country_code.code);

    res === phone
      ? navigation.navigate('verification', {phone, country_code})
      : toast('Error, something went wrong.');
  };

  render = () => {
    let {country_code, loading, phone} = this.state;

    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Bg_view
            style={{alignItems: 'center', height: hp(), paddingBottom: hp(10)}}
            flex>
            <Icon
              icon="Verification_2.png"
              style={{height: hp(38), width: wp(85)}}
            />

            <Fr_text bold="900" size={wp(7)} color="#28100B">
              Registration
            </Fr_text>
            <Fr_text
              size={wp(4.2)}
              centralise
              capitalise
              line_height={wp(7)}
              opacity={0.8}
              style={{
                marginHorizontal: wp(20),
                marginTop: hp(4),
                marginBottom: hp(4),
              }}>
              enter your mobile number to receive a verification code
            </Fr_text>
            <Bg_view
              style={{
                backgroundColor: '#fff',
                width: wp(88.8),
                height: hp(30),
                justifyContent: 'center',
                borderRadius: wp(5.6),
                padding: wp(5.6),
                marginBottom: hp(10),
                elevation: 10,
                shadowColor: '#000',
              }}>
              <Bg_view
                style={{
                  height: hp(7.5),
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: wp(4),
                  marginTop: hp(4),
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: wp(4),
                  paddingRight: wp(2.8),
                }}>
                <TouchableWithoutFeedback onPress={this.toggle_country_codes}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      icon={country_code.flag}
                      style={{height: wp(10), width: wp(10)}}
                    />

                    <Fr_text
                      size={wp(4.5)}
                      bold
                      color="#28100B"
                      style={{marginLeft: wp(1.4)}}>
                      {country_code.code}
                    </Fr_text>
                  </View>
                </TouchableWithoutFeedback>
                <TextInput
                  placeholder="Phone Number..."
                  keyboardType="phone-pad"
                  onChangeText={this.set_phone}
                  value={phone}
                  style={{
                    flex: 1,
                    fontSize: wp(4.5),
                    color: '#28100B',
                    marginRight: wp(1.4),
                    fontWeight: 'bold',
                  }}
                />
                {phone_regex.test(phone) ? (
                  <Icon
                    icon="id_verification_icon.png"
                    style={{height: wp(7.5), width: wp(7.5)}}
                  />
                ) : null}
              </Bg_view>
              <Stretched_button
                title="get code"
                loading={loading}
                style={{marginHorizontal: 0, marginTop: hp(4)}}
                action={this.get_code}
              />
            </Bg_view>
          </Bg_view>
          <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
            <Country_codes
              close_modal={() =>
                this.cool_modal && this.cool_modal.toggle_show_modal()
              }
              select={this.set_country_code}
            />
          </Cool_modal>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
}

export default Registration;
export {set_phone_et_country_code};