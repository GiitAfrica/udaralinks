import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Buy from './buy';
import Cool_modal from './cool_modal';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Line from './line';

class Buy_filter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {filter, set_buy_filter} = this.props;
    if (!filter) return null;

    let {currency_full, value} = filter;

    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => this.buy_modal?.toggle_show_modal()}>
          <View>
            <Bg_view
              shadowed
              style={{
                alignSelf: 'center',
                padding: wp(4),
                marginVertical: hp(1),
                borderRadius: wp(4),
              }}>
              <Fr_text centralise>Buy Filter</Fr_text>
              <Line />
              <Bg_view horizontal>
                <Icon
                  icon={currency_full.icon}
                  style={{height: wp(15), width: wp(15)}}
                />
                <Bg_view style={{marginLeft: wp(1.4)}}>
                  <Fr_text bold size={wp(5)}>
                    {`${value} ${currency_full.alphabetic_name}`}
                  </Fr_text>
                </Bg_view>
              </Bg_view>
            </Bg_view>
          </View>
        </TouchableWithoutFeedback>

        <Cool_modal ref={buy_modal => (this.buy_modal = buy_modal)}>
          <Buy
            default_value={{currency: currency_full, value}}
            close_modal={this.buy_modal?.toggle_show_modal}
            set_filter={set_buy_filter}
          />
        </Cool_modal>
      </View>
    );
  }
}

export default Buy_filter;
