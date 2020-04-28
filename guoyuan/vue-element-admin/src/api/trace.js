import request from '@/utils/request'

// 商品管理--列表 --添加
export function addfw(data) {
  return request({
    url: '/Goods/addformwork',
    method: 'post',
    data
  })
}
// 商品管理--列表 --添加--上传图片
export function imgUp(data) {
  return request({
    url: '/Goods/imageform',
    method: 'post',
    data
  })
}
// 商品管理--列表 --添加--上传视频
export function videoUp(data) {
  return request({
    http: {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    },
    url: '/Goods/videoform',
    method: 'post',
    data
  })
}
// 商品管理--列表 --添加--未提交--删除视频
export function delVideo(data) {
  return request({
    url: '/Goods/delvideoform',
    method: 'post',
    data
  })
}
// 商品管理--列表 --添加--未提交--删除图片
export function delImg(data) {
  return request({
    url: '/Goods/delimageform',
    method: 'post',
    data
  })
}
// 商品管理--列表-编辑
export function editfw(data) {
  return request({
    url: '/Goods/editformwork',
    method: 'post',
    data
  })
}
// 商品管理--列表-编辑-提交
export function subEditfw(data) {
  return request({
    url: '/Goods/editgo',
    method: 'post',
    data
  })
}


// 标签列表--列表
export function formLabelList(data) {
  return request({
    url: '/FormLabel/index',
    method: 'post',
    data
  })
}
// 标签列表--启用
export function formLabelStart(data) {
  return request({
    url: '/FormLabel/start',
    method: 'post',
    data
  })
}
// 标签列表--停用
export function formLabelStop(data) {
  return request({
    url: '/FormLabel/stop',
    method: 'post',
    data
  })
}
// 标签列表--添加-
export function AddFormLabel(data) {
  return request({
    url: '/FormLabel/add',
    method: 'post',
    data
  })
}
// 标签列表--编辑--请求
export function editFormLabel(data) {
  return request({
    url: '/FormLabel/edit',
    method: 'post',
    data
  })
}
// 标签列表--删除
export function delFormLabel(data) {
  return request({
    url: '/FormLabel/del',
    method: 'post',
    data
  })
}


// 模板列表--列表
export function TempList(data) {
  return request({
    url: '/Formwork/index',
    method: 'post',
    data
  })
}
// 模板列表--启用
export function tempStart(data) {
  return request({
    url: '/Formwork/start',
    method: 'post',
    data
  })
}
// 模板列表--停用
export function tempStop(data) {
  return request({
    url: '/Formwork/stop',
    method: 'post',
    data
  })
}
// 模板列表--添加-
export function AddTemp(data) {
  return request({
    url: '/Formwork/add',
    method: 'post',
    data
  })
}
// 模板列表--编辑--请求
export function editTemp(data) {
  return request({
    url: '/Formwork/edit',
    method: 'post',
    data
  })
}

// 模板列表--删除
export function delTemp(data) {
  return request({
    url: '/Formwork/del',
    method: 'post',
    data
  })
}
// 模板列表--复制
export function copyTemp(data) {
  return request({
    url: '/Formwork/copy',
    method: 'post',
    data
  })
}
// 模板列表--搜索
export function searTemp(data) {
  return request({
    url: 'Formwork/search',
    method: 'post',
    data
  })
}

// 信息列表--列表
export function InfoList(data) {
  return request({
    url: '/Template/index',
    method: 'post',
    data
  })
}
// 信息列表--启用
export function InfoStart(data) {
  return request({
    url: '/Template/start',
    method: 'post',
    data
  })
}
// 信息列表--停用
export function InfoStop(data) {
  return request({
    url: '/Template/stop',
    method: 'post',
    data
  })
}
// 信息列表--添加--请求
export function AddInfo(data) {
  return request({
    url: '/Template/add',
    method: 'post',
    data
  })
}
// 信息列表--编辑--请求
export function editInfo(data) {
  return request({
    url: '/Template/edit',
    method: 'post',
    data
  })
}

// 信息列表--删除
export function delInfo(data) {
  return request({
    url: '/Template/del',
    method: 'post',
    data
  })
}
// 信息列表--复制
export function copyInfo(data) {
  return request({
    url: '/Template/copy',
    method: 'post',
    data
  })
}

// 信息列表--搜索列表
export function searInfo(data) {
  return request({
    url: '/Template/search',
    method: 'post',
    data
  })
}



// 发码列表--列表
export function CodeList(data) {
  return request({
    url: '/Code/index',
    method: 'post',
    data
  })
}
// 发码列表--申请发码--搜索
export function searchSendCode(data) {
  return request({
    url: '/Code/number',
    method: 'post',
    data
  })
}
// 发码列表--申请发码--提交
export function applyCode(data) {
  return request({
    url: '/Code/apply',
    method: 'post',
    data
  })
}
// 发码列表--收获编号—查看接口
export function showNumber(data) {
  return request({
    url: '/Code/look',
    method: 'post',
    data
  })
}
// 发码列表--导出
export function exportCode(data) {
  return request({
    url: '/Code/export',
    method: 'post',
    data
  })
}

// 发码列表--删除
export function delCode(data) {
  return request({
    url: '/Code/del',
    method: 'post',
    data
  })
}
// 发码列表--下载
export function downloadCode(data) {
  return request({
    url: '/Code/derivation',
    method: 'post',
    data
  })
}

// 发码列表--管理报告
export function manageReport(data) {
  return request({
    url: '/Code/quaGet',
    method: 'post',
    data
  })
}
// 发码列表--编辑
export function editCode(data) {
  return request({
    url: '/Code/edit',
    method: 'post',
    data
  })
}
// // 溯源管理--信息维护-页面信息
// export function infoMod(data) {
//   return request({
//     url: '/InfoModify/index',
//     method: 'post',
//     data
//   })
// }
// // 溯源管理--信息维护-提交
// export function modify(data) {
//   return request({
//     url: '/InfoModify/modify',
//     method: 'post',
//     data
//   })
// }
// 溯源管理--列表
// export function fetchList(data) {
//   return request({
//     url: '/Goods/indexformwork',
//     method: 'post',
//     data
//   })
// }
// // 溯源管理--列表-启用
// export function openSta(data) {
//   return request({
//     url: '/Goods/startstase',
//     method: 'post',
//     data
//   })
// }
// // 溯源管理--列表-停用
// export function stopSta(data) {
//   return request({
//     url: '/Goods/shopstase',
//     method: 'post',
//     data
//   })
// }
// // 溯源管理--列表-复制
// export function copyform(data) {
//   return request({
//     url: '/Goods/copyform',
//     method: 'post',
//     data
//   })
// }

// 一键发码 --- 添加农户
export function akeyCodeing(data) {
  return request({
    url: '/akey/codesending',
    method: 'post',
    data
  })
}

