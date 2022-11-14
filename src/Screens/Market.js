import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {ScrollView} from 'react-native';
import {User} from '../../Udara';
import Amount_to_sell from '../Components/amount_to_sell';
import Bg_view from '../Components/Bg_view';
import Buy from '../Components/buy';
import Buy_filter from '../Components/buy_filter';
import Cool_modal from '../Components/cool_modal';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Line from '../Components/line';
import List_empty from '../Components/list_empty';
import Loadindicator from '../Components/load_indicator';
import Onsale_currency from '../Components/onsale_currency';
import Search_input from '../Components/search_input';
import Small_btn from '../Components/small_button';
import {filter} from '../Components/transactions';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';

class Market extends React.Component {
  constructor(props) {
    super(props);

    let {route} = this.props;
    let {buy_filter} = route?.params || {};
    this.state = {
      buy_filter,
    };
  }

  set_buy_filter = buy_filter =>
    this.setState({buy_filter}, this.fetch_currencies);

  fetch_currencies = async refreshing => {
    if (refreshing) {
      toast('Refreshing...');
      this.onsales = this.state.onsales;
      this.setState({onsales: null});
    }
    let {buy_filter, my_sales} = this.state;
    if (!buy_filter) {
      buy_filter = await AsyncStorage.getItem('buy_filter');
      if (buy_filter) {
        buy_filter = JSON.parse(buy_filter);
        buy_filter.currency = buy_filter.currency_full?.name;
        buy_filter.purpose = buy_filter.purpose_full?._id;
      }
    }
    let onsales = await post_request(
      my_sales ? `my_sales/${this.loggeduser._id}` : 'onsale',
      my_sales
        ? null
        : {
            currency: buy_filter?.currency,
            value: Number(buy_filter?.value),
            purposes: buy_filter?.purpose,
          },
    );

    this.setState({onsales, buy_filter});
  };

  componentDidMount = () => {
    let {navigation} = this.props;
    navigation.addListener('focus', p => {
      let {route} = this.props;
      let {buy_filter} = route?.params || {};
      this.setState({buy_filter}, this.fetch_currencies);
    });
  };

  toggle_search = () =>
    this.setState({show_search: !this.state.show_search, search_value: ''});

  set_search_value = search_value => this.setState({search_value});

  clear_search = () => this.setState({search_value: ''});

  my_sales = () => {
    let {my_sales} = this.state;
    this.setState({my_sales: !my_sales, onsales: null}, this.fetch_currencies);
  };

  buy = () => this.buy_modal?.toggle_show_modal();

  sell = () => this.cool_modal_sell_value?.toggle_show_modal();

  render_buttons = () => {
    let {my_sales} = this.state;

    return (
      <Bg_view no_bg style={{justifyContent: 'center'}} horizontal>
        <Small_btn
          title="sell"
          inverted
          action={this.sell}
          style={{
            minWidth: null,
            paddingHorizontal: wp(2.8),
            margin: 0,
          }}
          icon={
            <Icon
              icon="buy_wine_colour_icon.png"
              style={{height: wp(5), width: wp(5), marginLeft: wp(1)}}
            />
          }
        />
        <Small_btn
          title="buy"
          style={{
            minWidth: null,
            paddingHorizontal: wp(2.8),
          }}
          action={this.buy}
          icon={
            <Icon
              icon="receive_white_icon.png"
              style={{height: wp(5), width: wp(5), marginLeft: wp(1.4)}}
            />
          }
        />
        <Small_btn
          inverted={!my_sales}
          title="my sales"
          action={this.my_sales}
          style={{
            minWidth: null,
            paddingHorizontal: wp(2.8),
            margin: 0,
          }}
          right_icon={
            my_sales ? null : (
              <Icon
                icon="filter_icon.png"
                style={{
                  height: wp(4),
                  width: wp(4),
                  marginRight: wp(1.4),
                }}
              />
            )
          }
        />
      </Bg_view>
    );
  };

  render = () => {
    let {navigation} = this.props;
    let {onsales, buy_filter, search_value, my_sales, show_search} = this.state;
    if (search_value)
      onsales = onsales?.filter(curr => filter(curr, search_value));

    return (
      <User.Consumer>
        {user => {
          this.loggeduser = user;

          return (
            <Bg_view flex style={{paddingTop: wp(5.6)}}>
              <Fr_text style={{marginHorizontal: wp(5.6)}} accent capitalise>
                udara
              </Fr_text>
              <Bg_view
                horizontal
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: wp(5.6),
                }}>
                <Bg_view flex>
                  <Fr_text capitalise bold="900" size={wp(7.5)}>
                    market place
                  </Fr_text>
                  <Fr_text capitalise size={wp(4.5)}>
                    offer list
                  </Fr_text>
                </Bg_view>
                <Icon
                  icon={require('../../android/app/src/main/assets/Icons/chat_send_icon.png')}
                  action={() => navigation.navigate('buyer_offers')}
                />
                <Icon
                  icon={require('../../android/app/src/main/assets/Icons/refresh.png')}
                  action={() => this.fetch_currencies(true)}
                />
                <Icon
                  icon={
                    show_search
                      ? require('../../android/app/src/main/assets/Icons/close_icon.png')
                      : require('../../android/app/src/main/assets/Icons/search_icon.png')
                  }
                  action={this.toggle_search}
                />
              </Bg_view>
              {show_search ? (
                <Search_input
                  style={{paddingHorizontal: wp(5.6)}}
                  search_value={search_value}
                  set_search_value={this.set_search_value}
                  clear_search={this.clear_search}
                />
              ) : null}

              {this.render_buttons()}

              <Line />

              <ScrollView showsVerticalScrollIndicator={false}>
                <Bg_view no_bg style={{paddingTop: hp(2.8)}}>
                  {onsales ? (
                    onsales.length ? (
                      onsales.map(onsale => (
                        <Onsale_currency
                          onsale={onsale}
                          user={user}
                          key={onsale._id}
                          navigation={navigation}
                        />
                      ))
                    ) : (
                      <List_empty
                        data={
                          my_sales ? null : (
                            <Buy_filter
                              filter={buy_filter}
                              set_buy_filter={this.set_buy_filter}
                            />
                          )
                        }
                        text={
                          my_sales
                            ? "You don't have any currency onsale"
                            : 'No currencies on the market yet.'
                        }
                      />
                    )
                  ) : (
                    <Loadindicator />
                  )}
                </Bg_view>
              </ScrollView>

              <Cool_modal ref={buy_modal => (this.buy_modal = buy_modal)}>
                <Buy
                  default_value={
                    buy_filter
                      ? {
                          currency: buy_filter.currency_full,
                          value: String(buy_filter.value),
                          purpose: buy_filter.purpose_full,
                        }
                      : null
                  }
                  close_modal={this.buy_modal?.toggle_show_modal}
                  set_filter={this.set_buy_filter}
                />
              </Cool_modal>

              <Cool_modal
                ref={cool_modal_sell_value =>
                  (this.cool_modal_sell_value = cool_modal_sell_value)
                }>
                <Amount_to_sell
                  user={user}
                  close_modal={this.sell}
                  navigation={navigation}
                />
              </Cool_modal>
            </Bg_view>
          );
        }}
      </User.Consumer>
    );
  };
}

export default Market;
