import React from 'react';
import {
  View,
  Text,
  AsyncStorage,
  BackHandler,
  ToastAndroid,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button, WhiteSpace, WingBlank} from '@ant-design/react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order_data:[],
      name: '',
      balance:0,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onBackAndroid = () => {
    if (this.props.navigation.isFocused()) {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        BackHandler.exitApp();
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({name: LoginInfo.name});
      //获取物流信息
      let urlInfo = `${url}/logisticsPage_create?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if (info.status){
            this.setState({order_data:info.order_data});
          }
        })
      })

      //获取余额
      let urlInfo2 = `${url}/userWallet?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}&type=now`;
      fetch(urlInfo2).then(res =>{
        res.json().then(info =>{
          console.log(info)
          if (info.status && info.uw_datas.length >0) {
            this.setState({balance:info.uw_datas[0].balance});
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  withdraw = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  render() {
    const {name,order_data,balance} = this.state;
    const showList = order_data.map((item,key)=>{
      return(
        <View style={styles.logicItem} key={key}>
          <View>
            <Text>最新物流</Text>
            <Text>{item.follow_data.date}</Text>
          </View>
          <View>
            <Image
              style={styles.loginImg}
              source={{uri: `${item.image}`}}
              cache={'force-cache'}
            />
          </View>
          <View>
            <Text>
              {item.follow_data.date ? '已完成' : '运输中'}
            </Text>
            <Text>
              {item.follow_data.message}
            </Text>
          </View>
        </View>
      )
    })
    return (
      <View style={{flex:1}}>
        <View style={styles.top}>
          <ImageBackground
            style={styles.ImageBackground }
            source={require('../../images/usr_info.jpg')}>
            <View style={{flexDirection:'row',padding:10}}>
              <Text style={{
                marginLeft: '75%',
              }}>{name}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={this.withdraw}>
                <Text style={{
                  textAlign:'center',
                }}>注销</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.topList}>
              <TouchableOpacity
                style={styles.topItem}
                onPress={()=> this.props.navigation.navigate('CashRecord',{state:'record'})}
              >
                <Image
                  style={styles.topImg}
                  source={require('../../images/user/usermoney.png')}
                />
                <Text style={{color:'#fff',textAlign:'center'}}>补贴记录</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.topItem}
                onPress={()=> this.props.navigation.navigate('Wallet')}
              >
                <Image
                  style={styles.topImg}
                  source={require('../../images/user/detail.png')}
                />
                <Text style={{color:'#fff',textAlign:'center'}}>收支记录</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.topItem}
                onPress={()=> this.props.navigation.navigate('Cash')}
              >
                <Image
                  style={styles.topImg}
                  source={require('../../images/user/charge.png')}
                />
                <Text style={{color:'#fff',textAlign:'center'}}>话费充值</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={{color:'#fff',textAlign:'center'}}>
                钱包余额 ￥{balance}
              </Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.content}>
          <View style={{padding:10}}>
            <Text>我的订单</Text>
          </View>
          <View style={styles.orderList}>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'未付款'})}>
              <Image
                style={styles.orderImg}
                source={require('../../images/user/unpay.png')}
              />
              <Text>未付款</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'待发货'})}>
              <Image
                style={styles.orderImg}
                source={require('../../images/user/unsend.png')}
              />
              <Text>待发货</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'待收货'})}>
              <Image
                style={styles.orderImg}
                source={require('../../images/user/car.png')}
              />
              <Text>待收货</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'退款/售后'})}>
              <Image
                style={styles.orderImg}
                source={require('../../images/user/havesell.png')}
              />
              <Text>退款/售后</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {showList}
        </View>
        <View style={{padding:10}}>
          <Text>必备工具</Text>
        </View>

        <View style={styles.orderList}>
          <TouchableOpacity
            style={styles.orderItem}
            onPress={()=> this.props.navigation.navigate('Code')}>
            <Image
              style={styles.orderImg}
              source={require('../../images/pic/look.png')}
            />
            <Text>激活码</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.orderItem}
            onPress={()=> this.props.navigation.navigate('Orders',{title:'待发货'})}>
            <Image
              style={styles.orderImg}
              source={require('../../images/pic/extend.png')}
            />
            <Text>我要分享</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.orderItem}
            onPress={()=> this.props.navigation.navigate('Setup')}>
            <Image
              style={styles.orderImg}
              source={require('../../images/user/setup.png')}
            />
            <Text>我要报装</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.orderItem}
            onPress={()=> this.props.navigation.navigate('Fix')}>
            <Image
              style={styles.orderImg}
              source={require('../../images/pic/fix.png')}
            />
            <Text>我要保修</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  top:{
    flex: 0.55,
    width: '100%',
    alignItems: 'center',
  },
  content:{
    flex:0.40,
  },
  button: {
    backgroundColor: '#0078D7',
    borderColor: '#0078D7',
    color: '#FF7A01',
    textAlign: 'center',
    borderRadius: 10,
    width: 50,
    fontSize: 10,
    height:20,
  },
  ImageBackground:{
    flex:1,
    width:'100%',
    height:'100%',
  },
  orderList:{
    padding:10,
    flexDirection: 'row',
    borderTopWidth:0.5,
    borderColor:'#bbb'
  },
  orderItem:{
    flex:0.25,
    color: '#FF7A01',
    textAlign: 'center',
    fontSize: 10,
    padding: 5,
    alignItems: 'center',
  },
  orderImg:{
    width:45,
    height:45,
  },
  logicItem:{
    flexDirection: 'row',
    padding:10,
    backgroundColor: '#f5f5f5',
  },
  logicLeft:{

  },
  loginImg:{
    width:35,
    height:35,
    marginLeft: 5,
    marginRight:5,
  },
  topList:{
    flexDirection:'row',
    padding:10,
    alignItems:'center',
    justifyContent: 'space-evenly',
  },
  topItem:{

  },
  topImg:{
    width:70,
    height:70,
  },
})
