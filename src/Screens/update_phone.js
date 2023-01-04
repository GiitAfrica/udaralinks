import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Country_codes from '../Components/country_codes';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import Stretched_button from '../Components/Stretched_button';
import {hp, wp} from '../utils/dimensions';
import {validate_phone} from '../utils/functions';
import {get_request, post_request} from '../utils/services';
import {set_phone_et_country_code} from './registration';

class Update_phone extends React.Component {
  constructor(props) {
    super(props);

    let {user} = this.props.route.params;
    let {phone} = user;
    this.current_phone = phone;
    this.state = {phone, country_code: {code: '+234'}};
  }

  componentDidMount = async () => {
    let {user} = this.props.route.params;
    let {country} = user;
    let country_code = await get_request(`get_code_by_country/${country}`);
    country_code &&
      this.setState({country_code}, () =>
        this.setState({phone: this.clean_phone()}),
      );
  };

  set_username = phone =>
    this.setState({
      phone,
      invalid_phone: validate_phone(phone),
    });

  request_otp = async () => {
    let {phone, country_code} = this.state;
    return await post_request('request_otp', {
      phone: set_phone_et_country_code(phone, country_code.code),
    });
  };

  verify = async () => {
    let {navigation} = this.props;
    let {phone, country_code} = this.state;
    phone = set_phone_et_country_code(phone, country_code.code);

    await this.request_otp();
    navigation.navigate('verification', {
      phone,
      from_update: true,
      country_code,
      user: this.props.route.params.user._id,
    });
  };

  toggle_country_codes = () =>
    this.cool_modal && this.cool_modal.toggle_show_modal();

  set_country_code = country_code =>
    this.setState(
      {country_code, phone: this.clean_phone()},
      this.toggle_country_codes,
    );

  set_phone = phone => this.setState({phone});

  clean_phone = () => {
    let {country_code, phone} = this.state;
    if (!country_code || !phone) return phone;

    return phone.replace(country_code.code, '');
  };

  render() {
    let {navigation, route} = this.props;
    let {user} = route.params;

    let {phone, invalid_phone, country_code} = this.state;

    return (
      <Bg_view flex>
        <Header navigation={navigation} title="update phone" />

        <ScrollView>
          <KeyboardAvoidingView style={{flex: 1}}>
            <Bg_view
              style={{
                height: hp(15),
                margin: wp(5.6),
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: wp(4),
                marginTop: hp(4),
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: wp(4),
                paddingRight: wp(2.8),
              }}>
              {country_code && (
                <TouchableWithoutFeedback onPress={this.toggle_country_codes}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      icon={country_code.flag}
                      style={{height: wp(10), width: wp(10)}}
                    />

                    <Fr_text
                      size={wp(4.5)}
                      bold
                      color="#28100B"
                      style={{marginLeft: wp(1.4)}}>
                      {country_code.code}
                    </Fr_text>
                  </View>
                </TouchableWithoutFeedback>
              )}
              <TextInput
                placeholder="Phone Number..."
                keyboardType="phone-pad"
                onChangeText={this.set_phone}
                value={this.clean_phone(phone)}
                style={{
                  flex: 1,
                  fontSize: wp(4.5),
                  color: '#28100B',
                  marginRight: wp(1.4),
                  fontWeight: 'bold',
                }}
              />
              {validate_phone(
                country_code ? country_code.code + phone : phone,
              ) ? (
                <Icon
                  icon="id_verification_icon.png"
                  style={{height: wp(7.5), width: wp(7.5)}}
                />
              ) : null}
            </Bg_view>
            <Stretched_button
              title="verify"
              disabled={
                invalid_phone ||
                (this.current_phone ===
                  set_phone_et_country_code(
                    phone,
                    country_code && country_code.code,
                  ) &&
                  user.verified)
              }
              action={this.verify}
            />
          </KeyboardAvoidingView>
        </ScrollView>

        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
          <Country_codes
            close_modal={() =>
              this.cool_modal && this.cool_modal.toggle_show_modal()
            }
            select={this.set_country_code}
          />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Update_phone;
