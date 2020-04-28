<template>
	<div class="mainLoginBox">
        <!-- <div class="loginLogoBox"><img src="/mobile/static/images/logo.png" /></div> -->
		<div class="loginTitleBox">
			<div class="mainTitle">果品溯源管理平台</div>
			<div class="subhead">蓝科溯源</div>
		</div>
        <ul class="loginFormBox">
            <li>
                <van-field class="infoBox" v-model="loginForm.phone" placeholder="请输入手机号" clearable/>
            </li>
            <li>
                <van-field class="infoBox codeIptBox" v-model="loginForm.code" placeholder="请输入验证码" clearable/>
                <div class="getCodeBox">
                    <span class="btnBox" v-show="codeShow" @click="getCodeBtn">获取验证码</span>
                    <span class="txtBox" v-show="!codeShow">{{count}}秒后再试</span>
                </div>
            </li>
        </ul>
        <div class="loginSubmitBox"><van-button @click="loginSubmit" :loading="loginLoading"  loading-text="登录中..." type="info" size="large">登录</van-button></div>
		<!-- <div class="forgotPasBox">如忘记密码，请联系管理员重新设置</div> -->
	</div>
</template>
<script>
import { setToken } from '@/utils/auth'
import { login,getCode } from "@/api/login"
import { phoneTest } from "@/utils/validate"
export default {
	name: 'Login',
	data(){
		return{
			loginForm: {
				phone: '',
				code: '',
            },
            codeShow:true,
            count: '',
            timer: null,
            loginLoading:false,
		}
	},
	created(){
	},
	methods:{
        //发送验证码
        getCodeBtn(){
            if(this.loginForm.phone == ''){
                this.$toast.fail('手机号不能为空');
                return false;
            }
            const phone = phoneTest(this.loginForm.phone);
            if(!phone){
                this.$toast.fail('手机号格式不正确，请重新输入');
                return false;
            }
            const data = {};
            data.phone = this.loginForm.phone;
            getCode(data).then(success => {
                const suc = success.data
                // console.log(success);
				if(suc.code == 200){
                    this.countdown();//打开倒计时
					// console.log(suc);
				}else{
					this.$toast.fail(suc.data);
					// console.log(suc.data)
				}
			}).catch(err => {
				this.$toast.fail('验证码请求失败');
				// console.log(err)
			});
        },
        //倒计时
        countdown(){
            const TIME_COUNT = 60;
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.codeShow = false;
                this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--;
                    } else {
                        this.codeShow = true;
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }, 1000)
            }
        },
		//登录
		loginSubmit() {
            if(this.loginForm.phone == ''){
                this.$toast.fail('手机号不能为空');
                return false;
            }
            const phone = phoneTest(this.loginForm.phone);
            if(!phone){
                this.$toast.fail('手机号格式不正确，请重新输入');
                return false;
            }
			if(this.loginForm.code == ''){
				this.$toast.fail('请输入验证码');
				return false;
            }
            this.loginLoading = true;
			var data = {
				phone:this.loginForm.phone,
                code:this.loginForm.code,
                type:3
            };
			login(data).then(success => {
                const suc = success.data
				if(suc.code == 200){
                    // setToken(suc.userinfo.api_token);
                    localStorage.setItem("api_token", suc.userinfo.api_token);
					this.$toast.success("登录成功");
                    this.$router.goBack();
				}else if(suc.code == 301){
                    // console.log(suc.data)
                    this.$dialog.confirm({
                        // title: '标题',
                        message: '当前用户已经登录，是否强制登录'
                    }).then(() => {
                        var data = {
                            phone:this.loginForm.phone,
                            code:this.loginForm.code,
                            type:3,
                            islogin:1
                        };
                        login(data).then(success => {
                            const suc = success.data
                            if(suc.code == 200){
                                // setToken(suc.userinfo.api_token);
                                localStorage.setItem("api_token", suc.userinfo.api_token);
                                this.$toast.success("登录成功");
                                this.$router.goBack();
                            }
                        })
                        .catch(err => {
                            this.$toast.fail(suc.data);
                            return false;
                        })
                    }).catch(() => {
                        this.loginLoading = false;
                        return false;
                    });
				}else{
                    this.loginLoading = false;
					this.$toast.fail(suc.data);
					// console.log(suc.data)
                }
			})
			.catch(err => {
                this.loginLoading = false;
				this.$toast.fail('登录失败，请稍后重试');
				// console.log(err)
			})
		}
	
	}
}
</script>
<style scoped>
.mainLoginBox{position:absolute;top:0;left:0;right:0;bottom:0;background-color:#ffffff;overflow-y:scroll;}
.mainLoginBox .loginLogoBox{width:80px;height:120px;margin:0 auto;padding:40px 0 0 0;}
.mainLoginBox .loginLogoBox img{display:block;width:100%;height:100%;}
.mainLoginBox .loginTitleBox{min-height:200px;}
.mainLoginBox .loginTitleBox .mainTitle{color:#1d1e2c;font-size:32px;line-height:40px;font-weight:bold;padding:100px 0 0 20px;}
.mainLoginBox .loginTitleBox .subhead{display:none;background-color:#1d92c9;color:#fff;font-size:16px;font-weight:normal;line-height:28px;float:left;padding:0 14px;}
.mainLoginBox .loginFormBox{margin:0 20px;}
.mainLoginBox .loginFormBox li{height:52px;line-height:52px;margin-bottom:16px;position:relative;border-bottom:1px solid #eee;overflow:hidden;}
.mainLoginBox .loginFormBox li .infoBox{padding:0;border:0;width:100%;padding:14px 16px;border-radius:4px;line-height:24px;}
.mainLoginBox .loginFormBox li .infoBox.codeIptBox{width:56%;}
.mainLoginBox .loginFormBox li .getCodeBox{position:absolute;top:0;right:0;width:42%;font-size:14px;text-align:center;}
.mainLoginBox .loginFormBox li .getCodeBox .btnBox{display:block;color:#10b269;}
.mainLoginBox .loginFormBox li .getCodeBox .txtBox{display:block;color:#999}
.mainLoginBox .loginSubmitBox{margin:40px 20px 0 20px;}
.mainLoginBox .loginSubmitBox .van-button--info{background-color:#10b269;border:1px solid #10b269;}
.mainLoginBox .forgotPasBox{font-size:14px;line-height:48px;color:#999ca7;text-align:center;}
</style>
