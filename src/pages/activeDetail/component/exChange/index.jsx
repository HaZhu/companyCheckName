import { View, Image, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';

const ExChange = ({ code, message, handleHide, type }) => {
  const hideCover = (e) => {
    e.stopPropagation();
    handleHide();
  };
  return (
    <View className='check_container'>
      <View className='hide_block' onClick={hideCover}></View>
      <View className='company_container_box'>
        {code == 200 ? (
          <>
            <View className='flex_right'>
              <View onClick={handleHide} className='iconfont iconguanbi'></View>
            </View>
            <Image className='face' src='https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/c05683d049b3e479ca483afd531f50a6f335fecd.webp'></Image>
            <View className='title'>{message}</View>
            <View className='line'></View>
            {
              type == 2? <View
                className='btn'
                onClick={() => {
                  handleHide()
              }}
              >
              我知道了
            </View> : <View
              className='btn'
              onClick={() => {
                
                Taro.navigateTo({
                  url: '/pages/order/index'
                });
              }}
            >
              查看我的订单
            </View>
            }
            
          </>
        ) : (
          <>
            <View className='flex_right'>
              <View onClick={handleHide} className='iconfont iconguanbi'></View>
            </View>
            <Image className='face' src='https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/fb0abe004c326fa196b433b2f9a0ce7919b3a5d9.webp'></Image>
            <View className='title'>{message}</View>
            <View className='line'></View>
            <View className='btn' onClick={handleHide}>
              确定
            </View>
          </>
        )}
      </View>
    </View>
  );
};
export default ExChange;
