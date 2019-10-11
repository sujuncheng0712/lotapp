import React from 'react';
import {ScrollView,View, Text, StyleSheet, AsyncStorage,Image,TouchableOpacity} from 'react-native';
import * as wechat from 'react-native-wechat';
import {Echarts, echarts} from 'react-native-secharts';
import { T } from 'antd/lib/upload/utils';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: '',
      ac_filter: 0,
      ac_not_use: 0,
      ac_use: 0,
      deposit: 0,
      equipment: 0,
      not_settle: 0,
      pledge: 0,
      settle: 0,
      user_pay: 0,
      user_return: 0,
      time: [],
      money: [],
      timeArr:[],
      moneyArr:[],
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '概览',
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
  
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({LoginInfo});
      //获取信息
      let urlInfo = `${url}/userSignUpSubmit?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        if (info.status) {
          let time = [];
          let money = [];
          info.datas.order_7.forEach(item => {
            let arr = item.created_at.toString().split('-');
            let created_at = `${arr[1]}-${arr[2]}`;
            time.push(created_at);
            money.push(item.total)
          });
          let timeArr = [];
          let moneyArr = [];
          for (let i = 6; i >= 0; i--) {
            timeArr.push(time[i]);
            moneyArr.push(money[i])
          }
          for(let  i =0;i<5;i++){
          this.setState({
            ac_filter: info.datas.ac_filter,
            ac_not_use: info.datas.ac_not_use,
            ac_use: info.datas.ac_use,
            balance: info.datas.balance,
            deposit: info.datas.deposit,
            equipment: info.datas.equipment,
            not_settle: info.datas.not_settle,
            pledge: info.datas.pledge,
            settle: info.datas.settle,
            user_pay: info.datas.user_pay,
            user_return: info.datas.user_return,
            time,
            money,
            timeArr,
            moneyArr
          })
        }
        }
      })
    })

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  
      this._checkLoginState();
    
    
  }

  render() {
    const {timeArr, moneyArr, ac_use, user_return, equipment, not_settle, pledge, settle, user_pay} = this.state;
    const option = {
     
      xAxis: {
          data: timeArr
      },
      yAxis: {
        //name: '单位/L',
      },
      series: [{
          //name: '单位/L',
          type: 'bar',
          data: moneyArr,
          itemStyle: {
            color: '#FF7701',
          },
      }],
      textStyle: {
        color: 'black',
      },
    };
    return (
      <ScrollView style={{flex: 1, }}>
        <View style={styles.top}>
          <Text style={styles.topFont}>近7天激活概览</Text>
          <Echarts option={option} height={350} />
        </View>
        <View style={{...styles.top,marginTop:5}}>
          <Text style={{padding:10}}>设备激活与收益概览：</Text>
          <View style={styles.list}>
            <TouchableOpacity
              style={styles.item}
              onPress={()=>{this.props.navigation.push('ActivataDevice')}}
            >
              <Text style={{fontSize:15}}>已激活设备</Text>
              <Image
               style={styles.img}
               source={require('../../images/yejijihuo-.png')}
              />
              <View style={{flexDirection:'row',alignContent:'flex-end'}}>
                <Text style={{fontSize:10,marginTop:5}}>共</Text>
                <Text style={{color:'#FF7701',fontSize:15}}>{equipment}</Text>
                <Text style={{fontSize:10,marginTop:4.5}}>台</Text>
              </View>
             
              <Text style={{fontSize:10}}>查看详情</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={()=>{this.props.navigation.push('Earnring',{state:'a'})}}
            >
              <Text style={{fontSize:15}}>已结算收益</Text>
              <Image
               style={styles.img}
               source={require('../../images/yingyongicon-.png')}
              />
              <View style={{flexDirection:'row',alignContent:'flex-end'}}>
                <Text style={{fontSize:10,marginTop:5}}>共</Text>
                <Text style={{color:'#FF7701',fontSize:15}}>{settle}</Text>
                <Text style={{fontSize:10,marginTop:4.5}}>元</Text>
              </View>
              <Text style={{fontSize:10}}>查看详情</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={()=>{this.props.navigation.push('Earnring',{state:'b'})}}
            >
              <Text style={{fontSize:15}}>未结算收益</Text>
              <Image
               style={styles.img}
               source={require('../../images/jiesuan.png')}
              />
              <View style={{flexDirection:'row',alignContent:'flex-end'}}>
                <Text style={{fontSize:10,marginTop:5}}>共</Text>
                <Text style={{color:'#FF7701',fontSize:15}}>{not_settle}</Text>
                <Text style={{fontSize:10,marginTop:4.5}}>元</Text>
              </View>
             
              <Text style={{fontSize:10}}>查看详情</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    backgroundColor:'#F0EEEF',
  },
  topFont:{
    fontWeight:'bold',
    padding:10,
  },
  list:{
    flexDirection:'row',
    padding:10,
    justifyContent:'space-between',
  },
  item:{
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
    padding:10,
  },
  img:{
    width:40,
    height:40,
  }
})