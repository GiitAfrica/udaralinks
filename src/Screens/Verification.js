import React from 'react';
import {TextInput, KeyboardAvoidingView, ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Otp_counter from '../Components/otp_counter';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';

class Verification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {country_code: '+ (234) '};
  }

  resend_otp = () => {};

  render = () => {
    let {last_four_digit} = this.props;
    last_four_digit = last_four_digit || 7890;

    return (
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#eee'}}>
        <ScrollView showVerticalScrollIndicator={false}>
          <Bg_view style={{alignItems: 'center'}} flex no_bg>
            <Icon
              icon={require('./../Assets/Icons/Verification_2.png')}
              style={{height: hp(38)}}
            />

            <Fr_text bold="900" size={wp(7)} color="maroon">
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
                marginTop: hp(4),
                marginBottom: hp(6.5),
              }}>
              {`enter the 4 digit number that was sent to ****${last_four_digit}`}
            </Fr_text>
            <Bg_view
              style={{
                backgroundColor: '#fff',
                width: wp(88.8),
                height: hp(28),
                justifyContent: 'center',
                borderRadius: wp(5.6),
                padding: wp(5.6),
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
            <Otp_counter resend_otp={this.resend_otp} />
          </Bg_view>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
}

export default Verification;
