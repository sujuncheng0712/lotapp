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
      header: null,
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
    if(LoginInfo ===null){
      this.props.navigation.navigate('Login',{_isLogin: true});
    }else{
      if (LoginInfo.type === null) {
        this.props.navigation.push('Home', {_isLogin: true});
      } else {
        this.props.navigation.push('GroupHome',{_isLogin: true});
      }
    }
    
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        
      </View>
    );
  }
}
