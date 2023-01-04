import React from 'react';
import {KeyboardAvoidingView, ScrollView, TextInput} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';

class Update_email extends React.Component {
  constructor(props) {
    super(props);

    let {email, user} = this.props.route.params;
    this.user = user;
    this.current_email = email;
    this.state = {email: email || user.email};
  }

  set_username = email =>
    this.setState({
      email,
      invalid_email:
        !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          email,
        ),
    });

  request_otp = async () => {
    let {email} = this.state;
    console.log(email);
    return await post_request('request_otp', {email});
  };

  verify = async () => {
    let {route, navigation} = this.props;
    let {user} = route.params;
    let {country_code, _id} = user;
    let {email} = this.state;

    await this.request_otp();
    navigation.navigate('verification', {
      email,
      from_update: true,
      country_code,
      user: _id,
    });
  };

  render() {
    let {navigation} = this.props;
    let {email, invalid_email} = this.state;

    return (
      <Bg_view flex>
        <Header navigation={navigation} title="update email" />

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
              <Fr_text size={wp(3.5)}>Email</Fr_text>
              <TextInput
                value={email}
                keyboardType="email-address"
                onChangeText={this.set_username}
                style={{fontSize: wp(5), color: '#000'}}
                placeholder="..."
              />
            </Bg_view>

            <Stretched_button
              title="submit"
              disabled={invalid_email}
              action={this.verify}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Update_email;
