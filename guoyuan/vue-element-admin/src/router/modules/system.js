/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noredirect',
  name: 'system',
  alwaysShow: true,
  meta: {
    title: '系统管理',
    icon: 'activity'
  },
  children: [{
    path: 'person',
    component: () => import('@/views/system/person'),
    name: 'person',
    meta: {
      title: '个人中心',
      noCache: true
    }
  },
  {
    path: 'account',
    component: () => import('@/views/system/account'),
    name: 'account',
    meta: {
      title: '账号列表',
      noCache: true
    }
  },
  {
    path: 'roleList',
    component: () => import('@/views/system/roleList'),
    name: 'roleList',
    meta: {
      title: '角色列表',
      noCache: true
    }
  },
  {
    path: 'logList',
    component: () => import('@/views/system/logList'),
    name: 'logList',
    meta: {
      title: '系统日志',
      noCache: true
    }
  }
  ]
}

export default activeSysRouter
