import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';

class Onsale_currency extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  currency_et_icon = {
    dollar: require('./../Assets/Icons/dollar_icon.png'),
    pound: require('./../Assets/Icons/pound_icon.png'),
  };

  render = () => {
    let {onsale} = this.props;
    let {currency, value, seller} = onsale;

    return (
      <Bg_view
        horizontal
        style={{
          justifyContent: 'space-between',
          padding: wp(4),
          marginBottom: hp(1.4),
          borderRadius: wp(4),
        }}>
        <Fr_text capitalise>{seller.fullname}</Fr_text>
        <Bg_view no_bg horizontal style={{alignItems: 'center'}}>
          <Icon icon={this.currency_et_icon[currency]} />
          <Fr_text bold size={wp(4.5)}>
            {value}
          </Fr_text>
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Onsale_currency;
