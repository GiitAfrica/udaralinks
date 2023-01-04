import React from 'react';
import {KeyboardAvoidingView, ScrollView, TextInput} from 'react-native';
import {emitter, Sock_offer_status} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Line from '../Components/line';
import Offer from '../Components/offer';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';

class Submit_dispute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {title: '', details: ''};
  }

  set_title = title => this.setState({title});

  set_details = details => this.setState({details});

  submit_dispute = async () => {
    let {navigation, route} = this.props;
    let {offer, user, onsale} = route.params;
    let {title, details, loading} = this.state;
    if (loading) return;

    this.setState({loading: true});

    let dispute = {
      title,
      details,
      offer: offer._id,
      seller: offer.seller,
      buyer: user._id,
      onsale: onsale._id,
      initiator: user._id,
      currency: onsale.currency,
      prior_offer_status: offer.status,
    };

    let res = await post_request('offer_in_dispute', dispute);
    Sock_offer_status(offer._id, 'in-dispute', onsale.seller?._id);

    if (res._id) {
      dispute._id = res._id;
      emitter.emit('offer_in_dispute', {offer: offer._id});
      navigation.goBack();
    } else {
      toast("Couldn't place dispute");
      this.setState({loading: false});
    }
  };

  render() {
    let {navigation, route} = this.props;
    let {offer, user, onsale} = route.params;
    let {title, details, loading} = this.state;

    return (
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#fff'}}>
        <Header title="submit dispute" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Offer
            offer={offer}
            user={user}
            onsale={onsale}
            navigation={navigation}
          />

          <Line />

          <Bg_view>
            <Bg_view
              shadowed
              style={{margin: wp(4), padding: wp(2.8), borderRadius: wp(4)}}>
              <Fr_text accent>Title</Fr_text>
              <Bg_view horizontal style={{alignItems: 'center'}}>
                <TextInput
                  placeholder="Title..."
                  value={title}
                  onChangeText={this.set_title}
                  style={{
                    flex: 1,
                    fontSize: wp(5),
                    color: '#000',
                  }}
                />
              </Bg_view>
            </Bg_view>

            <Bg_view
              shadowed
              style={{margin: wp(4), padding: wp(2.8), borderRadius: wp(4)}}>
              <Fr_text accent>Details</Fr_text>
              <Bg_view
                horizontal
                style={{alignItems: 'center', marginBottom: hp(1.4)}}>
                <TextInput
                  placeholder="Details..."
                  value={details}
                  multiline
                  onChangeText={this.set_details}
                  style={{
                    flex: 1,
                    fontSize: wp(5),
                    minHeight: hp(10),
                    color: '#000',
                  }}
                />
              </Bg_view>
            </Bg_view>
          </Bg_view>

          <Stretched_button
            disabled={!details || !title}
            action={this.submit_dispute}
            title="submit"
            loading={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default Submit_dispute;
