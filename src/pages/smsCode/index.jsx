import { Component } from 'react';
import { View, Input, Block } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { getPromotionInviteInfo, sendSms, loginV2, updatePhone, checkOriginPhone } from '@/api';
import { normalizePhone, showToast, getLoginReturnUrl } from '@/utils';
import { setGlobalData } from '@/utils/global_data'

import './index.less';

let timers;
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      codes: new Array(6).fill(),
      isFocus: false,
      smsType: 1, // 注册登录1，换绑新手机号2，校验老手机号3
      count: 60,
      clickCode: false,
      captchPhone: ''
    };
  }
  componentDidMount() {
    this.params = getCurrentInstance().router.params;
    this.captchPhone = Taro.getStorageSync('captchPhone');
    this.captchToken = Taro.getStorageSync('captchToken');
    Taro.setNavigationBarTitle({
      title: '群觅'
    });
    this.setState(
      {
        isFocus: true,
        smsType: this.params.smsType ? +this.params.smsType : 1,
        captchPhone: normalizePhone(this.captchPhone)
      },
      () => {
        if (!this.params.autoCountDown) {
          this.handleSendCode();
        } else {
          this.countDown();
        }
      }
    );
  }
  // 发送验证码
  handleSendCode = () => {
    const { smsType } = this.state;
    sendSms({
      phone: this.captchPhone,
      token: this.captchToken,
      type: smsType // 短信类型：注册登录1，换绑新手机号2，校验老手机号3
    }).then((res) => {
      if (res.code === 200) {
        this.countDown();
      }
    });
  };
  countDown = () => {
    if (this.state.clickCode) return;
    this.setState({
      count: 60,
      clickCode: true
    });
    clearInterval(this.timer);
    this.startTime = new Date().getTime();
    this.timer = setInterval(() => {
      let countDownTime = Math.round(60 - (new Date().getTime() - this.startTime) / 1000);
      if (countDownTime <= 0) {
        this.setState({
          count: 60,
          clickCode: false
        });
        clearInterval(this.timer);
      } else {
        this.setState({
          count: countDownTime
        });
      }
    }, 1000);
  };
  /**
     * 赠票登录优化
        - 用户点击微信内分享进入接受赠票页面时：
        - 先判断该用户是否有登录小程序，如果没有登录，显示小程序登录界面，此时登录成功后判断该用户是否已经接受过赠票，如果没有接受过赠票，走正常接受赠票的流程；如果已经接受过赠票，自动跳转到订单二维码界面。
        - 如果用户已经登录且已经接受过赠票，点击微信内分享进入小程序时直接自动跳转到订单二维码页面。
        - 如果用户已经登录但未接受过赠票，正常走接受赠票的流程。
     */
  handleShareActivity = async () => {
    // 如果用户已经登录
    let { code, data } = await getPromotionInviteInfo({ activityId: this.params.activityId, inviteCode: this.params.code });
    if (code === 200) {
      if (data.isAcceptInvitation != 1) {
        // 已经接受过赠票，点击微信内分享进入小程序时直接自动跳转到订单二维码页面
        Taro.reLaunch({
          url: `/pages/orderDetail/index?orderId=${data.orderId}`
        });
      } else {
        Taro.reLaunch({
          url: `/pages/shareCoupon/home/index?${qs.stringify(this.params)}`
        });
      }
    }
  };
  // 登录成功回调
  loginSuccessCallback = () => {
    // 有邀请码
    if (this.params.code) {
      this.handleShareActivity();
    } else {
      getLoginReturnUrl();
    }
  };
  handleInput = (e) => {
    const arr = e.detail.value.split('');
    const { codes, smsType } = this.state;
    let that = this;
    const newCodes = arr.length < codes.length ? [...arr, ...new Array(codes.length - arr.length).fill()] : arr;
    that.setState(
      {
        codes: newCodes
      },
      () => {
        if (newCodes.length >= 6 && !!newCodes[newCodes.length - 1]) {
          switch (smsType * 1) {
            case 1:
              clearTimeout(timers);
              timers = setTimeout(() => {
                that.handleLogin();
              }, 500);
              break;
            case 2:
              clearTimeout(timers);
              timers = setTimeout(() => {
                that.handleChangePhone();
              }, 500);
              break;
            case 3:
              clearTimeout(timers);
              timers = setTimeout(() => {
                that.handleCheckPhone();
              }, 500);
              break;
          }
        }
      }
    );
  };
  handleCheckPhone = () => {
    checkOriginPhone({
      code: this.state.codes.join(''),
      originPhone: this.captchPhone
    }).then((res) => {
      if (res.code === 200 && !!res.data) {
        Taro.navigateTo({
          url: `/pages/newPhone/index`
        });
      } else {
        showToast('验证码错误');
      }
    });
  };
  handleChangePhone = () => {
    updatePhone({
      code: this.state.codes.join(''),
      newPhone: this.captchPhone
    }).then((res) => {
      if (res.code === 200) {
        showToast('更换手机号成功');
        setTimeout(() => {
          this.loginSuccessCallback();
        }, 500);
      }
    });
  };
  handleLogin = () => {
    const shopId = Taro.getStorageSync('shopId') || '';
    let that = this;
    Taro.login({
      success: function (res) {
        if (res.code) {
          loginV2({
            clientType: 2,
            code: that.state.codes.join(''),
            phone: that.captchPhone,
            shopId,
            jsCode: res.code
          }).then((result) => {
            if (result.code === 200) {
              showToast('登录成功');
              setGlobalData('token',result.data)
              setTimeout(() => {
                that.loginSuccessCallback();
              }, 500);
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  };
  render() {
    const { codes, isFocus, smsType, count, clickCode, captchPhone } = this.state;
    return (
      <View className='smscode_wrapper'>
        {smsType === 1 || smsType === 2 ? (
          <Block>
            <View className='title'>输入验证码</View>
            <View className='tips'>验证码已发送至 {captchPhone}</View>
          </Block>
        ) : (
          <Block>
            <View className='verify_title'>为了您的账户安全，</View>
            <View className='verify_title'>需要验证您的手机{captchPhone}</View>
          </Block>
        )}

        <View
          className='labels'
          onClick={() => {
            !isFocus &&
              this.setState({
                isFocus: true
              });
          }}
        >
          {codes.map((item, index) => (
            <View className={`label ${codes[index] && 'active'}`} key={index}>
              {codes[index]}
            </View>
          ))}
        </View>
        {clickCode ? (
          <View className='tips1'>{count}秒后可重新获取</View>
        ) : (
          <View className='tips1 tips1_again' onClick={this.handleSendCode}>
            重新获取验证码
          </View>
        )}
        <View
          className='tips2'
          onClick={() => {
            Taro.makePhoneCall({
              phoneNumber: Taro.getStorageSync('serviceTel')
            });
          }}
        >
          无法接收验证码，请联系客服
        </View>
        <Input
          className='ipt'
          autoFocus
          focus={isFocus}
          type='number'
          maxlength='6'
          onInput={this.handleInput}
          onBlur={() => {
            this.setState({
              isFocus: false
            });
          }}
        />
      </View>
    );
  }
}
