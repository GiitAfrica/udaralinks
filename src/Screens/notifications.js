import React from 'react';
import {ScrollView} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Header from '../Components/header';
import List_empty from '../Components/list_empty';
import Loadindicator from '../Components/load_indicator';
import Notification from '../Components/notification';
import {get_request} from '../utils/services';

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let notifications = await get_request(`notifications/${1}`);
    this.setState({notifications});
  };

  render = () => {
    let {navigation} = this.props;
    let {notifications} = this.state;

    return (
      <Bg_view flex>
        <Header title="notifications" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications ? (
            notifications.length ? (
              notifications.map(notification => (
                <Notification
                  notification={notification}
                  navigation={navigation}
                  key={notification._id}
                />
              ))
            ) : (
              <List_empty text="No notifications yet." />
            )
          ) : (
            <Loadindicator />
          )}
        </ScrollView>
      </Bg_view>
    );
  };
}

export default Notifications;
