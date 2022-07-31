import React from 'react';
import {StatusBar, ScrollView, BackHandler} from 'react-native';
import Bg_view from '../Components/Bg_view';
import Onboard from '../Components/onboard';
import Stretched_button from '../Components/Stretched_button';
import Swipe_indicator from '../Components/Swipe_indicator';
import {hp} from '../utils/dimensions';
import Congratulation from './Congratulation';
import Home from './Home';
import Login from './Login';
import Registration from './Registration';
import Verification from './Verification';

class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    let {navigation} = this.props;

    let onboardings = [
      {
        _id: 1,
        main_text: 'best rates',
        sub_text: 'enjoy best market rates when you buy your currency.',
        icon: require('./../Assets/Icons/onboarding_1.png'),
      },
      {
        _id: 2,
        main_text: 'buy currency',
        sub_text: 'exchange any currencies to naira for low rates.',
        icon: require('./../Assets/Icons/onboarding_2.png'),
      },
      {
        _id: 3,
        main_text: 'fully automated',
        sub_text:
          'make everyday sales of currencies for instant naira from the app to your Nigerian back account.',
        icon: require('./../Assets/Icons/onboarding_3.png'),
      },
      {
        _id: 4,
        main_text: 'payment secured',
        sub_text: 'your transactions are secured on the app with ease.',
        icon: require('./../Assets/Icons/onboarding_4.png'),
      },
    ];

    this.setState({onboardings});

    this.screen = 'splash';
    BackHandler.addEventListener('hardwareBackPress', () => {
      let is_focused = navigation.isFocused();
      is_focused && BackHandler.exitApp();

      return is_focused;
    });
  };

  get_started = () => {
    console.log('getting started');
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
    let {onboardings, current_index} = this.state;

    return true ? (
      <Bg_view flex>
        <StatusBar backgroundColor="#eee" barStyle="dark-content" />
        <Home />
      </Bg_view>
    ) : (
      <Bg_view flex>
        <StatusBar hidden />
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
              ref={swipe_indicator => (this.swipe_indicator = swipe_indicator)}
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
      </Bg_view>
    );
  };
}

export default Onboarding;
