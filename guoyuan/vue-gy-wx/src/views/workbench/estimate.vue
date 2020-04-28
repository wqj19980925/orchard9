<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainTopNoneBox"></div>
        <div class="mainEstimateItemBox">
            <van-cell title="生产编号" >{{ estimateInfo.pro_number }}</van-cell>
            <van-cell title="商品品类" >{{ estimateInfo.cla_name }}</van-cell>
            <van-cell title="商品名称" >{{ estimateInfo.goo_name }}</van-cell>
            <van-cell title="农资分类" >{{ estimateInfo.acl_name }}</van-cell>
            <van-cell title="农资名称" is-link required @click="agrNameBtn">{{ estimateInfo.agr_name }}</van-cell>
            <van-cell title="农资库存" >{{ estimateInfo.agr_kc }}</van-cell>
            <van-cell title="预估产量" required>
                <van-field v-model="estimateForm.estimate" placeholder="请输入预估数量" input-align="right" clearable/>
            </van-cell>
            <div class="tipsBox">预估数量 = 这个生产编号下所有果树上套袋的数量<br>注：预估数量不能大于农资库存量</div>
            <div class="mainSubmitBox"><van-button @click="onSubmitForm" type="info" size="large">提交</van-button></div>
        </div>
        <van-popup v-model="showPicker" position="bottom">
            <van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
        </van-popup>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId,getBaseId } from '@/utils/auth'
import { validateNumber } from '@/utils/validate'
import { benchEstimate,benchAddEstimate } from '@/api/workbench'
export default {
    data(){
        return{
            title:'产量预估',
            showback:true,
            showmy:false,
            // api_token:'',
            //基地信息
            estimateInfo:{},
            //预估信息
            estimateForm:{
                pro_id:'',
                agr_id:'',
                estimate:'',
            },
            showPicker:false,//农资选择器弹出
            calNameInfo:['水果种植套袋'],//农资分类
            agrNameInfo:[],//农资名称
            agrNameIndex:0,
            calNameIndex:0,
            columns: [],//选择器数组
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.estimateInfoBtn();
    },
    methods: {
        //基地信息
        estimateInfoBtn(){
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
            benchEstimate(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                // console.log(success);
                if(suc.code == 200){
                    this.estimateInfo = suc.data;
                    this.agrNameInfo = suc.data.agr_info;
                    this.estimateForm.pro_id = suc.data.pro_id;
                    this.estimateForm.agr_id = suc.data.agr_id;
                    this.estimateForm.base_id = suc.data.base_id;
                    // console.log(this.estimateForm);
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
        //选择农资名称
        agrNameBtn(){
            var arr = []
            for (let i in this.agrNameInfo) {
                if(this.agrNameInfo[i].agr_id == this.estimateInfo.agr_id){
                    this.agrNameIndex = Number(i);
                }
                arr.push(this.agrNameInfo[i].agr_name);
            }
            arr.defaultIndex = this.agrNameIndex
            // console.log(arr);
            this.columns = arr,
            this.showPicker = true;
        },
        //农资名称  确认选择
        onConfirm(val,index) {
            this.agrNameIndex = index;
            this.estimateInfo.agr_name = val;
            this.estimateForm.agr_id = this.agrNameInfo[index].agr_id
            this.estimateInfo.agr_kc = this.agrNameInfo[index].agr_kc
            this.showPicker = false;
            // console.log(this.estimateForm)
        },
        //提交
        onSubmitForm(){
            if(this.estimateForm.estimate == ''){
                this.$toast.fail('数量不能为空');
                return false;
            }
            const num = validateNumber(this.estimateForm.estimate);
            if(!num){
                this.$toast.fail('数量只能为正数数字');
                return false;
            }
            if(this.estimateForm.estimate > this.estimateInfo.agr_kc){
                this.$toast.fail('预估产量不能大于库存量');
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
            const data = this.estimateForm;
            data.base_id = getBaseId();
            // data.api_token = this.api_token;
            benchAddEstimate(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                // console.log(suc);
                if(suc.code == 200){
                    this.$toast.success(suc.data);
                    var this_ = this;
                    setTimeout(function(){
                        this_.$router.goBack();
                    },1000);
                }else{
                    // console.log(suc.data);
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail('产量预估提交失败，请稍后重试!');
            })
        },
    }
}
</script>
<style scoped>
.mainTopNoneBox{height:48px;}
.mainEstimateItemBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;}
.mainEstimateItemBox .van-field{padding:0;}
.mainEstimateItemBox .van-cell__value{flex:2;}
.mainEstimateItemBox .tipsBox{font-size:14px;text-align:center;padding-top:10px;color:#f00;padding:0 10px;}
.mainSubmitBox{padding:20px 10px;}
.mainSubmitBox .van-button--info{background-color:#10b269;border:1px solid #10b269;}
</style>