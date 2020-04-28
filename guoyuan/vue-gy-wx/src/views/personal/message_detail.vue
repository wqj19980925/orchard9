<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainPersonalBox" v-if="newsInfoShow">
            <h1 class="mainTitleBox">{{ newsDetailInfo.info_type }}：{{ newsDetailInfo.info_title }}</h1>
            <div class="timeAuthorBox">{{ newsDetailInfo.info_adm_name }}   {{ newsDetailInfo.info_issue_time }}</div>
            <div class="contentBox" v-html="newsDetailInfo.info_content"></div>
        </div>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getnewsId } from '@/utils/auth'
import { mySelfRead } from '@/api/personal'
export default {
    data(){
        return{
            title:'消息详情',
            showback:true,
            showmy:false,
            newsInfoShow:false,
            // api_token:'',
            newsDetailInfo:{
                info_type:'',
                info_title:'',
                info_adm_name:'',
                info_issue_time:'',
                info_content:'',
            },
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
        this.newsDetailInfoBtn();
    },
    methods: {
        //消息详情
        newsDetailInfoBtn(){
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
            data.info_id = getnewsId();
            mySelfRead(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data
                // console.log(suc);
                if(suc.code == 200){
                    if(suc.date_info.info_type == 1){
                        this.newsDetailInfo.info_type = "信息通知";
                    }else{
                        this.newsDetailInfo.info_type = "病虫害预警";
                    }
                    this.newsDetailInfo.info_title = suc.date_info.info_title
                    this.newsDetailInfo.info_adm_name = suc.date_info.info_adm_name
                    this.newsDetailInfo.info_issue_time = suc.date_info.info_issue_time
                    this.newsDetailInfo.info_content = suc.date_info.info_content.replace(/<img class="wscnph"/g,'<img class="wscnph" style="width:100%;"');
                    this.newsInfoShow = true;
                    // console.log(this.newsDetailInfo);
                }else{
                    this.newsInfoShow = false;
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("消息详情请求失败，请稍后重试");
            });
        },
    }
}
</script>
<style scoped>
.mainPersonalBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainTitleBox{font-size:24px;padding:20px;text-align:center;}
.timeAuthorBox{font-size:14px;line-height:20px;text-align:center;}
.contentBox{padding:20px;font-size:14px;}
.contentBox p{margin:10px 0;}
.wscnph{width:100%;height:auto;}
</style>
