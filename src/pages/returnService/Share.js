import React from 'react';
import {View, Text, Button, AsyncStorage, StyleSheet, Image, TouchableOpacity,ScrollView} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: '',
      month_count : 0,
      share_list : [],
      state:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '我要分享',
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
      this.setState({ LoginInfo});
      let urlInfo  =`${url}/userShareSuccess?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          let share_list = [];
          this.setState({month_count:info.month_count})
          info.datas[0].us_datas.forEach((val,i)=>{
            share_list.push(val);
          });
          this.setState({share_list:share_list});
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
    const {navigation} = this.props;
    const state = navigation.getParam('state','');
    this.setState({state});
  }

  render() {
    const {share_list} = this.state;
    const showList = share_list.map(item =>{
      return(
        <Text>{item.share_where ===1 ? '分享到朋友圈' :'分享到好友'}--{item.created_at}</Text>
      )
    })
    return (
      <View style={{flex: 1,padding:10}}>
        <Text>打开链接后，将链接转发到朋友圈，即可完成分享</Text>
        <View style={styles.list}>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              source={require('../../images/imgA20/A_01.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>DGK物联水机A20，今天报名安装，仅需半价！戳我了解详情→ </Text>
          </View>

        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={()=> this.props.navigation.navigate('Extend',{type:'A20',state:'user'})}
        >
          <Text style={{color:'#fff'}}>立即推广</Text>
        </TouchableOpacity>


        <View style={styles.list}>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              source={require('../../images/imgA16/A_01.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>DGK移动水吧A16，今天报名安装，仅需半价！戳我了解详情→ </Text>
          </View>

        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={()=> this.props.navigation.navigate('Extend',{type:'A16',state:'user'})}
        >
          <Text style={{color:'#fff'}}>立即推广</Text>
        </TouchableOpacity>
        <ScrollView>
          {showList}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  list:{
    marginTop:10,
    flexDirection:'row',
    borderTopWidth:0.5,
    borderColor:'#bbb',
    paddingTop:10,
    paddingBottom:10,
    paddingRight:10,
  },
  item:{
    padding:1,
  },
  title:{
    padding:1,
    width:'60%',
  },
  Img:{
    height:70,
    width:90,
    marginRight:10,
  },
  button:{
    backgroundColor:'#FF7701',
    borderRadius:5,
    padding:5,
    width: '20%',
    marginLeft:'80%',
  }

})
