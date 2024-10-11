import { View } from '@tarojs/components';
import './index.less';

const BaseAlert = ({ handleHide, handleCannel, handleOk , showIcon = true , iconfontClass = "icontingche" , showTitle = true , title = "温馨提示" , showSubTitle = true , subTitle = "这是副标题", buttonNum = 1 , cannalBtnText = "关闭", okBtnText = "好的" }) => {
  const hideCover = (e) => {
    e.stopPropagation();
    handleHide();
  };
  return (
    <View className='base_alert_wrap'>
      <View className='hide_block' onClick={hideCover}></View>
      <View className='get_wrap'>
        {
          showIcon &&  <View className={`iconfont ${iconfontClass}`}></View>
        }
        {
          showTitle &&  <View className='black_title'>{title}</View>
        } 
        {
          showSubTitle && <View className='gray_title'>{subTitle}</View>
        }
        {
          buttonNum  == 1 ? <View className='get_button_one' onClick={handleOk} >{okBtnText}</View> : 
          <View className='get_button_wrap'>
            <View className='get_button get_button_green'onClick={handleCannel}>{cannalBtnText}</View>
            <View className='get_button'onClick={handleOk} >{okBtnText}</View>
          </View>
        }
      </View>
    </View>
  );
};
export default BaseAlert;
