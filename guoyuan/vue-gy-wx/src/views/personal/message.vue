<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <van-pull-refresh v-if="newsListInfo != ''" v-model="isLoading" @refresh="onRefresh" class="mainPersonalBox">
            <ul class="mainNewsListBox">
                <li v-for="item in newsListInfo" :key="item.index" @click="newsDetailBtn(item.info_id)">
                    <div :class="item.info_state == 1 ? 'titleBox' : 'titleBox stateBox'">【{{ newsTypeInfo[item.info_type-1].state }}】{{ item.info_title }}</div>
                    <div class="timeBox">{{ item.info_issue_time }}</div>
                    <span class="iconBox" v-if="item.info_state == 1">·</span>
                </li>
            </ul>
        </van-pull-refresh>
        <van-pull-refresh v-if="newsListInfo == ''" v-model="isLoading" @refresh="onRefresh" class="mainInfoNoneBox">
            <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
            <div class="tetBox">暂无系统消息相关信息</div>
        </van-pull-refresh>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,setnewsId } from '@/utils/auth'
import { mySelfNews } from '@/api/personal'
export default {
    data(){
        return{
            title:'系统消息',
            showback:true,
            showmy:false,
            // api_token:'',
            newsListInfo:[],
            isLoading: false,
            newsTypeInfo:[
                {
                    value:"1",
                    state:"信息通知"
                },{
                    value:"2",
                    state:"病虫害预警"
                }
            ],
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.newsInfoBtn();
    },
    methods: {
        //系统消息
        newsInfoBtn(){
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
            mySelfNews(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data
                // console.log(suc);
                if(suc.code == 200){
                    this.newsListInfo = [];
                    if(suc.data.length > 0){
                        this.newsListInfo = suc.data;
                    }
                    // console.log(this.newsListInfo);
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("系统信息请求失败，请稍后重试");
            });
        },
        //消息详情
        newsDetailBtn(val){
            setnewsId(val);
            this.$router.togo('/home/personal/message/detail');
        },
        //下拉刷新
        onRefresh() {
            setTimeout(() => {
                this.newsInfoBtn();//基地列表
                this.$toast.success('刷新成功');
                this.isLoading = false;
            }, 500);
        },
    }
}
</script>
<style scoped>
.mainPersonalBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainNewsListBox{padding:0 10px;}
.mainNewsListBox li{padding:20px;border-bottom:1px solid #eee;position:relative;}
.mainNewsListBox li .titleBox{font-size:14px;line-height:20px;padding-bottom:10px;color:#333;}
.mainNewsListBox li .titleBox.stateBox{color:#999;}
.mainNewsListBox li .timeBox{font-size:14px;line-height:16px;color:#999;padding-left:8px;}
.mainNewsListBox li .iconBox{display:block;width:10px;height:10px;font-size:30px;line-height:10px;color:#f00;position:absolute;top:20px;left:4px;}

.mainInfoNoneBox {padding:100px 0;text-align:center;}
.mainInfoNoneBox .picBox{width:200px;margin:0 auto;}
.mainInfoNoneBox .picBox img{width:100%;height:auto;}
.mainInfoNoneBox .tetBox{font-size:14px;line-height:20px;padding:20px 0;}

</style>
