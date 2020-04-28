<template>
	<div class="login-page">
		<div class="background-left"><!-- <img src="../../assets/img/login_bg_img.jpg"> --></div>
		<div class="login-center">
			<div class="login-inline">
				<el-form v-if="!showForPass" ref="loginForm" :model="loginForm" :rules="loginRules" class auto-complete="on" label-position="left">
					<div class="title-container"><h1>赵县冀康源果品种植专业合作社</h1></div>
					<el-form-item prop="username" label="  用户名:" style="margin-top:80px; width: 400px; margin-left: 40px;">
						<el-input v-model="loginForm.username" placeholder="请输入用户名" type="text" class=" inputstyle" />
					</el-form-item>
					<el-form-item prop="password" label="  密码:" class="lk-form-item lk-form-it" style="margin-top:80px;width: 400px; margin-left: 40px;">
						<el-input :type="passwordType" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter.native="handleLogin" class=" inputstyle" />
						<!-- <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
            </span>-->
					</el-form-item>
					<!-- <span class="forg-passWord" @click="showForPass=true">忘记密码?</span> -->
					<el-button :loading="loading" class="login-btn main-btn " style="" @click.native.prevent="handleLogin">登录</el-button>
				</el-form>
				<!--         <div v-if="showForPass" class="forget-password">
          <div class="fp-goback-icon" @click="showForPass = false">
            <svg-icon icon-class="back" class="icon-back"/>
          </div>
          <div class="fp-contain">
            <img src="../../assets/img/login-infor_02.png" class="con-img">
            <p class="fp-text">请联系管理员找回密码</p>
            <p class="fp-tel">13601274800</p>
          </div>
        </div> -->
			</div>
		</div>
	</div>
</template>

<script>
import { valiPassword } from '@/utils/validate';
import { loginByUsername } from '@/api/login';
import axios from 'axios';
export default {
	name: 'Login',
	data() {
		const validateUsername = (rule, value, callback) => {
			if (value.length < 2) {
				callback(new Error('请输入用户名'));
			} else {
				callback();
			}
		};
		const validatePassword = (rule, value, callback) => {
			if (!valiPassword(value)) {
				callback(new Error('请确认密码正确性'));
			} else {
				callback();
			}
		};
		return {
			showForPass: false,
			loginForm: {
				username: '',
				password: '',
				type: 1
			},
			loginRules: {
				username: [{ required: true, trigger: 'blur', validator: validateUsername }],
				password: [{ required: true, trigger: 'blur', validator: validatePassword }]
			},
			passwordType: 'password',
			loading: false,
			showDialog: false,
			redirect: undefined
		};
	},
	watch: {
		$route: {
			handler: function(route) {
				// console.log('登录权限---route', route)
				this.redirect = route.query && route.query.redirect;
			},
			immediate: true
		}
	},
	created() {
		// window.addEventListener('hashchange', this.afterQRScan)
		// this.test()
	},
	destroyed() {
		// window.removeEventListener('hashchange', this.afterQRScan)
	},
	methods: {
		showPwd() {
			if (this.passwordType === 'password') {
				this.passwordType = '';
			} else {
				this.passwordType = 'password';
			}
		},
		handleLogin() {
			// $refs 绑定loginForm  这个节点
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true;
					this.$store
						.dispatch('LoginByUsername', this.loginForm)
						.then(data => {
							this.loading = false;
							if (data.code === 400) {
								this.$confirm('此账号已登录,是否强制登录?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									const data = this.loginForm;
									data.islogin = '1';
									this.$store
										.dispatch('LoginByUsername', data)
										.then(data => {
											// this.$router.push({ path: '/Piecemealhomestatis' })
											this.$router.push({ path: data.default_url });
										})
										.catch(Error => {
											// console.log('Error--强制登录--', Error)
										});
								});
							} else {
								this.$router.push({ path: '/Piecemealhomestatis' });
								// console.log('登录请求成功---', this.$router)
							}
						})
						.catch(err => {
							this.$message.error('登录请求失败!');
							console.log('err----', err);
							this.loading = false;
						});
				} else {
					// console.log('登录信息错误!!')
					this.$message.error('登录信息错误!!');
					return false;
				}
			});
		}
	}
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */

