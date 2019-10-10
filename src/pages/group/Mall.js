import React from 'react';
import {View, Text, TouchableOpacity, AsyncStorage,ScrollView,StyleSheet,DeviceEventEmitter} from 'react-native';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: '',
      lists: [],
      count: 0,
      balance: 0,
      select_pay: 'pay/wx',
      oid:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '购买激活码',
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
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({ LoginInfo});
      let urlInfo = `${url}/products?uid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info=>{
          console.log(info);
          if(info.status){
            const lists = [];
            info.data.map((val) => {
              if (val.type === 3) {
                val.check = false;
                val.num = 1;
                lists.push(val);
              }
            });
            this.setState({lists});
            this.getBalance(LoginInfo);
          }
        })
      })

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  //获得余额
  getBalance(LoginInfo){
    let urlInfo = `${url}/wallet/${LoginInfo.mid}?sale_type=${LoginInfo.sale_type}`;
    console.log(urlInfo);
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        console.log(info);
        if (info.status) {
          this.setState({balance: info.data[0].balance});
        }

      })
    })
  }
  render() {
    const {lists, count, balance, select_pay} = this.state;
    
    return (
      <ScrollView style={{flex: 1}}>
        
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  


})