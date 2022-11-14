import React from 'react';
import Bg_view from '../Components/Bg_view';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Loadindicator from '../Components/load_indicator';
import {hp, wp} from '../utils/dimensions';
import {get_request, post_request} from '../utils/services';
import Text_btn from '../Components/Text_btn';
import Clipboard from '@react-native-clipboard/clipboard';
import toast from '../utils/toast';

class Generate_account_number extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requesting: true,
    };
  }

  componentDidMount = async () => {
    let {value, user} = this.props.route.params;
    this.value = value;

    let account_details = await post_request('request_account_details', {
      amount: value,
      user: user._id,
    });

    this.setState({account_details, requesting: false});
  };

  render() {
    let {navigation} = this.props;
    let {requesting, account_details} = this.state;

    return (
      <Bg_view flex>
        <Header title="Top Up" navigation={navigation} />

        <Bg_view style={{padding: wp(5.6), lineHeight: 32}}>
          <Fr_text size={19}>
            Make a bank transfer to the bank details below to fund your wallet.
          </Fr_text>
          <Fr_text size={19} style={{lineHeight: 32}}>
            Deposits can take up to 30 minutes to reflect.
          </Fr_text>

          <Bg_view shadowed style={{borderRadius: wp(4), marginTop: hp(1.4)}}>
            {requesting ? (
              <Loadindicator />
            ) : (
              <Bg_view style={{alignItems: 'center', padding: wp(4)}}>
                <Fr_text size={16}>Account Number</Fr_text>

                <Text_btn
                  text={account_details.account_number}
                  size={22}
                  bold
                  action={() => {
                    Clipboard.setString(account_details.account_number);
                    toast('Account number copied.');
                  }}
                />

                <Fr_text size={16} style={{marginTop: hp(1.4)}}>
                  Bank Name
                </Fr_text>
                <Fr_text bold size={22} capitalise>
                  {account_details.bank}
                </Fr_text>

                <Fr_text size={16} style={{marginTop: hp(1.4)}}>
                  Amount
                </Fr_text>
                <Fr_text bold size={22}>
                  {`NGN ${Number(this.value).toFixed(2)}`}
                </Fr_text>
              </Bg_view>
            )}
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Generate_account_number;
