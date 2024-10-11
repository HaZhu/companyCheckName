import Taro, {  useDidHide, useDidShow } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { useState, useRef, useEffect } from 'react';
import { getUserAuthInfo, userRemove } from '@/api';
import { getLoginReturnUrl } from '@/utils';
import Arrow from '@/assets/arrowRight.png';
import { setGlobalData } from '@/utils/global_data'
import RealnameIcon from '@/assets/realname.png';
import Captcha from '@/components/Captcha';
import MobileIcon from '@/assets/mobile.png';
import './index.less';

const menus = [
  {
    path: '/pages/realname/index',
    icon: RealnameIcon,
    text: '实名认证',
    id: 'realname'
  },
  {
    path: '',
    icon: MobileIcon,
    text: '手机号',
    id: 'phone'
  },
  {
    isIconfont: true,
    text: '注销账户',
    id: 'cancellation'
  }
];
const AccountSave = (props) => {
  const [isRealname, setIsRealname] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const captcha = useRef();
  const handleClickMenu = (item) => {
    if (item.id === 'realname' && isRealname) {
      return Taro.showToast({
        title: '已实名',
        icon: 'none'
      });
    }
    if (item.id === 'cancellation') {
      return Taro.showModal({
        confirmColor: '#576B95',
        confirmText: '确定注销',
        cancelColor: '#000000',
        cancelText: '取消',
        content: '账号注销后，将无法恢复',
        success: (res) => {
          if (res.confirm) {
            userRemove().then(() => {
              setGlobalData('token','')
              Taro.removeStorageSync('userInfo');
              getLoginReturnUrl('/pages/home/index');
            });
          }
        }
      });
    }
    if (item.id === 'phone') {
      return Taro.showModal({
        confirmColor: '#576B95',
        confirmText: '确定',
        cancelColor: '#000000',
        cancelText: '取消',
        content: '更换绑定的手机号？',
        success: (res) => {
          if (res.confirm) {
            captcha.current.show();
          }
        }
      });
    }
    if (item.path) {
      Taro.navigateTo({
        url: item.path
      });
      return;
    }
  };
  const handleGetUserInfo = () => {
    getUserAuthInfo().then((res) => {
      if (res.code === 200) {
        setUserInfo(res.data);
        Taro.setStorageSync('userInfo', res.data);
        setIsRealname(!!res.data.auth);
      }
    });
  };
  const captchaSuccess = (e) => {
    Taro.setStorageSync('captchPhone', userInfo.phone);
    Taro.navigateTo({
      url: '/pages/smsCode/index?smsType=3'
    });
  };
  useDidHide(() => {
    captcha.current && captcha.current.captchaHide();
  });
  useDidShow(() => {
    handleGetUserInfo();
  });
  return (
    <View className='account_save_container'>
      <View className='page_title'>账号安全</View>
      <View className='menus'>
        {menus.map((item, index) => {
          return item.id === 'ticket' && !isAuth ? null : (
            <View className='menu' hoverClass='hover_light' key={item.text} onClick={() => handleClickMenu(item)}>
              <View className='menu_left'>
                {item.isIconfont ? <View className='iconfont iconzhuxiao'></View> : <Image className='icon' src={item.icon} />}
                {item.text}
              </View>
              <View className='menu_right'>
                {item.id === 'realname' ? (
                  <Text style={{ color: isRealname ? 'rgba(0, 0, 0, 0.6)' : 'green' }}>{isRealname ? '已实名' : '待实名'}</Text>
                ) : null}
                {item.id === 'phone' ? userInfo.phone : ''}
                <Image className='arrow' src={Arrow}></Image>
              </View>
            </View>
          );
        })}
      </View>
      <Captcha ref={captcha} onSuccess={captchaSuccess} />
    </View>
  );
};
export default AccountSave;
