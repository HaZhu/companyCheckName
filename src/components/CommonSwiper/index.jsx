import { Swiper, SwiperItem, Image, View } from '@tarojs/components';
import { Component } from 'react';
import Taro from '@tarojs/taro';
import './index.less';

// 公用swiper组件
export default class SwiperComp extends Component {
  state = {
    activeIndex: 0
  };
  onSwipeChange = (e) => {
    this.setState({
      activeIndex: e.detail.current
    });
  };
  handlePreview = (item) => {
    Taro.previewImage({
      current: item.path,
      urls: this.props.urls.map((items) => items)
    });
  };
  render() {
    const { urls = [], height = '384rpx',mode = 'aspectFill' } = this.props;
    const { activeIndex } = this.state;
    return (
      <View className='banner-wrap' style={{ height }}>
        <Swiper className='banner' autoplay duration='350' onChange={this.onSwipeChange}>
          {urls.map((item) => {
            return (
              <SwiperItem key={item}>
                <Image mode={mode} className='banner_image' src={item} onClick={() => this.handlePreview(item)} />
              </SwiperItem>
            );
          })}
        </Swiper>
        {urls.length > 1 ? (
          <View className='dots'>
            {urls.map((item, index) => {
              return <View className={`dot ${activeIndex === index ? 'active' : ''}`}></View>;
            })}
          </View>
        ) : null}
      </View>
    );
  }
}
