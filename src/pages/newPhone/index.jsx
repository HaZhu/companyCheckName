import { Component } from 'react';
import { View, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import {  sendSms } from '@/api';
import { isValidMobile, showToast, setRequestRecord } from '@/utils';
import './index.less';

export default class NewPhone extends Component {
  state = {
    phone: ''
  };
  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '群觅'
    });
    setRequestRecord();
  }
  handleClick = () => {
    const { phone } = this.state;
    if (!phone) return;
    if (!isValidMobile(phone)) {
      return showToast('手机号格式不正确');
    }
  };
  captchaSuccess = (e) => {
    sendSms({
      phone: this.state.phone,
      token: e.detail,
      type: 2 // 短信类型：注册登录1，换绑新手机号2，校验老手机号3
    }).then((res) => {
      if (res.code === 200) {
        Taro.setStorageSync('captchPhone', this.state.phone);
        Taro.navigateTo({
          url: `/pages/smsCode/index?smsType=2&autoCountDown=true`
        });
      } else if (res.code === 255) {
        Taro.showModal({
          confirmColor: '#576B95',
          confirmText: '确定',
          showCancel: false,
          content: `该号码${this.state.phone}已被其他账号绑定，请更换其他号码`
        });
      }
    });
  };
  render() {
    const { phone } = this.state;
    const disabled = !phone;
    return (
      <View className='new_phone_wrapper'>
        <View className='title'>输入新手机号</View>
        <View className='tips'>更换后，下次可用新手机号登录</View>
        <Input
          className='ipt'
          placeholder='请输入手机号'
          type='number'
          maxlength='11'
          onInput={(e) => {
            this.setState({
              phone: e.detail.value
            });
          }}
        />
        <View className={`submit_btn ${disabled && 'disable'}`} onClick={this.handleClick}>
          下一步
        </View>
      </View>
    );
  }
}
