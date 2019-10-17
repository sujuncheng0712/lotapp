import React from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  Image,
  ToastAndroid,
  TouchableOpacity,
  ScrollView, BackHandler
} from 'react-native';
import * as wechat from 'react-native-wechat';
import Swiper from 'react-native-swiper';
const url = 'https://iot2.dochen.cn/api';
const {height,width} =  Dimensions.get('window');
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      filterStatus: 0, //滤芯是否过期，0为正常状态，1为过期状态
      expiredFilter: [], // 过期滤芯型号
      expiredFilterId: [], // 过期滤芯ID
      p: 0,
      c: 0,
      r: 0,
      msg: '',
      checkUid: '',
      LoginInfo: {},
      version:'',
      oldVersion:'1.0',
      visable:'false',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo);
    // eslint-disable-next-line no-eval
    if (LoginInfo !== null) {
      if(LoginInfo.type !==null){
       // this.props.navigation.push('GroupHome', {_isLogin: true});
      }
    
      this.setState({LoginInfo});
      let urlInfo = `${url}/equipments?uid=${LoginInfo.uid}&sale_type=${
        LoginInfo.sale_type
      }`;
      fetch(urlInfo).then(res => {
        res.json().then(info => {
          console.log(info);
          if (info.status) {
            info.data.forEach((val, i) => {
              if (val.fe_isUse === 0) {
                // this.getOrder(val.over_tags,val.over_feid,val.uuid); // 测试，不判断是否联网
                if (val.online_at && !val.offline_at) {
                  this.getOrder(
                    val.over_tags,
                    val.over_feid,
                    val.uuid,
                    LoginInfo,
                  );
                }
              }
            });
          }
        });
      });
      setTimeout(() => {
        this.ReloadEquipments(LoginInfo);
      }, 800);
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  //获取版本号
  getVersion(){
    const {oldVersion} = this.state;
    let urlInfo = `${url}/auth`;
    fetch(urlInfo).then(res=>{
      res.json().then(info=>{
        console.log(info)
        if(info.status){
          if(info.version !== oldVersion){
            this.setState({version:info.version,visable:true})
          }
        }
      })
    })
  }

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    this.getVersion();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  onBackAndroid = () => {
    if (this.props.navigation.isFocused()) {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        BackHandler.exitApp();
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  }

  ReloadEquipments(LoginInfo) {
    let urlInfo = `${url}/equipments?uid=${LoginInfo.uid}&sale_type=${
      LoginInfo.sale_type
    }`;
    //获取设备
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        console.log(info);
        if (info.status) {
          console.log('000');
          const expiredFilter = [];
          const expiredFilterId = [];
          const lists = [];
          let msg = '';
          let check = false;
          let p = info.data[0].new_feCdkeyData.DCL01.length;
          let c = info.data[0].new_feCdkeyData.DCL02.length;
          let r = info.data[0].new_feCdkeyData.DCL09.length;
          this.setState({p: p, c: c, r: r});
          info.data.forEach((val, i) => {
            console.log('000');
            if (val.fe_isUse === 0) {
              for (let i = 0; i < val.over_tags.length; i++) {
                console.log(val.over_tags[i]);
                if (val.over_tags[i] === 'DCL01' && p > 0) {
                  check = true;
                } else if (val.over_tags[i] === 'DCL02' && c > 0) {
                  check = true;
                } else if (val.over_tags[i] === 'DCL09' && r > 0) {
                  check = true;
                }
              }
              lists.unshift(val);
            } else {
              lists.push(val);
              console.log(lists);
            }
          });
          if (!check) {
            msg = '滤芯已过期，请及时购买新滤芯';
          } else if (!(info.data.online_at && !info.data.offline_at)) {
            msg = '新滤芯已购买，请联网恢复状态';
          }
          this.setState({msg: msg});
          this.setState({lists});
        }
      });
    });
  }

  getOrder(expiredFilter, expiredFilterId, eid, LoginInfo) {
    // 定义数组接收所有滤芯激活码
    const filterKey = [];
    let urlInfo = `/orders?uid=${LoginInfo.uid}&sale_type=${
      LoginInfo.sale_type
    }`;
    console.log(111);
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        console.log(info);
        if (info.status) {
          info.data.map(item => {
            if (item.state === 4 && item.type === 2) {
              //获取滤芯激活码
              let urlInfo2 = `${url}/filter_cdkey?uid=${
                LoginInfo.uid
              }&sale_type=${LoginInfo.sale_type}`;
              fetch(urlInfo2).then(res => {
                res.json().then(info => {
                  if (info.status) {
                    info.data.map(val => {
                      if (item.uuid === val.oid) {
                        if (!val.confirm_at) {
                          filterKey.push(val.code);
                        }
                      }
                    });
                    const newFilterKeyArr = this.leachActivationCodeArr(
                      filterKey,
                    );
                    this.activedFilter(
                      expiredFilter,
                      newFilterKeyArr,
                      expiredFilterId,
                      eid,
                      LoginInfo,
                    );
                  }
                });
              });
            }
          });
        }
      });
    });
  }

  // 激活滤芯
  activedFilter(
    expiredFilter,
    newFilterKeyArr,
    expiredFilterId,
    eid,
    LoginInfo,
  ) {
    // const {eid} = this.props.match.params;
    // const eid = eid;
    expiredFilter.map(tagVal => {
      newFilterKeyArr.map(keyVal => {
        //滤芯激活
        let urlInfo = `${url}/filter_element/${eid}/activation?uid=${
          LoginInfo.uid
        }&sale_type=${LoginInfo.sale_type}`;
        fetch(urlInfo, {
          method: 'POST',
          body: JSON.stringify({
            tags: tagVal,
            code: keyVal,
            sale_type: LoginInfo.sale_type,
          }),
        }).then(res => {
          res.json().then(info => {
            console.log(info);
            if (info.status) {
              ToastAndroid.show('滤芯激活成功', ToastAndroid.SHORT);
              this.setState({filterStatus: 0});
            }
          });
        });
      });
    });
  }

  // 如果用户账号下有多个同类型的激活码，同类型的激活码只取一个， 返回新数组
  leachActivationCodeArr(arr) {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].slice(0, 1) === 'P') {
        newArr.push(arr[i]);
        break;
      }
    }
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].slice(0, 1) === 'C') {
        newArr.push(arr[j]);
        break;
      }
    }
    for (let K = 0; K < arr.length; K++) {
      if (arr[K].slice(0, 1) === 'R') {
        newArr.push(arr[K]);
        break;
      }
    }
    return newArr;
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
            this.setState({
              filterStatus: 1,
              expiredFilter: expiredFilter,
              expiredFilterId: expiredFilterId,
            });
          }
        } else {
          if (item.used > 180) {
            expiredFilter.push(item.eptags);
            expiredFilterId.push(item.uuid);
            this.setState({
              filterStatus: 1,
              expiredFilter: expiredFilter,
              expiredFilterId: expiredFilterId,
            });
          }
        }
      }
    });
  }

  //下载更新
  downLoad(){

  }

  render() {
    const {lists,visable} = this.state;
    return (
      <View style={{flex:1}}>
        <View style={{height:width/1.7}}>
          <Swiper
            style={styles.wrapper}
            height={width/1.7}
            horizontal={true}
            autoplay={false}
            autoplayTimeout={5}
            showsButtons={false}
            activeDot={
              <View
                style={{
                  backgroundColor: '#FF7A01',
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  marginBottom: 3,
                }}
              />
            }>
            <View style={styles.slide}>
              <Image
                resizeMode="stretch"
                style={styles.image}
                source={require('../../images/dca16.jpg')}
              />
            </View>
            <View style={styles.slide}>
              <Image
                resizeMode="stretch"
                style={styles.image}
                source={require('../../images/dca20.jpg')}
              />
            </View>
          </Swiper>
        </View>
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate('AddDevice');
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
              }}>
              添加设备
            </Text>
          </TouchableOpacity>
        </View>
        
        <View>
          <Text style={{padding: 10}}>
            你的新滤芯。PPF：{this.state.p}个，CPP：{this.state.c}个，RO：
            {this.state.r}个
          </Text>
          <Text>{this.state.checkUid}</Text>
        </View>
       
        <View>
          <ScrollView>
            {lists.map((item, key) => (
              <TouchableOpacity 
              key={key}
               style={styles.item}
               onPress={() => {
                this.props.navigation.navigate('DeviceIndex',{eid:item.uuid,model:item.model});
              }}
              >
                {item.model === 'DCA16-A' ? (
                  <View>
                    <Image
                      resizeMode="stretch"
                      style={styles.deviceImg}
                      source={require('../../images/icon_DCA16-A.jpg')}
                    />
                  </View>
                ) : item.model === 'DCA20-A' ? (
                  <View>
                    <Image
                      resizeMode="stretch"
                      style={styles.deviceImg}
                      source={require('../../images/icon_DCA20-A.jpg')}
                    />
                  </View>
                ) : (
                  <View>
                    <Image
                      resizeMode="stretch"
                      style={styles.deviceImg}
                      source={require('../../images/icon_DCA20-B.jpg')}
                    />
                  </View>
                )}

                <View style={{flex: 1}}>
                  <View style={styles.deviceInfo}>
                    {item.online_at && !item.offline_at ? (
                      <Image
                        resizeMode="stretch"
                        style={styles.gprsImg}
                        source={require('../../images/GPRS1.png')}
                      />
                    ) : (
                      <Image
                        resizeMode="stretch"
                        style={styles.gprsImg}
                        source={require('../../images/GPRS.png')}
                      />
                    )}
                    <Text
                      style={{
                        color:
                          item.online_at && !item.offline_at
                            ? '#52c41a'
                            : '#666',
                      }}>
                      {item.online_at && !item.offline_at ? '在线' : '离线'}
                    </Text>
                  </View>
                  <Text>{item.name}</Text>
                  <Text>{item.uuid}</Text>
                </View>

                <View>
                  <Text style={styles.activation_at}>
                    {' '}
                    {item.activation_at ? '已激活' : '未激活'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
        </View>
       <View style={styles.scan}>
          <View style={styles.model}>
            <TouchableOpacity
              onPress={()=>{this.downLoad()}}
            >
              <Text>确认</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>取消</Text>
            </TouchableOpacity>
          </View>
       </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: width,
    height:width/1.7
  },
  deviceImg: {
    width: 50,
    flex: 1,
    height: 50,
    marginRight: 20,
  },
  gprsImg: {
    width: 15,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  deviceInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  activation_at: {
    marginTop: 18,
  },
  button: {
    flex: 1,
    backgroundColor: '#FF7A01',
    borderColor: '#FF7A01',
    color: '#FF7A01',
    textAlign: 'center',
    borderRadius: 5,
    height: 30,
    fontSize: 10,
    padding: 5,
  },
   scan:{
    width:width,
    height:height,
    borderColor:'red',
    borderWidth:1,
    position:'absolute',
    top:0,
    left:0,
    justifyContent:'center',
    alignItems:'center',
  },
  model:{
    flexDirection:'row',
  }
});
