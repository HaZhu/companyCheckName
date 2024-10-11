import Taro, { clearStorageSync } from '@tarojs/taro';
import { View,  Image } from '@tarojs/components';
import {  useEffect } from 'react';
import { setGlobalData } from '@/utils/global_data'
import {  showToast, getLoginReturnUrl } from '@/utils';
import Arrow from '@/assets/arrowRight.png';
import {  userLogout } from '@/api';
import './index.less';

const menus = [
  // {
  //   path: '/pages/setting/about/index',
  //   icon: 'icona-48pt-jinggao-miaobian',
  //   text: '关于群觅',
  //   isIconFont: true,
  //   id: 'about'
  // },
  {
    icon: 'icona-icon48shanchu',
    text: '清除缓存',
    isIconFont: true,
    id: 'accountSave'
  },
];
const Setting = () => {
  const handleClickMenu = (item) => {
    if (item.path) {
      Taro.navigateTo({
        url: item.path
      });
      return;
    }
    if (item.id === 'accountSave') {
      clearStorageSync('HomeAd')
      clearStorageSync('hasOpenModal')
      clearStorageSync('hasShowPopup')
      clearStorageSync('hasGuide')
      showToast('清理成功');
      return;
    }
  };
  const handleLogout = () => {
    userLogout().then(() => {
        setGlobalData('token','')
        Taro.removeStorageSync('userInfo');
        showToast('已退出登录');
        getLoginReturnUrl('/pages/home/index');
    }) 
  }
  return (
    <View className='setting_container'>
      <View className='page_title'>设置</View>
      <View className='menus'>
        {menus.map((item) => {
          return item.id === 'ticket' ? null : (
            <View className='menu' hoverClass='hover_light' key={item.text} onClick={() => handleClickMenu(item)}>
              <View className='menu_left'>
                {item.isIconFont ? <View className={`iconfont ${item.icon}`}></View> : <Image className='icon' src={item.icon} />}
                {item.text}
              </View>
              <View className='menu_right'>
                <Image className='arrow' src={Arrow}></Image>
              </View>
            </View>
          );
        })}
      </View>
      <View className='logout' onClick={handleLogout}>退出登录</View>
    </View>
  );
};
export default Setting;
