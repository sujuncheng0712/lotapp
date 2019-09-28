import React from 'react';
import {View, Text, AsyncStorage,StyleSheet,TouchableOpacity,TextInput,ToastAndroid} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile:'',
      code:'',
      new_password:'',
      password:'',
      state:'',
      LoginInfo:'',
    };
   
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '设置提现密码',
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
      let state = this.props.navigation.getParam('state','');
      this.setState({ LoginInfo,state});
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  getCode(){
    let urlInfo = `${url}/users/code`;
    fetch(urlInfo,{
        method:'POST',
        body:JSON.stringify({
            mobile:this.state.mobile,
        })
    }).then(res =>{
        res.json().then(info =>{
            console.log(info);
            if (info.status) {
                ToastAndroid.show('验证码已发送', ToastAndroid.SHORT);
            }
        })
    })
}

submit(){
    const {new_password,password,code,mobile,state,LoginInfo} = this.state;
    let urlInfo = `${url}/merchantAccount`;
    let urlInfo2 = `${url}/userPhoneBill`;
    if (new_password !== password) {
        ToastAndroid.show('密码不一致', ToastAndroid.SHORT);
        return false;
    }
    console.log(new_password);
    console.log(code);
    console.log(mobile);
    console.log(state);
    if(state ==='group'){
        fetch(urlInfo,{
            method:'POST',
            body:JSON.stringify({
                new_password:new_password,
                mid:LoginInfo.mid,
                sale_type:LoginInfo.sale_type,
                code:code,
                mobile:mobile,
            })
        }).then(res =>{
            res.json().then(info =>{
                console.log(info);
                if (info.status){
                    ToastAndroid.show('设置成功', ToastAndroid.SHORT);
                    this.props.navigation.goBack();
                }else{
                    if (info.code ===20001) {
                        ToastAndroid.show('验证码错误', ToastAndroid.SHORT);
                    }
                }
            })
        })
    }else if (state ==='user'){
        fetch(urlInfo2,{
            method:'PUT',
            body:JSON.stringify({
                new_password:new_password,
                uid:LoginInfo.uid,
                sale_type:LoginInfo.sale_type,
                code:code,
                mobile:mobile,
            })
        }).then(res =>{
            res.json().then(info =>{
                console.log(info);
                if (info.status){
                  ToastAndroid.show('设置成功', ToastAndroid.SHORT);
                }else{
                    if (info.code ===20001) {
                      ToastAndroid.show('验证码错误', ToastAndroid.SHORT);
                    }
                }
            })
        })
    }


}

  render() {
    const {in_out_datas,out,come,} = this.state;
   
    return (
      <View style={{flex:1,padding:10,alignItems:'center'}}>
        <View style={styles.item}>
          <Text style={styles.name}>请输入手机号:</Text>
          <TextInput
          style={styles.input2}
          placeholder={'请输入手机号'}
          onChangeText={(e)=>{this.setState({mobile:e})}}
          />
           <TouchableOpacity
          style={styles.code}
          onPress={()=>{this.getCode()}}
        >
          <Text style={styles.codeFont}>获取验证码</Text>
        </TouchableOpacity>
        </View>
       
        <View style={styles.item}>
        <Text style={styles.name}>请输入验证码:</Text>
          <TextInput
          style={styles.input}
          placeholder={'请输入验证码'}
          onChangeText={(e)=>{this.setState({code:e});console.log(e)}}
          />
        </View>
        <View style={styles.item}>
        <Text style={styles.name}>请输入新密码:</Text>
          <TextInput
          style={styles.input}
          placeholder={'请输入新密码'}
          onChangeText={(e)=>{this.setState({new_password:e});console.log(e)}}
          />
        </View>

        <View style={styles.item}>
        <Text style={styles.name}>再次输入密码:</Text>
          <TextInput
          style={styles.input}
          placeholder={'再次输入密码'}
          onChangeText={(e)=>{this.setState({password:e});console.log(e)}}
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
    margin:10,
  },
  name:{
    flexDirection:'row',
    width:'40%',
    padding:10,
    alignItems:'center',
    justifyContent:'space-between',
  },
  input:{
    width:'50%',
    fontSize:15,
    borderColor:'#F0EEEF',
    borderWidth:0.5,
  },
   input2:{
    width:'30%',
    fontSize:15,
    borderColor:'#F0EEEF',
    borderWidth:0.5,
  },
  button:{
    marginTop:30,
    backgroundColor:'#FF7701',
    width:'80%',
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  code:{
    width:'25%',
    backgroundColor:'#FF7701',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
  },
  codeFont:{
    color:'#fff',
    alignContent:'center',
    justifyContent:'center',
    width:'100%',
    textAlign:'center',
    marginLeft:5,
  },
})