$tit: #304056;
$light_gray: #eee;
$dark_gray: #889aa4;
$cursor: #fff;
/* reset element-ui css */
.login-container {
	.el-input {
		display: inline-block;
		height: 47px;
		width: 80%;
		input {
			background: transparent;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			color: $dark_gray;
			height: 47px;
			// &:-webkit-autofill {
			//   -webkit-box-shadow: 0 0 0px 1000px $tit inset !important;
			//   -webkit-text-fill-color: $cursor !important;
			// }
		}
	}
	.el-form-item__error {
		padding-left: 10px;
	}
	.el-form-item {
		border-bottom: 1px solid #999;
		color: #454545;
	}
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/variables.scss';
$dark_gray: #889aa4;
$light_gray: #eee;
.login-page {
	width: 100%;
	height: 100%;

	.background-left {
		height: 100%;
		float: left;
		width: 70%;
		background: url('../../assets/img/login_img.png') no-repeat center;
		background-size: 100%;
	}
	.login-center {
		height: 100%;
		width: 30%;
		float: left;
		background-size: 100%;
		background: #fff;
		.login-inline {
			text-align: center;
			margin-top: 25%;
			margin-left: 5%;
			.login-btn {
				margin: 30px 0;
				font-size: 16px;
				height: 46px;
				background: #10b269;
				width: 300px;
			}
			.login-btn:hover {
				color: #FFFFFF;
				border-color:#FFFFFF ;
			}
		}
		.title-container {
			position: relative;
			.title {
				font-size: 22px;
				margin: 0px auto 40px auto;
				text-align: center;
			}
			.set-language {
				color: #fff;
				position: absolute;
				top: 5px;
				right: 0px;
			}
		}
		.logo-box {
			padding: 25px 0 0;
			height: 90px;
			float: left;
			.logo-img {
				width: 90px;
				height: 90px;
				float: left;
			}
			.logo-text {
				float: left;
				line-height: 90px;
				padding-left: 20px;
				color: #333;
				font-size: 40px;
			}
		}
		.login-form {
			width: 200px;
			float: right;
			padding: 30px 40px 0;
			border: 1px solid #fff;
			background-color: #fff;
			border-radius: 10px;
			box-shadow: 0px 0px 16px #666;
			position: relative;
			.lk-form-item {
				margin-bottom: 0;
			}

			.foot-box {
				color: #808080;
				font-size: 12px;
				line-height: 1;
				text-align: center;
			}
			.forg-passWord {
				font-size: 12px;
				color: #999;
				float: right;
				cursor: pointer;
				padding-top: 6px;
			}
			.forget-password {
				.fp-goback-icon {
					width: 50px;
					height: 30px;
					position: absolute;
					top: 20px;
					left: 20px;
					z-index: 2;
					.icon-back {
						width: 30px;
						height: 27px;
						cursor: pointer;
					}
				}

				.fp-contain {
					padding: 30px 0 20px;
					text-align: center;
					color: $mainColor;
					.con-img {
						width: 313px;
						margin-bottom: 10px;
					}
					p {
						margin: 6px 0;
					}
					.fp-text {
						font-size: 28px;
					}
					.fp-tel {
						font-size: 34px;
					}
				}
			}
		}
	}
}
</style>
<style rel="stylesheet/scss" lang="scss">
.lk-form-it {
	.lk-ipt-box {
		.el-input__inner {
			color: #454545 !important;
		}
		.el-input__inner::placeholder {
			color: #999 !important;
		}
	}
}
</style>
<style>
.inputstyle input {
	border: 0 solid #666 !important;
	border-radius: 0 !important;
	border-bottom: 1px solid #666 !important;
}
.inputstyle {
	width: 300px;
}
.el-form-item__label{
		width: 85px ;
		font-weight: 500 ;
}
.el-form-item__error{padding-left: 90px; padding-top: 10px;}
</style>
