import React, { useState } from 'react';
import { View } from '@tarojs/components';
import './index.less';

const SwitchItem = ({ usePoint, onChange }) => {
  return (
    <View className={`g-switch ${usePoint ? 'checked' : ''}`} onClick={onChange}>
      <View className={`switch_checked`}>
        <View className="iconfont iconfill"></View>
      </View>
    </View>
  );
};
export default SwitchItem;
