import React from 'react';
import {Linking} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Text_btn from '../Components/Text_btn';
import {wp} from '../utils/dimensions';

class Privacy_policy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  more_info = async () => await Linking.openURL('https://udaralinks.com');

  render = () => {
    let {navigation} = this.props;

    return (
      <Bg_view flex>
        <Header title="privacy policy" navigation={navigation} />

        <Bg_view style={{margin: wp(4), alignItems: 'center'}}>
          <Fr_text centralise size={wp(4.5)}>
            For more information visit -
          </Fr_text>
          <Text_btn
            centralise
            accent
            italic
            text="udaralinks.com"
            size={wp(5)}
            action={this.more_info}
          />
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Privacy_policy;
