import request from '@/utils/request'
//生产列表--列表
export function produtList(data) {
  return request({
    url: '/Product/index',
    method: 'post',
    data
  })
}
// 生产列表--新增
export function addProdut(data) {
  return request({
    url: '/Product/add',
    method: 'post',
    data
  })
}

// 生产列表--编辑
export function editProdut(data) {
  return request({
    url: '/Product/edit',
    method: 'post',
    data
  })
}
// 生产列表--删除
export function delProdut(data) {
  return request({
    url: '/Product/del',
    method: 'post',
    data
  })
}
// 生产列表--导出
export function exprotProdut(data) {
  return request({
    url: '/Product/export',
    method: 'post',
    data
  })
}
// 生产列表--管理--获取页面上方信息
export function getProdutInfo(data) {
  return request({
    url: '/Product/getData',
    method: 'post',
    data
  })
}
// 生产列表--管理-苗木管理-新增
export function seedlManage(data) {
  return request({
    url: '/Product/addNursery',
    method: 'post',
    data
  })
}
// 生产列表--管理-苗木管理-编辑
export function editSeedlManage(data) {
  return request({
    url: '/Product/nurserySave',
    method: 'post',
    data
  })
}
// 生产列表--预估产量--搜索农资及库存
export function searchAgricul(data) {
  return request({
    url: '/Product/estimate',
    method: 'post',
    data
  })
}
// 生产列表--管理-预估产量-提交
export function addAgricul(data) {
  return request({
    url: '/Product/addEstimate',
    method: 'post',
    data
  })
}
// 生产列表--管理-编辑预估产量-提交
export function editAgricul(data) {
  return request({
    url: '/Product/estimateSave',
    method: 'post',
    data
  })
}
// 生产列表--管理--收获产物--获取信息
export function getOutInfo(data) {
  return request({
    url: '/Product/reap',
    method: 'post',
    data
  })
}
// 生产列表--管理--收获产物--提交
export function addOutInfo(data) {
  return request({
    url: '/Product/addReap',
    method: 'post',
    data
  })
}
// 生产列表--管理--编辑收获产物--提交
export function editOutInfo(data) {
  return request({
    url: '/Product/reapSave',
    method: 'post',
    data
  })
}
// 生产列表--管理--编辑收获产物--获取信息
export function getEditOutInfo(data) {
  return request({
    url: '/Product/reapGet',
    method: 'post',
    data
  })
}
// 生产列表--管理--操作列表
export function operList(data) {
  return request({
    url: '/Product/popIndex',
    method: 'post',
    data
  })
}
// 生产列表--管理--收获列表
export function harvestList(data) {
  return request({
    url: '/Product/porIndex',
    method: 'post',
    data
  })
}
// 生产列表--管理--导出
export function exprotPop(data) {
  return request({
    url: '/Product/pExport',
    method: 'post',
    data
  })
}
// 生产列表--管理—操作记录—删除
export function delOperecord(data) {
  return request({
    url: '/Product/popDel',
    method: 'post',
    data
  })
}
// 管理—开始生产接口
export function startPro(data) {
  return request({
    url: '/Product/startPro',
    method: 'post',
    data
  })
}
// 管理—恢复生产接口
export function recoverPro(data) {
  return request({
    url: '/Product/recoverPro',
    method: 'post',
    data
  })
}
// 生产列表--管理—暂停生产接口
export function suspendPro(data) {
  return request({
    url: '/Product/suspendPro',
    method: 'post',
    data
  })
}
// 生产列表--管理—结束生产接口
export function endPro(data) {
  return request({
    url: '/Product/endPro',
    method: 'post',
    data
  })
}

// 生产列表--管理—操作记录—编辑预估产量
export function editEstOutput(data) {
  return request({
    url: '/Product/estimateSave',
    method: 'post',
    data
  })
}
// 生产列表--管理--编辑收获产物
export function editReap(data) {
  return request({
    url: '/Product/reapSave',
    method: 'post',
    data
  })
}
// 生产列表--管理--编辑苗木管理
export function editSeeding(data) {
  return request({
    url: '/Product/nurserySave',
    method: 'post',
    data
  })
}
// 生产列表--管理--损耗报备
export function  reportLoss(data) {
  return request({
    url: '/Product/loss',
    method: 'post',
    data
  })
}
// 生产列表--管理--编辑损耗报备获取信息
export function getEditLoss(data) {
  return request({
    url: '/Product/lossGet',
    method: 'post',
    data
  })
}
// 生产列表--管理--编辑损耗报备
export function editLoss(data) {
  return request({
    url: '/Product/lossSave',
    method: 'post',
    data
  })
}
// 生产列表--管理--操作记录--隐藏
export function hideThisRec(data) {
  return request({
    url: '/Product/stop',
    method: 'post',
    data
  })
}
// 生产列表--操作记录--显示
export function showThisRec(data) {
  return request({
    url: '/Product/start',
    method: 'post',
    data
  })
}
// 生产列表--管理--收获记录--品级
export function getLevel(data) {
  return request({
    url: '/Product/level',
    method: 'post',
    data
  })
}
// 生产列表--管理--获取农事任务信息
export function getStack(data) {
  return request({
    url: '/Product/stack',
    method: 'post',
    data
  })
}
// 生产列表--管理--农事任务提交
export function addStack(data) {
  return request({
    url: '/Product/addStack',
    method: 'post',
    data
  })
}
// 生产列表--管理--农事任务编辑获取信息
export function addAgrtasks(data) {
  return request({
    url: '/Product/stackGet',
    method: 'post',
    data
  })
}

