import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Select_currency from './select_currency';

class Switch_currencies_to_sell extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {
      from_currency,
      to_currency,
      set_to_currency,
      set_from_currency,
      toggle,
    } = this.props;
    return (
      <Bg_view
        style={{
          minHeight: hp(25),
          paddingHorizontal: wp(11.2),
          paddingVertical: hp(5.6),
          borderTopRightRadius: wp(7.5),
          borderTopLeftRadius: wp(7.5),
        }}>
        <Bg_view no_bg style={{alignItems: 'flex-end'}}>
          <Icon icon="close_icon.png" action={toggle} />
        </Bg_view>
        <Fr_text
          bold="900"
          size={wp(6.2)}
          style={{marginBottom: hp(2.8)}}
          capitalise>
          change currency
        </Fr_text>
        <Fr_text size={wp(5.6)} opacity={0.8}>
          From
        </Fr_text>
        <Select_currency
          selected_currency={from_currency}
          exclude="naira"
          select={set_from_currency}
        />
        <Fr_text size={wp(5.6)} opacity={0.8}>
          To
        </Fr_text>
        <Select_currency
          selected_currency={to_currency}
          exclude={from_currency}
          select={set_to_currency}
        />
      </Bg_view>
    );
  };
}

export default Switch_currencies_to_sell;
