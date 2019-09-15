import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button, AsyncStorage, FlatList, StyleSheet,SectionList} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
const walletType = {
  '1' : '+ 系统补贴',
  '2' : '- 使用消费',
  '3' : '- 话费充值',
  '4' : '- 服务费'
}
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uw_datas:[],
      income:0,
      pay:0,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '收支明细',
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
      let urlInfo = `${url}/userWallet?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}&type=all`;
    fetch(urlInfo).then(res =>{
      res.json().then(info =>{
        console.log(info);
        let pay = 0;
        let income = 0;
        if (info.status){
          info.uw_datas.forEach(item =>{
            if (item.type>1){
              pay = pay+item.amount;
            }else{
              income = income+item.amount;
            }
            item.type = walletType[item.type];
          })
          console.log(income)
          console.log(pay)
          this.setState({uw_datas:info.uw_datas,income,pay,});
        }
      })
    })

    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
    const {uw_datas,income,pay}=this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <View style={{flex: 1,}}>
        <View style={styles.top}>
          <Text style={styles.topItem}>总收入：{income}</Text>
          <Text style={styles.topItem}>总支出：{pay}</Text>
        </View>
        <View style={{flex:1}}>
          <View style={styles.title}>
            <Text style={styles.titleDate}>时间</Text>
            <Text style={styles.titleDate}>类型</Text>
            <Text style={styles.titleItem}>金额</Text>
            <Text style={styles.titleItem}>余额</Text>
          </View>
          <FlatList
            style={{flex:1}}
            data={uw_datas}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={separator}
            renderItem={({item}) =>
              <View style={styles.item}>
                <Text style={styles.titleDate}>{item.created_at}</Text>
                <Text style={styles.titleDate}>{item.type}</Text>
                <Text style={styles.titleItem}>{item.amount}</Text>
                <Text style={styles.titleItem}>{item.balance}</Text>
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
    borderColor:'#bbb',
    borderBottomWidth:0.5,
    color:'#bbb',
  },
  topItem:{
    flex:1,
    textAlign:'center',
    padding:10,
  },
  title:{
    flexDirection:'row',
    backgroundColor:'#bbb',
  },
  titleDate:{
    flex:1.2,
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
