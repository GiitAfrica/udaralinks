import React from 'react';
import {TextInput, KeyboardAvoidingView, ScrollView} from 'react-native';
import {emitter} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Loadindicator from '../Components/load_indicator';
import Otp_counter from '../Components/otp_counter';
import Stretched_button from '../Components/Stretched_button';
import Text_btn from '../Components/Text_btn';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';

class Verification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {code: ''};
  }

  resend_otp = async () => {
    let {phone} = this.props.route.params;
    return await post_request('request_otp', {phone});
  };

  set_code = code =>
    this.setState({
      code: code.trim(),
      valid_code: /^[0-9]{4}$/.test(String(code)),
    });

  verify_later = () => this.setState({verify_later: true}, this.verify);

  phone_update = async () => {
    this.setState({
      doing_later: !!this.state.verify_later,
      loading: !this.state.verify_later,
    });
    let {navigation, route} = this.props;
    let {phone, user, country, country_code} = route.params;
    let {code, verify_later} = this.state;
    if (typeof country_code !== 'object')
      country_code = {code: country_code, country};

    let response = await post_request('update_phone', {
      phone,
      verify_later,
      code: Number(code),
      user,
      country_code,
    });
    console.log(response, 'response here');
    if (response === user) {
      emitter.emit('update_phone', {phone, verify_later, country_code});
      navigation.pop();
      navigation.navigate('account');
    } else {
      toast("Err, couldn't conclude request.");
      this.setState({doing_later: false, loading: false, verify_later: false});
    }
  };

  verify = async () => {
    let {navigation, route} = this.props;
    let {phone, from_update, country_code} = route.params;

    if (from_update) return this.phone_update();

    this.setState({loading: true});
    let {code, verify_later} = this.state;

    let verified = await post_request('verify_otp', {
      phone,
      country: country_code.country,
      country_code: country_code.code,
      code: Number(code),
      verify_later,
    });

    this.setState({loading: false});
    if (verified.user && verified.wallet) {
      emitter.emit('verified', {...verified, country_code});
      navigation.pop();
      navigation.navigate('congratulation', {
        phone,
        user: verified.user._id,
        country_code,
      });
    } else {
      toast('Verification  failed');
      navigation.goBack();
    }
  };

  render = () => {
    let {valid_code, code, loading, doing_later} = this.state;
    let {phone} = this.props.route.params;
    let str_phone = String(phone);
    let last_four_digit = str_phone.slice(str_phone.length - 4);

    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView showVerticalScrollIndicator={false}>
          <Bg_view style={{alignItems: 'center'}}>
            <Icon
              icon="Verification_2.png"
              style={{height: hp(35), width: wp(85)}}
            />

            <Fr_text bold="900" size={wp(7)} color="#28100B">
              Verification
            </Fr_text>
            <Fr_text
              size={wp(4.2)}
              centralise
              capitalise
              line_height={wp(7)}
              opacity={0.8}
              style={{
                marginHorizontal: wp(20),
                marginTop: hp(1.4),
                marginBottom: hp(2.8),
              }}>
              {`enter the 4 digit number that was sent to ****${last_four_digit}`}
            </Fr_text>
            <Bg_view
              style={{
                backgroundColor: '#fff',
                width: wp(88.8),
                height: hp(35),
                justifyContent: 'center',
                borderRadius: wp(5.6),
                padding: wp(5.6),
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
                <TextInput
                  placeholder="_ _ _ _"
                  keyboardType="phone-pad"
                  onChangeText={this.set_code}
                  value={String(code)}
                  style={{
                    flex: 1,
                    fontSize: wp(4.5),
                    color: '#28100B',
                    marginRight: wp(1.4),
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                />
                {valid_code ? (
                  <Icon
                    icon="id_verification_icon.png"
                    style={{height: wp(7.5), width: wp(7.5)}}
                  />
                ) : null}
              </Bg_view>
              <Stretched_button
                title="verify"
                disabled={!valid_code || doing_later}
                loading={loading}
                style={{marginHorizontal: 0, marginTop: hp(4)}}
                action={this.verify}
              />

              <Bg_view style={{alignItems: 'center'}}>
                {doing_later ? (
                  <Loadindicator style={{minHeight: null}} />
                ) : (
                  <Text_btn
                    disabled={loading}
                    text="Do this later"
                    action={this.verify_later}
                  />
                )}
              </Bg_view>
            </Bg_view>
            {doing_later ? null : <Otp_counter resend_otp={this.resend_otp} />}
          </Bg_view>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
}

export default Verification;
