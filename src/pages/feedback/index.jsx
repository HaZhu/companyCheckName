import { View,  Image, Textarea, Input } from '@tarojs/components';
import { useState,  useEffect } from 'react';
import Taro, { usePageScroll } from '@tarojs/taro';
import { adviceSave } from '@/api';
import { showToast, handleUploadFile } from '@/utils';
import BackIcon from '@/components/BackIcon';
import { useGetBarHeight } from '@/hooks';
import ImgPreview from './components/review';
import './index.less';

const Feedback = () => {
  const [barOpacity, setBarOpacity] = useState(0);
  const { barHeight, titleBarHeight } = useGetBarHeight();
  usePageScroll((e) => {
    const scrollTop = e.scrollTop;
    const opcityValue = scrollTop / 40 > 1 ? 1 : scrollTop / 40;
    setBarOpacity(opcityValue);
  });
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [imgArr, setImgArr] = useState([]);
  const [preViewUrl, setPreViewUrl] = useState('');
  const [preViewIndex, setPreViewIndex] = useState(null);
  const [visible, setVisible] = useState(false);

  const textAreaInput = (e) => {
    const { value } = e.detail;
    setContent(value);
  };
  const handleInputPhone = (e) => {
    const { value } = e.detail;
    setContact(value);
  };
  const handleCloseImg = (e) => {
    if (e) {
      setImgArr((imgArrs) => {
        imgArrs.splice(e.index, 1);
        return imgArrs;
      });
    }
    setVisible(false);
  };

  const handleAddImg = () => {
    Taro.chooseImage({
      count: 3 - imgArr.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        setImgArr(imgArr.concat(res.tempFilePaths));
      }
    });
  };

  const handleSubmit = async () => {
    if (!content) return;
    // const r = await Promise.all(imgArr.map((res) => handleUploadFile(res)));
    const res = await adviceSave({
      content,
      phone: contact
    });
    if (res.code === 200) {
      showToast('反馈成功');
      setTimeout(() => {
        Taro.navigateBack({
          delta: 1
        });
      }, 2000);
    }
  };
  return (
    <View className='feedback_wrap' style={{ paddingTop: titleBarHeight + barHeight + 'px' }}>
      <BackIcon></BackIcon>
      <View className='fiexd_title' style={{ height: titleBarHeight + 'px', paddingTop: barHeight + 'px', opacity: barOpacity }}>
        反馈与建议
      </View>
      <View className='feedback_wrap_title'>反馈与建议</View>
      <Textarea onInput={textAreaInput} placeholder='请输入您的反馈或者建议，以便我们更好的为您提供服务。' className='textarea' />
      {/* <View className='img_box'>
        {imgArr.map((item, index) => {
          return (
            <Image
              mode='aspectFit'
              onClick={() => {
                setPreViewUrl(item);
                setPreViewIndex(index);
                setVisible(true);
              }}
              src={item}
            ></Image>
          );
        })}
        {imgArr.length < 1 && (
          <View className='add_img' onClick={handleAddImg}>
            <View className='iconfont iconstroke2'></View>
          </View>
        )}
      </View> */}
      {contact && <View className='tip'>你的邮箱或者手机号</View>}
      <Input className='ipt' placeholder='你的邮箱或者手机号' onInput={handleInputPhone} />
      <View className={`login_btn ${!content && 'disabled'}`} onClick={handleSubmit}>
        提交
      </View>
      <ImgPreview url={preViewUrl} index={preViewIndex} onClose={handleCloseImg} visible={visible}></ImgPreview>
    </View>
  );
};
export default Feedback;
