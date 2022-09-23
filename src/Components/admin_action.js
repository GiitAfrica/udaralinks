import React from 'react';
import {emitter} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Line from './line';
import Offer from './offer';
import Small_btn from './small_button';

class Admin_action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  proceed = async () => {
    let {offer, onsale, navigation, close_modal} = this.props;

    let refund_token = await post_request('refund_buyer', {
      onsale: onsale._id,
      offer: offer._id,
    });

    if (refund_token && refund_token.offer === offer._id) {
      emitter.emit('offer_status_update', {offer: offer._id, status: 'closed'});
      emitter.emit('new_transaction', refund_token.transaction);
      close_modal();
      navigation.goBack();
    } else toast('Something went wrong.');
  };

  render() {
    let {close_modal, user, navigation, onsale, offer} = this.props;

    return (
      <Bg_view style={{padding: wp(4)}}>
        <Bg_view horizontal style={{justifyContent: 'space-between'}}>
          <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
            Settle Dispute
          </Fr_text>
          <Icon icon="close_icon.png" action={close_modal} />
        </Bg_view>
        <Line />
        <Bg_view
          shadowed
          style={{
            padding: wp(4),
            borderRadius: wp(2.8),
            marginBottom: hp(1.4),
          }}>
          <Fr_text
            style={{marginHorizontal: wp(5), marginBottom: hp(1)}}
            centralise
            size={wp(5)}>
            Proceed to transfer buyer's deposit for below offer in escrow
            account into wallet
          </Fr_text>

          <Offer
            user={user}
            onsale={onsale}
            offer={offer}
            admin_in_dispute
            no_foot
            navigation={navigation}
          />

          <Bg_view horizontal style={{justifyContent: 'center'}}>
            <Small_btn title="proceed" action={this.proceed} />
            <Small_btn title="cancel" inverted action={close_modal} />
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Admin_action;
