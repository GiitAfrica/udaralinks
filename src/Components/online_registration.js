import React from 'react';
import {Linking} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Text_btn from './Text_btn';

class Online_registration extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {is_seller, reg} = this.props;
    let {need, url, site_details} = reg;

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

        <Text_btn
          text={url}
          action={() => {
            Linking.openURL(url);
          }}
        />

        <Fr_text bold italic>
          Site Details
        </Fr_text>
        <Fr_text>{site_details}</Fr_text>

        {is_seller ? (
          <Fr_text
            centralise
            style={{
              width: wp(60),
            }}
            italic>{`Follow procedures given in the site details to complete transaction on site.`}</Fr_text>
        ) : null}
      </Bg_view>
    );
  }
}

export default Online_registration;
