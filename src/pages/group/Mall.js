import React from 'react';
import {View, Text, TouchableOpacity, AsyncStorage,ScrollView,StyleSheet,TextInput,Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: '',
      lists: [],
      count: 0,
      balance: 0,
      select_pay: 'pay/wx',
      oid:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '购买激活码',
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
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({ LoginInfo});
      let urlInfo = `${url}/products?uid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info=>{
          console.log(info);
          if(info.status){
            const lists = [];
            info.data.map((val) => {
              if (val.type === 3) {
                val.check = false;
                val.num = 1;
                lists.push(val);
              }
            });
            this.setState({lists});
            this.getBalance(LoginInfo);
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

  //获得余额
  getBalance(LoginInfo){
    let urlInfo = `${url}/wallet/${LoginInfo.mid}?sale_type=${LoginInfo.sale_type}`;
    console.log(urlInfo);
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        console.log(info);
        if (info.status) {
          this.setState({balance: info.data[0].balance});
        }

      })
    })
  }

   // 统计所选择的商品价格
   countPrice(lists) {
    let count = 0;
    lists.map((val) => {
      if (val.check) count = count + val.price * val.num;
    });
    this.setState({count});
  }
  render() {
    const {lists, count, balance, select_pay} = this.state;
    console.log(lists)
    const productsList = lists.map((item,key)=>{
      return(
        
        <View style={styles.item} key={key}>
          <TouchableOpacity
            onPress={()=>{
              const _lists = lists;
              _lists[key].check = lists[key].check ? false : true;
              this.setState({lists: _lists});
              this.countPrice(_lists);
            }}
          >
           <Icon name={item.check ? 'md-radio-button-on': "md-radio-button-off"} size={20} color={item.check ? '#ff8800':'#666'} /> 
          </TouchableOpacity>
          <Image
            style={styles.itemImg}
            source={{uri: `${item.prev_image}`}}
            cache={'force-cache'}
          />
          <View>
            <Text>{item.title}</Text>
            <Text style={{color:'#FF7701'}}>￥ {item.price}.00</Text>
          </View>
          <TextInput 
            style={styles.input}
            value={item.num}
            defaultValue={'1'}
            onChangeText={(e)=>{
              const newText = e.replace(/[^\d]+/, '');
              const _lists = lists;
              _lists[key].num = newText;
              this.setState({lists: _lists});
              this.countPrice(_lists);}}/>
          <Text>个</Text>
        </View>
      )
     
    
    })

    return (
      <ScrollView style={{flex: 1,padding:10}}>
        {productsList}
        <View style={styles.shouldPay}>
          <Text style={{ width:'40%'}}>应付金额：</Text>
          <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end',width:'60%'}}>
            <Text style={{color:'#FF7701'}}>{count}.00</Text>
            <Text>元</Text>
          </View>
        </View>
        <Text style={styles.choose}>选择支付方式</Text>
        <TouchableOpacity 
          style={styles.item}
          onPress={()=>{this.setState({select_pay:'pay/wx'})}}
        >
          <View style={{width:'50%',flexDirection:'row',alignItems:'center'}}>
            <Image
              style={styles.itemImg}
              source={require('../../images/pay-wechat.png')}
           />
            <Text>微信支付</Text>
          </View>
      
        <View style={{width:'50%',alignItems:'flex-end'}}>
        {select_pay === 'pay/wx' ? (
             <Icon name={ 'ios-checkmark-circle-outline'} size={20} color={'#ff8800'} /> 
            ) : <Text></Text>}
        </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.item}
          onPress={()=>{this.setState({select_pay:'pay/wallet'})}}
        >
          <View style={{width:'80%',flexDirection:'row',alignItems:'center'}}>
            <Image
              style={styles.itemImg}
              source={require('../../images/pay-balance.png')}
           />
            <Text>余额支付</Text>
            <Text style={{color:'#FF7701',marginLeft:10}}>余额：¥{balance}</Text>
          </View>
      
          <View style={{width:'20%',alignItems:'flex-end'}}>
            {select_pay === 'pay/wallet' ? (
                <Icon name={ 'ios-checkmark-circle-outline'} size={20} color={'#ff8800'} /> 
                ) : <Text></Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={()=>{}}
        >
         <Text style={{color:'white'}}>立即购买</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  item:{
    flexDirection:'row',
    borderBottomColor:'#666',
    borderBottomWidth:0.5,
    paddingTop:10,
    paddingBottom:15,
    alignItems:'center',
  },
  itemImg:{
    height:40,
    width:40,
    marginLeft:10,
    marginRight:10,
  },
  input:{
    borderWidth:0.5,
    borderColor:'#666',
    width:'15%',
    height:35,
    marginLeft:4,
    marginRight:4,
    paddingBottom:0,
    paddingTop:-5
  },
  shouldPay:{
    flexDirection:'row',
    alignItems:'center',
    paddingTop:5,
    paddingBottom:5,
    borderBottomColor:'#666',
    borderBottomWidth:0.5,
    paddingBottom:10,
  },
  choose:{
    marginTop:10,
    width:'100%',
    textAlign:'center',
  },
  button:{
    backgroundColor:'#FF7701',
    borderWidth:1,
    borderColor:'#FF7701',
    justifyContent:'center',
    alignItems:'center',
    padding:5,
    borderRadius:5,
    marginTop:20,
  }



})