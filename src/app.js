import { Component } from 'react';
import Taro  from '@tarojs/taro';
import '@/styles/iconfont.css';
import './app.less';

if (process.env.TARO_ENV !== 'h5') {
  require('@tarojs/taro/html.css');
}

Taro.options.html.transformElement = (el) => {
  if (el.h5tagName === 'source' && el.props.src && el.parentNode.h5tagName === 'video') {
    el.parentNode.setAttribute('src', el.props.src);
  }
  if (el.nodeName === 'image') {
    el.setAttribute('mode', 'widthFix');
    el.setAttribute('class', 'full_width_image');
  }
  return el;
};

class App extends Component {
  componentDidMount() {
    // judgeLogin();
  }
  onLaunch() {
    this.handleUpdate();
  }
  componentDidShow(){
    
  }
  handleUpdate() {
    if (process.env.TARO_ENV === 'weapp') {
      if (Taro.getUpdateManager) {
        const updateManager = Taro.getUpdateManager();
        if (updateManager) {
          updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate);
          });
          updateManager.onUpdateReady(() => {
            Taro.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
          });
        }
      }
    }
  }
  render() {
    return this.props.children;
  }
}

export default App;
