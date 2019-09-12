import React from 'react';
import {
  View,
  Text,
  AsyncStorage,
  BackHandler,
  ToastAndroid,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
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
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onBackAndroid = () => {
    if (this.props.navigation.isFocused()) {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        BackHandler.exitApp();
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
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
      <View style={{flex:1}}>
        <View style={styles.top}>
          <ImageBackground
            style={styles.ImageBackground }
            source={require('../../images/usr_info.jpg')}>
            <Text style={{
              marginTop:50,
            }}>{name}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={this.withdraw}>
              <Text>注销</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={styles.content}>
          <View style={{padding:10}}>
            <Text>我的订单</Text>
          </View>
          <View style={styles.orderList}>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'未付款'})}>
              <Image
                style={styles.orderImg}
                source={require('../../images/user/unpay.png')}
              />
              <Text>未付款</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'待发货'})}>
              <Image
                style={styles.orderImg}
                source={require('../../images/user/unsend.png')}
              />
              <Text>待发货</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'待收货'})}>
              <Image
                style={styles.orderImg}
                source={require('../../images/user/car.png')}
              />
              <Text>待收货</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'退款/售后'})}>
              <Image
                style={styles.orderImg}
                source={require('../../images/user/havesell.png')}
              />
              <Text>退款/售后</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  top:{
    flex: 0.3,
    alignItems: 'center',
    width: '100%',
  },
  content:{
    flex:0.6,
  },
  button: {
    backgroundColor: '#0078D7',
    borderColor: '#0078D7',
    color: '#FF7A01',
    textAlign: 'center',
    borderRadius: 100,
    width: 50,
    fontSize: 10,
    padding: 5,
    height:30,
    marginLeft:50,
    marginTop:50,
  },
  ImageBackground:{
    flex:1,
    width:'100%',
    height:'100%',
    flexDirection: 'row',
    alignContent:'center',
    justifyContent:'center',
  },
  orderList:{
    padding:10,
    flexDirection: 'row',
  },
  orderItem:{
    flex:0.25,
    color: '#FF7A01',
    textAlign: 'center',
    fontSize: 10,
    padding: 5,
    alignItems: 'center',
  },
  orderImg:{
    width:45,
    height:45,
  },
})
