import React from 'react';
import {Image, TouchableNativeFeedback} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import {domain, post_request} from '../utils/services';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';
import Line from './line';
import Loadindicator from './load_indicator';
import Text_btn from './Text_btn';

class Verification_request extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  verify = async () => {
    let {request} = this.props;
    let {loading, verified} = this.state;
    if (loading || verified) return;

    this.setState({loading: true});

    let response = await post_request(`verify_account/${request._id}`);
    console.log(response);

    this.setState({verified: true, loading: false});
  };

  render() {
    let {loading, verified} = this.state;
    let {request} = this.props;
    let {id_type, id, phone} = request;

    return (
      <Bg_view
        style={{margin: wp(2.8), padding: wp(2.8), borderRadius: wp(4)}}
        shadowed>
        <Bg_view horizontal style={{justifyContent: 'space-between'}}>
          <Bg_view>
            <Fr_text>Photo ID:</Fr_text>
            <Fr_text capitalise size={wp(4.5)} bold>
              {id_type}
            </Fr_text>
          </Bg_view>
          <Bg_view>
            <Fr_text>Phone Number:</Fr_text>
            <Fr_text bold italic>
              {phone}
            </Fr_text>
          </Bg_view>
        </Bg_view>
        <TouchableNativeFeedback onPress={() => this.toggle_image_preview()}>
          <Image
            source={{uri: `${domain}/Images/${id}`}}
            style={{
              height: hp(40),
              width: '100%',
              marginVertical: hp(1.4),
              borderRadius: wp(4),
            }}
          />
        </TouchableNativeFeedback>

        <Line />

        <Bg_view style={{alignItems: 'center'}}>
          {verified ? (
            <Text_btn text="Verified !" bold />
          ) : loading ? (
            <Loadindicator small />
          ) : (
            <Text_btn bold centralise text="Verify" action={this.verify} />
          )}
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Verification_request;
