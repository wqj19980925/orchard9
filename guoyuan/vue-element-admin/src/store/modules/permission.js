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
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// function filterAsyncRouter(routes) {
//   const res = []
//   routes.forEach(route => {
//     const tmp = { ...route
//     }
//     if (hasPermission(tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

// 将本地routerMap映射到ajax获取到的serverRouterMap;
function generateAsyncRouter(routerMap, serverRouterM, num) {

  // console.log('serverRouterM', serverRouterM)
  serverRouterM.forEach(function(item, index) {
    if (num === 0) {
      if (item.name === 'Piecemealhomestatis') {
        item.path = ''
        item.component = routerMap[item.component];
      } else if (item.name == 'Akeysendsend' || item.name == 'Salesindex' || item.name == 'CodeManageindex') {
        item.path = '/' + item.path
        item.component = routerMap[item.component];
      }else {
        item.component = routerMap[item.component];
        item.path = '/' + item.path;
        item.redirect = 'noredirect';
        item.alwaysShow = true;
      }
      if (item.children && item.children.length > 0) {
        generateAsyncRouter(routerMap, item.children, 1);
      }
    } else {
      item.component = routerMap[item.component];
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
        let accessedRouters
        const token = getToken()
        // 然后在actions中GenerateRoutes方法合适的地方将后端请求的路由表映射到routerMap,并筛选出可访问的路由,serverRouterMap是我定义的从后台请求路由表的方法
        serverRouterMap(token).then(response => {
          
          for(let item of response.data.navigation_category){
            if(item.pri_id == 171){
              item.children.splice(0, 5)
            }
          }
          console.log(response.data,'未处理的路由')
          var asyncRouterMap = generateAsyncRouter(routerMap, response.data.navigation_category, 0)
          accessedRouters = asyncRouterMap;
          console.log('accessedRouters',accessedRouters)
          // accessedRouters = filterAsyncRouter(asyncRouterMap)
          commit('SET_ROUTERS', accessedRouters);
          resolve()
        }).catch(err => {
          console.log('wrong--', err)
        })
      })
    }
  }
}

export default permission
