<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <van-pull-refresh class="mainPersonalBox" v-model="isLoading" @refresh="onRefresh" v-if="taskInfo != ''">
            <van-panel class="mainTaskListBox" :title="item.task_name" :desc="item.task_adm_name +' '+ item.task_issue_time" :status="taskType[item.task_state-2].state" v-for="item in taskInfo" :key="item.index">
                <div class="infoBox">{{ item.task_content }}</div>
                <div slot="footer">
                    <van-button size="small" type="danger" @click="goTaskBtn(item.task_id)">查看任务</van-button>
                </div>
            </van-panel>
        </van-pull-refresh>
        <van-pull-refresh class="mainInfoNoneBox" v-model="isLoading" @refresh="onRefresh" v-if="taskInfo == ''">
            <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
            <div class="tetBox">当前暂无农事任务</div>
        </van-pull-refresh>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId,setTaskId } from '@/utils/auth'
import { validateNumber } from '@/utils/validate'
import { benchStack } from '@/api/workbench'
export default {
    data(){
        return{
            title:'农事任务',
            showback:true,
            showmy:false,
            // api_token:'',
            isLoading: false,
            //任务信息
            taskInfo:[],
            //提交信息
            taskForm:{
                pro_id:'',
                goo_id:'',
                cla_id:'',
                loss:'',
                case:'',
            },
            taskType:[
                {
                    value:1,
                    state:'未完成'
                },{
                    value:2,
                    state:'加急'
                }
            ],
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.taskInfoBtn();
    },
    methods: {
        //任务信息
        taskInfoBtn(){
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
            benchStack(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                // console.log(suc);
                if(suc.code == 200){
                    if(suc.data.length != 0){
                        this.taskInfo = suc.data;
                    }else{
                        this.$toast.fail('暂无农事任务');
                        return false;
                    }
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail('信息获取失败，请稍后重试!');
            })
        },
        //查看任务
        goTaskBtn(tId){
            setTaskId(tId);
            this.$router.togo('/home/task/detail');
        },
        //下拉刷新
        onRefresh() {
            setTimeout(() => {
                this.taskInfoBtn();//列表
                this.$toast.success('刷新成功');
                this.isLoading = false;
            }, 500);
        },
    }
}
</script>
<style scoped>
.mainPersonalBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}

.mainTaskListBox{background-color:#fff;margin-top:10px;font-size:14px;}
.mainTaskListBox .van-cell__title{flex:3;}
.mainTaskListBox .infoBox{font-size:14px;line-height:24px;padding:10px 15px;}
.mainTaskListBox .van-button--danger{background-color:#10b269;border:1px solid #10b269;}

.mainInfoNoneBox {padding:100px 0;text-align:center;position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainInfoNoneBox .picBox{width:200px;margin:0 auto;}
.mainInfoNoneBox .picBox img{width:100%;height:auto;}
.mainInfoNoneBox .tetBox{font-size:14px;line-height:20px;padding:20px 0;}
</style>