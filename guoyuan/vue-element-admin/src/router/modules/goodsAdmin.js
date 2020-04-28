/** 活动系统**/

import Layout from '@/views/layout/Layout'

const activeSysRouter = {
  path: '/goodsAdmin',
  component: Layout,
  redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
  name: 'goodsAdmin', // 该路由的名称
  alwaysShow: true, // 如果children的长度为 1, false时child显示主栏上 没有下拉
  meta: {
    title: '商品管理',
    icon: 'component'
  },
  children: [{
    path: 'classList',
    component: () => import('@/views/goodsAdmin/classList'),
    name: 'classList',
    meta: {
      title: '品类列表',
      noCache: true
    }
  },
    // /  {
    //     path: 'navList',
    //     component: () => import('@/views/goodsAdmin/navList'),
    //     name: 'navList',
    //     meta: { title: '导航列表', noCache: true }
    //   },
  {
    path: 'goodsList',
    component: () => import('@/views/goodsAdmin/goodsList'),
    name: 'goodsList',
    meta: {
      title: '商品列表',
      noCache: true
    }
  },
  {
    path: 'template',
    component: () => import('@/views/goodsAdmin/template'),
    name: 'template',
    meta: {
      title: '模板列表',
      noCache: true
    }
  }
    // {
    //   path: 'addGoods',
    //   component: () => import('@/views/goodsAdmin/addGoods'),
    //   name: 'addGoods',
    //   meta: { title: '添加商品', noCache: true }
    // }
  ]
}

export default activeSysRouter
