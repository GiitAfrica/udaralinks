import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';

class Currency_item extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {currency, select} = this.props;
    let {name, symbol} = currency;

    return (
      <TouchableNativeFeedback onPress={() => select && select(currency)}>
        <View>
          <Bg_view
            no_bg
            horizontal
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: wp(5.6),
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}>
            <Fr_text size={wp(5)} opacity={0.8}>
              {name}
            </Fr_text>
            <Fr_text>{symbol}</Fr_text>
            {/* <Icon icon={require('./../Assets/Icons/' + currency.symbol)} /> */}
          </Bg_view>
        </View>
      </TouchableNativeFeedback>
    );
  };
}

export default Currency_item;
