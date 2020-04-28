import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

export const routerMap = {
  Layout: () => import('@/views/layout/Layout'),
  Akeysendsend: ()=>import('@/views/akeySend/akeyCreatCode'),
  Piecemealhomestatis: () => import('@/views/dashboard/index'),
  Goodsindex: () => import('@/views/goodsAdmin/goodsList'),
  GooClassifiindex: () => import('@/views/goodsAdmin/classList'),
  Navigationindex: () => import('@/views/goodsAdmin/navList'),
  Orderorderlist: () => import('@/views/order/orderList'),
  Platformplatindex: () => import('@/views/order/salesList'),
  Trafficindex: () => import('@/views/order/transportList'),
  CodeManageindex: () => import('@/views/traceAdmin/codeList'),
  FormLabelindex: () => import('@/views/traceAdmin/tagList'),
  Formworkindex: () => import('@/views/traceAdmin/template'),
  Templateindex: () => import('@/views/traceAdmin/infoList'),

  Salesindex: () => import('@/views/datainfo/dataPage'),//数据统计
  Informationindex: () => import('@/views/datainfo/infoManage'),
  Feedbackindex: () => import('@/views/datainfo/feedback'),
  Lossindex: () => import('@/views/datainfo/lossRepList'),
  Digitalmapindex: () => import('@/views/productAreaMan/baseList'),
  Producingindex: () => import('@/views/productAreaMan/proAreaList'),
  Districtindex: () => import('@/views/productAreaMan/areaList'),
  Equipmentindex: () => import('@/views/productAreaMan/deviceList'),
  FarmingTaskindex: () => import('@/views/productAreaMan/Agricultasks'),
  FarmingTaskRecordindex: () => import('@/views/productAreaMan/taskRecord'),
  Productindex: () => import('@/views/ProductManage/proList'),
  Recordindex: () => import('@/views/ProductManage/proRecord'),
  Controlindex: () => import('@/views/ProductManage/qualityList'),
  Abnormalindex: () => import('@/views/ProductManage/exceptHandle'),
  Wareyunlist: () => import('@/views/wareHouse/wareHouseList'),//我的仓库
  OrdermanagedeliverList: () => import('@/views/wareHouse/outOfStock'),//出库
  OrdermanagewriteList: () => import('@/views/wareHouse/wareHousing'),//入库
  DocumentingoutLog: () => import('@/views/wareHouse/accessRecords'),//出入库记录
  Ditchindex: () => import('@/views/channelManage/channelList'),
  Lableindex: () => import('@/views/channelManage/channelTag'),
  MyAgricindex: () => import('@/views/agriculManage/myMaterial'),
  AgrClassindex: () => import('@/views/agriculManage/materCategory'),
  Agricindex: () => import('@/views/agriculManage/materialList'),
  Nurseryindex: () => import('@/views/agriculManage/seedlingList'),
  Farmerindex: () => import('@/views/persManage/farmerList'),
  Officialindex: () => import('@/views/persManage/staffList'),
  Temporaryindex: () => import('@/views/persManage/tempList'),
  Manageindex: () => import('@/views/persManage/adminList'),
  Sectionindex: () => import('@/views/persManage/departTeam'),
  Roleroleindex:()=>import('@/views/system/roleList'),
  Coperationaindex:()=>import('@/views/system/logList'),
  Mypersonal:()=>import('@/views/system/person'),
  Monitoringindex: ()=>import('@/views/Monitoring/Monitoringindex'),
}
export const constantRouterMap = [


 { path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/codeQuality',
  component: () => import('@/views/traceAdmin/qualReport'),
  hidden: true
},

//   {
//     path: '/',
//     component: Layout,
//     redirect: 'dashboard',
//     children: [{
//       path: 'dashboard',
//       component: () => import('@/views/dashboard/index'),
//       name: 'dashboard',
//       meta: {
//         title: '概况',
//         icon: 'dashboard',
//         noCache: true
//       }
//     }]
//   },
//   {
//     path: '/goodsAdmin',
//     component: Layout,
//     redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
//     name: 'goodsAdmin', // 该路由的名称
//     alwaysShow: true, // 如果children的长度为 1, false时child显示主栏上 没有下拉
//     meta: {
//       title: '商品管理',
//       icon: 'component'
//     },
//     children: [
//       // /  {
//       //     path: 'navList',
//       //     component: () => import('@/views/goodsAdmin/navList'),
//       //     name: 'navList',
//       //     meta: { title: '导航列表', noCache: true }
//       //   },
//     {
//       path: 'goodsList',
//       component: () => import('@/views/goodsAdmin/goodsList'),
//       name: 'goodsList',
//       meta: {
//         title: '商品列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'classList',
//       component: () => import('@/views/goodsAdmin/classList'),
//       name: 'classList',
//       meta: {
//         title: '品类列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'navList',
//       component: () => import('@/views/goodsAdmin/navList'),
//       name: 'navList',
//       meta: {
//         title: '导航列表',
//         noCache: true
//       }
//     }
//       // {
//       //   path: 'addGoods',
//       //   component: () => import('@/views/goodsAdmin/addGoods'),
//       //   name: 'addGoods',
//       //   meta: { title: '添加商品', noCache: true }
//       // }
//     ]
//   },
//   {
//     path: '/orderAdmin',
//     component: Layout,
//     redirect: 'noredirect',
//     name: ' orderAdmin',
//     alwaysShow: true,
//     meta: {
//       title: '订单管理',
//       icon: 'user'
//     },
//     children: [
//       {
//         path: 'orderList',
//         component: () => import('@/views/order/orderList'),
//         name: 'orderList',
//         meta: { title: '订单列表', noCache: true }
//       },
//       {
//         path: 'salesList',
//         component: () => import('@/views/order/salesList'),
//         name: 'salesList',
//         meta: { title: '销售平台', noCache: true }
//       },
//       {
//         path: 'transportList',
//         component: () => import('@/views/order/transportList'),
//         name: 'transportList',
//         meta: { title: '运输单位', noCache: true }
//       }
//     ]
//   },
//   {
//     path: '/qualReport',
//     component: () => import('@/views/traceAdmin/qualReport'),
//     hidden: true
//   },
//   {
//     path: '/traceAdmin',
//     component: Layout,
//     redirect: 'noredirect',
//     name: ' traceAdmin',
//     alwaysShow: true,
//     meta: {
//       title: '溯源管理',
//       icon: 'suyuan'
//     },
//     children: [
//       {
//         path: 'codeList',
//         component: () => import('@/views/traceAdmin/codeList'),
//         name: 'codeList',
//         meta: { title: '发码列表', noCache: true }
//       },
//       {
//         path: 'tagList',
//         component: () => import('@/views/traceAdmin/tagList'),
//         name: 'tagList',
//         meta: { title: '标签列表', noCache: true }
//       },
//       {
//         path: 'template',
//         component: () => import('@/views/traceAdmin/template'),
//         name: 'template',
//         meta: { title: '模板列表', noCache: true }
//       },
//       {
//         path: 'infoList',
//         component: () => import('@/views/traceAdmin/infoList'),
//         name: 'infoList',
//         meta: { title: '信息列表', noCache: true }
//       }
//     ]
//   },
//   {
//     path: '/datainfo',
//     component: Layout,
//     redirect: 'noredirect',
//     name: ' datainfo',
//     alwaysShow: true,
//     meta: {
//       title: '数据信息',
//       icon: 'user'
//     },
//     children: [
//       {
//         path: 'nationBase',
//         component: () => import('@/views/datainfo/nationBase'),
//         name: 'nationBase',
//         meta: { title: '全国基地', noCache: true }
//       },
//       {
//         path: 'infoManage',
//         component: () => import('@/views/datainfo/infoManage'),
//         name: 'infoManage',
//         meta: { title: '信息管理', noCache: true }
//       },
//       {
//         path: 'feedback',
//         component: () => import('@/views/datainfo/feedback'),
//         name: 'feedback',
//         meta: { title: '反馈建议', noCache: true }
//       },
//       {
//         path: 'lossRepList',
//         component: () => import('@/views/datainfo/lossRepList'),
//         name: 'lossRepList',
//         meta: { title: '报损记录', noCache: true }
//       },
//     ]
// },
// {
//   path: '/productAreaMan',
//   component: Layout,
//   redirect: 'noredirect',
//   name: 'productAreaMan',
//   alwaysShow: true,
//   meta: {
//     title: '产区管理',
//     icon: 'activity'
//   },
//   children: [
//     {
//       path: 'baseList',
//       component: () => import('@/views/productAreaMan/baseList'),
//       name: 'baseList',
//       meta: {
//         title: '基地列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'proAreaList',
//       component: () => import('@/views/productAreaMan/proAreaList'),
//       name: 'proAreaList',
//       meta: {
//         title: '产区列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'areaList',
//       component: () => import('@/views/productAreaMan/areaList'),
//       name: 'areaList',
//       meta: {
//         title: '区域列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'deviceList',
//       component: () => import('@/views/productAreaMan/deviceList'),
//       name: 'deviceList',
//       meta: {
//         title: '设备列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'Agricultasks',
//       component: () => import('@/views/productAreaMan/Agricultasks'),
//       name: 'Agricultasks',
//       meta: {
//         title: '农事任务',
//         noCache: true
//       }
//     },
//     {
//       path: 'taskRecord',
//       component: () => import('@/views/productAreaMan/taskRecord'),
//       name: 'taskRecord',
//       meta: {
//         title: '任务记录',
//         noCache: true
//       }
//     }
//   ]
// },
// {
//   path: '/ProductManage',
//   component: Layout,
//   redirect: 'noredirect',
//   name: 'ProductManage',
//   alwaysShow: true,
//   meta: {
//     title: '生产管理',
//     icon: 'activity'
//   },
//   children: [
//     {
//       path: 'proList',
//       component: () => import('@/views/ProductManage/proList'),
//       name: 'proList',
//       meta: {
//         title: '生产列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'proRecord',
//       component: () => import('@/views/ProductManage/proRecord'),
//       name: 'proRecord',
//       meta: {
//         title: '生产记录',
//         noCache: true
//       }
//     },
//     {
//       path: 'qualityList',
//       component: () => import('@/views/ProductManage/qualityList'),
//       name: 'qualityList',
//       meta: {
//         title: '质检列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'exceptHandle',
//       component: () => import('@/views/ProductManage/exceptHandle'),
//       name: 'exceptHandle',
//       meta: {
//         title: '异常处理',
//         noCache: true
//       }
//     }

//   ]
// },
// {
//     path: '/channelManage',
//     component: Layout,
//     redirect: 'channelManage',
//     name: ' channelManage',
//     alwaysShow: true,
//     meta: {
//       title: '渠道管理',
//       icon: 'user'
//     },
//     children: [
//       {
//         path: 'channelList',
//         component: () => import('@/views/channelManage/channelList'),
//         name: 'channelList',
//         meta: { title: '渠道列表', noCache: true }
//       },
//       {
//         path: 'channelTag',
//         component: () => import('@/views/channelManage/channelTag'),
//         name: 'channelTag',
//         meta: { title: '渠道标签', noCache: true }
//       }
//     ]
//   },
// {
//     path: '/agriculManage',
//     component: Layout,
//     redirect: 'agriculManage',
//     name: ' agriculManage',
//     alwaysShow: true,
//     meta: {
//       title: '农资管理',
//       icon: 'user'
//     },
//     children: [
//       {
//         path: 'myMaterial',
//         component: () => import('@/views/agriculManage/myMaterial'),
//         name: 'myMaterial',
//         meta: { title: '我的农资', noCache: true }
//       },
//       {
//         path: 'materCategory',
//         component: () => import('@/views/agriculManage/materCategory'),
//         name: 'materCategory',
//         meta: { title: '农资品类', noCache: true }
//       },
//       {
//         path: 'materialList',
//         component: () => import('@/views/agriculManage/materialList'),
//         name: 'materialList',
//         meta: { title: '农资列表', noCache: true }
//       },
//       {
//         path: 'seedlingList',
//         component: () => import('@/views/agriculManage/seedlingList'),
//         name: 'seedlingList',
//         meta: { title: '苗木列表', noCache: true }
//       }
//     ]
// },
// {
//   path: '/persManage',
//   component: Layout,
//   redirect: 'noredirect',
//   name: 'persManage',
//   alwaysShow: true,
//   meta: {
//     title: '人员管理',
//     icon: 'activity'
//   },
//   children: [
//     {
//       path: 'farmerList',
//       component: () => import('@/views/persManage/farmerList'),
//       name: 'farmerList',
//       meta: {
//         title: '农户列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'staffList',
//       component: () => import('@/views/persManage/staffList'),
//       name: 'staffList',
//       meta: {
//         title: '员工列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'tempList',
//       component: () => import('@/views/persManage/tempList'),
//       name: 'tempList',
//       meta: {
//         title: '临时工列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'adminList',
//       component: () => import('@/views/persManage/adminList'),
//       name: 'adminList',
//       meta: {
//         title: '管理员列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'departTeam',
//       component: () => import('@/views/persManage/departTeam'),
//       name: 'departTeam',
//       meta: {
//         title: '部门班组',
//         noCache: true
//       }
//     },
//   ]
// },

// {
//   path: '/system',
//   component: Layout,
//   redirect: 'noredirect',
//   name: 'system',
//   alwaysShow: true,
//   meta: {
//     title: '系统管理',
//     icon: 'activity'
//   },
//   children: [
//     {
//       path: 'roleList',
//       component: () => import('@/views/system/roleList'),
//       name: 'roleList',
//       meta: {
//         title: '角色列表',
//         noCache: true
//       }
//     },
//     {
//       path: 'logList',
//       component: () => import('@/views/system/logList'),
//       name: 'logList',
//       meta: {
//         title: '系统日志',
//         noCache: true
//       }
//     },
//     {
//       path: 'person',
//       component: () => import('@/views/system/person'),
//       name: 'person',
//       meta: {
//         title: '个人中心',
//         noCache: true
//       }
//     },
//   ]
// },


// {
//   path: '/404',
//   component: () => import('@/views/errorPage/404'),
//   hidden: true
// },
// {
//   path: '/401',
//   component: () => import('@/views/errorPage/401'),
//   hidden: true
// }vue-element-admin/src/views/datainfo/nationBase.vue
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
/*  anti_channel,*/
  // codeAdmin, 
  // envrnAdmin,
  // goodsAdmin,
/*  Security,*/
  // system,
  // traceAdmin,
  // orderAdmin,
  // wareHouseAdmin,
  // mapAdmin
  /** When your routing table is too long, you can split it into small modules**/
]
