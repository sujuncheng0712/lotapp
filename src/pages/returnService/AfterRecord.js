import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {
  View,
  Text,
  Button,
  AsyncStorage,
  FlatList,
  StyleSheet,
  SectionList,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas:[],
    };
  }
  static navigationOptions = ({navigation}) => {
    let title = navigation.getParam('state');
    return {
      headerTitle: '售后记录',
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
      this.setState({LoginInfo});
      let urlInfo = `${url}/userSignUp?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info)
          if (info.status){
            this.setState({datas:info.datas});
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
    const {datas} = this.state;
    const showList = datas.map((item,key )=>{
      return(
        <View style={styles.title} key={key}>
          <View>
            <Image
              style={styles.topImg}
              source={require('../../images/pic/after.png')}
            />
          </View>
          <View style={styles.titleItem2}>
            <Text>报装订单：{item.usuid}</Text>
            <Text>处理结果：{item.state ===1 ? '处理中' :'处理完毕'}</Text>
            <Text>处理结果：{item.state ===1 ? '处理中' :'处理完毕'}</Text>
            <Text>报装日期：{item.created_at}</Text>
          </View>
        </View>
      )
    })
    return (
      <View style={{flex: 1,}}>
        {datas.length > 0 ? showList :<Text>没有数据</Text>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title:{
    flexDirection:'row',
    borderColor:'#bbb',
    borderBottomWidth:0.5,
    marginTop:10,
  },
  titleItem2:{

  },
  topImg:{
    height:50,
    width:50,
    margin:10,
  },
})
