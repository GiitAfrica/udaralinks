import React from 'react';
import {StatusBar} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';

class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Bg_view
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar hidden />
        <Fr_text style={{fontSize: 32, fontWeight: 'bold'}} accent>
          UDARA
        </Fr_text>
      </Bg_view>
    );
  };
}

export default Splash;
