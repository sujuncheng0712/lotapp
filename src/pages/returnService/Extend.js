import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, AsyncStorage, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import { PickerView,Picker,Provider } from '@ant-design/react-native';
import * as wechat from 'react-native-wechat';
import address1 from '../../../service/address';
import district from 'antd-mobile-demo-data';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.onPress = () => {
      setTimeout(() => {
        this.setState({
          data: district,
        });
      }, 500);
    };
    this.onChange = value => {
      this.setState({ area:value });
    };
    this.state = {
      type : '',
      state:'',
      play:false,
      number:1,
      provinceCode:'',
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
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '我要报名',
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
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({ LoginInfo});
      let urlInfo  =`${url}/userShareSuccess?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;


    } else {
      this.props.navigation.navigate('Login');
    }
  };

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

  render() {
    const {state,type,number,area} = this.state;
    console.log(number);
    return (


        <View style={{flex:1,padding:10}}>
          <ScrollView style={{height:1000}}>
          <Text style={{padding:10,textAlign:'center',fontWeight:'bold'}}>
            DGK{type ==='物联水机A20' ? '':'移动水吧A16' }，半价优惠活动
          </Text>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
            source={require('../../images/imgA20/A_01.jpg')}
            />
          </View>

          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/A_02.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/A_03.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/A_04.jpg')}
            />
          </View>


          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/B_01.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/B_02.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/B_03.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/B_04.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/B_05.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/B_06.jpg')}
            />
          </View>
          <View style={styles.item}>
            <Image
              style={styles.Img}
              resizeMode ={'stretch'}
              source={require('../../images/imgA20/B_07.jpg')}
            />
          </View>
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
            <View style={styles.list}>
              <Provider>
                <View style={styles.item}>
                  <Text style={styles.title}>联系人：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入联系人'}
                    onChangeText={(e)=>{this.setState({name:e});console.log(e)}}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>联系电话：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入联系电话'}
                    onChangeText={(e)=>{this.setState({phone:e})}}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>地区：</Text>
                  <View style={styles.itemInput}  onPress={this.onPress}>
                    <Picker
                      data={address1}
                      cols={3}
                      value={this.state.area}
                      placeholder={'请选择地区'}
                      onChange={this.onChange}
                    >
                      <Text style={{height:'100%',paddingTop: 10}}>
                        {area}
                      </Text>
                    </Picker>
                  </View>
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>详细地址：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入详细地址'}
                    onChangeText={(e)=>{this.setState({address:e})}}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>备注信息：</Text>
                  <TextInput
                    style={styles.itemInput}
                    placeholder={'请输入备注信息'}
                    onChangeText={(e)=>{this.setState({remark:e})}}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.signUp();
                  }}>
                  <Text
                    style={{
                      color:'white',
                      textAlign:'center',
                    }}
                  >确 认</Text>
                </TouchableOpacity>
              </Provider>
            </View>

            <View>

            </View>
          </View>
          </ScrollView>
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
  item2:{
    width:'100%',
    height:300,
    marginBottom:2,
    borderColor:'blue',
    borderWidth:1,
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
    borderColor:'#FF7A01',
    borderWidth:0.5,
    color:'#FF7A01',
    textAlign:'center',
    borderRadius:5,
    width: '100%',
    fontSize:10,
    padding: 5,
    marginTop: 10,
  },
})
