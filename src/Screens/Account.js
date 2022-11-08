import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Admin_id, emitter, User} from '../../Udara';
import Bank_accounts from '../Components/bank_accounts';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Currencies from '../Components/currencies';
import Fr_text from '../Components/Fr_text';
import Icon from '../Components/Icon';
import Loadindicator from '../Components/load_indicator';
import Text_btn from '../Components/Text_btn';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import {set_phone_et_country_code} from './registration';
import {alphabetic_naming} from './Wallet';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disputes: 0,
    };
  }

  componentDidMount = async () => {};

  touch_card = ({main, text, action}) => {
    return (
      <TouchableWithoutFeedback onPress={action}>
        <View>
          <Bg_view
            style={{
              width: wp(42),
              padding: wp(4),
              height: hp(15),
              minHeight: hp(13.5),
              marginVertical: hp(1.4),
              borderRadius: wp(4),
              alignItems: 'center',
              flexDirection: 'row',
              elevation: 10,
              shadowColor: '#000',
            }}>
            <Bg_view no_bg style={{width: wp(30)}}>
              <Fr_text capitalise bold size={wp(3.5)}>
                {main}
              </Fr_text>
              <Fr_text
                capitalise
                style={{marginTop: hp(1)}}
                size={wp(3.2)}
                opacity={0.8}>
                {text}
              </Fr_text>
            </Bg_view>
            <Icon
              icon="greyforwardicon.png"
              style={{width: wp(4), height: wp(4)}}
            />
          </Bg_view>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  setting_item = ({title, value, no_bg, icon, right_btn, action}) => (
    <TouchableWithoutFeedback onPress={action} key={title}>
      <View>
        <Bg_view
          horizontal
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: wp(4),
            paddingVertical: wp(2.8),
            borderRadius: wp(4),
            marginBottom: hp(2),
            elevation: no_bg ? 0 : 10,
            shadowColor: '#000',
          }}>
          <Bg_view no_bg>
            <Fr_text size={wp(3.5)} bold capitalise>
              {title}
            </Fr_text>
            {value ? (
              <Fr_text opacity={0.8} size={wp(3.2)}>
                {value}
              </Fr_text>
            ) : null}
          </Bg_view>
          {right_btn
            ? right_btn
            : title === 'ACCESS CONTROL'
            ? null
            : icon || (
                <Icon
                  icon="greyforwardicon.png"
                  style={{width: wp(4), height: wp(4)}}
                />
              )}
        </Bg_view>
      </View>
    </TouchableWithoutFeedback>
  );

  verify = async () => {
    this.setState({loading: true});
    let {navigation} = this.props;
    let {phone, country_code, _id, country} = this.user;
    phone = set_phone_et_country_code(phone, country_code);
    let res = await post_request('request_otp', {phone});
    if (!res) {
      this.setState({loading: false});
      return toast("Couldn't proceed with request.");
    }
    navigation.navigate('verification', {
      user: _id,
      from_update: true,
      country_code,
      country,
      phone,
    });
    this.setState({loading: false});
  };

  settings = () => {
    let {navigation} = this.props;
    let {loading, signing_out} = this.state;

    return new Array(
      {
        title: 'Bank Accounts',
        action: () => this.add_bank_account?.toggle_show_modal(),
        right_btn: (
          <Text_btn
            accent
            text={this.user.wallet.bank_accounts}
            style={{padding: 0, margin: 0}}
          />
        ),
      },
      {
        title: 'favorite currency',
        value: alphabetic_naming[this.user.wallet.fav_currency],
        action: () => this.fav_currency_modal?.toggle_show_modal(),
      },
      {title: 'ACCESS CONTROL', no_bg: true},
      Admin_id === this.user._id
        ? {
            title: 'disputes',
            value: this.state.disputes || '',
            action: () =>
              this.props.navigation.navigate('disputes', {user: this.user}),
          }
        : {
            title: 'phone number',
            value: this.user.phone,
            action: loading
              ? null
              : () => navigation.navigate('update_phone', {user: this.user}),
            right_btn: this.user.verified ? null : loading ? (
              <Loadindicator style={{minHeight: null}} />
            ) : (
              <Text_btn accent text="verify" action={this.verify} />
            ),
          },
      {
        title: 'privacy policy',
        no_bg: true,
        action: () => navigation.navigate('privacy_policy'),
      },
      {
        title: 'sign out',
        no_bg: true,
        action: signing_out
          ? null
          : () => {
              this.setState({signing_out: true}, () =>
                setTimeout(() => emitter.emit('signout'), 1500),
              );
            },
        right_btn: signing_out ? (
          <Loadindicator style={{minHeight: null}} />
        ) : null,
      },
    );
  };

  update_fav_currency = async fav_currency => {
    emitter.emit('update_fav_currency', fav_currency);
    this.fav_currency_modal?.toggle_show_modal();

    let res = await post_request('update_fav_currency', {
      wallet: this.user.wallet._id,
      fav_currency,
    });
    if (!res?.wallet) toast('Favorite currency update failed');
  };

  render = () => {
    let {navigation} = this.props;

    return (
      <User.Consumer style={{flex: 1}}>
        {user => {
          let {username} = user;
          this.user = user;

          return (
            <Bg_view flex>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}>
                <Bg_view flex style={{padding: wp(5.6)}}>
                  <Fr_text capitalise bold size={wp(7.5)}>
                    account
                  </Fr_text>
                  <Fr_text caps size={wp(3.5)} opacity={0.8}>
                    settings
                  </Fr_text>
                  <Bg_view
                    horizontal
                    no_centralise
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    {this.touch_card({
                      main: 'username',
                      text: username,
                      action: () =>
                        navigation.navigate('update_username', {
                          username,
                          user: user._id,
                        }),
                    })}
                    {this.touch_card({
                      main: 'change password',
                      text: 'make your profile secure',
                      action: () =>
                        navigation.navigate('change_password', {
                          user: user._id,
                        }),
                    })}
                  </Bg_view>
                  {this.settings().map(setting => this.setting_item(setting))}

                  <Cool_modal
                    ref={fav_currency_modal =>
                      (this.fav_currency_modal = fav_currency_modal)
                    }>
                    <Currencies
                      select={this.update_fav_currency}
                      close_modal={() =>
                        this.fav_currency_modal?.toggle_show_modal()
                      }
                    />
                  </Cool_modal>
                  <Cool_modal
                    ref={add_bank_account =>
                      (this.add_bank_account = add_bank_account)
                    }>
                    <Bank_accounts
                      user={this.user}
                      toggle={() => this.add_bank_account?.toggle_show_modal()}
                    />
                  </Cool_modal>
                </Bg_view>
              </ScrollView>
            </Bg_view>
          );
        }}
      </User.Consumer>
    );
  };
}

export default Account;
