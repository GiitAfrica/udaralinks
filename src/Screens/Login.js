import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {emitter} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Country_codes from '../Components/country_codes';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Stretched_button from '../Components/Stretched_button';
import Text_input from '../Components/Text_input';
import {hp, wp} from '../utils/dimensions';
import {phone_regex, validate_phone} from '../utils/functions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import {set_phone_et_country_code} from './registration';

const default_country_code = {
  code: '+234',
  flag: 'nigeria_flag_rectangle.png',
  country: 'nigeria',
  util: 'country_codes',
  _id: 'utils~pnWEoNgkHcKqr3Z3i9vO~1660232528522',
  created: 1660232528522,
  updated: 1660232528522,
};

class Login extends React.Component {
  constructor(props) {
    super(props);

    let {route} = this.props;
    let phone = route?.params?.phone || '',
      country_code = route?.params?.country_code || default_country_code;

    console.log(phone, country_code.code);
    this.state = {
      phone: phone.replace(country_code.code, ''),
      password: '',
      country_code,
    };
  }

  componentDidMount = async () => {
    let new_user = await AsyncStorage.getItem('new_user');
    if (new_user) {
      new_user = JSON.parse(new_user);
      this.setState({
        new_user: true,
        phone: new_user.phone.replace(new_user.country_code.code, ''),
        country_code: new_user.country_code,
        user: new_user._id,
      });
    }
    let params = this.props.route?.params;
    if (params) {
      // country_code
    }
  };

  toggle_reveal_password = () =>
    this.setState({reveal_password: !this.state.reveal_password});

  set_phone = phone => this.setState({phone});

  set_password = password => this.setState({password});

  is_set = () => {
    let {phone, password} = this.state;
    return validate_phone(phone) && password.length >= 6;
  };

  toggle_country_codes = () =>
    this.cool_modal && this.cool_modal.toggle_show_modal();

  set_country_code = country_code =>
    this.setState({country_code}, this.toggle_country_codes);

  login = async () => {
    this.setState({loading: true});
    let {route} = this.props;
    let {phone, country_code, user, new_user, password} = this.state;

    // if (!phone_regex.test(phone) || password.length < 6)
    //   return this.setState({loading: false}, () => toast('Invalid inputs'));

    user = user || route?.params?.user;
    new_user = new_user || route?.params?.new_user;
    phone = set_phone_et_country_code(phone, country_code.code);

    console.log(phone);

    new_user &&
      (await post_request('update_password', {
        key: password,
        new_user: true,
        user,
      }));

    let result = await post_request('logging_in', {phone, key: password});
    await AsyncStorage.removeItem('new_user');
    this.setState({loading: false});
    result && result.user
      ? emitter.emit('logged_in', {user: result.user, wallet: result.wallet})
      : toast(result);
  };

  render = () => {
    let {route} = this.props;
    let new_user = route?.params?.new_user || this.state.new_user;
    let {phone, password, reveal_password, loading, country_code} = this.state;

    return (
      <Bg_view flex>
        <KeyboardAvoidingView style={{flex: 1}}>
          <ScrollView showVerticalScrollIndicator={false} style={{flex: 1}}>
            <Bg_view style={{alignItems: 'center'}} flex no_bg>
              <Fr_text
                bold="900"
                size={wp(10)}
                accent
                style={{marginTop: hp(10)}}>
                Udara
              </Fr_text>
              <Bg_view
                style={{
                  elevation: 10,
                  shadowColor: '#000',
                  width: wp(88.8),
                  height: hp(70),
                  justifyContent: 'center',
                  borderRadius: wp(5.6),
                  padding: wp(5.6),
                  paddingBottom: wp(2.8),
                  marginVertical: hp(5),
                }}>
                <Fr_text
                  bold="900"
                  size={wp(7.5)}
                  color="#28100B"
                  centralise
                  style={{marginBottom: hp(4)}}>
                  Login
                </Fr_text>
                <Text_input
                  value={phone}
                  placeholder="type your phone"
                  label="phone number"
                  type="phone-pad"
                  on_change_text={this.set_phone}
                  disabled={!!new_user}
                  left_icon={
                    <TouchableWithoutFeedback
                      onPress={this.toggle_country_codes}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  }
                />

                <Text_input
                  value={password}
                  label={new_user ? 'create your password' : 'password'}
                  secure={!reveal_password}
                  placeholder="type your password"
                  on_change_text={this.set_password}
                  right_icon={
                    <Icon
                      icon={
                        reveal_password
                          ? require('./../assets/Icons/eye.png')
                          : require('./../assets/Icons/hidden.png')
                      }
                      action={this.toggle_reveal_password}
                    />
                  }
                />
                <Stretched_button
                  title="login"
                  loading={loading}
                  style={{marginHorizontal: 0, marginTop: hp(2)}}
                  action={this.login}
                />
              </Bg_view>

              <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
                <Country_codes
                  close_modal={() =>
                    this.cool_modal && this.cool_modal.toggle_show_modal()
                  }
                  select={this.set_country_code}
                />
              </Cool_modal>
            </Bg_view>
          </ScrollView>
        </KeyboardAvoidingView>
      </Bg_view>
    );
  };
}

export default Login;
export {default_country_code};
