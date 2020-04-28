import request from '@/utils/request'

// 获取区域+地区的耕地列表
export function getList(data) {
  return request({
    url: '/api/massif/cultivated',
    method: 'post',
    data
  })
}
//  获取耕种列表 及页面信息
export function landList(data) {
  return request({
    url: '/api/massif/cultails',
    method: 'post',
    data
  })
}
//  获取耕种列表
export function landLISt(data) {
  return request({
    url: '/api/massif/cultailslist',
    method: 'post',
    data
  })
}
//  编辑耕地
export function editcult(data) {
  return request({
    url: '/api/massif/editcultiv',
    method: 'post',
    data
  })
}
//  添加耕地
export function addcult(data) {
  return request({
    url: '/api/massif/addcultails',
    method: 'post',
    data
  })
}
//  删除耕地
export function delChose(data) {
  return request({
    url: '/api/massif/deltcultails',
    method: 'post',
    data
  })
}

// 地图--接口
export function map(data) {
  return request({
    url: 'https://easy-mock.com/mock/5c10f1d6147e1d3ae11af33f/name/popos',
    method: 'GET',
    data
  })
}

// 新建农田接口
export function addcropland(data) {
  return request({
    url: '/api/massif/addfarmland',
    method: 'POST',
    data
  })
}

// 占地区域
export function area(data) {
  return request({
    url: '/api/massif/addregion',
    method: 'POST',
    data
  })
}

// 获取农田列表
export function nt_listss(data) {
  return request({
    url: '/api/massif/farmland',
    method: 'POST',
    data
  })
}

// 获取地块列表
export function log(data) {
  return request({
    url: '/api/massif/addmassif',
    method: 'POST',
    data
  })
}

// 数字地图加载栏目
export function defa_map(data) {
  return request({
    url: '/api/massif/maplist',
    method: 'POST',
    data
  })
}

// 添加土地接口
export function add_land(data) {
  return request({
    url: '/api/massif/addcultiv',
    method: 'POST',
    data
  })
}

// 获取地块列表
export function plot_list(data) {
  return request({
    url: '/api/massif/massifdata',
    method: 'POST',
    data
  })
}

// ===添加仓库
export function add_ware(data) {
  return request({
    url: '/api/massif/addware',
    method: 'POST',
    data
  })
}

// ==删除土地
export function delcultiv(data) {
  return request({
    url: '/api/massif/delcultiv',
    method: 'POST',
    data
  })
}

// =====删除仓库
export function editware(data) {
  return request({
    url: '/api/massif/delware',
    method: 'POST',
    data
  })
}

// ==删除地块
export function delmassif(data) {
  return request({
    url: '/api/massif/delmassif',
    method: 'POST',
    data
  })
}

// ===删除区域
export function delregion(data) {
  return request({
    url: '/api/massif/delregion',
    method: 'POST',
    data
  })
}

// ====删除农田
export function delfarmland(data) {
  return request({
    url: '/api/massif/delfarmland',
    method: 'POST',
    data
  })
}

// ====编辑地块
export function editmassif(data) {
  return request({
    url: '/api/massif/editmassif',
    method: 'POST',
    data
  })
}

// 编辑区域
export function editregion(data) {
  return request({
    url: '/api/massif/editregion',
    method: 'POST',
    data
  })
}

// 编辑农田
export function editfarmland(data) {
  return request({
    url: '/api/massif/editfarmland',
    method: 'POST',
    data
  })
}

// 编辑耕地
export function editcultiv(data) {
  return request({
    url: '/api/massif/editcultiv',
    method: 'POST',
    data
  })
}

// 编辑仓库
export function editwares(data) {
  return request({
    url: '/api/massif/editware',
    method: 'POST',
    data
  })
}

// 地块列表栏目接口
export function massiflist(data) {
  return request({
    url: '/api/massif/massiflist',
    method: 'POST',
    data
  })
}

// 获取区域+地区的耕地列表
export function cultivated(data) {
  return request({
    url: '/api/massif/cultivated',
    method: 'POST',
    data
  })
}

// 添加环境监控
export function addenviron(data) {
  return request({
    url: '/api/massif/addenviron',
    method: 'POST',
    data
  })
}

