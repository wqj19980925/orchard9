import request from '@/utils/request'
// 发码-列表
export function codelist(data) {
  return request({
    url: '/CodeManage/index',
    method: 'post',
    data
  })
}

// 发码-开启发布
export function startCode(data) {
  return request({
    url: '/CodeManage/publish',
    method: 'post',
    data
  })
}
// 发码-关闭发布
export function stopCode(data) {
  return request({
    url: '/CodeManage/padlock',
    method: 'post',
    data
  })
}

// 发码-申请下载接口
export function download(data) {
  return request({
    url: '/CodeManage/derivation',
    method: 'post',
    data
  })
}

// 发码填写-商品搜索
export function goodscode(data) {
  return request({
    url: '/CodeManage/goodscode',
    method: 'post',
    data
  })
}

// 发码填写-商品-获取5条数据
export function goodsdata(data) {
  return request({
    url: '/CodeManage/goodsdata',
    method: 'post',
    data
  })
}
// 发码填写-提交
export function addcm(data) {
  return request({
    url: '/CodeManage/addcm',
    method: 'post',
    data
  })
}
//
