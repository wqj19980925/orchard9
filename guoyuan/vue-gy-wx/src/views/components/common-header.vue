<template>
		<div class="mainHeaderBox">
			<div class="left-icon">
				<span v-if="showback" @click="back" class="icon-back"><van-icon name="arrow-left" /></span>
			</div>
			<div class="header-title">
				<span>{{title}}</span>
			</div>
			<div class="right-icon">
				<span v-if="showmy" @click="personal" class="my-box"><van-icon name="contact" /></span>
			</div>
		</div>
</template>

<script>
// import "../style/common.js";
import { getuserName,getuserPas } from '@/utils/auth'

export default {
	data() {
		return {}
	},
	props: {
		showright: {
			type: Boolean,
			default: false
		},
		showleft: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		titles: {
			type: String,
			default: ''
		},
		showback: {
			type: Boolean,
			default: true
		},
		showmy: {
			type: Boolean,
			default: false
		}
	},
	created(){
			// const username = getuserName();//pass
			// const password = getuserPas();//pass
			// if(username == null || password == null){
			//	 this.$router.togo('/')
			//	 return false;
			// }
	},
	mounted(){
	},
	methods: {
		back() {
			this.$router.goBack()
		},
		personal(){
			this.$router.togo('/home/personal')
		},
	}
}
</script>
<style>
@import "../style/common.less";
.mainHeaderBox{position:fixed;top:0;left:0;right:0;z-index:9;background-color:#10b269;}
.mainHeaderBox .header-title{font-size:16px;height:48px;line-height:48px;color:#fff;text-align:center;}
.mainHeaderBox .left-icon{position:fixed;top:0;left:0;width:48px;height:48px;}
.mainHeaderBox .left-icon .icon-back{display:block;width:100%;height:100%;line-height:48px;color:#fff;font-size:24px;text-align:center;}
.mainHeaderBox .left-icon .icon-back .van-icon{line-height:48px;}
.mainHeaderBox .right-icon{position:fixed;top:0;right:0;width:48px;height:48px;}
.mainHeaderBox .right-icon .my-box{display:block;width:100%;height:100%;line-height:48px;}
.mainHeaderBox .right-icon .my-box .van-icon{color:#fff;font-size:24px;line-height:48px;}
.mainHeaderNoneBox{height:48px;}
.van-dialog .van-dialog__footer{border-top:1px solid #e6e6e6;}
.van-dialog .van-dialog__footer .van-dialog__confirm{background-color:#10b269;color:#fff;}
</style>
