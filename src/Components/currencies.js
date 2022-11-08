import React from 'react';
import {TextInput, ScrollView} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import {get_request} from '../utils/services';
import Bg_view from './Bg_view';
import Currency_item from './currency_item';
import Icon from './Icon';
import List_empty from './list_empty';
import Loadindicator from './load_indicator';
import Search_input from './search_input';

class Currencies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let currencies = await get_request('currencies');
    this.setState({currencies});
  };

  clear_search = () => this.setState({search_value: ''});

  set_search_value = search_value => this.setState({search_value});

  render = () => {
    let {close_modal, select, exclude} = this.props;
    let {currencies, search_value} = this.state;

    if (!exclude) exclude = new Array();

    return (
      <Bg_view
        style={{
          paddingVertical: hp(2.8),
          elevation: 10,
          shadowColor: '#000',
          maxHeight: hp(),
        }}>
        <Icon
          icon={require('../assets/Icons/close_icon.png')}
          action={() => close_modal && close_modal()}
          style={{
            alignSelf: 'flex-end',
            marginHorizontal: wp(5.6),
          }}
        />
        <Search_input
          search_value={search_value}
          set_search_value={this.set_search_value}
          clear_search={this.clear_search}
          no_autofocus
        />
        <ScrollView showVerticalScrollIndicator={false}>
          {currencies ? (
            currencies.length ? (
              currencies.map(currency =>
                exclude.includes(currency.name) ||
                (search_value &&
                  !currency.name
                    .toLowerCase()
                    .includes(search_value.toLowerCase().trim())) ? null : (
                  <Currency_item
                    currency={currency}
                    select={(currency, full) => {
                      select(currency, full);
                      close_modal && close_modal();
                    }}
                    key={currency.name}
                  />
                ),
              )
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
