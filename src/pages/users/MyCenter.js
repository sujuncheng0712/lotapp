import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import {Button, WhiteSpace, WingBlank} from '@ant-design/react-native';
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
      header: null,
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    if (LoginInfo !== null) {
      console.log(LoginInfo.name);
      this.setState({name: LoginInfo.name});
      this.props.navigation.navigate('Home');
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  withdraw = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  render() {
    const {name} = this.state;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>我的中心</Text>
        <Button type="primary" onPress={this.withdraw}>
          注销
        </Button>
        <Button
          title="Record"
          onPress={() => this.props.navigation.push('Record')}
        />
      </View>
    );
  }
}
