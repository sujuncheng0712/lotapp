import React from 'react';
import {View, Text, Button, AsyncStorage, FlatList, StyleSheet,SectionList} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state:'',
      data:[],
      deposit:[],
    };
  }
  static navigationOptions = ({navigation}) => {
    let title = navigation.getParam('state');
    return {
      headerTitle: title==='record' ? '补贴记录' :title ==='recharge'? '充值记录' :'提现记录',
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
      if(state ==='record' || state==='recharge'){
        //获取用户充值记录
        let urlInfo = `${url}/userWallet?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}&type=all`;
        console.log(urlInfo)
        fetch(urlInfo).then(res =>{
          res.json().then(info =>{
            console.log(info);
            let data = [];
            let deposit = [];
            let id = 0;
            if (info.status){
              info.uw_datas.forEach(item =>{
                item.id = id++;
                if (item.type===1){
                  item.type='补贴';
                  data.push(item);
                }
                if (item.type ===3){
                  item.type='充值';
                  deposit.push(item);
                }
              })
              this.setState({data,deposit});
            }
          })
        })
      }else if (state ==='cash'){
        let urlInfo = `${url}/merchantWithdraw?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}&type=all`;
        fetch(urlInfo).then(res =>{
          res.json().then(info =>{
            console.log(info);
            if (info.status){
              let id = 0;
              info.mw_datas.forEach(item =>{
                item.id = id++;
                if (item.state ===1){
                  item.state = '处理中'
                }else if (item.state ===2){
                  item.state = '提现成功'
                }
                else if (item.state ===10){
                  item.state = '提现拒绝'
                }
              })
              this.setState({data:info.mw_datas});
            }
          })
        })
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
    const {data,deposit} = this.state;
    const title = this.props.navigation.getParam('state');
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <View style={{flex: 1,}}>
        { title === 'recharge' ? <View style={styles.title}>
          <Text style={styles.titleDate}>时间</Text>
          <Text style={styles.titleItem}>电话号码</Text>
          <Text style={styles.titleItem}>金额</Text>
          <Text style={styles.titleItem}>类型</Text>
        </View>
          :
          <View style={styles.title}>
           <Text style={styles.titleDate}>时间</Text>
            <Text style={styles.titleItem}>类型</Text>
           <Text style={styles.titleItem}>金额</Text>
           <Text style={styles.titleItem}>余额</Text>
           </View>
        }

        <View  style={{flex:1}}>
          <FlatList
            style={{flex:1}}
            data={title === 'recharge' ? deposit : data}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={separator}
            renderItem={({item}) =>
            title === 'recharge' ?
              <View style={styles.item}>
                <Text style={styles.titleDate}>{item.created_at}</Text>
                <Text style={styles.titlePhone}>{item.phone}</Text>
                <Text style={styles.titleItem}>{item.amount}</Text>
                <Text style={styles.titleItem}>{item.type}</Text>
              </View>
              :
              <View style={styles.item}>
                <Text style={styles.titleDate}>{item.created_at}</Text>
                <Text style={styles.titleItem}>{item.type}</Text>
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
