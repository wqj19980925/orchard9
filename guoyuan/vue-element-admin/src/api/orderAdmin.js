import request from '@/utils/request'

// 订单列表
export function orderList(data) {
  return request({
    url: '/order/orderlist',
    method: 'post',
    data
  })
}
// 订单导出
export function excalOut(data) {
  return request({
    url: '/order/orderexport',
    method: 'post',
    data
  })
}
// 新增订单--获取信息
export function addOrderpage(data) {
  return request({
    url: '/order/getorder',
    method: 'post',
    data
  })
}
//提交订单
export function addOrder(data) {
  return request({
    url: '/order/addorder',
    method: 'post',
    data
  })
}

//搜索运输单位
export function searchTrans(data) {
  return request({
    url: '/order/searchTra',
    method: 'post',
    data
  })
}



// 请求编辑提交
export function editOrder(data) {
  return request({
    url: '/order/editorder',
    method: 'post',
    data
  })
}
// 新增/编辑--搜索商品名称
export function getGooName(data) {
  return request({
    url: '/order/getname',
    method: 'post',
    data
  })
}

// 备注列表
export function remarkslist(data) {
  return request({
    url: '/order/remarkslist',
    method: 'post',
    data
  })
}
//编辑订单--获取订单详情
export function getOrderEidt(data) {
  return request({
    url: '/order/ordereidt',
    method: 'post',
    data
  })
}
//编辑订单--获取订单详情
export function getOrdeRemark(data) {
  return request({
    url: '/order/remark_list',
    method: 'post',
    data
  })
}
// 添加订单备注
export function addRemarks(data) {
  return request({
    url: '/order/addremarks',
    method: 'post',
    data
  })
}
// 锁定订单
export function LockingOrder(data) {
  return request({
    url: '/order/lockingdel',
    method: 'post',
    data
  })
}
// 解锁订单
export function unlockOrder(data) {
  return request({
    url: '/order/orderunlock',
    method: 'post',
    data
  })
}
// 删除订单
export function delOrder(data) {
  return request({
    url: '/order/orderdel',
    method: 'post',
    data
  })
}
// 订单派发--获取信息
export function getDistriOrder(data) {
  return request({
    url: '/order/distriorder',
    method: 'post',
    data
  })
}
// 派发订单--提交
export function distriware(data) {
  return request({
    url: '/order/distriware',
    method: 'post',
    data
  })
}
// 签收订单
export function signforOrder(data) {
  return request({
    url: '/order/signfor',
    method: 'post',
    data
  })
}
// 运输报损
export function lossOrder(data) {
  return request({
    url: '/order/loss',
    method: 'post',
    data
  })
}
// 获取运输报损信息
export function getlossInfo(data) {
  return request({
    url: '/order/lossGet',
    method: 'post',
    data
  })
}
// 订单完成
export function compOrder(data) {
  return request({
    url: '/order/ordercomplete',
    method: 'post',
    data
  })
}
// 导入订单
export function importOrder(data) {
  return request({
    url: '/order/importorder',
    method: 'post',
    data
  })
}
// 模板--导出
export function downExcel(data) {
  return request({
    url: '/Goods/export',
    method: 'post',
    data
  })
}
// 销售平台列表接口
export function platindex(data) {
  return request({
    url: '/platform/platindex',
    method: 'post',
    data
  })
}
// 添加销售平台接口
export function platadd(data) {
  return request({
    url: '/platform/platadd',
    method: 'post',
    data
  })
}
// 停用销售平台接口
export function shopstase(data) {
  return request({
    url: '/platform/shopstase',
    method: 'post',
    data
  })
}
// 启用销售平台接口
export function startstase(data) {
  return request({
    url: '/platform/startstase',
    method: 'post',
    data
  })
}
// 删除销售平台接口
export function platdel(data) {
  return request({
    url: '/platform/del',
    method: 'post',
    data
  })
}
// 编辑销售平台
export function platedit(data) {
  return request({
    url: '/platform/platedit',
    method: 'post',
    data
  })
}
// 导出销售平台
// export function platimpot(data) {
//   return request({
//     url: '/platform/platimpot' + '/api_token/' + data.api_token + '/plat_name/' + data.plat_name,
//     method: 'get',
//     params: {},
//     data: {}
//   })
// }
// 销售平台导出
export function platimpt(data) {
  return request({
    url: '/platform/platimpot',
    method: 'post',
    data
  })
}
// 运输平台-列表
export function transPlat(data) {
  return request({
    url: '/Traffic/index',
    method: 'post',
    data
  })
}
// 运输平台-添加
export function transAdd(data) {
  return request({
    url: '/Traffic/add',
    method: 'post',
    data
  })
}
// 运输平台-导出
export function transImp(data) {
  return request({
    url: '/Traffic/impot',
    method: 'post',
    data
  })
}
// 运输平台-编辑
export function transEdit(data) {
  return request({
    url: '/Traffic/edit',
    method: 'post',
    data
  })
}
// 运输平台-删除
export function transDel(data) {
  return request({
    url: '/Traffic/del',
    method: 'post',
    data
  })
}
// 运输平台-启用
export function transStart(data) {
  return request({
    url: '/Traffic/start',
    method: 'post',
    data
  })
}
// 运输平台-停用
export function tranStop(data) {
  return request({
    url: '/Traffic/stop',
    method: 'post',
    data
  })
}