import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import {  useEffect } from 'react';
import {  setRequestRecord } from '@/utils';
import Arrow from '@/assets/arrowRight.png';
import Logo from '@/assets/logo.png';

import './index.less';
// 条款类型 1：隐私政策 2：协议条款 3：进入规定及事项 4：积分规则 5：关于我们
const menus = [
  {
    path: '/pages/agreement/index?type=5&title=公司信息',
    icon: 'icona-tubiao',
    text: '公司信息',
    isIconFont: true,
    id: 'userInfo'
  },
  {
    path: '/pages/agreement/index?type=2&title=协议条款',
    icon: 'icona-icon48zhanghaoanquan',
    text: '服务条款',
    isIconFont: true,
    id: 'accountSave'
  },
  {
    path: '/pages/agreement/index?type=1&title=隐私政策',
    icon: 'icona-48pt-jinggao-miaobian',
    text: '隐私政策',
    isIconFont: true,
    id: 'about'
  },
  {
    path: '/pages/agreement/index?type=4&title=会员政策',
    icon: 'icona-icon48shanchu',
    text: '会员政策',
    isIconFont: true,
    id: 'accountSave'
  }
];
const About = (props) => {
  const handleClickMenu = (item) => {
    if (item.path) {
      Taro.navigateTo({
        url: item.path
      });
      return;
    }
  };
  useEffect(() => {
    setRequestRecord();
  }, []);
  return (
    <View className='about_container'>
      <View className='page_title'>关于群觅</View>
      <View className='logo_wrap'>
        <Image className='logo' src={Logo}></Image>
        <View className='title'>群觅小程序V3.0.0</View>
      </View>
      <View className='menus'>
        {menus.map((item, index) => {
          return (
            <View className='menu' hoverClass='hover_light' key={item.text} onClick={() => handleClickMenu(item)}>
              <View className='menu_left'>{item.text}</View>
              <View className='menu_right'>
                <Image className='arrow' src={Arrow}></Image>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default About;
