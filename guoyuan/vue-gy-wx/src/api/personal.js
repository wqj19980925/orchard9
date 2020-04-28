import request from '@/utils/request'
// 我的
export function mySelf(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/index',
    method: 'post',
    data
  })
}

// 我的 关联账号
export function mySelfRelevance(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/relevance',
    method: 'post',
    data
  })
}
// 我的 关联账号 停用
export function mySelfStop(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/stop',
    method: 'post',
    data
  })
}
// 我的 关联账号 启用
export function mySelfStart(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/start',
    method: 'post',
    data
  })
}
// 我的 关联账号 删除
export function mySelfDel(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/del',
    method: 'post',
    data
  })
}
// 我的 关联账号 新增
export function mySelfAdd(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/Addrelevance',
    method: 'post',
    data
  })
}

// 我的 物资列表
export function mySelfMaterials(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/materials',
    method: 'post',
    data
  })
}
// 我的 物资列表 盘点
export function mySelfCheck(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/check',
    method: 'post',
    data
  })
}
// 我的 物资列表 归还记录
export function mySelfRecord(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/record',
    method: 'post',
    data
  })
}
// 我的 物资列表 归还记录 撤回
export function mySelfRecall(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/recall',
    method: 'post',
    data
  })
}
// 我的 物资列表 归还物资 仓库和运输
export function mySelfGetWare(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/getWare',
    method: 'post',
    data
  })
}
// 我的 物资列表 归还物资 库位
export function mySelfGetStorage(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/getstorage',
    method: 'post',
    data
  })
}
// 我的 物资列表 归还物资 提交
export function mySelfReturn(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/return',
    method: 'post',
    data
  })
}

// 我的 系统消息 列表
export function mySelfNews(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/news',
    method: 'post',
    data
  })
}
// 我的 系统消息 详情
export function mySelfRead(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/read',
    method: 'post',
    data
  })
}

// 我的 我的任务
export function mySelfMyStack(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/myStack',
    method: 'post',
    data
  })
}
// 我的 我的任务 查看
export function mySelfStack(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/stack',
    method: 'post',
    data
  })
}
// 我的 我的任务 提交（调整农事任务提交接口）
export function mySelfAddStack(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/addStack',
    method: 'post',
    data
  })
}

//提交任务需要的农资库存
export function myselfConsume(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/consume',
    method: 'post',
    data
  })
}