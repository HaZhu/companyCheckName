import Taro, { getStorageSync } from '@tarojs/taro';
import { setLoginReturnUrl } from '@/utils';
import qs from 'qs';
import { getGlobalData,setGlobalData } from '@/utils/global_data'

let baseUrl = 'https://xapi.nmqm.fun/api/check-company';
// if (process.env.ENV === 'test' || process.env.ENV === 'development') {
//   baseUrl = 'http://120.26.199.121:9206/api/check-company';
// }
const noLoginPage = [];
let isRefreshing = true;
let pendings = [];
const request = (options = { method: 'GET', data: {}, contentType: 'application/json' }) => {
  const data = {
    ...(options.data || {})
  };
  let headers = {
    'Content-Type': options.contentType || 'application/json',
    token: getGlobalData('token') ,
    locale: 'zh_CN'
  };
  return new Promise((resolve, reject) => {
    Taro.request({
      url: (options.baseUrl || baseUrl) + options.url,
      data: options.contentType === 'application/x-www-form-urlencoded' ? qs.stringify(data) : data,
      header: headers,
      mode: 'cors',
      method: options.method.toUpperCase()
    })
      .then((res) => {
        const { statusCode} = res;
        if (statusCode !== 200 || (res.data.code && res.data.code !== 200)) {
          if (res.data.code === 401) {
            pendings.push(() => {
              resolve(request({ ...options }));
            });
            if (isRefreshing) {
              updateToken(options);
              isRefreshing = false;
            }
          } else {
            if(options.errHideMsg){
               resolve(res.data);
            }else{
              setTimeout(() => {
                Taro.showToast({
                  title: res.data && res.data.msg ? res.data.msg : `网络请求错误`,
                  icon: 'none',
                  duration: 3000
                });
              }, 200);
            }
          }
        } else {
          resolve(res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

const updateToken = () => {
  Taro.login({
    success: function (r) {
      if (r.code) {
        Taro.request({
          url: baseUrl + `/wx/user/login`,
          data: {
            code: r.code
          },
          header: {
            'Content-Type': 'application/json',
            token: getGlobalData('token'),
            locale: 'zh_CN'
          },
          mode: 'cors',
          method: 'POST'
        }).then((result) => {
          if (result.data.code == 200) {
            if (result.data.data.token) {
              setGlobalData('token', result.data.data.token);
              setGlobalData('userName', result.data.data.userNick);
              isRefreshing = true;
              pendings.map((callback) => {
                callback();
              });
            } else {
              const ROUTER = Taro.getCurrentInstance().router;
              if (!noLoginPage.includes(ROUTER.path)) {
                Taro.showModal({
                  title: '温馨提示',
                  content: '前往授权获取更好体验',
                  success: function (res) {
                    if (res.confirm) {
                      isRefreshing = true;
                      pendings = [];
                      setLoginReturnUrl();
                      Taro.navigateTo({
                        url: '/pages/quickLogin/index'
                      });
                    } else {
                      isRefreshing = true;
                      pendings = [];
                    }
                  }
                });
              } else {
                isRefreshing = true;
                pendings = [];
              }
            }
          }
        });
      } else {
        console.log('登录失败！');
      }
    }
  });
};
export default request;
