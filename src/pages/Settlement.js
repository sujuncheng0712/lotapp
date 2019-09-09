import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
const url = 'https://iot2.dochen.cn/api';
import CheckBox from 'react-native-check-box'
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
    DeviceEventEmitter.addListener('Address', ()=> {this._checkLoginState()})
    this._checkLoginState()
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
      <ScrollView>
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
          <TouchableOpacity
            style={styles.addressItem}
            onPress={() => {
              addressInfo.address ?
              this.props.navigation.navigate('Address') :this.props.navigation.navigate('Create');
            }}>
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

      </TouchableOpacity>
          <View style={styles.pay}>
            <Text style={{width:'100%',textAlign: 'left'}}>支付方式：</Text>
            <View style={styles.payItem}>
              <Image
                resizeMode="stretch"
                style={styles.payImg}
                source={require('../images/wxPay.png')}
              />
              <Text style={{flexDirection: 'row',padding:12,flex:0.9}}>微信支付  </Text>
             <CheckBox
              checkBoxColor={'#FF7A01'}
              style={{flex: 0.1, padding: 10}}
              onClick={()=>{
                this.setState({
                  isChecked:!this.state.isChecked,
                  value:1,
                })
              }}
              isChecked={!this.state.isChecked}
              //leftText={"微信支付"}
            />
            </View>
            <View style={styles.payItem}>
              <Image
                resizeMode="stretch"
                style={styles.payImg}
                source={require('../images/balancePay.png')}
              />
              <View style={{flexDirection: 'row',padding:12,flex:0.9}}>
                <Text>余额支付  </Text>
                <Text style={{color:'#FF7A01'}}> 余额：{this.state.balance}元</Text>
              </View>

            <CheckBox
              checkBoxColor={'#FF7A01'}
              style={{flex: 0.1, padding: 10}}
              onClick={()=>{
                this.setState({
                  isChecked:!this.state.isChecked,
                  value:2,
                })
              }}
              isChecked={this.state.isChecked}
              //leftText={`余额  支付余额：${this.state.balance}元`}
            />
            </View>
          </View>
          <View style={styles.buy}>
            <View style={styles.buyLeft}>
              <Text style={{position:'absolute',bottom:2.5 }}>合计：</Text>
              <Text style={{color:'#FF7A01',fontSize:20,position:'absolute',bottom:0,left:40 }}>{orderInfo.total}.00</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.props.navigation.navigate('ScanScreen');
              }}>
              <Text
                style={{
                  color:'white',
                  textAlign:'center',
                }}
              >提交</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
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
    marginTop:10,
    width:'100%',
    fontSize: 10,
  },
  payItem:{
    width:'100%',
    flexDirection: 'row',
  },
  checkbox:{
    //checkBoxColor:"#FF7A01",
  },
  payImg:{
    flex:0.09,
    marginTop:10,
    height:25,
    width:25,
  },
  buy:{
    marginTop:40,
    width:'100%',
    flexDirection: 'row',
  },
  buyLeft:{
    flex:0.87,
    flexDirection: 'row',
    alignContent:'flex-end',
  },
  button:{
    flex:0.13,
    backgroundColor: '#FF7A01',
    borderColor:'#FF7A01',
    color:'#FF7A01',
    textAlign:'center',
    borderRadius:3,
    width: 30,
    fontSize:8,
    padding: 5,
  },
})
