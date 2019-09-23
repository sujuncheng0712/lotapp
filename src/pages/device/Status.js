import React from 'react';
import {View, Text, Button, AsyncStorage,Image,StyleSheet,ScrollView,ImageBackground,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      visible: false,
      visibleR: false,
      remarkC:'',
      remarkR:'',
      costR:'',
      eid:'',
      model:'',
      LoginInfoL:'',
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
   // let eid = '860344047684726';
    //let model = "DCA20-A";
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
  }

  showModal = (e) => {
    if(e==='C') this.setState({visible: true});
    if(e==='R') this.setState({visibleR: true});
  };
  handleOk = e => {
    let uid = url_params(window.location).uid;
    let sale_type = url_params(window.location).sale_type;
    let eid = window.location.hash.split('/')[2];
    if(e==='C') {
      fetch(`${url}/returnOrder`,{
        method:'POST',
        body:JSON.stringify({
          uid, sale_type, eid,
          type:2,
          remark:this.state.remarkC
        })
      }).then(res=>{
        if(res.ok){
          res.json().then(data=>{
            if(data.status) {
              this.setState({visible: false});
              setTimeout(()=>{
                message.success('换货申请成功');
              },600);
            }
            else if(data.code===10004){
              message.warn('该设备换货请求已存在')
            }
          });
        }
      });
    }
    else if(e==='R') {
      fetch(`${url}/returnOrder`,{
        method:'POST',
        body:JSON.stringify({
          uid, sale_type, eid,
          type:1,
          remark:this.state.remarkR,
          return_cost:parseInt(this.state.costR),
        })
      }).then(res=>{
        if(res.ok){
          res.json().then(data=>{
            if(data.status) {
              this.setState({visibleR: false});
              setTimeout(()=>{
                message.success('退货申请成功');
              },600);
            }
            else if(data.code===9005){
              message.error('金额超出退货范围');
              message.info(`最大退货金额为 ${data.can_cost} 元`)
            }
            else if(data.code===10004){
              message.warn('该设备退货请求已存在')
            }
          });
        }else{
          message.error('金额格式不正确');
        }
      });
    }
  };
  handleCancel = e => {
    if(e==='C') this.setState({visible: false});
    if(e==='R') this.setState({visibleR: false});
  };
 // render销毁前
 componentWillUnmount() {
  clearInterval(this.times);
}

  render() {
    const {eid,info,model} = this.state;
     //退货金额
     let reg = new RegExp('^[0-9]*$');
     const Nums = ['../../images/Num/zero.png', 
    '../../images/Num/one.png',
    '../../images/Num/two.png', '../../images/Num/three.png', '../../images/Num/four.png', '../../images/Num/five.png', 
    '../../images/Num/six.png', '../../images/Num/seven.png', '../../images/Num/eight.png', '../../images/Num/nine.png'];
     // Bit 0 冲洗指示 0:停止冲洗; 1:正在冲洗 冲洗时屏蔽制水指示 *
    // Bit 1 制水指示 0:正在制水; 1:水满
    // Bit 2 缺水指示 0:正常; 1:缺水 *
    // Bit 3 检修指示 0:正常; 1:检修
    // Bit 4 浮球指示 0:正常; 1:故障
    // Bit 5 童锁指示 0:关闭; 1:打开
    // Bit 6 换水提醒 0:正常; 1:提醒
    // Bit 7 使用情况 0:禁止使用; 1:开通使用

    // 备注
    // 1. 水满和制水是互斥的, 如果水满为False, 则制水为True, 反之亦然
    // 2. 故障显示时, 其他标志全部为False
    // 3. 冲洗时, 制水标志为False

    let status = [];
    let _model = 0;
    let otds = '00'.split('');
    let itds = 0;
    let tool = [];

    if (info.online_at && !info.offline_at) {
      if (info.status) {
        const _status = JSON.parse(info.status);

        if (_status.itds > 999) {
          itds = 999;
        } else if (_status.itds <= 0) {
          itds = 1;
        } else {
          itds = _status.itds;
        }

        otds = _status.otds.toString().length < 2 ? (`0${_status.otds}`).split('') : _status.otds.toString().split('');

        if (_status.s.toString(2).split('').length < 8) {
          for (let i = 0; i < 8; i++) {
            status.push(parseInt(_status.s.toString(2).split('').reverse()[i]) || 0);
          }
        } else {
          _status.s.toString(2).split('').reverse().map((val) => {
            status.push(parseInt(val));
            return [];
          });
        }
        _model = parseInt(_status.m);
      }

      if (model.split('-')[0] === 'DCA20') {
        tool = [
          {img: status[0] && !status[4] ? require('../../images/Icon/Icon0.png') :  require('../../images/Icon/Icon0-1.png'), name: '冲洗'},
          {img: !status[1] && !status[0] && !status[4] ?  require('../../images/Icon/Icon1.png') : require('../../images/Icon/Icon1-1.png'), name: '制水'},
          {img: status[1] && !status[0] && !status[4] ?  require('../../images/Icon/Icon2.png') :  require('../../images/Icon/Icon2-1.png'), name: '水满'},
          {img: status[2] && !status[4] ?  require('../../images/Icon/Icon3.png') :  require('../../images/Icon/Icon3-1.png'), name: '缺水'},
          {img: status[3] || status[4] ?  require('../../images/Icon/Icon4.png' ): require( '../../images/Icon/Icon4-1.png'), name: '检修'},
        ];
      } else if (model.split('-')[0] === 'DCA16') {
        tool = [
          {img: !status[1] && !status[0] && !status[4] ?  require('../../images/Icon/Icon1.png') :  require('../../images/Icon/Icon1-1.png'), name: '制水'},
          {img: status[6] ?  require('../../images/Icon/Icon5.png') :  require('../../images/Icon/Icon5-1.png'), name: '换水'},
          // {img: Icon6_1, name: '换芯'},
          {img: status[5] ?  require('../../images/Icon/Icon6.png') :  require('../../images/Icon/Icon6-1.png'), name: '童锁'},
          {img:  require('../../images/Icon/Icon7-1.png'), name: '制冷'},
          // -
          {img:  require('../../images/Icon/Icon8-1.png'), name: '冰水'},
          {img: _model === 1 ?  require('../../images/Icon/Icon9.png') :  require('../../images/Icon/Icon9-1.png'), name: '常温'},
          {img: _model === 2 ?  require('../../images/Icon/Icon10.png') :  require('../../images/Icon/Icon10-1.png'), name: '冲奶'},
          {img: _model === 3 ?  require('../../images/Icon/Icon11.png') :  require('../../images/Icon/Icon11-1.png'), name: '开水'},
        ];
      }
    } else {
      otds = [0, 0];
      itds = 0;

      if (model.split('-')[0] === 'DCA20') {
        tool = [
          {img:  require('../../images/Icon/Icon0-1.png'), name: '冲洗'},
          {img:  require('../../images/Icon/Icon1-1.png'), name: '制水'},
          {img:  require('../../images/Icon/Icon2-1.png'), name: '水满'},
          {img:  require('../../images/Icon/Icon3-1.png'), name: '缺水'},
          {img:  require('../../images/Icon/Icon4-1.png'), name: '检修'},
        ];
      } else if (model.split('-')[0] === 'DCA16') {
        tool = [
          {img:  require('../../images/Icon/Icon1-1.png'), name: '制水'},
          {img:  require('../../images/Icon/Icon5-1.png'), name: '换水'},
          // {img: Icon6_1, name: '换芯'},
          {img:  require('../../images/Icon/Icon6-1.png'), name: '童锁'},
          {img:  require('../../images/Icon/Icon7-1.png'), name: '制冷'},
          // -
          {img:  require('../../images/Icon/Icon8-1.png'), name: '冰水'},
          {img:  require('../../images/Icon/Icon9-1.png'), name: '常温'},
          {img:  require('../../images/Icon/Icon10-1.png'), name: '冲奶'},
          {img:  require('../../images/Icon/Icon11-1.png'), name: '开水'},
        ];
      }
    }
    return (
      
        <ScrollView style={{flex: 1}}>    
          <ImageBackground
            style={styles.ImageBackground }
            source={require('../../images/dev_backgroud.png')}>
                <ImageBackground
                  style={styles.ImageBackground }
                  source={require('../../images/device_bg2.png')}>
                    <View style={styles.top}>
                      <Text style={{color:'#fff',textAlign:'center',padding:10}}>净水机状态</Text>
                    </View>
                    <TouchableOpacity
                     style={styles.home}
                      onPress={()=> this.props.navigation.navigate('Home')}>
                      <Icon  name="home" size={20} color={'#fff'} />
                    </TouchableOpacity>
                   
                    <View 
                    style={styles.bg3 }
                    >
                      <ImageBackground
                        style={styles.ImageBackground }
                        source={require('../../images/device_bg3.png')}>
                          <Text style={{color:'#fff',marginTop:85,marginBottom:10}}>出水水质可直饮</Text>
                            <View style={{flexDirection:'row'}}> 
                              {otds.map((val, key) =>{
                                return (
                                  <Image
                                    source={val===0 ? require('../../images/Num/zero.png') :
                                    val===1 ? require('../../images/Num/one.png'):
                                    val===2 ? require('../../images/Num/two.png'):
                                    val===3 ? require('../../images/Num/three.png'):
                                    val===4 ? require('../../images/Num/four.png'):
                                    val===5 ? require('../../images/Num/five.png'):
                                    val===6 ? require('../../images/Num/six.png'):
                                    val===7 ? require('../../images/Num/seven.png'):
                                    val===8 ? require('../../images/Num/eight.png'):require('../../images/Num/nine.png')
                                    }
                                    key={key} 
                                    style={styles.tdsImg}
                                  />)}
                              )}
                              <Text style={{color:'#fff',marginTop:60}}>TDS</Text>
                            </View>                                        
                       </ImageBackground>
                       <Text style={{color:'#fff',marginTop:40}}>进水水质：{itds}TDS</Text>       
                    </View>
                    <View style={{flexDirection:'row',padding:30}}>
                      <Text style={styles.status}>净水机状态</Text>
                      <View style={{paddingLeft:10,}}>
                        <View style={{flexDirection:'row'}}>
                          <Icon  name="wifi" size={20} color={info.online_at && !info.offline_at ? '#fff' : '#666'} />
                          <Text style={{marginLeft:8,color:info.online_at && !info.offline_at ? '#fff' : '#666'}}>
                            {info.online_at && !info.offline_at ? '设备已联网' : '设备未联网'}
                          </Text>
                        </View>
                      <Text style={{color:'#fff'}}>设备ID:  {info.uuid}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'row',flexWrap:'wrap',height:130}}>
                      {tool.map((item,key)=>{
                        return(
                          <View key={key} style={{width:'20%',padding:10,alignItems:'center'}}>
                             <Image
                              style={styles.toolsImg2}
                              source={item.img}
                            />
                            <Text style={{color:'#fff'}}>{item.name}</Text>
                          </View>
                        )
                      })}              
                    </View>
                </ImageBackground>        
          </ImageBackground>
        </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    height:40,
    marginBottom:20,
    borderBottomColor:'#fff',
    borderBottomWidth:1,
    width:'100%',
  },
  home:{
    position:'absolute',
    top:10,
    left:10,
  },
  toolsImg2: {
    marginTop: 5,
    width: 50,
    height: 50,
  },
  ImageBackground:{
    flex:1,
    width:'100%',
    height:'100%',
    alignItems:'center',
  },
  bg3:{
    alignItems:'center',
    width:'100%',
    height:280,
    paddingTop:10,
    paddingBottom:15,
    borderBottomColor:'#fff',
    borderBottomWidth:1,
  },
  tdsImg:{
    height:80,
    width:40,
  },
  status:{
    color:'#fff',
    borderRightWidth:1,
    borderColor:'#fff',
    textAlign:'center',
    paddingRight:10,
    fontSize:18,
    paddingTop:8,
  },
})