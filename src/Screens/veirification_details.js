import React from 'react';
import {Image, TouchableNativeFeedback} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Image_preview from '../Components/image_preview';
import Loadindicator from '../Components/load_indicator';
import {hp, wp} from '../utils/dimensions';
import {domain, get_request} from '../utils/services';

class Verification_details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggle_image_preview = () => this.image_preview.toggle_show_modal();

  componentDidMount = async () => {
    let {route} = this.props;

    let {user} = route.params;

    let detail = await get_request(`get_verification_detail/${user}`);
    this.setState({detail});
  };

  render() {
    let {navigation, route} = this.props;
    let {status} = route.params;
    let {detail} = this.state;
    let {id_type, id, phone} = detail || new Object();

    return (
      <Bg_view flex>
        <Header title="verification details" navigation={navigation} />

        {detail ? (
          <Bg_view style={{alignItems: 'center'}}>
            <Fr_text>Photo ID:</Fr_text>
            <Fr_text capitalise size={wp(4.5)} bold>
              {id_type}
            </Fr_text>

            <TouchableNativeFeedback
              onPress={() => this.toggle_image_preview()}>
              <Image
                source={{uri: `${domain}/Images/${id}`}}
                style={{
                  height: hp(40),
                  width: wp(80),
                  marginVertical: hp(1.4),
                  borderRadius: wp(4),
                }}
              />
            </TouchableNativeFeedback>

            <Bg_view style={{marginVertical: hp(2.8), alignItems: 'center'}}>
              <Fr_text>Phone Number:</Fr_text>
              <Fr_text bold italic>
                {phone}
              </Fr_text>
            </Bg_view>

            <Fr_text>Status</Fr_text>
            <Fr_text bold italic capitalise>
              {status}
            </Fr_text>
          </Bg_view>
        ) : (
          <Loadindicator />
        )}

        <Cool_modal
          flex
          height={hp()}
          ref={image_preview => (this.image_preview = image_preview)}>
          <Image_preview image={id} toggle={this.toggle_image_preview} />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Verification_details;
