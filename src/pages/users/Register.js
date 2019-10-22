import React from 'react';
import {View, Text, AsyncStorage, StyleSheet, TouchableOpacity, ToastAndroid, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/index';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      mobile: '',   // 手机号
      name: '',     // 姓名
      code: '',     // 验证码
      referrer:'', // 推荐码
      visable:false,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'用户注册',
    };
  };

  // render创建之前
  componentWillMount() {
    
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

 
  // 获取验证码后禁用按钮
  getCode() {
    if (this.state.mobile) {
      let urlInfo = `${url}/users/code`;
      fetch(urlInfo,{
        method:'POST',
        body:JSON.stringify({
          vid:'f40d03342db411e8bc9600163e0851fd',
          mobile:this.state.mobile,
        })
      }).then(res =>{
        console.log(res)
        res.json().then(info =>{
          console.log(info);
          if(info.status){
            ToastAndroid.show('获取验证码成功，请注意查收', ToastAndroid.SHORT);
            this.setState({visable:true})
          }
        })
      })
      

      let count = 59;
      this.setState({count});
      this.interval = setInterval(() => {
        count -= 1;
        this.setState({count});
        if (count === 0){ clearInterval(this.interval);this.setState({visable:false})}
      }, 1000);
    } else {
      ToastAndroid.show('请输入手机号！', ToastAndroid.SHORT);
    }
  }

  handleSubmit() {
    const {mobile, name, code, referrer} = this.state;
    const reg = /^1\d{10}$/;
    const reg2 = /^[\u4E00-\u9FA5]{1,4}$/;

    if (!mobile) {
      ToastAndroid.show('手机号不能为空', ToastAndroid.SHORT);
      return false;
    }
    if (mobile && !reg.test(mobile)) {
      ToastAndroid.show('手机号格式错误！', ToastAndroid.SHORT);
      return false;
    }
    if (!name) {
      ToastAndroid.show('姓名不能为空', ToastAndroid.SHORT);
      return false;
    }
    if (name && !reg2.test(name)) {
      ToastAndroid.show('不是有效的姓名！', ToastAndroid.SHORT);
      return false;
    }
    if (!code) {
      ToastAndroid.show('验证码不能为空', ToastAndroid.SHORT);
      return false;
    }
    if (!referrer) {
      ToastAndroid.show('推荐码不能为空', ToastAndroid.SHORT);
      return false;
    }
   // let urlInfo = `${url}/users/code`;


  };

  render() {
    const {count,visable} = this.state;
    return (
        <View style={{flex: 1,}}>
         
          <View style={styles.list}>
            <View style={styles.item}>
              <Text style={styles.title}>姓名：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入真实姓名'}
                onChangeText={(e)=>{this.setState({name:e});console.log(e)}}
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>手机号：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入有效的手机号'}
                onChangeText={(e)=>{this.setState({mobile:e})}}
              />
            </View>
           
            <View style={styles.item}>
              <Text style={styles.title}>验证码：</Text>
              <TextInput
                style={{...styles.input,width:'30%',marginRight:0}}
                onChangeText={(e)=>{this.setState({code:e})}}
              />
              {
                visable === false ? 
                  <TouchableOpacity
                    style={styles.codeButton}
                    onPress={()=>{this.getCode()}}
                    >
                    <Text style={{color:'white'}}>获取验证码</Text>
                  </TouchableOpacity> : 
                  <View style={styles.greyButton}>
                     <Text 
                    style={styles.greyButton}
                  >{count}</Text>
                  </View>

              }
             
            </View>

            <View style={styles.item}>
              <Text style={styles.title}>推荐码：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入推荐码'}
                onChangeText={(e)=>{this.setState({referrer:e})}}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.handleSubmit();
              }}>
              <Text
                style={{
                  color:'white',
                  textAlign:'center',
                }}
              >完成绑定</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    top:{
      flexDirection:'row',
    },
  topItem:{
    textAlign:'center',
    color:'#bbb',
    flex:0.5,
    paddingTop:10,
  },
  item:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height:50,
    padding: 5,
  },
  title:{
    paddingTop:10,
  },
  list:{
    width:'100%',
    marginTop:20,
  },
  input:{
    width:'60%',
    marginRight: '15%',
    borderColor:'#bbb',
    borderWidth:0.5,
    borderRadius: 5,
    height:40,
  },
  button:{
    backgroundColor: '#FF7A01',
    borderColor:'#FF7A01',
    borderWidth:0.5,
    color:'#FF7A01',
    textAlign:'center',
    borderRadius:5,
    width: '100%',
    fontSize:10,
    padding: 5,
    marginTop: 40,
  },
  codeButton:{
    borderColor:'#FF7701',
    borderWidth:1,
    backgroundColor:'#FF7701',
    justifyContent:'center',
    alignItems:'center',
    padding:5,
    borderRadius:5,
    marginRight:'11.5%',
    width:'30%',
    marginLeft:'3.5%'
  },
  greyButton:{
    backgroundColor:'#ccc',
    borderWidth:1,
    borderColor:'#ccc',
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    color:'white',
    fontSize:20,
    marginRight:'11.5%',
    width:'30%',
    marginLeft:'3.5%',
    borderRadius:5,
  }
})
