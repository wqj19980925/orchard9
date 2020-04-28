/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/codeAdmin',
  component: Layout,
  redirect: 'noredirect',
  name: 'codeAdmin',
  alwaysShow: true,
  meta: {
    title: '发码管理',
    icon: 'code'
  },
  children: [
    // {
    //   path: 'creatCode',
    //   component: () => import('@/views/codeAdmin/creatCode'),
    //   name: 'creatCode',
    //   meta: { title: '创建溯源码', noCache: true }
    // },
    {
      path: 'codeList',
      component: () => import('@/views/codeAdmin/codeList'),
      name: 'codeList',
      meta: { title: '发码列表', noCache: true }
    }
    // {
    //   path: 'exportList',
    //   component: () => import('@/views/codeAdmin/exportList'),
    //   name: 'exportList',
    //   meta: { title: '导出列表', noCache: true }
    // }
  ]
}

export default activeSysRouter
