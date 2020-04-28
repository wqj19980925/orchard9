import request from '@/utils/request'
//我的农资--列表
export function AgriList(data) {
  return request({
    url: '/Agric/index',
    method: 'post',
    data
  })
}
// 我的农资--启用
export function AgricStart(data) {
  return request({
    url: '/Agric/start',
    method: 'post',
    data
  })
}
// 我的农资--停用
export function AgricStop(data) {
  return request({
    url: '/Agric/stop',
    method: 'post',
    data
  })
}
// 我的农资--搜索农资品类
export function searchAgric(data) {
  return request({
    url: '/Agric/search',
    method: 'post',
    data
  })
}
// 我的农资--添加--提交
export function addAgric(data) {
  return request({
    url: '/Agric/add',
    method: 'post',
    data
  })
}
// 我的农资--编辑--请求
export function editAgric(data) {
  return request({
    url: '/Agric/edit',
    method: 'post',
    data
  })
}
// 我的农资--删除
export function delAgric(data) {
  return request({
    url: '/Agric/del',
    method: 'post',
    data
  })
}


//农资品类--列表
export function AgriClassList(data) {
  return request({
    url: '/AgrClass/index',
    method: 'post',
    data
  })
}
// 农资品类--启用
export function AgriClassStart(data) {
  return request({
    url: '/AgrClass/start',
    method: 'post',
    data
  })
}
// 农资品类--停用
export function AgriClassStop(data) {
  return request({
    url: '/AgrClass/stop',
    method: 'post',
    data
  })
}
// 农资品类--添加--提交
export function addAgriClass(data) {
  return request({
    url: '/AgrClass/add',
    method: 'post',
    data
  })
}
// 农资品类--编辑--请求
export function editAgriClass(data) {
  return request({
    url: '/AgrClass/edit',
    method: 'post',
    data
  })
}
// 农资品类--删除
export function delAgriClass(data) {
  return request({
    url: '/AgrClass/del',
    method: 'post',
    data
  })
}


//苗木管理--列表
export function seedlingList(data) {
  return request({
    url: '/Nursery/index',
    method: 'post',
    data
  })
}
// 苗木管理--启用
export function seedlingStart(data) {
  return request({
    url: '/Nursery/start',
    method: 'post',
    data
  })
}
// 苗木管理--停用
export function seedlingStop(data) {
  return request({
    url: '/Nursery/stop',
    method: 'post',
    data
  })
}
// 苗木管理--添加--提交
export function addSeedling(data) {
  return request({
    url: '/Nursery/add',
    method: 'post',
    data
  })
}
// 苗木管理--编辑--请求
export function EditSeedling(data) {
  return request({
    url: '/Nursery/edit',
    method: 'post',
    data
  })
}



//我的农资--列表
export function myMaterialList(data) {
  return request({
    url: '/MyAgric/index',
    method: 'post',
    data
  })
}

// 我的农资--搜索仓库
export function searWarehouse(data) {
  return request({
    url: '/MyAgric/ware',
    method: 'post',
    data
  })
}
// 我的农资--损耗报备
export function lossMyMaterial(data) {
  return request({
    url: '/MyAgric/loss',
    method: 'post',
    data
  })
}