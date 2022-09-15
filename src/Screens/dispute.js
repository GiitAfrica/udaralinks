import React from 'react';
import {ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import Loadindicator from '../Components/load_indicator';
import Offer from '../Components/offer';
import Resolve_dispute from '../Components/resolve_dispute';
import Small_btn from '../Components/small_button';
import {wp} from '../utils/dimensions';
import {get_request, post_request} from '../utils/services';

class Dispute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let {offer} = this.props.route.params;

    let dispute = await get_request(`dispute/${offer._id}`);
    if (dispute && !dispute?.offer?._id)
      dispute.offer = await post_request('offer', {
        offer: dispute.offer,
        onsale: dispute.onsale,
      });

    this.setState({dispute});
  };

  toggle_resolve = () => this.cool_modal_resolve?.toggle_show_modal();

  goto_chat = () => {
    let {navigation, route} = this.props;
    let {user, onsale, offer} = route.params;

    navigation.navigate('chat', {offer, onsale});
  };

  render() {
    let {navigation, route} = this.props;
    let {user, onsale, offer} = route.params;
    let {dispute} = this.state;

    return (
      <Bg_view flex>
        <Header title="dispute" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Offer
            user={user}
            offer={offer}
            onsale={onsale}
            navigation={navigation}
          />

          {dispute ? (
            <Bg_view>
              <Bg_view
                horizontal
                style={{
                  alignItems: 'center',
                  padding: wp(4),
                  paddingBottom: wp(1.4),
                }}>
                <Bg_view
                  style={{
                    borderRadius: wp(4),
                    shadowColor: '#000',
                    elevation: 5,
                    width: '100%',
                    padding: wp(3),
                  }}>
                  <Fr_text accent>Title</Fr_text>
                  <Fr_text
                    size={wp(4.5)}
                    color="#333"
                    bold
                    style={{textAlign: 'justify'}}>
                    {dispute.title}
                  </Fr_text>
                </Bg_view>
              </Bg_view>
              <Bg_view
                style={{
                  borderRadius: wp(4),
                  shadowColor: '#000',
                  elevation: 5,
                  margin: wp(4),
                  padding: wp(3),
                }}>
                <Fr_text accent>Details</Fr_text>
                <Fr_text
                  size={wp(3.5)}
                  color="#333"
                  style={{textAlign: 'justify'}}>
                  {dispute.details}
                </Fr_text>
              </Bg_view>

              <Bg_view horizontal style={{justifyContent: 'center'}}>
                {dispute.initiator === user._id ? (
                  <Small_btn
                    title="resolve"
                    inverted
                    action={this.toggle_resolve}
                  />
                ) : null}
                <Icon
                  icon="chat_send_icon.png"
                  style={{width: wp(7.5), height: wp(7.5)}}
                  action={this.goto_chat}
                />
              </Bg_view>
            </Bg_view>
          ) : (
            <Loadindicator />
          )}

          <Cool_modal
            ref={cool_modal_resolve =>
              (this.cool_modal_resolve = cool_modal_resolve)
            }>
            <Resolve_dispute
              dispute={dispute}
              onsale={onsale}
              user={user}
              navigation={navigation}
              close_modal={this.toggle_resolve}
            />
          </Cool_modal>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Dispute;
