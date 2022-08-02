import React from 'react';
import {TextInput, ScrollView} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Currency_item from './currency_item';
import Icon from './Icon';
import List_empty from './list_empty';
import Loadindicator from './load_indicator';

class Currencies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let currencies = new Array(
      {name: 'Naira', symbol: 'N'},
      {name: 'USD Dollar', symbol: '$'},
    );
    setTimeout(() => {
      this.setState({currencies});
    }, 1500);
  };

  render = () => {
    let {close_modal, select} = this.props;
    console.log(this.props);
    let {currencies} = this.state;

    return (
      <Bg_view background_color="#eee" style={{paddingVertical: hp(2.8)}}>
        <Icon
          icon={require('./../Assets/Icons/close_icon.png')}
          action={() => close_modal && close_modal()}
          style={{alignSelf: 'flex-end', marginHorizontal: wp(5.6)}}
        />
        <Bg_view
          style={{
            borderColor: '#eee',
            borderWidth: 1,
            borderRadius: wp(2.8),
            height: hp(7.5),
            marginHorizontal: wp(5.6),
            alignItems: 'center',
            paddingHorizontal: wp(2.8),
          }}
          horizontal>
          <TextInput style={{flex: 1, paddingRight: wp(2.8)}} />
          <Icon icon={require('./../Assets/Icons/search_icon.png')} />
        </Bg_view>
        <ScrollView showVerticalScrollIndicator={false}>
          {currencies ? (
            currencies.length ? (
              currencies.map(currency => (
                <Currency_item
                  currency={currency}
                  select={select}
                  key={currency.name}
                />
              ))
            ) : (
              <List_empty text="No currencies" />
            )
          ) : (
            <Loadindicator />
          )}
        </ScrollView>
      </Bg_view>
    );
  };
}

export default Currencies;
