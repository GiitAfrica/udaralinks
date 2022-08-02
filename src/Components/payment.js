import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';

class Payment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  go_to_payment = () => {};

  render = () => {
    let {payment} = this.props;
    let {icon, title, text} = payment;

    return (
      <TouchableNativeFeedback onPress={this.go_to_payment}>
        <View>
          <Bg_view
            horizontal
            style={{
              alignItems: 'center',
              padding: wp(2.8),
              borderRadius: wp(4),
              marginBottom: hp(1.4),
            }}>
            <Icon style={{height: wp(10)}} icon={icon} />
            <Bg_view flex style={{marginLeft: wp(2.8)}}>
              <Fr_text bold size={wp(4.5)}>
                {title}
              </Fr_text>
              <Fr_text opacity={0.8}>{text}</Fr_text>
            </Bg_view>
            <Icon
              icon={require('./../Assets/Icons/forward_arrow_icon.png')}
              style={{marginLeft: wp(2.8)}}
            />
          </Bg_view>
        </View>
      </TouchableNativeFeedback>
    );
  };
}

export default Payment;
