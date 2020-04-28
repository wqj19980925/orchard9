<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainPersonalBox">
            <ul v-if="myAccountInfo != ''" class="mainMyAccountBox">
                <li class="listBox" v-for="item in myAccountInfo" :key="item.index">
                    <div class="picBox">{{ item.adm_surname }}</div>
                    <div class="nameBox">{{ item.adm_name }}</div>
                    <div class="mobileBox">{{ item.adm_mobile }}</div>
                    <div class="delBox" @click="delBtn(item.adm_id)"><van-icon name="delete" /></div>
                    <div class="switchBox" @click="checkedBtn(item.adm_checked,item.adm_id)"><van-switch  v-model="item.adm_checked" active-color="#10b269" size="18px"/></div>
                </li>
            </ul>
            <div v-if="myAccountInfo == ''" class="mainInfoNoneBox">
                <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
                <div class="tetBox">你还没有关联账号，点击新增按钮添加</div>
            </div>
            <div class="tipsBox">注：关联账号上线为5，关联账号可在移动端登录，功能与添加账号一致，显示信息为添加账号信息</div>
            <div class="mainAddAccountBox" v-if="addBtnShow">
                <van-button type="info" size="large" @click="addShow = true">新增账号</van-button>
            </div>
        </div>
        <van-popup v-model="addShow" position="bottom" class="mainAddPopupBox">
            <van-nav-bar title="新增账号" left-text="返回" right-text="完成" left-arrow @click-left="onCloseBtn" @click-right="onSubmitBtn"/>
            <van-cell title="姓名" required>
                <van-field v-model="addFormInfo.adm_name" placeholder="请输入关联账号姓名" input-align="right"/>
            </van-cell>
            <van-cell title="电话" required>
                <van-field v-model="addFormInfo.adm_mobile" placeholder="请输入关联手机号" input-align="right"/>
            </van-cell>
            <div class="addTipsBox">注：填写的关联人手机号为登录账号，请确保账号正确！</div>
        </van-popup>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId,getBaseId } from '@/utils/auth'
