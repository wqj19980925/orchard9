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
//新版入库
export function writeAssess(data) {
  return request({
    url: '/ware/writeAssess',
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
//新版出库

export function deliverAssess(data) {
  return request({
    url: '/ware/deliverAssess',
    method: 'post',
    data
  })
}
// 入库详情
export function lookWrite(data) {
  return request({
    url: '/ware/lookWrite',
    method: 'post',
    data
  })
}

// 添加商品
export function withoutGoods(data) {
  return request({
    url: '/ware/withoutGoods',
    method: 'post',
    data
  })
}
// 查库存
export function checkSto(data) {
  return request({
    url: '/ware/checkSto',
    method: 'post',
    data
  })
}

// 盘库
export function checkDish(data) {
  return request({
    url: '/ware/checkDish',
    method: 'post',
    data
  })
}
// 查库存
export function posiList(data) {
  return request({
    url: '/ware/posiList',
    method: 'post',
    data
  })
}
// 添加库位
export function position(data) {
  return request({
    url: '/ware/position',
    method: 'post',
    data
  })
}
// 编辑库位
export function edit(data) {
  return request({
    url: '/ware/edit',
    method: 'post',
    data
  })
}
// 下载模板
export function exports(data) {
  return request({
    url: '/ware/export',
    method: 'post',
    data
  })
}
// 导入库存文件
export function lead(data) {
  return request({
    url: '/ware/lead',
    method: 'post',
    data
  })
}
// 盘库位
export function dishBank(data) {
  return request({
    url: '/ware/dishBank',
    method: 'post',
    data
  })
}
//损耗报备
export function dishLoss(data) {
  return request({
    url: '/ware/dishLoss',
    method: 'post',
    data
  })
}

// 出库记录----列表
export function outLogList(data) {
  return request({
    url: '/ware/outLog',
    method: 'post',
    data
  })

}

// 入库记录----列表
export function inLogList(data) {
  return request({
    url: '/ware/inLog',
    method: 'post',
    data
  })
}
// 查看入库记录异常
export function inAbnormal(data) {
  return request({
    url: '/ware/inTry',
    method: 'post',
    data
  })
}
// 查看出库记录异常
export function outAbnormal(data) {
  return request({
    url: '/ware/outTry',
    method: 'post',
    data
  })
}
// 计数出库获取出库信息与提交
export function orderDeliver(data) {
  return request({
    url: '/ware/orderDeliver',
    method: 'post',
    data
  })
}
// 获取农户信息
export function getpeasants(data) {
  return request({
    url: '/ware/getpeasants',
    method: 'post',
    data
  })
}
