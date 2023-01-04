import React from 'react';
import {TextInput, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Country_codes from '../Components/country_codes';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {email_regex} from '../utils/functions';
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
    this.state = {country_code: default_country_code, email: ''};
  }

  set_phone = email => this.setState({email});

  request_code = async () => {
    let {email} = this.state;
    return await post_request('request_otp', {
      email,
    });
  };

  toggle_country_codes = () =>
    this.cool_modal && this.cool_modal.toggle_show_modal();

  set_country_code = country_code =>
    this.setState({country_code}, this.toggle_country_codes);

  get_code = async () => {
    this.setState({loading: true});
    let {navigation} = this.props;
    let {email, country_code} = this.state;

    let res = await this.request_code();
    console.log(res);
    this.setState({loading: false});

    res.trim().toLowerCase() === email.trim().toLowerCase()
      ? navigation.navigate('verification', {email, country_code})
      : toast('Error, something went wrong.');
  };

  render = () => {
    let {country_code, loading, email} = this.state;

    return (
      <Bg_view flex>
        <KeyboardAvoidingView style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
            <Bg_view
              style={{
                alignItems: 'center',
                height: hp(),
                paddingBottom: hp(10),
              }}
              flex>
              <Icon
                icon={require('../assets/Icons/Verification_2.png')}
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
                enter your email to receive a verification code
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
                  {/* <TouchableWithoutFeedback onPress={this.toggle_country_codes}>
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
                  </TouchableWithoutFeedback> */}
                  <TextInput
                    placeholder="Email Address..."
                    placeholderTextColor="#ccc"
                    keyboardType="email-address"
                    onChangeText={this.set_phone}
                    value={email}
                    style={{
                      flex: 1,
                      fontSize: wp(4.5),
                      color: '#28100B',
                      marginRight: wp(1.4),
                      fontWeight: 'bold',
                    }}
                  />
                  {email_regex.test(email) ? (
                    <Icon
                      icon={require('../assets/Icons/valid.png')}
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
      </Bg_view>
    );
  };
}

export default Registration;
export {set_phone_et_country_code};
