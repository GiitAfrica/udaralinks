import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Line from './line';
import Offer from './offer';

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  month_mapper = {
    0: 'JAN',
    1: 'FEB',
    2: 'MAR',
    3: 'APR',
    4: 'MAY',
    5: 'JUN',
    6: 'JUL',
    7: 'AUG',
    8: 'SEP',
    9: 'OCT',
    10: 'NOV',
    11: 'DEC',
  };

  render_data = () => {
    let {notification, user, navigation} = this.props;
    let {data} = notification;

    return (
      <Offer
        offer={data.find(d => d && d._id && d._id.startsWith('offer'))}
        onsale={data.find(d => d && d._id && d._id.startsWith('onsale'))}
        message={data.find(d => d && d._id && d._id.startsWith('message'))}
        navigation={navigation}
        user={user}
      />
    );
  };

  format_timestamp = timestamp => {
    let date = new Date(timestamp);

    return `${this.month_mapper[date.getMonth()]}, ${String(
      date.getDate(),
    ).padStart(2, '0')} ${date.getUTCFullYear()}, ${String(
      date.getHours(),
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  render = () => {
    let {notification} = this.props;
    let {title, created} = notification;

    return (
      <Bg_view
        style={{
          padding: wp(5.6),
          borderBottomWidth: 0.5,
          borderBottomColor: '#aaa',
        }}>
        <Bg_view
          horizontal
          style={{justifyContent: 'space-between', marginBottom: hp(1)}}>
          <Fr_text bold capitalise>
            {title}
          </Fr_text>
          <Fr_text size={wp(3)} color="#999">
            {this.format_timestamp(created)}
          </Fr_text>
        </Bg_view>
        {this.render_data()}

        <Line />
      </Bg_view>
    );
  };
}

export default Notification;
