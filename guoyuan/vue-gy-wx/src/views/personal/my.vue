<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainPersonalBox">
            <div class="mainInfoItemBox">
                <div class="picBox">{{ mySelfInfo.surname }}</div>
                <div class="nameMobileBox">{{ mySelfInfo.far_name }} &nbsp; {{ mySelfInfo.far_mobile }}</div>
                <ul class="statisBox">
                    <li><span class="numBox">{{ mySelfInfo.base_count }}</span><span class="txtBox">基地</span></li>
                    <li><span class="numBox">{{ mySelfInfo.fac_count }}</span><span class="txtBox">设备</span></li>
                    <li><span class="numBox">{{ mySelfInfo.off_count }}</span><span class="txtBox">员工</span></li>
                    <li><span class="numBox">{{ mySelfInfo.tem_count }}</span><span class="txtBox">临时工</span></li>
                </ul>
            </div>
            <div class="mainMenuItemBox">
                <van-cell v-for="item in myNavList" :key="item.index" :title="item.meta.title" is-link :icon="item.tit_pic" @click="menuLink(item.pri_path)"/>
                <!-- <van-cell title="我的任务" is-link icon="todo-list-o" @click="menuLink(2)"/>
                <van-cell title="我的物资" is-link icon="brush-o" @click="menuLink(3)"/>
                <van-cell title="系统消息" is-link icon="chat-o" @click="menuLink(4)"/> -->
            </div>
            <div class="outLoginBtn" @click="onLogoutBtn">安全退出</div>
        </div>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getPriId } from '@/utils/auth'
import { loginout } from '@/api/login'
import { mySelf } from '@/api/personal'
export default {
    data(){
        return{
            title:'个人中心',
            showback:true,
            showmy:false,
            // api_token:'',
            mySelfInfo:{},
            myNavList:[],
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.mySelfInfoBtn();
    },
    methods: {
        //我的 基本信息
        mySelfInfoBtn(){
            //打开加载层
            this.$toast.loading({
                mask:true,
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在加载'
            });
            const data = {};
            data.pri_id = getPriId();
            // data.api_token = this.api_token;
            mySelf(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data
                if(suc.code == 200){
                    this.mySelfInfo = suc.data;
                    this.myNavList = suc.data.botton;
                    this.mySelfInfo.surname = suc.data.far_name.substring(0,1)
                    // console.log(this.mySelfInfo);
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("基本信息请求失败，请稍后重试");
            });
        },
        //安全退出
        onLogoutBtn(){
            this.$dialog.confirm({
                message:'确定登出当前账号'
            }).then(()=>{
                //打开加载层
                this.$toast.loading({
                    mask:true,
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '正在加载'
                });
                const data = {}
                // data.api_token = this.api_token;
                loginout(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.$toast.success(suc.data);
                        localStorage.removeItem("api_token");
                        var this_ = this;
                        setTimeout(function(){
                            this_.$router.togo('/login');
                        },1000);
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail("退出请求失败，请稍后重试");
                })
            })
            .catch(()=>{
                this.$toast.success("取消退出");
                return false
            })
        },
        //导航栏目
        menuLink(url){
            this.$router.togo(url);
            // if(num == 1){
            //     //我的关联账号
            //     this.$router.togo('/home/personal/account');
            // }else if(num == 2){
            //     //我的任务
            //     this.$router.togo('/home/personal/task');
            // }else if(num == 3){
            //     //我的物资
            //     this.$router.togo('/home/personal/material');
            // }else if(num == 4){
            //     //系统消息
            //     this.$router.togo('/home/personal/message');
            // }
        },
        
    }
}
</script>
<style scoped>
.mainPersonalBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainInfoItemBox{padding:20px 0 0 0;background-color:#10b269;}
.mainInfoItemBox .picBox{width:100px;height:100px;border-radius:50%;background-color:#eaeaea;margin:0 auto;text-align:center;font-size:48px;line-height:100px;font-weight:bold;}
.mainInfoItemBox .nameMobileBox{text-align:center;font-size:18px;line-height:24px;padding:18px 0;color:#fff;}
.mainInfoItemBox .statisBox{height:80px;background-color:#fff;font-size:0px;padding:10px 0;margin-bottom:14px;}
.mainInfoItemBox .statisBox li{display:inline-block;width:25%;font-size:14px;text-align:center;}
.mainInfoItemBox .statisBox li .numBox{display:block;font-size:28px;line-height:34px;}
.mainInfoItemBox .statisBox li .txtBox{display:block;font-size:14px;}
.outLoginBtn{margin:20px 10px;background-color:#10b269;font-size:18px;line-height:28px;height:48px;text-align:center;padding:10px;color:#fff;border-radius:4px;}
</style>
