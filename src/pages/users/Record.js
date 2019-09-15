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
      headerTitle: '补贴记录',
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({name: LoginInfo.name});
      //获取物流信息
      let urlInfo = `${url}/logisticsPage_create?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;

    } else {
      this.props.navigation.navigate('Login');
    }
  };

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
