import React from 'react';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Line from './line';

class Transaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    let {transaction} = this.props;
    let {status, from_currency, to_currency, from_value, to_value} =
      transaction;

    return (
      <Bg_view style={{padding: wp(2.8)}}>
        <Bg_view
          style={{justifyContent: 'space-between', alignItems: 'center'}}
          horizontal>
          <Bg_view>
            <Fr_text
              elipseSizeMode="tail"
              size={wp(5)}>{`${from_currency} to ${to_currency}`}</Fr_text>
            <Fr_text capitalise bold>
              {status}
            </Fr_text>
          </Bg_view>
          <Bg_view style={{marginLeft: wp(2.8)}}>
            <Fr_text>{`$ ${from_value}`}</Fr_text>
            <Fr_text capitalise bold size={wp(5)}>{`N ${to_value}`}</Fr_text>
          </Bg_view>
        </Bg_view>
        <Line />
      </Bg_view>
    );
  };
}

export default Transaction;
