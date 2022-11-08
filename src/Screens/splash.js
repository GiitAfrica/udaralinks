import React from 'react';
import {StatusBar} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Icon from '../Components/Icon';
import {hp, wp} from '../utils/dimensions';

class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Bg_view
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar hidden />
        <Icon
          icon={require('../assets/Icons/udara_logo.png')}
          style={{height: hp(10), width: wp(50)}}
        />
      </Bg_view>
    );
  };
}

export default Splash;
