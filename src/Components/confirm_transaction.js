import React from 'react';
import {emitter} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {capitalise} from '../utils/functions';
import {post_request} from '../utils/services';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Line from './line';
import Offer from './offer';
import Small_btn from './small_button';

class Confirm_transaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  confirm = async () => {
    let {offer, onsale, close_modal} = this.props;

    let res = await post_request('confirm_offer', {
      offer: offer._id,
      onsale: onsale._id,
      buyer: offer.user._id,
      seller: onsale.seller._id,
      seller_wallet: onsale.seller.wallet,
    });
    res
      ? emitter.emit('offer_confirmed', offer._id)
      : toast('Err, something went wrong.');

    close_modal();
  };

  decline = () => this.props.close_modal();

  render = () => {
    let {close_modal, user, onsale, navigation, offer} = this.props;

    return (
      <Bg_view>
        <Bg_view
          style={{
            elevation: 5,
            shadowColor: '#000',
            padding: wp(4),
            borderRadius: wp(2.8),
            marginBottom: hp(1.4),
            marginHorizontal: wp(2.8),
          }}>
          <Bg_view horizontal style={{justifyContent: 'space-between'}}>
            <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
              Confirm
            </Fr_text>
            <Icon icon="close_icon.png" action={close_modal} />
          </Bg_view>
          <Line />
          <Fr_text
            style={{marginHorizontal: wp(5), marginBottom: hp(1)}}
            centralise
            size={wp(5)}>
            {`You are confirming to transfer escrowed deposit to seller for completed transaction of said offer`}
          </Fr_text>
          <Offer
            offer={offer}
            user={user}
            onsale={onsale}
            navigation={navigation}
            no_foot
          />

          <Bg_view horizontal style={{justifyContent: 'center'}}>
            <Small_btn title="confirm" action={this.confirm} />
            <Small_btn inverted title="decline" action={this.decline} />
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Confirm_transaction;
