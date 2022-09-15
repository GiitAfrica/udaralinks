import React from 'react';
import Bg_view from './Bg_view';

class Swipe_indicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
    };
  }

  render_indicators = () => {
    let {count, circle} = this.props;
    let {current} = this.state;

    let arr = new Array();
    for (let i = 0; i < count; i++) arr.push(null);

    return arr.map((i, j) => (
      <Bg_view
        key={j}
        style={{
          height: circle ? 7.5 : 5,
          width: circle ? 7.5 : current === j ? 30 : 15,
          borderRadius: circle ? 7.5 : 2,
          backgroundColor: current === j ? '#FF6905' : circle ? '#333' : '#ccc',
          margin: 3,
        }}></Bg_view>
    ));
  };

  render = () => {
    if (!this.props.count) return null;

    return (
      <Bg_view no_bg horizontal>
        {this.render_indicators()}
      </Bg_view>
    );
  };
}

export default Swipe_indicator;
