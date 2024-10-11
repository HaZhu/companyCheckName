import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { timeUtil } from '@/utils';
import styles from './index.module.less';

const webps = {
  nextAudio: 'https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/2e5633928ceb43251f193d8c74ae75e2ab980f10.png',
  play: 'https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/10e3b32413c79423c975c22a70a1ed20747637b1.png',
  stop: 'https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/f698ab9914bbbbd7a8ce8a79dcff27c12aeeb44a.png'
};
export default function AudioContral(props) {
  const { audioRef, audioSrc, audioPaly, onPause, onPlay, onPlayNext, audioObj = {}, cRef, showNext = true } = props;
  const progressRef = useRef(null);
  const [progressMaxWidth, setProressMaxWidth] = useState(0);
  const [hasPlayTime, setHasPlayTime] = useState(0);
  const [surplusTime, setSurplusTime] = useState(0);
  const onProgress = () => {
    if (audioRef.currentTime && audioRef.duration) {
      const percent = audioRef ? audioRef.currentTime / audioRef.duration : 0;
      if (progressRef) {
        const progressWidth = percent * progressMaxWidth;
        progressRef.current.style.width = `${progressWidth.toFixed(0)}px`;
      }
      setHasPlayTime(audioRef.currentTime);
      setSurplusTime(audioRef.duration - audioRef.currentTime);
    }
  };

  /** 按钮触发 */
  const onTouchStart = () => {
    onPause();
  };

  /** 按钮触发拖拽 */
  const onTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      const targetLeft = e.touches[0].clientX;
      const WIDTH = targetLeft >= progressMaxWidth ? progressMaxWidth : targetLeft <= 0 ? 0 : targetLeft;
      progressRef.current.style.width = `${WIDTH.toFixed(0)}px`;
      const currentTime = (WIDTH / progressMaxWidth) * (audioRef.duration || 0);
      audioRef.currentTime = 0;
      setHasPlayTime(currentTime);
      setSurplusTime(audioRef.duration - currentTime);
    }
  };
  const onTouchEnd = () => {
    onPlay(hasPlayTime);
  };
  const handleStartTimer = () => {
    clearInterval(Taro.getApp().progressTimer);
    Taro.getApp().progressTimer = setInterval(() => {
      onProgress();
    }, 1000);
  };
  useEffect(() => {
    Taro.nextTick(() => {
      Taro.createSelectorQuery()
        .select('#progressWrap')
        .boundingClientRect(function (rect) {
          if (rect) {
            setProressMaxWidth(rect.width);
          }
        })
        .exec();
    });
  }, []);
  useImperativeHandle(cRef, () => ({
    clearTimer: () => {
      clearInterval(Taro.getApp().progressTimer);
    },
    startTimer: () => {
      handleStartTimer();
    }
  }));
  return (
    <View className={`${styles['section_3']} ${styles['pos_3']} ${audioSrc && styles['show']}`}>
      <View id='progressWrap' className={`${styles['group_8']}`}>
        <View className={`${styles['text_4']}`}>{audioObj.name}</View>
        <View className={`${styles['flex_time']}`}>
          <Text className={`${styles['text_5']}`}>{timeUtil(hasPlayTime)}</Text>
          <Text className={`${styles['text_5']}`}>-{timeUtil(surplusTime)}</Text>
        </View>
        <View ref={progressRef} className={`${styles['progress']}`}>
          <View className={`${styles['progress_bar']}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove}>
            <View className={`${styles['bars']}`}></View>
          </View>
        </View>
      </View>
      {
        showNext &&   <View
          className={`${styles['image-wrapper']}`}
          onClick={() => {
          onPlayNext();
        }}
        >
        <View className={`iconfont iconxiayishou ${styles['image_6']}`}></View>
        {/* <Image className={`${styles['image_6']}`} src={webps.nextAudio} /> */}
      </View>
      }
      <View
        className={`${styles['image-wrapper_2']}`}
        onClick={() => {
          audioPaly ? onPause() : onPlay();
        }}
      >
        {audioPaly ? <Image className={`${styles['image_7']}`} src={webps.play} /> : <Image className={`${styles['image_7']}`} src={webps.stop} />}
      </View>
    </View>
  );
}
