import React from 'react';
import {
  View,
  Text,
  AsyncStorage,
  BackHandler,
  ToastAndroid,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      wxConfig: [],
      equipmentsList: [],
      codeList: [],
      visible: false,
      num: 0,
      logis: [],
      uuid: '',
      products:[],
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '订单详情',
    };
  };

  // render创建之前
  componentWillMount() {

    // 验证/读取 登陆状态
    this._checkLoginState();
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }



  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      let uuid = this.props.navigation.getParam('uuid','');
      this.setState({uuid})
      let urlInfo2 = `${url}/orders/${uuid}?sale_type=${LoginInfo.sale_type}`;
      console.log(urlInfo2)
      fetch(urlInfo2).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if(info.status){
            this.getLogiMessage(info.data[0].consigner, info.data[0].logistic);
            if(info.data[0].consigner === "SF"){
              info.data[0].consigner = "顺丰单号："
            }else if(info.data[0].consigner === "DBL"){
              info.data[0].consigner = "德邦单号："
            }
            this.setState({info: info.data[0],products:info.data[0].products});
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  //获取物流信息
  getLogiMessage(consigner, logistic){
    let urlInfo = `${url}/logistics_follow?consigner=${consigner}&logistic=${logistic}`;
    fetch(urlInfo).then(res =>{
      res.json().then(info =>{
        console.log(info)
        if (info.status){
          const trace = info.trace_date.trace;
          let logis = []
          trace.forEach(val =>{
            // console.log(val);
            let logi = val.AcceptTime + "---"+ val.AcceptStation;
            logis.push(logi);
          });
          console.log(logis);
          this.setState({logis: logis});
        }
      })
    })
  }
  render() {
    const {info,products, logis, codeList, num} = this.state;
    // 拼接完整的地址
    let areaToStr = info.area && info.area.replace(/\//g, '');
    const detailAddress = areaToStr && info.address ? `${areaToStr} ${info.address}` : '';
    console.log(products)
    let showList = null;
    if (products.length && products.length>0){
      showList = products.map((item,key)=>{
        return(
          <View style={styles.product} key={key}>
            <Image
              style={styles.itemImg}
              source={{uri: `${item.prev_image}`}}
              cache={'force-cache'}
            />
            <Text style={{flex:0.7,textAlign:'center',paddingTop:15}}>
              {item.title}
            </Text>
            <Text style={{flex:0.3,textAlign:'right',paddingTop:15}}>
              {item.quantity} × {item.price}元
            </Text>
          </View>
        )
      })
    }

    let showLogic = logis.map((item, key)=>{
      return(
        <Text style={styles.logicItem} key={key}>{item}</Text>
      )
    })


    return (
      <View style={styles.content}>
        <ScrollView>
         <View style={styles.order}>
           <Text style={styles.orderTop}>订单信息：</Text>
           <Text style={styles.info}>订单状态： {info.message}</Text>
           <Text style={styles.info}>订单编号：{info.uuid}</Text>
           <Text style={styles.info}>下单日期：{info.created_at}</Text>
           <Text style={styles.info}>订单金额：{info.total}元</Text>
         </View>
          <View style={styles.order}>
            <Text style={styles.orderTop}>收货人信息：</Text>
            <Text style={styles.info}>{info.consignee}   {info.phone}</Text>
            <Text style={styles.info}>{detailAddress}</Text>
          </View>
          <View style={styles.order}>
            <Text style={styles.orderTop}>购物清单：</Text>
            {showList}
            <View style={styles.orderBottom}>
              <Text>共 </Text>
              <Text style={{color:'#FF7701'}}>{info.quantity}</Text>
              <Text> 件商品 小计：</Text>
              <Text style={{color:'#FF7701'}}>{info.total}</Text>
              <Text> 元</Text>
            </View>
          </View>
          {info.consigner ===null ?  null :
            <View style={styles.order}>
            <Text style={styles.orderTop}>{info.consigner}{info.logistic}</Text>
            {showLogic}
          </View>}

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content:{
    flex:1,
    padding:10,
    backgroundColor:'#f5f5f5',
  },
  order:{
    borderColor:'#bbb',
    borderWidth:0.5,
    marginTop:10,
  },
  orderTop:{
    backgroundColor:'#f5f5f5',
    borderColor: '#bbb',
    borderBottomWidth:0.5,
    padding: 5,
  },
  orderBottom:{
    borderColor: '#bbb',
    borderTopWidth:0.5,
    flexDirection: 'row',
    padding:5,
    justifyContent:'flex-end'
  },
  info:{
    borderColor: '#bbb',
    borderBottomWidth:0.5,
    padding: 5,
  },
  product:{
    padding:5,
    flexDirection:'row',
    marginTop:5,
  },
  itemImg:{
    width:50,
    height:50,
  },
  logicItem:{
    marginTop:5,
  }
})
