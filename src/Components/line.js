import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';

const Line = () => {
  return (
    <Bg_view
      style={{
        height: 1,
        borderBottomWidth: 0.2,
        borderBottomColor: '#aaa',
        marginHorizontal: wp(5.6),
        marginVertical: hp(0.7),
      }}
    />
  );
};

export default Line;
