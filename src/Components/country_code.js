import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';

class Country_code extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    let {country_code, select} = this.props;
    let {code, flag, country} = country_code;

    return (
      <TouchableWithoutFeedback onPress={() => select && select(country_code)}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: wp(2.8),
            alignItems: 'center',
            borderBottomColor: '#ccc',
            borderBottomWidth: 0.5,
            marginHorizontal: wp(5.6),
          }}>
          <Icon
            icon={flag}
            style={{height: wp(12), width: wp(12), marginRight: wp(2.8)}}
          />
          <Bg_view>
            <Fr_text bold size={wp(4.5)} capitalise>
              {country}
            </Fr_text>
            <Fr_text style={{marginTop: hp(0.5)}} size={wp(3.5)}>
              ({code})
            </Fr_text>
          </Bg_view>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default Country_code;
