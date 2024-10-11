import request from '@/utils/request';
// 保存用户信息
export const userSave = (data) =>
  request({
    url: `/service-user/user/save`,
    method: 'POST',
    data
  });
// 保存用户信息
export const memberBenefit = (data) =>
  request({
    url: `/service-user/user/memberBenefit`,
    method: 'GET',
    data
  });
// 保存用户信息
export const unionID = (data) =>
  request({
    url: `/service-user/user/v2/unionID`,
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    data
  });
// 获取用户标签组信息
export const getUserTagGroup = () =>
  request({
    url: `/service-user/user/getUserTagGroup`,
    method: 'GET'
  });
// 获取用户扩展信息
export const getUserExt = () =>
  request({
    url: `/service-user/user/getUserExt`,
    method: 'GET'
  });
// 场景码解析
export const getQrSceneByCode = (data) =>
  request({
    url: `/service-user/wechat/getQrSceneByCode`,
    method: 'GET',
    data
  });
