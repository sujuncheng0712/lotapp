import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  ToastAndroid,TouchableOpacity
} from 'react-native';
import PwdInput from 'react-native-pwd-input';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: {},
      oldPwd:'',
      newPwd:'',
      confirmPwd:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '修改密码',
    };
  };

  // render创建之前
  componentWillMount() {}

  componentDidMount() {
    this._checkLoginState();
  }

  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    // eslint-disable-next-line no-eval
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo);
    this.setState({LoginInfo});
  };

  handleSubmit() {
    const { oldPwd, newPwd, confirmPwd,LoginInfo} = this.state;
    let state = this.props.navigation.getParam('state');
    if(newPwd !== confirmPwd){
      ToastAndroid.show('新密码不相同', ToastAndroid.SHORT);
      return false
    }
    let urlInfo = state === 'users' ? `${url}/authWx` :`${url}/merchants/${LoginInfo.mid}/password`;

    fetch(urlInfo,{
      method:'PUT',
      body: JSON.stringify({
        uid: LoginInfo.uid,
        sale_type: LoginInfo.sale_type,
        old_password: oldPwd,
        new_password: newPwd,
        username:LoginInfo.username,
      })
    }).then(res=>{
      if(res.ok){
        res.json().then(info=>{
          //console.log(info);
          if(info.code === 20001){
            ToastAndroid.show('旧密码错误', ToastAndroid.SHORT);
            return false
          }
          ToastAndroid.show('修改密码成功', ToastAndroid.SHORT);
          this.props.navigation.goBack();
        })
      }
    });
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center',justifyContent:'center' }}>
        
        <View style={styles.inputItem}>
           <Text style={{fontSize:15}}>旧密码：</Text>
          <PwdInput
            style={styles.input}
            onChangeText={text => this.setState({oldPwd: text})}
          />
        </View>

        <View style={styles.inputItem}>
           <Text style={{fontSize:15}}>新密码：</Text>
          <PwdInput
            style={styles.input}
            password ={true}
            onChangeText={text => this.setState({newPwd: text})}
          />
        </View>

        <View style={styles.inputItem}>
           <Text style={{fontSize:15}}>确认密码：</Text>
          <PwdInput
            style={styles.input}
            onChangeText={text => this.setState({confirmPwd: text})}
          />
        </View>

        <View style={{...styles.inputItem,justifyContent:'center'}}>
          <TouchableOpacity 
            onPress={()=>{this.handleSubmit()}}
            style={styles.button}>
            <Text style={{color:'white'}}>提 交</Text>
          </TouchableOpacity>
        </View>
       
      </View>
    );
  }
}
const styles = StyleSheet.create({
  inputItem: {
    display: 'flex',
    width:'80%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 15,
    alignItems:'center',
    height:60,
    paddingRight:30,
  },
  input: {
    width: 200,
    fontSize: 15,
    textAlign: 'left',
    borderRadius:5,
    marginLeft: 5,
    borderWidth:0.5,
    borderColor:'#666',
    height:35,
    paddingBottom:6,
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    marginTop:15,
  },
  button:{
    backgroundColor:'#FF7701',
    borderWidth:1,
    borderColor:'#FF7701',
    justifyContent:'center',
    alignItems:'center',
    padding:5,
    borderRadius:5,
    width:'30%',
  }
});
