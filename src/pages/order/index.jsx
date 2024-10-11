import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { orderQueryPage } from '@/api';
import Taro from '@tarojs/taro';
// import BackIcon from '@/components/BackIcon';
import CommonEmpty from '@/components/CommonEmpty';
import { NO_LOG } from '@/constants/empty';
import IMG11 from '@/imgs/5.png';

import './index.less';
import dayjs from 'dayjs';

export default class ScoreToCoupon extends Component {
  constructor() {
    super();
    this.state = {
      hasMore: true,
      barOpacity: 0,
      titleBarHeight: 44,
      barHeight: 0,
      total: 1,
      lists: []
    };
  }
  componentDidShow() {
    this.pageNum = 1;
    const { statusBarHeight } = Taro.getSystemInfoSync();
    this.setState({
      barHeight: statusBarHeight
    });
    Taro.showLoading({ title: '加载中' });
    this.getGoods().finally(() => {
      Taro.hideLoading();
    });
  }

  handleExchange(items) {
    Taro.navigateTo({
      url: `/pages/namingRecord/result/index?id=${items.recordId}`
    });
  }
  getGoods() {
    return orderQueryPage({
      offset: this.pageNum,
      pageSize: 10,
      status: 2
    }).then((res) => {
      const records = res.data || [];
      const lists = this.pageNum === 1 ? records : this.state.lists.concat(records);
      this.setState({
        lists,
        total: res.data.total,
        hasMore: records.length == 10
      });
    });
  }
  onPullDownRefresh() {
    this.pageNum = 1;
    this.getGoods().finally(() => {
      Taro.stopPullDownRefresh(); //刷新成功后停止下拉刷新
    });
  }
  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    const opcityValue = scrollTop / 40 > 1 ? 1 : scrollTop / 40;
    this.setState({
      barOpacity: opcityValue
    });
  }
  onReachBottom() {
    if (!this.state.hasMore) return;
    this.pageNum++;
    this.getGoods();
  }

  render() {
    const { lists, titleBarHeight, barHeight } = this.state;
    return (
      <View className='order_wrap'>
        <View className='lists'>
          {lists.length > 0 ? (
            lists.map((items, index) => {
              return (
                <View
                  className='benefits_item'
                  key={index}
                >
                  <View className='flex-box benefits_item_top'>
                    <View className='flex_center'>
                      <View className='benefits_title'>{Number(items.orderAmount / 100).toFixed(2)}元{items.namingNum}次</View>
                      <View className='benefits_short_title'>订单号：{items.orderNo}</View>
                      <View className='benefits_short_title'>支付时间：{dayjs(items.payTime).format('YYYY-MM-DD hh:mm:ss')}</View>
                    </View>
                  </View>
                  <View className='button'>
                    <Image mode="aspectFill" className='img' src={IMG11}></Image>
                    <View className='money'>{Number(items.orderAmount / 100).toFixed(2)}元</View>
                  </View>
                </View>
              );
            })
          ) : (
            <CommonEmpty mtop={100} url={NO_LOG} />
          )}
        </View>
      </View>
    );
  }
}
