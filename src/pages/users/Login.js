import React from 'react';
import {
  AsyncStorage,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import * as wechat from 'react-native-wechat';
import {Button, WhiteSpace, WingBlank} from '@ant-design/react-native';
const url = 'https://iot2.dochen.cn/api';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  componentDidMount() {
    // try {
    //   wechat.registerApp('wxed79edc328ec284a');
    // } catch (e) {
    //   console.error(e);
    // }
  }

  render() {
    const Login = () => {
      const {username, password} = this.state;
      let urlInfo = `${url}/auth`;
      fetch(urlInfo, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
          type: 'user_app',
        }),
      }).then(res => {
        res.json().then(info => {
          if (info.status) {
            _storeData(info.data,1);
          } else {
            ToastAndroid.show('登录失败，请检查用户名和密码', ToastAndroid.SHORT);
          }
        });
      });
    };

    const GroupLogin = () => {
      const {username, password} = this.state;
      let urlInfo = `${url}/auth?type=merchants&username=${username}&password=${password}&
      auth_type=wx`;
      fetch(urlInfo, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
          auth_type: 'wx',
          type:'merchants',
        }),
      }).then(res => {
        res.json().then(info => {
          console.log(info);
          if (info.status) {
            _storeData(info.data,2);
          } else {
            ToastAndroid.show('登录失败，请检查用户名和密码', ToastAndroid.SHORT);
          }
        });
      });
    };

    

    // 本地存储
    const _storeData = async (data,state) => {
      //data.token = Date.parse(new Date());
      console.log(data);
      try {
        await AsyncStorage.setItem('LoginInfo', JSON.stringify(data), () => {
          // 存储成功后跳转
            this.props.navigation.push('White', {_isLogin: true});
        });
      } catch (error) {
        // Error saving data
      }
    };
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>登录</Text>
        <View>
          <TextInput
            style={styles.input_text}
            placeholder={'账号'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={text => this.setState({username: text})}
          />
        </View>
        <View>
          <TextInput
            style={styles.input_text}
            placeholder={'密码'}
            autoCapitalize={'none'}
            autoCorrect={false}
            secureTextEntry={true}
            maxLength={16}
            onChangeText={text => this.setState({password: text})}
          />
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10}}>
          <Button
            type="primary"
            style={{margin:5}}
            onPress={() => {
              Login();
            }}>
            个人登录
          </Button>
          <Button
            type="primary"
            style={{margin:5}}
            onPress={() => {
              GroupLogin();
            }}>
            商家登录
          </Button>
        </View>
      </View>
    );
  }
}

// 获得屏幕宽度高度
const swidth = Dimensions.get('window').width;
const sheight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
    width: swidth * 0.7,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  input_icon: {
    width: 50 * 0.4,
    height: 49,
  },
  input_text: {
    width: swidth * 0.7 - 50 * 0.4 - 10,
    height: 35,
    paddingVertical: 0,
  },
  forget: {
    marginTop: 36,
    flex: 1,
    alignItems: 'flex-end',
  },
  forget_text: {
    color: '#517eff',
  },
  button: {
    width: swidth * 0.7,
    height: (swidth / 6.7) * 0.7,
    marginTop: 36,
  },

  come_back: {
    position: 'absolute',
    left: 22,
    top: 15,
  },
});
