import React from 'react';
import {View} from 'react-native';

class Bg_view extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {children, style, flex, accent, background_color, no_bg, horizontal} =
      this.props;

    if (!style) style = new Object();
    if (flex) style.flex = 1;
    if (accent) style.backgroundColor = '#FF6905';
    if (horizontal) style.flexDirection = 'row';
    if (background_color) style.backgroundColor = background_color;
    if (no_bg) style.backgroundColor = 'transparent';

    return <View style={{backgroundColor: '#fff', ...style}}>{children}</View>;
  };
}

export default Bg_view;
