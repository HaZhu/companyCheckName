import { useRef, useCallback, useEffect, useState } from 'react';
import Taro from '@tarojs/taro';

const useDebounce = (fn, delay, dep = []) => {
  const { current } = useRef({ fn, timer: null });
  useEffect(
    function () {
      current.fn = fn;
    },
    [fn]
  );
  return useCallback(function f(...args) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, dep);
};

const useThrottle = (fn, delay, dep = []) => {
  const { current } = useRef({ fn, timer: null });
  useEffect(
    function () {
      current.fn = fn;
    },
    [fn]
  );

  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn.call(this, ...args);
    }
  }, dep);
};

const useGetBarHeight = () => {
  let titleBarHeight = 48;
  const [barHeight, setBarHeight] = useState(() => {
    const { statusBarHeight, platform } = Taro.getSystemInfoSync();
    if (platform == 'ios') {
      titleBarHeight = 44;
    }
    return statusBarHeight;
  });
  return { barHeight, titleBarHeight };
};

export { useThrottle, useDebounce, useGetBarHeight };
