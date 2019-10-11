import React from 'react';
import {View, Text, TouchableOpacity, AsyncStorage,ScrollView,StyleSheet,DeviceEventEmitter,ToastAndroid,Image,FlatList} from 'react-native';
const url = 'https://iot2.dochen.cn/api';
const ors ={
  '-2' : '用户撤回',
  '-1' : '不同意退货',
  '0'  : '不同意退货',
  '1' : '用户提出退货',
  '3' : '商家同意退(换)货',
  '4' : '退货发出',
  '5' : '退货有问题',
  '6' : '退货完成'
};
const s2n ={
  '用户撤回' : -2,
  // '不同意退货' : -1,
  '不同意退货' : 0,
  '用户提出退货' : 1,
  '商家同意退(换)货' : 3,
  '退货发出' : 4,
  '退货有问题' : 5,
  '退货完成' : 6,
};
const ort ={
  '1' : '退货',
  '2' : '换货',
};
const t2s ={
  '退货' : 1,
  '换货' : 2,
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: '',
      lists:[],
      type: 1,
      choice: 1,
      details:[],
      visible: false,
      productDeal:1,
      state:1,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '退款/售后',
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
      this.getReturnOrder(1,1);

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  // 获取退货
  getReturnOrder(type, choice){
    const {LoginInfo} = this.state;
    let getReturnOrder = `${url}/returnOrder?sale_type=${LoginInfo.sale_type}`;
    getReturnOrder += LoginInfo.mid ? `&mid=${LoginInfo.mid}` : '';
    fetch(getReturnOrder).then(res => {
      if (res.ok) {
        res.json().then(info => {
          console.log(info);
          if (info.status) {
            let lists = [];
            let key = 0;
            info.datas.forEach(val=>{
              if(choice === 1){
                if (val.type === type && val.state === 1) {
                  val.id = key++;
                  val.state = ors[val.state];
                  val.type = ort[val.type];
                  val.return_cost = val.return_cost ? val.return_cost : 0;
                  lists.push(val);
                }
              }else if (choice === 2){
                if (val.type === type && (val.state >= 3 && val.state <= 5)) {
                  val.id = key++;
                  val.state = ors[val.state];
                  val.type = ort[val.type];
                  lists.push(val);
                }
              }else if (choice === 3){
                if (val.type === type && (val.state <= 0 || val.state === 6)) {
                  val.id = key++;
                  val.state = ors[val.state];
                  val.type = ort[val.type];
                  lists.push(val);
                }
              }
            });
            this.setState({lists:lists, type:type, choice:choice});
          }else {
            ToastAndroid.show(`提示：[${info.message}]`, ToastAndroid.SHORT);
          }
        });
      }
    });
  }

  // 修改退货状态
  updateReturnOrder(orid, state, type){
    const {LoginInfo} = this.state;
    let updateReturnOrder = `${url}/returnOrder`;
    fetch(updateReturnOrder, {
      method : 'PUT',
      body : JSON.stringify({
        orid : orid,
        state : state,
        type : t2s[type],
        sale_type : LoginInfo.sale_type
      })
    }).then(res=>{
      if (res.ok){
        console.log(info);
        res.json().then(info=>{
          if(info.status){
            //window.location.reload();
            this.getReturnOrder(1,1);

          }
        })
      }
    })
  }

  
  render() {
    const {lists, type, choice,productDeal,details,state} = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <ScrollView style={{flex: 1,backgroundColor:'#F0EEEF',padding:5}}>
        <View style={styles.top}>
          <View style={{width:'60%',alignItems:'center',justifyContent:'flex-start',flexDirection:'row'}}>
            <TouchableOpacity
              style={styles.topItem}
              onPress={()=>{this.setState({productDeal:1})}}
            >
              <View style={styles.topItem}>
              {productDeal ===1 ? (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round.png')}
                />
              ) : (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round2.png')}
                />
              )}
              </View>
              <Text>退货</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topItem}
              onPress={()=>{this.setState({productDeal:2})}}
            >
              <View style={styles.topItem}>
              {productDeal ===2 ? (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round.png')}
                />
              ) : (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round2.png')}
                />
              )}
              </View>
              <Text>换货</Text>
            </TouchableOpacity>
          </View>
          <View style={{width:'40%',alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
            <TouchableOpacity
              style={styles.topButton}
              onPress={()=>{this.props.navigation.push('ChangeGoods')}} >
              <Text style={{color:'white',}}>换 货</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.top}>
        <TouchableOpacity
              style={styles.topItem}
              onPress={()=>{this.setState({state:1})}}
            >
              <View style={styles.topItem}>
              {state ===1 ? (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round.png')}
                />
              ) : (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round2.png')}
                />
              )}
              </View>
              <Text>已申请</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topItem}
              onPress={()=>{this.setState({state:2})}}
            >
              <View style={styles.topItem}>
              {state ===2 ? (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round.png')}
                />
              ) : (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round2.png')}
                />
              )}
              </View>
              <Text>已同意</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topItem}
              onPress={()=>{this.setState({state:3})}}
            >
              <View style={styles.topItem}>
              {state ===3 ? (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round.png')}
                />
              ) : (
                <Image
                  style={styles.topImg}
                  source={require('../../images/round2.png')}
                />
              )}
              </View>
              <Text>已结束</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.title}>
          <Text style={styles.titleItem}>状态</Text>
          <Text style={styles.titleItem}>用户</Text>
          <Text style={styles.titleItem}>金额</Text>
          <Text style={styles.titleItem}>操作</Text>
        </View>

        <FlatList
          data={lists}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={separator}
          renderItem={({item}) =>
            <View style={styles.title}>
              <Text style={styles.titleItem}>{item.state}</Text>
              <Text style={styles.titleItem}>{item.user}</Text>
              <Text style={styles.titleItem}>{item.return_cost}</Text>
              <Text style={styles.titleItem}>{item.orid}</Text>
              <TouchableOpacity
                style={styles.topButton}
                //onPress={()=>{this.setState({state:3})}}
              >
              <Text>更多</Text>
            </TouchableOpacity>
          </View>
              }
        />
       <Text style={{textAlign:'center', width:'100%'}}>{lists.length ===0 ? 'NO DATA' : ''}</Text>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
  },
  topItem:{
    padding:3,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  topImg:{
    width:15,
    height:15,
  },
  topButton:{
    backgroundColor:'#FF7701',
    borderColor:'#FF7701',
    borderWidth:1,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
    padding:5,
    marginRight:20,
    marginTop:5,
  },
  title:{
    flexDirection:'row',
    borderBottomColor:'#666',
    borderBottomWidth:0.5,
  },
  titleItem:{
    width:'25%',
    textAlign:'center',
    padding:5,
  }


})