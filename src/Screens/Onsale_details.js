import React from 'react';
import {FlatList, ScrollView, TextInput, View} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import Line from '../Components/line';
import Loadindicator from '../Components/load_indicator';
import Offer from '../Components/offer';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {capitalise} from '../utils/functions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';

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

  set_amount = amount => this.setState({amount});

  set_rate = offer_rate => this.setState({offer_rate});

  send_offer = async () => {
    let {route} = this.props;
    let {onsale, user} = route.params;
    let {amount, offer_rate} = this.state;

    let offer = {
      amount: Number(amount),
      offer_rate: Number(offer_rate),
      user: user._id,
      onsale: onsale._id,
      seller: onsale.seller._id,
      currency: onsale.currency,
    };
    let res = await post_request('make_offer', offer);
    if (res) {
      let {my_offers} = this.state;
      my_offers = new Array(res, ...my_offers);
      this.setState({my_offers, amount: 0, offer_rate: 0});
    } else toast("Couldn't place offer at this time.");
  };

  render() {
    let {amount, offer_rate, my_offers} = this.state;
    let {route, navigation} = this.props;
    let {onsale, user} = route.params;

    let {seller, alphabetic_name, value, offer_terms, rate, flag} = onsale;

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
                value={amount}
                keyboardType="phone-pad"
                onChangeText={this.set_amount}
                style={{
                  flex: 1,
                  borderRadius: wp(1),
                  padding: wp(2.8),
                  fontSize: wp(5),
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

            <Bg_view horizontal style={{justifyContent: 'space-between'}}>
              <Fr_text style={{margin: wp(2.8), marginBottom: 0}} accent>
                Negotiate Rate
              </Fr_text>
              <Fr_text
                opacity={0.8}
                italic
                size={wp(3.5)}
                style={{textAlign: 'right', margin: wp(2.8)}}>
                Udara fee - 0.5%
              </Fr_text>
            </Bg_view>
            <Bg_view
              horizontal
              shadowed
              style={{
                alignItems: 'center',
                borderRadius: wp(1.4),
                margin: wp(2.8),
                marginTop: wp(1.4),
              }}>
              <TextInput
                placeholder="Enter rate"
                value={offer_rate}
                keyboardType="phone-pad"
                onChangeText={this.set_rate}
                style={{
                  flex: 1,
                  borderRadius: wp(1),
                  padding: wp(2.8),
                  fontSize: wp(5),
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
                  <Icon icon={'nigeria_flag_rectangle.png'} />
                  <Fr_text style={{marginLeft: wp(1.4)}}>{'NGN'}</Fr_text>
                </Bg_view>
              </View>
            </Bg_view>

            {amount && offer_rate && offer_rate > 0 && amount > 0 ? (
              <Stretched_button title="send offer" action={this.send_offer} />
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
                style={{textAlign: 'right', margin: wp(2.8)}}>
                Udara fee - 0.5%
              </Fr_text>
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
                <Fr_text>{seller.username}</Fr_text>
                <Fr_text size={wp(3.5)} italic>
                  {seller.phone}
                </Fr_text>
              </Bg_view>
            </Bg_view>
          </Bg_view>

          <Bg_view style={{height: hp(10)}} />
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Onsale_details;
