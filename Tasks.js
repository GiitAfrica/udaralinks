import React from 'react';
import {Text, TouchableNativeFeedback, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Tasks_list} from './Entry';
import Task from './task';

class Tasks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {};

  create_task = () => this.props.navigation.navigate('create_task');

  render_tasks = tasks =>
    tasks.map(task => (
      <Task
        key={task._id}
        task={task}
        remove={this.remove_task}
        navigation={this.props.navigation}
      />
    ));

  render = () => {
    let {navigation} = this.props;

    return (
      <Tasks_list.Consumer>
        {({tasks, remove}) => {
          this.remove_task = remove;

          return (
            <View
              style={{
                flex: 1,
                backgroundColor: '#333',
                padding: 20,
              }}>
              {tasks.length ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {this.render_tasks(tasks)}
                </ScrollView>
              ) : (
                <View style={{flex: 1, paddingTop: 40, alignItems: 'center'}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                      marginBottom: 24,
                    }}>
                    You don't have any tasks yet.
                  </Text>
                  <TouchableNativeFeedback onPress={this.create_task}>
                    <View
                      style={{
                        backgroundColor: '#fc3',
                        borderRadius: 10,
                        padding: 4,
                        minWidth: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        Create Task
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}
              {tasks.length ? (
                <TouchableNativeFeedback
                  onPress={() => navigation.navigate('create_task')}>
                  <View
                    style={{
                      backgroundColor: '#fc3',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      position: 'absolute',
                      bottom: 40,
                      right: 24,
                    }}>
                    <Text style={{color: '#fff', fontSize: 48}}>+</Text>
                  </View>
                </TouchableNativeFeedback>
              ) : null}
            </View>
          );
        }}
      </Tasks_list.Consumer>
    );
  };
}

export default Tasks;
