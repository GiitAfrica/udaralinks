import React from 'react';
import {StatusBar, ScrollView, BackHandler} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Onboard from '../Components/onboard';
import Stretched_button from '../Components/Stretched_button';
import Swipe_indicator from '../Components/Swipe_indicator';
import {hp} from '../utils/dimensions';

class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    let {navigation} = this.props;

    this.screen = 'splash';
    BackHandler.addEventListener('hardwareBackPress', () => {
      let is_focused = navigation.isFocused();
      is_focused && BackHandler.exitApp();

      return is_focused;
    });
  };

  get_started = () => {
    let {navigation} = this.props;
    navigation.navigate('login_et_signup');
  };

  swipe_index = ({contentOffset, layoutMeasurement}) => {
    this.setState(
      {
        current_index: Math.floor(contentOffset.x / layoutMeasurement.width),
      },
      () => this.swipe_indicator.setState({current: this.state.current_index}),
    );
  };

  render = () => {
    let {current_index} = this.state;
    let {onboardings} = this.props.route.params;

    return (
      <Bg_view flex>
        <StatusBar hidden />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView
            horizontal
            onScroll={e => {
              this.swipe_index(e.nativeEvent);
            }}
            showsHorizontalScrollIndicator={false}
            pagingEnabled>
            {onboardings &&
              onboardings.map(onboard => (
                <Onboard onboard={onboard} key={onboard._id} />
              ))}
          </ScrollView>

          <Bg_view
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp(5),
            }}
            horizontal>
            {onboardings ? (
              <Swipe_indicator
                ref={swipe_indicator =>
                  (this.swipe_indicator = swipe_indicator)
                }
                count={onboardings.length}
                current={current_index}
              />
            ) : null}
          </Bg_view>

          <Stretched_button
            caps
            style={{marginBottom: hp(10)}}
            title="get started"
            action={this.get_started}
          />
        </ScrollView>
      </Bg_view>
    );
  };
}

export default Onboarding;
