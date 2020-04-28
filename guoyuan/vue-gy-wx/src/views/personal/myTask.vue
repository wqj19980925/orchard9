<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <van-pull-refresh v-if="myStackListInfo != ''" v-model="isLoading" @refresh="onRefresh" class="mainPersonalBox">
            <ul class="mainTaskListBox">
                <li v-for="item in myStackListInfo" :key="item.index">
                    <div class="nameBox">任务名称：{{ item.task_name }}</div>
                    <div class="disNameBox">任务区域：{{ item.dis_name }}</div>
                    <div class="timeBox">发布时间：{{ item.task_issue_time }}</div>
                    <div class="numBox">生产编号：{{ item.pro_number }}</div>
                    <div class="stateBox">{{ taskType[item.is_finish-1].state }}</div>
                    <div class="btnBox" @click="goTaskBtn(item.pro_id,item.task_id,item.base_id)">查看任务</div>
                </li>
            </ul>
        </van-pull-refresh>
        <van-pull-refresh v-if="myStackListInfo == ''" v-model="isLoading" @refresh="onRefresh" class="mainInfoNoneBox">
            <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
            <div class="tetBox">暂无任务相关信息</div>
        </van-pull-refresh>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,setproId,setTaskId,setBaseId } from '@/utils/auth'
import { mySelfMyStack } from '@/api/personal'
export default {
    data(){
        return{
            title:'我的任务',
            showback:true,
            showmy:false,
            // api_token:'',
            isLoading:false,
            myStackListInfo:[],
            taskType:[
                {
                    value:1,
                    state:'已完成'
                },{
                    value:2,
                    state:'未完成'
                }
            ],
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.myStackInfoBtn();
    },
    methods: {
        //任务
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
            mySelfMyStack(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data
                // console.log(suc);
                if(suc.code == 200){
                    this.myStackListInfo = suc.data;
                    // console.log(this.myStackListInfo);
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
        //查看
        goTaskBtn(pId,tId,bId){
            setproId(pId);
            setTaskId(tId);
            setBaseId(bId);
            this.$router.togo('/home/personal/task/detail');
        },
        //下拉刷新
        onRefresh() {
            setTimeout(() => {
                this.myStackInfoBtn();//列表
                this.$toast.success('刷新成功');
                this.isLoading = false;
            }, 500);
        },
    }
}
</script>
<style scoped>
.mainPersonalBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainTaskListBox li{background-color:#fff;margin-top:10px;padding:10px 15px;padding-right:100px;position:relative;font-size:14px;}
.mainTaskListBox li .nameBox{font-size:16px;color:#333;line-height:20px;padding:10px 0;}
.mainTaskListBox li .stateBox{position:absolute;top:20px;right:15px;color:#f00;}
.mainTaskListBox li .btnBox{position:absolute;bottom:10px;right:15px;padding:0 10px;background-color:#10b269;color:#fff;font-size:12px;line-height:32px;height:32px;border-radius:2px;}

.mainInfoNoneBox {padding:100px 0;text-align:center;}
.mainInfoNoneBox .picBox{width:200px;margin:0 auto;}
.mainInfoNoneBox .picBox img{width:100%;height:auto;}
.mainInfoNoneBox .tetBox{font-size:14px;line-height:20px;padding:20px 0;}
</style>
