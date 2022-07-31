import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';

class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    let {currency} = this.props;
    let {name, balances, icon} = currency;

    return (
      <Bg_view
        key={name}
        style={{
          paddingLeft: wp(4),
          paddingRight: wp(5.6),
          paddingVertical: hp(1.4),
          alignItems: 'flex-start',
          borderRadius: wp(4),
          minWidth: wp(24),
        }}>
        <Icon icon={icon} />
        <Fr_text
          opacity={0.8}
          capitalise
          size={wp(5)}
          style={{marginVertical: hp(0.7)}}>
          {name}
        </Fr_text>
        <Bg_view no_bg horizontal style={{alignItems: 'center'}}>
          <Fr_text bold size={wp(4)}>
            {balances.ngn}
          </Fr_text>
          <Fr_text> NGN</Fr_text>
        </Bg_view>
        <Bg_view no_bg horizontal style={{alignItems: 'center'}}>
          <Fr_text bold size={wp(4)}>
            {balances.base}
          </Fr_text>
          <Fr_text capitalise> {name}</Fr_text>
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Currency;
