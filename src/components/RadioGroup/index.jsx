import React from 'react';
import { View, Text } from '@tarojs/components';
import Radio from '../Radio/index';
import './index.less';

export default function RadioGroup({ options, className, value, onChange, disabled = false, radioIsCol = false, btnStyle = 'orange-style' }) {
  const onRadioSelect = (val) => () => {
    !disabled && onChange(val);
  };
  return (
    <View className={`${!radioIsCol ? 'g-radio-group' : 'g-column-radio-group'} ${className}`}>
      {options.map((item) => (
        <Radio btnStyle={btnStyle} key={item.value} checked={value === item.value} onClick={onRadioSelect(item.value)}>
          <Text style={disabled && value !== item.value ? { color: '#D6D6D6' } : { color: 'inherit' }}>{item.label}</Text>
        </Radio>
      ))}
    </View>
  );
}
