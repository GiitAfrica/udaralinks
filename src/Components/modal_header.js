import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Line from './line';

const Modal_header = ({title, close}) => {
  return (
    <Bg_view style={{marginBottom: hp(2.8)}}>
      <Bg_view
        horizontal
        style={{
          height: hp(5),
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {title ? (
          <Fr_text capitalise bold size={wp(4.5)} style={{marginLeft: wp(5.6)}}>
            {title}
          </Fr_text>
        ) : null}
        <Icon
          icon="close_icon.png"
          action={() => close && close()}
          style={{
            alignSelf: 'flex-end',
            marginHorizontal: wp(5.6),
          }}
        />
      </Bg_view>
      <Line color="#eee" />
    </Bg_view>
  );
};

export default Modal_header;
