import { View } from '@tarojs/components';
import './index.less';

const BaseButton = ({backFnc , text }) => {
  const handleFuc = () => {
    backFnc();
  };
  return <View className='base_bottom_button' onClick={handleFuc}>{text}</View>;
};

export default BaseButton;
