import Taro from '@tarojs/taro';
import md5 from 'md5';
import {  requestRecord } from '@/api';
import {getGlobalData} from '@/utils/global_data'

export function isValidMobile(phone) {
  return /^1[0-9]{10}$/.test(phone);
}
export function returnFloat(value) {
  var value = Math.round(parseFloat(value) * 100) / 100;
  var xsd = value.toString().split('.');
  if (xsd.length == 1) {
    value = value.toString() + '.00';
    return value;
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + '0';
    }
    return value;
  }
}
export function isvalidEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}
export function ChangeHourMinutestr(minutes) {
  return Math.floor(minutes / 60) + '小时' + (minutes % 60) + '分钟';
}

export function getCodeSign({ mobile, timestamp }) {
  return md5(`mobile=${mobile}&timestamp=${timestamp}&key=twbp2f2y4bcf5cnwv620ozgf4sqsfz7u`).toUpperCase();
}

export function setLoginReturnUrl(item) {
  const ROUTER = item ? item : Taro.getCurrentInstance().router;
  let path = ROUTER.path;
  if (ROUTER.params) {
    for (let key in ROUTER.params) {
      if (!key.includes('taroTimestamp')) {
        path += path.includes('?') ? '&' + key + '=' + ROUTER.params[key] : '?' + key + '=' + ROUTER.params[key];
      }
    }
  }

  Taro.setStorage({
    key: 'return_url',
    data: path || '/pages/home/index'
  });
}
export function getLoginReturnUrl(url) {
  const returnUrl = Taro.getStorageSync('return_url');
  Taro.reLaunch({
    url: url ? url : returnUrl || '/pages/home/index'
  });
}

//浮点数转换为整数
function toInt(num) {
  if (num === null || num === undefined) num = 0;
  var rel = {};
  var str, pos, len, times;
  str = num < 0 ? -num + '' : num + '';
  pos = str.indexOf('.');
  len = str.substr(pos + 1).length;
  times = Math.pow(10, len + 1); //补充：当小数位数较多时，避免出错，所以多扩大一倍，提高精度
  rel.times = times;
  rel.num = num;
  return rel;
}
export const getPx = (number, designWidth = 750) => {
  const sys = Taro.getSystemInfoSync();
  const scale = sys.screenWidth / designWidth; // 缩放比例
  return Number(number * scale).toFixed(0); // 返回缩放后的值
};
// 计算两位数值
export function operate(a, b, op) {
  var d1 = toInt(a);
  var d2 = toInt(b);
  var max = d1.times > d2.times ? d1.times : d2.times;
  var rel;
  switch (op) {
    case '+':
      rel = (d1.num * max + d2.num * max) / max;
      break;
    case '-':
      rel = (d1.num * max - d2.num * max) / max;
      break;
    case '*':
      rel = (d1.num * max * (d2.num * max)) / (max * max);
      break;
    case '/':
      rel = (d1.num * max) / (d2.num * max);
      break;
  }
  return rel;
}
/**
 * 功能: 函数防抖， xx秒后才执行函数
 * @param {data} {type} {description}
 */
export const debounce = (fn, delay) => {
  var timer = null;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};
// 节流
export const throttle = (func, wait) => {
  let timer;
  return () => {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      func();
      timer = null;
    }, wait);
  };
};
export function GetRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return Min + Math.round(Rand * Range);
}

export function showToast(title) {
  if (title) {
    Taro.showToast({
      title,
      icon: 'none'
    });
  }
}
export const selectorQueryClientRect = (selector) => {
  return new Promise((resolve) => {
    const query = Taro.createSelectorQuery();
    query
      .select(selector)
      .fields({ node: true, size: true })
      .exec((res) => {
        resolve(res);
      });
  });
};
export function normalizePhone(phone) {
  if (!phone) return '';
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

export const getWeek = (week) => {
  switch (week) {
    case 0:
      return '星期日';
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
  }
};
export const getWeekEn = (week) => {
  switch (week) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thur';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
  }
};

export const getDtId = () => {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  // var day = d.getDay();
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();
  // var ms = d.getMilliseconds();
  year = (year + '').substring(2);
  if (month <= 9) month = '0' + month;
  if (date <= 9) date = '0' + date;
  if (hours <= 9) hours = '0' + hours;
  if (minutes <= 9) minutes = '0' + minutes;
  if (seconds <= 9) seconds = '0' + seconds;
  let num = Math.ceil(Math.random() * 10000);
  var id = year + month + date + hours + minutes + seconds + num;
  return id;
};

export const formatTimeFromSeconds = (totalSeconds) => {
  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const days = Math.floor(totalSeconds / secondsInDay);
  const hours = Math.floor((totalSeconds % secondsInDay) / secondsInHour);
  const minutes = Math.floor((totalSeconds % secondsInHour) / secondsInMinute);
  const seconds = totalSeconds % secondsInMinute;
  const formatTimeUnit = unit => (unit < 10 ? '0' + unit : unit.toString());

  return {
    days: formatTimeUnit(days),
    hours: formatTimeUnit(hours),
    minutes: formatTimeUnit(minutes),
    seconds: formatTimeUnit(seconds),
  };
}


