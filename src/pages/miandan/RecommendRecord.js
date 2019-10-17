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
      data:[],
      LoginInfo:{},
      page:1,
      e:1,
      newData:[],
    };
   
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'推荐记录' ,
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
  
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      let urlInfo = `${url}/authWx?uid=${LoginInfo.uid}&sale_type=${LoginInfo.sale_type}`;
      fetch(urlInfo).then(res=>{
        if(res.ok){
          res.json().then(info=>{
            console.log(info)
            if(info.status){
              info.datas.forEach((item,key)=>{
                item.id=key+1;
                if (item.equipments.length > 0){
                  item.ac_at = item.equipments[0].activation_at;
                }else{
                  item.ac_at = '未激活';
                }
              });
              let page = Math.ceil(info.datas.length/10);
              this.setState({data:info.datas,page,newData:info.datas});
            }
          });
        }
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  datasChange(e){
  
    const {data} = this.state;
    let newData = [];
  
    data.forEach((item,key)=>{
      if(key>=e*10-10 && key<e*10){
        newData.push(item);
      }
    })
    this.setState({newData,e})
  }

  

 

  render() {
    const {data,page,e,newData} = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <ScrollView style={{flex:1,}}>
        <View style={styles.title}>
          <Text style={{...styles.item,}}>姓名</Text>
          <Text style={{...styles.item}}>注册时间</Text>
          <Text style={{...styles.item}}>激活时间</Text>
        </View>
        <FlatList
          data={newData}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={separator}
          renderItem={({item}) =>
            <View style={styles.title}>
              <Text style={{...styles.item}}>{item.name}</Text>
              <Text style={{...styles.item}}>{item.created_at}</Text>
              <Text style={{...styles.item}}>{item.ac_at}</Text>
           
          </View>
              }
        />
         {data.length === 0 ?
         <Text style={{width:'100%',textAlign:'center'}}>NO DATA</Text>
         : <Text></Text>
        }
        <View style={styles.pagination}>
         <Pagination 
          total={page} 
          current={e} 
          locale={locale} 
          onChange={(e)=>{this.datasChange(e)}}
          />
        </View>
        {newData.length === 0 ?
         <Text style={{width:'100%',textAlign:'center'}}>NO DATA</Text>
         : <Text></Text>
        }
       
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
    textAlign:'center',
    width:'33%',
    borderBottomWidth:0.5,
    borderColor:'#F0EEEF',
  },
  pagination:{
    width:'50%',
    marginLeft:'50%',
  }
})