// 生产列表--管理--编辑农事任务/编辑新增信息
export function saveAgrtasks(data) {
  return request({
    url: '/Product/stackSave',
    method: 'post',
    data
  })
}
// 生产列表--管理--编辑农事任务初始获取信息
export function editAgrtasks(data) {
  return request({
    url: '/Product/stackSet',
    method: 'post',
    data
  })
}
// 生产列表--管理--新增信息搜索
export function searNewInfo(data) {
  return request({
    url: '/Product/search',
    method: 'post',
    data
  })
}
// 生产列表--管理--新增信息提交
export function addNewInfo(data) {
  return request({
    url: '/Product/info',
    method: 'post',
    data
  })
}
// 生产列表--管理--编辑新增信息提交
export function editNewInfo(data) {
  return request({
    url: '/Product/infoSave',
    method: 'post',
    data
  })
}
// 生产列表--新增--搜索上方
export function searchUp(data) {
  return request({
    url: '/Product/up',
    method: 'post',
    data
  })
}
// 生产列表--新增--搜索下方
export function searchDown(data) {
  return request({
    url: '/Product/down',
    method: 'post',
    data
  })
}
// 生产列表--管理-苗木管理-搜索
export function searNursery(data) {
  return request({
    url: '/Product/nursery',
    method: 'post',
    data
  })
}
// 生产列表--管理--获取品级信息
export function getLevelInfo(data) {
  return request({
    url: '/Product/getLevel',
    method: 'post',
    data
  })
}
// 生产列表--管理--搜索库存
export function searchKc(data) {
  return request({
    url: '/Product/searchKc',
    method: 'post',
    data
  })
}



//生产记录--记录列表
export function proRecordList(data) {
  return request({
    url: '/Record/index',
    method: 'post',
    data
  })
}
// 生产记录--隐藏
export function showProRec(data) {
  return request({
    url: '/Record/start',
    method: 'post',
    data
  })
}
// 生产记录--显示
export function hideProRec(data) {
  return request({
    url: '/Record/stop',
    method: 'post',
    data
  })
}
// 生产记录--导出
export function exprotProRec(data) {
  return request({
    url: '/Record/export',
    method: 'post',
    data
  })
}
// 生产记录--继续生产接口
export function continuePro(data) {
  return request({
    url: '/Record/continue',
    method: 'post',
    data
  })
}

//质检列表--列表
export function quailtyInspList(data) {
  return request({
    url: '/Control/index',
    method: 'post',
    data
  })
}
// 质检列表--添加
export function addQuality(data) {
  return request({
    url: '/Control/add',
    method: 'post',
    data
  })
}
// 质检列表--编辑
export function editQuality(data) {
  return request({
    url: '/Control/edit',
    method: 'post',
    data
  })
}
// 质检列表--隐藏
export function hideQuality(data) {
  return request({
    url: '/Control/hide',
    method: 'post',
    data
  })
}
// 质检列表--显示
export function showQuality(data) {
  return request({
    url: '/Control/show',
    method: 'post',
    data
  })
}
// 质检列表--删除
export function delQuality(data) {
  return request({
    url: '/Control/delete',
    method: 'post',
    data
  })
}
// 质检列表--查看
export function checkQuality(data) {
  return request({
    url: '/Control/check',
    method: 'post',
    data
  })
}

//异常处理--列表
export function handleList(data) {
  return request({
    url: '/Abnormal/index',
    method: 'post',
    data
  })
}
// 异常处理--隐藏
export function hideException(data) {
  return request({
    url: '/Abnormal/hide',
    method: 'post',
    data
  })
}
// 异常处理--显示
export function showException(data) {
  return request({
    url: '/Abnormal/show',
    method: 'post',
    data
  })
}
// 异常处理--删除
export function delException(data) {
  return request({
    url: '/Abnormal/delete',
    method: 'post',
    data
  })
}
// 异常处理--处理异常
export function handleQuality(data) {
  return request({
    url: '/Abnormal/dispose',
    method: 'post',
    data
  })
}


// 基地列表—管理--获取生产编号
export function getNumber(data) {
  return request({
    url: '/Product/getNumber',
    method: 'post',
    data
  })
}

// 搜索云仓-- 农资 --渠道 --员工 -- 商品
export function searchNqys(data) {
  return request({
    url: '/Template/search',
    method: 'post',
    data
  })
}