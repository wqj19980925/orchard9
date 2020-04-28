<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div v-if="mainInfoLoading" class="mainMyBaseListBox">
            <ul class="mainListInfoItemBox">
                <li v-for="item in mybaseList" :key="item.index" @click="baseDetail(item.far_id)">
                    <div class="baseBox">{{ item.base_name }}</div>
                    <div class="nameBox">农户姓名：{{ item.far_name}}</div>
                    <div class="phoneBox">联系电话：{{ item.far_mobile }}</div>
                    <div class="iconBox"><van-icon name="arrow" /></div>
                </li>
            </ul>
        </div>
        <div v-if="noInfoLoading" class="mainInfoNoneBox">
            <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
            <div class="tetBox">暂无基地相关信息</div>
        </div>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,setBaseId } from '@/utils/auth'
import { validateNumber } from '@/utils/validate'
import { mybaseIndex } from '@/api/myBase'
export default {
    data(){
        return{
            title:'我的基地',
            showback:true,
            showmy:false,
            // api_token:'',
            mainInfoLoading:false,//页面内容
            noInfoLoading:false,//暂无信息
            mybaseList:[],//基地列表
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.myBaseListBtn();
    },
    methods: {
        myBaseListBtn(){
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
            mybaseIndex(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                this.mybaseList = [];
                if(suc.code == 200){
                    // console.log('suc',suc);
                    if(suc.data != ''){
                        this.mybaseList = suc.data;
                        this.noInfoLoading = false;
                        this.mainInfoLoading = true;
                    }else{
                        this.noInfoLoading = true;
                        this.mainInfoLoading = false;
                    }
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("基地列表请求失败，请稍后重试");
                // console.log('err',err);
            });
        },
        // 
        baseDetail(val){
            setBaseId(val);
            this.$router.togo('/home/myBase/detail');
        },
        
    }
}
</script>
<style scoped>
.mainMyBaseListBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainInfoNoneBox {padding:100px 0;text-align:center;}
.mainInfoNoneBox .picBox{width:200px;margin:0 auto;}
.mainInfoNoneBox .picBox img{width:100%;height:auto;}
.mainInfoNoneBox .tetBox{font-size:14px;line-height:20px;padding:20px 0;}
.mainListInfoItemBox li{padding:10px;margin-bottom:14px;background-color:#fff;font-size:14px;line-height:24px;position:relative;}
.mainListInfoItemBox li .baseBox{font-size:16px;color:#333;}
.mainListInfoItemBox li .iconBox{width:40px;height:40px;position:absolute;top:50%;right:0px;margin-top:-20px;padding:8px 0;}
</style>