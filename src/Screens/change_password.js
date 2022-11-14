import React from 'react';
import {KeyboardAvoidingView, ScrollView, TextInput} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import Stretched_button from '../Components/Stretched_button';
import Text_btn from '../Components/Text_btn';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';

class Change_password extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  set_old_password = old_key => this.setState({old_key});

  create_new_password = new_key => this.setState({new_key});

  confirm_new_password = confirm_key => this.setState({confirm_key});

  inputs = new Array(
    {
      label: 'Enter old password',
      placeholder: 'Type old password',
      text_entry: this.set_old_password,
    },
    {
      label: 'New password',
      placeholder: 'Create new password',
      text_entry: this.create_new_password,
    },
    {
      label: 'Confirm password',
      placeholder: 'Confirm new password',
      text_entry: this.confirm_new_password,
    },
  );

  input_component = ({label, text_entry, placeholder}) => (
    <Bg_view
      key={label}
      horizontal
      style={{
        height: hp(11),
        elevation: 10,
        shadowColor: '#000',
        borderRadius: wp(2.8),
        alignItems: 'center',
        padding: wp(2.8),
        marginBottom: hp(2.8),
      }}>
      <Icon icon="password_lock.png" />
      <Bg_view flex style={{paddingLeft: wp(2.8)}} no_bg>
        <Fr_text opacity={0.8}>{label}</Fr_text>
        <TextInput
          style={{fontSize: wp(4.5), margin: 0, padding: 0, color: '#000'}}
          placeholder={placeholder}
          onChangeText={text_entry}
          secureTextEntry={!this.state.reveal_passwords}
        />
      </Bg_view>
    </Bg_view>
  );

  toggle_reveal_passwords = () =>
    this.setState({reveal_passwords: !this.state.reveal_passwords});

  is_set = () => {
    let {old_key, new_key, confirm_key} = this.state;
    return (
      !old_key ||
      !new_key ||
      !confirm_key ||
      confirm_key !== new_key ||
      (old_key && old_key.length < 6) ||
      (new_key && new_key.length < 6)
    );
  };

  save_password = async () => {
    let {navigation, route} = this.props;
    let {user} = route.params;
    let {old_key, new_key} = this.state;

    let res = await post_request(`change_password/${user}`, {
      old_key,
      new_key,
    });
    if (res && res.success) {
      toast('Password updated!');
      navigation.goBack();
    } else res && toast(res.reason);
  };

  render() {
    let {navigation} = this.props;
    let {reveal_passwords} = this.state;

    return (
      <Bg_view flex>
        <Header title="change password" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView style={{flex: 1, paddingBottom: hp(5)}}>
            <Bg_view flex>
              <Icon
                icon="change_password_icon.png"
                style={{height: wp(50), width: wp(80), alignSelf: 'center'}}
              />
              <Fr_text
                color="#888"
                size={wp(3.5)}
                centralise
                style={{marginHorizontal: wp(10)}}>
                Create your new password so you can login secure into Udara app.
              </Fr_text>

              <Bg_view style={{margin: wp(5.6), marginBottom: 0}}>
                {this.inputs.map(input => this.input_component(input))}

                <Text_btn
                  text={
                    reveal_passwords ? 'Conceal passwords' : 'Reveal passwords'
                  }
                  style={{alignSelf: 'flex-end'}}
                  action={this.toggle_reveal_passwords}
                />
              </Bg_view>

              <Stretched_button
                title="save password"
                action={this.save_password}
                border_radius={wp(2.8)}
                style={{marginTop: wp(1.4)}}
                disabled={this.is_set()}
              />
            </Bg_view>
          </KeyboardAvoidingView>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Change_password;
