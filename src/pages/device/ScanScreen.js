
import { RNCamera } from 'react-native-camera'
import React, {Component} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableOpacity,
  Animated,
  PermissionsAndroid,
  default as Easing,
  ImageBackground,
} from 'react-native';


class ScanScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moveAnim: new Animated.Value(0),
      state:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '扫描二维码',
    };
  };

  componentDidMount() {
    let state = this.props.navigation.getParam('state');
    this.setState({state})
    this.startAnimation();
  }

  startAnimation = () => {
    this.state.moveAnim.setValue(0);
    Animated.timing(
      this.state.moveAnim,
      {
        toValue: -200,
        duration: 1500,
        easing: Easing.linear
      }
    ).start(() => this.startAnimation());
  };
  //  识别二维码
  onBarCodeRead = (result) => {
    const { navigate } = this.props.navigation;
    const {state} = this.state;
    const {data} = result;
    const codeReg = /^[abcdefh\d]{6,16}$/i;
    if (codeReg.test(data)) {
      ToastAndroid.show(
        "设备扫码成功！",
        ToastAndroid.SHORT
      );
      if (state==='add'){
        this.props.navigation.navigate('Activation', {
          eid: data
        })
      }else if (state==='fix'){
        this.props.navigation.navigate('Fix', {
          eid: data
        })
      }

    }else{
      ToastAndroid.show(
        "错误，不是有效的设备ID，请扫描正确的二维码！",
        ToastAndroid.SHORT
      );
      if (this.state==='add'){
        this.props.navigation.navigate('AddDevice')
      }else if (state==='fix'){
        this.props.navigation.navigate('Fix')
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onBarCodeRead={this.onBarCodeRead}
        >
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle}/>
            <Animated.View style={[
              styles.border,
              {transform: [{translateY: this.state.moveAnim}]}]}/>
            <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
          </View>
        </RNCamera>
      </View>
    );
  }
}

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rectangle: {
    height: 200,
    width: 200,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10
  },
  border: {
    flex: 0,
    width: 200,
    height: 2,
    backgroundColor: '#00FF00',
  }
});
