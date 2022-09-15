import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// Screens
import Create_task from './Create_task';
import Tasks from './Tasks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, Text, View} from 'react-native';

let Stack_navigation = createStackNavigator();
let Tasks_list = React.createContext();

class Stack_nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Stack_navigation.Navigator
        initialRouteName="tasks"
        screenOptions={{
          headerTitleStyle: {color: '#fff', textTransform: 'capitalize'},
          headerStyle: {backgroundColor: '#333'},
          gestureEnabled: true,
        }}>
        <Stack_navigation.Screen
          name="create_task"
          component={Create_task}
          options={{title: 'create task'}}
        />
        <Stack_navigation.Screen
          name="tasks"
          component={Tasks}
          options={{title: 'tasks'}}
        />
      </Stack_navigation.Navigator>
    );
  };
}

class Entry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let tasks = await AsyncStorage.getItem('tasks');
    tasks = tasks ? JSON.parse(tasks) : new Array();

    this.setState({tasks});
  };

  persist_to_store = async () => {
    let {tasks} = this.state;
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  };

  add = task => {
    let {tasks} = this.state;
    tasks.unshift(task);
    this.setState({tasks}, this.persist_to_store);
  };

  update = task => {
    let {tasks} = this.state;

    tasks = tasks.map(task_ => {
      if (task_._id === task._id) return task;
      return task_;
    });

    this.setState({tasks}, this.persist_to_store);
  };

  remove = task_id => {
    let {tasks} = this.state;
    tasks = tasks.filter(task => task._id !== task_id);

    this.setState({tasks}, this.persist_to_store);
  };

  render() {
    let {tasks} = this.state;

    return (
      <NavigationContainer>
        {tasks ? (
          <Tasks_list.Provider
            value={{
              add: this.add,
              update: this.update,
              remove: this.remove,
              tasks,
            }}>
            <Stack_nav />
          </Tasks_list.Provider>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: '#333',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" />
            <Text style={{color: '#fff'}}>Fetching tasks...</Text>
          </View>
        )}
      </NavigationContainer>
    );
  }
}

export default Entry;
export {Tasks_list};
