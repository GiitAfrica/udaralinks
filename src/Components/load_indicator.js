import React from 'react';
import {ActivityIndicator} from 'react-native';
import {hp} from '../utils/dimensions';
import Bg_view from './Bg_view';

class Loadindicator extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Bg_view no_bg style={{minHeight: hp(10), justifyContent: 'center'}}>
        <ActivityIndicator color="#FF6905" size="large" />
      </Bg_view>
    );
  };
}

export default Loadindicator;
