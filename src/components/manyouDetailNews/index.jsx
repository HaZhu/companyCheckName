import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import CountdownTimer from '@/components/CountdownTimer';
import styles from './news.module.less';

export default function MendianNewsItem({ info = {} }) {
  return (
    <View
      className={`flex-row ${styles['news_item']}`}
      onClick={() => {
        Taro.navigateTo({
          url: `/pages/activeDetail/index?id=${info.id}`
        });
      }}
    >
      <View className={`flex-col ${styles['list_item']}`}>
        <View className={`flex-col ${styles['list_item_wrap']}`}>
          <Image mode='widthFix' src={info.bannerImage} className={`${styles['banner']}`} />
          <Text className={`${styles['title']}`}>{info.name}</Text>
          {
            info.status == 3 &&  <Image className={`flex-col ${styles['status_icon']}`} src='https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/5cd061e430e6da1bc6b9261112bea3494f3cd608.png'></Image>
          }
        </View>
        <View className={`justify-between ${styles['bottom_wrap']}`}>
          {/* <View className={`flex-row ${styles['tags']}`}>
            {Array.isArray(info.labelList) &&
              info.labelList.map((item) => {
                return <View className={`flex-col items-center ${styles['tag']}`}>{item.name}</View>;
              })}
          </View> */}
        
          <Text className={`${styles['date']}`}>结束时间：{info.createTime}</Text>
          {
            info.status == 2 && <CountdownTimer targetDate={info.endTime} />
          }
        </View>
        
       
      </View>
    </View>
  );
}
