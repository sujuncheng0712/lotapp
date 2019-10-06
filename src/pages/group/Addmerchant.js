import React from 'react';
import {View, Text, AsyncStorage, ScrollView, StyleSheet,Picker,TextInput,TouchableOpacity,ToastAndroid} from 'react-native';
import { T } from 'antd/lib/upload/utils';
import Area from '../../../service/Area';
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

  //处理返点
  handleCommission(value, pid) {
    this.state.data.forEach(item => {
      if (item.pid === pid) {
        if (item.type === 3) {
          item.commission = value;
        }
      }
    })
  }

  //处理补贴
  handleAllowance(value, pid) {
    this.state.data.forEach(item => {
      if (item.pid === pid) {
        if (item.type === 3) {
          item.allowance = value;
        }
      }
    })
  }

   //提交
   submit() {
    let {
      commission_rate, contact, organization, sid, type2, pledge, deposit,
      contract, username, data, provinceValue, cityValue, countyValue,LoginInfo
    } = this.state;
    let area = `${provinceValue}/${cityValue}/${countyValue}`;

    let a = true;
    data.forEach(item => {
      if (!(item.allowance > 0 && item.commission > 0)) {
        message.error('补贴和返点必须大于0');
        a = false;
        return false;
      }
    });
    if (a === false) {
      return false;
    }

    let postMerchants = `${url}/merchants`;
    fetch(postMerchants, {
      method: `POST`,
      body: JSON.stringify({
        products: data,
        area: area,
        commission_rate: commission_rate,
        contact: contact,
        organization: organization,
        sale_type: LoginInfo.sale_type,
        password: '0123456789',
        sid: LoginInfo.username,
        type2: parseInt(type2),
        pledge: pledge,
        deposit: deposit,
        contract: contract,
        username: username,
      }),
    }).then(res => {
      if (res.ok) {
        res.json().then(info => {
          console.log(info);
          if (info.status) {
            ToastAndroid.show('提交成功', ToastAndroid.SHORT);
            this.props.navigation.goBack(); 
          } else {
            if (info.code === 9005) {
              ToastAndroid.show('返点或补贴错误，请在个人中心检查确认', ToastAndroid.SHORT);
            } else if (info.code === 10006) {
              ToastAndroid.show('请输入完整，正确的参数', ToastAndroid.SHORT);
            }else if (info.code === 10004) {
              ToastAndroid.show('该商家已存在', ToastAndroid.SHORT);
            }
          }
        });
      }
    });
  }

  render() {
    const {merchantsInfo, lists, area, type, mobile, sid, data,
      cityArr, countyArr,LoginInfo} = this.state;
      const merchantsList = [];
      const isVendor = LoginInfo.type === '0';
      const isMer01 = LoginInfo.type === 1 || LoginInfo.type === 5 || LoginInfo.type === 9 || LoginInfo.type === 13;
      const isMer02 = LoginInfo.type === 2 || LoginInfo.type === 6 || LoginInfo.type === 10 || LoginInfo.type === 14;
      const isMer03 = LoginInfo.type === 3 || LoginInfo.type === 7 || LoginInfo.type === 11 || LoginInfo.type === 15;
      let showLevelList = <Picker.Item label={''} value={'-1'}/>;
      //客户类型处理
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
            return(
              <Picker.Item key={key} label={item.label} value={item.value }/>
            )
          
        })
      } else  if(isMer02){
        const levelArr3 = [{value:'-1',label:''},{value:'3',label:'代理商',key:2},{value:'4',label:'经销商'}];
        showLevelList = levelArr3.map((item,key)=>{
            return(
              <Picker.Item key={key} label={item.label} value={item.value }/>
            )
          
        })
      } else  if(isMer03){
        const levelArr4 = [{value:'-1',label:''},{value:'4',label:'经销商'}];
        showLevelList = levelArr4.map((item,key)=>{
            return(
              <Picker.Item key={key} label={'经销商'} value={'4' }/>
            )
        })
      }


      const showList = data.map((item,key )=> {
        if (LoginInfo.sale_type !== 3 && item.type === 3) {
          return (
           <View key={key}>
            <View style={styles.item}>
              <View style={styles.itemTitle}>
               <Text style={{width:'100%',textAlign:'right'}}>{item.allowanceTitle}：</Text>
              </View>
            
              <View  style={styles.itemInput}>
                  <TextInput 
                    placeholder={'请填写产品补贴金额'}
                    value={item.allowance}
                    onChangeText={(e)=>{const newText = e.replace(/[^\d]+/, '');this.handleAllowance(newText, item.pid)}}
                  />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.itemTitle}>
               <Text style={{width:'100%',textAlign:'right'}}>{item.commissionTitle}：</Text>
              </View>
            
              <View  style={styles.itemInput}>
                  <TextInput 
                    placeholder={'请填写滤芯返点比例'}
                    value={item.commission}
                    onChangeText={(e)=>{ const newText = e.replace(/[^\d]+/, ''); this.handleCommission(newText, item.pid)}}
                  />
              </View>
            </View>
           </View>
          )
        }
      });

    return (
      <ScrollView>
        <View style={{flex: 1,padding:10}}>
          <Text style={styles.top}>请填写以下信息:</Text>
          {/*账号类型*/}
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
          {/*单位名称*/}
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>单位名称：</Text>
            </View>
          
             <View  style={styles.itemInput}>
                <TextInput 
                  placeholder={'请输入单位名称'}
                  onChangeText={(e)=>{this.setState({organization:e})}}
                />
            </View>
          </View>
          {/*省*/}
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>所属省：</Text>
            </View>
          
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
          {/*市*/}
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>市：</Text>
            </View>
          
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
          {/*县/区*/}
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>县/区：</Text>
            </View>
          
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
          {/*联系人*/}
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>联系人：</Text>
            </View>
          
             <View  style={styles.itemInput}>
                <TextInput 
                  placeholder={'请输入联系人'}
                  onChangeText={(e)=>{this.setState({contact:e})}}
                />
            </View>
          </View>
          {/*手机*/}
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>手机：</Text>
            </View>
          
             <View  style={styles.itemInput}>
                <TextInput 
                  placeholder={'请输入手机号'}
                  value={this.state.username}
                  onChangeText={(e)=>{const newText = e.replace(/[^\d]+/, '');this.setState({username:newText})}}
                />
            </View>
          </View>

          {showList}

          {/*押金*/}
          <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>押金：</Text>
            </View>
          
             <View  style={styles.itemInput}>
                <TextInput 
                  placeholder={'押金必须是有效数字'}
                  onChangeText={(e)=>{const newText = e.replace(/[^\d]+/, '');this.setState({deposit:newText})}}
                />
            </View>
          </View>
          {!(LoginInfo.type === 5 && LoginInfo.sale_type !== '3')  ? null :
            //保证金
            <View style={styles.item}>
              <View style={styles.itemTitle}>
                <Text style={{width:'100%',textAlign:'right'}}>保证金：</Text>
              </View>
          
              <View  style={styles.itemInput}>
                <TextInput 
                  placeholder={'保证金必须是有效数字'}
                  onChangeText={(e)=>{const newText = e.replace(/[^\d]+/, '');this.setState({pledge:newText})}}
                />
            </View>
          </View>
        }

         {/*合同号*/}
         <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>合同号：</Text>
            </View>
          
             <View  style={styles.itemInput}>
                <TextInput 
                  placeholder={'请规范填写合同号'}
                  onChangeText={(e)=>{this.setState({contract:e})}}
                />
            </View>
          </View>

          {/*初始密码*/}
         <View style={styles.item}>
            <View style={styles.itemTitle}>
             <Text style={{width:'100%',textAlign:'right'}}>初始密码：</Text>
            </View>
          
             <View  style={styles.itemInput}>
                <TextInput 
                  editable={false}
                  defaultValue={'0123456789'}
                />
            </View>
          </View>

          <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.submit();
                  }}>
                  <Text
                    style={{
                      color:'white',
                      textAlign:'center',
                    }}
                  >提 交</Text>
                </TouchableOpacity>
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
    marginTop:5,
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
})
