import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';

class Stretched_button extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {action, title, style, inverted, caps} = this.props;

    return (
      <View style={{margin: wp(5.6), ...style}}>
        <TouchableNativeFeedback onPress={action}>
          <View>
            <Bg_view
              accent={!inverted}
              style={{
                height: hp(7.5),
                borderRadius: wp(5.6),
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: inverted ? 1.5 : null,
                borderColor: inverted ? '#FF6905' : null,
              }}>
              <Fr_text
                bold
                size={wp(4)}
                caps={caps}
                capitalise
                color="#fff"
                accent={inverted}>
                {title}
              </Fr_text>
            </Bg_view>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  };
}

export default Stretched_button;
