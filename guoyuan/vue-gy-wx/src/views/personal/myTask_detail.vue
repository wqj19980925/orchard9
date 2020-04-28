<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainPersonalBox">
            <div class="mainTaskTopInfoBox">
                <van-cell title="任务名称" :value="myStackDetailInfo.task_name"/>
                <van-cell title="发布人" :value="myStackDetailInfo.task_adm_name"/>
                <van-cell title="生产编号" :value="myStackDetailInfo.pro_number"/>
                <van-cell title="区域名称" :value="myStackDetailInfo.dis_name"/>
                <van-cell title="发布时间" :value="myStackDetailInfo.task_issue_time"/>
                <van-cell title="任务内容" :value="myStackDetailInfo.task_content"/>
            </div>
            <van-cell-group class="mainTaskListBox">
                <van-cell v-for="(item,index) in myStackDetailInfo.task_origin" :key="index" :title="item.template" is-link value="去完成" @click="smallTasksBtn(item,index)" />
            </van-cell-group>
        </div>
        <van-popup v-model="checkShow" position="right" class="mainCheckPopupBox">
            <van-nav-bar title="工作内容" left-text="返回" right-text="完成" left-arrow @click-left="checkShow = false,smallTasksListInfo = []" @click-right="onSubmitBtn"/>
            <ul class="mainSmallTaskListBox">
                <li v-for="item in smallTasksListInfo" :key="item.index">
                    <van-cell class="textBox" v-if="item.show ==1 && item.type == 1" :title="item.key" :value="item.value"/>
                    <div class="hypertextBox" v-else-if="item.show ==1 && item.type == 2">
                        <div class="titleBox">{{ item.key }}</div>
                        <div class="valueBox">{{ item.value }}</div>
                    </div>
                    <van-cell class="textBox" v-else-if="item.show ==1 && item.type == 3" :title="item.key" value="点击前往" :url="item.value" is-link/>
                    <van-cell class="textBox" v-else-if="item.show ==1 && item.type == 4" :title="item.key" :value="item.value" is-link/>
                    <div class="defaultBox picBox" v-else-if="item.show ==1 && item.type == 5">
                        <span class="titleBox">{{ item.key }}</span>
                        <span class="valueBox"><img :src="baseUrl + item.value" /></span>
                    </div>
                    <div class="defaultBox" v-else-if="item.show ==1 && item.type == 6">
                        <span class="titleBox">{{ item.key }}</span>
                        <span class="valueBox"><video width="100" controls="controls" :src="baseUrl + item.value" /></span>
                    </div>
                    <van-cell class="textBox" v-if="item.show ==1 && item.type == 7" :title="item.key" value="自动获取当前设备时间"/>
                    <van-cell class="textBox" v-else-if="item.show ==1 && item.type == 8" :title="item.key" :value="location" is-link/>
                    <van-cell class="textBox" v-else-if="item.show ==1 && item.type == 9" :title="item.key" :value="item.value == '' ? '暂未绑定溯源码':item.value"/>
                    <van-cell class="textBox" v-if="item.show ==1 && item.type == 10" :title="item.key" :value="userLoginName"/>
                    <van-cell class="textBox" v-else-if="item.show ==1 && item.type == 11 || item.type == 12 || item.type == 13 || item.type == 14" :title="item.key.title" :value="item.value.n_name"/>
                    <div class="consumeBox" v-else-if="item.show ==1 && item.type == 15 && item.value.type == 1">
                        <van-cell class="textBox" :title="item.key.title" :value="item.value.n_name"/>
                        <van-cell class="textBox" title="消耗数量" :label="stockName+item.stockNum"><van-field v-model="item.value.number" placeholder="请输入数量" input-align="right"/></van-cell>
                    </div>
                    <div class="consumeBox" v-else-if="item.show ==1 && item.type == 15 && item.value.type == 2">
                        <span class="titleBox">{{ item.key.title }}</span>
                        <span class="valueBox">{{ item.value.n_name }}</span>
                    </div>
                </li>
            </ul>
        </van-popup>
    </div>
