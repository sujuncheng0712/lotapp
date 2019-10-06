import React from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ToastAndroid,Picker
} from 'react-native';
import { Provider } from '@ant-design/react-native';
import { WebView } from 'react-native-webview';
import * as wechat from 'react-native-wechat';
import Area from '../../../service/Area';
import district from 'antd-mobile-demo-data';
const url = 'https://iot2.dochen.cn/api';
let pArr = [];
let cArr=[];
let tArr=[];
//省
const provinceArr = Area.map((val,i)=>{

  pArr.push(val.value);
  return (
    <Picker.Item key={i} label={val.value} value={`${val.code}` }/>
  );
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.layouty = 0,
    this.state = {
      paused: true,

      type : '',
      state:'',
      play:false,
      number:1,
      provinceCode:'',
      cityCode:'',
      countyCode:'',
      onchange:true,
      activeTabs:'1',
      hidden:false,
      username:'',      //联系人
      phone:'',         //联系电话
      area:'', //       省
      address:'',       //详细地址
      remark:'',        //备注信息
      mid:'',
      model:'',
      waiter:false,
      LoginInfo:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '我要报名',
    };
  };

  // render创建之前
  componentWillMount() {
    console.log(Area);
    let type = this.props.navigation.getParam('type','');
    let state = this.props.navigation.getParam('state','');
    this.setState({type, state});
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


    } else {
      this.props.navigation.navigate('Login');
    }
  };

  submit(){
    console.log(111);
    let {  username, phone, address, remark,number,LoginInfo,type, provinceValue,
      cityValue, countyValue,} = this.state;
    let model = type ==='A20' ? 'DCA20-A' :'DCA16-A';
    console.log(username)
    console.log(phone)
    console.log(address)
    console.log(remark)
    console.log(number)
    console.log(model)
    console.log(provinceValue)
    console.log(cityValue)
    console.log(countyValue)
    if(!(username && phone && provinceValue && cityValue && countyValue   && address)){
      ToastAndroid.show('*不能为空', ToastAndroid.SHORT);
      return false;
    }

    fetch(`${url}/userSignUp`,{
      method:'POST',
      body:JSON.stringify({
        mid:LoginInfo.mid,
        name:username,
        phone,
        province:provinceValue,
        city:cityValue,
        town:countyValue,
        quantity:number,
        address,
        remark,
        model:model,
      })
    }).then(res=>{
      if(res.ok){
        res.json().then(info=>{
          console.log(info)
          if(info.status){
            ToastAndroid.show('提交成功', ToastAndroid.SHORT);
            setTimeout(()=>{
              this.setState({
                username:'',
                phone:'',
                province:'',
                city:'',
                town:'',
                address:'',
                remark:'',
              });
              this.myScrollView.scrollTo({ y: 0, x: 0, animated: true});
              //this.props.navigation.navigate('Home')
            },800)
          }
        })
      }
    });
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
    const {navigation} = this.props;
    const state = navigation.getParam('state','');
    const type = navigation.getParam('type','');
    this.setState({state,type});
  }

  //增减数量
  setNumber(num){
    if (this.state.number>0){
      this.setState({number:parseInt(this.state.number)+num});
      this.forceUpdate();
    }else{
      this.setState({number:1});
      this.forceUpdate();
    }
  }

  //获得对应code下的市数组
  getCityArr(code){
    Area.forEach(item=>{
      if(item.code === code){
        let cityArr = item.children.map((val,i)=>{
          cArr.push(val.value);
          if(i===0){
            this.setState({cityValue:tArr[0],cityCode:`${val.code}` })
          }
          return (
            <Picker.Item key={i} label={val.value} value={`${val.code}` }/>
          )
        });
        this.setState({cityArr});
      }
    });
  }

   //获得对应code下的县数组
   getCountyArr(cityCode){
    const { provinceCode } = this.state;
    Area.forEach(item=>{
      if(item.code === provinceCode){
        item.children.forEach(value=>{
          if(value.code === cityCode){
            let countyArr = value.children.map((val,i)=>{
              tArr.push(val.value);
              if(i===0){
                this.setState({countyCode:`${val.code}`,county:val.value});
              }
              return (
                <Picker.Item key={i} label={val.value} value={`${val.code}` }/>
              )
            });
            if(countyArr.length>0){
              this.setState({countyArr});
            }
          }
        });

      }
    });
  }

  render() {
    const {state,type,number,area,waiter, cityArr,countyArr} = this.state;
    return (
        <View style={{flex:1,padding:5}}>
          <ScrollView style={{flex:1}} horizontal={false} ref={(view) => { this.myScrollView = view; }}>
          <Text style={{padding:10,textAlign:'center',fontWeight:'bold'}}>
            DGK{type ==='A20' ? '物联水机A20':'移动水吧A16' }，半价优惠活动
          </Text>


            {type ==='A20' ?
              <View style={{flex:1}}>
              <View style={styles.imgItem}>
                <Image
                  style={styles.Img}
                  resizeMode ={'stretch'}
                  source={require('../../images/imgA20/A_01.jpg')}
                />
              </View>
                <WebView
                  style={styles.video}
                  source={{uri:"https://v.qq.com/txp/iframe/player.html?vid=c06494ry9ef"}}
                >
                </WebView>
              </View>
              :
              <View style={{flex:1}}>
                <View style={styles.imgItem}>
                  <Image
                    style={styles.Img}
                    resizeMode ={'stretch'}
                    source={require('../../images/imgA16/A_01.jpg')}
                  />
                </View>
                <WebView
                  style={styles.video}
                  source={{uri:"https://v.qq.com/txp/iframe/player.html?vid=l0563bbxvyk"}}
                >
                </WebView>
              </View>
            }



              {/*<Video*/}
              {/*  style={styles.item2}*/}
              {/* // source={require('../returnService/aa.mp4')}*/}
              {/*  source={{uri: "http://gw.dochen.cn/assets/test.mp4"}}*/}
              {/*  paused={this.state.paused}//暂停*/}
              {/*  repeat={true}//确定在到达结尾时是否重复播放视频。*/}
              {/*/>*/}



          <View>
            <Text style={{textAlign:'center'}}>
              填写报名信息
            </Text>
            <View style={styles.num}>
              <Text style={{flex:0.7,textAlign:'center'}}>【数量选择】(免费报名，安装后付款)</Text>
              <View style={{flex:0.3,textAlign:'center',flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{padding:1,backgroundColor:'#bbb',height:20,width:20,marginLeft:5}}
                  onPress={() => {
                    this.setNumber(-1);
                  }}
                >
                 <Text style={{textAlign:'center'}}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  defaultValue={'1'}
                  value={number.toString()}
                  onChangeText={(e)=>{this.setState({number:e})}}
                />
                <TouchableOpacity
                  style={{padding:1,backgroundColor:'blue',height:20,width:20}}
                  onPress={() => {
                    this.setNumber(1);
                  }}
                >
                 <Text style={{textAlign:'center'}}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text>填写安装地址</Text>
            <View style={styles.list}  onLayout={event=>{this.layouty = event.nativeEvent.layout.y}}>
              <Provider>
                <View style={styles.item}>
                  <Text style={styles.title}>*联系人：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入联系人'}
                    value={this.state.username}
                    onChangeText={(e)=>{this.setState({username:e});console.log(e)}}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>*联系电话：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入联系电话'}
                    value={this.state.phone}
                    onChangeText={(e)=>{this.setState({phone:e})}}
                  />
                </View>
                {/* <View style={styles.item}>
                  <Text style={styles.title}>*省：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入省'}
                    value={this.state.province}
                    onChangeText={(e)=>{this.setState({province:e})}}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>*市：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入市'}
                    value={this.state.city}
                    onChangeText={(e)=>{this.setState({city:e})}}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>*县/区：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入县/区'}
                    value={this.state.town}
                    onChangeText={(e)=>{this.setState({town:e})}}
                  />
                </View> */}
                <View style={styles.item}>
                  <Text style={styles.title}>*省 : </Text>
                  <View  style={styles.itemInput}>
                  <Picker
                    mode={'dropdown'}
                    style={styles.picker}
                    selectedValue={this.state.provinceCode}
                    onValueChange={(value,key) => {
                      this.setState({provinceCode: value,provinceValue:pArr[key]});console.log(value);console.log(pArr[key]);this.forceUpdate; this.getCityArr(value);}
        
                    }>
                    {provinceArr}
                  </Picker>
                  </View>
                </View> 

                <View style={styles.item}>
                  <Text style={styles.title}>*市 : </Text>
                  <View  style={styles.itemInput}>
                    <Picker
                      mode={'dropdown'}
                      style={styles.picker}
                      selectedValue={this.state.cityCode}
                      onValueChange={(value,key) => {
                        this.setState({cityCode: value,cityValue:cArr[key]});console.log(value);console.log(cArr[key]); this.getCountyArr(value);}
          
                      }>
                      {cityArr}
                    </Picker>
                  </View>
                </View> 

                <View style={styles.item}>
                  <Text style={styles.title}>县/区 : </Text>
                  <View  style={styles.itemInput}>
                    <Picker
                      mode={'dropdown'}
                      style={styles.picker}
                      selectedValue={this.state.countyCode}
                      onValueChange={(value,key) => {
                        this.setState({countyCode:value,countyValue: tArr[key]});console.log(value);console.log(tArr[key]);}
          
                      }>
                      {countyArr}
                    </Picker>
                  </View>
                </View> 

                <View style={styles.item}>
                  <Text style={styles.title}>*详细地址：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入详细地址'}
                    value={this.state.address}
                    onChangeText={(e)=>{this.setState({address:e})}}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>备注信息：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入备注信息'}
                    value={this.state.remark}
                    onChangeText={(e)=>{this.setState({remark:e})}}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    console.log('000')
                    this.submit();
                  }}>
                  <Text
                    style={{
                      color:'white',
                      textAlign:'center',
                    }}
                  >提交完成报名</Text>
                </TouchableOpacity>
              </Provider>
            </View>
            <View>
            </View>
          </View>
          </ScrollView>
          <View
            style={{flexDirection:'row',height:40,borderColor: '#bbb',borderWidth: 0.5,borderRadius:5}}>
            <TouchableOpacity
              style={{flex:1}}
              onPress={() => {
                this.setState({waiter:true});
                this.forceUpdate();
              }}>
              <Text
                style={{
                  textAlign:'center',
                  paddingTop:10,
                }}
              >联系客服</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex:1}}
              onPress={() => {
                this.myScrollView.scrollTo({ y: 1000, x: 0, animated: true});
              }}>
              <Text
                style={styles.signUp}
              >立即报名</Text>
            </TouchableOpacity>
          </View>
          {
            waiter ===true ?
              <View
                style={styles.buttom}>
                <View style={styles.waiter}>
                  <Image
                    style={styles.Img}
                    resizeMode ={'stretch'}
                    source={require('../../images/imgA16/code.png')}
                  />
                </View>
                <TouchableOpacity
                  style={styles.cha}
                  onPress={() => {
                    this.setState({waiter:false});
                    this.forceUpdate();
                  }}
                >
                  <Image
                    style={styles.chaImg}
                    resizeMode ={'stretch'}
                    source={require('../../images/imgA16/cha.png')}
                  />
                </TouchableOpacity>
              </View>:
              null
          }


        </View>


    );
  }
}
const styles = StyleSheet.create({
  item:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height:50,
    padding: 5,
    marginRight:50,
  },
  imgItem:{
    width:'100%',
    height:300,
    marginBottom:2,
  },
  Img:{
    height:"100%",
    width: '100%',
  },
  num:{
    flexDirection:'row',
  },
  input:{
    width:40,
    marginTop:-15,
  },
  list:{
    width:'100%',
    marginTop:20,
  },
  title:{
    paddingTop:10,
  },
  itemInput:{
    width:'70%',
    marginTop: 0,
    borderColor:'#bbb',
    borderWidth:0.5,
    borderRadius: 5,
    height:40,
    marginRight: 30,
  },
  button:{
    backgroundColor: '#FF7A01',
    color:'#FF7A01',
    textAlign:'center',
    borderRadius:5,
    width: '100%',
    fontSize:10,
    padding: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  signUp:{
    textAlign:'center',
    backgroundColor:'#FF7A01',
    color:'#fff',
    flex:1,
    paddingTop: 10,
  },
  waiter:{
    position:'absolute',
    height:300,
    width:'75%',
    top:80,
    left:50,
  },
  cha:{
    position:'absolute',
    height:50,
    width:'75%',
    top:370,
    left:50,
    alignItems:'center',
  },
  chaImg:{
    height:'100%',
    width:'20%',
  },
  buttom:{
    height:'110%',
    width:'110%',
    position:'absolute',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
  },
  video:{
    width:'100%',
    height:250,
  }
})
