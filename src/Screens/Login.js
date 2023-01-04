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
import {validate_phone} from '../utils/functions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';

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
    let email = route?.params?.email || '',
      country_code = route?.params?.country_code || default_country_code;

    this.state = {
      email,
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
        email: new_user.email.replace(new_user.country_code.code, ''),
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

  set_email = email => this.setState({email});

  set_password = password => this.setState({password});

  is_set = () => {
    let {email, password} = this.state;
    return validate_phone(email) && password.length >= 6;
  };

  toggle_country_codes = () =>
    this.cool_modal && this.cool_modal.toggle_show_modal();

  set_country_code = country_code =>
    this.setState({country_code}, this.toggle_country_codes);

  login = async () => {
    this.setState({loading: true});
    let {route} = this.props;
    let {email, user, new_user, password} = this.state;

    user = user || route?.params?.user;
    new_user = new_user || route?.params?.new_user;

    new_user &&
      (await post_request('update_password', {
        key: password,
        new_user: true,
        user,
      }));

    let result = await post_request('logging_in', {email, key: password});
    await AsyncStorage.removeItem('new_user');
    this.setState({loading: false});
    result && result.user
      ? emitter.emit('logged_in', {user: result.user, wallet: result.wallet})
      : toast(result);
  };

  render = () => {
    let {route} = this.props;
    let new_user = route?.params?.new_user || this.state.new_user;
    let {email, password, reveal_password, loading, country_code} = this.state;

    return (
      <Bg_view flex>
        <KeyboardAvoidingView style={{flex: 1}}>
          <ScrollView showVerticalScrollIndicator={false} style={{flex: 1}}>
            <Bg_view style={{alignItems: 'center'}} flex no_bg>
              <Icon
                icon={require('../assets/Icons/udara_logo.png')}
                style={{height: hp(10), width: wp(50), marginTop: hp(10)}}
              />
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
                  value={email}
                  placeholder="type your email"
                  label="email Address"
                  type="email-pad"
                  on_change_text={this.set_email}
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
