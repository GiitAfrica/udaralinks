import React from 'react';
import {TextInput, KeyboardAvoidingView, ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {country_code: '+ (234) '};
  }

  render = () => {
    let {country_code} = this.state;

    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView showVerticalScrollIndicator={false}>
          <Bg_view style={{alignItems: 'center', backgroundColor: '#eee'}} flex>
            <Icon
              icon={require('./../Assets/Icons/Verification_2.png')}
              style={{height: hp(41)}}
            />

            <Fr_text bold="900" size={wp(7)} color="maroon">
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
                marginBottom: hp(6.5),
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
                <Icon
                  icon={require('./../Assets/Icons/nigeria_flag_rectangle.png')}
                  style={{height: wp(10), width: wp(10)}}
                />

                <Fr_text
                  size={wp(4.5)}
                  bold
                  color="maroon"
                  style={{marginLeft: wp(2.8)}}>
                  {country_code}
                </Fr_text>
                <TextInput
                  placeholder="Phone Number..."
                  keyboardType="phone-pad"
                  style={{
                    flex: 1,
                    fontSize: wp(4.5),
                    color: 'maroon',
                    marginRight: wp(1.4),
                    fontWeight: 'bold',
                  }}
                />
                {
                  <Icon
                    icon={require('./../Assets/Icons/id_verification_icon.png')}
                    style={{height: wp(7.5), width: wp(7.5)}}
                  />
                }
              </Bg_view>
              <Stretched_button
                title="get code"
                style={{marginHorizontal: 0, marginTop: hp(4)}}
              />
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
}

export default Registration;
