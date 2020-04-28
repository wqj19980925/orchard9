import Mock from 'mockjs'
import {
  param2Obj
} from '@/utils'

const List = []
const count = 100

const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    creatTime: '@datetime',
    serveId: 'L20180815022751868',
    serveType: ' 安装后售后',
    sysId: 'L20180815022751868',
    platsId: ' L2018081502275186811',
    platsName: '京东POP 瓦尔塔旗舰店',
    image_uri,
    goods: '风帆-6-QW-60',
    brand: '风帆',
    goodsCord: '',
    unitPri: '400.00',
    num: '1',
    orderName: '@first',
    infor_tel: '/^1[3456789]\d{9}$/',
    infor_addre: '@county(true)',
    'getComp|1': ['北京第一服务商', '四川省-肖科-麦尔机电设备有限公司', '无需服务商处理'],
    'servInfor|1': ['未处理', '处理中', '审核中', '已完成', '已撤销'],
    'remarks|1-5': [{
      'sta|+1': ['订单管理', '售后订单'],
      'infor|+1': ['【售后】测试未在当日5点之前反馈', '【售后】申请完成，测试(P20160818123557798)', '【售后】测试未在当日5点之前反馈']
    }]
  }))
}
