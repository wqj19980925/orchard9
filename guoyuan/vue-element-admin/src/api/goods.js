import request from '@/utils/request'
// 分类--列表
export function ClasList(data) {
  return request({
    url: '/GooClassifi/index',
    method: 'post',
    data
  })
}

// 首页--置顶
export function topTipList(data) {
  return request({
    url: '/Piecemeal/top',
    method: 'post',
    data
  })
}
// 首页--置顶详情
export function topDetail(data) {
  return request({
    url: '/Piecemeal/news',
    method: 'post',
    data
  })
}
// 首页--页面
export function homeList(data) {
  return request({
    url: '/Piecemeal/homestatis',
    method: 'post',
    data
  })
}
// 添加--分类
export function addClass(data) {
  // console.log('--', data)
  return request({
    url: '/GooClassifi/addgc',
    method: 'post',
    data
  })
}
// 编辑--分类
export function editClass(data) {
  return request({
    url: '/GooClassifi/editgc',
    method: 'post',
    data
  })
}
// 删除--分类
export function delClas(data) {
  return request({
    url: '/GooClassifi/delgc',
    method: 'post',
    data
  })
}
// 启用--分类
export function openClas(data) {
  return request({
    url: '/GooClassifi/open_state',
    method: 'post',
    data
  })
}
// 停用--分类
export function stopeClas(data) {
  return request({
    url: '/GooClassifi/stop_state',
    method: 'post',
    data
  })
}
// 商品--列表
export function goodsList(data) {
  return request({
    url: '/Goods/index',
    method: 'post',
    data
  })
}
// 商品--导出
export function exports(data) {
  return request({
    url: '/Goods/exports',
    method: 'post',
    data
  })
}
// 商品--启用
export function openGoods(data) {
  return request({
    url: '/Goods/open_state',
    method: 'post',
    data
  })
}
// 商品--复制
export function duplication(data) {
  return request({
    url: '/Goods/duplications',
    method: 'post',
    data
  })
}

// 商品--停用
export function stopGoods(data) {
  return request({
    url: '/Goods/stop_state',
    method: 'post',
    data
  })
}
// 商品--新增
export function addGoods(data) {
  return request({
    url: '/Goods/addgo',
    method: 'post',
    data
  })
}
// 商品--编辑
export function editgo(data) {
  return request({
    url: '/Goods/editgo',
    method: 'post',
    data
  })
}
// 商品--删除
export function delgo(data) {
  return request({
    url: '/Goods/delgo',
    method: 'post',
    data
  })
}
// 模板--导出
export function downExcel(data) {
  return request({
    url: '/Goods/export',
    method: 'post',
    data
  })
}
// 模板--导入
export function impExcel(data) {
  return request({
    url: '/Goods/income',
    method: 'post',
    data
  })
}
// 模板--列表
export function getList(data) {
  return request({
    url: '/GooFormwork/index',
    method: 'post',
    data
  })
}
// 模板--获取单个商品模板信息
export function getForInfo(data) {
  return request({
    url: '/GooFormwork/getFormworkInfo',
    method: 'post',
    data
  })
}
// 模板--启用
export function openState(data) {
  return request({
    url: '/GooFormwork/open_state',
    method: 'post',
    data
  })
}
// 模板--停用
export function stopState(data) {
  return request({
    url: '/GooFormwork/stop_state',
    method: 'post',
    data
  })
}
// 模板--添加
export function addgf(data) {
  return request({
    url: '/GooFormwork/addgf',
    method: 'post',
    data
  })
}
// 模板--添加
export function editgf(data) {
  return request({
    url: '/GooFormwork/editgf',
    method: 'post',
    data
  })
}

// 模板--删除
export function delgf(data) {
  return request({
    url: '/GooFormwork/delgf',
    method: 'post',
    data
  })
}
// 导航--列表
export function navList(data) {
  return request({
    url: '/navigation/index',
    method: 'post',
    data
  })
}
// 导航--启用
export function startNav(data) {
  return request({
    url: '/navigation/startnav',
    method: 'post',
    data
  })
}
// 导航--停用
export function stopNav(data) {
  return request({
    url: '/navigation/stopnav',
    method: 'post',
    data
  })
}
// 导航--删除
export function delNav(data) {
  return request({
    url: '/navigation/delnav',
    method: 'post',
    data
  })
}
// 导航--编辑
export function editNav(data) {
  return request({
    url: '/navigation/editnav',
    method: 'post',
    data
  })
}
// 导航--添加
export function addNav(data) {
  return request({
    url: '/navigation/addnav',
    method: 'post',
    data
  })
}
// 导航--添加--上传图片
export function imageforms1(data) {
  return request({
    url: '/navigation/imageform',
    method: 'post',
    data
  })
}
// 导航--添加--删除图片
export function imageforms(data) {
  return request({
    url: '/navigation/delimageform',
    method: 'post',
    data
  })
}