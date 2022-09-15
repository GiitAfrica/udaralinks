import React from 'react';
import {
  Text,
  TextInput,
  TouchableNativeFeedback,
  Button,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Tasks_list} from './Entry';

class Create_task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      details: '',
    };
  }

  componentDidMount = () => {
    let {navigation} = this.props;

    navigation.addListener('focus', () => {
      console.log('In create task');
      let task = this.props?.route?.params?.task;
      console.log(task);
      this.setState({task, ...task});
    });
    navigation.addListener('blur', () => {
      console.log('left create task');
      this.setState({task: null});
    });
  };

  set_title = title => this.setState({title});

  set_details = details => this.setState({details});

  add_task = () => {
    let {navigation} = this.props;
    let {title, details, _id} = this.state;

    let task = {title, details, _id: _id || Date.now()};

    _id ? this.task_context.update(task) : this.task_context.add(task);
    navigation.navigate('tasks');
  };

  render = () => {
    let {navigation} = this.props;
    let {title, details, _id} = this.state;

    return (
      <Tasks_list.Consumer>
        {task_context => {
          this.task_context = task_context;

          return (
            <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#333'}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#333',
                    paddingVertical: 20,
                  }}>
                  <View
                    style={{
                      margin: 24,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: '#555',
                      padding: 10,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        textDecorationLine: 'underline',
                      }}>
                      Task title
                    </Text>
                    <TextInput
                      placeholder="Title"
                      value={title}
                      style={{color: '#fff', fontSize: 16}}
                      placeholderTextColor="#ccc"
                      onChangeText={this.set_title}
                    />
                  </View>
                  <View
                    style={{
                      margin: 24,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: '#555',
                      padding: 10,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        textDecorationLine: 'underline',
                      }}>
                      Details
                    </Text>
                    <TextInput
                      placeholder="Details..."
                      multiline
                      value={details}
                      onChangeText={this.set_details}
                      style={{color: '#fff', fontSize: 16}}
                      placeholderTextColor="#ccc"
                    />
                  </View>
                  <View style={{margin: 24}}>
                    <Button
                      title={_id ? 'update' : 'create'}
                      disabled={!title || !details}
                      onPress={this.add_task}
                      color="#fc3"
                    />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          );
        }}
      </Tasks_list.Consumer>
    );
  };
}

export default Create_task;
