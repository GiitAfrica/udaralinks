import React from 'react';
import {emitter, fsk} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Loadindicator from './load_indicator';
import Stretched_button from './Stretched_button';

class Proceed_to_purchase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

  purchase = async () => {
    this.setState({loading: true});
    let {onsale, wallet, remove} = this.props;
    let {to_currency, from_currency, value} = onsale;
    let {purchase_value} = this.state;

    let response = await post_request('purchase_currency', {
      onsale: onsale._id,
      wallet: wallet._id,
      purchase_value,
    });

    if (response.onsale) {
      emitter.emit('new_transaction', response.transaction);
      emitter.emit('deduct_wallet', {
        currency: to_currency,
        value: purchase_value,
      });
      emitter.emit('top_wallet', {currency: from_currency, value});

      remove && remove();
    } else toast('Transaction failed.'), this.setState({loading: false});
  };

  render = () => {
    let {decorator, onsale, wallet} = this.props;
    let {purchase_value} = this.state;

    let {currencies} = wallet;
    let {from_currency, to_currency, value, seller} = onsale;

    return (
      <Bg_view
        style={{
          minHeight: hp(25),
          paddingHorizontal: wp(11.2),
          paddingVertical: hp(5.6),
          borderTopRightRadius: wp(7.5),
          borderTopLeftRadius: wp(7.5),
          backgroundColor: '#eee',
        }}>
        <Bg_view no_bg style={{alignItems: 'flex-end'}}>
          <Icon
            icon={require('../assets/Icons/close_icon.png')}
            action={decorator}
          />
        </Bg_view>
        <Fr_text
          bold="900"
          size={wp(6.2)}
          style={{marginBottom: hp(2.8)}}
          capitalise>
          proceed to purchase
        </Fr_text>
        <Fr_text bold italic size={wp(5)}>
          {`${value} ${
            currencies.find(curr => curr.name === from_currency).alphabetic_name
          }`}
        </Fr_text>
        <Bg_view
          style={{marginVertical: hp(1.4), alignItems: 'center'}}
          horizontal
          no_bg>
          <Fr_text style={{marginTop: hp(1)}} size={wp(4.5)}>
            {`From:  `}
          </Fr_text>
          <Fr_text bold size={wp(5)}>
            {`${seller.username}`}
          </Fr_text>
        </Bg_view>
        <Fr_text italic size={wp(5)}>
          For
        </Fr_text>
        <Fr_text bold size={wp(5)} style={{marginTop: hp(2)}}>{`${
          Number(purchase_value).toFixed(2) || '...'
        } ${
          currencies.find(curr => curr.name === to_currency).alphabetic_name
        }`}</Fr_text>

        {purchase_value ? (
          <Stretched_button title="proceed" action={this.purchase} />
        ) : (
          <Loadindicator />
        )}
      </Bg_view>
    );
  };
}

export default Proceed_to_purchase;
