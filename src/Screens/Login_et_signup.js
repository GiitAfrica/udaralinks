import React from 'react';
import {Image, StatusBar} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';

class Login_et_signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    let {navigation} = this.props;

    return (
      <Bg_view flex>
        <StatusBar hidden />
        <Bg_view
          style={{
            marginTop: hp(22),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Fr_text
            size={wp(10)}
            style={{
              marginBottom: hp(15),
            }}
            bold="900"
            accent>
            Udara
          </Fr_text>
          <Bg_view
            style={{
              elevation: 10,
              shadowColor: '#000',
              width: wp(88.8),
              height: hp(50),
              justifyContent: 'center',
              borderRadius: wp(5.6),
              marginHorizontal: wp(5.6),
            }}>
            <Stretched_button
              capitalise
              title="create account"
              action={() => navigation.navigate('registration')}
            />
            <Stretched_button
              style={{marginTop: hp(1.4)}}
              inverted
              title="login"
              action={() => navigation.navigate('login')}
            />
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Login_et_signup;
