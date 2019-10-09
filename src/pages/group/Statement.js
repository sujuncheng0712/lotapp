import React from 'react';
import {View, Text, ScrollView, AsyncStorage,StyleSheet,TouchableOpacity,TextInput,Picker,FlatList} from 'react-native';
import { Pagination } from '@ant-design/react-native';
const url = 'https://iot2.dochen.cn/api';
const locale = {
  prevText: '<',
  nextText: '>',
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: '',
      equipment: '',
      pledge: '',
      wallet: '',
      in_out_datas: [],
      return_mod_datas: [],
      send_mod_datas: [],
      page1:1,
      page2:1,
      page3:1,
      newin_out_datas:[],
      newsend_mod_datas:[],
      newreturn_mod_datas:[],
      e1:1,
      e2:1,
      e3:1,
    };
   
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'对账单' ,
    };
  };

  // render创建之前
  componentWillMount() {
  
  }

  componentDidMount() {

    this._checkLoginState();
}

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    console.log(LoginInfo)
    LoginInfo = eval('(' + LoginInfo + ')');
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      let urlInfo = `${url}/merchantAccount?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res => {
        res.json().then(info => {
          console.log(info)
          if (info.status) {
            let id = 1;
            let id2 = 1;
            let id3 = 1;
            let newin_out_datas =[];
            let newsend_mod_datas =[];
            let newreturn_mod_datas =[];
            info.in_out_datas.forEach(item => {
              item.id = id++;
            })
            info.send_mod_datas.forEach(item => {
              item.id = id2++;
            })
            info.return_mod_datas.forEach(item => {
              item.id = id3++;
            })
            let page1 = Math.ceil(info.in_out_datas.length/10);
            let page2 = Math.ceil(info.send_mod_datas.length/10);
            let page3 = Math.ceil(info.return_mod_datas.length/10);
            info.in_out_datas.forEach((item,key)=>{
              if(key<10){
                newin_out_datas.push(item);
              }
            })
            info.send_mod_datas.forEach((item,key)=>{
              if(key<10){
                newsend_mod_datas.push(item);
              }
            })
            info.return_mod_datas.forEach((item,key)=>{
              if(key<10){
                newreturn_mod_datas.push(item);
              }
            })
            this.setState({
              balance: info.balance,
              equipment: info.equipment,
              pledge: info.pledge,
              wallet: info.wallet,
              in_out_datas: info.in_out_datas,
              return_mod_datas: info.return_mod_datas,
              send_mod_datas: info.send_mod_datas,
              page1,
              page2,
              page3,
              newin_out_datas,
              newsend_mod_datas,
              newreturn_mod_datas,
            })
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  in_out_datasChange(e1){
  
    const {in_out_datas} = this.state;
    let newin_out_datas = [];
  
    in_out_datas.forEach((item,key)=>{
      if(key>=e1*10-10 && key<e1*10){
        newin_out_datas.push(item);
      }
    })
    this.setState({newin_out_datas,e1})
  }

  send_mod_datasChange(e2){
  
    const {send_mod_datas} = this.state;
    let newsend_mod_datas = [];
  
    send_mod_datas.forEach((item,key)=>{
      if(key>=e2*10-10 && key<e2*10){
        newsend_mod_datas.push(item);
      }
    })
    this.setState({newsend_mod_datas,e2})
  }

  return_mod_datasChange(e3){
  
    const {return_mod_datas} = this.state;
    let newreturn_mod_datas = [];
  
    return_mod_datas.forEach((item,key)=>{
      if(key>=e3*10-10 && key<e3*10){
        newreturn_mod_datas.push(item);
      }
    })
    this.setState({newreturn_mod_datas,e3})
  }

  render() {
    const {balance, equipment, pledge, wallet, in_out_datas, return_mod_datas, send_mod_datas,page1,page2,page3,newin_out_datas,newsend_mod_datas,newreturn_mod_datas,e1,e2,e3} = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <ScrollView style={{flex:1,}}>
        <Text style={{padding:10}}>收支明细</Text>
        <View style={styles.title}>
          <Text style={{...styles.item,width:'15%'}}>序号</Text>
          <Text style={{...styles.item,width:'28%'}}>付款日期</Text>
          <Text style={{...styles.item,width:'15%'}}>金额</Text>
          <Text style={{...styles.item,width:'15%'}}>余额</Text>
          <Text style={{...styles.item,width:'27%'}}>摘要</Text>
        </View>
        <FlatList
          data={newin_out_datas}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={separator}
          renderItem={({item}) =>
            <View style={styles.title}>
              <Text style={{...styles.item,width:'15%'}}>{item.id}</Text>
              <Text style={{...styles.item,width:'28%'}}>{item.created_at}</Text>
              <Text style={{...styles.item,width:'15%'}}>{item.amount}</Text>
              <Text style={{...styles.item,width:'15%'}}>{item.balance}</Text>
              <Text style={{...styles.item,width:'27%'}}>{item.reference}</Text>
          </View>
              }
        />
        <View style={styles.pagination}>
         <Pagination 
          total={page1} 
          current={e1} 
          locale={locale} 
          onChange={(e)=>{this.in_out_datasChange(e)}}/>
        </View>
        <Text style={{padding:10}}>发货明细</Text>
        <View style={styles.title}>
          <Text style={{...styles.item,width:'15%'}}>序号</Text>
          <Text style={{...styles.item,width:'28%'}}>发货日期</Text>
          <Text style={{...styles.item,width:'15%'}}>数量</Text>
          <Text style={{...styles.item,width:'15%'}}>单价</Text>
          <Text style={{...styles.item,width:'27%'}}>金额</Text>
        </View>
        <FlatList
          data={newsend_mod_datas}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={separator}
          renderItem={({item}) =>
            <View style={styles.title}>
              <Text style={{...styles.item,width:'15%'}}>{item.id}</Text>
              <Text style={{...styles.item,width:'28%'}}>{item.created_at}</Text>
              <Text style={{...styles.item,width:'15%'}}>{item.amount}</Text>
              <Text style={{...styles.item,width:'15%'}}>{item.balance}</Text>
              <Text style={{...styles.item,width:'27%'}}>{item.reference}</Text>
          </View>
              }
        />
         <View style={styles.pagination}>
          <Pagination 
            total={page2} 
            current={e2} 
            locale={locale} 
            onChange={(e)=>{this.send_mod_datasChange(e)}}/>
        </View>
        <Text style={{padding:10}}>退货明细</Text>
        <View style={styles.title}>
          <Text style={{...styles.item,width:'15%'}}>序号</Text>
          <Text style={{...styles.item,width:'28%'}}>退货日期</Text>
          <Text style={{...styles.item,width:'15%'}}>数量</Text>
          <Text style={{...styles.item,width:'15%'}}>单价</Text>
          <Text style={{...styles.item,width:'27%'}}>金额</Text>
        </View>
        <FlatList
          data={newreturn_mod_datas}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={separator}
          renderItem={({item}) =>
            <View style={styles.title}>
              <Text style={{...styles.item,width:'15%'}}>{item.id}</Text>
              <Text style={{...styles.item,width:'28%'}}>{item.created_at}</Text>
              <Text style={{...styles.item,width:'15%'}}>{item.amount}</Text>
              <Text style={{...styles.item,width:'15%'}}>{item.balance}</Text>
              <Text style={{...styles.item,width:'27%'}}>{item.reference}</Text>
          </View>
              }
        />
         <View style={styles.pagination}>
          <Pagination 
            total={page3} 
            current={e3} 
            locale={locale} 
            onChange={(e)=>{this.send_mod_datasChange(e)}}/>
        </View>
        <View style={{paddingBottom:40}}>
          <Text>设备已激活:{equipment}台</Text>
          <Text>设备未激活：台</Text>
          <Text>账户余额：{wallet}元</Text>
          <Text>结余</Text>
          <Text>保证金：{pledge}元（已冻结）</Text>
          <Text>剩余押金：{balance}元</Text>
          <Text>可提现：{wallet}元</Text>
        </View>
      </ScrollView>
      
    );
  }
}
const styles = StyleSheet.create({
  title:{
    flexDirection:'row',
    backgroundColor:'#F0EEEF',
    borderBottomWidth:0.5,
    borderColor:'#F0EEEF',
  },
  item:{
    padding:10,
    textAlign:'left',
    width:'20%',
    borderBottomWidth:0.5,
    borderColor:'#F0EEEF',
  },
  pagination:{
    width:'50%',
    marginLeft:'50%',
  }
})