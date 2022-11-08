import React from 'react';
import {hp, wp} from '../utils/dimensions';
import {get_request} from '../utils/services';
import Bg_view from './Bg_view';
import Country_code from './country_code';
import Listfooter from './listfooter';
import List_empty from './list_empty';
import Loadindicator from './load_indicator';
import Modal_header from './modal_header';
import Search_input from './search_input';

class Country_codes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let country_codes = await get_request('country_codes');
    country_codes =
      country_codes &&
      country_codes.sort(
        (c_codex, c_codey) => c_codey.country < c_codex.country,
      );
    this.setState({country_codes});
  };

  clear_search = () => this.setState({search_value: ''});

  set_search_value = search_value => this.setState({search_value});

  render = () => {
    let {close_modal, select, exclude} = this.props;
    let {search_value, country_codes} = this.state;

    if (!exclude) exclude = new Array();

    return (
      <Bg_view
        style={{paddingVertical: hp(2.8), elevation: 10, shadowColor: '#000'}}>
        <Modal_header close={close_modal} title="country codes" />
        <Search_input
          search_value={search_value}
          set_search_value={this.set_search_value}
          clear_search={this.clear_search}
          no_autofocus
        />

        <Bg_view>
          {country_codes ? (
            country_codes.length ? (
              country_codes.map(country_code =>
                exclude.includes(country_code.code) ||
                (search_value &&
                  !country_code.country
                    .toLowerCase()
                    .includes(search_value.toLowerCase().trim())) ? null : (
                  <Country_code
                    country_code={country_code}
                    select={select}
                    key={country_code._id}
                  />
                ),
              )
            ) : (
              <List_empty text="Unable to fetch country codes" />
            )
          ) : (
            <Loadindicator />
          )}
        </Bg_view>
        <Listfooter />
      </Bg_view>
    );
  };
}

export default Country_codes;
