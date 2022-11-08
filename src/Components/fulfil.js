import React from 'react';
import {emitter, Sock_offer_status} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Line from './line';
import Offer from './offer';
import Small_btn from './small_button';

class Fulfil extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  true = async () => {
    let {offer, onsale, close_modal} = this.props;

    let res = await post_request('fulfil_offer', {
      offer: offer._id,
      onsale: onsale._id,
      buyer: offer.user?._id,
      seller: onsale.seller?._id,
    });
    Sock_offer_status(offer._id, 'awaiting confirmation', offer.user?._id);
    res
      ? emitter.emit('offer_fulfilled', {
          offer: offer._id,
          timestamp: res.timestamp,
        })
      : toast('Err, something went wrong.');

    close_modal();
  };

  false = () => this.props.close_modal();

  render = () => {
    let {close_modal, navigation, onsale, offer} = this.props;
    let {user} = offer;

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
              Fulfill
            </Fr_text>
            <Icon icon="close_icon.png" action={close_modal} />
          </Bg_view>
          <Line />
          <Fr_text
            style={{marginHorizontal: wp(5), marginBottom: hp(1)}}
            centralise
            size={wp(5)}>
            {`You are informing Udara that you have successfully fulfilled the transaction of said offer`}
          </Fr_text>
          <Offer
            offer={offer}
            user={user}
            onsale={onsale}
            navigation={navigation}
            no_foot
          />

          <Bg_view horizontal style={{justifyContent: 'center'}}>
            <Small_btn title="true" action={this.true} />
            <Small_btn inverted title="false" action={this.false} />
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  };
}

export default Fulfil;
