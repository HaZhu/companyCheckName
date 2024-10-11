import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import Close from '@/assets/close.png';
import styles from './send.module.less';

const XieYi = ({ onClose, onSure, type = "2" }) => {
  return (
    <View className={`flex-col ${styles['xieyi_box']}`}>
      <View className={`flex-col  ${styles['section_3']}`}>
        <View className={`flex-row justify-center ${styles['section_4']}`}>
          <Text className={`${styles['font_4']} ${styles['text_7']}`}>请阅读并同意以下条款</Text>
          <View onClick={onClose} className={`${styles['image_4_box']}`}>
            <Image className={`${styles['image_4']}`} src={Close} />
          </View>
        </View>
        <View className={` items-center  ${styles['space-y-24']} ${styles['group_7']}`}>
          <View className={`${styles['group_7_title']}`}>
              {/* <Text
                className='xieyi'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/agreement/index?type=3&title=用户协议`
                  });
                }}
              >
                《用户协议》
              </Text>
              和 */}
              <Text
                className='xieyi'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/agreement/index?type=1&title=隐私政策`
                  });
                }}
              >
                《隐私政策》
              </Text>
          </View>
        </View>
        {
          type == '2' ? <Button
          open-type='getPhoneNumber'
          onGetPhoneNumber={onSure}
          className={`flex-col justify-start ${styles['section_7']}`}
        >
          <View className={`flex-col items-center ${styles['button']}}`}>
            <Text className={`${styles['font_4']} ${styles['text_12']}`}>同意并继续</Text>
          </View>
        </Button> : <Button
          onClick={onSure}
          className={`flex-col justify-start ${styles['section_7']}`}
        >
          <View className={`flex-col items-center ${styles['button']}}`}>
            <Text className={`${styles['font_4']} ${styles['text_12']}`}>同意并继续</Text>
          </View>
        </Button>
        }
    
      </View>
    </View>
  );
};
export default XieYi;
