import React from 'react';
import {FlatList} from 'react-native';
import {emitter} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import List_empty from './list_empty';
import Loadindicator from './load_indicator';
import Search_input from './search_input';
import Text_btn from './Text_btn';
import Transaction from './transaction';

const filter = (item, search_value) => {
  if (!search_value) return true;
  else if (typeof search_value !== 'string') return false;

  let sv = search_value.toLowerCase().split();
  for (const prop in item)
    for (let s = 0; s < sv.length; s++)
      if (String(item[prop]).includes(sv[s])) return true;
};

class Transactions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      transactions: new Object(),
      mounts: {naira: true, dollar: true, euro: true, pound: true},
    };
  }

  fetch_transactions = async (mount, from_parent) => {
    if (from_parent && this.state.transactions[this.props.active_currency])
      return;

    let {user, active_currency} = this.props;
    let {transactions: transactions_} = this.state;
    if (this.state[`has_no_more_${active_currency}`] && !mount) return;
    !mount && this.setState({refreshing: true});

    let transactions = transactions_[active_currency] || new Array();
    let txs = await post_request('transactions', {
      wallet: user.wallet._id,
      currency: 'naira',
      reset_pager: !!mount ? this.state.mounts[active_currency] : undefined,
    });

    if (!Array.isArray(txs))
      return this.setState({
        refreshing: false,
        empty_msg: 'Cannot fetch transactions at the moment.',
      });

    txs = txs.filter(tx => !transactions.find(t => t._id === tx._id));

    transactions = new Array(...transactions, ...txs);

    transactions = transactions.sort((t1, t2) => t1.created < t2.created);
    this.setState({
      transactions: {...transactions_, [active_currency]: transactions},
      [`has_no_more_${active_currency}`]: !txs.length,
      refreshing: false,
      empty_msg: '',
      mounts: {...this.state.mounts, [active_currency]: mount},
    });
  };

  componentDidMount = async () => {
    await this.fetch_transactions(true);

    this.new_transaction = transaction => {
      let {transactions: transactions_} = this.state;
      let {active_currency} = this.props;

      let transactions = transactions_[active_currency] || new Array();
      transactions = new Array(transaction, ...transactions);
      this.setState({
        transactions: {...transactions_, [active_currency]: transactions},
      });
    };
    emitter.listen('new_transaction', this.new_transaction);
  };

  componentWillUnmount = () => {
    emitter.remove_listener('new_transaction', this.new_transaction);
  };

  toggle_search_transactions = () => {
    this.setState({
      search_transactions: !this.state.search_transactions,
      search_value: '',
    });
  };

  set_search_value = search_value => this.setState({search_value});

  clear_search = () => this.setState({search_value: ''});

  refresh = async () => await this.fetch_transactions(true);

  render() {
    let {user, active_currency} = this.props;

    let {conversion_rates} = user.wallet;
    let {
      transactions: transactions_,
      search_value,
      search_transactions,
      refreshing,
      empty_msg,
    } = this.state;
    let transactions = transactions_[active_currency],
      has_no_more = this.state[`has_no_more_${active_currency}`];

    if (search_value)
      transactions =
        transactions && transactions.filter(tx => filter(tx, search_value));

    return (
      <Bg_view
        style={{
          marginVertical: hp(2.8),
          paddingHorizontal: wp(5.6),
        }}>
        <Bg_view
          horizontal
          style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <Fr_text capitalise bold size={wp(5)}>
            transaction history
          </Fr_text>
          <Bg_view horizontal style={{alignItems: 'center'}}>
            <Icon
              icon="refresh.png"
              action={() => this.fetch_transactions(true)}
            />
            {transactions && transactions.length ? (
              <Icon
                icon={
                  search_transactions ? 'close_icon.png' : 'search_icon.png'
                }
                action={this.toggle_search_transactions}
              />
            ) : null}
          </Bg_view>
        </Bg_view>
        {search_transactions ? (
          <Search_input
            search_value={search_value}
            set_search_value={this.set_search_value}
            clear_search={this.clear_search}
          />
        ) : null}
        <Bg_view>
          {empty_msg ? (
            <List_empty text={empty_msg} />
          ) : transactions ? (
            <FlatList
              data={transactions}
              fadingEdgeLength={0.2}
              keyExtractor={item => item?._id}
              renderItem={({item}) => (
                <Transaction
                  transaction={item}
                  user={user}
                  conversion_rates={conversion_rates}
                />
              )}
              ListEmptyComponent={
                <List_empty text="You don't have any transaction at the moment." />
              }
              // onEndReached={this.refresh}
              onEndReachedThreshold={0.2}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Loadindicator />
          )}
          {refreshing ? (
            <Loadindicator />
          ) : has_no_more ? null : (
            <Text_btn
              text={empty_msg ? 'try again' : 'load more'}
              action={this.refresh}
              disabled={has_no_more}
              bold
              capitalise
              italic
              size={wp(4)}
              style={{alignItems: 'center', paddingVertical: hp(1.4)}}
            />
          )}
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Transactions;
export {filter};
