import React from 'react';
import {View, Text, Button, AsyncStorage,Image,StyleSheet,ScrollView,ImageBackground,TouchableOpacity,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
const {height,width} =  Dimensions.get('window');
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      eid:'',
      model:'',
      LoginInfoL:'',
      filterElement: [],
      filterStatus:0,//滤芯是否过期，0为正常状态，1为过期状态
      expiredFilter:[],
      expiredFilterId:[],
      buttonType:0,//1为有滤芯单，0为无滤芯单
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '状态',
    };
  };

  // render创建之前
  componentWillMount() {
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let eid = this.props.navigation.getParam('eid');
    let model = this.props.navigation.getParam('model');
    this.setState({eid,model})
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({LoginInfo: LoginInfo});
      //获取设备信息
      let urlInfo = `${url}/equipments/${eid}?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if(info.status){
            this.setState({info: info.data[0]});
          }
        })
      })
     // 获取滤芯使用情况
     let urlInfo2 = `${url}/filter_element/?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo2).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if(info.status){
            this.setState({filterElement: info.data});
          }
        })
      })
      //定义按钮
      let urlInfo3 = `${url}/orders/?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo3).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if(info.status){
            info.data.map(item => {
              if (item.state === 4 && item.type === 2) {
                this.setState({buttonType: 1})
              }
            });
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
    // 验证/读取 登陆状态
    setTimeout(() => {
      this._checkLoginState();
    }, 1000);
    this.times = setInterval(() => {
      this._checkLoginState();
    }, 5000);
    setTimeout(() => {
      this.isExpiredOfFilters();
    }, 1100);
  }

 // render销毁前
 componentWillUnmount() {
  clearInterval(this.times);
}

  // 判断滤芯是否过期
  isExpiredOfFilters() {
    const {filterElement} = this.state;
    // 过期滤芯数组
    const expiredFilter = [];
    // 过期滤芯id数组
    const expiredFilterId = [];
    filterElement.map(item => {
      if (item.state === 1) {
        if (item.eptags === 'DCL09') {
          if (item.used > 720) {
            expiredFilter.push(item.eptags);
            expiredFilterId.push(item.uuid);
            this.setState({filterStatus:1,expiredFilter:expiredFilter,expiredFilterId:expiredFilterId});
          }
        } else {
          if (item.used > 180) {
            expiredFilter.push(item.eptags);
            expiredFilterId.push(item.uuid);
            this.setState({filterStatus:1,expiredFilter:expiredFilter,expiredFilterId:expiredFilterId});
          }
        }
      }
    });
  }

  render() {
    const {eid,info,model,filterElement} = this.state;
    let otds = '00'.split('');

    if (info.online_at && !info.offline_at) {
      if (info.status) {
        const _status = JSON.parse(info.status);
        otds = _status.otds.toString().length < 2 ? (`0${_status.otds}`).split('') : _status.otds.toString().split('');
      }    
    } else {
      otds = [0, 0];
    }

    let PPC_used = 0;
    let CPP_used = 0;
    let RO_used = 0;
    filterElement.sort((last, next) => next.used - last.used);
    filterElement.forEach(item => {
      if (item.eptags === 'DCL01') {PPC_used = item.used;};
      if (item.eptags === 'DCL02') {CPP_used = item.used;};
      if (item.eptags === 'DCL09') {RO_used = item.used;};
    });

    const status = [
      {
        name: 'PPF复合PP棉滤芯',
        tags: 'DCL01',
        day: Math.floor(180 - PPC_used) < 0 ? 0 : Math.floor(180 - PPC_used),
        percen: Math.floor((180 - PPC_used) / 180 * 100) || 0,
        isDay: Math.floor(180 - PPC_used),
      }, {
        name: 'CPP复合活性炭滤芯',
        tags: 'DCL02',
        day: Math.floor(180 - CPP_used) < 0 ? 0 : Math.floor(180 - CPP_used),
        percen: Math.floor((180 - CPP_used) / 180 * 100) || 0,
        isDay: Math.floor(180 - CPP_used),
      }, {
        name: 'RO反渗透滤芯',
        tags: 'DCL09',
        day: Math.floor(720 - RO_used) < 0 ? 0 : Math.floor(720 - RO_used),
        percen: Math.floor((720 - RO_used) / 720 * 100) || 0,
        isDay: Math.floor(720 - RO_used),
      },
    ];
    return (   
        <ScrollView style={{flex: 1}}>    
          <ImageBackground
            style={styles.ImageBackground }
            source={require('../../images/dev_backgroud.png')}>
                <ImageBackground
                  style={styles.ImageBackground }
                  source={require('../../images/device_bg2.png')}>
                    <View style={styles.top}>
                      <Text style={{color:'#fff',textAlign:'center',padding:10,fontSize:20}}>滤芯使用状态</Text>
                    </View>
                    <TouchableOpacity
                     style={styles.home}
                      onPress={()=> this.props.navigation.navigate('Home')}>
                      <Icon  name="home" size={25} color={'#fff'} />
                    </TouchableOpacity>  
                    <View style={styles.bg3}>
                      <View style={{flexDirection:'row'}}> 
                        {otds.map((val, key) =>{
                          return (
                            <Image
                            source={val==='0' ? require('../../images/Num/zero.png') :
                            val==='1' ? require('../../images/Num/one.png'):
                            val==='2' ? require('../../images/Num/two.png'):
                            val==='3' ? require('../../images/Num/three.png'):
                            val==='4' ? require('../../images/Num/four.png'):
                            val==='5' ? require('../../images/Num/five.png'):
                            val==='6' ? require('../../images/Num/six.png'):
                            val==='7' ? require('../../images/Num/seven.png'):
                            val==='8' ? require('../../images/Num/eight.png'):require('../../images/Num/nine.png')
                              }
                              key={key} 
                              style={styles.tdsImg}
                            />)}
                        )}
                        <Text style={{color:'#fff',marginTop:60}}>TDS</Text>
                      </View>                                           
                     </View>
                   <View style={styles.content}>
                     <View style={styles.statusTitle}>
                       <Text style={{color:'#5feaff'}}>滤芯状态： </Text>    
                       <Text style={{color:'#fff'}}>良好</Text>        
                     </View>
                     {status.map((item,key)=>{
                        return(
                          <View style={styles.statusTitle} key={key}>
                            <Text style={styles.statusNum}>{key+1}</Text>
                            <View>
                              <Text style={{color:'#5feaff'}}>{item.name}</Text>
                              <View style={{flexDirection:'row'}}>
                                <Text style={styles.statusPer}>已使用{!item.isDay ? 0 : (100 - item.percen > 100 ? 100 : 100 - item.percen)}%</Text>
                                <Text style={styles.statusDay}>预计剩余天数{item.day || 0}天</Text>
                              </View>
                            </View>
                          </View>
                        ) 
                      })}
                   </View>
                   <View style={{padding:20,alignItems:'center',width:'100%'}}>
                   <TouchableOpacity
                      style={styles.button}
                      onPress={()=>{this.props.navigation.navigate('MyShop')}}
                   >
                      <Text style={{color:'#fff',textAlign:'center'}}>购买滤芯</Text>
                   </TouchableOpacity>
                   </View>
                </ImageBackground>        
          </ImageBackground>
        </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    height:height/15,
    marginBottom:20,
    borderBottomColor:'#fff',
    borderBottomWidth:1,
    width:'100%',
  },
  home:{
    position:'absolute',
    top:height/70,
    left:10,
  },
  ImageBackground:{
    flex:1,
    width:'100%',
    height:height-70,
    alignItems:'center',
  },
  bg3:{
    alignItems:'center',
    width:'100%',
    height:100,
    paddingTop:10,
  },
  tdsImg:{
    height:80,
    width:40,
  },
  content:{
    padding:10,
    width:'100%',
  },
  statusTitle:{
    flexDirection:'row', 
    borderBottomColor:'#fff',
    borderBottomWidth:0.5,
    width:'100%',
    paddingBottom:20,
    paddingTop:20,
    alignItems: 'center',
  },
  statusNum:{
    backgroundColor:'#fff',
    color:'#00C8ED',
    borderRadius:50,
    width:20,
    height:20,
    textAlign:'center',
    marginRight:10,
  },
  statusPer:{
    color:'#fff',
    marginRight:10,
  },
  statusDay:{
    color:'#fff',
    paddingLeft:10,
    borderLeftWidth:0.5,
    borderColor:'#fff',
  },
  button:{
    backgroundColor:'#FF7701',
    padding:5,
    width:'60%',
  }
})