import React from 'react';
import {Image} from 'react-native';
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
    return (
      <Bg_view
        flex
        style={{
          backgroundColor: '#eee',
        }}>
        <Bg_view
          style={{
            marginTop: hp(20),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#eee',
          }}>
          <Fr_text
            size={wp(7.5)}
            style={{
              marginBottom: hp(10),
            }}
            bold="900"
            accent>
            Udara
          </Fr_text>
          <Bg_view
            style={{
              backgroundColor: '#fff',
              width: wp(88.8),
              height: hp(50),
              justifyContent: 'center',
              borderRadius: wp(5.6),
              marginHorizontal: wp(5.6),
            }}>
            <Stretched_button capitalise title="create account" />
            <Stretched_button
              style={{marginTop: hp(1.4)}}
              inverted
              title="login"
            />

            <Bg_view style={{alignItems: 'center'}}>
              <Fr_text style={{textDecoration: 'underline'}}>
                Or Sign Up using
              </Fr_text>

              <Bg_view style={{flexDirection: 'row'}}>
                <Image />
              </Bg_view>
            </Bg_view>
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Login_et_signup;
