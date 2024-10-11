import request from '@/utils/request';

export const orderPayment = (data) =>
  request({
    url: `/front-api/store/order/payment`,
    method: 'GET',
    data
  });
// 查看详情
export const activityInfo = (id) =>
  request({
    url: `/front-api/store/activity/info/${id}`,
    method: 'GET'
  });
// 活动分页查询
export const activityQueryPage = (data) =>
  request({
    url: `/front-api/store/activity/queryPage`,
    method: 'GET',
    data
  });

// 查看详情
export const productInfo = (id) =>
  request({
    url: `/front-api/store/product/info/${id}`,
    method: 'GET'
  });
// 商品分页查询
export const productQueryPage = (data) =>
  request({
    url: `/front-api/store/product/list`,
    method: 'GET',
    data
  });
// 活动详情
export const informationDetail = (id) =>
  request({
    url: `/front-api/store/activity/info/${id}`,
    method: 'GET'
  });
// 查看排名
export const activityRank = (id) =>
request({
  url: `/front-api/store/activity/rank/${id}`,
  method: 'GET'
});
// 参与活动
export const activityBuy = (data) =>
request({
  url: `/front-api/store/activity/buy`,
  method: 'POST',
  data
});
// 取消订单
export const cancelOrder = (data) =>
request({
  url: `/front-api/store/order/cancelOrder`,
  method: 'POST',
  data
});
// 生成订单
export const createOrder = (data) =>
request({
  url: `/front-api/store/order/createOrder`,
  method: 'POST',
  data
});

// 删除订单
export const deleteOrder = (data) =>
request({
  url: `/front-api/store/order/deleteOrder`,
  method: 'POST',
  data
});
// 查看订单详情
export const orderDetail = (data) =>
request({
  url: `/front-api/store/order/detail`,
  method: 'GET',
  data
});
// 查看订单详情
export const getByOrderNo = (data) =>
  request({
    url: `/front-api/store/order/getByOrderNo`,
    method: 'GET',
    data
  });
// 订单分页查询
export const orderQueryPage = (data) =>
  request({
    url: `/order/list`,
    method: 'POST',
    data
  });
// 积分分页查询
export const pointRecord = (data) =>
  request({
    url: `/front-api/store/user/point/record`,
    method: 'GET',
    data
  });
// 钱包账户
export const purseAccount = (data) =>
  request({
    url: `/front-api/store/user/purse/account`,
    method: 'GET',
    data
  });
// 积分分页查询


// 获取用户信息
export const getUserInfo = (data) =>
  request({
    url: `/front-api/store/auth/user/info`,
    method: 'GET',
    data
  });
// 获取用户信息
export const queryPayResult = (data) =>
  request({
    url: `/front-api/store/pay/queryPayResult`,
    method: 'GET',
    data
  });
// 获取手机号
export const getPhone = (data) =>
  request({
    url: `/wx/user/mobile/register`,
    method: 'POST',
    data
});

// 订单支付
export const payment = (data) =>
  request({
    url: `/front-api/store/pay/payment`,
    method: 'POST',
    data
});
// 订单支付
export const adviceSave = (data) =>
  request({
    url: `/suggest/add`,
    method: 'POST',
    data
});





export const nameDesign = (data) =>
  request({
    url: `/company/name/free_design`,
    method: 'POST',
    data
});
export const namePayDesign = (data) =>
  request({
    url: `/company/name/paid_design`,
    method: 'POST',
    data
});

export const recordDetail = (data) =>
  request({
    url: `/company/naming/record/detail`,
    method: 'GET',
    data
});
export const recordList = (data) =>
  request({
    url: `/company/naming/record/list`,
    method: 'POST',
    data
});

export const itemList = (data) =>
  request({
    url: `/item/list`,
    method: 'GET',
    data
});
export const accountDetail = (data) =>
  request({
    url: `/account/detail`,
    method: 'GET',
    data
});
export const orderPay = (data) =>
  request({
    url: `/order/pay`,
    method: 'POST',
    data
});

export const bannerList = (data) =>
  request({
    url: `/banner/list`,
    method: 'GET',
    data
  });