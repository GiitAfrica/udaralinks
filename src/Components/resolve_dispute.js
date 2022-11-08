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

class Resolve_dispute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  resolve = async () => {
    this.setState({loading: true});
    let {dispute, close_modal, navigation} = this.props;

    let res = await post_request('resolve_dispute', {
      offer: dispute.offer._id,
      onsale: dispute.offer.onsale,
    });
    Sock_offer_status(
      dispute.offer._id,
      dispute.offer.prior_offer_status,
      dispute.offer.seller,
    );
    if (res) {
      emitter.emit('resolve_dispute', dispute.offer._id);
      navigation.goBack();
      close_modal && close_modal();
    } else {
      toast("Couldn't resolve dispute at this time.");
      this.setState({loading: false});
    }
  };

  render() {
    let {loading} = this.state;
    let {user, navigation, dispute, onsale, close_modal} = this.props;

    return (
      <Bg_view
        shadowed
        style={{
          margin: wp(5.6),
          padding: wp(2.8),
          borderRadius: wp(4),
        }}>
        <Bg_view horizontal style={{justifyContent: 'space-between'}}>
          <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
            Resolve Dispute
          </Fr_text>
          <Icon icon="close_icon.png" action={close_modal} />
        </Bg_view>
        <Fr_text style={{marginVertical: hp(1.4)}} centralise>
          Proceed to resolve dispute with below offer:
        </Fr_text>
        <Offer
          user={user}
          offer={dispute.offer}
          navigation={navigation}
          onsale={onsale}
        />
        <Line />
        <Bg_view horizontal style={{justifyContent: 'center'}}>
          <Small_btn loading={loading} title="resolve" action={this.resolve} />
          <Small_btn inverted title="close" action={close_modal} />
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Resolve_dispute;
