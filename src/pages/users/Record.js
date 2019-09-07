import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button, AsyncStorage} from 'react-native';
import * as wechat from 'react-native-wechat';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      uuid: '',
      name: '',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'record',
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  render() {
    const {name} = this.state;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>记录</Text>
      </View>
    );
  }
}
