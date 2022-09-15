import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
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
    let {currency, balance, conversion_rate, navigation} = this.props;
    let {name, icon} = currency;

    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('wallet', {currency: name})}>
        <View>
          <Bg_view
            key={name}
            style={{
              paddingLeft: wp(4),
              paddingRight: wp(5.6),
              paddingVertical: hp(1.4),
              alignItems: 'flex-start',
              borderRadius: wp(4),
              minWidth: wp(24),
              margin: wp(2.8),
              elevation: 10,
              shadowColor: '#000',
            }}>
            <Icon icon={icon} style={{height: wp(8.5), width: wp(8.5)}} />
            <Fr_text
              opacity={0.8}
              capitalise
              size={wp(5)}
              style={{marginVertical: hp(0.7)}}>
              {name}
            </Fr_text>
            <Bg_view no_bg horizontal style={{alignItems: 'center'}}>
              <Fr_text bold size={wp(4)}>
                {Number(balance * conversion_rate).toFixed(2)}
              </Fr_text>
              <Fr_text bold> NGN</Fr_text>
            </Bg_view>
            <Bg_view no_bg horizontal style={{alignItems: 'center'}}>
              <Fr_text bold size={wp(4)}>
                {Number(balance).toFixed(2)}
              </Fr_text>
              <Fr_text bold capitalise>
                {' '}
                {name}
              </Fr_text>
            </Bg_view>
          </Bg_view>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default Currency;
