/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/wareHouseAdmin',
  component: Layout,
  redirect: 'noredirect',
  name: ' wareHouseAdmin',
  alwaysShow: true,
  meta: {
    title: '云仓管理',
    icon: 'user'
  },
  children: [
    {
      path: 'wareHouseAdmin',
      component: () => import('@/views/wareHouse/wareHouseList'),
      name: 'wareHouseList',
      meta: { title: '我的云仓', noCache: true }
    }
    // {
    //   path: 'salesPlatform',
    //   component: () => import('@/views/order/salesPlatform'),
    //   name: 'salesPlatform',
    //   meta: { title: '渠道云仓', noCache: true }
    // }
  ]
}

export default activeSysRouter
