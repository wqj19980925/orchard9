/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/security',
  component: Layout,
  redirect: 'noredirect',
  name: 'security',
  alwaysShow: true,
  meta: {
    title: '防伪管理',
    icon: 'wei'
  },
  children: [
    {
      path: 'earlyWarning',
      component: () => import('@/views/security/earlyWarning'),
      name: 'earlyWarning',
      meta: {
        title: '真伪预警',
        noCache: true
      }
    },
    {
      path: 'setting',
      component: () => import('@/views/security/setting'),
      name: 'setting',
      meta: {
        title: '真伪设置',
        noCache: true
      }
    }
  ]
}

export default activeSysRouter
