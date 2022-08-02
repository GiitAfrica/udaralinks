import React from 'react';
import {hp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Modal from 'react-native-modal';

class Cool_modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggle_show_modal = () => this.setState({show_modal: !this.state.show_modal});

  render = () => {
    let {children, no_swipe} = this.props;
    let {show_modal} = this.state;

    return (
      <Modal
        isVisible={show_modal}
        backdropColor="#fff"
        onBackdropPress={this.toggle_show_modal}
        swipeDirection={no_swipe ? null : 'down'}
        onSwipeComplete={no_swipe ? null : this.toggle_show_modal}
        onBackButtonPress={this.toggle_show_modal}
        style={{margin: 0, padding: 0, justifyContent: 'flex-end'}}>
        <Bg_view no_bg style={{marginTop: hp(5)}}>
          {children}
        </Bg_view>
      </Modal>
    );
  };
}

export default Cool_modal;
