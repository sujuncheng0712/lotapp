import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button, AsyncStorage, FlatList, StyleSheet, SectionList, ToastAndroid} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'激活码列表',
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
      this.setState({name: LoginInfo.name});
      let state = this.props.navigation.getParam('state')
      this.setState({state})
        //获取用户充值记录
        let urlInfo = `${url}/activations?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}&type=all`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if(info.status){
            let data = [];
            info.data.forEach(item =>{
              if (item.confirm_at===null) {
                item.confirm_at='无';
              }else{
                item.confirm_at='有';
              }

              if (item.type !==2){
                data.push(item);
              }
            })

            this.setState({data});
          }else{
            ToastAndroid.show('获取数据失败', ToastAndroid.SHORT);
          }
        })
      })

    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
    const {data} = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <View style={{flex: 1,}}>
        <View style={styles.title}>
          <Text style={styles.titleDate}>激活码</Text>
          <Text style={styles.titleItem}>设备ID</Text>
          <Text style={styles.titleItem}>类型</Text>
          <Text style={styles.titleItem}>激活状态</Text>
        </View>

        <View  style={{flex:1}}>
          <FlatList
            style={{flex:1}}
            data={data}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={separator}
            renderItem={({item}) =>
              <View style={styles.item}>
                <Text style={styles.titleDate}>{item.code}</Text>
                <Text style={styles.titlePhone}>{item.eid}</Text>
                <Text style={styles.titleItem}>{item.eptags}</Text>
                <Text style={styles.titleItem}>{item.confirm_at}</Text>
              </View>



            }
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title:{
    flexDirection:'row',
    backgroundColor:'#bbb',
  },
  titleDate:{
    flex:1.2,
    textAlign:'center',
    padding:10,
  },
  titlePhone:{
    flex:1.4,
    textAlign:'center',
    padding:10,
  },
  titleItem:{
    flex:1,
    textAlign:'center',
    padding:10,
  },
  item:{
    flexDirection:'row',
  },
})
