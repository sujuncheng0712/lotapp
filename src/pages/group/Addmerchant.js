import React from 'react';
import {View, Text, AsyncStorage, ScrollView, StyleSheet,Picker} from 'react-native';
import * as wechat from 'react-native-wechat';
import { T } from 'antd/lib/upload/utils';
const url = 'https://iot2.dochen.cn/api';
let that = '';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:'',
      merchantsInfo: {},
      lists: [],
      data: [],//产品表
      type: 0, // 0超管 1运营 2代理 3经销
      mobile: '',
      products: [],
      area: '',
      commission_rate: '',
      contact: '',
      organization: '',
      sale_type: '',
      password: '',
      sid: '',
      type2: '',
      pledge: '',
      deposit: '',
      contract: '',
      username: '',

      provinceValue: '', //省
      cityValue: '',     //市
      countyValue: '',   //区
      provinceCode: '',
      cityCode:'',

      isProDisabled:false,  //session.province不为空 禁用
      isCityDisabled:false  //session.city不为空 禁用
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '添加商家',
    };
  };

  // render创建之前
  componentWillMount() {
    that = this;
    // 验证/读取 登陆状态
    this._checkLoginState();
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({LoginInfo})
          // 获取商家信息
        let urlInfo = `${url}/merchants?sale_type=${LoginInfo.sale_type}`;
        urlInfo += LoginInfo.mid ? `&mid=${LoginInfo.mid}` : '';
        fetch(urlInfo).then(res => {
          if (res.ok) {
            res.json().then(info => {
              //console.log(info);
              console.log(info)
              if (info.status) {
                info.data.forEach((val, key) => {
                  // 获取第一条数据的type 是代理还是经销
                  if (key === 0) {
                    //  如果没有mid 是超管
                    if (urlInfo.indexOf("mid") !== -1) {
                      this.setState({type: val.type});
                    }
                  }
                });
                this.setState({merchantsInfo: info.data[0]})
              }
            });
          }
        });
    //获取产品列表
    const urlInfo2 = `${url}/products?sale_type=${LoginInfo.sale_type}`;
    let data = [];
    fetch(urlInfo2).then(res => {
      res.json().then(info => {
        console.log(info);
        if (info.status) {
          info.data.forEach(item => {
            if (item.state !== 0 && item.type === 3) {
              item.equiptags = item.tags;
              item.allowanceTitle = `${item.tags}`;
              item.commissionTitle = `${item.tags}`;
              data.push(item);
            }
          });
          this.setState({data});
        }
      })
    })

    if(LoginInfo.type===1 || LoginInfo.type===5 || LoginInfo.type===9 || LoginInfo.type===13){

    }else{
      
     }
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    const {merchantsInfo, lists, area, type, mobile, sid, data,
      cityArr, countyArr,LoginInfo} = this.state;
      const merchantsList = [];
      const isVendor = LoginInfo.type === '0';
      const isMer01 = LoginInfo.type === 1 || LoginInfo.type === 5 || LoginInfo.type === 9 || LoginInfo.type === 13;
      const isMer02 = LoginInfo.type === 2 || LoginInfo.type === 6 || LoginInfo.type === 10 || LoginInfo.type === 14;
      const isMer03 = LoginInfo.type === 3 || LoginInfo.type === 7 || LoginInfo.type === 11 || LoginInfo.type === 15;
      let showLevelList = <Picker.Item label={''} value={'-1'}/>;
      if(isVendor){
        const levelArr = [{value:'-1',label:''},{value:'1',label:'品牌商'},{value:'2',label:'运营商'},{value:'3',label:'代理商'},{value:'4',label:'经销商'}];
        showLevelList = levelArr.map((item,key)=>{
          return(
            <Picker.Item key={key} label={item.label} value={item.value }/>
          )
        })
      }  else if(isMer01){
        const levelArr2 = [{value:'-1',label:''},{value:'2',label:'运营商'},{value:'3',label:'代理商',key:2},{value:'4',label:'经销商'}];
        showLevelList = levelArr2.map((item,key)=>{
          if(item.key>0){
            return(
              <Picker.Item key={key} label={item.label} value={item.value }/>
            )
          }
        })
      } else  if(isMer02){
        const levelArr3 = [{value:'-1',label:''},{value:'3',label:'代理商',key:2},{value:'4',label:'经销商'}];
        showLevelList = levelArr3.map((item,key)=>{
            return(
              <Picker.Item key={key} label={item.label} value={item.value }/>
            )
          
        })
      } else  if(isMer03){
        showLevelList = levelArr.map((item,key)=>{
          if(item.key>2){
            return(
              <Picker.Item key={key} label={'经销商'} value={'4' }/>
            )
          }else{
            return false;
          }
        })
      }
    return (
      <ScrollView>
        <View style={{flex: 1,padding:10}}>
          <Text style={styles.top}>请填写以下信息:</Text>
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>账号类型：</Text>
            </View>
          
             <View  style={styles.itemInput}>
                <Picker
                  mode={'dropdown'}
                  style={styles.picker}
                  selectedValue={that.state.type2}
                  onValueChange={(value,key) => {
                    that.setState({type2: value});}
                  }>
                    {showLevelList}
                </Picker>
            </View>
          </View>
        </View>
      </ScrollView>
      
    );
  }
}
const styles = StyleSheet.create({
  top:{
    borderBottomWidth:0.5,
    borderColor:'#bbb',
    paddingTop:10,
    paddingBottom:10,
  },
  item:{
    flexDirection:'row',
    width:'100%',
  },
  itemTitle:{
    width:'30%',
    textAlign:'right',
    alignItems:'center',
    justifyContent:'center'
  },
  picker:{
    
  },
  itemInput:{
    width:'70%',
    borderColor:'#bbb',
    borderWidth:0.5,
    borderRadius: 5,
    marginRight: 30,
  }
})
