import React, { useState, useRef, useEffect } from 'react';
import Taro, { useRouter, useShareTimeline, useShareAppMessage } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import SwiperComp from '@/components/CommonSwiper';
import { informationDetail,activityRank, activityBuy} from '@/api';
import { escape2Html } from '@/utils';
import SendBoxs from './component/send/index';

import './index.less';

const ActiveDetail = () => {
  const params = useRouter().params;
  const [detail, setDetail] = useState({});
  const [rankList,setRankList]= useState([]);
  const [sendNumShow, setShow] = useState(false);
  const [banners,setBanners] = useState([]);
  const [showExChange, setShowExChange] = useState(false);
  const [code, setCode] = useState(200);
  const [message, setMessage] = useState('成功投注');
  const getChildRef = useRef();

  const getDetail = async () => {
    const res = await informationDetail(params.id);
    setDetail(res.data);
    if(res.data.bannerImage ){
      setBanners(res.data.bannerImage.split(','))
    }
  };
  const getRank = async () => {
    const res = await activityRank(params.id);
    setRankList(res.data);
  };
  const handleBuy = async () => {
    const nums = getChildRef.current.sendNum;
    const res = await activityBuy({
      activityId: params.id,
      buyNum: nums
    });
    if(res.code == 200){
      setShow(false)
      setShowExChange(true);
      setCode(200);
      setMessage('下单成功');
    }
  };
  const stylefn = (index) => {
     switch(index){
       case 0:
        return '#E13EDB'
      case 1:
        return '#8D4EDA'
      case 2:
        return '#FBE842'
     }
  }
  useShareTimeline(() => {
    return {
      title: detail.shareTitle,
      path: `/pages/activeDetail/index?id=${params.id}&from=0`,
      imageUrl: detail.shareImage
    };
  });
  useShareAppMessage(() => {
    return {
      title: detail.shareTitle,
      path: `/pages/activeDetail/index?id=${params.id}&from=0`,
      imageUrl: detail.shareImage
    };
  });
  useEffect(() => {
    getDetail();
    getRank()
  }, []);
  return (
    <View className='news_detail_box'>
      <SwiperComp urls={banners} height='500rpx'></SwiperComp>
      <View className='main_title'>{detail.name}</View>
      <View className='taro_html p40' dangerouslySetInnerHTML={{ __html: detail.detail && escape2Html(detail.detail) }}
      ></View>
      <View className='p40' style="padding-bottom: 100px;">
        <View className='line'></View>
        {rankList.length > 0 && (
          <>
            <View className='sub_title'>{detail.status == 2 ? '当前排名' : '获奖用户'}</View>
            <View style='margin-top:16px'></View>
             {
              rankList.map((item,index) => {
                return  <View className='pm_box'>
                    <View className='pm_box_lf' style={`color: ${stylefn(index)}`}>
                      <Text>{index + 1} </Text>
                      <Text >{item.nickname } </Text>
                    </View>
                    <View style={`color: ${stylefn(index)}`} className='pm_box_rt'>{item.num}积分</View>
                </View>
              })
            }
          </>
        )}
      </View>
      <View className={`flex-col justify-start button_wrap`}>
        <View
          className={`flex-col items-center button_wrap_content`}
          onClick={() => {
            setShow(true);
          }}
        >
          <Text>参与活动</Text>
        </View>
      </View>
      {sendNumShow && (
        <SendBoxs
          ref={getChildRef}
          onSure={handleBuy}
          onClose={() => {
            setShow(false);
          }}
        ></SendBoxs>
      )}
        {showExChange && (
        <ExChange
          message={message}
          code={code}
          handleHide={() => {
            setShowExChange(false);
          }}
        ></ExChange>
      )}
    </View>
  );
};
export default ActiveDetail;
