import React from 'react';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Text_input from './Text_input';

class Online_registration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {set_site_details, site_details, url, set_url} = this.props;

    return (
      <Bg_view style={{margin: wp(4)}}>
        <Fr_text bold>Online Registration</Fr_text>

        <Text_input
          label="Url"
          type="url"
          placeholder="Site Url"
          value={url}
          on_change_text={set_url}
        />
        <Text_input
          label="Site Details"
          placeholder="Directions on the site."
          value={site_details}
          on_change_text={set_site_details}
        />
      </Bg_view>
    );
  }
}

export default Online_registration;
