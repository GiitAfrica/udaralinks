import React from 'react';
import {ScrollView} from 'react-native';
import Bg_view from './Bg_view';

class Swipe_indicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
    };
  }

  render_indicators = () => {
    let {count} = this.props;
    let {current} = this.state;

    let arr = new Array();
    for (let i = 0; i < count; i++) arr.push(null);

    return arr.map((i, j) => (
      <Bg_view
        key={j}
        style={{
          height: 5,
          width: current === j ? 30 : 15,
          borderRadius: 2,
          backgroundColor: current === j ? '#FF6905' : '#ccc',
          margin: 3,
        }}></Bg_view>
    ));
  };

  render = () => {
    return (
      // <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <Bg_view horizontal>{this.render_indicators()}</Bg_view>
      // </ScrollView>
    );
  };
}

export default Swipe_indicator;
