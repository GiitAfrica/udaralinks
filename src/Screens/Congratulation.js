import React from 'react';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';

class Congratulation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <Bg_view style={{alignItems: 'center'}} flex>
        <Icon icon={require('./../Assets/Icons/Verification_2.png')} />

        <Fr_text bold="900" size={wp(7)} color="maroon">
          Congratulation!
        </Fr_text>

        <Bg_view
          style={{
            width: wp(86),
            marginTop: hp(12.5),
          }}>
          <Stretched_button title="done!" />
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Congratulation;
