import React from 'react';
import {View, Text, ScrollView, AsyncStorage,TouchableOpacity,StyleSheet,FlatList} from 'react-native';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      loading: true,
      type: 0, // 0超管 1运营 2代理 3经销
      LoginInfo:{},
      level:0,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '商家列表',
    };
  };



  // 验证本地存储的资料是否有效
  _checkLoginState = async (type) => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    LoginInfo = LoginInfo[0];

    if (LoginInfo !== null) {
      this.setState({LoginInfo});
      //获取信息
      let getMerchants = `${url}/merchants`;
      
      console.log(LoginInfo.mid);
      getMerchants += LoginInfo.mid ? `?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}` : `?sale_type=${LoginInfo.sale_type}`;
      fetch(getMerchants).then(res => {
        if (res.ok) {
          res.json().then(info => {
            if (info.status) {
              const lists = [];
              console.log(info);
              info.data.forEach((val, key) => {
                if (type === val.type) {
                  val.id = key + 1;
                  lists.push(val);
                }
                if (type === 0) {
                  val.id = key + 1;
                  lists.push(val);
                }
                // 获取第一条数据的type 是代理还是经销
                if (key === 0) {
                  //  如果没有mid 不是超管
                  if (getMerchants.indexOf('mid') !== -1) {
                    this.setState({level: val.type});
                  }
                }
              });
              this.setState({lists, loading: false});
              console.log(lists);
            }
          });
        }
      });

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
       // 验证/读取 登陆状态
       this._checkLoginState(0);
  }

  render() {
    const {lists, loading, type,level} = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <ScrollView style={{flex: 1,padding:10}}>
        <View style={styles.top}>
          <TouchableOpacity
             style={{...styles.item,backgroundColor:type === 0 ? '#FF7701' : 'white' }}
              onPress={() => {
                this.setState({type:0})
                this._checkLoginState(0);
           }}>
            <Text
              style={{
                textAlign:'center',
              }}
            >全部</Text>
          </TouchableOpacity>
          {level >1 ? null :
            <TouchableOpacity
            style={{...styles.item,backgroundColor:type === 1 ? '#FF7701' : 'white' }}
            onPress={() => {
              this.setState({type:1});
              this._checkLoginState(1);
            }}>
            <Text
              style={{
                textAlign:'center',
              }}
            >品牌商</Text>
           </TouchableOpacity>    
          }
          
          {level >2 ? null : 
             <TouchableOpacity
             style={{...styles.item,backgroundColor:type === 2 ? '#FF7701' : 'white' }}
             onPress={() => {
               this.setState({type:2});
               this._checkLoginState(2);
             }}>
             <Text
               style={{
                 textAlign:'center',
               }}
             >运营商</Text>
           </TouchableOpacity>
          }

          {level >3 ? null : 
             <TouchableOpacity
             style={{...styles.item,backgroundColor:type ===3 ? '#FF7701' : 'white' }}
             onPress={() => {
               this.setState({type:3});
               this._checkLoginState(3);
             }}>
             <Text
               style={{
                 textAlign:'center',
               }}
             >代理商</Text>
           </TouchableOpacity>
          }

          {level >4 ? null : 
             <TouchableOpacity
             style={{...styles.item,backgroundColor:type === 4 ? '#FF7701' : 'white' }}
             onPress={() => {
               this.setState({type:4});
               this._checkLoginState(4);
             }}>
             <Text
               style={{
                 textAlign:'center',
               }}
             >经销商</Text>
           </TouchableOpacity>
          }
         </View>
     
          <View style={styles.content}>
            <View style={styles.top}>
              <Text style={styles.title}>区域</Text>
              <Text style={styles.title}>联系人</Text>
              <Text style={styles.title}>电话</Text>
              <Text style={styles.title}>操作</Text>
            </View>
            <FlatList
              style={{flex:1}}
              data={lists}
              keyExtractor={(item) => String(item.id)}
              ItemSeparatorComponent={separator}
              renderItem={({item}) =>
                <View style={{...styles.top,}}>
                  <Text style={styles.title}>{item.m_area}</Text>
                  <Text style={styles.title}>{item.contact}</Text>
                  <Text style={styles.title}>{item.mobile}</Text>
                  <View style={styles.title}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        this.props.navigation.push('MerchantDetails',{mid:item.uuid});
                      }}>
                      <Text
                        style={{
                          textAlign:'center',color:'white',fontSize:12,
                        }}
                      >查看详情</Text>
                   </TouchableOpacity>
                  </View>
                  
              </View>
              }
            />
          </View>
          <View style={{justifyContent:'center',alignItems:'flex-end',marginTop:15,marginBottom:25}}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.props.navigation.push('Addmerchant');
              }}>
              <Text
                style={{
                  textAlign:'center',color:'white'
                }}
              >+ 添加商家</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    width:'100%',
    flexWrap:'wrap',
    paddingTop:10,
    paddingBottom:10,

  },
  item:{
    width:'25%',
    borderColor:'#666',
    borderWidth:0.2,
    padding:10,
  },
  content:{
    borderColor:'#666',
    borderWidth:0.2,
    padding:5,
    marginTop:20,
  },
  title:{
    width:'25%',
    textAlign:'center',
    padding:3,
    fontSize:12,
  },
  button:{
    backgroundColor:'#FF7701',
    borderColor:'#FF7701',
    borderWidth:1,
    padding:5,
    borderRadius:5,
  }
})