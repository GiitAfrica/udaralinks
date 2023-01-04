import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Text_input from './Text_input';

class Bank_transfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {
      amount,
      currency,
      account_number,
      bank_name,
      set_account_number,
      set_bank_name,
    } = this.props;

    return (
      <Bg_view style={{padding: wp(4)}}>
        <Fr_text bold>Bank Transfer</Fr_text>

        <Fr_text style={{marginVertical: hp(1.4)}} italic>
          {`Seller is to transfer ${Number(amount).toFixed(
            2,
          )} ${currency} to the bank details provided to fulfil transaction.`}
        </Fr_text>

        <Text_input
          placeholder="Bank Name"
          on_change_text={set_bank_name}
          label="Bank Name"
          value={bank_name}
        />
        <Text_input
          placeholder="Account Number"
          type="decimal-pad"
          on_change_text={set_account_number}
          label="Account Number"
          value={account_number}
        />
      </Bg_view>
    );
  }
}

export default Bank_transfer;
