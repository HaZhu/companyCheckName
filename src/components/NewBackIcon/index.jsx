import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useGetBarHeight } from '@/hooks';
import './index.less';

const BackIcon = (props) => {
  const [pageLength, setPageLength] = useState(() => Taro.getCurrentPages().length);
  const { barHeight } = useGetBarHeight();
  const handleBack = () => {
    if (props.backFnc) {
      props.backFnc();
      return;
    } // 主要是有音乐实例的页面需要销毁实例
    if (pageLength <= 1) {
      Taro.switchTab({ url: '/pages/home/index' });
    } else {
      Taro.navigateBack({
        delta: 1
      });
    }
  };
  return <View className='newBackWrap' onClick={handleBack} style={{ top: barHeight + 6 + 'px' }}>
    <View  className='iconfont iconzuo' style={{color: '#fff' }}></View>
  </View>;
};

export default BackIcon;
