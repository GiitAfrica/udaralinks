import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Text_btn from './Text_btn';
import Clipboard from '@react-native-clipboard/clipboard';
import toast from '../utils/toast';

class Bank_transfer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {bank_transfer, is_seller} = this.props;
    let {need, bank_name, account_number} = bank_transfer;

    return (
      <Bg_view
        style={{
          marginHorizontal: wp(4),
          marginVertical: hp(0.7),
          alignItems: 'center',
        }}>
        <Fr_text capitalise bold style={{marginBottom: hp(1.4)}}>
          {need}
        </Fr_text>

        <Fr_text>{bank_name}</Fr_text>
        <Text_btn
          text={account_number}
          action={() => {
            Clipboard.setString(account_number);
            toast('Account number copied.');
          }}
        />

        {is_seller ? (
          <Fr_text
            centralise
            style={{
              width: wp(60),
            }}
            italic>{`Make a transfer to the bank details above using the offer's value`}</Fr_text>
        ) : null}
      </Bg_view>
    );
  }
}

export default Bank_transfer;
