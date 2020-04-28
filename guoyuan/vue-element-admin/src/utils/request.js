import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 自定义配置创建axios的新实例
const service = axios.create({
  // console.log()
  baseURL: process.env.BASE_API, // api 的 base_url 将被添加到`url`前面
  // baseURL: 'http://mo2o9.sudianwang.com/index.php', // api 的 base_url 将被添加到`url`前面
  timeout: 5000 // request timeout
})

// request interceptor 添加请求拦截器
service.interceptors.request.use(
  config => {
    // config.url = root + config.url;
    // return false;
    // 在发送请求之前做某事
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // try{
        // config.headers['token'] = getToken();
        config.data.api_token = getToken();

      // }
      // catch(err){
      //   console.log(err);
      // }

      // console.log(config,'=======');
    }
    return config
  },
  error => {
    // Do something with request error //请求错误时做些事
    console.log(error) // for debug
    Promise.reject(error) // 返回一个被拒绝的Promise对象 用于调试
  }
)

// response 成功 拦截器
service.interceptors.response.use(
  response =>{
    const res = response.data;
    if (res.ErrorCode === 1001) {
        if (res.ErrorCode === 1001) { 
            MessageBox.confirm('您已被登出，请重新登录', '确定登出', {
              confirmButtonText: '重新登录',
              // cancelButtonText: '取消',
              showCancelButton:false,
              type: 'warning'
            }).then(() => {
              store.dispatch('FedLogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            })
          }
          return Promise.reject('error');
    } else if(res.ErrorCode === 1003){
          MessageBox.confirm(res.ErrorMessage, '确定', {
            confirmButtonText: '确定',
            // cancelButtonText: '取消',
            showCancelButton:false,
            type: 'warning'
          }).then(() => {
            // store.dispatch('FedLogOut').then(() => {
            //   location.reload() // 为了重新实例化vue-router对象 避免bug
            // })
            // this.$router.go(-1);
            next()
          })
          return Promise.reject('error');
    } else {
       return response
    }
  },
  error =>{
    return error
  }
  // function (response) {
  //   　　// 对响应数据做点什么
  //   console.log(response,"response")
  //   　　return response
  //   }, function (error) {
  //   　　// 对响应错误做点什么
  //   　　return Promise.reject(error)
  //   }
  // response => response,
  // /**
  //  * 下面的注释为通过在response里，自定义code来标示请求状态
  //  * 当code返回如下情况则说明权限有问题，登出并返回到登录页
  //  * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
  //  * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
  //  */
  // response => {
  //   console.log("12313sdfjklsj");
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     }) // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) { 
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  // error => {
  //   console.log('err' + error) // for debug
  //   Message({
  //     message: error.message,
  //     type: 'error',
  //     duration: 5 * 1000
  //   })
  //   return Promise.reject(error)
  // }
)

export default service
