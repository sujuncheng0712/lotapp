import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, TouchableOpacity, AsyncStorage, StyleSheet, TextInput, ToastAndroid} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
const arr = [
  {value:1,check:true},
  {value:10,check:false},
  {value:20,check:false},
  {value:30,check:false},
  {value:50,check:false},
  {value:100,check:false},
];
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enc_bank_no:'',
      balance:0,
      value:1,
      phone:'',
      password:'',
      LoginInfo:'',
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
      this.setState({LoginInfo})
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

  choose(value){
    arr.forEach((item)=>{
      console.log(item.value === value)
      if (item.value === value){
        item.check=true;
        this.setState({value})
      }else {
        item.check=false;
      }
    })
    console.log(arr);
    this.forceUpdate();
  }

  submit(){
    const {value,phone,LoginInfo}=this.state;
    console.log(value);
    console.log(phone);
    let urlInfo = `${url}/userPhoneBill`;
    fetch(urlInfo,{
      method:'POST',
      body:JSON.stringify({
        uid:LoginInfo.uid,
        sale_type:LoginInfo.sale_type,
        cost: parseInt(value) ,
        password:'',
        phone:phone,
      })
    }).then(res =>{
      res.json().then(info =>{
        console.log(info);
        if (info.status) {
          ToastAndroid.show('充值成功！', ToastAndroid.SHORT);
          this.props.navigation.navigate('Wallet',{state:'recharge'})
        }else{
          if (info.code===20001){
            ToastAndroid.show('密码错误或未设置！', ToastAndroid.SHORT);
          }else if (info.code===9006) {
            ToastAndroid.show('请输入正确电话号码！', ToastAndroid.SHORT);
          }else if (info.code===9005) {
            ToastAndroid.show('当前余额不足！', ToastAndroid.SHORT);
          }else{
            ToastAndroid.show('未知错误，请联系客服！', ToastAndroid.SHORT);
          }
        }
      })
    })
  }

  render() {
    const {balance,enc_bank_no} =this.state;

    let showList = arr.map((item,key)=>{
      return(
        <View style={{flex:1}}>
          <TouchableOpacity
            style={item.check ? styles.item : styles.item2}
            onPress={()=>{this.choose(item.value)}}
            key={key}
          >
            <Text style={{textAlign:'center'}}>
              {item.value}
            </Text>
          </TouchableOpacity>
        </View>
      )
    })
    return (
      <View style={{flex: 1,padding:10}}>
        <Text style={styles.top}>可充值金额：{balance}元</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{paddingTop:5}}>金额：</Text>
          {showList}
        </View>
        <View style={styles.phone}>
          <Text style={{paddingTop:8}}>充值电话:</Text>
          <TextInput
            onChangeText={(value)=>{this.setState({phone:value})}}
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={()=>{this.submit()}}
        >
          <Text style={{textAlign:'center',color:'#fff'}}>确认充值</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{alignItems:'flex-end',marginTop:10}}
          onPress={()=> this.props.navigation.navigate('CashRecord',{state:'recharge'})}
        >
          <Text>充值记录</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    color:'#bbb',
    marginBottom:10,
    fontWeight:'bold',
  },
  item:{
    padding:5,
    backgroundColor:'#FF7701',
    borderColor:'#bbb',
    borderWidth:0.5,
  },
  item2:{
    padding:5,
    borderColor:'#bbb',
    borderWidth:0.5,
  },
  phone:{
    flexDirection: 'row',
    marginTop: 10,
  },
  input:{
    borderWidth:0.5,
    borderColor:'#bbb',
    padding:5,
    width:'50%',
    height:25,
    marginTop:5,
    marginLeft:5,
  },
  button:{
    width: '100%',
    height: 30,
    backgroundColor: '#FF7701',
    borderRadius:5,
    marginTop:10,
    padding:5,
  }
})