import { phoneTest } from "@/utils/validate"
import { mySelfRelevance,mySelfStop,mySelfStart,mySelfDel,mySelfAdd } from '@/api/personal'
export default {
    data(){
        return{
            title:'我的关联账号',
            showback:true,
            showmy:false,
            // api_token:'',
            myAccountInfo:[],
            addBtnShow:true,
            //新增
            addShow:false,
            addFormInfo:{
                adm_name:'',
                adm_mobile:'',
            },
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.myAccountInfoBtn();
    },
    methods: {
        //我的 基本信息
        myAccountInfoBtn(){
            //打开加载层
            this.$toast.loading({
                mask:true,
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在加载'
            });
            const data = {};
            // data.api_token = this.api_token;
            mySelfRelevance(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data
                // console.log(suc);
                if(suc.code == 200){
                    this.myAccountInfo = [];
                    for(let i in suc.data){
                        var surname = suc.data[i].adm_name.substring(0,1);
                        var checked = true
                        if(suc.data[i].adm_stase == 2){
                            checked = false;
                        }
                        this.myAccountInfo.push({
                            adm_id:suc.data[i].adm_id,
                            adm_mobile:suc.data[i].adm_mobile,
                            adm_name:suc.data[i].adm_name,
                            adm_stase:suc.data[i].adm_stase,
                            adm_surname:surname,
                            adm_checked:checked,
                        });
                    }
                    if(this.myAccountInfo.length > 4){
                        this.addBtnShow = false;
                    }else{
                        this.addBtnShow = true;
                    }
                    // console.log(this.myAccountInfo);
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("基本信息请求失败，请稍后重试");
            });
        },
        //停用启用
        checkedBtn(checked,id){
            //打开加载层
            this.$toast.loading({
                mask:true,
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在加载'
            });
            if(checked){
                //启用
                const data = {}
                // data.api_token = this.api_token;
                data.base_id = getBaseId();
                data.pro_id = getproId();
                data.adm_id = id;
                mySelfStart(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.$toast.success(suc.data);
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail("启用请求失败，请稍后重试");
                });
            }else{
                //停用
                const data = {}
                // data.api_token = this.api_token;
                data.base_id = getBaseId();
                data.pro_id = getproId();
                data.adm_id = id;
                mySelfStop(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.$toast.success(suc.data);
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail("停用请求失败，请稍后重试");
                });
            }
        },
        //删除
        delBtn(id){
            this.$dialog.confirm({
                message:'确定要删除当前账号？'
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
                data.base_id = getBaseId();
                data.pro_id = getproId();
                // data.api_token = this.api_token;
                data.adm_id = id;
                mySelfDel(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.$toast.success(suc.data);
                        var this_ = this;
                        setTimeout(function(){
                            this_.myAccountInfoBtn();
                        },500);
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail("停用请求失败，请稍后重试");
                });
            })
            .catch(()=>{
                return false
            })
        },
        //新增 提交
        onSubmitBtn(){
            if(this.addFormInfo.adm_name == '' || this.addFormInfo.adm_mobile == ''){
                this.$toast.fail('姓名和电话不能为空');
                return false;
            }
            const phone = phoneTest(this.addFormInfo.adm_mobile);
            if(!phone){
                this.$toast.fail('手机号格式不正确，请重新输入');
                return false;
            }
            //打开加载层
            this.$toast.loading({
                mask:true,
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在加载'
            });
            const data = this.addFormInfo;
            data.base_id = getBaseId();
            data.pro_id = getproId();
            // data.api_token = this.api_token;
            mySelfAdd(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                if(suc.code == 200){
                    this.$toast.success(suc.data);
                    this.addShow = false;
                    var this_ = this;
                    setTimeout(function(){
                        this_.myAccountInfoBtn();
                    },500);
                }else{
                    this.$toast.fail("新增失败");
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("停用请求失败，请稍后重试");
            });
        },
        //新增 关闭
        onCloseBtn(){
            this.addShow = false;
            this.addFormInfo.adm_name = '';
            this.addFormInfo.adm_mobile = '';
        },
    }
}
</script>
<style scoped>
.mainPersonalBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainMyAccountBox .listBox{min-height:100px;background-color:#fff;margin-top:10px;padding:20px 10px 20px 90px;position:relative;}
.mainMyAccountBox .listBox .picBox{width:60px;height:60px;border-radius:50%;background-color:#eaeaea;font-size:30px;line-height:60px;text-align:center;font-weight:bold;position:absolute;top:50%;left:10px;margin-top:-30px;color:#666;}
.mainMyAccountBox .listBox .nameBox{font-size:20px;font-weight:bold;}
.mainMyAccountBox .listBox .mobileBox{font-size:18px;line-height:20px;padding-top:10px;}
.mainMyAccountBox .listBox .delBox{width:40px;height:30px;position:absolute;right:10px;bottom:20px;font-size:18px;text-align:center;}
.mainMyAccountBox .listBox .delBox i{line-height:30px;}
.mainMyAccountBox .listBox .switchBox{width:40px;height:30px;position:absolute;top:20px;right:10px;}
.mainAddAccountBox{padding:20px 10px;}
.mainAddAccountBox .van-button--info{background-color:#10b269;border:1px solid #10b269;}
.mainPersonalBox .tipsBox{font-size:14px;line-height:20px;padding:20px 10px;color:#f00;}
.mainAddPopupBox{height:240px;}
.mainAddPopupBox .van-cell{padding:15px;}
.mainAddPopupBox .van-field{padding:0 15px;}
.mainAddPopupBox .van-cell__value{flex:2;}
.mainAddPopupBox .addTipsBox{padding:20px;font-size:14px;color:#f00;}

.mainInfoNoneBox {padding:100px 0;text-align:center;}
.mainInfoNoneBox .picBox{width:200px;margin:0 auto;}
.mainInfoNoneBox .picBox img{width:100%;height:auto;}
.mainInfoNoneBox .tetBox{font-size:14px;line-height:20px;padding:20px 0;}

</style>
