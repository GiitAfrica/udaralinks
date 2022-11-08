import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';

const Purpose = ({purpose, select}) => {
  let {title, _id, icon} = purpose;

  return (
    <TouchableNativeFeedback onPress={() => select && select(title, purpose)}>
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
          <Fr_text capitalise size={wp(5)} opacity={0.8}>
            {title}
          </Fr_text>
          {icon ? (
            <Icon icon={icon} style={{height: wp(7.5), width: wp(7.5)}} />
          ) : null}
        </Bg_view>
      </View>
    </TouchableNativeFeedback>
  );
};

export default Purpose;
