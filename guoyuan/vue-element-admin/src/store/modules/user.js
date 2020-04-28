import {
  loginByUsername,
  LogOut,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  errorStatus
} from '@/utils/index'
 import {personal} from "@/api/system"
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_INFOR: (state, infor) => {
      state.infor = infor
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();

      return new Promise((resolve, reject) => {
        // console.log('12313',userInfo);
        loginByUsername({...userInfo}).then(response => {
          const data = response.data
          // console.log('用户名登录--', data)
          if (errorStatus(data)) {
            if (data.code === 400) {
              console.log('400')
            } else {
              const data1 = data.userinfo
              const defaltUrl=data.default_url
              if(defaltUrl){

              }
              commit('SET_TOKEN', data1.api_token)
              setToken(data1.api_token)
            }
          }
          resolve(data)
        }).catch(error => {
          console.log('error', error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({
      commit,
      state
    }) {
      // console.log('111', state.token)
      // return new Promise((resolve, reject) => {
        var datadd = {};
        return  personal(datadd).then(response => {
          // console.log('获取用户信息1212--', response)
          // console.log(response);
          const data1 = response.data.admin;
          commit('SET_NAME', data1.adm_name);
          return response.data;
          // resolve(response)
        }).catch(error => {
          return error;
          // reject(error)
        })
      // })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        LogOut(state.token).then((response) => {
          // console.log('退出--', response)
          const data = response.data
          if (errorStatus(data)) {
            commit('SET_TOKEN', '')
            removeToken()
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        LogOut(state.token).then((response) => {
          const data = response.data
          if (errorStatus(data)) {
            commit('SET_TOKEN', '')
            removeToken()
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }

    // 动态修改权限
    // ChangeRoles({
    //   commit,
    //   dispatch
    // }, role) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', role)
    //     setToken(role)
    //     getInfo(role).then(response => {
    //       const data = response.data
    //       commit('SET_ROLES', data.roles)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
    //       resolve()
    //     })
    //   })
    // }
  }
}

export default user
