import request from '@/utils/request'
//渠道列表--列表
export function ditchList(data) {
  return request({
    url: '/Ditch/index',
    method: 'post',
    data
  })
}
// 渠道列表--启用
export function ditchStart(data) {
  return request({
    url: '/Ditch/start',
    method: 'post',
    data
  })
}
// 渠道列表--停用
export function ditchStop(data) {
  return request({
    url: '/Ditch/stop',
    method: 'post',
    data
  })
}
// 渠道列表--搜索农资品类
export function searchDitchTag(data) {
  return request({
    url: '/Ditch/search',
    method: 'post',
    data
  })
}
// 渠道列表--添加--提交
export function addDitch(data) {
  return request({
    url: '/Ditch/add',
    method: 'post',
    data
  })
}
// 渠道列表--编辑--请求
export function editDitch(data) {
  return request({
    url: '/Ditch/edit',
    method: 'post',
    data
  })
}
// 渠道列表--删除
export function delDitch(data) {
  return request({
    url: '/Ditch/del',
    method: 'post',
    data
  })
}


//渠道标签--列表
export function labelList(data) {
  return request({
    url: '/Lable/index',
    method: 'post',
    data
  })
}
// 渠道标签--启用
export function labelStart(data) {
  return request({
    url: '/Lable/start',
    method: 'post',
    data
  })
}
// 渠道标签--停用
export function labelStop(data) {
  return request({
    url: '/Lable/stop',
    method: 'post',
    data
  })
}
// 渠道标签--添加--提交
export function addLabel(data) {
  return request({
    url: '/Lable/add',
    method: 'post',
    data
  })
}
// 渠道标签--编辑--请求
export function editLabel(data) {
  return request({
    url: '/Lable/edit',
    method: 'post',
    data
  })
}
// 渠道标签--删除
export function delLabel(data) {
  return request({
    url: '/Lable/del',
    method: 'post',
    data
  })
}
