import { useEffect } from 'react';
import { View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { setRequestRecord } from '@/utils';
import { getQrSceneByCode } from '@/api/user';

const CodePage = () => {
  const ROUTER = useRouter();
  const goReturnUrl = (path, params) => {
    if (params) {
      for (let key in params) {
        if (!key.includes('taroTimestamp')) {
          path += path.includes('?') ? '&' + key + '=' + params[key] : '?' + key + '=' + params[key];
        }
      }
    }
    Taro.reLaunch({
      url: '/' + path
    });
  };
  const getRouter = async () => {
    const res = await getQrSceneByCode({
      code: ROUTER.params.scene
    });
    if (res.code == 200 && res.data) {
      const params = JSON.parse(res.data.params);
      goReturnUrl(res.data.path, params);
    } else {
      Taro.showToast({
        title: '抱歉,二维码解析出错~',
        icon: 'none'
      });
      setTimeout(() => {
        Taro.reLaunch({
          url: '/pages/home/index'
        });
      }, 2000);
    }
  };
  useEffect(() => {
    if (ROUTER.params && ROUTER.params.scene) {
      getRouter();
    }
    setRequestRecord()
  }, []);
  return <View></View>;
};
export default CodePage;
