import React from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

class Modal_example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let fetch_data = await fetch('http://192.168.0.100:3000/data');
    let data = await fetch_data.json();

    this.setState({data: data.data});
  };

  render = () => {
    let {data} = this.state;
    console.log(data, 'data');

    return (
      <View style={{flex: 1, backgroundColor: '#fc3', padding: 24}}>
        {data ? (
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginVertical: 5,
                  color: '#000',
                }}>
                {item.name}
              </Text>
            )}
            ListEmptyComponent={<></>}
          />
        ) : (
          <ActivityIndicator size="large" color="#000" />
        )}
      </View>
    );
  };
}

export default Modal_example;
