import React from 'react';
import {FlatList, ScrollView, TextInput, View} from 'react-native';
import {Admin_id} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import Line from '../Components/line';
import Loadindicator from '../Components/load_indicator';
import Offer from '../Components/offer';
import Send_offer from '../Components/send_offer';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {capitalise} from '../utils/functions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import Verified_token from './verifed_token';

class Onsale_details extends React.Component {
  constructor(props) {
    super(props);

    let {onsale} = this.props.route.params;
    this.state = {
      offer_rate: String(onsale.rate),
      amount: String(onsale.value),
    };
  }

  componentDidMount = async () => {
    let {onsale, user} = this.props.route.params;
    this._onsale = onsale;
    let {my_offers} = this.state;

    my_offers =
      (await post_request('my_offers', {onsale: onsale._id, user: user._id})) ||
      new Array();

    this.setState({
      my_offers: my_offers.sort((o1, o2) => o1.created < o2.created),
    });
  };

  go_to_chat = () => {
    let {navigation, route} = this.props;
    let {onsale, user} = route.params;

    navigation.navigate('chat', {onsale, user});
  };

  set_amount = amount =>
    this.setState({
      amount: amount > this._onsale.value ? this._onsale.value : amount,
    });

  set_rate = offer_rate => this.setState({offer_rate});

  send_offer = async offer_need => {
    let {route} = this.props;
    let {onsale, user} = route.params;
    let {amount, sending_offer} = this.state;

    if (sending_offer) return;
    this.setState({sending_offer: true});

    let offer = {
      amount: Number(amount),
      offer_rate: Number(onsale.rate),
      user: user._id,
      onsale: onsale._id,
      seller: onsale.seller._id,
      currency: onsale.currency,
      offer_need: offer_need._id,
    };
    let res = await post_request('make_offer', offer);
    res.offer_need = offer_need;
    if (res) {
      let {my_offers} = this.state;
      my_offers = new Array(res, ...my_offers);
      this.setState({my_offers, amount: 0, sending_offer: false});
    } else {
      toast("Couldn't place offer at this time.");
      this.setState({sending_offer: false});
    }
  };

  toggle_send_offer = () => this.send_offer_modal?.toggle();

  render() {
    let {amount, sending_offer, my_offers} = this.state;
    let {route, navigation} = this.props;
    let {onsale, user} = route.params;

    let {seller, alphabetic_name, value, offer_terms, flag} = onsale;

    return (
      <Bg_view flex>
        <Header
          no_transform
          title={`Purchase ${value} ${alphabetic_name} from ${capitalise(
            seller.username,
          )}`}
          navigation={navigation}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Fr_text
            centralise
            size={wp(5)}
            style={{
              margin: wp(4),
              marginBottom: wp(2.8),
              marginHorizontal: wp(25),
            }}>
            How much do you want to buy?
          </Fr_text>
          <Bg_view
            style={{
              margin: wp(4),
              borderWidth: 1,
              borderColor: '#ccc',
              marginTop: 0,
              borderRadius: wp(4),
            }}>
            <Bg_view
              horizontal
              shadowed
              style={{
                alignItems: 'center',
                borderRadius: wp(1.4),
                margin: wp(2.8),
              }}>
              <TextInput
                placeholder="Enter amount"
                value={String(amount)}
                keyboardType="phone-pad"
                onChangeText={this.set_amount}
                style={{
                  flex: 1,
                  borderRadius: wp(1),
                  padding: wp(2.8),
                  fontSize: wp(5),
                  color: '#000',
                }}
              />
              <View>
                <Bg_view
                  horizontal
                  style={{
                    borderRadius: wp(1),
                    height: hp(7.5),
                    padding: wp(2.8),
                    borderLeftColor: '#ccc',
                    borderLeftWidth: 1,
                  }}>
                  <Icon icon={flag} />
                  <Fr_text style={{marginLeft: wp(1.4)}}>
                    {alphabetic_name}
                  </Fr_text>
                </Bg_view>
              </View>
            </Bg_view>

            {amount && amount > 0 ? (
              <Stretched_button
                loading={sending_offer}
                title="proceed"
                action={this.toggle_send_offer || this.send_offer}
              />
            ) : null}

            <Line />
            {my_offers ? (
              my_offers.length ? (
                <Bg_view style={{marginBottom: hp(1.4)}}>
                  <Fr_text style={{margin: wp(2.8), marginBottom: 0}} accent>
                    Placed Offers
                  </Fr_text>
                  <FlatList
                    data={my_offers}
                    keyExtractor={item => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <Bg_view>
                        <Offer
                          offer={item}
                          onsale={onsale}
                          user={user}
                          navigation={navigation}
                        />
                      </Bg_view>
                    )}
                  />
                </Bg_view>
              ) : null
            ) : (
              <Loadindicator />
            )}
          </Bg_view>

          {offer_terms ? (
            <Bg_view
              style={{
                borderRadius: wp(4),
                shadowColor: '#000',
                elevation: 5,
                margin: wp(4),
                padding: wp(3),
              }}>
              <Fr_text accent>Offer Terms</Fr_text>
              <Fr_text
                size={wp(3.5)}
                color="#333"
                style={{textAlign: 'justify'}}>
                {offer_terms}
              </Fr_text>
            </Bg_view>
          ) : null}

          <Bg_view
            shadowed
            style={{margin: wp(4), borderRadius: wp(4), padding: wp(3)}}>
            <Bg_view horizontal style={{justifyContent: 'space-between'}}>
              <Fr_text accent>About Seller</Fr_text>
              <Fr_text
                opacity={0.8}
                italic
                size={wp(3.5)}
                style={{textAlign: 'right', margin: wp(2.8)}}></Fr_text>
            </Bg_view>
            <Bg_view horizontal>
              <Bg_view
                style={{
                  height: wp(10),
                  width: wp(10),
                  borderRadius: wp(10),
                  backgroundColor: '#eee',
                  marginRight: wp(2.8),
                }}
              />
              <Bg_view>
                <Bg_view horizontal>
                  <Fr_text>{seller.username}</Fr_text>
                  {seller.status === 'verified' ? <Verified_token /> : null}
                </Bg_view>
                <Bg_view horizontal style={{justifyContent: 'space-between'}}>
                  <Fr_text size={wp(3.5)} italic>
                    {seller.email}
                  </Fr_text>
                  {user._id === Admin_id ? (
                    <Fr_text size={wp(3.5)} italic>
                      {seller.phone}
                    </Fr_text>
                  ) : null}
                </Bg_view>
              </Bg_view>
            </Bg_view>
          </Bg_view>

          <Bg_view style={{height: hp(10)}} />
        </ScrollView>

        <Cool_modal
          center
          ref={send_offer_modal => (this.send_offer_modal = send_offer_modal)}>
          <Send_offer
            user={user}
            onsale={onsale}
            navigation={navigation}
            toggle={this.toggle_send_offer}
            send_offer={this.send_offer}
            amount={amount}
          />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Onsale_details;
