import Taro from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import dayjs from 'dayjs';
import {itemList,orderPay} from '@/api'
import PNG1 from '@/imgs/1.png'
import { showToast } from '@/utils';

import './index.less';
import { useEffect, useState } from 'react';

const HomeAd = ({ onClose, onPayClose }) => {
  const [priceList,setPriceList] = useState([])
  const [priceItem,setPriceItem] = useState(null)
  const getList = async () => {
     const res = await itemList();
     setPriceList(res.data)
     setPriceItem(res.data[0])
  }
  const handlePay = async () => {
     const res = await orderPay({
      "itemId": priceItem.id,
      "namingNum":  priceItem.namingNum,
      "orderAmount":  priceItem.item_amount
     });
     const payParams = {
      appId: res?.data?.wxPayMpOrderResult.appId,
      timeStamp: res?.data?.wxPayMpOrderResult.timeStamp,
      nonceStr: res?.data?.wxPayMpOrderResult.nonceStr,
      package: res?.data?.wxPayMpOrderResult.packageValue,
      signType: 'MD5',
      paySign: res?.data?.wxPayMpOrderResult.paySign
    };
    Taro.showLoading({mask : true});
    Taro.requestPayment({
      ...payParams,
      success: () => {
        showToast('支付成功')
        onPayClose()
      },
      complete: () => {
        Taro.hideLoading();
      }
    });
  }
  useEffect(() => {
    getList()
  },[])
  return (
    <View className='guide_wrap'>
      <View className='swiper_box'>
        <Image mode="aspectFill" className='banner_img' src={PNG1}></Image>
        <View className='payChose'>
          {
            priceList.map(item => {
              return    <View className={`pay_item ${item.id == priceItem.id  && 'active' }`} onClick={() => {
                setPriceItem(item)
              }}>
                  <View className='pay_item_lf'>{item.name}</View>
                  <View className='pay_item_rt'>可免费{item.namingNum}次</View>
              </View>
            })
          }
           <View className='pay_item_btn' onClick={handlePay}>
              支付
           </View>
        </View>
      </View>
      <View className='closeWrap' onClick={onClose}>
           <View className='iconfont iconguanbi'></View>
        </View>
    </View>
  );
};

export default HomeAd;
