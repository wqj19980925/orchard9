import request from '@/utils/request'

// 添加订单
export function addOrder(data) {
  return request({
    url: '/addOrder',
    method: 'get',
    data
  })
}

// 订单管理-订单状态
export function orderSta(data) {
  return request({
    url: '/adminOrder/status',
    method: 'post',
    data
  })
}

// 售后列表
export function staBtn(data) {
  return request({
    url: '/afsales/status',
    method: 'post',
    data
  })
}

// 地址查询-弹窗-备注内容
export function remData(data) {
  return request({
    url: '/address/remarks',
    method: 'post',
    data
  })
}

// 月结列表--列表
export function monthList(data) {
  return request({
    url: '/month/list',
    method: 'post',
    data
  })
}
