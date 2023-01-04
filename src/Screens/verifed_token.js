import React from 'react';
import Bg_view from '../Components/Bg_view';
import {wp} from '../utils/dimensions';

const Verified_token = () => (
  <Bg_view
    style={{
      height: wp(2),
      width: wp(2),
      borderRadius: wp(2),
      backgroundColor: 'green',
      marginLeft: wp(1.4),
    }}
  />
);

export default Verified_token;
