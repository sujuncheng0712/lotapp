import React from 'react';
import {View, Text, AsyncStorage, FlatList, StyleSheet} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:'',
      data:[],
    };
  }
  static navigationOptions = ({navigation}) => {
    let title = navigation.getParam('state');
    return {
      headerTitle: '提现记录',
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
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({LoginInfo})
        //获取商家记录
       
        let urlInfo = `${url}/merchantWithdraw?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}&type=all`;
        console.log(urlInfo);
        fetch(urlInfo).then(res =>{
            res.json().then(info =>{
                console.log(info);
                if (info.status){
                    info.mw_datas.forEach(item =>{
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
       
      
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
    const {data} = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <View style={{flex: 1,}}>
        <View style={styles.title}>
          <Text style={{...styles.titleItem,width:'23%'}}>发送时间</Text>
          <Text style={{...styles.titleItem,width:'44%'}}>银行卡号</Text>
          <Text style={{...styles.titleItem,width:'15%'}}>金额</Text>
          <Text style={{...styles.titleItem,width:'18%'}}>处理进度</Text>
        </View>
        

        <View  style={{flex:1}}>
          <FlatList
            style={{flex:1}}
            data={data}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={separator}
            renderItem={({item}) =>
              <View style={styles.item}>
                <Text style={{...styles.titleItem,width:'23%'}}>{item.created_at}</Text>
                <Text style={{...styles.titleItem,width:'44%'}}>{item.account}</Text>
                <Text style={{...styles.titleItem,width:'15%'}}>{item.amount}</Text>
                <Text style={{...styles.titleItem,width:'18%'}}>{item.state}</Text>
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

    textAlign:'center',
    padding:10,
  },
  titlePhone:{
  
    textAlign:'center',
    padding:10,
  },
  titleItem:{

    textAlign:'center',
    padding:5,
    fontSize:12,
  },
  item:{
    flexDirection:'row',
  },
})
