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
  Image,ScrollView,Dimensions
} from 'react-native';
const {width, height, scale} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/EvilIcons';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order_data:[],
      balance:0,
      LoginInfo:'',
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
      this.setState({LoginInfo});
      this.forceUpdate();
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
    this.props.navigation.push('Login');
  };

  render() {
    const {LoginInfo,order_data,balance} = this.state;
    const showList = order_data.map((item,key)=>{
      return(
        <View style={styles.logicItem} key={key}>
          <View>
            <Text style={{color:'#666666',}}>最新物流</Text>
            <Text style={{color:'#666666',}}>{item.follow_data.date}</Text>
          </View>
          <View>
            <Image
              style={styles.loginImg}
              source={{uri: `${item.image}`}}
              cache={'force-cache'}
            />
          </View>
          <View>
            <Text style={{color:'#666666',}}> 
              {item.follow_data.date ? '已完成' : '运输中'}
            </Text>
            <Text style={{color:'#666666',}}>
              {item.follow_data.message}
            </Text>
          </View>
        </View>
      )
    })
    return (
      <ScrollView>
         <View style={{flex:1}}>
            <View style={styles.top}>
              <ImageBackground
                style={styles.ImageBackground }
                source={require('../../images/usr_info.jpg')}>
                <View style={{flexDirection:'row',padding:10,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{
                   
                    color:'white',
                  }}>{LoginInfo.name}</Text>
               
                </View>
                <View style={styles.withdraw}>
                <TouchableOpacity
                  style={styles.button}
                 onPress={()=>{this.props.navigation.push('ChangePassword',{state:'group'})}}>
                 <Icon name="gear" size={25} color={'#fff'} />
                 <Text style={{color:'white',fontSize:10}}>修改密码</Text>
              </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.withdraw}>
                      <Icon name="redo" size={25} color={'#fff'} />
                    <Text style={{ textAlign:'center',color:'white',fontSize:10}}>注销</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:'#FF7701',backgroundColor:'white',padding:2,width:'12%',borderRadius:5,textAlign:'center',fontSize:10}}>会员</Text>
                </View>
            
                  <View> 
                    <View style={styles.topList}>
                    <TouchableOpacity
                      style={styles.topItem}
                      onPress={()=> this.props.navigation.navigate('CashRecord',{state:'record'})}
                    >
                      <Image
                        style={styles.topImg}
                        source={require('../../images/group/shouzhiguanli01.png')}
                      />
                    </TouchableOpacity>

                    <View style={styles.topItem}>
                      <Text style={{color:'white',}}>￥{balance}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.topItem}
                      onPress={()=> this.props.navigation.navigate('Cash')}
                    >
                      <Image
                        style={styles.topImg}
                        source={require('../../images/group/huafei2.png')}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.topList}>
                    <View style={styles.topItem}>
                      <Text style={{color:'#fff',textAlign:'center'}}>收支明细</Text>
                    </View>

                    <View style={styles.topItem}>
                      <Text style={{color:'#fff',textAlign:'center'}}>账号余额</Text>
                    </View>

                    <View style={styles.topItem}>
                      <Text style={{color:'#fff',textAlign:'center'}}>话费充值</Text>
                    </View>
                  </View>
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
                <View style={{padding:10,backgroundColor:'#FF7701',borderRadius:50}}>
                  <Image
                    style={styles.orderImg}
                    source={require('../../images/user/yfk.png')}
                  />
                </View>
              
              <Text>未付款</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'待发货'})}>
              <View style={{padding:10,backgroundColor:'#FF7701',borderRadius:50}}>
                  <Image
                    style={styles.orderImg}
                    source={require('../../images/user/dfh.png')}
                  />
                </View>
              <Text>待发货</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Orders',{title:'待收货'})}>
             <View style={{padding:10,backgroundColor:'#FF7701',borderRadius:50}}>
                  <Image
                    style={styles.orderImg}
                    source={require('../../images/user/dsh.png')}
                  />
                </View>
              <Text>待收货</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderItem}
              onPress={()=> this.props.navigation.navigate('Fix',{eid:''})}>
             <View style={{padding:10,backgroundColor:'#FF7701',borderRadius:50}}>
                  <Image
                    style={styles.orderImg}
                    source={require('../../images/user/wx.png')}
                  />
                </View>
              <Text>我要保修</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{width:'100%',height:5, backgroundColor:'#F0EEEF',}}></View>
        <View>
          {showList}
        </View>
        <View style={{width:'100%',height:5, backgroundColor:'#F0EEEF',}}></View>

        <TouchableOpacity 
         style={{flexDirection:'row',padding:10}}
         onPress={()=>{this.props.navigation.push('MiandanRule')}} >
           <View style={{width:'60%',justifyContent:'center'}}>
             <Text style={{fontWeight:'bold'}}>免单活动进行中</Text>
             <View style={{flexDirection:'row'}}>
               <Text>推荐3人购买，送免单！</Text>
               <Text style={{backgroundColor:'red',color:'white',paddingRight:5,paddingLeft:5}}>马上看></Text>
             </View>
           </View>
           <View style={{width:'40%'}}>
             <Image
              style={styles.miandanImg}
              source={require('../../images/user/miandan.jpg')}
            />
          </View>
        </TouchableOpacity>
        <View style={{width:'100%',height:5, backgroundColor:'#F0EEEF',}}></View>

        <View style={styles.orderList}>
           <TouchableOpacity
             style={styles.orderItem}
             onPress={()=> this.props.navigation.navigate('Code')}>
             <View style={{padding:10,backgroundColor:'#FF7701',borderRadius:50}}>
                  <Image
                    style={styles.orderImg}
                    source={require('../../images/group/jihuoma1.png')}
                  />
                </View>
             <Text>激活码</Text>
           </TouchableOpacity>
           <TouchableOpacity
             style={styles.orderItem}
             onPress={()=> this.props.navigation.navigate('Share')}>
              <View style={{padding:10,backgroundColor:'#FF7701',borderRadius:50}}>
                  <Image
                    style={styles.orderImg}
                    source={require('../../images/group/daohang-tuiguanglianjie.png')}
                  />
                </View>
             <Text>我要推广</Text>
           </TouchableOpacity>
           <TouchableOpacity
             style={styles.orderItem}
             onPress={()=> alert('完善中')}>
             <View style={{padding:10,backgroundColor:'#FF7701',borderRadius:50}}>
                  <Image
                    style={styles.orderImg}
                    source={require('../../images/group/jilu.png')}
                  />
                </View>
             <Text>推广记录</Text>
           </TouchableOpacity>
           <TouchableOpacity
             style={styles.orderItem}
             onPress={()=> this.props.navigation.navigate('RecommendRecord')}>
             <View style={{padding:10,backgroundColor:'#FF7701',borderRadius:50}}>
                  <Image
                    style={styles.orderImg}
                    source={require('../../images/group/jilu.png')}
                  />
                </View>
             <Text>推荐记录</Text>
           </TouchableOpacity>
         </View>
      

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  top:{
    //flex: 0.55,
    width: '100%',
    alignItems: 'center',
    height:150,
  },
  content:{
    //flex:0.40,
  },
  button: {
    justifyContent:'center',
    alignItems:'center',
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
    flexWrap:'wrap'
  },
  orderItem:{
    width:'25%',
    color: '#FF7A01',
    textAlign: 'center',
    fontSize: 10,
    padding: 3,
    alignItems: 'center',
  },
  orderImg:{
    width:35,
    height:35,
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
    alignItems:'center',
    justifyContent: 'space-evenly',
  },
  topItem:{
    width:'33%',
    justifyContent:'center',
    alignItems:'center',
  
  },
  topImg:{
    width:50,
    height:50,
    marginBottom:2,
  },
  withdraw:{
    position:'absolute',
    top:10,
    right:10,
    flexDirection:'row',
  },
  miandanImg:{
   width:width*0.4, 
   height:width*0.4/1.793,
  }
})
