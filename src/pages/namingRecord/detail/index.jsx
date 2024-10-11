import React, { useState, useEffect, useRef } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import SwiperComp from '@/components/CommonSwiper';
import NewBackIcon from '@/components/NewBackIcon';
import { useGetBarHeight } from '@/hooks';
import {  showToast} from '@/utils';
import { productInfo,createOrder, payment, queryPayResult } from '@/api';
import SendBoxs from '../component/send/index';
import ExChange from '../component/exChange';
import styles from './coupondetail.module.less';

export default function GetCouponDetail() {
  const params = useRouter().params;
  const getChildRef = useRef();
  const [sendNumShow, setShow] = useState(false);
  const [detail, setDetail] = useState({});
  const [bannerHeight, setBannerHeight] = useState(375);
  const [showExChange, setShowExChange] = useState(false);
  const [code, setCode] = useState(200);
  const [message, setMessage] = useState('购买成功');
  const { barHeight, titleBarHeight } = useGetBarHeight();
  const getPointDetail = async () => {
    const res = await productInfo(params.id);
    let _detail = res.data;
    _detail.bannerImage = _detail.bannerImage?  _detail.bannerImage.split(',') : [];
    setDetail(_detail);
  };
  const sureVerb = async () => {
    const nums = getChildRef.current.sendNum;
    if (nums <= 0) return;
    const addressInfo = getChildRef.current.addressInfo;
    if((!addressInfo || !addressInfo.address || !addressInfo.consignee || !addressInfo.contactPhone)){
        showToast("请检查地址信息是否填写")
        return 
    }
    setShow(false);
    let _params = {
      productId: params.id,
      buyNum: nums,
      contactor:  addressInfo.consignee,
      contactorPhone:  addressInfo.contactPhone,
      contactorAddress:  addressInfo.address,
      transport: 0,
      totalAmount: (nums * detail.price),
    }
    const res = await createOrder(_params);
    if (res.code === 200) {
      const { code } = await Taro.login()
      Taro.showLoading({ title: '加载中',mask : true});
      payment({
        orderNo: res.data.orderNo,
        payType: 'weixin',
        jsCode: code
      }).then((r) => {
        if (r.code === 200) {
          const { wxPayConfig , payOrderId } = r.data;
          const payParams = {
            timeStamp: wxPayConfig.timeStamp,
            nonceStr: wxPayConfig.nonceStr,
            package: wxPayConfig.packages,
            signType: wxPayConfig.signType,
            paySign: wxPayConfig.paySign
          };
          Taro.requestPayment({
            ...payParams,
            success: () => {
                queryPayResult({
                  orderNo: res.data.orderNo,
                })
                setShowExChange(true);
                setCode(200);
                setMessage('下单成功');
            },
            fail: () => {
              
            },
            complete: () => {
              Taro.hideLoading();
            }
          });
        } else {
          Taro.hideLoading();
          Taro.showToast({
            title: r.msg ? r.msg : `支付失败`,
            icon: 'none',
            duration: 2000
          });
        }
      })
      .catch(() => {
        Taro.hideLoading();
      });

    } else if (res.code === 121) {
      Taro.showToast({
        title: res.msg,
        icon: 'error',
        duration: 2000
      });
    }
  };

  useEffect(() => {
    getPointDetail();
    Taro.getSystemInfo({
      success: function (res) {
        setBannerHeight(res.windowWidth);
      }
    });
  }, []);
  return (
    <View className={`flex-col ${styles['group_2']} ${styles['space-y-32']}`}>
      <NewBackIcon></NewBackIcon>
      <View className={`fiexd_title ${styles['fiexd_title_1']}`} style={{ height: titleBarHeight + 'px', paddingTop: barHeight + 'px', opacity: 1 }}>
      </View>
      <View style={{ height: titleBarHeight + barHeight + 'px', opacity: 1 }}></View>
      <View className={`flex-col ${styles['space-y-20']}`}>
        <View className={`flex-col justify-start items-center ${styles['section_3']}`}>
          <SwiperComp urls={detail.bannerImage} height={`${bannerHeight}px`}></SwiperComp>
        </View>
        <View className={`flex-col ${styles['group_4']} ${styles['space-y-36']}`}>
          <View className='flex-col'>
            <Text className={`${styles['font_1']} ${styles['text_2']}`}>{detail.name}</Text>
            <Text className={`${styles['font_2']} ${styles['text_5']}`}>剩余 {detail.stock} {detail.unitName}</Text>
            <View className={`flex-row ${styles['group_5']}`}>
              <Text className={`${styles['text_6']}`}>¥{detail.price}</Text>
            </View>
          </View>
          <View className={`flex-col ${styles['space-y-12']}`}>
            <Text className={`${styles['font_1']} ${styles['text_10']}`}>购买规则</Text>
            <View className='flex-col'>
              <Text className={`${styles['font_44']}`}>{detail.intro}</Text>
            </View>
          </View>
          <View className={`flex-col ${styles['space-y-12']}`}>
            <Text className={`${styles['font_1']} ${styles['text_11']}`}>商品详情</Text>
            <View className={`flex-col ${styles['space-y-24']}`}>
              <View className='flex-col' style='margin-bottom:20px'>
                <Text className={`${styles['font_44']}`}>{detail.detail}</Text>
              </View>
              <View className={`${styles['space-y-13']}`}>
                {Array.isArray(detail.detailImages) &&
                  detail.detailImages.map((item) => {
                    return <Image className={`${styles['image_9']}`} mode='widthFix' src={item} />;
                  })}
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className={`flex-col justify-start ${styles['section_7']}`}>
        <View
          className={`flex-col items-center ${styles['button']} ${styles['space-y-8']}`}
          onClick={() => {
            setShow(true);
          }}
        >
          <Text className={`${styles['font_4']} ${styles['text_12']}`}>¥{detail.price} 立即购买</Text>
        </View>
      </View>
      {sendNumShow && (
        <SendBoxs
          ref={getChildRef}
          oneNumNeedPoint={detail.price}
          surplusCount={detail.stock}
          onSure={sureVerb}
          onClose={() => {
            setShow(false);
          }}
        ></SendBoxs>
      )}
      {showExChange && (
        <ExChange
          message={message}
          code={code}
          type={detail.type}
          handleHide={() => {
            setShowExChange(false);
          }}
        ></ExChange>
      )}
    </View>
  );
}
