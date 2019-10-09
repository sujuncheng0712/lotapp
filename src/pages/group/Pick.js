import React from 'react';
import {View, Text, ScrollView, AsyncStorage,StyleSheet,TouchableOpacity,TextInput,Picker,ToastAndroid} from 'react-native';
import address1 from '../../../service/address';
import { PickerView } from '@ant-design/react-native';
const url = 'https://iot2.dochen.cn/api';
let time = 0;
let children = [];
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:{},
      data:[],
      consignee:'',
      phone:'',
      area:'',
      address:'',
      remark:'',
      mpid:'',
      quantity:0,
      price:1,
      balance:'',
      list:[],
    };
    
    
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'我要提货' ,
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
      //获取产品列表
      let urlInfo=`${url}/merchantProduct?sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res =>{
          res.json().then(info =>{
              console.log(info);
              let list = [];
              let list2 = [];
              if(info.status && time ===0){
                  info.data.forEach((item) =>{
                      //children.push(<Picker.Item label={item.title+' : '+item.price} value={item.mpid}/>);
                      list.push({label:item.title+' : '+item.price,value:item.mpid})
                  })
                  time++;
                  list2.push(list);
                  console.log(list2);
                  this.setState({data:info.data,mpid:info.data[0].mpid,list:list2,});
              }

          })
      })
      //获取额度
      let urlInfo2=`${url}/merchantDeposit?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}&type=1`;
      fetch(urlInfo2).then(res =>{
          res.json().then(info =>{
              console.log(info);
              if (info.status && info.deposit_data.length>0) {
                  this.setState({balance:info.deposit_data[0].balance});
              }
          })
      })

    } else {
      this.props.navigation.navigate('Login');
    }
  };

    //选择机器
    handleChange(value) {
      console.log(`Selected: ${value}`);
      this.state.data.forEach(item =>{
          if (item.mpid ===value){
              this.setState({mpid:value,price:item.price});
          }
      })

  }
  //选择地区
  onChange(value) {
      let area =value.toString().replace(new RegExp(',', 'g'), '/');
      this.setState({area});
  }

  signUp(){
      const {consignee,phone,area,address,remark,quantity,mpid,price,balance,LoginInfo} = this.state;
      if (quantity === 0 ) {
          ToastAndroid.show('请输入数量', ToastAndroid.SHORT);
          return false;
      }
      if (quantity*price >balance) {
        ToastAndroid.show('超出额度', ToastAndroid.SHORT);
          return false;
      }
      let urlInfo=`${url}/merchantOrder`;
      fetch(urlInfo,{
          method:'POST',
          body:JSON.stringify({
              consignee:consignee,
              phone:phone,
              area:area,
              address:address,
              remark:remark,
              mid:LoginInfo.mid,
              sale_type:LoginInfo.sale_type,
              total:quantity*price,
              products:[{
                  mpid:mpid,
                  quantity:quantity,
                  price:price,
              }],
          })
      }).then(res =>{
          res.json().then(info =>{
              console.log(info);
              if (info.status) {
                ToastAndroid.show('提交成功', ToastAndroid.SHORT);
                  this.getLimit();
                 this.props.navigation.goBack();
              }else{
                ToastAndroid.show('提交失败', ToastAndroid.SHORT);
              }
          })
      })
  }

  render() {
    const {balance,price,area,list} = this.state;
    console.log(balance+'----'+price)

    
    return (
      <ScrollView style={{flex:1,paddingBottom:40,}}>
        <View style={styles.top}>
          <Text style={{fontWeight:'bold',padding:5}}>你当前剩余额度为：{balance}</Text>
          <TouchableOpacity
            style={styles.topButton}
            onPress={()=>{this.props.navigation.push('')}}
          >
            <Text style={{color:'white'}}>提货记录</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{textAlign:'right',fontSize:17}}>选择产品：</Text>
            </View>
           
            <View style={styles.input}>
            <PickerView
               onChange={(value)=>{this.setState({mpid:value})}}
              value={this.state.mpid}
              data={list}
              cascade={false}
            />
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{textAlign:'right',fontSize:17}}>提货数量：</Text>
            </View>
           
            <View style={styles.input}>
              <TextInput 
                value={this.state.quantity}
                onChangeText={(e)=>{ const newText = e.replace(/[^\d]+/, ''); this.setState({quantity:newText})}}
              />
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{textAlign:'right',fontSize:17}}>收货姓名：</Text>
            </View>
           
            <View style={styles.input}>
              <TextInput 
                value={this.state.quantity}
                onChangeText={(e)=>{ this.setState({consignee:e})}}
              />
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{textAlign:'right',fontSize:17}}>收货电话：</Text>
            </View>
           
            <View style={styles.input}>
              <TextInput 
                value={this.state.quantity}
                onChangeText={(e)=>{ const newText = e.replace(/[^\d]+/, ''); this.setState({phone:newText})}}
              />
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{textAlign:'right',fontSize:17}}>地区：</Text>
            </View>
           
            <View style={styles.input}>
              
            </View>
          </View>

        </View>
        
      </ScrollView>
      
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    padding:10,
  },
  topButton:{
    backgroundColor:'#FF7701',
    padding:5,
    borderRadius:5,
    marginLeft:10,
  },
  list:{

  },
  item:{
    flexDirection:'row',
    paddingRight:20,
    marginTop:5,
  },
  itemTitle:{
    width:'30%',
    justifyContent:'center',
    alignItems:'flex-end',
  },
  input:{
    width:'70%',
    borderColor:'#666',
    borderWidth:0.5,
    borderRadius:5,
  }
})