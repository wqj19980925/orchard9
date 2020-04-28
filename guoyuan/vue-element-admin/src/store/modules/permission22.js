import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
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
// function generateAsyncRouter(routerMap, serverRouterMap) {
//   serverRouterMap.forEach(function (item, index) {
//     item.component = routerMap[item.component]
//     if (item.children && item.children.length > 0) {
//       generateAsyncRouter(routerMap, item.children)
//     }
//   })
//   return serverRouterMap;
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // 然后在actions中GenerateRoutes方法合适的地方将后端请求的路由表映射到routerMap,并筛选出可访问的路由,serverRouterMap是我定义的从后台请求路由表的方法
        // serverRouterMap().then(response => {
        //   var asyncRouterMap = generateAsyncRouter(routerMap, response.data.serverRouterMap)
        //   if (roles.indexOf('admin') >= 0) {
        //     accessedRouters = asyncRouterMap
        //   } else {
        //     accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        //   }
        //   commit('SET_ROUTERS', accessedRouters)
        //   resolve()
        // })
        // console.log("asyncRouterMap-----",asyncRouterMap)
        // const { roles } = data
        let accessedRouters
        // if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        // } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap);
        // }
        
        commit('SET_ROUTERS', accessedRouters);
        resolve()
      })
    }
  }
}

export default permission