</template>
<script>
import getCurrentCityName from '../components/getUserLocation'//百度地图
import commonHeader from '../components/common-header'
import { getToken,getproId,getTaskId,getAdmName,getBaseId } from '@/utils/auth'
import { validateNumber } from "@/utils/validate"
import { mySelfStack,myselfConsume,mySelfAddStack } from '@/api/personal'
export default {
    data(){
        return{
            title:'任务详情',
            showback:true,
            showmy:false,
            // api_token:'',
            myStackDetailInfo:{},
            //打开任务
            checkShow:false,
            smallTasksListInfo:[],
            baseUrl:'',
            location:'',//定位
            myMaterialInfo:[],//物资列表
            stockName:'库存：',
            //提交表单
            formData:{},
            consumeNum:'',
            userLoginName:'',//当前登录用户姓名
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.myStackInfoBtn();
        this.userLoginName = getAdmName();
        this.getCurrentCity();//定位
    },
    methods: {
        //详情
        myStackInfoBtn(){
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
            data.pro_id = getproId();
            data.task_id = getTaskId();
            data.state = 2;
            mySelfStack(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data
                // console.log(suc);
                if(suc.code == 200){
                    this.myStackDetailInfo = suc.data;
                    const url = process.env.BASE_API;
                    this.baseUrl = url.replace('/public/', '/');
                    // console.log(this.myStackDetailInfo);
                    this.myMaterialInfoBtn();
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("任务列表请求失败，请稍后重试");
            });
        },
        //物资列表
        myMaterialInfoBtn(){
            const data = {};
            data.pro_id = getproId();
            myselfConsume(data).then(success => {
                const suc = success.data
                // console.log('物资',suc.data);
                if(suc.code == 200){
                    this.myMaterialInfo = suc.data;
                    // console.log(this.myMaterialInfo);
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.fail("物资列表请求失败，请稍后重试");
            });
        },
        //小任务内容
        smallTasksBtn(val,num){
            // console.log(val);
            this.smallTasksListInfo = JSON.parse(val.content);
            for(let i in this.smallTasksListInfo){
                if(this.smallTasksListInfo[i].type == 15 && this.smallTasksListInfo[i].value.type == 1){
                    var nId = this.smallTasksListInfo[i].value.n_id;
                    var f = true;
                    for(let a in this.myMaterialInfo){
                        var agrId = this.myMaterialInfo[a].agr_id
                        if(nId == agrId){
                            this.smallTasksListInfo[i].stockNum = this.myMaterialInfo[a].fma_num;
                            this.smallTasksListInfo[i].value.number = '';
                            f = false;
                            break;
                        }
                    }
                    if(f){
                        this.smallTasksListInfo[i].stockNum = 0;
                        this.smallTasksListInfo[i].value.number = '';
                    }
                }
            }
            this.formData.info_id = num;
            this.formData.tem_content = this.smallTasksListInfo;
            this.formData.fom_temp = val.fom_temp;
            this.formData.tem_name = val.template;
            this.checkShow = true;
            // console.log(this.smallTasksListInfo)
        },
        //提交内容
        onSubmitBtn(){
            this.$dialog.confirm({
                message: '确定要提交任务吗'
            }).then(() => {
                for(let i in this.formData.tem_content){
                    if(this.formData.tem_content[i].show == 1 && this.formData.tem_content[i].type == 15 && this.formData.tem_content[i].value.type == 1){
                        var number = this.formData.tem_content[i].value.number
                        if(number == "" || number == 0){
                            this.$toast.fail("消耗数量不能为空或小于1");
                            return false;
                        }else{
                            if(number > this.formData.tem_content[i].stockNum){
                                this.$toast.fail('消耗数量不得大于库存数量');
                                return false;
                            }else{
                                const num = validateNumber(number);
                                if(!num){
                                    this.$toast.fail('数量只能为正数数字');
                                    return false;
                                }
                            }
                            
                        }
                    }
                }
                //获取当前时间
                const timeInfo = new Date();
                var date='';
                date +=timeInfo.getFullYear()+'-'; //获取当前年份
                date +=timeInfo.getMonth()+1+'-'; //获取当前月份（0——11）
                date +=timeInfo.getDate()+' ';
                date +=timeInfo.getHours()+':';
                date +=timeInfo.getMinutes()+':';
                date +=timeInfo.getSeconds();
                //打开加载层
                this.$toast.loading({
                    mask:true,
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '正在加载'
                });
                this.formData.pro_id = getproId();
                this.formData.task_id = getTaskId();
                this.formData.base_id = getBaseId();
                for(let i in this.formData.tem_content){
                    if(this.formData.tem_content[i].type == 7){
                        this.formData.tem_content[i].value = date;
                    }
                    if(this.formData.tem_content[i].type == 10){
                        this.formData.tem_content[i].value = this.userLoginName;
                    }
                    if(this.formData.tem_content[i].type == 8){
                        this.formData.tem_content[i].value = this.location;
                    }
                }
                const data = this.formData;
                mySelfAddStack(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.$toast.fail(suc.data);
                        this.checkShow = false;
                        this.myStackInfoBtn();
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail('任务请求失败，请稍后重试');
                    console.loe(err);
                    return false;
                });
            }).catch(() => {
                this.$toast.success("取消提交");
                return false;
            });
        },
        //百度定位方法
        getCurrentCity() {
            getCurrentCityName().then((city) => {
                this.location = city;  //顺利的话能在控制台打印出当前城市
            })
        },
    }
}
</script>
<style scoped>
.mainPersonalBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainTaskTopInfoBox .van-cell__value{flex:2;}
.mainTaskListBox{background-color:#fff;margin-top:10px;font-size:14px;}
.mainTaskListBox  .van-cell__title{flex:2;}
.mainCheckPopupBox{height:100%;width:100%;}
.mainSmallTaskListBox{position:fixed;top:46px;left:0;right:0;bottom:0;overflow-y:auto;}
.mainSmallTaskListBox .textBox{border-bottom:1px solid #eee;}
.mainSmallTaskListBox .textBox .van-cell__value{flex:2;}
.mainSmallTaskListBox .hypertextBox{font-size:14px;line-height:24px;padding:10px 15px;border-bottom:1px solid #eee;}
.mainSmallTaskListBox .hypertextBox .titleBox{padding-bottom:6px;}
.mainSmallTaskListBox .hypertextBox .valueBox{color:#969799;}
.mainSmallTaskListBox .defaultBox{font-size:14px;line-height:24px;padding:10px 15px;border-bottom:1px solid #eee;display:flex;}
.mainSmallTaskListBox .defaultBox .titleBox{flex:1;}
.mainSmallTaskListBox .defaultBox .valueBox{flex:2;text-align:right;color:#969799;}
.mainSmallTaskListBox .defaultBox.picBox .valueBox img{width:120px;height:80px;display:block;float:right;}
.mainSmallTaskListBox .consumeBox .van-cell__value{flex:2;}
.mainSmallTaskListBox .consumeBox .van-cell__value .van-field{padding:0;}
</style>
