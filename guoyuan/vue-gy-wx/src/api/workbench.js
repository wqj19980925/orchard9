import request from '@/utils/request'
// 收获产物 获取信息
export function benchReap(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/reap',
    method: 'post',
    data
  })
}
// 收获产物 提交表单
export function benchAddReap(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/addReap',
    method: 'post',
    data
  })
}

// 产量预估 获取信息
export function benchEstimate(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/estimate',
    method: 'post',
    data
  })
}
// 产量预估 提交表单
export function benchAddEstimate(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/addEstimate',
    method: 'post',
    data
  })
}

// 产量报损 获取信息
export function benchLoss(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/loss',
    method: 'post',
    data
  })
}
// 产量报损 提交表单
export function benchAddLoss(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/Addloss',
    method: 'post',
    data
  })
}

// 农事任务 获取信息
export function benchStack(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/stack',
    method: 'post',
    data
  })
}
// 农事任务 提交表单
export function benchAddStack(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/addStack',
    method: 'post',
    data
  })
}

// 工作台 标签
export function benchLabel(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/bench',
    method: 'post',
    data
  })
}
// 工作台 提交
export function benchInfo(data) {
  // console.log("data--",data)
  return request({
    url:'Bench/info',
    method: 'post',
    data
  })
}

//日志列表 
export function Myself_log(data){
  return request({
    url:'/Myself/log',
    method:'post',
    data
  })
}