import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Arrow from '@/assets/arrowRight.png';
import { accountDetail } from '@/api';
import { getGlobalData,setGlobalData } from '@/utils/global_data'
import { setLoginReturnUrl,  ShareIcon } from '@/utils/index';
import HomePay from '@/components/HomePay'

import IMG8 from '@/imgs/8.png';
import IMG7 from '@/imgs/7.png';
import IMG3 from '@/imgs/3.png';
import IMG2 from '@/imgs/2.png';


import './index.less';

const MENUS = [
  {
    path: '/pages/order/index',
    icon: IMG8,
    text: '我的订单',
    isCount: false
  },
  {
    path: '',
    icon: IMG7,
    text: '剩余次数',
    countNum: 0,
    isCount: true
  },
  {
    path: '/pages/namingRecord/index',
    icon: IMG3,
    text: '取名记录',
    isCount: false
  }
];
const getTimeState = () => {
  // 获取当前时间
  let timeNow = new Date();
  // 获取当前小时
  let hours = timeNow.getHours();
  // 设置默认文字
  let text = ``;
  // 判断当前时间段
  if (hours >= 0 && hours <= 10) {
    text = `早上好,`;
  } else if (hours > 10 && hours <= 14) {
    text = `中午好,`;
  } else if (hours > 14 && hours <= 18) {
    text = `下午好,`;
  } else if (hours > 18 && hours <= 24) {
    text = `晚上好,`;
  }
  // 返回当前时间段对应的状态
  return text;
};

export default class Mine extends Component {
  constructor() {
    super();
    this.state = {
      menus: MENUS,
      showPay:false,
      showTab:true,
      mobile: '',
      userNick: '',
      titleBarHeight: 48,
      barHeight: 0,
    };
  }
  componentDidShow() {
    const { statusBarHeight, platform } = Taro.getSystemInfoSync();
    if (platform == 'ios') {
      this.setState({
        barHeight: 44
      });
    }
    this.setState({
      barHeight: statusBarHeight
    });
    let _this = this;
    Taro.login({
      success: function (r) {
        if (r.code) {
          Taro.request({
            url: `https://xapi.nmqm.fun/api/check-company/wx/user/login`,
            data: {
              code: r.code
            },
            header: {
              'Content-Type': 'application/json',
              locale: 'zh_CN'
            },
            mode: 'cors',
            method: 'GET'
          }).then((result) => {
            if(result.data.data && result.data.data.hideTab){
              _this.setState({
                showTab: false
              })
            }
             if(result.data.data && result.data.data.token){
              setGlobalData('token', result.data.data.token);
              setGlobalData('userName', result.data.data.userNick);
              _this.setState({
                userNick: result.data.data.userNick
              })
              _this.getCount()
             }
          });
        } else {
          console.log('登录失败！');
        }
      }
    });
  }
  getCount =  async() => {
    const res = await accountDetail()
    this.setState({
      menus: [
        {
          path: '/pages/order/index',
          icon: IMG8,
          text: '我的订单',
          isCount: false
        },
        {
          path: '',
          icon: IMG7,
          text: '剩余次数',
          countNum: res.data.namingNum,
          isCount: true
        },
        {
          path: '/pages/namingRecord/index',
          icon: IMG3,
          text: '取名记录',
          isCount: false
        }
      ]
    })
  }
  handleClickMenu = (item) => {
    if (!getGlobalData('userName')) {
      // 获取一下当前页面路径及参数
      setLoginReturnUrl(item);
      Taro.navigateTo({
        url: '/pages/quickLogin/index'
      });
      return;
    }
    if(item.isCount && this.state.showTab){
      this.setState({
        showPay:true
      })
      return
    }
    if (item.path) {
      Taro.navigateTo({
        url: item.path
      });
      return;
    }
  };

  onShareTimeline() {
    return {
      title: '快来这里给企业起名核名',
      path: '/pages/home/index'
    };
  }
  onShareAppMessage() {
    return {
      title: '快来这里给企业起名核名',
      path: '/pages/home/index'
    };
  }
  render() {
    const { menus, userNick,showPay,showTab } = this.state;
    return (
      <View className='mine_wrap'>
        <View className='mine_container'>
          <View className='user_info'>
            <Image src={IMG2} className='imgs_lf'></Image>
            <View className='imgs_rt'>
                <View className='user_info_title' onClick={() => {
                    this.handleClickMenu({});
                  }}>{ userNick ?  getTimeState() : '点击登录'}</View>
                <View
                  className='user_name'
                >
                  <Text>{userNick ? '欧气满满的' + userNick : '登录后享受更多服务'}</Text>
                </View>
            </View>
          </View>
          <View className='menus'>
            {menus.map((item) => {
              return (
                <View className='menu' hoverClass='hover_light' key={item.text} onClick={() => this.handleClickMenu(item)}>
                  <View className='menu_left'>
                    <Image src={item.icon} className={`icon`}></Image>
                    {item.text}
                  </View>
                  <View className='menu_right'>
                    {
                      item.isCount ? <View className='countNum'>{item.countNum}次</View> : <View className='iconfont iconduanjiantou-you arrow'></View>
                    }
                  </View>
                </View>
              );
            })}
          </View>
          {/* <View className='tel_wrap'>
            <View className='tel_box' onClick={() => {
                Taro.makePhoneCall({
                  phoneNumber: mobile
                });
            }}
            > 
              <View className='iconfont tel_icon icona-pingjiaduihua'></View>
              <Text>服务热线</Text>
            </View>
          </View>
          <View className='service_time'>服务时间10:00 - 20:00</View> */}
                 {
          showPay && <HomePay onClose={() => {
            this.setState({
              showPay:false
            })
          }} onPayClose={() => {
            this.getCount()
            this.setState({
              showPay:false
            })
          }}></HomePay>
        }
        </View>
      </View>
    );
  }
}
