import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '../components/HelloWorld'
import Home from '../views/index/home'
import Login from '../views/login/login'
import My from '../views/personal/my'
import Account from '../views/personal/account'
import Material from '../views/personal/material'
import Message from '../views/personal/message'
import MessageDetail from '../views/personal/message_detail'
import MyTask from '../views/personal/myTask'
import MyTaskDetail from '../views/personal/myTask_detail'
import Harvest from '../views/workbench/harvesting'
import Estimate from '../views/workbench/estimate'
import Loss from '../views/workbench/frmLoss'
import Task from '../views/workbench/task'
import TaskDetail from '../views/workbench/task_detail'
import Work from '../views/workbench/work'
import Journal from '../views/workbench/journal'
import MyBase from '../views/myBase/index'
import MyBaseDetail from '../views/myBase/detail'
import MyBaseDetailInformat from '../views/myBase/detail_infromation'
Vue.use(Router)
// 需要左方向动画的路由用this.$router.to('****')
Router.prototype.togo = function (path) {
	this.isleft = true
	this.isright = false
	this.push(path)
}
// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (path) {
	this.isright = true
	this.isleft = false
	this.push(path)
}
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
	this.isright = true
	this.isleft = false
	this.go(-1)
}
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
	this.isright = true
	this.isleft = false
}
// 点击浏览器前进按钮执行
Router.prototype.togoin = function () {
	this.isright = false
	this.isleft = true
}
export default new Router({
	routes: [
		{
			path:'/',
			component: Home
		},{
			path:"/login",
			component:Login
		// },{
		// 	path:'/home',
		// 	component: Home
		},{
			path:'/home/personal',
			component: My
		},{
			path:'/home/personal/account',
			component: Account
		},{
			path:'/home/personal/material',
			component: Material
		},{
			path:'/home/personal/message',
			component: Message
		},{
			path:'/home/personal/message/detail',
			component: MessageDetail
		},{
			path:'/home/personal/task',
			component: MyTask
		},{
			path:'/home/personal/task/detail',
			component: MyTaskDetail
		},{
			path:'/home/myBase',
			component: MyBase
		},{
			path:'/home/myBase/detail',
			component: MyBaseDetail
		},{
			path:'/home/myBase/detail/detailInformat',
			component:MyBaseDetailInformat
		},{
			path:'/home/harvesting',
			component: Harvest
		},{
			path:'/home/estimate',
			component: Estimate
		},{
			path:'/home/frmLoss',
			component: Loss
		},{
			path:'/home/work',
			component: Work
		},{
			path:'/home/journal',
			component: Journal
		},{
			path:'/home/task',
			component: Task
		},{
			path:'/home/task/detail',
			component: TaskDetail
		}
	]
})
