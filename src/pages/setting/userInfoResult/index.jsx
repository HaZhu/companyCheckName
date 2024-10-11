import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem, Text, Image } from '@tarojs/components';
import { useState,  useEffect } from 'react';
// import CloseBackIcon from '@/components/CloseBackIcon';
import { getUserExt } from '@/api/user';
import { setRequestRecord } from '@/utils';
import './index.less';

const userInfoResult = () => {
  
  const [userInfo, setUserInfo] = useState({
    bgm: {},
    shopWords: []
  });
  const handleGetUserInfo = async () => {
    const { data, code } = await getUserExt();
    if (code === 200) {
      setUserInfo(data);
    }
  };
  useEffect(() => {
    handleGetUserInfo();
    setRequestRecord();
  }, []);
  return (
    <View className='user_info_container'>
      {/* <CloseBackIcon isGoHome></CloseBackIcon> */}
      <View className='container_top_wrap'>
        <Image
          mode='aspectFit'
          className='top_bg'
          src='https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/8d33c2761f6061584f5647326d4b0aa5e6f59f43.png'
        ></Image>
      </View>
      <View className='container_bottom_wrap'>
        <View className='user_name'>{userInfo.nickName}</View>
        <View className='user_tag'>
          <Text>{userInfo.peopleFeature}</Text>
        </View>
        <View className='user_music'>
          <View className='music_autor'>{userInfo.bgm.author}</View>
          <View className='music_title'>{userInfo.bgm.name}</View>
        </View>
        <View>
          <View className='subtitle'>在群觅</View>
        </View>
        <View>
          <View className='subtitle'>摸不被定义的鱼</View>
        </View>
        <Swiper className='test-h' indicatorColor='#999' indicatorActiveColor='#333' circular indicatorDots>
          {userInfo.shopWords.map((item) => {
            return (
              <SwiperItem>
                <View className='demo-text'>{item}</View>
              </SwiperItem>
            );
          })}
        </Swiper>
      </View>
      <View className='btn_wrap'>
        <View
          className='white_btn'
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/setting/userInfo/index'
            });
          }}
        >
          再玩一次
        </View>
        <View
          className='black_btn'
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/coupons/myCoupon/index'
            });
          }}
        >
          查看奖励
        </View>
      </View>
    </View>
  );
};
export default userInfoResult;
