import React from 'react';
import {ActivityIndicator} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';

class Loadindicator extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {color, small, style} = this.props;

    return (
      <Bg_view
        no_bg
        style={{
          minHeight: hp(10),
          marginLeft: color ? wp(1.4) : null,
          justifyContent: 'center',
          ...style,
        }}>
        <ActivityIndicator
          color={color || '#FF6905'}
          size={color || small ? 'small' : 'large'}
        />
      </Bg_view>
    );
  };
}

export default Loadindicator;
