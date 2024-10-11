export default {
  pages: [
    'pages/home/index', //商品列表
    'pages/namingRecord/index', //商品列表
    'pages/namingRecord/result/index', //商品详情
    'pages/mine/index', //我的
    'pages/login/index', //登录页面
    'pages/score/index',
    'pages/activeDetail/index',
    'pages/smsCode/index', //短信页面
    'pages/newPhone/index', //更换手机页面
    'pages/feedback/index', //反馈与建议
    'pages/agreement/index', //隐私条款
    'pages/quickLogin/index', //快捷登录
    'pages/codePage/index', //二维码中转页面
    'pages/order/index',
    'pages/result/index',
  ],
  subpackages: [
    {
      root: 'pages/setting',
      pages: ['index',  'userInfo/index', 'about/index', 'userInfoResult/index']
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1D1D1D',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'white',
    backgroundColor: '#fff'
  },
  tabBar: {
    borderStyle: 'white',
    color: '#92867D',
    selectedColor: '#F6B959',
    backgroundColor: '#3A3634',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/home.png',
        selectedIconPath: './assets/home_active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: './assets/tabbar_mine.png',
        selectedIconPath: './assets/tabbar_mine_select.png'
      }
    ]
  },
  lazyCodeLoading: 'requiredComponents'
};
