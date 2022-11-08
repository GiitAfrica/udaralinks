import React from 'react';
import {ScrollView} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import {get_request} from '../utils/services';
import Bg_view from './Bg_view';
import Icon from './Icon';
import List_empty from './list_empty';
import Loadindicator from './load_indicator';
import Purpose from './purpose';
import Search_input from './search_input';

class Purposes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let purposes = await get_request('purposes');
    if (Array.isArray(purposes)) {
      purposes.reverse();
      this.setState({purposes});
    }
  };

  clear_search = () => this.setState({search_value: ''});

  set_search_value = search_value => this.setState({search_value});

  render() {
    let {close_modal, select} = this.props;
    let {purposes, search_value} = this.state;

    return (
      <Bg_view
        style={{paddingVertical: hp(2.8), elevation: 10, shadowColor: '#000'}}>
        <Icon
          icon={require('../assets/Icons/close_icon.png')}
          action={() => close_modal && close_modal()}
          style={{
            alignSelf: 'flex-end',
            marginHorizontal: wp(5.6),
          }}
        />
        <Search_input
          search_value={search_value}
          set_search_value={this.set_search_value}
          clear_search={this.clear_search}
          no_autofocus
        />
        <ScrollView showVerticalScrollIndicator={false}>
          {purposes ? (
            purposes.length ? (
              purposes.map(purpose => (
                <Purpose
                  purpose={purpose}
                  select={(purpose, full) => {
                    select(purpose, full);
                    close_modal && close_modal();
                  }}
                  key={purpose._id}
                />
              ))
            ) : (
              <List_empty text="Cannot fetch data." />
            )
          ) : (
            <Loadindicator />
          )}
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Purposes;
