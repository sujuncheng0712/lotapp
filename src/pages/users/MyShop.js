import React from 'react';
import {
  View,
  Text,
  Button,
  AsyncStorage,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as wechat from 'react-native-wechat';
import Swiper from 'react-native-swiper';
const {height,width} =  Dimensions.get('window');
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      count: 0,
      sale_type: 0,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '我的商城',
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
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

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    // eslint-disable-next-line no-eval
    LoginInfo = eval('(' + LoginInfo + ')');
    if (LoginInfo !== null) {
      console.log(LoginInfo.name);
      this.setState({sale_type: LoginInfo.sale_type});
      let urlInfo = `${url}/products?uid=${LoginInfo.uid}&sale_type=${
        LoginInfo.sale_type
      }`;
      fetch(urlInfo).then(res => {
        res.json().then(info => {
          console.log(info);
          if (info.status) {
            const lists = [];
            info.data.map(val => {
              val.check = false;
              val.num = 1;
              if ((val.type === 2 && val.state === 1) || val.type === 9) {
                val.check = false;
                val.num = 1;
                lists.push(val);
              }
              console.log(LoginInfo.sale_type === 50);
              if (LoginInfo.sale_type === 50) {
                if (val.type === 3) {
                  val.check = false;
                  val.num = 1;
                  lists.push(val);
                }
              }
            });
            console.log(lists);
            this.setState({lists});
          }
        });
      });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  // 选择商品
  selectProduct(key) {
    const _lists = this.state.lists;
    if (key < 2) {
      _lists[0].check === false
        ? ToastAndroid.show(
            '目前只支持同时购买第一级和第二级滤芯！',
            ToastAndroid.SHORT,
          )
        : '';
      _lists[0].check = !this.state.lists[0].check;
      _lists[1].check = !this.state.lists[1].check;
    } else {
      _lists[key].check = !this.state.lists[key].check;
    }
    this.setState({lists: _lists});
    this.countPrice();
  }

  // 修改商品数量
  numPlusMinus(key, m) {
    const _lists = this.state.lists;
    if (m === 'plus') {
      if (key === 0 || key === 1) {
        _lists[0].num = _lists[0].num + 1;
        _lists[1].num = _lists[1].num + 1;
      } else {
        _lists[key].num = _lists[key].num + 1;
      }
    } else if (m === 'minus') {
      console.log(m === 'minus');
      if (_lists[key].num <= 1) {
        console.log(_lists[key].num);
        _lists[key].num = 1;
        ToastAndroid.show('商品数量不能小于1！', ToastAndroid.SHORT);
      } else {
        if (key === 0 || key === 1) {
          _lists[0].num = _lists[0].num - 1;
          _lists[1].num = _lists[1].num - 1;
        } else {
          _lists[key].num = _lists[key].num - 1;
        }
      }
    }
    this.setState({lists: _lists});
    this.countPrice();
  }

  // 统计所选择的商品价格
  countPrice() {
    const {lists} = this.state;
    let count = 0;
    lists.map(val => {
      if (val.check) {
        count = count + val.price * val.num;
      }
    });
    this.setState({count});
  }

  // 结算
  onClickClearing() {
    const {lists, count} = this.state;
    let products = {data: [], quantity: 0, total: count};
    lists.map(val => {
      if (val.check) {
        products.data.push({
          pid: val.pid,
          prev_image: val.prev_image,
          title: val.title,
          quantity: val.num,
          price: val.price,
        });
        products.quantity += val.num;
      }
    });

    if (products.data.length > 0) {
      this.props.navigation.navigate('Settlement', {
        products: products,
        type:'products'
      });
    } else {
      ToastAndroid.show('请选择商品！', ToastAndroid.SHORT);
    }
  }

  render() {
    const {lists, count, sale_type} = this.state;
    return (
      <ScrollView style={{flex:1}}>
        <View style={{height:width/1.7}}>
          <Swiper
            style={styles.wrapper}
            height={width/1.7}
            horizontal={true}
            autoplay={false}
            autoplayTimeout={10}
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
        <View>
          <Text style={styles.top}>----滤芯列表----</Text>
        </View>
        <View style={styles.lists}>
          <ScrollView>
            {lists.map((item, key) =>
              item.type === 2 ||
              item.type === 9 ||
              (sale_type === 50 && item.type === 3) ? (
                <View style={styles.item} key={key}>
                  <TouchableOpacity
                    onPress={() => {
                      this.selectProduct(key);
                    }}>
                    {item.check ? (
                      <Image
                        style={styles.iconfont}
                        source={require('../../images/round.png')}
                      />
                    ) : (
                      <Image
                        style={styles.iconfont}
                        source={require('../../images/round2.png')}
                      />
                    )}
                  </TouchableOpacity>
                  <Image
                    style={styles.itemImg}
                    source={{uri: `${item.prev_image}`}}
                    cache={'force-cache'}
                  />
                  <View>
                    <Text>{item.title}</Text>
                    <Text style={{color: '#FF8702'}}>￥ {item.price}.00</Text>
                  </View>
                  <View style={styles.tools}>
                    <TouchableOpacity
                      onPress={() => {
                        this.numPlusMinus(key, 'plus');
                      }}>
                      <Image
                        style={styles.toolsImg}
                        source={require('../../images/plus.png')}
                      />
                    </TouchableOpacity>
                    <Text style={styles.toolsNum}>{item.num}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.numPlusMinus(key, 'minus');
                      }}>
                      <Image
                        style={styles.toolsImg2}
                        source={require('../../images/reduce.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null,
            )}
          </ScrollView>
        </View>
        <View style={styles.buy}>
          <View style={styles.buyLeft}>
            <Text>合计：</Text>
            <Text style={{color: '#FF7A01'}}>{count}.00</Text>
            <Text>元</Text>
          </View>
          <View style={styles.buyRight}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.onClickClearing();
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                }}>
                立即购买
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    height: 20,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 20,
  },
  image: {
    width: width,
    height: width/1.7,
  },
  iconfont: {
    marginTop: 12,
    width: 15,
    height: 15,
  },
  itemImg: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight:5,
  },
  top: {
    textAlign: 'center',
    fontSize: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#bbb',
    padding: 10,
  },
  lists: {
    height: 280,
  },
  item: {
    padding: 10,
    height: 55,
    borderBottomWidth: 0.5,
    borderBottomColor: '#bbb',
    flexDirection: 'row',
    fontSize: 10,
  },
  tools: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  toolsImg: {
    marginTop: 5,
    width: 20,
    height: 20,
  },
  toolsImg2: {
    marginTop: 5,
    width: 21,
    height: 21,
  },
  toolsNum: {
    padding: 4,
  },
  buy: {
    flex: 0.1,
    flexDirection: 'row',
    padding: 10,
  },
  buyLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  buyRight: {
    flex: 0.3,
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#FF7A01',
    borderColor: '#FF7A01',
    color: '#FF7A01',
    textAlign: 'center',
    borderRadius: 5,
    width: 80,
    fontSize: 10,
    padding: 5,
  },

});
