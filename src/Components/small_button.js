import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';

class Small_btn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    let {title, action, inverted, style, icon, right_icon} = this.props;

    return (
      <View style={{margin: wp(2.8), ...style}}>
        <TouchableNativeFeedback onPress={action}>
          <View>
            <Bg_view
              horizontal
              accent={!inverted}
              style={{
                height: hp(5.6),
                borderRadius: wp(2.8),
                minWidth: wp(30),
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: inverted ? 1.5 : null,
                borderColor: inverted ? '#FF6905' : null,
                ...style,
              }}>
              {right_icon}
              <Fr_text bold size={wp(4)} caps color="#fff" accent={inverted}>
                {title}
              </Fr_text>
              {icon}
            </Bg_view>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  };
}

export default Small_btn;
