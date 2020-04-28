/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/environment',
  component: Layout,
  redirect: 'noredirect',
  name: ' environment',
  alwaysShow: true,
  meta: {
    title: '环境管理',
    icon: 'enviro'
  },
  children: [
    {
      path: 'dataAdmin',
      component: () => import('@/views/environment/dataAdmin'),
      name: 'dataAdmin',
      meta: { title: '数据管理', noCache: true }
    }
  ]
}

export default activeSysRouter
