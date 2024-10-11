import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Input, Button } from '@tarojs/components';
import Close from '@/assets/close.png';
import { purseAccount } from '@/api';
import styles from './send.module.less';

const SendBoxs = ({ onClose,  onSure }, ref) => {
  const [sendNum, setSendNum] = useState(0);
  const [canSendNum, setCanSendNum] = useState(0);
  const handleChangeInput = (e) => {
    const { value } = e.detail;
    if (+value >= canSendNum) {
      setSendNum(sendNum == canSendNum ? 0 : canSendNum);
      console.log(canSendNum)
      return `${canSendNum}`;
    } else {
      setSendNum(+value ? +value : 0);
      console.log(canSendNum , 111)
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
  useEffect(() => {
    purseAccount().then(res => {
      setCanSendNum(res.data.point)
     })
  },[])
  useImperativeHandle(ref, () => ({
    sendNum: sendNum
  }));
  return (
    <View className={`flex-col ${styles['send_box']}`}>
      <View className={`flex-col  ${styles['section_3']}`}>
        <View className={`flex-row justify-center ${styles['section_4']}`}>
          <Text className={`${styles['font_4']} ${styles['text_7']}`}>确认参与</Text>
          <View onClick={onClose} className={`${styles['image_4_box']}`}>
            <Image className={`${styles['image_4']}`} src={Close} />
          </View>
        </View>
        <View className={` items-center  ${styles['space-y-24']} ${styles['group_7']}`}>
          <View className={`${styles['group_7_title']}`}>参与数量</View>
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
            if(sendNum <= 0) return
            onSure();
          }}
        >
          <View className={`flex-col items-center ${styles['button']} ${styles['space-y-8']} ${sendNum == 0 ? styles['c-gray'] : ''}`}>
            <Text className={`${styles['font_4']} ${styles['text_12']}`}> 立即投注</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default forwardRef(SendBoxs);