// 区域列表
export function regionlist(data) {
  return request({
    url: '/api/massif/regionlist',
    method: 'POST',
    data
  })
}

// 添加摄像头
export function addcamera(data) {
  return request({
    url: '/api/massif/addcamera',
    method: 'POST',
    data
  })
}

// 地块列表
export function massifdata(data) {
  return request({
    url: '/api/massif/massifdata',
    method: 'POST',
    data
  })
}

// 耕地列表
export function cultivalist(data) {
  return request({
    url: '/api/massif/cultivalist',
    method: 'POST',
    data
  })
}

// 删除环境
export function delenviron(data) {
  return request({
    url: '/api/massif/delenviron',
    method: 'POST',
    data
  })
}

// 删除摄像头
export function delcamera(data) {
  return request({
    url: '/api/massif/delcamera',
    method: 'POST',
    data
  })
}

// 编辑环境监控
export function editenviron(data) {
  return request({
    url: '/api/massif/editenviron',
    method: 'POST',
    data
  })
}

// 编辑摄像头

export function editcamera(data) {
  return request({
    url: '/api/massif/editcamera',
    method: 'POST',
    data
  })
}

// 地块列表删除

export function deltlandata(data) {
  return request({
    url: '/api/massif/deltlandata',
    method: 'POST',
    data
  })
}

// 编辑添加绑定环境列表

export function getregion(data) {
  return request({
    url: '/api/massif/getregion',
    method: 'POST',
    data
  })
}

// 编辑耕地的耕地情况
export function editcultails(data) {
  return request({
    url: '/api/massif/editcultails',
    method: 'POST',
    data
  })
}

//反馈建议--列表
export function feedbackList(data) {
  return request({
    url: '/Feedback/index',
    method: 'POST',
    data
  })
}
//反馈建议--列表
export function disposeRes(data) {
  return request({
    url: '/Feedback/dispose',
    method: 'POST',
    data
  })
}

//信息管理--列表
export function InfoManList(data) {
  return request({
    url: '/Information/index',
    method: 'POST',
    data
  })
}
//信息管理--添加
export function addThisInfo(data) {
  return request({
    url: '/Information/add',
    method: 'POST',
    data
  })
}
//信息管理--添加(编辑)图片上传
export function uploadImg(data) {
  return request({
    url: '/Goods/imageform',
    method: 'POST',
    data
  })
}
//信息管理--编辑
export function editThisInfo(data) {
  return request({
    url: '/Information/edit',
    method: 'POST',
    data
  })
}
//信息管理--发布
export function pubThisInfo(data) {
  return request({
    url: '/Information/issue',
    method: 'POST',
    data
  })
}
//信息管理--删除
export function delThisInfo(data) {
  return request({
    url: '/Information/delete',
    method: 'POST',
    data
  })
}
//信息管理--撤回
export function recallInfo(data) {
  return request({
    url: '/Information/recall',
    method: 'POST',
    data
  })
}

//报损记录--生产报损列表
export function lossList(data) {
  return request({
    url: '/Loss/index',
    method: 'POST',
    data
  })
}
//报损记录--生产报损详情
export function getlossDetail(data) {
  return request({
    url: '/Loss/details',
    method: 'POST',
    data
  })
}
//报损记录--生产报损--导出
export function lossExport(data) {
  return request({
    url: '/Loss/proDetExport',
    method: 'POST',
    data
  })
}
//报损记录--运输报损
export function transList(data) {
  return request({
    url: '/Loss/trans',
    method: 'POST',
    data
  })
}
//报损记录--运输报损
export function transExport(data) {
  return request({
    url: '/Loss/deriveExport',
    method: 'POST',
    data
  })
}
//报损记录--仓库报损列表
export function wareList(data) {
  return request({
    url: '/Loss/ware',
    method: 'POST',
    data
  })
}
//报损记录--仓库报损详情
export function wareDetail(data) {
  return request({
    url: '/Loss/wareDet',
    method: 'POST',
    data
  })
}
//报损记录--仓库报损导出
export function wareExport(data) {
  return request({
    url: '/Loss/wareDetExport',
    method: 'POST',
    data
  })
}