import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.less';

export default class CheckboxItem extends Component {
  render() {
    const { checked, onClick } = this.props;
    return (
      <View className="g-radio" onClick={onClick}>
        <View className={`iconfont ${checked ? 'iconfill' : 'iconstroke'}`}></View>
        {this.props.children}
      </View>
    );
  }
}
