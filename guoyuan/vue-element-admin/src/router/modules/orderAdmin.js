/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/orderAdmin',
  component: Layout,
  redirect: 'noredirect',
  name: ' orderAdmin',
  alwaysShow: true,
  meta: {
    title: '订单管理',
    icon: 'user'
  },
  children: [
    {
      path: 'orderList',
      component: () => import('@/views/order/orderList'),
      name: 'orderList',
      meta: { title: '订单列表', noCache: true }
    },
    {
      path: 'salesList',
      component: () => import('@/views/order/salesList'),
      name: 'salesList',
      meta: { title: '销售平台', noCache: true }
    }
  ]
}

export default activeSysRouter
