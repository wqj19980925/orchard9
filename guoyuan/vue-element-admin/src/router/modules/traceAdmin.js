/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/traceAdmin',
  component: Layout,
  redirect: 'noredirect',
  name: ' traceAdmin',
  alwaysShow: true,
  meta: {
    title: '溯源管理',
    icon: 'suyuan'
  },
  children: [
    {
      path: 'template',
      component: () => import('@/views/traceAdmin/template'),
      name: 'template',
      meta: { title: '模板列表', noCache: true }
    },
    {
      path: 'information',
      component: () => import('@/views/traceAdmin/information'),
      name: 'information',
      meta: { title: '信息维护', noCache: true }
    },
    {
      path: 'codeRevise',
      component: () => import('@/views/traceAdmin/codeRevise'),
      name: 'codeRevise',
      meta: { title: '码上修改', noCache: true }
    }
  ]
}

export default activeSysRouter
