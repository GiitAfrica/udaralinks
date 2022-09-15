import React from 'react';
import {hp, wp} from '../utils/dimensions';
import {sentence} from '../utils/functions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';

class Onboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {onboard} = this.props;
    let {main_text, sub_text, icon} = onboard;

    return (
      <Bg_view style={{alignItems: 'center', marginTop: 100, width: wp()}}>
        <Icon icon={icon} style={{width: wp(85), height: hp(30)}} />
        <Bg_view style={{marginTop: 40, alignItems: 'center'}}>
          <Fr_text capitalise bold size={wp(5)}>
            {main_text}
          </Fr_text>
          <Fr_text
            size={wp(4.5)}
            style={{paddingHorizontal: 80, marginTop: 20}}
            centralise>
            {sentence(sub_text)}
          </Fr_text>
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Onboard;
