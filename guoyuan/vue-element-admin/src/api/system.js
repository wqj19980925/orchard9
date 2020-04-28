import request from '@/utils/request'

// 角色列表--列表
export function roleindex(data) {
  return request({
    url: '/role/roleindex',
    method: 'post',
    data
  })
}
// 角色列表--启用
export function roleStart(data) {
  return request({
    url: '/role/startstase',
    method: 'post',
    data
  })
}
// 角色列表--停用
export function roleStop(data) {
  return request({
    url: '/role/shopstase',
    method: 'post',
    data
  })
}
// 角色列表--添加-获取页面数据
export function roleAdd(data) {
  return request({
    url: '/role/addrole',
    method: 'post',
    data
  })
}
// 角色列表--添加--提交
export function addaction(data) {
  return request({
    url: '/role/addaction',
    method: 'post',
    data
  })
}
// 角色列表--编辑--请求
export function editrole(data) {
  return request({
    url: '/role/editrole',
    method: 'post',
    data
  })
}
// 角色列表--编辑--提交
export function editaction(data) {
  return request({
    url: '/role/editaction',
    method: 'post',
    data
  })
}

// 系统日志--列表
export function logList(data) {
  return request({
    url: '/coperationa',
    method: 'post',
    data
  })
}
// // 系统日志--列表
// export function getRoleInfo(data) {
//   return request({
//     url: '/admin/get_roleinfo',
//     method: 'post',
//     data
//   })
// }
// 客户列表--列表
// export function getCustInfo(data) {
//   return request({
//     url: '/company/index',
//     method: 'post',
//     data
//   })
// }

// // 客户列表--添加--提交
// export function addCustom(data) {
//   return request({
//     url: '/company/addcompany',
//     method: 'post',
//     data
//   })
// }
// // 客户列表--修改--提交
// export function editCustom(data) {
//   return request({
//     url: '/company/editcompany',
//     method: 'post',
//     data
//   })
// }
// // 客户列表--启用公司
// export function startComp(data) {
//   return request({
//     url: '/company/startcompany',
//     method: 'post',
//     data
//   })
// }
// // 客户列表--停用公司
// export function stopComp(data) {
//   return request({
//     url: '/company/stopcompany',
//     method: 'post',
//     data
//   })
// }

// 个人中心--页面展示信息
export function personal(data) {
  return request({
    url: '/My/personal',
    method: 'post',
    data
  })
}
// 个人中心--更改电话新手机号验证
export function newTel(data) {
  return request({
    url: '/My/newTel',
    method: 'post',
    data
  })
}
// 个人中心--原有电话验证
export function agoTel(data) {
  return request({
    url: '/My/agoTel',
    method: 'post',
    data
  })
}

// 个人中心--验证原密码
export function oldpwd(data) {
  return request({
    url: '/My/oldpwd',
    method: 'post',
    data
  })
}
// 个人中心-修改公司logo接口
export function editlogo(data) {
  return request({
    url: '/My/editlogo',
    method: 'post',
    data
  })
}
// 个人中心-查看营业执照接口
export function showlicense(data) {
  return request({
    url: '/My/license',
    method: 'post',
    data
  })
}
// 个人中心-修改公司信息
export function companyedit(data) {
  return request({
    url: '/My/companyedit',
    method: 'post',
    data
  })
}
// 个人中心-新密码
export function newpwd(data) {
  return request({
    url: '/My/newpwd',
    method: 'post',
    data
  })
}
// // 个人中心-修改个人信息
// export function personaledit(data) {
//   return request({
//     url: '/admin/personaledit',
//     method: 'post',
//     data
//   })
// }