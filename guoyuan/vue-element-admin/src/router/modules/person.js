/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/person',
  component: Layout,
  redirect: 'noredirect',
  name: 'person',
  alwaysShow: true,
  meta: {
    title: '个人中心',
    icon: 'user'
  },
  children: [
    {
      path: 'account',
      component: () => import('@/views/person/account'),
      name: 'account',
      meta: { title: '账户中心', noCache: true }
    },
    {
      path: 'dealing',
      component: () => import('@/views/person/dealing'),
      name: 'dealing',
      meta: { title: '交易记录', noCache: true }
    }
  ]
}

export default activeSysRouter
