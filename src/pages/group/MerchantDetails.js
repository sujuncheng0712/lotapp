import React from 'react';
import {View, Text, ScrollView, AsyncStorage,TouchableOpacity,StyleSheet,FlatList,TextInput,Picker,ToastAndroid,Modal,Dimensions} from 'react-native';
const url = 'https://iot2.dochen.cn/api';
const merchant_type = ['品牌商', '运营商', '代理商', '经销商'];
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:{},
      subscriptionList:[],
      info:{},
      productsLists:[],
      visibleSubscription: false,
      visibleProducts: false,
      val:{},
      allowanceLists:[],
      editingKey:'',
      data:[],
      disabled:false,
      area:'',
      organization:'',
      contact:'',
      mid:'',
      type2:'1',
      change:false,
      key:'',
      allowance:'',
      commission:'',
      equiptags:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '商家详情',
    };
  };

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    LoginInfo = LoginInfo[0];

    if (LoginInfo !== null) {
      let mid = this.props.navigation.getParam('mid');
      //let mid = '22d6bde6cc9611e9b4ea00163e0e26fc';
      this.setState({LoginInfo,mid});
      this.getMerchantDetails(LoginInfo,mid);
      this.getSubscriptionList(LoginInfo,mid);
      this.getProducts(LoginInfo);
      this.getAllowance(LoginInfo,mid);
      this.getList(LoginInfo,mid)
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  //获取商家详情
  getMerchantDetails(LoginInfo,mid) {
    fetch(`${url}/merchants/${mid}?sale_type=${LoginInfo.sale_type}`).then(res=>{
      if(res.ok){
        res.json().then(data=>{
          //console.log(data)
          this.setState({
            info:data.data[0],
            organization:data.data[0].organization,
            contact:data.data[0].contact,
            area:data.data[0].area.split('/')
          });
        })
      }
    });
  }

  // 获取签约信息列表
  getSubscriptionList(LoginInfo,mid) {
    fetch(`${url}/merchants/${mid}/subscription?sale_type=${LoginInfo.sale_type}`).then(res => {
      if (res.ok) {
        res.json().then(info => {
         // console.log(info)
          if (info.status) {
            let lists = [];
            info.data.forEach((val,i) => {
              val.id = i+1;
              lists.push(val);
            });
            this.setState({ subscriptionList: lists })
          }
        });
      }
    });
  }

   // 获取产品列表
   getProducts(LoginInfo) {
    fetch(`${url}/products?sale_type=${LoginInfo.sale_type}`).then(res => {
      if (res.ok) {
        res.json().then(info => {
          if (info.status) {
           // console.log(info)
            const lists = [];
            /*info.data.forEach((val, key) => {
              val.allowance = '0';
              val.commission = '0';
              val.edit = false;
              val.editType = 'POST';
              val.key = key;
              lists.push(val);
            });*/
            info.data.forEach((val,i) => {
              if (val.state === 1 && val.type !== 8) {
                val.id = i+1;
                lists.push(val);
              }
            });
            this.setState({ productsLists: lists });
          }
        });
      }
    });
  }

   // 获取收益分配
   getAllowance(LoginInfo,mid) {
    fetch(`${url}/merchants/${mid}/allowance?sale_type=${LoginInfo.sale_type}`).then(res => {
      if (res.ok) {
        res.json().then(info => {
          console.log(info)
          if (info.status) this.setState({ allowanceLists: info.data });
        });
      }
    });
  }

  
  getList(LoginInfo,mid){
    let urlInfo = `${url}/merchantAllowance?mid=${mid}&sale_type=${LoginInfo.sale_type}`;
    fetch(urlInfo).then(res =>{
      res.json().then(info =>{
        if (info.status){
          console.log(info)
          let data = [];
          info.al_datas.forEach((item,i)=>{
            item.key = i;
            data.push(item);
          });
          this.setState({data:data})
        }
      })
    })
  }

  componentDidMount() {
    
    this._checkLoginState();
  }

  submit(){
    const { area, organization, contact, LoginInfo, disabled,mid} = this.state;
    fetch(`${url}/merchantAllowance`,{
      method:'PUT',
      body:JSON.stringify({
        organization,
        contact,
        area:area.join('/'),
        mid,
        type:'base',
        sale_type:LoginInfo.sale_type,
      })
    }).then(res=>{
      if(res.ok){
        res.json().then(info=>{
          console.log(info);
          if(info.status){
            this.setState({disabled:!disabled});
            ToastAndroid.show('修改成功', ToastAndroid.SHORT);
          }else{
            ToastAndroid.show('修改失败', ToastAndroid.SHORT);
          }
        })
      }
    });
  }

  //控制对话框显示隐藏
  showModal = (num,record) => {
    //1签约时间 2产品收益
    if(num === 1) this.setState({visibleSubscription: true, val:record });
    else if(num === 2) this.setState({visibleProducts: true, record:record});
  };
  hideModal = (num) => {
    if(num === 1) this.setState({visibleSubscription: false,});
    else if(num === 2) this.setState({visibleProducts: false,});
  };

  updateList(key){
    const {allowance,commission,LoginInfo,mid,equiptags} = this.state;
   
    let urlInfo = `${url}/merchantAllowance`;
    fetch(urlInfo,{
      method:'PUT',
      body:JSON.stringify({
        mid:mid,
        equiptags:equiptags,
        sale_type:LoginInfo.sale_type,
        commission:parseInt(commission),
        allowance:parseInt(allowance),
      })
    }).then(res =>{
      res.json().then(info =>{
        console.log(info);
        if (info.status){
          this.getList(LoginInfo,mid);
          ToastAndroid.show('修改成功', ToastAndroid.SHORT);
          this.setState({data});
        }else{
          if(info.code === 10003){
          ToastAndroid.show('你的该型号还没有收益配置，请先联系上级代理为你配置该型号的收益。', ToastAndroid.SHORT);
          }else if(info.code === 9005){
            ToastAndroid.show('返点或补贴错误，请在个人中心检查确认', ToastAndroid.SHORT);
          }
        }
      })
    })

    

  }

  render() {
    const { subscriptionList, productsLists, info, val, allowanceLists, disabled, area,
      organization, contact, LoginInfo,mid,data,change,key} = this.state;
      let newarea = area ? area : info.area ? info.area.split('/') : [];
      let sada = newarea.toString();
      const separator = () =>  {
        return (
          <View style={styles.separator}></View>
        )
      };

    return (
      <ScrollView style={{flex: 1,padding:10,backgroundColor:'#F0F2F5',}}>
       <View style={styles.one}>
        <Text style={styles.oneTitle}>基本信息</Text>
        <View style={styles.oneContent}>
          <View style={styles.oneItem}>
            <Text style={styles.oneItemTitle}>单位名称：</Text>   
            <TextInput 
              style={{...styles.input,backgroundColor:!disabled ? '#F0F2F5' : 'white'}}
              value={organization} 
              editable={disabled}
              onChangeText={(e)=>{this.setState({organization:e})}}
              />
          </View>
          <View style={styles.oneItem}>
            <Text style={styles.oneItemTitle}>所属区域：</Text>   
            <Picker
                  mode={'dropdown'}
                  style={{...styles.input,backgroundColor:'white'}}
                  selectedValue={this.state.type2}
                  onValueChange={(value,key) => {}}>
                    <Picker.Item key={1} label={sada} value={'1'}/>
                </Picker>
          </View>
          <View style={styles.oneItem}>
            <Text style={styles.oneItemTitle}>联系人：</Text>   
            <TextInput 
              style={{...styles.input,backgroundColor:!disabled ? '#F0F2F5' : 'white'}}
              value={contact} 
              editable={disabled}
              onChangeText={(e)=>{this.setState({contact:e})}}
              />
          </View>
          <View style={styles.oneItem}>
            <Text style={styles.oneItemTitle}>推荐码：</Text>   
            <View  style={{...styles.input,borderWidth:0,backgroundColor:'white'}}>
             <Text  style={{ fontSize:17,}}>{info.mobile}</Text>
            </View>
           
          </View>
          <View style={styles.oneItem}>
            <Text style={styles.oneItemTitle}>商家：</Text>   
            <View style={{...styles.input,borderWidth:0,backgroundColor:'white'}}>
             <Text style={{ fontSize:17,}}>{merchant_type[info.type-1]}</Text>
            </View>  
          </View>

          <View style={{width:'100%',alignItems:'flex-end',flexDirection:'row',justifyContent:'flex-end'}}>

            {
              disabled ? null
              :  
              <TouchableOpacity
                style={styles.oneButton}
                onPress={() => {
                  this.setState({disabled:!disabled})
                }}>
                <Text
                  style={{
                    textAlign:'center',
                  }}
                >修改信息</Text>
            </TouchableOpacity>
            }
            {
               disabled ? 
               <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                  <TouchableOpacity
                     style={{...styles.oneButton,backgroundColor:'#FF7701',borderColor:'#FF7701'}}
                    onPress={() => {
                      this.setState({disabled:!disabled});
                      this.getMerchantDetails(LoginInfo,mid);
                    }}>
                    <Text
                      style={{
                        textAlign:'center',color:'white'
                      }}
                    >取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{...styles.oneButton,backgroundColor:'#FF7701',borderColor:'#FF7701',marginLeft:30}}
                    onPress={() => {
                      this.submit();                      
                    }}>
                    <Text
                      style={{
                        textAlign:'center',color:'white'
                      }}
                    >提交</Text>
                </TouchableOpacity>
               </View> :null  
            }
              
            </View>
        </View>
       </View>

       <View style={{...styles.one,marginBottom:2,}}>
        <Text style={styles.oneTitle}>签约时间</Text>
        <View style={{...styles.oneContent,flexDirection:'row',justifyContent:'center'}}>
          <Text style={{...styles.twoTitle,width:'40%'}}>起始时间</Text>
          <Text style={{...styles.twoTitle,width:'30%'}}>合同编号</Text>
          <Text style={{...styles.twoTitle,width:'30%'}}>操作</Text>
        </View>
          <FlatList
            data={subscriptionList}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={separator}
            renderItem={({item,i}) =>
            <View key={i} style={{...styles.oneContent,flexDirection:'row',justifyContent:'center',marginBottom:2}}>
              <Text style={{...styles.twoTitle,width:'40%'}}>{item.begin_at}</Text>
              <Text style={{...styles.twoTitle,width:'30%'}}>{item.contract}</Text>
              <TouchableOpacity
                  style={{...styles.twoButton,width:'30%'}}
                  onPress={() => {
                    this.showModal(1,item);
                  }}>
                  <Text
                    style={{
                      textAlign:'center',color:'white'
                    }}
                  >更多信息</Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.visibleSubscription}
                onRequestClose={() => {
                  alert("Modal has been closed.");
                }}
              >
                <View style={{height:Dimensions.get('window').height, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                  <View style={{height:180,  width:300, margin:20, backgroundColor:'white'}}>
                    <View style={{flex:1, borderWidth:1, borderColor:'#eee'}}>
                      <Text style={styles.modalTitle}>签约信息详情</Text>
                      <View style={styles.oneItem}>
                        <Text style={styles.twoItemTitle}>押金(元)：</Text>
                        <Text style={styles.twoInput}>¥ {val.deposit}</Text>
                      </View>
                      <View style={{...styles.oneItem,marginTop:10}}>
                        <Text style={styles.twoItemTitle}>保证金(元)：</Text>
                        <Text style={styles.twoInput}>¥ {val.pledge}</Text>
                      </View>
                      <View style={styles.twoButtonStyle}>
                        <TouchableOpacity
                          style={{...styles.twoButton,width:'25%'}}
                          onPress={() => {
                            this.hideModal(1);
                          }}>
                          <Text
                            style={{
                              textAlign:'center',color:'white'
                            }}
                          >确 定</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
            </Modal>
          </View>
            }
        />   
        
       </View> 

       <View style={{...styles.one,marginBottom:50}}>
        <Text style={styles.oneTitle}>产品收益/返点</Text>
        <View style={{...styles.oneContent,display:'flex',flexDirection:'row',justifyContent:'center'}}>
          <Text style={{...styles.twoTitle}}>型号</Text>
          <Text style={{...styles.twoTitle}}>补贴</Text>
          <Text style={{...styles.twoTitle}}>返点</Text>
          <Text style={{...styles.twoTitle}}>操作</Text>
        </View>
        <FlatList
          style={{flex:1}}
          data={data}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={separator}
          renderItem={({item,i}) =>
            <View  key={i} style={{...styles.oneContent,flexDirection:'row',justifyContent:'center'}}>
              <Text style={styles.twoTitle}>{item.equiptags}</Text>
              {item.key ===key && change ? 
                <TextInput 
                   style={{...styles.twoTitle,borderColor:'#666',borderWidth:0.5,marginRight:2}}
                   defaultValue={item.allowance}
                   onChangeText={(e)=>{this.setState({allowance:e})}}
                /> :
                <Text style={styles.twoTitle}>{item.allowance}</Text>
              }
             {
               item.key ===key && change ? 
               <TextInput 
                 defaultValue={item.allowance}
                 style={{...styles.twoTitle,borderColor:'#666',borderWidth:0.5,marginRight:2}}
                 onChangeText={(e)=>{this.setState({commission:e})}}
             /> :
              <Text style={styles.twoTitle}>{item.commission}</Text>
             }
              
              <View style={styles.twoTitle}>
                {item.key ===key && change ? 
                <View>
                    <TouchableOpacity
                      style={{...styles.threeBotton,backgroundColor:'#FF7701',borderColor:'#FF7701'}}
                      onPress={() => {
                        this.setState({change:false});
                        this.updateList(key);
                      }}>
                      <Text
                        style={{
                          textAlign:'center',fontSize:12,color:'white'
                        }}
                      >确认</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{...styles.threeBotton,backgroundColor:'#FF7701',borderColor:'#FF7701',marginTop:5}}
                    onPress={() => {
                      this.setState({change:false})
                    }}>
                    <Text
                      style={{
                        textAlign:'center',fontSize:12,color:'white'
                      }}
                    >取消</Text>
                  </TouchableOpacity>
                </View> :
                <TouchableOpacity
                  style={styles.threeBotton}
                  onPress={() => {
                    this.setState({change:true,key:item.key,allowance:item.allowance,commission:item.commission,equiptags:item.equiptags})
                  }}>
                  <Text
                    style={{
                      textAlign:'center',fontSize:12,
                    }}
                  >修改</Text>
                </TouchableOpacity>
                }
                
              </View>
            </View>
              }
            />
       </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  one:{
    backgroundColor:'white',
    marginTop:5,
  },
  oneTitle:{
    padding:15,
    fontSize:17,
  },
  oneContent:{
    borderTopColor:'#F0F2F5',
    borderTopWidth:1,
    padding:10,
  },
  oneItem:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
   
  },
  input:{
    borderColor:'#666',
    borderWidth:0.5,
    width:'60%',
    borderRadius:5,
    fontSize:17,
    height:45,
    alignItems:'flex-start',
    justifyContent:'center',
  },
  oneItemTitle:{
    width:'40%',
    textAlign:'right',
    fontSize:17,
  },
  oneButton:{
    borderColor:'#666',
    borderWidth:0.5,
    padding:5,
    borderRadius:5,
    width:'35%',
  },
  twoButton:{
    borderColor:'#666',
    borderWidth:0.5,
    padding:5,
    borderRadius:5,
    backgroundColor:'#FF7701',
    borderColor:'#FF7701'
  },
  twoTitle:{
    textAlign:'center',
    width:'25%',
  },
  modalTitle:{
    textAlign:'left',
    padding:10,
    borderColor:'#666',
    borderBottomWidth:0.5,
    marginBottom:20,
  },
  twoItemTitle:{
    width:'40%',
    textAlign:'right',
  },
  twoInput:{
    width:'60%',
    textAlign:'left',
  },
  twoButtonStyle:{
    width:'100%',
    alignItems:'flex-end',
    padding:10,
    marginTop:20,
    borderColor:'#666',
    borderTopWidth:0.5,
  },
  threeBotton:{
    borderWidth:0.5,
    borderColor:'#666',
    padding:5,
    borderRadius:5,
  }
})