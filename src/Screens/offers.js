import React from 'react';
import {ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import Line from '../Components/line';
import List_empty from '../Components/list_empty';
import Loadindicator from '../Components/load_indicator';
import Offer from '../Components/offer';
import Onsale_currency from '../Components/onsale_currency';
import Text_btn from '../Components/Text_btn';
import {wp} from '../utils/dimensions';
import {get_request} from '../utils/services';

class Offers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current_status: 'pending',
      show_statuses: true,
    };
  }

  statuses = new Array(
    'pending',
    'accepted',
    'in-escrow',
    'awaiting confirmation',
    'completed',
    'declined',
    'in-dispute',
    'closed',
  );

  fetch_offers = async () => {
    let {route} = this.props;
    let {onsale} = route.params;
    let {current_status} = this.state;
    let offers = await get_request(
      `onsale_offers/${onsale._id}/${current_status}`,
    );

    this.setState({offers});
  };

  componentDidMount = async () => {
    await this.fetch_offers();
  };

  toggle_statuses = () =>
    this.setState({show_statuses: !this.state.show_statuses});

  set_current_status = current_status => this.setState({current_status});

  render = () => {
    let {route, navigation} = this.props;
    let {onsale} = route.params;
    let {offers, current_status, show_statuses} = this.state;

    return (
      <Bg_view flex>
        <Header title="offers" navigation={navigation} />

        <Onsale_currency
          onsale={onsale}
          user={onsale.seller}
          navigation={navigation}
          on_remove={() => navigation.goBack()}
          no_footer
        />

        <Bg_view horizontal style={{justifyContent: 'space-between'}}>
          <Fr_text style={{margin: wp(2.8)}} accent>
            Offers
          </Fr_text>
          <Text_btn
            icon={
              <Icon
                icon={require('../../android/app/src/main/assets/Icons/forward_arrow_icon.png')}
              />
            }
            text={current_status}
            accent
            capitalise
            action={this.toggle_statuses}
            style={{marginHorizontal: wp(4)}}
          />
        </Bg_view>
        <Bg_view style={{alignItems: 'center'}}>
          {show_statuses ? (
            <Bg_view horizontal style={{flexWrap: 'wrap'}}>
              {this.statuses.map(status => (
                <Text_btn
                  accent={current_status === status}
                  text={`${status} (${
                    onsale[status.replace(/[- ]/, '_')] || '0'
                  })`}
                  key={status}
                  capitalise
                  action={() =>
                    this.setState(
                      {current_status: status, show_statuses: false},
                      this.fetch_offers,
                    )
                  }
                  style={{marginHorizontal: wp(1.4)}}
                />
              ))}
            </Bg_view>
          ) : null}

          <Line />
        </Bg_view>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Bg_view style={{paddingHorizontal: wp(1.4)}}>
            {offers ? (
              offers.length ? (
                offers.map(offer => (
                  <Offer
                    offer={offer}
                    key={offer._id}
                    onsale={onsale}
                    user={onsale.seller}
                    navigation={navigation}
                  />
                ))
              ) : (
                <List_empty text={`No offers ${current_status}.`} />
              )
            ) : (
              <Loadindicator />
            )}
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  };
}

export default Offers;
