import React from 'react';
import {KeyboardAvoidingView, ScrollView, TextInput} from 'react-native';
import {Admin_id, emitter} from '../../Udara';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';

class Update_username extends React.Component {
  constructor(props) {
    super(props);

    let {username, user} = this.props.route.params;
    this.user = user;
    this.current_username = username;
    this.state = {username};
  }

  max_length = 15;
  min_length = 4;

  set_username = username =>
    this.setState({
      username,
      invalid_username: !/^[a-zA-Z0-9-_ ]{2,}$/.test(username),
    });

  update_username = async () => {
    let {username} = this.state;
    emitter.emit('username_updated', username);
    this.props.navigation.goBack();

    let res = await post_request('username_updated', {
      username,
      user: this.user,
    });
    res === this.user && toast('Username updated!');
  };

  render() {
    let {navigation} = this.props;
    let {username, invalid_username} = this.state;

    return (
      <Bg_view flex>
        <Header navigation={navigation} title="update username" />

        <ScrollView>
          <KeyboardAvoidingView style={{flex: 1}}>
            <Bg_view
              style={{
                height: hp(15),
                elevation: 10,
                shadowColor: '#000',
                margin: wp(5.6),
                padding: wp(4),
              }}>
              <Fr_text size={wp(3.5)}>Username</Fr_text>
              <TextInput
                editable={this.user !== Admin_id}
                value={username}
                onChangeText={this.set_username}
                style={{fontSize: wp(5), color: '#000'}}
                placeholder="..."
              />
            </Bg_view>

            <Stretched_button
              title="save new username"
              disabled={invalid_username || this.user === Admin_id}
              action={this.update_username}
            />

            {invalid_username ? (
              <Fr_text
                color="red"
                size={wp(3.5)}
                centralise
                style={{margin: wp(4)}}>
                {`Usernames can only consist of letters from Latin \nalphabet, numbers, - and _`}
              </Fr_text>
            ) : null}
          </KeyboardAvoidingView>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Update_username;
