import React from 'react';
import {TextInput, KeyboardAvoidingView, ScrollView} from 'react-native';
import {emitter} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Otp_counter from '../Components/otp_counter';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';

class Verification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {code: ''};
  }

  resend_otp = async () => {
    let {email} = this.props.route.params;
    return await post_request('request_otp', {email});
  };

  set_code = code =>
    this.setState({
      code: code.trim(),
      valid_code: /^[0-9]{6}$/.test(String(code)),
    });

  verify_later = () => this.setState({verify_later: true}, this.verify);

  email_update = async () => {
    this.setState({loading: true});
    let {navigation, route} = this.props;
    let {email, user, country_code} = route.params;
    let {code} = this.state;

    let response = await post_request('update_email', {
      email,
      code,
      country: country_code.country,
      code: country_code.code,
      user,
    });
    if (response === user) {
      emitter.emit('update_email', {email, country_code});
      navigation.pop();
      navigation.navigate('account');
    } else {
      toast("Err, couldn't conclude request.");
      this.setState({loading: false});
    }
  };

  verify = async () => {
    let {navigation, route} = this.props;
    let {email, from_update, country_code} = route.params;

    if (from_update) return this.email_update();

    this.setState({loading: true});
    let {code} = this.state;

    let verified = await post_request('verify_otp', {
      email,
      country: country_code.country,
      country_code: country_code.code,
      code,
    });

    this.setState({loading: false});
    if (verified.user && verified.wallet) {
      emitter.emit('verified', {...verified, country_code});
      navigation.pop();
      navigation.navigate('congratulation', {
        email,
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
    let {email} = this.props.route.params;

    return (
      <Bg_view flex>
        <KeyboardAvoidingView style={{flex: 1}}>
          <ScrollView showVerticalScrollIndicator={false}>
            <Bg_view style={{alignItems: 'center'}}>
              <Icon
                icon={require('./../assets/Icons/Verification_2.png')}
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
                {`enter the 6 digit number that was sent to ${email}`}
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
                    placeholder="_ _ _ _ _ _"
                    keyboardType="email-pad"
                    placeholderTextColor="#ccc"
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
                      icon={require('../assets/Icons/valid.png')}
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
              </Bg_view>
              {doing_later ? null : (
                <Otp_counter resend_otp={this.resend_otp} />
              )}
            </Bg_view>
          </ScrollView>
        </KeyboardAvoidingView>
      </Bg_view>
    );
  };
}

export default Verification;
