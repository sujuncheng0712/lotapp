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
import * as wechat from 'react-native-wechat';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Entypo';
import { T } from 'antd/lib/upload/utils';
const url = `https://iot2.dochen.cn/api`;
const {height,width} =  Dimensions.get('window');
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: {},
      allowance: '',
      balance: '',
      commission: '',
      deposit: '',
      wallet: '',
      pledge: '',
      balance_at: '',
    };
  }

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
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
          console.log(info)
          if (info.status) {
            this.setState({
              allowance: info.datas.allowance,
              balance: info.datas.balance,
              commission: info.datas.commission,
              deposit: info.datas.deposit,
              wallet: info.datas.wallet,
              pledge: info.datas.pledge,
              balance_at: info.datas.balance_at,
            })
          }
        })
      })

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }
  withdraw = async () => {
    await AsyncStorage.clear();
    this.props.navigation.push('Login');
  };

  render() {
    const {LoginInfo,wallet} = this.state;

    return (
      <ScrollView>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.top}>
            <ImageBackground
              style={styles.ImageBackground }
              source={require('../../images/usr_info.jpg')}>
              <Text style={styles.contact}>{LoginInfo.contact}</Text>

              <TouchableOpacity
                style={styles.home}
                onPress={this.withdraw}>
                <Icon name="gear" size={25} color={'#fff'} />
              </TouchableOpacity>
              <View style={styles.topList}>
                <TouchableOpacity
                  style={styles.topItem}
                  onPress={()=>{this.props.navigation.push('Balance')}}>
                  <Image
                  style={styles.img}
                    source={require('../../images/group/groupTop01.png')}
                  />
                  <Text style={styles.topfont}>收支明细</Text>
                </TouchableOpacity>
                <View  style={styles.topItem}>
                  <Text style={styles.topfont}>￥{wallet}</Text>
                  <Text style={styles.topfont}>账户余额</Text>
                </View>
                <TouchableOpacity
                  style={styles.topItem}
                  onPress={()=>{this.props.navigation.push('GroupCash')}}>
                  <Image
                  style={styles.img}
                    source={require('../../images/group/groupTop02.png')}
                  />
                  <Text style={styles.topfont}>我要提现</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.tool}>
            <Text style={{padding:20}}>我的工具</Text>

            <View style={styles.topList}>
                <TouchableOpacity
                  style={styles.topItem}
                  onPress={()=>{alert(111)}}>
                   <Icon3 name="users" size={35} color={'#FF7701'} />
                  <Text>开通账号</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.topItem}>
                <Icon2 name="barcode" size={35} color={'#FF7701'} />
                  <Text >商家买码</Text>
                  
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.topItem}
                  onPress={()=>{alert(111)}}>
                 <Icon2 name="share-square" size={35} color={'#FF7701'} />
                  <Text >我要推广</Text>
                </TouchableOpacity>
              </View>
          </View>

          <View style={styles.tool}>
            <Text style={{padding:20}}>使用指引</Text>

            <View style={styles.topList}>
                <TouchableOpacity
                  style={styles.topItem}
                  onPress={()=>{alert(111)}}>
                  <Image
                  style={styles.img}
                    source={require('../../images/group/phone.png')}
                  />
                  <Text style={styles.toolTitle}>手机端</Text>
                  <Text>使用指引</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.topItem}>
                <Image
                  style={styles.img}
                    source={require('../../images/group/computer.png')}
                  />
                  <Text style={styles.toolTitle}>电脑端</Text>
                  <Text>使用指引</Text>
                  
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.topItem}
                  onPress={()=>{alert(111)}}>
                 <Image
                  style={styles.img}
                    source={require('../../images/group/product.png')}
                  />
                  <Text style={styles.toolTitle}>产品</Text>
                  <Text>故障排除</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>


      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    width: '100%',
    height:height/4,
  },
  ImageBackground:{
    flex:1,
    width:'100%',
    height:'100%',
  },
  contact:{
    textAlign:'center',
    width:'100%',
    color:'#fff',
    padding:10,
    fontSize:width/20,
  },
  home:{
    position:'absolute',
    top:height/70,
    right:10,
  },
  topList:{ 
    flexDirection:'row',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    paddingTop:10,
  },
  topItem:{
    alignItems:'center',
    justifyContent:'center',
    width:'33%',
  },
  img:{
    height:height/20,
    width:width/11,
  },
  topfont:{
    color:'#fff',
    marginTop:10,
  },
  tool:{
    width:'100%',
    height:height/4,
  },
  toolTitle:{
    fontWeight:'bold',
  }
})