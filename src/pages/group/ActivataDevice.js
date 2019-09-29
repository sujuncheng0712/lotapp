import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button, AsyncStorage,Image,StyleSheet,ScrollView,ImageBackground,TouchableOpacity,FlatList} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:{},
      use:[],
      notUse:[],
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '已激活设备',
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
      //获取物流信息
      let urlInfo = `${url}/activationsaa2?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
        let id = 1;
        let id2 = 1;
        let use = [];
        let notUse = [];
        fetch(urlInfo).then(res =>{
            res.json().then(info =>{
                console.log(info);
                if (info.status) {
                    console.log(use)
                    this.setState({use:info.datas})
                }
            })
        })

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  

  render() {
    const {use} = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <View style={{flex:1}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{...styles.listTitle,width:'20%'}}>激活日期</Text>
          <Text style={{...styles.listTitle,width:'35%'}}>设备ID</Text>
          <Text style={{...styles.listTitle,width:'20%'}}>激活码</Text>
          <Text style={{...styles.listTitle,width:'25%'}}>用户</Text>
        </View>

        <View  style={{flex:1}}>
          <FlatList
            style={{flex:1}}
            data={use}
            keyExtractor={(item) => String(item.eid)}
            ItemSeparatorComponent={separator}
            renderItem={({item}) =>
              <View key={item.eid} style={{flexDirection:'row'}}>
                <Text style={{...styles.listTitle,width:'20%'}}>{item.activation_at}</Text>
                <Text style={{...styles.listTitle,width:'35%'}}>{item.eid}</Text>
                <Text style={{...styles.listTitle,width:'20%'}}>{item.cdkey}</Text>
                <Text style={{...styles.listTitle,width:'25%'}}>{item.user}</Text>
              </View>
            }
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    width:'100%',
    borderBottomWidth:0.5,
    borderBottomColor:'#bbb',
  },
  topItem:{
    width:'50%',
    textAlign:'center',
    color:'#666',
    padding:10,
  },
  listDate:{
    width:'30%',
    padding:10,
    textAlign:'center',
    fontSize:10,
  },
  listTitle:{
    width:'23%',
    padding:10,
    textAlign:'center',
    fontSize:10,
  },
})