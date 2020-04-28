import request from '@/utils/request'
//基地
export function benchInfo(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/index',
    method: 'post',
    data
  })
}
//选中基地
export function benchDefault(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/default',
    method: 'post',
    data
  })
}
//开始生产
export function benchStartPro(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/startPro',
    method: 'post',
    data
  })
}
//恢复生产
export function benchRecoverPro(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/recoverPro',
    method: 'post',
    data
  })
}
//暂停生产
export function benchSuspendPro(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/suspendPro',
    method: 'post',
    data
  })
}
//结束生产
export function benchEndPro(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/endPro',
    method: 'post',
    data
  })
}
//权限导航
export function mySelfNavigation(data) {
  // console.log("data--",data)
  return request({
    url:'Myself/navigation',
    method: 'post',
    data
  })
}
//获取账号信息
export function myUserInfo(data) {
  // console.log("data--",data)
  return request({
    url:'pc/userinfo',
    method: 'post',
    data
  })
}
