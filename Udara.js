/*
 */

import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'react-native';
import Splash from './src/Screens/splash';
import Onboarding from './src/Screens/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

//
import Emitter from './src/utils/emitter';
import Signup from './src/Screens/Signup';
import Login from './src/Screens/Login';
import Wallet from './src/Screens/Wallet';
import Market from './src/Screens/Market';
import Account from './src/Screens/Account';
import Login_et_signup from './src/Screens/Login_et_signup';
import Registration from './src/Screens/registration';
import Verification from './src/Screens/verification';
import Congratulation from './src/Screens/congratulation';
import {hp, wp} from './src/utils/dimensions';
import Bg_view from './src/Components/Bg_view';
import Icon from './src/Components/Icon';
import {get_request, post_request, sock_domain} from './src/utils/services';
import toast from './src/utils/toast';
import Update_username from './src/Screens/update_username';
import Change_password from './src/Screens/change_password';
import Update_phone from './src/Screens/update_phone';
import Privacy_policy from './src/Screens/privacy_policy';
import Sell from './src/Screens/Sell';
import Onsale_details from './src/Screens/Onsale_details';
import Offers from './src/Screens/offers';
import Chat from './src/Screens/Chat';
import Update_email from './src/Screens/update_email';
import Submit_dispute from './src/Screens/submit_dispute';
import Dispute from './src/Screens/dispute';
import Disputes from './src/Screens/disputes';
import Generate_account_number from './src/Screens/generate_account_number';
import Buyer_offers from './src/Screens/Buyer_offers';
import Notifications from './src/Screens/notifications';
import Home from './src/Screens/Home';
import Account_verification from './src/Screens/Account_verification';
import Verification_details from './src/Screens/veirification_details';
import Verification_requests from './src/Screens/verification_requests';

const User = React.createContext();

const emitter = new Emitter();

const Auth_stack = createStackNavigator();

const App_stack = createStackNavigator();

const Bottom_tab = createBottomTabNavigator();

const Admin_id = 'users~platform_user~3000';

let sock;

const Sock_offer_status = (offer, status, user) => {
  let payload = {offer, status};

  sock && sock.emit('offer_status', {user, payload});
};

class App_entry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {init_screen: 'onboarding'};
  }

  componentDidMount = () => {};

  render = () => {
    let {onboardings, init_screen} = this.props;

    return (
      <Auth_stack.Navigator
        initialRouteName={init_screen}
        screenOptions={{
          headerShown: false,
          keyboardHandlingEnabled: true,
          gestureEnabled: true,
          animationEnabled: true,
        }}>
        <Auth_stack.Screen
          name="onboarding"
          component={Onboarding}
          initialParams={{onboardings}}
        />
        <Auth_stack.Screen name="login_et_signup" component={Login_et_signup} />
        <Auth_stack.Screen name="signup" component={Signup} />
        <Auth_stack.Screen name="registration" component={Registration} />
        <Auth_stack.Screen name="verification" component={Verification} />
        <Auth_stack.Screen name="congratulation" component={Congratulation} />
        <Auth_stack.Screen name="login" component={Login} />
      </Auth_stack.Navigator>
    );
  };
}

class Index extends React.Component {
  constructor(props) {
    super(props);

    let {route} = this.props;

    this.state = {
      unseen_notifications: route.params?.user?.new_notification || 0,
    };
  }

  componentDidMount = () => {
    this.new_notification = () => {
      let {unseen_notifications} = this.state;
      unseen_notifications++;
      this.setState({unseen_notifications});
    };

    this.seen_notification = () => {
      this.setState({unseen_notifications: 0});
    };

    emitter.listen('new_notification', this.new_notification);
    emitter.listen('seen_notification', this.seen_notification);
  };

  componentWillUnmount = () => {
    emitter.remove_listener('new_notification', this.new_notification);
    emitter.remove_listener('seen_notification', this.seen_notification);
  };

