import React, { useState, useRef, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import './index.less';

const ImgPreview = ({ url, onClose, visible, index }) => {
  const [showWrap, setShowWrap] = useState(false);
  const onPreviewClose = () => {
    onClose();
  };
  const handleDelete = () => {
    onClose({
      index
    });
    setShowWrap(false);
  };
  return (
    <View className={`img-preview ${visible && 'active'}`}>
      <View className='iconfont close_img iconguanbi' onClick={onPreviewClose}></View>
      <Image className='img' mode='widthFix' src={url} />
      <View
        className='iconfont delete_img icona-icon48shanchu'
        onClick={() => {
          setShowWrap(true);
        }}
      ></View>
      <View className={`delete_wrap ${showWrap && 'show'}`}>
        <View className='title'>确认要删除这张照片吗</View>
        <View className='btn delete' onClick={handleDelete}>
          删除
        </View>
        <View
          className='btn cannel'
          onClick={() => {
            setShowWrap(false);
          }}
        >
          取消
        </View>
      </View>
    </View>
  );
};

export default ImgPreview;
