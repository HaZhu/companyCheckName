import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { recordList } from '@/api';
import Taro from '@tarojs/taro';
// import BackIcon from '@/components/BackIcon';
import CommonEmpty from '@/components/CommonEmpty';
import { NO_LOG } from '@/constants/empty';
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
    if(!items.hasDetail) return
    Taro.navigateTo({
      url: `/pages/namingRecord/result/index?id=${items.recordId}`
    });
  }
  getGoods() {
    return recordList({
      offset: this.pageNum,
      pageSize: 10
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
  <View className='score_to_coupon' style={`background:${lists.length > 0 ? '#352C25' : '#fff'}`}>
        <View className='lists'>
          {lists.length > 0 ? (
            lists.map((items, index) => {
              return (
                <View
                  className='benefits_item'
                  key={index}
                  onClick={() => {
                    this.handleExchange(items);
                  }}
                >
                  <View className='flex-box benefits_item_top'>
                    <View className='flex_center'>
                      <View className='benefits_title'>取名时间：{dayjs(items.namingTime).format('YYYY-MM-DD hh:mm:ss')}</View>
                      <View className='benefits_short_title'>
                         {
                          !!items.cityName &&  <Text className='text11'>所在地区：{items.cityName}  </Text>
                         }
                         {
                          !!items.industryType &&  <Text className='text11'>行业：{items.industryType} </Text>
                         }
                         {
                          !!items.companyType &&  <Text className='text11'>公司类型：{items.companyType}</Text> 
                         }
                         {
                          !!items.companyNameNum &&  <Text className='text11'>公司字号数量：{items.companyNameNum}</Text> 
                         }
                          {
                          !!items.favoriteWord &&  <Text className='text11'>心仪的字：{items.favoriteWord}</Text> 
                         }
                          {
                          !!items.fiveElement &&  <Text className='text11'>五行：{items.fiveElement}</Text> 
                         }
                          {
                          !!items.birthTime &&   <Text className='text11'>出生年月：{items.birthTime}</Text>
                         }
                          {
                          !!items.nickName &&  <Text className='text11'>创始人姓名：{items.nickName}</Text> 
                         }
                        
                         {
                          !!items.sex && <Text className='text11'>创始人性别：{items.sex  == 1? '男' : '女'}</Text> 
                         }
                      </View>
                      <View className='benefits_address'>编号：{items.recordId} </View>
                    </View>
                  </View>
                  <View className='flex-box benefits_item_bottom'>
                    <View className='benefits_content'>
                      <View className='flex_box min100'>
                        <Text className='big_size_1'></Text>
                      </View>
                    </View>
                    <View className='benefits_item_bottom_right'>
                      <View className={`button ${items.hasDetail ? '' : 'gray'}`}> { items.hasDetail ? "去查看" : "取名中"}</View>
                    </View>
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
