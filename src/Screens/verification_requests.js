import React from 'react';
import {ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Header from '../Components/header';
import List_empty from '../Components/list_empty';
import Loadindicator from '../Components/load_indicator';
import Verification_request from '../Components/verification_request';
import {post_request} from '../utils/services';

class Verification_requests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let requests = await post_request('unverified_details');

    this.setState({requests});
  };

  render() {
    let {navigation} = this.props;
    let {requests} = this.state;

    return (
      <Bg_view flex>
        <Header title="Verification Requests" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {requests ? (
            requests.length ? (
              requests.map(request => (
                <Verification_request request={request} key={request._id} />
              ))
            ) : (
              <List_empty text="No pending requests yet." />
            )
          ) : (
            <Loadindicator />
          )}
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Verification_requests;
