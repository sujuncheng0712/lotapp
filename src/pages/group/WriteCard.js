import React from 'react';
import {View, Text, DeviceEventEmitter, AsyncStorage,StyleSheet,TouchableOpacity,TextInput,Picker,ToastAndroid} from 'react-native';
import * as wechat from 'react-native-wechat';
const arr =[" - ","1002-工商银行","1005-农业银行","1026-中国银行","1003-建设银行","1001-招商银行",
"1066-邮储银行","1020-交通银行","1004-浦发银行","1006-民生银行","1009-兴业银行",
"1010-平安银行","1021-中信银行-1025-华夏银行","1027-广发银行","1022-光大银行",
"4836-北京银行","1056-宁波银行","1024-上海银行"];
const url = 'https://iot2.dochen.cn/api';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enc_true_name:'',
      enc_bank_no:'',
      enc_true_phone:'',
      bank:'',
      LoginInfo:'',
    };
    this.onChange = value => {
      this.setState({
        bank:value,
      });
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '填写银行卡',
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

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  submit(){
    const {enc_true_name,enc_bank_no,LoginInfo} = this.state;
    console.log(this.state.bank);
    let urlInfo = `${url}/merchantAccount`;   
    fetch(urlInfo,{
        method:"PUT",
        body:JSON.stringify({
            mid:LoginInfo.mid,
            sale_type:LoginInfo.sale_type,
            enc_true_name:this.state.enc_true_name,
            enc_bank_no:this.state.enc_bank_no,
            bank:this.state.bank,
            enc_true_phone:this.state.enc_true_phone,
        })
    }).then(res =>{
        res.json().then(info =>{
            console.log(info);
            if (info.status){
                ToastAndroid.show('提交成功', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('GroupCash');
                this.props.navigation.goBack();
            }else{
              ToastAndroid.show('提交失败', ToastAndroid.SHORT);
            }
        })
    })
}

  render() {
    const {in_out_datas,out,come,} = this.state;
    const showList = arr.map((item,key)=>{
      let label = item.split('-')[1];
      let value = item.split('-')[0];
      return(
        <Picker.Item key={key} label={label} value={value} />  
      )
    })
    return (
      <View style={{flex:1,padding:10,alignItems:'center'}}>
        <Text style={styles.top}>请绑定持卡人本人的银行卡</Text>
        <View style={styles.item}>
          <View style={styles.name}>
            <Text>姓</Text>
            <Text>名</Text>
          </View>
          <TextInput
          style={styles.input}
          placeholder={'请输入开户人姓名'}
          onChangeText={(e)=>{this.setState({enc_true_name:e});console.log(e)}}
          />
        </View>
        <View style={styles.item}>
          <View style={styles.name}>
            <Text>银</Text>
            <Text>行</Text>
          </View>
          <View
            style={styles.input}
          >
            <Picker
              mode={'dropdown'}
              style={styles.picker}
              selectedValue={this.state.bank}
              onValueChange={(value) => this.setState({bank: value})}>
             {showList}
            </Picker>
          </View>
         
        </View>
        <View style={styles.item}>
          <View style={styles.name}>
            <Text>卡</Text>
            <Text>号</Text>
          </View>
          <TextInput
          style={styles.input}
          placeholder={'请输入银行卡号'}
          onChangeText={(e)=>{this.setState({enc_bank_no:e});console.log(e)}}
          />
        </View>
        <View style={styles.item}>
          <View style={styles.name}>
            <Text>手</Text>
            <Text>机</Text>
            <Text>号</Text>
          </View>
          <TextInput
          style={styles.input}
          placeholder={'请输入银行预留手机号'}
          onChangeText={(e)=>{this.setState({enc_true_phone:e});console.log(e)}}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={()=>{this.submit()}}
        >
          <Text style={{color:'#fff'}}>确 认</Text>
        </TouchableOpacity>
      </View>
      
    );
  }
}
const styles = StyleSheet.create({
  top:{
    padding:10,
   textAlign:'left',
   color:'#666',
   width:'100%',
  },
  item:{
    width:'100%',
    flexDirection:'row',
    margin:20,
  },
  name:{
    flexDirection:'row',
    width:'30%',
    padding:10,
    alignItems:'center',
    justifyContent:'space-between',
  },
  input:{
    width:'60%',
    fontSize:15,
    borderColor:'red',
    borderWidth:1,
  },
   input:{
    width:'60%',
    fontSize:15,
    borderColor:'#666',
    borderWidth:0.5,
  },
  button:{
    marginTop:30,
    backgroundColor:'#FF7701',
    width:'80%',
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  }
})