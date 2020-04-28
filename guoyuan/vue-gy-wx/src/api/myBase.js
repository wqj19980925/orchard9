import request from '@/utils/request'
// 获取基地
export function mybaseIndex(data) {
  // console.log("data--",data)
  return request({
    url:'Mybase/index',
    method: 'post',
    data
  })
}

//基地环境数据 
export function Mybase_env(data) {
  return request({
    url:'/Mybase/env',
    method:"post",
    data
  })
}