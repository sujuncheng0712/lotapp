import React from 'react';
import {View, Text, StyleSheet, AsyncStorage,TouchableOpacity,ToastAndroid,DeviceEventEmitter} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:'',
      usuid:'',
      uuid: '',
      eid: '',
      created_at: '',
      name: '',
      phone: '',
      address: '',
      image: [],
      remark: '',
      previewVisible: false,
      previewImage: '',
      model:'',
      area:'',
      quantity:'',
      fileList: [],
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '工单处理',
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
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      let usuid = this.props.navigation.getParam('usuid','');
      this.setState({usuid})
      this.setState({ LoginInfo});
      //获取信息
      let urlInfo = `${url}/userSignUp?usuid=${usuid}&sale_type=${LoginInfo.sale_type}`;
      let fileList = []
      let id = 1;
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        console.log(info)
        if (info.status) {
          console.log(info.datas)
          if (info.datas[0].image) {
            fileList.push({
              uid: id++,
              name: 'image.png',
              status: 'done',
              url: info.datas[0].image,
            })
          }
          this.setState({
            uuid: info.datas[0].usuid,
            eid: info.datas[0].eid,
            created_at: info.datas[0].created_at,
            name: info.datas[0].name,
            phone: info.datas[0].phone,
            address: info.datas[0].address,
            image: info.datas[0].image,
            remark: info.datas[0].remark,
            model: info.datas[0].model,
            area: info.datas[0].area,
            quantity: info.datas[0].quantity,
            fileList: fileList,
            type:info.datas[0].type === 1 ? '安装' : '维修',
                    
          })
        }
      })
    })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  //完成
  complete() {
    let urlInfo = `${url}/userSignUp`;
    fetch(urlInfo, {
      method: 'PUT',
      body: JSON.stringify({
        usuid: this.state.uuid,
        state: 2,
        sale_type: this.state.LoginInfo.sale_type,
      })
    }).then(res => {
      res.json().then(info => {
        console.log(info);
        if (info.status) {
          ToastAndroid.show('提交成功', ToastAndroid.SHORT);
          DeviceEventEmitter.emit('List');
          this.props.navigation.goBack();
        } else {
          ToastAndroid.show('提交失败', ToastAndroid.SHORT);
        }
      })
    })
  }

  //拒单
  reject() {
    let urlInfo = `${url}/userSignUp`;
    fetch(urlInfo, {
      method: 'PUT',
      body: JSON.stringify({
        usuid: this.state.uuid,
        is_dgk: 1,
        sale_type: this.state.LoginInfo.sale_type,
      })
    }).then(res => {
      res.json().then(info => {
        if (info.status) {
          ToastAndroid.show('已拒单', ToastAndroid.SHORT);
          DeviceEventEmitter.emit('List');
          this.props.navigation.goBack();
        } else {
          ToastAndroid.show('拒单失败', ToastAndroid.SHORT);
        }
      })
    })
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  render() {
    const {uuid, eid, created_at, name, phone, address, previewVisible, previewImage,
      fileList, remark, area, model, quantity,type} = this.state;
    return (
      <View style={{flex: 1,backgroundColor:'#F0EEEF'}}>
        <View style={{padding:10}}>
          <Text style={styles.item}>服务类型：{type}</Text>
          <Text style={styles.item}>工单编号：{uuid}</Text>
          <Text style={styles.item}>型号：{model}</Text>
          <Text style={styles.item}>数量：{quantity}</Text>
          <Text style={styles.item}>联系人: {name}</Text>
          <Text style={styles.item}>联系电话: {phone}</Text>
          <Text style={styles.item}>地区: {area}</Text>
          <Text style={styles.item}>详细地址: {address}</Text>
          <Text style={styles.item}>备注信息: {remark}</Text>
        </View>
        <TouchableOpacity
            style={styles.button}
            onPress={()=>{this.complete()}}
          >
            <Text 
              style={styles.buttonFont}
            >完 成 工 单</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...styles.button,backgroundColor:'#666666',borderColor:'#666666'}}
            onPress={()=>{this.reject()}}
          >
            <Text 
              style={{...styles.buttonFont}}
            >拒 单</Text>
          </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item:{
    marginTop:5,
  },
  button:{
    width:'100%',
    padding:10,
    backgroundColor:'#FF7701',
    borderColor:'#FF7701',
    borderRadius:5,
    marginTop:15,
  },
  buttonFont:{
    color:'#fff',
    width:'100%',
    textAlign:'center'
  }
})