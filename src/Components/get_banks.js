import React from 'react';
import {KeyboardAvoidingView, ScrollView} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import {get_request} from '../utils/services';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Icon from './Icon';
import List_empty from './list_empty';
import Loadindicator from './load_indicator';
import Search_input from './search_input';
import Text_btn from './Text_btn';

class Get_banks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let banks = await get_request('get_banks');

    this.setState({banks});
  };

  clear_search = () => this.setState({search_value: ''});

  set_search_value = search_value => this.setState({search_value});

  render() {
    let {toggle, select} = this.props;
    let {banks, search_value} = this.state;

    return (
      <KeyboardAvoidingView style={{maxHeight: hp()}}>
        <Bg_view
          style={{
            paddingVertical: hp(2.8),
            elevation: 10,
            shadowColor: '#000',
            maxHeight: hp(),
          }}>
          <Bg_view
            horizontal
            style={{justifyContent: 'space-between', paddingLeft: wp(5.6)}}>
            <Fr_text bold>Select bank</Fr_text>
            <Icon
              icon={require('../assets/Icons/close_icon.png')}
              action={() => toggle && toggle()}
              style={{
                alignSelf: 'flex-end',
                marginHorizontal: wp(5.6),
              }}
            />
          </Bg_view>
          <Search_input
            search_value={search_value}
            set_search_value={this.set_search_value}
            clear_search={this.clear_search}
            no_autofocus
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {banks ? (
              banks.length ? (
                banks.map((bank, index) =>
                  search_value &&
                  !bank.name
                    .toLowerCase()
                    .includes(search_value.toLowerCase().trim()) ? null : (
                    <Text_btn
                      text={bank.name}
                      key={index}
                      action={() => select && (select(bank), toggle())}
                      style={{padding: wp(4.5)}}
                    />
                  ),
                )
              ) : (
                <List_empty text="Cannot get banks at this time" />
              )
            ) : (
              <Loadindicator />
            )}
          </ScrollView>
        </Bg_view>
      </KeyboardAvoidingView>
    );
  }
}

export default Get_banks;
