import React from 'react';
import {Image} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import {domain} from '../utils/services';
import Bg_view from './Bg_view';
import Header from './header';

class Image_preview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {image, toggle} = this.props;

    return (
      <Bg_view flex>
        <Header title="Image" close_fn={toggle} />

        <Bg_view flex style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={
              image.endsWith('.jpg')
                ? {uri: `${domain}/Images/${image}`}
                : {uri: `data:image/jpeg;base64,${image}`}
            }
            style={{width: wp(), height: hp(), resizeMode: 'contain'}}
          />
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Image_preview;
