import React from 'react';
import {View, Text, ScrollView, AsyncStorage,StyleSheet,TouchableOpacity,TextInput,Picker,ToastAndroid} from 'react-native';
const url = 'https://iot2.dochen.cn/api';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: '',
      equipment: '',
      pledge: '',
      wallet: '',
      in_out_datas: [],
      return_mod_datas: [],
      send_mod_datas: [],
    };
   
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'对账单' ,
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
      let urlInfo = `${url}/merchantAccount?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res => {
        res.json().then(info => {
          console.log(info)
          if (info.status) {
            let id = 1;
            let id2 = 1;
            let id3 = 1;
            info.in_out_datas.forEach(item => {
              item.id = id++;
            })
            info.send_mod_datas.forEach(item => {
              item.id = id2++;
            })
            info.return_mod_datas.forEach(item => {
              item.id = id3++;
            })
            this.setState({
              balance: info.balance,
              equipment: info.equipment,
              pledge: info.pledge,
              wallet: info.wallet,
              in_out_datas: info.in_out_datas,
              return_mod_datas: info.return_mod_datas,
              send_mod_datas: info.send_mod_datas,
            })
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  

  render() {
    const { userList } = this.state;
    
    return (
      <ScrollView style={{flex:1,padding:10}}>
      
      </ScrollView>
      
    );
  }
}
const styles = StyleSheet.create({
  
})