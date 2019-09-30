import React from 'react';
import {View, Text, Image, AsyncStorage,ScrollView,Dimensions} from 'react-native';
import * as wechat from 'react-native-wechat';
const {height,width} =  Dimensions.get('window');
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: '',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '手机端使用指引',
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({LoginInfo});
      //获取信息
      let urlInfo = `${url}/logisticsPage_create?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  render() {
    const {name} = this.state;
    return (
      <ScrollView style={{flex: 1}}>
        <Image
          style={{width:width,height:width*3.75}}
          source={require('../../images/group/wlh.jpg')}
        />
      </ScrollView>
    );
  }
}
