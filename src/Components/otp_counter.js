import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Text_btn from './Text_btn';

class Otp_counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = new Object();
  }

  componentDidMount = () => {
    this.setState({counter: 60});
    this.run_counter();
  };

  componentWillUnmount = ()=>{
    clearInterval(this.counting);
  }

  run_counter = () => {
    this.counting = setInterval(() => {
      let {counter} = this.state;
      if (counter) counter -= 1;
      else clearInterval(this.counting);

      this.setState({counter});
    }, 1000);
  };

  restart_counter = () => {
    this.setState({counter: 60});
    this.run_counter();
  };

  render = () => {
    let {resend_otp} = this.props;
    let {counter} = this.state;

    return (
      <Bg_view no_bg style={{marginTop: hp(2)}}>
        {counter ? (
          <Fr_text size={wp(4)} opacity={0.8}>
            {`Resend Code in ${
              counter === 60
                ? '1:00s'
                : `0:${counter.toString().padStart(2, '0')}s`
            }`}
          </Fr_text>
        ) : (
          <Text_btn
            text="Resend"
            action={() => {
              resend_otp && resend_otp();
              this.restart_counter();
            }}
          />
        )}
      </Bg_view>
    );
  };
}

export default Otp_counter;
