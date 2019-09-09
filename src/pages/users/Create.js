import React from 'react';
import  district  from 'antd-mobile-demo-data';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ToastAndroid,AsyncStorage,DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PickerView,Picker,Provider } from '@ant-design/react-native';
import address1 from '../../../service/address';
const url = 'https://iot2.dochen.cn/api';

const CustomChildren = props => (
  <TouchableOpacity onPress={props.onPress}>
    <View
      style={{
        height: 36,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text style={{ flex: 1 }}>{props.children}</Text>
      <Text style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>
        {props.extra}
      </Text>
    </View>
  </TouchableOpacity>
);


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
      addressInfo: '',
      defaultValue:true,
      pickerValue: [],
      default:1,
      contact:'',
      phone:'',
      area:'',
      address:'',
      LoginInfo:'',
    };
  }
  // render创建之前
  componentWillMount() {

    let addressInfo = this.props.navigation.getParam('address','');
    this.setState({addressInfo:addressInfo})
    if (addressInfo !==''){
      this.setState({
        area:addressInfo.area,
        contact:addressInfo.contact,
        phone:addressInfo.phone,
        address:addressInfo.address,
      })
    }
    console.log(addressInfo)
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
    this._checkLoginState();
  }

  componentWillUnmount() {
  };

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:navigation.getParam('title')
    };
  };

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    if (LoginInfo !== null) {
      console.log(LoginInfo.name);
      this.setState({LoginInfo});
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  submit(){
    const {LoginInfo,contact,phone,address,area,addressInfo,defaultValue}  =this.state;
    let newDefault = defaultValue ? 1 :0;
    console.log(contact);
    console.log(phone);
    console.log(address);
    console.log(area);
    console.log(addressInfo);
    if (contact ===''){
      ToastAndroid.show('收货人姓名必须填写！', ToastAndroid.SHORT);
      return false;
    }
    if (phone ===''){
      ToastAndroid.show('收货人手机号必须填写！', ToastAndroid.SHORT);
      return false;
    }
    if (area ===''){
      ToastAndroid.show('地区必须选择！', ToastAndroid.SHORT);
      return false;
    }
    if (address ===''){
      ToastAndroid.show('详细地址必须填写！', ToastAndroid.SHORT);
      return false;
    }
    let newArea = area.toString().replace(new RegExp(',', 'g'), '/');
    console.log(newArea);
    console.log(newDefault);
    console.log(LoginInfo);
    if (addressInfo === ''){
        let urlInfo =`${url}/users/${LoginInfo.uid}/address?uid=${LoginInfo.uid}`;
        fetch(urlInfo,{
          method:'POST',
          body:JSON.stringify({
            contact:contact,
            phone:phone,
            address:address,
            area:newArea,
            uid:LoginInfo.uid,
            default:newDefault,
          })
        }).then(res =>{
          res.json().then(info =>{
            console.log(info);
            if(info.status){
              ToastAndroid.show('添加成功！', ToastAndroid.SHORT);
              DeviceEventEmitter.emit('Address');
              this.props.navigation.navigate('Address');
            }
          })
        })
    }else{
      let urlInfo = `${url}/users/${LoginInfo.uid}/address/${addressInfo.uuid}?uid=${LoginInfo.uid}`;
      fetch(urlInfo,{
        method:'PUT',
        body:JSON.stringify({
          contact:contact,
          phone:phone,
          address:address,
          area:newArea,
          uid:LoginInfo.uid,
          default:newDefault,
        })
      }).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if (info.status){
            ToastAndroid.show('修改成功！', ToastAndroid.SHORT);
            DeviceEventEmitter.emit('Address');
            this.props.navigation.navigate('Address');
          }
        })
      })
    }
  }

  render() {
    const {addressInfo,defaultValue,area} = this.state;

    return (
      <Provider>
        <View style={styles.list}>
          <View style={styles.item}>
            <Text style={styles.title}>收货人：</Text>
            <TextInput
              style={styles.input}
              defaultValue={addressInfo !=='' ? addressInfo.contact :''}
              onChangeText={(e)=>{this.setState({contact:e});console.log(e)}}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>手机：</Text>
            <TextInput
              style={styles.input}
              defaultValue={addressInfo !=='' ? addressInfo.phone:''}
              onChangeText={(e)=>{this.setState({phone:e})}}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>地区：</Text>
            <View style={styles.input}  onPress={this.onPress}>
            <Picker
              data={address1}
              cols={3}
              value={this.state.area}
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
              defaultValue= { addressInfo !=='' ? addressInfo.address:''}
              onChangeText={(e)=>{this.setState({address:e})}}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>默认：</Text>
            <View style={{width:'70%',paddingTop: 10,}}>
              <Icon
                name="check-circle"
                size={20} color={defaultValue ? '#ff8800' : '#666'}
                onPress={()=>{
                  this.setState({defaultValue:!defaultValue})
                }}
              />
            </View>

          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.submit();
            }}>
            <Text
              style={{
                color:'white',
                textAlign:'center',
              }}
            >保存地址</Text>
          </TouchableOpacity>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  list:{
    width:'100%',
  },
  item:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth:0.5,
    borderColor: '#bbb',
    height:'12%',
    padding: 5,
  },
  title:{
    paddingTop:10,
  },
  button:{
    backgroundColor: '#FF7A01',
    borderColor:'#FF7A01',
    color:'#FF7A01',
    textAlign:'center',
    borderRadius:5,
    width: 100,
    fontSize:10,
    padding: 5,
    marginTop: 40,
  },
  input:{
    width:'70%',
  }
})
