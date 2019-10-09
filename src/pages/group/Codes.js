import React from 'react';
import {View, Text, ScrollView, AsyncStorage,StyleSheet,TouchableOpacity,TextInput,Picker,ToastAndroid} from 'react-native';
const url = 'https://iot2.dochen.cn/api';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    
    
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'查看激活码' ,
    };
  };

  // render创建之前
  componentWillMount() {
  
  }

  componentDidMount() {
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
      let urlInfo = `${url}/activationsaa?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
      console.log(urlInfo);
      fetch(urlInfo).then(res => {
        res.json().then(info => {
          console.log(info);
          if (info.status) {
            this.setState({data: info.data});
          } else {
            if (info.code === 9004) {
             
            } else {
              ToastAndroid.show('获取数据失败', ToastAndroid.SHORT);
            }
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

   

  render() {
    const { data } = this.state;
   

    
    return (
      <ScrollView style={{flex:1,padding:10,backgroundColor:'#F0EEEF'}}>
        {data.map((item,key)=>{
          return(
            <View style={styles.item}>
              <View style={styles.top}>
                <Text style={styles.id}>订单编号:{item.oid}</Text>
                <Text style={styles.havePay}>已付款</Text>
              </View>
              <View style={styles.title}>
                <Text style={styles.titleItem}>序号</Text>
                <Text style={styles.titleItem}>激活码</Text>
                <Text style={styles.titleItem}>激活状态</Text>
                <Text style={styles.titleItem}>激活时间</Text>
              </View>
              {item.cdkeys.map((val)=>{
                return(
                  <View style={styles.title}>
                    <Text style={styles.titleItem}>{key+1}</Text>
                    <Text style={styles.titleItem}>{val.code}</Text>
                    <Text style={styles.titleItem}>{val.confirm_at === 'None' ? '未激活' : '已激活'}</Text>
                    <Text style={styles.titleItem}>{val.confirm_at === 'None' ? '未激活' : val.confirm_at}</Text>
                  </View>
                )
              })}
              <View style={styles.middle}>
                <Text style={styles.middleItem1}>{item.created_at}</Text>
                <View style={styles.middleItem2}>
                  <Text style={{color:'#666'}}>共</Text>
                  <Text style={{color:'#FF7701'}}>{item.cdkeys.length}</Text>
                  <Text style={{color:'#666'}}>个激活码，合计</Text>
                  <Text style={{color:'#FF7701'}}> {item.total}</Text>
                  <Text style={{color:'#666'}}>元</Text>
                </View>
              </View>
              <View style={styles.middle}>
                <Text style={styles.middleItem1}>支付方式：{item.pay_ch === 'weixin' ? '微信支付' : '其他'}</Text>
                <Text style={{...styles.middleItem2,textAlign:'right',fontWeight:'bold'}}>购买人：{item.buyer}</Text>
              </View>
           </View> 
          )
        })}
        
      </ScrollView>
      
    );
  }
}
const styles = StyleSheet.create({
  item:{
    backgroundColor:'white',
    marginTop:5,
  },
  top:{
    flexDirection:'row',
    backgroundColor:'#f1f1f1',
    padding:5,
  },
  id:{
    width:'80%',
    color:'#666',
  },
  havePay:{
    width:'20%',
    textAlign:'right',
    color: '#FF7701',
  },
  title:{
    flexDirection:'row',
    marginBottom:10,
  },
  titleItem:{
    color:'#666',
    textAlign:'center',
    width:'25%',
  },
  middle:{
    flexDirection:'row',
    borderColor:'#F0EEEF',
    borderWidth:0.5,
    padding:5,
  },
  middleItem1:{
    width:'40%',
    color:'#666',
  },
  middleItem2:{
    width:'60%',
    justifyContent:'flex-end',
    flexDirection:'row',
  },
  middleItem2Font:{
    color:'#666',
  }
})