import request from '@/utils/request'

// 概况页面--获取数据
export function Survey(data) {
  return request({
    url: 'pc/index/home',
    method: 'post',
    data
  })
}
