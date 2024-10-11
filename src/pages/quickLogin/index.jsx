import { useState, useRef } from 'react';
import { View, Text,  Button } from '@tarojs/components';
import Taro, { useRouter, useDidHide } from '@tarojs/taro';
import BackIcon from '@/components/BackIcon';
import { getPhone } from '@/api';
import qs from 'qs';
import { setGlobalData } from '@/utils/global_data'
import { getLoginReturnUrl, showToast } from '@/utils';

import './index.less';

const QuickLogin = () => {
  const params = useRouter().params;
  const [agree, setAgree] = useState(false);
  // 登录成功回调
  const loginSuccessCallback = () => {
    getLoginReturnUrl();
  };
  const handleGetPhone = (e) => {
    if (!agree) {
      showToast('请先阅读并同意协议');
      return;
    }
    const { encryptedData, code, iv } = e.detail;
    if(!code){
      showToast('手机号未授权');
      return 
    }
    Taro.login({
      success: function (res) {
        if (res.code) {
          getPhone({
             getMobileCode: code,
             miniAppLoginCode: res.code
          }).then((result) => {
            if(result.data && result.data && result.data.token){
              setGlobalData('token', result.data.token);
              setGlobalData('userName', result.data.userNick);
             loginSuccessCallback();
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
}
  return (
    <View className='mine_wrap_unlogin'>
      <BackIcon></BackIcon>
      <View className='over_wrap'>
        <Button open-type='getPhoneNumber' onGetPhoneNumber={handleGetPhone} className='login_btn'>
          手机号快捷登录
        </Button>
      </View>
      <View className='agreement'>
        <View
          onClick={() => {
            setAgree(!agree);
          }}
          className={`iconfont agree_icon ${agree ? 'iconfill' : 'iconstroke'}`}
        ></View>
        我已阅读并同意
        {/* <Text
          className='xieyi'
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/agreement/index?type=3&title=用户协议`
            });
          }}
        >
          《用户协议》
        </Text>
        和 */}
        <Text
          className='xieyi'
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/agreement/index?type=1&title=隐私政策`
            });
          }}
        >
          《隐私政策》
        </Text>
      </View>
    </View>
  );
};

export default QuickLogin;
