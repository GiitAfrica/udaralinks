import React from 'react';
import {Image, View, TouchableNativeFeedback} from 'react-native';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';

const Icon = ({icon, action, style}) => (
  <TouchableNativeFeedback
    style={{...style}}
    onPress={action}
    disabled={!action}>
    <View style={{padding: action ? wp(2.8) : 0}}>
      <Bg_view no_bg>
        <Image source={icon} style={{...style}} resizeMode="cover" />
      </Bg_view>
    </View>
  </TouchableNativeFeedback>
);

export default Icon;
