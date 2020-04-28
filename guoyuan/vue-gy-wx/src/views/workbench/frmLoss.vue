<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainTopNoneBox"></div>
        <div class="mainEstimateItemBox">
            <van-cell title="生产编号" >{{ frmLossInfo.pro_number }}</van-cell>
            <van-cell title="开始时间" >{{ frmLossInfo.pro_start }}</van-cell>
            <van-cell title="生产周期" >{{ frmLossInfo.pro_day }}天</van-cell>
            <van-cell title="商品品类" >{{ frmLossInfo.cla_name }}</van-cell>
            <van-cell title="商品名称" >{{ frmLossInfo.goo_name }}</van-cell>
            <van-cell title="基地面积" >{{ frmLossInfo.dis_unit }}亩</van-cell>
            <van-cell title="基地砧木" >{{ frmLossInfo.zm }}</van-cell>
            <van-cell title="基地芽枝" >{{ frmLossInfo.yz }}</van-cell>
            <van-cell title="报损数量" required>
                <van-field v-model="frmLossForm.loss" placeholder="请输入数量" input-align="right" clearable/>
            </van-cell>
            <van-cell title="损耗原因" required>
                <van-field v-model="frmLossForm.case" placeholder="请输入原因内容" type="textarea" autosize input-align="right" clearable/>
            </van-cell>
            <div class="tipsBox">水果损耗量：不得大于预估产量，仅统计已套袋的水果的损耗量，此损耗不会扣除您的农资库存</div>
        </div>
        <div class="mainSubmitBox"><van-button @click="onSubmitForm" type="info" size="large">提交</van-button></div>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId,getBaseId } from '@/utils/auth'
import { validateNumber } from '@/utils/validate'
import { benchLoss,benchAddLoss } from '@/api/workbench'
export default {
    data(){
        return{
            title:'生产报损',
            showback:true,
            showmy:false,
            // api_token:'',
            //基地信息
            frmLossInfo:{},
            //报损信息
            frmLossForm:{
                pro_id:'',
                goo_id:'',
                cla_id:'',
                loss:'',
                case:'',
            },
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.frmLossInfoBtn();
    },
    methods: {
        //基地信息
        frmLossInfoBtn(){
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
            benchLoss(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                // console.log(success);
                if(suc.code == 200){
                    this.frmLossInfo = suc.data;
                    this.agrNameInfo = suc.data.agr_info;
                    this.frmLossForm.pro_id = suc.data.pro_id;
                    this.frmLossForm.goo_id = suc.data.goo_id;
                    this.frmLossForm.cla_id = suc.data.cla_id;
                    // console.log(this.frmLossInfo);
                }else{

                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail('信息获取失败，请稍后重试!');
            })
        },
        //提交
        onSubmitForm(){
            if(this.frmLossForm.loss == '' || this.frmLossForm.case == ''){
                this.$toast.fail('报损数量和报损原因不能为空');
                return false;
            }
            const num = validateNumber(this.frmLossForm.loss);
            if(!num){
                this.$toast.fail('数量只能为正数数字');
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
            const data = this.frmLossForm;
            data.base_id = getBaseId();
            // data.api_token = this.api_token;
            benchAddLoss(data).then(success => {
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
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail('生产报损提交失败，请稍后重试!');
            })
        },
    }
}
</script>
<style scoped>
.mainTopNoneBox{height:48px;}
.mainEstimateItemBox .van-field{padding:0;}
.mainEstimateItemBox .van-cell__value{flex:2;}
.mainEstimateItemBox .tipsBox{font-size:14px;padding:10px 10px 0 10px;color:#f00;}
.mainSubmitBox{padding:20px 10px;}
.mainSubmitBox .van-button--info{background-color:#10b269;border:1px solid #10b269;}
</style>