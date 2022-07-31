/*
 */

import React from 'react';
import 'react-native-gesture-handler';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Splash from './src/Screens/splash';
import Onboarding from './src/Screens/onboarding';
import Bg_view from './src/Components/Bg_view';
import AsyncStorage from '@react-native-async-storage/async-storage';

//
import Emitter from './src/utils/emitter';
import Signup from './src/Screens/Signup';
import Login from './src/Screens/Login';
import Home from './src/Screens/Home';
import Wallet from './src/Screens/Wallet';
import Market from './src/Screens/Market';
import Tracks from './src/Screens/Tracks';
import Account from './src/Screens/Account';

const emitter = new Emitter();

// const Auth_stack = createStackNavigator();

// const Bottom_tab = createBottomTabNavigator();

// class App_entry extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {init_screen: 'onboarding'};
//   }

//   componentDidMount = () => {};

//   render = () => {
//     let {init_screen} = this.state;
//     return (
//       <Auth_stack.Navigator
//         initialRouteName={init_screen}
//         screenOptions={{headerShown: false}}>
//         <Auth_stack.Screen name="onboarding" component={Onboarding} />
//         <Auth_stack.Screen name="signup" component={Signup} />
//         <Auth_stack.Screen name="login" component={Login} />
//         {/* <Auth_stack.Screen name="forgot_password" component={Forgot_password} />
//         <Auth_stack.Screen name="reset_password" component={Reset_password} /> */}
//       </Auth_stack.Navigator>
//     );
//   };
// }

// class Index extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render = () => {
//     return (
//       <Bottom_tab.Navigator
//         backBehavior="initialRoute"
//         screenOptions={{
//           headerShown: false,
//           tabBarActiveTintColor: '#FF6905',
//           tabBarInactiveTintColor: '#858597',
//           tabBarStyle: {
//             height: hp(8),
//             justifyContent: 'center',
//             paddingBottom: hp(1),
//           },
//         }}>
//         <Bottom_tab.Screen
//           name="home"
//           component={Home}
//           options={{
//             tabBarLabel: 'Home',
//             // tabBarIcon: ({color, size}) => (
//             //   <Feather name="home" color={color} size={size} />
//             // ),
//           }}
//         />
//         <Bottom_tab.Screen
//           name="wallet"
//           component={Wallet}
//           options={{
//             tabBarLabel: 'Wallet',
//             // tabBarIcon: ({color, size}) => (
//             //   <Feather name="book" color={color} size={size} />
//             // ),
//           }}
//         />
//         <Bottom_tab.Screen
//           name="market"
//           component={Market}
//           options={{
//             tabBarLabel: 'Market',
//             // tabBarIcon: ({color, size}) => (
//             //   <Feather name="search" color={color} size={size} />
//             // ),
//           }}
//         />
//         <Bottom_tab.Screen
//           name="tracks"
//           component={Tracks}
//           options={{
//             tabBarLabel: 'Tracks',
//             // tabBarIcon: ({color, size}) => (
//             //   <Feather name="message-circle" color={color} size={size} />
//             // ),
//           }}
//         />
//         <Bottom_tab.Screen
//           name="account"
//           component={Account}
//           options={{
//             tabBarLabel: 'Account',
//             // tabBarIcon: ({color, size}) => (
//             //   <Feather name="user" color={color} size={size} />
//             // ),
//           }}
//         />
//       </Bottom_tab.Navigator>
//     );
//   };
// }

class Udara extends React.Component {
  constructor(props) {
    super(props);

    this.state = {logged: 'fetching'};
  }

  componentDidMount = async () => {
    let user = await AsyncStorage.getItem('user');
    if (!user) this.setState({logged: false});
    else {
      // Fetch from server
    }
  };

  render = () => {
    let {logged} = this.state;
    return (
      <NavigationContainer>
        <Bg_view flex>
          {logged === 'fetching' ? (
            <Splash />
          ) : logged === true ? (
            <></>
          ) : (
            <Onboarding />
          )}
        </Bg_view>
      </NavigationContainer>
    );
  };
}

export default Udara;
