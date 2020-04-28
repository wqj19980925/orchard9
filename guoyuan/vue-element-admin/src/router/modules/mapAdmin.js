/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/mapAdmin',
  component: Layout,
  redirect: 'noredirect',
  name: ' mapAdmin',
  alwaysShow: true,
  meta: {
    title: '地块管理',
    icon: 'user'
  },
  children: [
    {
      path: 'digtalMap',
      component: () => import('@/views/massif/digtalMap'),
      name: 'digtalMap',
      meta: { title: '数字地图', noCache: true }
    }
  ]
}

export default activeSysRouter
