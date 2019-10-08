import React from 'react';
import {View, Text, ScrollView, AsyncStorage,StyleSheet,TouchableOpacity,TextInput,Picker,ToastAndroid} from 'react-native';
import DatePicker from 'react-native-datepicker';
const url = 'https://iot2.dochen.cn/api';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:'',
      state:'',               //a已结算页面  b未结算页面
      list:[],
      settleType: '3',        //结算类型  2返点 3补贴
      date:`${new Date().getFullYear()}-${(new Date().getMonth()+1+'').length===1 ? `0${new Date().getMonth()+1}` : `${new Date().getMonth()+1}`}-01`
    };
    this.onChange = value => {
      this.setState({
        bank:value,
      });
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:navigation.getParam('state','') ==='a' ? '已结算'  :'未结算' ,
    };
  };

  // render创建之前
  componentWillMount() {
  
  }

  componentDidMount() {

    let state = this.props.navigation.getParam('state');
    //let state = 'a';
    this.setState({state})
    this._checkLoginState();
}

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    const { settleType, date } = this.state;
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    console.log(LoginInfo)
    LoginInfo = eval('(' + LoginInfo + ')');
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({ LoginInfo});
      this.getEarning(date,settleType);
    } else {
      this.props.navigation.navigate('Login');
    }
  };

   //获取收益
   getEarning(date,settleType) {
    const {state,LoginInfo} = this.state;
    let urlInfo = `${url}/merchantEarning?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}&type=${settleType}&month=${date}`;
    console.log(urlInfo);
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        console.log(info);
        if (info.status) {
          if(state==='a') this.setState({list: info.settle});
          else if(state==='b')  this.setState({list: info.no_settle});
        }
      })
    })
  }

  render() {
    const { state, list, settleType, date } = this.state;
    let sum = 0;
    list.forEach(item=>{
      sum += item.earning;
    });

    let lists = list.map((item,key)=>{
      return(
        <View style={styles.item} key={key}>
          <View style={{flexDirection:'row'}}>
            <Text style={{width:'80%',fontWeight:'bold'}}>{settleType==='2' ? '滤芯' : '激活码'}订单号 : {item.oid}</Text>
            <Text style={{width:'20%',textAlign:'right',fontWeight:'bold',color:state==='a'?'#729302':'#bbb'}}>+{item.earning}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={{color:'#666',paddingRight:10,borderColor:'#666',borderRightWidth:0.5,marginRight:10}}>设备ID : {item.eid}</Text>
            <Text style={{color:'#666'}}>激活码 : {item.cdkey}</Text>
          </View>
        </View>
      )
    })
    return (
      <ScrollView style={{flex:1,padding:10,}}>
        <View style={styles.top}>
          <Text style={{fontSize:17}}>结算类型 : </Text>
          <View style={{...styles.input,backgroundColor:'white'}} >
          <Picker
            mode={'dropdown'}
            style={styles.picker}
            selectedValue={this.state.settleType}
            onValueChange={(value,key) => {
              this.getEarning(date,value);
              this.setState({settleType:value});
            }}>
           <Picker.Item key={3} label={'补贴'} value={'3'}/>
           <Picker.Item key={2} label={'返点'} value={'2'}/>
          </Picker>
          </View>
        </View>
        <View style={styles.date}>
          <DatePicker
            style={{width: 200}}
            date={this.state.date}
            androidMode='spinner'
            mode="date"
            format="YYYY-MM-DD"
            confirmBtnText="确定"
            cancelBtnText="取消"
            showIcon={true}
            onDateChange={(datetime) => {
              this.setState({date: datetime});
              this.getEarning(datetime,settleType);
            }}
          />
        </View>
        <Text style={styles.sum}>{state === 'a' ? '已':'将要'}结算{settleType === '2'? '返点':'补贴'} : 共 {sum} 元</Text>
        <View>
          {lists}
        </View>
      </ScrollView>
      
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  input:{
    borderColor:'#666',
    borderWidth:0.5,
    borderRadius:5,
    fontSize:17,
  },
  picker:{
    width:100,
  },
  date:{
    marginTop:20,
  },
  sum:{
    marginTop:10,
    marginBottom:20, 
  },
  item:{
    borderColor:'#666',
    borderTopWidth:0.5,
    padding:10,
  }
})