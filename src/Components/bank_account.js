import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Fr_text from './Fr_text';
import Small_btn from './small_button';
import Text_btn from './Text_btn';

class Bank_account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {account, action, remove} = this.props;
    let {bank_name, account_number} = account;

    return (
      <View style={{alignSelf: 'flex-start'}}>
        <TouchableWithoutFeedback
          onPress={() =>
            action
              ? action(account)
              : this.confirm_remove_bank_account?.toggle_show_modal()
          }>
          <View>
            <Bg_view
              style={{
                padding: wp(4),
                margin: wp(2.8),
                borderRadius: wp(4),
                alignSelf: 'flex-start',
              }}
              shadowed>
              <Fr_text bold>{bank_name}</Fr_text>
              <Fr_text>{account_number}</Fr_text>
            </Bg_view>
          </View>
        </TouchableWithoutFeedback>

        <Cool_modal
          ref={confirm_remove_bank_account =>
            (this.confirm_remove_bank_account = confirm_remove_bank_account)
          }>
          <Bg_view style={{padding: wp(5), alignItems: 'center'}}>
            <Fr_text centralise size={wp(5)}>
              Are you sure to remove bank account?
            </Fr_text>

            <Bg_view horizontal>
              <Small_btn
                title="Proceed"
                action={() => remove && remove(account)}
              />
              <Small_btn
                title="Cancel"
                inverted
                action={() =>
                  this.confirm_remove_bank_account?.toggle_show_modal()
                }
              />
            </Bg_view>
          </Bg_view>
        </Cool_modal>
      </View>
    );
  }
}

export default Bank_account;
