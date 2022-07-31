import React from 'react';
import {Image, TouchableNativeFeedback, View} from 'react-native';
import Bg_view from './Bg_view';

const Icon = ({icon, action, style}) => {
  return (
    <TouchableNativeFeedback onPress={action} disabled={!action}>
      <View>
        <Bg_view no_bg>
          <Image source={icon} style={{...style}} resizeMode="cover" />
        </Bg_view>
      </View>
    </TouchableNativeFeedback>
  );
};

export default Icon;
