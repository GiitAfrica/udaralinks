import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';

class Countdown extends React.Component {
  constructor(props) {
    super(props);

    let {timestamp} = this.props;
    this.state = {timestamp};
  }

  componentDidMount = () => {
    this.counter = setInterval(() => {
      let {timestamp} = this.state;
      if (timestamp <= Date.now()) clearInterval(this.counter);
      else this.setState({timestamp});
    }, 1000);
  };

  componentWillUnmount = () => clearInterval(this.counter);

  an_hour = 60 * 60;
  a_minute = 60;

  format = timestamp => {
    let now = Date.now();
    let diff = timestamp - now;

    if (diff <= 0) return null;
    diff = Math.floor(diff / 1000);
    let hours = Math.floor(diff / this.an_hour);
    diff -= hours * this.an_hour;
    let minutes = Math.floor(diff / this.a_minute);
    diff -= minutes * this.a_minute;

    let timestring = '';
    if (hours) timestring += `${String(hours).padStart(2, '0')}:`;
    if (minutes) timestring += `${String(minutes).padStart(2, '0')}:`;
    else timestring += '00:';

    timestring += `${String(diff).padStart(2, '0')}`;

    return timestring;
  };

  render() {
    let {timestamp} = this.state;

    return (
      <TouchableNativeFeedback onPress={this.props.on_touch}>
        <View>
          <Bg_view>
            <Fr_text>{this.format(timestamp)}</Fr_text>
          </Bg_view>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

export default Countdown;
