import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage, Image,CheckBox} from 'react-native';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: {},
      productsLists: [],
      addressInfo: [],
      balance: 0,
      value: 1,
      LoginInfo:{},
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '购物清单',
    };
  };

  // render创建之前
  componentWillMount() {
    //wechat.registerApp('wxed79edc328ec284a');
    this._checkLoginState();
    const products = this.props.navigation.getParam('products', 'no');
    console.log(products)
    this.setState({
      orderInfo: products,
      productsLists: products.data,
    })
  }

  componentDidMount() {

  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    if (LoginInfo !== null) {
      console.log(LoginInfo.name);
      this.setState({LoginInfo});
      //获取余额
      let urlInfo = `${url}/userWallet?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}&type=now`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info)
          if (info.status && info.uw_datas.length !== 0){
            this.setState({balance:res.uw_datas[0].balance})
          }
        })
      })

      //获取地址记录
      let urlInfo2 = `${url}/users/${LoginInfo.uid}/address?uid=${LoginInfo.uid}`;
      fetch(urlInfo2).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if (info.status){
            let addressInfo = {};
            info.data.forEach(item => {
              if (item.default === 1) {
                addressInfo = item;
                addressInfo.mobile = item.phone;
              }
            });
            this.setState({addressInfo});
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };



  render() {
    const {orderInfo, productsLists, addressInfo} = this.state;
    const type =this.props.navigation.getParam('type', '');;
    // 拼接完整的地址
    let areaToStr = addressInfo.area && addressInfo.area.replace(/\//g, '');
    const detailAddress = areaToStr && addressInfo.address ? `${areaToStr} ${addressInfo.address}` : '';
    let products = [];
    productsLists.map((item,key)=>{
      products.push(
        <View style={styles.item} key={key}>
          <Image
            style={styles.itemImg}
            source={{uri: `${item.prev_image}`}}
          />
          <View style={styles.itemInfo}>
            <Text style={{flex:0.6,marginLeft:5}}>{item.title}</Text>
            <Text style={{flex:0.2}}>{item.quantity} ×</Text>
            <Text style={{flex:0.2,color:'#FF7A01'}}>{item.price}元</Text>
          </View>
        </View>
      )
    });



    return (
      <View style={styles.pages}>
        <View style={styles.list}>
          {products}
          <View style={styles.total}>
            <Text>应付：</Text>
            <Text style={{color:'#FF7A01'}}>{orderInfo.total}.00</Text>
            <Text>元</Text>
          </View>
        </View>
        <Text style={{width:'100%',textAlign: 'left'}}>收货地址：</Text>

        <View style={styles.addressItem}>
          <View style={styles.addressLeft}>
            <View style={styles.username}>
              <Text style={{marginRight:10}}>{addressInfo.contact || '请填写联系人姓名'}</Text>
              <Text>{addressInfo.phone || '请填写联系人手机号'}</Text>
            </View>
            <View style={styles.address}>
              <Text>{detailAddress || '请选择收货地址'}</Text>
            </View>
            <View/>
          </View>
          <Image
            style={styles.addressImg}
            source={require('../images/right.png')}
          />
        </View>
        <View style={styles.pay}>
          <Text style={{width:'100%',textAlign: 'left'}}>支付方式：</Text>
          <View style={styles.payItem}>
            <Text>微信支付</Text><CheckBox style={{backgroundColor:'#FF7A01',
            }}></CheckBox>
          </View>
          <View style={styles.payItem}>
            <Text>余额支付</Text><CheckBox PropTypes={styles.payItem}></CheckBox>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pages:{
    flex:1,
    padding:10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title:{
    textAlign: 'left',
    width:'100%',
  },
  list:{
    width:'100%',
    paddingBottom:6,
  },
  item:{
    flexDirection: 'row',
    marginBottom:5,
  },
  itemImg:{
    width:80,
    height:80,
  },
  itemInfo:{
    flex:1,
    marginTop:25,
    flexDirection: 'row',
  },
  total:{
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addressItem:{
    padding:10,
    width:'100%',
    flexDirection: 'row',
  },
  addressLeft:{
    flex:0.85,
  },
  username:{
    flexDirection: 'row',
  },
  address:{
    flexDirection: 'row',
  },
  addressImg: {
    flex:0.15,
    height:15,
    width:15,
    marginTop: 15,
  },
  pay:{
    borderWidth:1,
    borderColor:'red',
    width:'100%',
    fontSize: 10,
  },
  payItem:{
    width:'100%',
    flexDirection: 'row',
  },
  checkbox:{

  }

})
