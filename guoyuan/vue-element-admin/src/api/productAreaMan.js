import request from '@/utils/request'
// 区域列表-列表
export function areaList(data) {
  return request({
    url: '/District/index',
    method: 'post',
    data
  })
}
// 区域列表-启用
export function startArea(data) {
  return request({
    url: '/District/start',
    method: 'post',
    data
  })
}
// 区域列表-停用
export function stopArea(data) {
  return request({
    url: '/District/stop',
    method: 'post',
    data
  })
}
// 区域列表-添加区域
export function addArea(data) {
  return request({
    url: '/District/add',
    method: 'post',
    data
  })
}
// 区域列表-编辑
export function editArea(data) {
  return request({
    url: '/District/edit',
    method: 'post',
    data
  })
}
// 区域列表-删除
export function delArea(data) {
  return request({
    url: '/District/del',
    method: 'post',
    data
  })
}
// 区域列表-搜索产区/基地
export function searArea(data) {
  return request({
    url: '/District/search',
    method: 'post',
    data
  })
}
// 区域列表-区域管理上方
export function areaUpManage(data) {
  return request({
    url: '/District/manageUp',
    method: 'post',
    data
  })
}
// 区域列表-区域管理下方
export function areadownManage(data) {
  return request({
    url: '/District/manageIndex',
    method: 'post',
    data
  })
}
// 区域列表-区域管理--导出
export function areaExport(data) {
  return request({
    url: '/District/export',
    method: 'post',
    data
  })
}

// 基地列表-列表
export function baseList(data) {
  return request({
    url: '/massif/index',
    method: 'post',
    data
  })
}
// 基地列表-启用
export function startBase(data) {
  return request({
    url: '/massif/startfarmland',
    method: 'post',
    data
  })
}
// 基地列表-停用
export function stopBase(data) {
  return request({
    url: '/massif/stopfarmland',
    method: 'post',
    data
  })
}
// 基地列表-添加区域
export function addBase(data) {
  return request({
    url: '/massif/addfarmland',
    method: 'post',
    data
  })
}
// 基地列表-编辑
export function editBase(data) {
  return request({
    url: '/massif/editfarmland',
    method: 'post',
    data
  })
}
// 基地列表-删除
export function delBase(data) {
  return request({
    url: '/massif/delfarmland',
    method: 'post',
    data
  })
}
// 基地列表-编辑--获取信息
export function getEditBase(data) {
  return request({
    url: '/massif/getmatfar',
    method: 'post',
    data
  })
}
// 基地列表-编辑--获取信息
export function getFarmer(data) {
  return request({
    url: '/massif/farmer',
    method: 'post',
    data
  })
}
// 基地列表-编辑--环境数据
export function getEnviroment(data) {
  return request({
    url: '/massif/env',
    method: 'post',
    data
  })
}
// 基地列表—环境数据—刷新按钮
export function refreshBase(data) {
  return request({
    url: '/massif/manual',
    method: 'post',
    timeout:20000,
    data
  })
}
// 基地列表—产区管理
export function productBase(data) {
  return request({
    url: '/massif/Producing',
    method: 'post',
    data
  })
}
// 基地列表—区域管理
export function areaBase(data) {
  return request({
    url: '/massif/District',
    method: 'post',
    data
  })
}
// 基地列表—数据管理New
export function dataManage(data) {
  return request({
    url: '/massif/getDetection',
    method: 'post',
    data
  })
}


// 气象站编辑绑定—获取数据NEW
export function getBindInfo(data) {
  return request({
    url: '/massif/getSavescene',
    method: 'post',
    data
  })
}
// 气象站编辑绑定—提交NEW
export function subBind(data) {
  return request({
    url: '/massif/saveScene',
    method: 'post',
    data
  })
}

// 产区列表-列表
export function proAreaList(data) {
  return request({
    url: '/Producing/index',
    method: 'post',
    data
  })
}
// 产区列表-启用
export function openProArea(data) {
  return request({
    url: '/Producing/start',
    method: 'post',
    data
  })
}
// 产区列表-停用
export function stopProArea(data) {
  return request({
    url: '/Producing/stop',
    method: 'post',
    data
  })
}
// 产区列表-添加区域
export function addProArea(data) {
  return request({
    url: '/Producing/add',
    method: 'post',
    data
  })
}
// 产区列表-编辑
export function editProArea(data) {
  return request({
    url: '/Producing/edit',
    method: 'post',
    data
  })
}
// 产区列表-删除
export function delProArea(data) {
  return request({
    url: '/Producing/del',
    method: 'post',
    data
  })
}
// 产区列表-新增--获取信息
export function getAddProArea(data) {
  return request({
    url: '/Producing/getData',
    method: 'post',
    data
  })
}
// 产区列表-新增--获取信息
export function getBase(data) {
  return request({
    url: '/Producing/getBase',
    method: 'post',
    data
  })
}
// 产区列表
export function refreProduct(data) {
  return request({
    url: '/Producing/manual',
    method: 'post',
    timeout:20000,
    data
  })
}
// 产区列表--区域管理
export function areaProduct(data) {
  return request({
    url: '/Producing/District',
    method: 'post',
    timeout:20000,
    data
  })
}


