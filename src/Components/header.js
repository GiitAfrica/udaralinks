import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';

const Header = ({title, no_transform, navigation}) => (
  <Bg_view horizontal style={{alignItems: 'center', paddingVertical: hp(1.4)}}>
    <Icon
      action={navigation?.goBack || (() => {})}
      style={{marginLeft: wp(1.4)}}
      icon="back_icon.png"
    />
    <Fr_text capitalise={!no_transform} bold size={wp(4.5)}>
      {`  ${title}`}
    </Fr_text>
  </Bg_view>
);

export default Header;
