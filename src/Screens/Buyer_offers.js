import React from 'react';
import {ScrollView} from 'react-native';
import {User} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Header from '../Components/header';
import List_empty from '../Components/list_empty';
import Loadindicator from '../Components/load_indicator';
import Offer from '../Components/offer';
import {post_request} from '../utils/services';

class Buyer_offers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page_size: 25,
      page: 0,
    };
  }

  componentDidMount = async () => {
    let {page_size, page} = this.state;

    let offers = await post_request(`buyer_offers`, {
      // limit: page_size,
      // skip: page_size * page,
      buyer: this.user._id,
    });

    offers = offers.filter(offer => typeof offer.offer === 'object');

    this.setState({offers});
  };

  render() {
    let {navigation} = this.props;
    let {offers} = this.state;

    return (
      <User.Consumer>
        {user => {
          this.user = user;

          return (
            <Bg_view flex>
              <Header title="Your Offers" navigation={navigation} />
              <ScrollView showsVerticalScrollIndicator={false}>
                {offers ? (
                  offers.length ? (
                    offers.map(offer => (
                      <Offer
                        offer={offer.offer}
                        onsale={offer.onsale}
                        user={user}
                        navigation={navigation}
                        key={offer._id}
                      />
                    ))
                  ) : (
                    <List_empty text="You haven't made any offer yet." />
                  )
                ) : (
                  <Loadindicator />
                )}
              </ScrollView>
            </Bg_view>
          );
        }}
      </User.Consumer>
    );
  }
}

export default Buyer_offers;
