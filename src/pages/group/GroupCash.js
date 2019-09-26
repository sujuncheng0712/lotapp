import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button, AsyncStorage,Image,StyleSheet,ScrollView,ToastAndroid,TouchableOpacity,FlatList} from 'react-native';
import * as wechat from 'react-native-wechat';
import { T } from 'antd/lib/upload/utils';
import { TextInput } from 'react-native-gesture-handler';
const url = 'https://iot2.dochen.cn/api';
let arr =["1002-工商银行","1005-农业银行","1026-中国银行","1003-建设银行","1001-招商银行",
    "1066-邮储银行","1020-交通银行","1004-浦发银行","1006-民生银行","1009-兴业银行",
    "1010-平安银行","1021-中信银行-1025-华夏银行","1027-广发银行","1022-光大银行",
    "4836-北京银行","1056-宁波银行","1024-上海银行"];
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:{},
      short_no:'',
      bank:'',
      balance:'',
      account:'',
      name:'',
      mobile:'',
      amount:0,
      password:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '我要提现',
    };
  };

  // render创建之前
  componentWillMount() {
  
  }

  componentDidMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
}

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    console.log(LoginInfo)
    LoginInfo = eval('(' + LoginInfo + ')');
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({ LoginInfo});
      //获取信息
      let urlInfo = `${url}/merchantPlus?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}&type=bank`;
      console.log(urlInfo);
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
            console.log(info);
            if(info.status){
                let bank = info.bank_data.bank.toString();
                let balance = info.balance.toString();
                let account =  info.bank_data.enc_bank_no;
                let short_no = account.slice(account.length-4);
                let name = info.bank_data.enc_true_name;
                let mobile = info.bank_data.enc_true_phone;
                // arr.forEach(item =>{
                //     let val = item.split('-')[0];
                //     if (val ===bank){
                //         bank = item.split('-')[1];
                //     }
                // })

                this.setState({short_no,bank,balance,account,name,mobile});
            }
        })
    })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  submit(){
    const {amount,mobile,name,account,bank,password,balance,} = this.state;
    if (amount > balance) {
       message.error('请输入正确金额')
       return false;
    }
    let urlInfo = `${url}/wallet/${LoginInfo.mid}/apply`;
    fetch(urlInfo,{
        method:'POST',
        body:JSON.stringify({
            amount:amount,
            name:name,
            account:account,
            mobile:mobile,
            sale_type:auth.sale_type,
            bank:bank,
            mid:auth.mid,
            password:password,
        })
    }).then(res =>{
        res.json().then(info =>{
            console.log(info);
            if (info.status){
                ToastAndroid.show('申请提现成功', ToastAndroid.SHORT);
                //window.location.hash='/group/cashRecord/b';
            }else{
                if (info.code===20001){
                   ToastAndroid.show('提现密码错误或未设置', ToastAndroid.SHORT);
                }
            }
        })
    })
}

  render() {
    const {short_no,bank,balance,password} = this.state;
    
    return (
      <View style={{flex:1,padding:10}}>
        <View style={styles.top}>
          <Text style={styles.topItem}>(尾号{short_no === '' ? '--' :short_no})</Text>
          <Text style={styles.topItem2}>修改绑定银行卡 ></Text>
        </View>
        <View>
          <Text style={{padding:10,color:'#666', fontWeight:'bold',}}>可提现金额：{balance ===''?'0':balance}元</Text>
        </View>
        <View style={{width:'100%',flexDirection:'row'}}>
          <View style={styles.moneyList}>
            <Text style={styles.money}>金</Text>
            <Text style={{...styles.money,textAlign:'right'}}>额</Text>
          </View>
          <TextInput 
             style={styles.input}
             placeholder={'提现金额不得少于30元'}
             onChangeText={(e)=>{this.setState({amount:e});console.log(e)}}
          />
        </View>
       
        <View style={{width:'100%',flexDirection:'row'}}>
          <View style={{...styles.moneyList,justifyContent:'space-between'}}>
            <Text style={styles.code}>提</Text>  
            <Text style={styles.code}>现</Text>  
            <Text style={styles.code}>密</Text>  
            <Text style={styles.code}>码</Text>  
          </View>
          <TextInput 
             style={styles.input}
             placeholder={'请输入提现密码'}
             onChangeText={(e)=>{this.setState({password:e});console.log(e)}}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('ScanScreen',{state:'add'});
          }}>
          <Text
            style={{
              color:'white',
              textAlign:'center',
            }}
          >确认提现</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'row',width:'100%',marginTop:10}}>
          <TouchableOpacity
            style={styles.buttom}
            onPress={() => {
              this.props.navigation.navigate('ScanScreen',{state:'add'});
            }}>
            <Text
              style={{
                color:'#bbb',
                textAlign:'left',
              }}
            >设置提现密码</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.buttom}}
            onPress={() => {
              this.props.navigation.navigate('ScanScreen',{state:'add'});
            }}>
            <Text
              style={{
                color:'black',
                textAlign:'right',
              }}
            >提现记录</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    width:'100%',
  },
  topItem:{
    width:'50%',
    textAlign:'left',
    color:'#666',
    padding:10,
    fontWeight:'bold',
  },
  topItem2:{
    width:'50%',
    textAlign:'right',
    color:'#666',
    padding:10,
  },
  listDate:{
    width:'30%',
    padding:10,
    textAlign:'center',
  },
  listTitle:{
    width:'23%',
    padding:10,
    textAlign:'center',
  },
  moneyList:{
    flexDirection:'row',
    width:'36%',
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  money:{
    textAlign:'left',
    width:'50%',
    fontWeight:'bold',
    color:'#666',
    fontSize:15,
  }, 
  code:{
    fontWeight:'bold',
    color:'#666',
    fontSize:15,
  },
  input:{
    width:'60%',
    fontSize:15,
  },
  button:{
    backgroundColor: '#bbb',
    borderColor:'#bbb',
    color:'#fff',
    textAlign:'center',
    borderRadius:5,
    width: '100%',
    fontSize:10,
    padding: 5,
    marginTop: 40,
  },
  buttom:{
    width:'50%',
  }
})