import request from '@/utils/request'

// 环境列表--添加
export function listData(data) {
  return request({
    url: '/Environment/index',
    method: 'post',
    data
  })
}
// 环境列表--添加
export function AddInfor(data) {
  return request({
    url: '/Environment/adden',
    method: 'post',
    data
  })
}
// 环境列表--编辑
export function editInfor(data) {
  return request({
    url: '/Environment/editen',
    method: 'post',
    data
  })
}
// 环境列表--启用
export function openState(data) {
  return request({
    url: 'Environment/open_state',
    method: 'post',
    data
  })
}
// 环境列表--停用
export function stopsta(data) {
  return request({
    url: '/Environment/stop_state',
    method: 'post',
    data
  })
}
// 环境列表--删除
export function delChose(data) {
  return request({
    url: '/Environment/delen',
    method: 'post',
    data
  })
}
// 环境列表--配置
export function Configen(data) {
  return request({
    url: '/Environment/configen',
    method: 'post',
    data
  })
}
// 环境列表--设备数据
export function devList(data) {
  return request({
    url: 'Environment/device_data',
    method: 'post',
    data
  })
}
// 环境列表--光照
export function sunList(data) {
  return request({
    url: 'Environment/illumination_detection',
    method: 'post',
    data
  })
}
// 环境列表--co2
export function coList(data) {
  return request({
    url: 'Environment/co2_detection',
    method: 'post',
    data
  })
}
// 环境列表--土壤湿度
export function soilMo(data) {
  return request({
    url: 'Environment/soil_moisture_detection',
    method: 'post',
    data
  })
}
// 环境列表--土壤温度
export function soilTem(data) {
  return request({
    url: 'Environment/soil_temperature_detection',
    method: 'post',
    data
  })
}
// 环境列表--降雨量
export function rainFall(data) {
  return request({
    url: 'Environment/rainfall_detection',
    method: 'post',
    data
  })
}
// 环境列表--空气湿度
export function airHum(data) {
  return request({
    url: 'Environment/air_humidity',
    method: 'post',
    data
  })
}
// 环境列表--空气温度
export function airTem(data) {
  return request({
    url: 'Environment/air_temperature',
    method: 'post',
    data
  })
}
// 环境列表--风速接口
export function windSped(data) {
  return request({
    url: 'Environment/wind_speed_detection',
    method: 'post',
    data
  })
}
// 环境列表--风向接口
export function windDir(data) {
  return request({
    url: 'Environment/wind_direction_detection',
    method: 'post',
    data
  })
}
// 设备列表--列表
export function listEquipm(data) {
  return request({
    url: 'Equipment/index',
    method: 'post',
    data
  })
}
// 设备列表--添加摄像头
export function addEq(data) {
  return request({
    url: 'Equipment/addeq',
    method: 'post',
    data
  })
}
// 设备列表--编辑
export function editEq(data) {
  return request({
    url: 'Equipment/editeq',
    method: 'post',
    data
  })
}
// 设备列表--启用
export function openSta(data) {
  return request({
    url: 'Equipment/open_state',
    method: 'post',
    data
  })
}
// 设备列表--停用
export function stopSta(data) {
  return request({
    url: 'Equipment/stop_state',
    method: 'post',
    data
  })
}
// 设备列表--删除
export function delList(data) {
  return request({
    url: 'Equipment/deleq',
    method: 'post',
    data
  })
}
// 设备列表--查看
export function lookDet(data) {
  return request({
    url: 'Equipment/look',
    method: 'post',
    data
  })
}