  render = () => {
    let {unseen_notifications} = this.state;

    return (
      <Bottom_tab.Navigator
        initialRouteName="home"
        backBehavior="initialRoute"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF6905',
          tabBarInactiveTintColor: '#858597',
          tabBarStyle: {
            height: hp(9),
            justifyContent: 'center',
            paddingBottom: hp(1),
          },
        }}>
        <Bottom_tab.Screen
          name="home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <Icon
                icon="home_icon.png"
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
        <Bottom_tab.Screen
          name="wallet"
          component={Wallet}
          options={{
            tabBarLabel: 'Wallet',
            tabBarIcon: ({color, size}) => (
              <Icon
                icon="wallet_icon.png"
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
        <Bottom_tab.Screen
          name="market"
          component={Market}
          options={{
            tabBarLabel: 'Market',
            tabBarIcon: ({color, size}) => (
              <Icon
                icon="market_icon.png"
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
        <Bottom_tab.Screen
          name="notifications"
          component={Notifications}
          options={{
            tabBarLabel: 'Notifications',
            tabBarBadge: unseen_notifications || undefined,
            tabBarIcon: ({color, size}) => (
              <Icon
                icon="notification_icon.png"
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
        <Bottom_tab.Screen
          name="account"
          component={Account}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({color, size}) => (
              <Icon
                icon="account_icon.png"
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
      </Bottom_tab.Navigator>
    );
  };
}

class App_stack_entry extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {user} = this.props;

    return (
      <App_stack.Navigator
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          keyboardHandlingEnabled: true,
          // gestureEnabled: true,
          animationEnabled: true,
        }}>
        <App_stack.Screen
          name="index"
          initialParams={{user}}
          component={Index}
        />
        <App_stack.Screen name="change_password" component={Change_password} />
        <App_stack.Screen name="update_phone" component={Update_phone} />
        <App_stack.Screen name="update_email" component={Update_email} />
        <App_stack.Screen name="sell" component={Sell} />
        <App_stack.Screen name="onsale_details" component={Onsale_details} />
        <App_stack.Screen name="offers" component={Offers} />
        <App_stack.Screen name="submit_dispute" component={Submit_dispute} />
        <App_stack.Screen name="dispute" component={Dispute} />
        <App_stack.Screen
          name="verification_requests"
          component={Verification_requests}
        />
        <App_stack.Screen
          name="verification_details"
          component={Verification_details}
        />
        <App_stack.Screen
          name="account_verification"
          component={Account_verification}
        />
        <App_stack.Screen name="disputes" component={Disputes} />
        <App_stack.Screen name="chat" component={Chat} />
        <App_stack.Screen name="buyer_offers" component={Buyer_offers} />
        <App_stack.Screen
          name="generate_account_number"
          component={Generate_account_number}
        />
        <App_stack.Screen name="update_username" component={Update_username} />
        <App_stack.Screen name="verification" component={Verification} />
        <App_stack.Screen name="privacy_policy" component={Privacy_policy} />
      </App_stack.Navigator>
    );
  };
}

class Udara extends React.Component {
  constructor(props) {
    super(props);

    this.state = {logged: 'fetching'};
  }

  pending_payloads = new Array();

  set_socket = user => {
    sock = io(sock_domain);
    sock.on('user_id', socket_id => {
      this.sock = sock;
      sock.emit('user_id_return', {user, socket: socket_id});

      if (this.pending_payloads.length) {
        this.pending_payloads.map(({event, data}) => sock.emit(event, data));
        this.pending_payloads.clear();
      }
    });

    sock.on('wallet_topup', ({amount}) => {
      let {wallet} = this.state;
      wallet.naira += amount;
      this.setState({wallet});
    });

    sock.on('is_typing', chat => emitter.emit('is_typing', chat));

    sock.on('not_typing', chat => emitter.emit('not_typing', chat));

    sock.on('new_message', message => emitter.emit('new_message', message));

    sock.on('offer_status', payload =>
      emitter.emit('offer_status_update', payload),
    );

    return sock.connected;
  };

  reconnect_sock = () => {
    this.set_socket(this.state.user._id);
  };

  componentDidMount = async () => {
    let user = await AsyncStorage.getItem('user'),
      new_user;
    if (!user) {
      new_user = await AsyncStorage.getItem('new_user');
      if (new_user) this.setState({init_screen: 'login', logged: false});
      else {
        let onboardings = await get_request('onboardings');
        let signed_out = await AsyncStorage.getItem('signed_out');
        if (signed_out) signed_out = true;

        if (onboardings && !onboardings._$not_sent) {
          this.onboardings = onboardings;
          this.setState({logged: false, signed_out});
        } else toast('You are offline');
      }
    } else {
      let result = await get_request(`user_refresh/${user}`);
      if (result) {
        this.setState({user: result.user, wallet: result.wallet, logged: true});
        await AsyncStorage.setItem('user', result.user._id);

        this.set_socket(result.user._id);
      } else {
        this.setState({logged: false, signed_out: true});
        toast('Cannot fetch user from server.');
      }
    }

    this.verified = async ({user, country_code, wallet}) => {
      await AsyncStorage.setItem(
        'new_user',
        JSON.stringify({...user, country_code}),
      );
      this.setState({wallet, user});
    };

    this.account_verification = () =>
      this.setState({user: {...this.state.user, status: 'pending'}});

    this.logged_in = async ({user, wallet}) => {
      this.setState({logged: true, user, wallet, init_screen: ''});
      await AsyncStorage.setItem('user', user._id);
    };

    this.topup = async ({value, currency}) => {
      let {wallet} = this.state;

      let response = await post_request(`topup`, {
        value,
        currency,
        wallet: wallet._id,
        user: wallet.user,
      });

      if (response.ok) {
        if (!wallet[currency]) wallet[currency] = 0;
        wallet[currency] += value;
        emitter.emit('new_transaction', response.transaction);
        this.setState({wallet});

        return true;
      } else toast('Topup Failed!');
    };

    this.withdraw = async ({value, paycheck, transaction}) => {
      let {wallet} = this.state;

      if (paycheck) {
        if (wallet['profits'] < value) return toast('Insufficient balance');
      } else if (wallet['naira'] < value) return toast('Insufficient balance');

      if (paycheck) {
        wallet['profits'] -= value;
        if (transaction) transaction.paycheck = true;
      } else wallet['naira'] -= value;

      transaction && emitter.emit('new_transaction', transaction);

      this.setState({wallet});
    };

    this.refresh_wallet = async () => {
      toast('Refreshing wallet...');
      let wallet = await get_request(`refresh_wallet/${this.state.wallet._id}`);

      wallet && wallet._id && this.setState({wallet});
    };

    this.deduct_wallet = ({value, currency}) => {
      let {wallet} = this.state;

      wallet[currency || 'naira'] -= Number(value);
      this.setState({wallet});
    };

    this.top_wallet = ({value, currency}) => {
      let {wallet} = this.state;

      wallet[currency] += Number(value);
      this.setState({wallet});
    };

    this.signout = async () => {
      this.setState({logged: false, signed_out: true});
      await AsyncStorage.removeItem('user');
      await AsyncStorage.setItem('signed_out', '1');
    };

    this.update_fav_currency = fav_currency =>
      this.setState({wallet: {...this.state.wallet, fav_currency}});

    this.username_updated = username =>
      this.setState({user: {...this.state.user, username}});

    this.email_updated = email =>
      this.setState({user: {...this.state.user, email}});

    this.update_email = ({phone, verify_later, country_code}) =>
      this.setState({
        user: {
          ...this.state.user,
          verified: !verify_later,
          phone,
          country: country_code.country,
          country_code: country_code.country_code,
        },
      });

    this.send_message = async ({message, chat}) => {
      let data = {to: message.to, chat, message},
        event = 'message';
      if (this.sock) this.sock.emit(event, data);
      else {
        this.pending_payloads.push({event, data});
        this.reconnect_sock();
        toast('Message resending. You are not connected.');
      }
      message._id = Date.now();
      message.created = Date.now();

      return message;
    };

    this.blur_message_input = payload => this.sock.emit('not_typing', payload);

    this.focus_message_input = payload => this.sock.emit('is_typing', payload);

    emitter.listen('username_updated', this.username_updated);
    emitter.listen('update_email', this.update_email);
    emitter.listen('email_updated', this.email_updated);
    emitter.listen('update_fav_currency', this.update_fav_currency);
    emitter.listen('signout', this.signout);
    emitter.listen('deduct_wallet', this.deduct_wallet);
    emitter.listen('topup', this.topup);
    emitter.listen('top_wallet', this.top_wallet);
    emitter.listen('withdraw', this.withdraw);
    emitter.listen('verified', this.verified);
    emitter.listen('refresh_wallet', this.refresh_wallet);
    emitter.listen('logged_in', this.logged_in);
    emitter.listen('account_verification', this.account_verification);
    emitter.listen('send_message', this.send_message);
    emitter.listen('focus_message_input', this.focus_message_input);
    emitter.listen('blur_message_input', this.blur_message_input);
  };

  render = () => {
    let {logged, user, wallet, init_screen, signed_out} = this.state;
    if (wallet) wallet.fav_currency = wallet.fav_currency || 'naira';

    return (
      <NavigationContainer>
        {logged === 'fetching' ? (
          <Splash />
        ) : logged === true ? (
          <Bg_view flex>
            <StatusBar backgroundColor="#eee" barStyle="dark-content" />
            <User.Provider value={{...user, wallet}}>
              <App_stack_entry user={user} />
            </User.Provider>
          </Bg_view>
        ) : (
          <App_entry
            onboardings={this.onboardings}
            init_screen={
              init_screen
                ? init_screen
                : signed_out
                ? 'login_et_signup'
                : 'onboarding'
            }
          />
        )}
      </NavigationContainer>
    );
  };
}

export default Udara;
export {emitter, User, Admin_id, Sock_offer_status, sock};
