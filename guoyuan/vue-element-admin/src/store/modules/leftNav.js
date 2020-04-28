import {
  // asyncRouterMap,
  constantRouterMap,
  routerMap
} from '@/router'

import {
  serverRouterMap
} from '@/api/login'

import {
  getToken
} from '@/utils/auth'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */

function hasPermission(roles, route) {

  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function filterAsyncRouter(routes, roles) {

  const res = []

  routes.forEach(route => {
    const tmp = { ...route
    }

    if (hasPermission(roles, tmp)) {
      if (tmp.children) {

        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 将本地routerMap映射到ajax获取到的serverRouterMap;
function generateAsyncRouter(routerMap, serverRouterM) {

  serverRouterM.forEach(function(item, index) {
    item.component = routerMap[item.component]
    if (item.children && item.children.length > 0) {
      generateAsyncRouter(routerMap, item.children)
    }
  })
  return serverRouterM
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    token: getToken()
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        console.log('---------', resolve)
        const {
          roles
        } = data
        let accessedRouters
        const token = getToken()
        // 然后在actions中GenerateRoutes方法合适的地方将后端请求的路由表映射到routerMap,并筛选出可访问的路由,serverRouterMap是我定义的从后台请求路由表的方法
        serverRouterMap(token).then(response => {
          console.log('---response', response)
          var asyncRouterMap = generateAsyncRouter(routerMap, response.data.data.serverRouter)
          if (roles.indexOf('admin') >= 0) {
            accessedRouters = asyncRouterMap
          } else {
            accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
          }
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        }).catch(err => {
          console.log('wrong--', err)
        })
      })
    }
  }
}

export default permission
