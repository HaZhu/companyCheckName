import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Input, Button } from '@tarojs/components';
import Close from '@/assets/close.png';
import styles from './send.module.less';

const SendBoxs = ({ onClose, surplusCount, oneNumNeedPoint, onSure }, ref) => {
  const [sendNum, setSendNum] = useState(0);
  const [canSendNum, setCanSendNum] = useState(() => {
    return  surplusCount ? surplusCount : 99999
  });
  const [addressInfo,setAddressInfo] = useState({
    address: "",
    consignee: "",
    contactPhone: ""
  })
  const handleChangeInput = (e) => {
    const { value } = e.detail;
    if (+value >= canSendNum) {
      setSendNum(sendNum == canSendNum ? 0 : canSendNum);
      return `${canSendNum}`;
    } else {
      setSendNum(+value ? +value : 0);
    }
  };
  const handleReduceSendNum = () => {
    if (sendNum <= 0) return;
    setSendNum((num) => {
      return num - 1;
    });
  };
  const handleAddSendNum = () => {
    if (sendNum >= canSendNum) return;
    setSendNum((num) => {
      return num + 1;
    });
  };
  const handleChoseAddress = () => {
    Taro.chooseAddress({
      success: function (res) {
        const _addressInfo = {
          address : `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`,
          consignee: res.userName,
          contactPhone: res.telNumber
        }
        setAddressInfo(_addressInfo)
        Taro.setStorageSync("userAddress", JSON.stringify(_addressInfo));

      }
    })
  }
  useEffect(() => {
    const _addressInfo = Taro.getStorageSync("userAddress");
    if(_addressInfo){
      setAddressInfo(JSON.parse(_addressInfo))
    }else{
      setAddressInfo(null)
    }
  },[])
  useImperativeHandle(ref, () => ({
    sendNum: sendNum,
    addressInfo: addressInfo
  }));
  return (
    <View className={`flex-col ${styles['send_box']}`}>
      <View className={`flex-col  ${styles['section_3']}`}>
        <View className={`flex-row justify-center ${styles['section_4']}`}>
          <Text className={`${styles['font_4']} ${styles['text_7']}`}>确认兑换</Text>
          <View onClick={onClose} className={`${styles['image_4_box']}`}>
            <Image className={`${styles['image_4']}`} src={Close} />
          </View>
        </View>
          <View className={`${styles['pd-40']}`}>
            {
              addressInfo ? 
                <View className={`flex-col ${styles['group_5']} ${styles['space-y-6']}`} onClick={handleChoseAddress}>
                  <View className={`${styles['group_7_title']}`}>收件人信息</View>
                  <View className={`flex-row items-baseline ${styles['space-x-12']}`}>
                    <Text className={`${styles['font_1']}`}>{addressInfo.consignee}</Text>
                    <Text className={`${styles['font_2']}`}>{addressInfo.contactPhone}</Text>
                  </View>
                  <View className={`flex-row items-start ${styles['space-x-20']}`}>
                    <View className={`flex-auto ${styles['font_3']} ${styles['text_4']}`}>
                      {addressInfo.address}
                    </View>
                    <View className={`iconfont iconduanjiantou-you shrink-0 ${styles['image_555']}`}>
                    </View>
                  </View>
                </View> : <View className={`flex-col ${styles['group_55']} ${styles['space-y-6']}`} onClick={handleChoseAddress}>
                  <View className={`${styles['group_7_title']}`}>收件人信息</View>
                  <View className='flex-row justify-between'>
                  <View className={`flex-row ${styles['space-x-20']}`}>
                    <View className={`iconfont icona-48pt-jinggao-miaobian shrink-0 ${styles['image_55']}`}></View>
                    <View className={`flex-auto ${styles['font_3']} ${styles['text_4']}`}>
                      设置收货地址
                    </View>
                  </View>
                  <View className={`iconfont iconduanjiantou-you shrink-0 ${styles['image_555']}`}>
                  </View>
                  </View>
                </View>
            }
          </View>
        <View className={` items-center  ${styles['space-y-24']} ${styles['group_7']}`}>
          <View className={`${styles['group_7_title']}`}>购买数量</View>
          <View className={`flex-row justify-between ${styles['section_5']}`}>
            <View className={`${styles['input_wrap']} ${sendNum >= canSendNum && styles['disabled']}`}>
              <View className={`${styles['iconfont_box']}`} onClick={handleReduceSendNum}>
                <View className={`iconfont ${styles['iconfont']} iconstroke1 ${sendNum <= 0 && styles['disabled']}`}></View>
              </View>
              <Input className={`${styles['input_box']}`} value={sendNum} type='number' onInput={handleChangeInput}></Input>
              <View className={`${styles['iconfont_box']}`} onClick={handleAddSendNum}>
                <View className={` iconfont ${styles['iconfont']} iconstroke2 ${sendNum >= canSendNum && styles['disabled']}`}></View>
              </View>
            </View>
          </View>
        </View>
        <View
          className={`flex-col justify-start ${styles['section_7']}`}
          onClick={() => {
            onSure();
          }}
        >
          <View className={`flex-col items-center ${styles['button']} ${styles['space-y-8']} ${sendNum == 0 ? styles['c-gray'] : ''}`}>
            <Text className={`${styles['font_4']} ${styles['text_12']}`}>¥{oneNumNeedPoint * sendNum} 立即购买</Text>
            {/* <Text className={`${styles['font_3']} ${styles['text_13']}`}>{oneNumNeedPoint * sendNum}积分</Text> */}
          </View>
        </View>
      </View>
    </View>
  );
};
export default forwardRef(SendBoxs);
