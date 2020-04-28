import request from '@/utils/request'
// 获取仓库列表数据
export function wareList(data) {
  return request({
    url: '/ware/yunlist',
    method: 'post',
    data
  })
}
// 启用
export function enableWare(data) {
  return request({
    url: '/ware/warenable',
    method: 'post',
    data
  })
}
// 停用
export function warestop(data) {
  return request({
    url: '/ware/warestop',
    method: 'post',
    data
  })
}
// 删除
export function waredel(data) {
  return request({
    url: '/ware/waredel',
    method: 'post',
    data
  })
}
// 添加仓库
export function addWarehouse(data) {
  return request({
    url: '/ware/waremodify',
    method: 'post',
    data
  })
}
// 修改仓库
export function modifyWarehouse(data) {
  return request({
    url: '/ware/modifyedit',
    method: 'post',
    data
  })
}
// 出库单列表
export function writeLists(data) {
  return request({
    url: '/ware/deliverList',
    method: 'post',
    data
  })
}
// 导出出库单
export function educeEcxel(data) {
  return request({
    url: '/ware/deliverEduce',
    method: 'post',
    data
  })
}
// 删除出库单
export function writedelete(data) {
  return request({
    url: '/ware/deliverDel',
    method: 'post',
    data
  })
}
// 获取出库单信息
export function writeinto(data) {
  return request({
    url: '/ware/deliverOut',
    method: 'post',
    data
  })
}

// 检索商品
export function getgoods(data) {
  return request({
    url: '/ware/getgoods',
    method: 'post',
    data
  })
}

// 出库详情

export function lookWrite(data) {
  return request({
    url: '/ware/lookDeliver',
    method: 'post',
    data
  })
}

// 计数出库
export function writeAssess(data) {
  return request({
    url: '/ware/deliverAssess',
    method: 'post',
    data
  })
}
// 拒单
export function refuse(data) {
  return request({
    url: '/ware/refuse',
    method: 'post',
    data
  })
}

