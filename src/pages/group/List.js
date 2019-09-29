import React from 'react';
import {View, Text, TouchableOpacity, AsyncStorage,ScrollView,StyleSheet,DeviceEventEmitter} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: '',
      waitSet: [],
      waitFix: [],
      finish: [],
      state: 'a',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '工单通知',
    };
  };

  // render创建之前
  componentWillMount() {
    DeviceEventEmitter.addListener('List', ()=> {this._checkLoginState()})
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
      let urlInfo = `${url}/userSignUp?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
      console.log(urlInfo)
    let id = 1;
    let id2 = 1;
    let id3 = 1;
    let waitSet = [];
    let waitFix = [];
    let finish = [];
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        console.log(info)
        if (info.status) {
          info.datas.forEach(item => {
            let area = item.area.split('/');
            item.area =area[0] + area[1] + area[2];
            if (item.state === 1 && item.type === 1) {
              item.num = id++;

              waitSet.push(item);
            } else if (item.state === 1 && item.type === 2) {
              item.num = id2++;
              waitFix.push(item);
            } else if (item.state === 2) {
              item.num = id3++;
              finish.push(item);
            }
          });
          this.setState({waitSet, waitFix, finish})
        }
      })
    })

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  render() {
    const {waitSet, waitFix, finish, state} = this.state;
    let List = [];
    if(waitSet.length>0 || waitFix.length>0 || finish.length>0){
      let share = [];
      if(state === 'a') share = waitSet;
      else if(state === 'b') share = waitFix;
      else if(state === 'c') share = finish;
     
      List = share.map((item,key)=>{
        return(
          <View 
            style={styles.item} 
            key={key}
          >
            <View style={styles.rol}>
              <Text style={styles.left}> 
                类型：
              </Text>
              <Text style={styles.right}>
              {item.type===1 ? '安装' : '维修'}
              </Text>
            </View>
            <View style={styles.rol}>
              <Text style={styles.left}> 
                单号：
              </Text>
              <Text style={styles.right}>
              {item.uuid}
              </Text>
            </View>
            <View style={styles.rol}>
              <Text style={styles.left}> 
                日期：
              </Text>
              <Text style={styles.right}>
              {item.created_at}
              </Text>
            </View>
            <View style={styles.rol}>
              <Text style={styles.left}> 
                姓名：
              </Text>
              <Text style={styles.right}>
              {item.name}
              </Text>
            </View>
            <View style={styles.rol}>
              <Text style={styles.left}> 
                电话：
              </Text>
              <Text style={styles.right}>
                {item.phone}
              </Text>
            </View>
            <View style={styles.rol}>
              <Text style={styles.left}> 
              安装地址：
              </Text>
              <Text style={styles.right}>
              {`${item.area}${item.address}`}
              </Text>
            </View>  
            <View style={styles.rol}>
              <Text style={styles.left}> 
              完成状态：
              </Text>
              <View style={{...styles.right,justifyContent:'space-between',marginRight:10}}>
                <Text >
                 {item.state===1 ? '已申请' : item.state === 2 && item.change_mid === null ? '已完成' : '已拒单'}
                </Text>
                {state ==='c' ? null :
                  <TouchableOpacity 
                    style={styles.submit} 
                    key={key}
                    onPress={()=>{this.props.navigation.push('SetDetail',{usuid:item.uuid})}}  
                  ><Text style={styles.submitFont}>点击完成</Text></TouchableOpacity>
                }
              </View>
            </View>
          </View>
        )
      })
    }
    return (
      <View style={{flex: 1}}>
        <View style={styles.top}>
          <TouchableOpacity
            style={state==='a' ? styles.button :styles.button2}
            onPress={()=>{this.setState({state:'a'});this.forceUpdate}}
          >
            <Text 
              style={state==='a'? styles.buttonFont :styles.buttonFont2 }
            >等待安装</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={state==='b' ? styles.button :styles.button2}
            onPress={()=>{this.setState({state:'b'});this.forceUpdate}}
          >
            <Text 
              style={state==='b'? styles.buttonFont :styles.buttonFont2 }
            >等待维修</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={state==='c' ? styles.button :styles.button2}
            onPress={()=>{this.setState({state:'c'});this.forceUpdate}}
          >
            <Text 
              style={state==='c'? styles.buttonFont :styles.buttonFont2 }
            >已完成工单</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
        { List }
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    marginTop:10,
  },
  button:{
    width:'33%',
    backgroundColor:'#FF7701',
    color:'#fff',
    borderColor:'#666',
    borderWidth:0.5,
    padding:5,
  },
  button2:{
    width:'33%',
    color:'black',
    borderColor:'#666',
    borderWidth:0.5,
    padding:5,
  },
  buttonFont:{
    color:'#fff',
    textAlign:'center',
  },
  buttonFont2:{
    color:'black',
    textAlign:'center',
  },
  item:{
    backgroundColor:'#F0EEEF',
    padding:10,
    marginTop:5,
  },
  rol:{
    flexDirection:'row',
    width:'100%',
  },
  left:{
    width:'25%',
    textAlign:'right'
  },
  right:{
    width:'75%',
    textAlign:'left',
    flexDirection:'row',
  },
  submit:{
    backgroundColor:'#FF7701',
    borderColor:'#FF7701',
    padding:1,
    borderRadius:4,
  },
  submitFont:{
    color:'#fff',
    textAlign:'center',
  }

})