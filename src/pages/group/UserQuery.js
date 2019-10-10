import React from 'react';
import {View, Text, ScrollView, AsyncStorage,StyleSheet,TouchableOpacity,TextInput,Picker,ToastAndroid} from 'react-native';
const url = 'https://iot2.dochen.cn/api';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList:[],
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'用户查询' ,
    };
  };

  // render创建之前
  componentWillMount() {
  
  }

  componentDidMount() {

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
      fetch(`${url}/authWx?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`).then(res=>{
        if(res.ok){
          res.json().then(info=>{
            console.log(info);
            this.setState({userList:info.datas});
          });
        }
      });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  

  render() {
    const { userList } = this.state;
    
    let list = userList.map((item,key)=>{
      return(
        <View style={styles.item} key={key}>
          <Text>姓名：{item.name}</Text>
          <Text>手机：{item.mobile}</Text>
          <Text>推荐人：{item.super}</Text>
          <Text>地址：{item.address}</Text>
          <Text>安装设备：</Text>
          {item.e_datas.map((val,i)=>{
            return(
              <View key={i}>
                <Text style={{paddingLeft:30}}>设备ID : {val.eid} </Text>
                <Text>激活码 : {val.cdkey}</Text>
              </View>
            )
          })}
        </View>
      )
    })
    return (
      <ScrollView style={{flex:1,padding:10}}>
      <View style={{paddingBottom:60}}>
        { userList.length !== 0 ? 
          list :
          <Text style={{width:'100%',textAlign:'center'}}>NO DATA</Text> 
        }
      </View>
      </ScrollView>
      
    );
  }
}
const styles = StyleSheet.create({
  item:{
    borderColor:'#666',
    borderBottomWidth:0.5,
    padding:10,
 
  }
})