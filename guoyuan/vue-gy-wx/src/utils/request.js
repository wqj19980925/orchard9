import axios from 'axios'
// import {Message,MessageBox} from 'element-ui'
import { Dialog } from 'vant';
import { Toast } from 'vant';

// import store from '@/store'
import { getToken,removeToken} from '@/utils/auth'
import router from '../router';

// 自定义配置创建axios的新实例
const service = axios.create({
	// baseURL: 'http://ewmbak.bluearp.com/index.php/InterfacePda/GetInfo', // api 的 base_url 将被添加到`url`前面
	baseURL: process.env.BASE_API, // api 的 base_url 将被添加到`url`前面
	timeout: 5000, // request timeout
	params: {} // 无论请求为何种类型，在params中的属性都会以key=value的格式在urlzhong拼
	// headers: {
	//	 'Access-Control-Allow-Methods': '*',
	//	 'Access-Control-Allow-Headers': 'X-Custom-Header',
	//	 'Access-Control-Allow-Credentials': true,
	//	 'Access-Control-Max-Age': '1728000'
	// }
})

// request interceptor 添加请求拦截器
service.interceptors.request.use(
	config => {
		// console.log('request--', config)
		// 在发送请求之前做某事
		// Do something before request is sent
		// if (store.getters.token) {
		// 	// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
		// 	config.data.api_token = getToken();
		// }
		var api_token = localStorage.getItem('api_token');
		if(api_token){
			config.data.api_token = api_token;
		}else{
			config.data.api_token = '';
		}
		return config
	},
	error => {
		// Do something with request error //请求错误时做些事
		// console.log('err111111111', error) // for debug
		Promise.reject(error) // 返回一个被拒绝的Promise对象 用于调试
	}
)

// response	拦截器
service.interceptors.response.use(
	/**
	 * 下面的注释为通过在response里，自定义code来标示请求状态
	 * 当code返回如下情况则说明权限有问题，登出并返回到登录页
	 * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
	 * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
	 */
	response => {
		const res = response.data;
		// console.log('response',response)
		if (res.code == 300) {
			// console.log(1111111111111);
			// this.$router.togo('/');
			// console.log(2222);
			// this.$dialog.confirm({
			// 	// title: '标题',
			// 	message: '用户登录超时，请重新登录'
			// }).then(() => {
			// 	removeToken("api_token");
			// }).catch(() => {
			// });
			// Toast.fail('用户登录超时，请重新登录');
			Dialog.alert({
				message: '用户登录超时，请重新登录'
			}).then(() => {
			// 	// on confirm
				localStorage.removeItem("api_token");
				router.push({path:'/login'});
			})
			// return Promise.reject('error');
		}
		return response;
	},
	error => {
		console.log('err' + error) // for debug
		Message({
			message: error.message,
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(error)
	}
)


export default service
