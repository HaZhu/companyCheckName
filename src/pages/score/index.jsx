import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { pointRecord,purseAccount } from '@/api';
import CommonEmpty from '@/components/CommonEmpty';
import BackIcon from '@/components/BackIcon';
import { NO_LOG } from '@/constants/empty';
import './index.less';

export default class Score extends Component {
  constructor() {
    super();
    this.state = {
      pointLog: '',
      costAccount: '',
      titleBarHeight: 44,
      barHeight: 0,
      lists: [],
      total: 1,
      totalPoint: '',
      hasMore: true
    };
  }
  componentDidMount() {
    this.pageNum = 1;
    this.getMyPoint();
    const { statusBarHeight } = Taro.getSystemInfoSync();
    this.setState({
      barHeight: statusBarHeight
    });
  }
  getMyPoint() {
    purseAccount().then(res => {
        console.log(res)
        this.setState({
          totalPoint: res.data.point
        })
    })
    pointRecord({
      page: this.pageNum,
      size: 20
    }).then((res) => {
      if (res.code === 200) {
        const records = res.data.list || [];
        const lists = this.pageNum === 1 ? records : this.state.lists.concat(records);
        this.setState({
          pointLog: res.data.pointLog,
          costAccount: res.data.costAccount,
          lists,
          total: res.data.total,
          hasMore: lists.length < res.data.total
        });
      }
    });
  }
  onReachBottom() {
    if (!this.state.hasMore) return;
    this.pageNum++;
    this.getMyPoint();
  }
  render() {
    const { pointLog, costAccount, totalPoint, lists, titleBarHeight, barHeight, total } = this.state;
    return (
      <View className='score_wrap' style={{ paddingTop: titleBarHeight + barHeight + 'px' }}>
        <BackIcon></BackIcon>
        <View className='score'>{totalPoint}</View>
        <View className='money'>
          {/* <Text>可抵￥{costAccount}</Text> */}
        </View>
          <View className='tip_wrap'>
            <Text className='tip'>积分可用于参与活动抢票</Text>
          </View>
        <View className='line'></View>
        {total > 0 ? (
          <View className='lists'>
            {lists.map((item) => (
              <View className='list' key={item.id}>
                <View className='list_left'>
                  <View className='title'>{ item.title}</View>
                  <View className='desc'>{item.createTime}</View>
                </View>
                <View className='list_right'>
                  <View className={`money ${item.type === 2 ? 'green' : ''}`}>
                    {item.type === 2 ? '-' : '+'}
                    {item.balance}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <CommonEmpty url={NO_LOG}></CommonEmpty>
        )}
      </View>
    );
  }
}
