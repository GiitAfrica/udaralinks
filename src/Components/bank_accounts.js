import React from 'react';
import {ScrollView} from 'react-native';
import {emitter} from '../../Udara';
import {hp, wp} from '../utils/dimensions';
import {get_request, post_request} from '../utils/services';
import Add_bank_account from './add_bank_account';
import Bank_account from './bank_account';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Fr_text from './Fr_text';
import Icon from './Icon';
import List_empty from './list_empty';
import Loadindicator from './load_indicator';
import Text_btn from './Text_btn';

class Bank_accounts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let {user} = this.props;

    let bank_accounts = await get_request(`bank_accounts/${user._id}`);

    this.setState({bank_accounts});

    this.new_bank_account = bank => {
      let {bank_accounts} = this.state;
      bank_accounts = new Array(bank, ...bank_accounts);
      this.setState({bank_accounts});
    };

    emitter.listen('new_bank_account', this.new_bank_account);
  };

  componentWillUnmount = () => {
    emitter.remove_listener('new_bank_account', this.new_bank_account);
  };

  remove_account = async account => {
    let {user} = this.props;
    let {bank_accounts} = this.state;

    bank_accounts = bank_accounts.filter(
      bank_account => bank_account._id !== account._id,
    );
    this.setState({bank_accounts});

    await post_request('remove_bank_account', {
      user: user._id,
      wallet: user.wallet._id,
      account: account._id,
    });
  };

  render() {
    let {toggle, user, action} = this.props;
    let {bank_accounts} = this.state;

    return (
      <Bg_view
        shadowed
        style={{
          paddingVertical: hp(2.8),
          maxHeight: hp(),
        }}>
        <Bg_view
          horizontal
          style={{justifyContent: 'space-between', paddingLeft: wp(5.6)}}>
          <Fr_text bold>Bank Accounts</Fr_text>
          <Icon
            icon={require('../assets/Icons/close_icon.png')}
            action={() => toggle && toggle()}
            style={{
              alignSelf: 'flex-end',
              marginHorizontal: wp(5.6),
              marginLeft: 0,
            }}
          />
        </Bg_view>

        <ScrollView showVerticalScrollIndicator={false}>
          {bank_accounts ? (
            <Bg_view horizontal style={{flexWrap: 'wrap'}}>
              {bank_accounts.length ? (
                bank_accounts.map(account => (
                  <Bank_account
                    account={account}
                    action={action}
                    remove={this.remove_account}
                    key={account._id}
                  />
                ))
              ) : (
                <List_empty
                  text="No saved bank accounts"
                  data={
                    <Bg_view style={{alignItems: 'center'}}>
                      <Text_btn
                        text="Add bank"
                        action={this.toggle_new_bank_account?.toggle_show_modal}
                      />
                    </Bg_view>
                  }
                />
              )}
            </Bg_view>
          ) : (
            <Loadindicator />
          )}
          <Text_btn
            centralise
            text="Add"
            action={() => this.toggle_new_bank_account?.toggle_show_modal()}
          />
        </ScrollView>

        <Cool_modal
          ref={toggle_new_bank_account =>
            (this.toggle_new_bank_account = toggle_new_bank_account)
          }>
          <Add_bank_account
            user={user}
            toggle={() =>
              this.toggle_new_bank_account &&
              this.toggle_new_bank_account?.toggle_show_modal()
            }
          />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Bank_accounts;
