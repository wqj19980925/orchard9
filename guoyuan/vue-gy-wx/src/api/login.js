import request from '@/utils/request'
// 登录
export function login(data) {
  // console.log("data--",data)
  return request({
    url:'pc/login',
    method: 'post',
    data
  })
}
// 发送验证码
export function getCode(data) {
  // console.log("data--",data)
  return request({
    url:'wx/getCode',
    method: 'post',
    data
  })
}
// 退出
export function loginout(data) {
  return request({
    url:'Myself/loginout',
    method: 'post',
    data
  })
}

