import request from '@/utils/request'
// 登录
export function loginByUsername(data) {
  // const data = {
  //   username,
  //   password,
  //   type,
  //   islogin
  // }
  return request({
    url: '/pc/login',
    method: 'post',
    data
    // baseURL: process.env.BASE_API
  })
}
// 退出
export function LogOut(token) {
  const data = {
    api_token: token
  }
  return request({
    url: '/pc/loginout',
    method: 'post',
    data
  })
}
// 获取用户信息
export function getInfo(token) {
  const data = {
    api_token: token
  }
  return request({
    url: '/pc/userinfo',
    method: 'post',
    data
  })
}
// 获取左侧信息
export function serverRouterMap(token) {
  const data = {
    api_token: token
  }
  return request({
    url: '/pc/navigation',
    method: 'post',
    data
  })
}
