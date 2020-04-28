import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
}
  from '@/utils/auth' // getUserid from cookie

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // console.log('00000----token', getToken())
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      // console.log('路径改变--/login')
      next({
        path: '/'
      })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // console.log('路径改变--/dash')
      if (store.getters.name === '') { // 判断当前用户是否已拉取完user_info信息

        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          // console.log(store.getters)
          // console.log('----', 111)
          const code = res.data.code // note: roles must be a array! such as: ['editor','develop']
          // if (code === 200) {
            // console.log('加载路由---')
            store.dispatch('GenerateRoutes').then(() => { // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to,
                replace: true
              }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          // } else {

          //   next()
          //   const data = res.data.data
          //   store.dispatch('FedLogOut').then(() => {
          //     Message.error(data)
          //     next({
          //       path: '/'
          //     })
          //   })
          // }
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '信息获取失败,请重新登录')
            next({
              path: '/'
            })
          })
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
