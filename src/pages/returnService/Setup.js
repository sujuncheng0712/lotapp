import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, AsyncStorage, StyleSheet, TouchableOpacity, ToastAndroid, TextInput} from 'react-native';
import { PickerView,Picker,Provider } from '@ant-design/react-native';
import * as wechat from 'react-native-wechat';
import address1 from '../../../service/address';
import Icon from 'react-native-vector-icons/index';
import district from 'antd-mobile-demo-data';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.onPress = () => {
      setTimeout(() => {
        this.setState({
          data: district,
        });
      }, 500);
    };
    this.onChange = value => {
      this.setState({ area:value });
    };
    this.state = {
      name:'',
      phone:'',
      area:'',
      address:'',
      remark:'',
      image:'',
      file:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'我要报装',
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
      this.setState({LoginInfo});
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  signUp(){
    const {name,phone,area,address,LoginInfo} = this.state;
    let urlInfo=`${url}/userSignUp`;
    fetch(urlInfo,{
      method:'POST',
      body:JSON.stringify({
        uid:LoginInfo.uid,
        name:name,
        phone:phone,
        area:area,
        address:address,
        mid:LoginInfo.mid,
      })
    }).then(res =>{
      res.json().then(info =>{
        console.log(info);
        if (info.status){
          ToastAndroid.show('提交成功', ToastAndroid.SHORT);
          this.props.navigation.navigate('Home')
        } else{
          ToastAndroid.show('提交失败', ToastAndroid.SHORT);
        }
      })
    })
  }

  render() {
    const {area} = this.state;

    return (
      <Provider>
        <View style={{flex: 1,}}>
          <View style={styles.top}>
            <Text style={styles.topItem}>请填写以下信息:</Text>
            <TouchableOpacity
              style={styles.topItem}
              onPress={()=>{this.props.navigation.navigate('AfterRecord');}}
            ><Text style={{textAlign: 'center',color:'#bbb',}}>售后记录</Text></TouchableOpacity>
          </View>

          <View style={styles.list}>
            <View style={styles.item}>
              <Text style={styles.title}>联系人：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入联系人'}
                onChangeText={(e)=>{this.setState({name:e});console.log(e)}}
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>手机：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入联系电话'}
                onChangeText={(e)=>{this.setState({phone:e})}}
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>地区：</Text>
              <View style={{...styles.input,width:'63%',marginRight:'11.5%'}}  onPress={this.onPress}>
                <Picker
                  data={address1}
                  cols={3}
                  value={this.state.area}
                  placeholder={'请输入联系电话'}
                  onChange={this.onChange}
                >
                  <Text style={{height:'100%',paddingTop: 10}}>
                    {area}
                  </Text>
                </Picker>
              </View>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>详细地址：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入详细地址'}
                onChangeText={(e)=>{this.setState({address:e})}}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.signUp();
              }}>
              <Text
                style={{
                  color:'white',
                  textAlign:'center',
                }}
              >确 认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Provider>
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
})
