import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Cool_modal from '../Components/cool_modal';
import Country_codes from '../Components/country_codes';
import Fr_text from '../Components/Fr_text';
import Header from '../Components/header';
import Icon from '../Components/Icon';
import Image_preview from '../Components/image_preview';
import Stretched_button from '../Components/Stretched_button';
import Text_btn from '../Components/Text_btn';
import {wp, hp} from '../utils/dimensions';
import {validate_phone} from '../utils/functions';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {domain, post_request} from '../utils/services';
import toast from '../utils/toast';
import {emitter} from '../../Udara';

class Account_verification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {phone: ''};
  }

  toggle_country_codes = () =>
    this.cool_modal && this.cool_modal.toggle_show_modal();

  set_country_code = country_code =>
    this.setState(
      {country_code, phone: this.clean_phone()},
      this.toggle_country_codes,
    );

  set_phone = phone => this.setState({phone});

  clean_phone = () => {
    let {country_code, phone} = this.state;
    if (!country_code || !phone) return phone;

    return phone.replace(country_code.code, '');
  };

  toggle_id_picker = async () => {
    let files = await DocumentPicker.pick({
      mode: 'open',
      type: DocumentPicker.types.images,
      allowMultiSelection: false,
      readContent: true,
    });

    files &&
      files[0] &&
      this.setState({
        files,
        id: await RNFS.readFile(files[0].uri, 'base64'),
      });
  };

  set_id_type = id_type => this.setState({id_type});

  toggle_image_preview = () => this.image_preview.toggle_show_modal();

  id_types = new Array(
    'driver license',
    'voters card',
    'passport',
    'national ID',
  );

  submit = async () => {
    let {navigation, route} = this.props;
    let {user} = route.params;
    let {phone, country_code, id, id_type} = this.state;

    this.setState({loading: true});

    let token = {
      phone,
      country_code,
      id,
      id_type,
      user,
    };

    let response = await post_request('account_verification', token);
    console.log(response);
    if (response.id) {
      token.id = response.id;
      emitter.emit('account_verification');
      navigation.goBack();
    } else {
      this.setState({loading: false});
      toast('Err, something went wrong.');
    }
  };

  render() {
    let {navigation} = this.props;
    let {country_code, id, id_type, invalid_phone, phone, loading} = this.state;

    return (
      <Bg_view flex>
        <Header title="Verify your profile" navigation={navigation} />

        <ScrollView>
          <KeyboardAvoidingView style={{flex: 1}}>
            <Bg_view
              style={{
                height: hp(15),
                margin: wp(5.6),
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: wp(4),
                marginTop: hp(4),
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: wp(4),
                paddingRight: wp(2.8),
              }}>
              {country_code && (
                <TouchableWithoutFeedback onPress={this.toggle_country_codes}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      icon={country_code.flag}
                      style={{height: wp(10), width: wp(10)}}
                    />

                    <Fr_text
                      size={wp(4.5)}
                      bold
                      color="#28100B"
                      style={{marginLeft: wp(1.4)}}>
                      {country_code.code}
                    </Fr_text>
                  </View>
                </TouchableWithoutFeedback>
              )}
              <TextInput
                placeholder="Phone Number..."
                keyboardType="phone-pad"
                placeholderTextColor="#ccc"
                onChangeText={this.set_phone}
                value={this.clean_phone(phone)}
                style={{
                  flex: 1,
                  fontSize: wp(4.5),
                  color: '#28100B',
                  marginRight: wp(1.4),
                  fontWeight: 'bold',
                }}
              />
              {validate_phone(
                country_code ? country_code.code + phone : phone,
              ) ? (
                <Icon
                  icon="id_verification_icon.png"
                  style={{height: wp(7.5), width: wp(7.5)}}
                />
              ) : null}
            </Bg_view>

            <Bg_view style={{margin: wp(4)}}>
              <Fr_text style={{marginLeft: wp(1.4)}} capitalise>
                Select means of Photo ID
              </Fr_text>
              <Bg_view horizontal style={{flexWrap: 'wrap'}}>
                {this.id_types.map(type => (
                  <Text_btn
                    text={type}
                    capitalise
                    key={type}
                    bold
                    action={() => this.set_id_type(type)}
                    accent={type === id_type}
                  />
                ))}
              </Bg_view>

              {id_type ? (
                <Bg_view style={{alignItems: 'center'}}>
                  <Text_btn
                    text="Upload ID"
                    bold
                    accent
                    action={this.toggle_id_picker}
                  />

                  {id ? (
                    <TouchableWithoutFeedback
                      onPress={() => this.toggle_image_preview()}>
                      <Image
                        source={
                          id.endsWith('.jpg')
                            ? {uri: `${domain}/Images/${id}`}
                            : {uri: `data:image/jpeg;base64,${id}`}
                        }
                        style={{
                          height: hp(40),
                          width: wp(80),
                          borderRadius: wp(2),
                          padding: wp(2.8),
                        }}
                      />
                    </TouchableWithoutFeedback>
                  ) : null}
                </Bg_view>
              ) : null}
            </Bg_view>
            <Stretched_button
              title="Submit"
              disabled={invalid_phone || !phone}
              action={this.submit}
              updating={loading}
            />

            <Fr_text
              centralise
              italic
              style={{marginHorizontal: wp(5), marginBottom: hp(5)}}>
              On submission, your details would be reviewed by our admins
              shortly.
            </Fr_text>
          </KeyboardAvoidingView>
        </ScrollView>

        <Cool_modal ref={cool_modal => (this.cool_modal = cool_modal)}>
          <Country_codes
            close_modal={() =>
              this.cool_modal && this.cool_modal.toggle_show_modal()
            }
            select={this.set_country_code}
          />
        </Cool_modal>

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

export default Account_verification;
