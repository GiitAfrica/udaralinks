import React from 'react';
import {KeyboardAvoidingView, ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Stretched_button from '../Components/Stretched_button';
import Text_input from '../Components/Text_input';
import {hp, wp} from '../utils/dimensions';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  set_username = username => this.setState({username});

  set_password = password => this.setState({password});

  login = () => {};

  render = () => {
    let {username, password} = this.state;

    return (
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#eee'}}>
        <ScrollView showVerticalScrollIndicator={false}>
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
                backgroundColor: '#fff',
                width: wp(88.8),
                height: hp(72),
                justifyContent: 'center',
                borderRadius: wp(5.6),
                padding: wp(5.6),
                marginTop: hp(5),
              }}>
              <Fr_text
                bold="900"
                size={wp(7.5)}
                color="maroon"
                centralise
                style={{marginBottom: hp(4)}}>
                Login
              </Fr_text>
              <Text_input
                value={username}
                placeholder="type your username"
                label="username"
                on_change_text={this.set_username}
              />
              <Text_input
                value={password}
                label="password"
                placeholder="type your password"
                on_change_text={this.set_password}
              />
              <Stretched_button
                title="login"
                style={{marginHorizontal: 0, marginTop: hp(2)}}
                action={this.login}
              />
              <Bg_view style={{alignItems: 'center'}}>
                <Fr_text capitalise>or sign up using</Fr_text>
              </Bg_view>
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
}

export default Login;