// 农事任务-列表
export function agrTaskList(data) {
  return request({
    url: '/FarmingTask/index',
    method: 'post',
    data
  })
}
// 农事任务-添加区域
export function addAgrTask(data) {
  return request({
    url: '/FarmingTask/add',
    method: 'post',
    data
  })
}

// 农事任务-发布
export function publishTask(data) {
  return request({
    url: '/FarmingTask/issue',
    method: 'post',
    data
  })
}
// 农事任务-加急
export function urgentTask(data) {
  return request({
    url: '/FarmingTask/urgent',
    method: 'post',
    data
  })
}

// 农事任务-撤销
export function cancelTask(data) {
  return request({
    url: '/FarmingTask/revocation',
    method: 'post',
    data
  })
}
//
// 农事任务-删除
export function delTask(data) {
  return request({
    url: '/FarmingTask/delete',
    method: 'post',
    data
  })
}

// 农事任务-导出
export function exportTask(data) {
  return request({
    url: '/FarmingTask/export',
    method: 'post',
    data
  })
}
// 农事任务-编辑
export function editAgrTask(data) {
  return request({
    url: '/FarmingTask/edit',
    method: 'post',
    data
  })
}

// 任务记录-列表
export function taskRecList(data) {
  return request({
    url: '/FarmingTaskRecord/index',
    method: 'post',
    data
  })
}
// 任务记录-导出
export function exportTaskRec(data) {
  return request({
    url: '/FarmingTaskRecord/export',
    method: 'post',
    data
  })
}
// 任务记录-编辑
export function againTaskRec(data) {
  return request({
    url: '/FarmingTaskRecord/again',
    method: 'post',
    data
  })
}


// 设备列表-列表
export function deviceList(data) {
  return request({
    url: '/Equipment/index',
    method: 'post',
    data
  })
}
// 设备列表-添加设备
export function addEquipment(data) {
  return request({
    url: '/Equipment/add',
    method: 'post',
    data
  })
}
// 设备列表-搜索基地/产区/区域
export function searchBase(data) {
  return request({
    url: '/Equipment/search',
    method: 'post',
    data
  })
}
// 设备列表-编辑设备
export function editEquipment(data) {
  return request({
    url: '/Equipment/edit',
    method: 'post',
    data
  })
}
// 设备列表-停用设备
export function stopEquipment(data) {
  return request({
    url: '/Equipment/stop',
    method: 'post',
    data
  })
}
// 设备列表-启用设备
export function startEquipment(data) {
  return request({
    url: '/Equipment/start',
    method: 'post',
    data
  })
}
// 设备列表-删除设备
export function delEquipment(data) {
  return request({
    url: '/Equipment/del',
    method: 'post',
    data
  })
}
// 设备列表-隐藏设备
export function hideEquipment(data) {
  return request({
    url: '/Equipment/hide',
    method: 'post',
    data
  })
}
// 设备列表-显示设备
export function showEquipment(data) {
  return request({
    url: '/Equipment/show',
    method: 'post',
    data
  })
}
// 设备列表-气象站绑定—获取数据
export function getBinding(data) {
  return request({
    url: '/Equipment/getScene',
    method: 'post',
    data
  })
}
// 设备列表-气象站绑定—绑定
export function bindingThis(data) {
  return request({
    url: '/Equipment/scene',
    method: 'post',
    data
  })
}
// 设备列表-气象站编辑绑定—获取数据
export function getEditBinding(data) {
  return request({
    url: '/Equipment/getSavescene',
    method: 'post',
    data
  })
}
// 设备列表-气象站编辑绑定
export function EditBinding(data) {
  return request({
    url: '/Equipment/saveScene',
    method: 'post',
    data
  })
}
// 设备列表-气象站—解绑
export function getUntying(data) {
  return request({
    url: '/Equipment/unbind',
    method: 'post',
    data
  })
}

// 设备列表-气象站-数据管理列表/新增/删除
export function dataManageList(data) {
  return request({
    url: '/massif/device_data',
    method: 'post',
    data
  })
}
// 设备列表-气象站-数据管理编辑
export function editDataManage(data) {
  return request({
    url: '/Equipment/getSavescene',
    method: 'post',
    data
  })
}

// 设备列表-气象站-数据管理自动获取数据
export function getDataManage(data) {
  return request({
    url: '/Equipment/manual',
    method: 'post',
    timeout:20000,
    data

  })
}