
import Taro, { setStorageSync,getStorageSync } from '@tarojs/taro';

const globalData = {
  token: '',
  isLogin: false,
  userName: "",
  tab: 1,
  companyList:[]
}

export function setGlobalData (key, val) {
  if(key == 'token'){
    setStorageSync('token', val)
  }
  globalData[key] = val
}
export function getGlobalData (key) {
  if(key == 'token'){
    return globalData[key] ? globalData[key] :  getStorageSync('token')
  }
  return globalData[key]
}