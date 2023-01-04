import React from 'react';
import {Image, TouchableWithoutFeedback} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import {domain} from '../utils/services';
import Bg_view from './Bg_view';
import Cool_modal from './cool_modal';
import Fr_text from './Fr_text';
import Image_preview from './image_preview';
import Offer from './offer';

class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggle_image_preview = () => this.image_preview.toggle_show_modal();

  componentDidMount = () => {};

  format_time = timestamp => {
    let datetime = new Date(timestamp || Date.now());
    let now = Date.now(),
      a_day = 60 * 60 * 24 * 1000;
    let time = `${String(datetime.getHours()).padStart(2, '0')}:${String(
      datetime.getMinutes(),
    ).padStart(2, '0')}`;

    let time_diff = now - datetime.getTime();
    if (time_diff < a_day) return time;
    else if (time_diff < 2 * a_day) return `Yesterday, ${time}`;
    else
      return `${String(datetime.getDate()).padStart(2, '0')}.${String(
        datetime.getMonth(),
      ).padStart(2, '0')}, ${time}`;
  };

  render() {
    let {message, loggeduser, centralise, navigation, onsale} = this.props;
    let {text, from, created, attachment, attachment_meta} = message;
    if (!attachment) attachment = new Array();

    let is_me = loggeduser._id === from;
    let is_offer_attached =
        attachment &&
        attachment.length &&
        attachment[0] &&
        attachment[0]._id?.startsWith('offer'),
      is_image_attached;

    if (!is_offer_attached) {
      is_image_attached = attachment && attachment[0];
      if (centralise) is_offer_attached = centralise;
    }

    return (
      <Bg_view
        style={{
          backgroundColor: is_offer_attached && !centralise ? null : '#eee',
          borderRadius: wp(2.8),
          minWidth: wp(20),
          maxWidth: is_offer_attached ? null : wp(80),
          paddingHorizontal: wp(2.8),
          alignSelf: is_offer_attached
            ? 'center'
            : is_me
            ? 'flex-end'
            : 'flex-start',
          marginBottom: hp(1.4),
          marginRight: wp(1.4),
        }}>
        {is_offer_attached && !centralise ? (
          <Offer
            user={loggeduser}
            onsale={onsale}
            navigation={navigation}
            status={attachment_meta?.status}
            offer={attachment[0]}
          />
        ) : (
          <Fr_text
            style={{marginTop: hp(1.4), margin: 0, padding: 0}}
            opacity={0.9}>
            {text}
          </Fr_text>
        )}
        {is_image_attached ? (
          <TouchableWithoutFeedback onPress={() => this.toggle_image_preview()}>
            <Image
              source={
                is_image_attached.endsWith('.jpg')
                  ? {uri: `${domain}/Images/${is_image_attached}`}
                  : {uri: `data:image/jpeg;base64,${is_image_attached}`}
              }
              style={{
                height: 100,
                width: 100,
                borderRadius: wp(2),
                padding: wp(2.8),
              }}
            />
          </TouchableWithoutFeedback>
        ) : null}
        <Fr_text
          style={{
            textAlign: 'right',
            margin: 0,
            padding: 0,
            marginBottom: hp(1.4),
          }}
          size={wp(3)}
          italic
          color="#333">
          {this.format_time(created)}
        </Fr_text>

        <Cool_modal
          flex
          height={hp()}
          ref={image_preview => (this.image_preview = image_preview)}>
          <Image_preview
            image={is_image_attached}
            toggle={this.toggle_image_preview}
          />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Message;
