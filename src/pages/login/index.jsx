import { Component } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import qs from 'qs';
import { isValidMobile, showToast } from '@/utils';
import './index.less';

export default class Login extends Component {
  state = {
    phone: '',
    agree: false,
    disabled: true
  };
  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '群觅'
    });
    this.params = getCurrentInstance().router.params;
  }
  handleClick = () => {
    const { phone, agree } = this.state;
    if (!agree) {
      showToast('请先阅读并同意协议');
      return;
    }
    if (!phone) return;
    if (!isValidMobile(phone)) {
      return showToast('手机号格式不正确');
    }
  };
  handleInputPhone = (e) => {
    if (isValidMobile(e.detail.value)) {
      this.setState({
        phone: e.detail.value,
        disabled: false
      });
    } else {
      this.setState({
        phone: e.detail.value,
        disabled: true
      });
    }
  };

  render() {
    const { phone, disabled, agree } = this.state;
    return (
      <View className='login_wrapper'>
        <View className='title'>欢迎登录群觅</View>
        <Input className='ipt' placeholder='请输入手机号' maxlength={11} type='number' value={phone} onInput={this.handleInputPhone} />
        <View className='tips'>未注册的手机号验证后自动创建群觅账户</View>
        <View className={`submit_btn ${disabled && 'disable'}`} onClick={this.handleClick}>
          获取验证码
        </View>
        <View className='agreement'>
          <View
            onClick={() => {
              this.setState({
                agree: !agree
              });
            }}
            className={`iconfont agree_icon ${agree ? 'iconfill' : 'iconstroke'}`}
          ></View>
          我已阅读并同意
          <Text
            className='xieyi'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/agreement/index?type=3&title=用户协议`
              });
            }}
          >
            《用户协议》
          </Text>
          和
          <Text
            className='xieyi'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/agreement/index?type=1&title=隐私政策`
              });
            }}
          >
            《隐私协议》
          </Text>
        </View>
      </View>
    );
  }
}
