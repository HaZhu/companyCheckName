import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.less';

export default class EmptyComp extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View className="empty_wrap">
        <Image className="empty_img" style={{ marginTop: this.props.mtop ? this.props.mtop + 'px' : '0px' }} src={this.props.url}></Image>
      </View>
    );
  }
}