export const escape2Html = (str) => {
  const arrEntities = {
    lt: '<',
    gt: '>',
    nbsp: ' ',
    amp: '&',
    lsquo: "‘",
    rsquo: "’",
    ldquo: '“',
    rdquo: '”',
    quot: '"',
    middot: '·',
    amp: '&',
    brvbar: '¦',
    mdash: '—',
    ndash: '–',
    ge: '≥',
    le: '≤',
    laquo: '«',
    raquo: '»',
    deg: '°',
    bull: '•',
    macr: '¯',
    '#64': '@'
  };
  return str.replace(/&(lt|gt|nbsp|ldquo|lsquo|rsquo|rdquo|amp|quot|middot|amp|brvbar|mdash|ndash|ge|le|laquo|raquo|deg|bull|macr|#64);/gi, function (all, t) {
    return arrEntities[t];
  });
};
// 页面埋点
export const setRequestRecord = (pagePath) => {
  const ROUTER = pagePath ? pagePath : Taro.getCurrentInstance().router;
  let path = ROUTER.path;
  let params = '';
  if (ROUTER.params) {
    for (let key in ROUTER.params) {
      if (!key.includes('taroTimestamp')) {
        params += '&' + key + '=' + ROUTER.params[key];
      }
    }
    params = params.slice(1);
  }
  Taro.login({
    async success(res) {
      if (res.code) {
        await requestRecord({
          code: res.code,
          path,
          params
        });
      }
    }
  });
};

export const timeUtil = (second) => {
  const m = Math.ceil(second / 60) > 10 ? `${Math.floor(second / 60)}` : `0${Math.floor(second / 60)}`;
  const s = Math.ceil(second % 60) > 10 ? `${Math.floor(second % 60)}` : `0${Math.floor(second % 60)}`;
  return `${m}:${s}`;
};

export const getUrlParams = (param, k, p) => {
  if (typeof param != 'string') return {};
  k = k ? k : '&'; //整体参数分隔符
  p = p ? p : '='; //单个参数分隔符
  var value = {};
  if (param.indexOf(k) !== -1) {
    param = param.split(k);
    for (var val in param) {
      if (param[val].indexOf(p) !== -1) {
        var item = param[val].split(p);
        value[item[0]] = item[1];
      }
    }
  } else if (param.indexOf(p) !== -1) {
    var item = param.split(p);
    value[item[0]] = item[1];
  } else {
    return param;
  }
  return value;
};

export const deleSpac = (str,direction) => { // 1 串的模板 2 清除哪边空格
  if(typeof str !== 'string'){ // 限制下条件，必须是字符串
       console.error(`${typeof ele} is not the expected type, but the string type is expected`)
      return false
  }
  let Reg = '';
  switch(direction) {
      case 'left' : // 去除左边
          Reg = /^[\t\r\f\n\s]+/g;
          break;
      case 'right' : // 去除右边
          Reg = /([\t\r\f\n\s]+)$/g;
          break;
      case 'both' : // 去除两边
          Reg = /(^[\t\r\f\n\s]*)|([\t\r\f\n\s]*$)/g
          break;
      default :   // 没传默认全部，且为下去除中间空格做铺垫
          Reg = /[\t\r\f\n\s]*/g;
          break;
  }
  let newStr = str.replace(Reg,'');
  if ( direction == 'middle' ){
      let RegLeft = str.match(/(^[\t\r\f\n\s]*)/g)[0]; // 保存右边空格
      let RegRight = str.match(/([\t\r\f\n\s]*$)/g)[0]; // 保存左边空格
      newStr = RegLeft + newStr + RegRight; // 将空格加给清完全部空格后的字符串
  }
  return newStr;
}
export const handleUploadFile = (file) => {
  return new Promise((r, s) => {
    let baseUrl = 'https://qa.imagination.ooelicloud.com';
    // if (process.env.ENV === 'test' || process.env.ENV === 'development') {
    //   baseUrl = 'http://qa.imagination.ooelicloud.com';
    // }
    Taro.uploadFile({
      url: `${baseUrl}/service-third/third/file/upload`, //仅为示例，非真实的接口地址
      filePath: file,
      name: 'uploadFile',
      header: {
        'Content-Type': 'application/json',
        token: getGlobalData('token'),
        locale: 'zh_CN'
      },
      success(res) {
        const result = JSON.parse(res.data);
        r(result.data);
      }
    });
  });
};


export const removeEmptyProperties = (obj) => {
  // 使用 Object.entries() 将对象转换为键值对数组
  return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => {
          // 过滤掉没有值的属性
          return value !== undefined && value !== null && value !== '' && value !== 0 && value !== false;
      })
  );
}