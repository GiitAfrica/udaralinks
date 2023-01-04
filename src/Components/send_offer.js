import React from 'react';
import {ScrollView} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import {post_request} from '../utils/services';
import toast from '../utils/toast';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import Online_registration from './set_online_registration';
import Onsale_currency from './onsale_currency';
import Bank_transfer from './state_bank_transfer';
import Stretched_button from './Stretched_button';
import Text_btn from './Text_btn';

class Send_offer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  needs = new Array('bank transfer', 'online registration');

  send_offer = async () => {
    let {send_offer, toggle} = this.props;
    let {need, bank_name, sending, account_number, url, site_details} =
      this.state;
    if (sending) return;

    let offer_need = {need};
    if (need === this.needs[0]) {
      offer_need.bank_name = bank_name;
      offer_need.account_number = account_number;

      if (!bank_name || !account_number) {
        toast('Invalid bank details');
        return;
      }
    } else {
      offer_need.url = url;
      offer_need.site_details = site_details;

      if (!url || !site_details) {
        toast('Invalid site information');
        return;
      }
    }

    this.setState({sending: true});

    let result = await post_request('state_offer_need', {offer_need});
    offer_need = {...offer_need, ...result};

    await send_offer(offer_need);

    toggle();
  };

  render() {
    let {toggle, onsale, navigation, user, amount} = this.props;
    let {currency} = onsale;
    let {bank_name, account_number, sending, need, url, site_details} =
      this.state;

    return (
      <Bg_view>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Bg_view
            style={{
              paddingVertical: hp(2.8),
              elevation: 10,
              shadowColor: '#000',
            }}>
            <Bg_view
              horizontal
              style={{justifyContent: 'space-between', paddingLeft: wp(5.6)}}>
              <Fr_text bold>Send Offer</Fr_text>
              <Icon
                icon={require('../assets/Icons/close_icon.png')}
                action={() => toggle && toggle()}
                style={{
                  alignSelf: 'flex-end',
                  marginHorizontal: wp(5.6),
                }}
              />
            </Bg_view>

            <Bg_view>
              <Onsale_currency
                onsale={onsale}
                user={user}
                navigation={navigation}
              />
            </Bg_view>

            <Fr_text centralise underline bold style={{marginTop: hp(2)}}>
              State Need
            </Fr_text>

            <Bg_view horizontal style={{justifyContent: 'center'}}>
              {this.needs.map(need => (
                <Text_btn
                  text={need}
                  bold
                  capitalise
                  action={() => this.setState({need})}
                  key={need}
                />
              ))}
            </Bg_view>

            {!need ? null : need === this.needs[0] ? (
              <Bank_transfer
                bank_name={bank_name}
                account_number={account_number}
                currency={currency}
                amount={amount}
                set_bank_name={bank_name => this.setState({bank_name})}
                set_account_number={account_number =>
                  this.setState({account_number})
                }
              />
            ) : (
              <Online_registration
                amount={amount}
                currency={currency}
                url={url}
                set_url={url => this.setState({url})}
                site_details={site_details}
                set_site_details={site_details => this.setState({site_details})}
              />
            )}

            <Stretched_button
              title="submit"
              loading={sending}
              action={this.send_offer}
              disabled={!need}
            />
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Send_offer;
