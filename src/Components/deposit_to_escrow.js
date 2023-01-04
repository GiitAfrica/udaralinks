import React from 'react';
import {emitter, Sock_offer_status} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Line from './line';
import Small_btn from './small_button';
import Topup from './topup';

class Deposit_to_escrow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  deposit = async () => {
    if (this.state.loading) return;

    this.setState({loading: true});
    let {onsale, offer, close_modal} = this.props;

    let {amount, offer_rate} = offer;

    let res = await post_request('deposit_to_escrow', {
      offer: offer._id,
      onsale: onsale._id,
      seller: onsale.seller?._id,
      buyer_wallet: offer.user.wallet,
    });

    Sock_offer_status(offer._id, 'in-escrow', onsale.seller?._id);

    if (res) {
      emitter.emit('deduct_wallet', {value: amount * offer_rate});
      emitter.emit('offer_deposit', {
        offer: offer._id,
        timestamp: res.timestamp,
      });
      res.transaction && emitter.emit('new_transaction', res.transaction);
    } else toast('Err, something went wrong.');

    this.setState({loading: false}, close_modal);
  };

  render = () => {
    let {loading} = this.state;
    let {onsale, offer, close_modal, wallet} = this.props;
    let {amount, offer_rate, user} = offer;
    let {alphabetic_name, seller} = onsale;

    let cost = amount * offer_rate;

    return (
      <Bg_view style={{padding: wp(4)}}>
        <Bg_view horizontal style={{justifyContent: 'space-between'}}>
          <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
            Confirm deposit
          </Fr_text>
          <Icon icon="close_icon.png" action={close_modal} />
        </Bg_view>
        <Line />
        <Bg_view
          style={{
            elevation: 5,
            shadowColor: '#000',
            padding: wp(4),
            borderRadius: wp(2.8),
            marginBottom: hp(1.4),
          }}>
          <Fr_text
            style={{marginHorizontal: wp(5), marginBottom: hp(1)}}
            centralise
            size={wp(5)}>
            Deposit to escrow account a cost of
          </Fr_text>
          <Fr_text bold centralise size={wp(6)}>{`${cost} NGN`}</Fr_text>
          <Bg_view
            style={{justifyContent: 'center', marginBottom: hp(1.4)}}
            horizontal>
            <Fr_text style={{marginTop: hp(1), marginRight: wp(1.4)}}>
              for
            </Fr_text>
            <Fr_text bold centralise size={wp(6)}>{`${amount} ${
              alphabetic_name || 'USD'
            }`}</Fr_text>
          </Bg_view>
        </Bg_view>
        <Bg_view
          style={{
            elevation: 5,
            shadowColor: '#000',
            padding: wp(4),
            borderRadius: wp(2.8),
          }}>
          <Fr_text centralise>Transaction between</Fr_text>
          <Line />
          <Bg_view horizontal style={{justifyContent: 'space-between'}}>
            <Bg_view horizontal flex>
              <Bg_view
                style={{
                  height: wp(7.5),
                  width: wp(7.5),
                  borderRadius: wp(7.5),
                  backgroundColor: '#ddd',
                }}
              />
              <Fr_text
                bold
                size={wp(3.8)}
                style={{marginLeft: wp(1.4)}}
                capitalise>
                {seller.username}
              </Fr_text>
            </Bg_view>
            <Fr_text>and</Fr_text>
            <Bg_view horizontal flex style={{justifyContent: 'flex-end'}}>
              <Fr_text
                bold
                size={wp(3.8)}
                style={{marginRight: wp(1.4)}}
                capitalise>
                {user.username}
              </Fr_text>
              <Bg_view
                style={{
                  height: wp(7.5),
                  width: wp(7.5),
                  borderRadius: wp(7.5),
                  backgroundColor: '#ddd',
                }}
              />
            </Bg_view>
          </Bg_view>
        </Bg_view>
        <Bg_view style={{marginVertical: hp(2.8)}}>
          <Bg_view horizontal style={{justifyContent: 'center'}}>
            {cost > wallet.naira ? (
              <Small_btn
                title="topup"
                action={() =>
                  this.coolmodal_topup &&
                  this.coolmodal_topup.toggle_show_modal()
                }
                style={{backgroundColor: 'purple', borderRadius: wp(2.8)}}
              />
            ) : (
              <Small_btn
                loading={loading}
                title="deposit"
                action={this.deposit}
              />
            )}
            <Small_btn inverted title="cancel" action={close_modal} />
          </Bg_view>
          <Bg_view horizontal style={{justifyContent: 'center'}}>
            <Fr_text
              style={{marginTop: hp(0.8)}}
              centralise>{`Current Balance: `}</Fr_text>
            <Fr_text bold>{wallet.naira}</Fr_text>
          </Bg_view>
        </Bg_view>

        <Cool_modal
          ref={coolmodal_topup => (this.coolmodal_topup = coolmodal_topup)}>
          <Topup default_value={cost - wallet.naira} />
        </Cool_modal>
      </Bg_view>
    );
  };
}

export default Deposit_to_escrow;
