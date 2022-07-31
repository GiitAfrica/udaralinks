import React from 'react';
import {TextInput} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import {sentence} from '../utils/functions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';

class Text_input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let {label, placeholder, type, on_change_text, value} = this.props;

    return (
      <Bg_view style={{marginBottom: hp(4)}}>
        {label && (
          <Fr_text
            size={wp(4.5)}
            style={{textDecorationLine: 'underline'}}
            capitalise>
            {label}
          </Fr_text>
        )}
        <Bg_view
          style={{
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#ccc',
          }}>
          <TextInput
            placeholder={placeholder && sentence(placeholder)}
            placeholderStyle={{fontStyle: 'italic'}}
            keyboardType={type || 'default'}
            onChangeText={on_change_text}
            value={value}
            style={{
              flex: 1,
              fontSize: wp(4.5),
              color: 'maroon',
              marginRight: wp(1.4),
              width: '100%',
              fontWeight: 'bold',
            }}
          />
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Text_input;
