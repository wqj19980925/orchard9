import request from '@/utils/request'
// 农户-列表
export function farmerList(data) {
  return request({
    url: '/farmer/index',
    method: 'post',
    data
  })
}
// 农户-点击基地数量--获取信息
export function getBaseInfo(data) {
  return request({
    url: '/farmer/far_count',
    method: 'post',
    data
  })
}
// 农户-点击农户物资--获取物资信息
export function getMaterInfo(data) {
  return request({
    url: 'farmer/Materials',
    method: 'post',
    data
  })
}
// 农户-启用
export function startFarmer(data) {
  return request({
    url: '/farmer/startfarmer',
    method: 'post',
    data
  })
}
// 农户-停用
export function stopFarmer(data) {
  return request({
    url: '/farmer/stopfarmer',
    method: 'post',
    data
  })
}
// 农户-新增
export function addFarmer(data) {
  return request({
    url: '/farmer/addfarmer',
    method: 'post',
    data
  })
}
// 农户-修改
export function editFarmer(data) {
  return request({
    url: '/farmer/editfarmer',
    method: 'post',
    data
  })
}
// 农户-重置密碼
export function resetFmpwd(data) {
  return request({
    url: '/farmer/reset_pwd',
    method: 'post',
    data
  })
}
// 农户-点击子账号--获取信息
export function getAccount(data) {
  return request({
    url: '/farmer/account',
    method: 'post',
    data
  })
}


// 员工-列表
export function staffList(data) {
  return request({
    url: '/Official/index',
    method: 'post',
    data
  })
}
// 员工-在职
export function startStaff(data) {
  return request({
    url: '/Official/start',
    method: 'post',
    data
  })
}
// 员工-离职
export function stopStaff(data) {
  return request({
    url: '/Official/stop',
    method: 'post',
    data
  })
}
// 员工-新增
export function addStaff(data) {
  return request({
    url: '/Official/add',
    method: 'post',
    data
  })
}
// 员工-修改
export function editStaff(data) {
  return request({
    url: '/Official/edit',
    method: 'post',
    data
  })
}
// 员工-删除
export function delStaff(data) {
  return request({
    url: '/Official/del',
    method: 'post',
    data
  })
}
// 员工-删除
export function searchDepart(data) {
  return request({
    url: '/Official/search',
    method: 'post',
    data
  })
}

// 临时工-列表
export function tempList(data) {
  return request({
    url: '/Temporary/index',
    method: 'post',
    data
  })
}
// 临时工-启用
export function startTemp(data) {
  return request({
    url: '/Temporary/start',
    method: 'post',
    data
  })
}
// 临时工-停用
export function stopTemp(data) {
  return request({
    url: '/Temporary/stop',
    method: 'post',
    data
  })
}
// 临时工-新增
export function addTemp(data) {
  return request({
    url: '/Temporary/add',
    method: 'post',
    data
  })
}
// 临时工-修改
export function editTemp(data) {
  return request({
    url: '/Temporary/edit',
    method: 'post',
    data
  })
}
// 临时工-删除
export function delTemp(data) {
  return request({
    url: '/Temporary/del',
    method: 'post',
    data
  })
}
// 临时工-删除工作记录
export function delRecord(data) {
  return request({
    url: '/Temporary/delwork',
    method: 'post',
    data
  })
}
// 临时工-工作记录列表
export function recordList(data) {
  return request({
    url: '/Temporary/record',
    method: 'post',
    data
  })
}
// 临时工-新增工作
export function addWork(data) {
  return request({
    url: '/Temporary/addWork',
    method: 'post',
    data
  })
}

// 管理员-列表
export function adminList(data) {
  return request({
    url: '/Manage/index',
    method: 'post',
    data
  })
}
// 管理员-启用
export function startAdmin(data) {
  return request({
    url: '/Manage/start',
    method: 'post',
    data
  })
}
// 管理员-停用
export function stopAdmin(data) {
  return request({
    url: '/Manage/stop',
    method: 'post',
    data
  })
}
// 管理员-新增
export function addAdmin(data) {
  return request({
    url: '/Manage/add',
    method: 'post',
    data
  })
}
// 管理员-修改
export function editAdmin(data) {
  return request({
    url: '/Manage/edit',
    method: 'post',
    data
  })
}
// 管理员-搜索角色权限
export function searchRoal(data) {
  return request({
    url: '/Manage/role',
    method: 'post',
    data
  })
}
// 管理员-新增--搜索员工姓名
export function searchAdmin(data) {
  return request({
    url: '/Manage/search',
    method: 'post',
    data
  })
}
// 管理员-新增--搜索员工姓名
export function resetAdminpwd(data) {
  return request({
    url: '/Manage/reset_pwd',
    method: 'post',
    data
  })
}



// 部门班组-列表
export function groupList(data) {
  return request({
    url: '/Section/index',
    method: 'post',
    data
  })
}
// 部门班组-启用
export function startGroup(data) {
  return request({
    url: '/Section/start',
    method: 'post',
    data
  })
}
// 部门班组-停用
export function stopGroup(data) {
  return request({
    url: '/Section/stop',
    method: 'post',
    data
  })
}
// 部门班组-新增
export function addGroup(data) {
  return request({
    url: '/Section/add',
    method: 'post',
    data
  })
}
// 部门班组-修改
export function editGroup(data) {
  return request({
    url: '/Section/edit',
    method: 'post',
    data
  })
}

// 监管列表 -- 新增
export function addMonitoring(data) {
  return request({
    url: '/monitoring/add',
    method: 'post',
    data
  })
}

// 监管列表 -- 编辑
export function editMonitoring(data) {
  return request({
    url: '/monitoring/edit',
    method: 'post',
    data
  })
}

// 监管列表 
export function IndexMonitoring(data) {
  return request({
    url: '/monitoring/index',
    method: 'post',
    data
  })
}

// 监管列表  -- 删除
export function deletMonitoring(data) {
  return request({
    url: '/monitoring/delete',
    method: 'post',
    data
  })
}

// 农户列表 -- 导出
export function exportfarmerAx(data) {
  return request({
    url: '/farmer/exportfarmer',
    method: 'post',
    data
  })
}