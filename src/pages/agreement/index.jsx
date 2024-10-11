import { Component } from 'react';
import { WebView } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { setRequestRecord } from '@/utils';
import './index.less';

export default class Mine extends Component {
  state = {
    url: ''
  };
  componentDidMount() {
    const { type, title } = getCurrentInstance().router.params;
    // 条款类型 1：隐私政策 2：服务条款 3：APP协议条款 4：会员规则 5：关于我们 6：年卡协议

    // https://pro.api.ooelicloud.com/h5/privateInfo.html 隐私政策
    // https://pro.api.ooelicloud.com/h5/serviceInfo.html 服务条款
    // https://pro.api.ooelicloud.com/h5/user.html 群觅 APP协议条款
    // https://pro.api.ooelicloud.com/h5/policyInfo.html 会员规则
    // https://pro.api.ooelicloud.com/h5/companyInfo.html  关于我们

    switch (+type) {
      case 1:
        this.setState({
          url: 'http://xapi.nmqm.fun/private/nmqm/privateInfo.html'
        });
        break;
      case 2:
        this.setState({
          url: 'https://pro.api.ooelicloud.com/h5/serviceInfo.html'
        });
        break;
      case 3:
        this.setState({
          url: 'https://pro.api.ooelicloud.com/h5/user.html'
        });
        break;
      case 4:
        this.setState({
          url: 'https://pro.api.ooelicloud.com/h5/policyInfo.html'
        });
        break;
      case 5:
        this.setState({
          url: 'https://pro.api.ooelicloud.com/h5/companyInfo.html'
        });
        break;
      case 6:
          this.setState({
            url: 'https://pro.api.ooelicloud.com/h5/policyInfo_gallery.html'
          });
          break;
      default:
        break;
    }
    Taro.setNavigationBarTitle({ title });
    setRequestRecord();
  }
  render() {
    const { url } = this.state;
    return <WebView src={url}></WebView>;
  }
}
