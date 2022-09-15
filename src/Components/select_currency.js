import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Currencies from './currencies';
import Fr_text from './Fr_text';
import Icon from './Icon';

class Select_currency extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {selected_currency, exclude, select} = this.props;
    if (exclude && !Array.isArray(exclude)) exclude = new Array(exclude);

    return (
      <View>
        <TouchableNativeFeedback
          onPress={() =>
            this.cool_modal && this.cool_modal.toggle_show_modal()
          }>
          <View>
            <Bg_view
              horizontal
              style={{
                justifyContent: 'space-between',
                marginVertical: wp(5.6),
                padding: wp(5.6),
                borderRadius: wp(4),
                alignItems: 'center',
                elevation: 10,
                shadowColor: '#000',
              }}>
              <Fr_text opacity={0.8} size={wp(4.5)}>
                {selected_currency}
              </Fr_text>
              <Icon
                icon="forward_arrow_icon.png"
                style={{marginLeft: wp(2.8)}}
              />
            </Bg_view>
          </View>
        </TouchableNativeFeedback>

        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)} no_swipe>
          <Currencies
            select={select}
            exclude={exclude}
            close_modal={() =>
              this.cool_modal && this.cool_modal.toggle_show_modal()
            }
          />
        </Cool_modal>
      </View>
    );
  };
}

export default Select_currency;
