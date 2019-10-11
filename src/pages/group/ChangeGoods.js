import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  AsyncStorage,
  DeviceEventEmitter,
  BackHandler,Image
} from 'react-native';
const url = 'https://iot2.dochen.cn/api';


let oldIdValue;
let newIdValue;
export default class App extends React.Component {
  constructor(props) {
    super(props);
   
    this.state = {
      LoginInfo:'',
   
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'换货'
    };
  };
  // render创建之前
  componentWillMount() {

  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
    
  
  
    this._checkLoginState();
  }

  submit(){
   
    const {LoginInfo} = this.state;
    fetch(`${url}/returnOrder`,{
      method:'PUT',
      body:JSON.stringify({
        sale_type:LoginInfo.sale_type,
        state: 6,
        replace_eid: newIdValue,
        old_eid: oldIdValue
      })
    }).then(res=>{
    
   
      alert(newIdValue+'---'+oldIdValue);
      if(res.ok) {
        res.json().then(info=>{
          if(info.status) {
            ToastAndroid.show( "换货成功", ToastAndroid.SHORT);
            setTimeout(()=>{
              this.props.navigate.goBack();
            },800);
          }
          else if(info.code === 20001) ToastAndroid.show( "该设备不存在，或没有申请换货", ToastAndroid.SHORT);
          else if(info.code === 10003) ToastAndroid.show( "新设备已被使用", ToastAndroid.SHORT);
          else if(info.code === 20005) ToastAndroid.show( "新设备，旧设备，型号不相符", ToastAndroid.SHORT);

        });
      }
    });
  }


  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    if (LoginInfo !== null) {
      LoginInfo = eval('(' + LoginInfo + ')');
      LoginInfo = LoginInfo[0];
      console.log(LoginInfo)
      this.setState({LoginInfo});
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  

  render() {
    const {} = this.state;
    let oldIdValue0 = this.props.navigation.getParam('oldEid' ,'');
    let newIdValue0 = this.props.navigation.getParam('newEid' ,'');
    oldIdValue = oldIdValue0;
    newIdValue =newIdValue0;
   

    return (
      <View style={{flex:1,backgroundColor:'#F0EEEF',padding:10}}>
          <Text style={styles.title}>扫描二维码</Text>
          <View style={styles.item}>
            <View style={{justifyContent:'center',alignItems:'center'}}>
             <Text style={styles.itemTitle}>旧设备ID:</Text>
            </View>
            
            <TextInput
              style={styles.input}
              value={oldIdValue}
              onChangeText={(e)=>{this.setState({oldIdValue:e})}}
              editable={false}
            />
              <TouchableOpacity
               style={styles.right}
                onPress={()=>{this.props.navigation.navigate('ScanScreen',{state:'changeGoodOld'});}}
              >
                <Image
                  style={styles.topImg}
                  source={require('../../images/scan.png')}
                />
              </TouchableOpacity>
          </View>

          <View style={styles.item}>
            <View style={{justifyContent:'center',alignItems:'center'}}>
             <Text style={styles.itemTitle}>新设备ID:</Text>
            </View>
            
            <TextInput
              style={styles.input}
              value={newIdValue}
              onChangeText={(e)=>{this.setState({newIdValue:e})}}
              editable={false}
            />
              <TouchableOpacity
                style={styles.right}
                onPress={()=>{this.props.navigation.navigate('ScanScreen',{state:'changeGoodNew'});}}
              >
                <Image
                  style={styles.topImg}
                  source={require('../../images/scan.png')}
                />
              </TouchableOpacity>
          </View>

          <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
            <TouchableOpacity
              style={styles.button}
              onPress={()=>{this.submit()}}
            >
              <Text style={{color:'white'}}>确认换货</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    title:{
      width:'100%',
      textAlign:'center',
      fontSize:17,
      marginBottom:10,
    },
    item:{
      flexDirection:'row',
      marginTop:10,
    },
    itemTitle:{
      textAlign:'right',
      fontSize:15,
      marginLeft:20,
      marginRight:10,
    },
    input:{
      borderColor:'#666',
      borderWidth:0.5,
      width:'50%',
      borderRadius:5,
      marginRight:5,
      height:40,
    },
    right:{
      justifyContent:'flex-start',
    },
    topImg:{
      width:40,
      height:40,
      marginLeft:5,
    },
    button:{
      backgroundColor:'#FF7701',
      borderWidth:1,
      borderColor:'#FF7701',
      borderRadius:5,
      padding:5
    }
})
