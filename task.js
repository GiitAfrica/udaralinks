import React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  update_task = () => {
    let {task, navigation} = this.props;

    navigation.navigate('create_task', {task});
  };

  render() {
    let {task, remove} = this.props;
    let {title, details, _id} = task;

    return (
      <TouchableNativeFeedback onPress={this.update_task}>
        <View
          style={{
            borderBottomColor: '#555',
            borderBottomWidth: 1,
            paddingBottom: 12,
            marginTop: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                marginBottom: 8,
                fontWeight: 'bold',
              }}>
              {title}
            </Text>
            <TouchableNativeFeedback
              onPress={() => {
                remove(_id);
              }}>
              <View>
                <Text
                  style={{
                    color: 'yellow',
                    fontSize: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}>
                  X
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <Text style={{lineHeight: 22, color: '#eee'}}>{details}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

export default Task;
