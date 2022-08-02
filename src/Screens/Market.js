import React from 'react';
import {ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import List_empty from '../Components/list_empty';
import Loadindicator from '../Components/load_indicator';
import Onsale_currency from '../Components/onsale_currency';
import Small_btn from '../Components/small_button';
import {hp, wp} from '../utils/dimensions';

class Market extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    let onsale_currencies = new Array(
      {
        seller: {_id: 1, fullname: 'davids paul'},
        value: 100000,
        currency: 'dollar',
      },
      {
        seller: {_id: 2, fullname: 'davids paul'},
        value: 8000,
        currency: 'pound',
      },
    );

    setTimeout(() => {
      this.setState({onsale_currencies});
    }, 1500);
  };

  naira = () => {};

  buy = () => {};

  filter = () => {};

  render = () => {
    let {onsale_currencies} = this.state;

    return (
      <Bg_view background_color="#eee" flex style={{padding: wp(5.6)}}>
        <Fr_text accent capitalise>
          udara
        </Fr_text>
        <Fr_text capitalise bold="900" size={wp(7.5)}>
          market place
        </Fr_text>
        <Fr_text capitalise size={wp(4.5)}>
          offer list
        </Fr_text>
        <Bg_view
          no_bg
          style={{paddingVertical: hp(2.8), justifyContent: 'space-evenly'}}
          horizontal>
          <Small_btn
            title="buy"
            action={this.buy}
            style={{minWidth: null, paddingHorizontal: wp(2.8), margin: 0}}
            icon={
              <Icon
                icon={require('./../Assets/Icons/buy_wine_colour_icon.png')}
                style={{height: wp(4), width: wp(4), marginLeft: wp(2.8)}}
              />
            }
          />
          <Small_btn
            title="naira"
            style={{minWidth: null, paddingHorizontal: wp(2.8), margin: 0}}
            inverted
            action={this.naira}
            right_icon={
              <Icon
                icon={require('./../Assets/Icons/bank_icon.png')}
                style={{height: wp(4), width: wp(4), marginRight: wp(1.4)}}
              />
            }
            icon={
              <Icon
                icon={require('./../Assets/Icons/buy_wine_colour_icon.png')}
                style={{height: wp(4), width: wp(4), marginLeft: wp(1.4)}}
              />
            }
          />
          <Small_btn
            inverted
            title="filter"
            action={this.filter}
            style={{minWidth: null, paddingHorizontal: wp(2.8), margin: 0}}
            right_icon={
              <Icon
                icon={require('./../Assets/Icons/filter_icon.png')}
                style={{height: wp(4), width: wp(4), marginRight: wp(1.4)}}
              />
            }
          />
        </Bg_view>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Bg_view no_bg>
            {onsale_currencies ? (
              onsale_currencies.length ? (
                onsale_currencies.map(onsale_currency => (
                  <Onsale_currency
                    onsale={onsale_currency}
                    key={onsale_currency._id}
                  />
                ))
              ) : (
                <List_empty text="No currencies on the market yet." />
              )
            ) : (
              <Loadindicator />
            )}
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  };
}

export default Market;
