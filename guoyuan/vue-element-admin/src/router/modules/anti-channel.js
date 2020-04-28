/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/anti_channel',
  component: Layout,
  redirect: 'noredirect',
  name: ' anti_channel',
  alwaysShow: true,
  meta: {
    title: '防窜管理',
    icon: 'activity'
  },
  children: [
    {
      path: 'area',
      component: () => import('@/views/anti_channel/area'),
      name: 'area',
      meta: { title: '防窜区域设置', noCache: true }
    },
    {
      path: 'record',
      component: () => import('@/views/anti_channel/record'),
      name: 'record',
      meta: { title: '记录表', noCache: true }
    },
    {
      path: 'earlyWarning',
      component: () => import('@/views/anti_channel/earlyWarning'),
      name: 'earlyWarning',
      meta: { title: '防窜预警', noCache: true }
    }
  ]
}

export default activeSysRouter
