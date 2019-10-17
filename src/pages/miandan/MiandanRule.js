import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button, AsyncStorage,Image,StyleSheet,ScrollView,ImageBackground,TouchableOpacity,FlatList} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
   
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '活动规则',
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
      
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  

  render() {
    
    return (
      <View style={{flex:1,padding:5}}>
        <Text style={styles.title}>活动规则</Text>
        <Text style={{color:'#666666',width:'100%',textAlign:'center'}}>推荐3人购买, 免单活动说明</Text>
        <Text style={{...styles.font,marginTop:20}}>1. 用户购买并激活产品后, 方可拥有推荐资格</Text>
        <Text style={styles.font}>2. 用户转发链接给朋友或转发到朋友圈, 朋友按此链接报名安装并购买产品, 则计算一次推荐购买。满3次以上推荐购买则免单一次购买</Text>
        <Text style={styles.font}>3. 购买一台(或多台)产品, 然后推荐3人购买产品, 则该用户可以免单, 最多免单一台。</Text>
        <Text style={styles.font}>4. 符合免单条件的, 本平台将本次购买金额返还到用户账户下。改金额不可提现, 可用户买狗滤芯或充值话费。</Text>
        <Text style={styles.font}>5. 免单产品按国家三包法执行售后服务政策。即在质量问题情况下, 七天可退, 15天包换, 1年包修</Text>
        <Text style={styles.font}>6. 免单兑现时间为产品激活7天后, 本平台不设置推荐结束时间, 即用户在使用期间成功推荐3人以上购买, 均可获得免单资格</Text>
        <Text style={styles.font}>7. 本活动解释权归本平台所有</Text>
        
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title:{
    color:'#666666',
    width:'100%',
    textAlign:'center',
    padding:15,
    fontSize:17,
  },
  font:{
    color:'#666666',
  }
})