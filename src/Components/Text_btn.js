import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';

class Text_btn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let {action} = this.props;

    return (
      <TouchableNativeFeedback onPress={action}>
        <View style={{padding: wp(1.4)}}>
          <Fr_text>Resend</Fr_text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

export default Text_btn;
