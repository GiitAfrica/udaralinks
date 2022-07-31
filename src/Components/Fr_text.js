import React from 'react';
import {Text} from 'react-native';
import {wp} from '../utils/dimensions';

class Fr_text extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {
      children,
      style,
      capitalise,
      accent,
      caps,
      size,
      color,
      centralise,
      bold,
      line_height,
      opacity,
    } = this.props;

    if (!style) style = new Object();
    if (capitalise || caps)
      style.textTransform = caps ? 'uppercase' : 'capitalize';
    if (color) style.color = color;
    if (accent) style.color = '#FF6905';
    if (bold) style.fontWeight = typeof bold === 'boolean' ? 'bold' : bold;
    if (size) style.fontSize = size;
    if (centralise) style.textAlign = 'center';
    if (line_height) style.lineHeight = line_height;
    if (opacity) style.opacity = opacity;

    return (
      <Text {...this.props} style={{fontSize: wp(4), color: '#000', ...style}}>
        {children}
      </Text>
    );
  };
}

export default Fr_text;