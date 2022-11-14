import React from 'react';
import {View} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';

const Header = ({title, close_fn, no_transform, navigation}) => {
  close_fn = navigation ? navigation.goBack : close_fn || (() => {});

  return (
    <Bg_view
      horizontal
      style={{alignItems: 'center', paddingVertical: hp(1.4)}}>
      <View>
        <Icon
          action={() => close_fn()}
          style={{marginLeft: wp(1.4)}}
          icon={require('../../android/app/src/main/assets/Icons/back_icon.png')}
        />
      </View>
      <Fr_text capitalise={!no_transform} bold size={wp(4.5)}>
        {`  ${title}`}
      </Fr_text>
    </Bg_view>
  );
};

export default Header;
