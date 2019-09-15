import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button, AsyncStorage, FlatList, StyleSheet,SectionList} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enc_bank_no:'',
      balance:0,
      value:0,
      phone:'',
      password:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '话费充值',
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
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      let urlInfo = `${url}/userWallet?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}&type=all`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info)
          if (info.status && info.uw_datas.length >0) {
            this.setState({balance:info.uw_datas[0].balance});
          }
        })
      })

    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
    const {balance,enc_bank_no} =this.state;

    return (
      <View style={{flex: 1,padding:10}}>
        <Text>可充值金额：{balance}元</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    borderColor:'#bbb',
    borderBottomWidth:0.5,
    color:'#bbb',
  },

})
