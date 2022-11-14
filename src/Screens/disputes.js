import React from 'react';
import {ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Header from '../Components/header';
import List_empty from '../Components/list_empty';
import Loadindicator from '../Components/load_indicator';
import Offer from '../Components/offer';
import {post_request} from '../utils/services';

class Disputes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let disputes = await post_request('disputes', {reset_pager: true});
    this.setState({disputes});
  };

  render() {
    let {navigation, route} = this.props;
    let {user} = route.params;
    let {disputes} = this.state;

    return (
      <Bg_view flex>
        <Header title="dispute" navigation={navigation} />

        {disputes ? (
          disputes.length ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {disputes.map(dispute => (
                <Offer
                  key={dispute._id}
                  offer={dispute.offer}
                  user={user}
                  onsale={dispute.onsale}
                  navigation={navigation}
                  admin_in_dispute
                />
              ))}
            </ScrollView>
          ) : (
            <List_empty text="No disputes yet" />
          )
        ) : (
          <Loadindicator />
        )}
      </Bg_view>
    );
  }
}

export default Disputes;
