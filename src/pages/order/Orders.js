import React from 'react';
import {
  View,
  Text,
  AsyncStorage,
  BackHandler,
  ToastAndroid,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,ScrollView
} from 'react-native';

const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      codeList: [],
      title:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:navigation.getParam('title')
    };
  };

  // render创建之前
  componentWillMount() {
    let title = this.props.navigation.getParam('title','');
    this.setState({title})
    // 验证/读取 登陆状态
    this._checkLoginState();

  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  componentWillUnmount() {

  }



  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      //获取订单
      let urlInfo = `${url}/orders?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if (info.status){
            this.setState({lists: info.data});
          }
        })
      })

    } else {
      this.props.navigation.navigate('Login');
    }
  };



  render() {
    const {lists,title,codeList} = this.state;
    let unPay = [];
    let unSend = [];
    let unReceive = [];
    lists.map((val)=>{
      console.log(title ==='未付款' && val.state===3 )
      if (title ==='未付款' && val.state===3 ){
        val.message='未付款';
        unPay.push(val);
      }else if (val.delivery_at && val.delivery_at != "None" ){
        val.message = "已发货";
        unReceive.push(val);
      }
      else if (val.state===4 ){
        val.message = "待发货";
        unSend.push(val);
      }
    })
    unSend.forEach((item)=>{
      if (item.delivery_at && item.delivery_at != "None" ){
        item.message = "已发货";
      }else if (item.state === 4){
        item.message = "已付款";
      }
      if(item.consigner === "SF"){
        item.consigner = "顺丰单号："
      }else if(item.consigner === "DBL"){
        item.consigner = "德邦单号："
      }
    })
    console.log(unPay);
    console.log(unSend);
    console.log(unReceive);
    const showUnPay = unPay.map((item,key )=>{
      return(
        <TouchableOpacity style={styles.listItem} key={key}
          onPress={() => {
            this.props.navigation.navigate('Order',{uuid:item.uuid});
          }}
        >
            <View style={styles.top}>
              <Text style={styles.uuid}>
                订单编号：{item.uuid}
              </Text>
              <Text style={{flex:0.3,color: '#FF7A01',textAlign:'right',}}>
                {item.message}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.date}>{item.created_at}</Text>
              <Text style={{ flex:0.4,textAlign:'right'}}>
                共{item.quantity} 合计：{item.total}
              </Text>
            </View>
            <View style={styles.productsLists}>
              {item.products.map((val,k)=>{
                return(
                  <View style={styles.product} key={k}>
                    <Image
                      style={styles.itemImg}
                      source={{uri: `${val.prev_image}`}}
                      cache={'force-cache'}
                    />
                    <Text style={{flex:0.7,textAlign:'center',paddingTop:15}}>
                      {val.title}
                    </Text>
                    <Text style={{flex:0.3,textAlign:'right',paddingTop:15}}>
                      {val.quantity} × {val.price}元
                    </Text>
                  </View>
                )
              })}

            </View>
        </TouchableOpacity>
      )
    })

    const showUnSend = unSend.map((item,key )=>{
      return(
        <TouchableOpacity style={styles.listItem} key={key}
          onPress={() => {
            this.props.navigation.navigate('Order',{uuid:item.uuid});
          }}
        >
          <View style={styles.top}>
            <Text style={styles.uuid}>
              订单编号：{item.uuid}
            </Text>
            <Text style={{flex:0.3,color: '#FF7A01',textAlign:'right',}}>
              {item.message}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.date}>{item.created_at}</Text>
            <Text style={{ flex:0.4,textAlign:'right'}}>
              共{item.quantity} 合计：{item.total}
            </Text>
          </View>
          <View style={styles.productsLists}>
            {item.products.map((val,k)=>{
              return(
                <View style={styles.product} key={k}>
                  <Image
                    style={styles.itemImg}
                    source={{uri: `${val.prev_image}`}}
                    cache={'force-cache'}
                  />
                  <Text style={{flex:0.7,textAlign:'center',paddingTop:15}}>
                    {val.title}
                  </Text>
                  <Text style={{flex:0.3,textAlign:'right',paddingTop:15}}>
                    {val.quantity} × {val.price}元
                  </Text>
                </View>
              )
            })}

          </View>
        </TouchableOpacity>
      )
    })

    const showUnReceive = unReceive.map((item,key )=>{
      return(
        <TouchableOpacity style={styles.listItem} key={key}
              onPress={() => {
                this.props.navigation.navigate('Order',{uuid:item.uuid});
              }}
        >
          <View style={styles.top}>
            <Text style={styles.uuid}>
              订单编号：{item.uuid}
            </Text>
            <Text style={{flex:0.3,color: '#FF7A01',textAlign:'right',}}>
              {item.message}
            </Text>
          </View>
          <View>
            <Text style={{color:'#FF7A01'}}>点击查看详细信息</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.date}>{item.created_at}</Text>
            <Text style={{ flex:0.4,textAlign:'right'}}>
              共{item.quantity} 合计：{item.total}
            </Text>
          </View>
          <View style={styles.productsLists}>
            {item.products.map((val,k)=>{
              return(
                <View style={styles.product} key={k}>
                  <Image
                    style={styles.itemImg}
                    source={{uri: `${val.prev_image}`}}
                    cache={'force-cache'}
                  />
                  <Text style={{flex:0.7,textAlign:'center',paddingTop:15}}>
                    {val.title}
                  </Text>
                  <Text style={{flex:0.3,textAlign:'right',paddingTop:15}}>
                    {val.quantity} × {val.price}元
                  </Text>
                </View>
              )
            })}

          </View>
        </TouchableOpacity>
      )
    })
    return (
      <View style={styles.list}>
        <ScrollView>
           {title ===`未付款` ?showUnPay:title ==='待发货' ? showUnSend :showUnReceive}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list:{
    flex:1,
    backgroundColor:'#f5f5f5',
    padding:5,
  },
    listItem:{

      borderWidth:0.5,
      borderColor:'#FF7A01',
      padding:5,
      marginTop:5,
    },
  top:{
    backgroundColor:'#f5f5f5',
    flexDirection:'row',
  },
  uuid:{
    flex:0.7,
  },
  info:{
    flexDirection:'row',

  },
  date:{
    flex:0.6,
  },
  productsLists:{
    flex:1,

  },
  product:{
    flexDirection:'row',
    marginTop:5,
  },
  itemImg:{
    width:50,
    height:50,
  },
  state:{

  }

})
