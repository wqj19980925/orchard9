import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // if (store. != 0) { // 判断当前用户是否已拉取完user_info信息
      //   store.dispatch('GetUserInfo').then(res => { // 拉取user_info
      //     const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
      //     store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
      //       router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      //       next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      //     })
      //   }).catch((err) => {
      //     store.dispatch('FedLogOut').then(() => {
      //       Message.error(err || 'Verification failed, please login again')
      //       next({ path: '/' })
      //     })
      //   })
      if(store.getters.name === ''){
        // debugger;
          store.dispatch('GetUserInfo').then(res => { // 拉取user_info
            console.log(store.getters.name,'name');

            // console.log(res,'res')
            store.dispatch('GenerateRoutes').then(() => { // 根据roles权限生成可访问的路由表
              console.log(store.getters.addRouters,'-----------11')
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to,
                replace: true
              }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
        })
      }else{
        next()
      }
    
      // } else {
      //   // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      //   if (hasPermission(store.getters.roles, to.meta.roles)) {
      //     next()
      //   } else {
      //     next({ path: '/401', replace: true, query: { noGoBack: true }})
      //   }
      //   // 可删 ↑
      // }
       // determine whether the user has obtained his permission roles through getInfo
      //  const hasRoles = store.getters.roles && store.getters.roles.length > 0
      //  if (hasRoles) {
      //    next()
      //  } else {
      //    try {
      //      // get user info
      //      // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
      //      const { roles } = await store.dispatch('user/getInfo')
 
      //      // generate accessible routes map based on roles
      //      const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
 
      //      // dynamically add accessible routes
      //      router.addRoutes(accessRoutes)
 
      //      // hack method to ensure that addRoutes is complete
      //      // set the replace: true, so the navigation will not leave a history record
      //      next({ ...to, replace: true })
      //    } catch (error) {
      //      // remove token and go to login page to re-login
      //      await store.dispatch('user/resetToken')
      //      Message.error(error || 'Has Error')
      //      next(`/login?redirect=${to.path}`)
      //      NProgress.done()
      //    }
      //  }
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
