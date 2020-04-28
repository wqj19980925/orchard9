<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainTopNoneBox"></div>
        <div class="mainHarvestInfoBox">
            <van-cell title="生产编号" >{{ harvestInfo.pro_number }}</van-cell>
            <van-cell title="开始时间" >{{ harvestInfo.pro_start }}</van-cell>
            <van-cell title="生产周期" >{{ harvestInfo.pro_day }}天</van-cell>
            <van-cell title="商品品类" >{{ harvestInfo.cla_name }}</van-cell>
            <van-cell title="商品名称" >{{ harvestInfo.goo_name }}</van-cell>
            <van-cell title="基地面积" >{{ harvestInfo.dis_unit }}亩</van-cell>
            <van-cell title="基地砧木" >{{ harvestInfo.zm }}</van-cell>
            <van-cell title="基地芽枝" >{{ harvestInfo.yz }}</van-cell>
        </div>
        <div class="mainHarvestItemBox">
            <van-cell title="收获数量" ><van-field v-model="harvestForm.reap_num" placeholder="请输入收获数量"  input-align="right" clearable/></van-cell>
            <van-cell title="参与员工" >
                <van-checkbox-group class="yNameBox" v-model="harvestForm.off_person">
                    <van-checkbox v-for="(item, index) in harvestInfo.off" :key="index" :name="item.off_id" checked-color="#10b269">{{ item.off_name }}-员工</van-checkbox>
                </van-checkbox-group>
                <van-checkbox-group class="yNameBox" v-model="harvestForm.tem_person">
                    <van-checkbox v-for="(item, index) in harvestInfo.tem" :key="index" :name="item.tem_id" checked-color="#10b269">{{ item.tem_name }}-临时工</van-checkbox>
                </van-checkbox-group>
            </van-cell>
            <van-cell title="报损数量" ><van-field v-model="harvestForm.loss" placeholder="请输入报损数量" input-align="right" clearable/></van-cell>
            <van-cell title="报损原因" ><van-field v-model="harvestForm.case" placeholder="请输入报损原因" input-align="right" clearable/></van-cell>
            <van-cell title="一级商品" ><van-field v-model="harvestForm.one_num" placeholder="请输入商品数量(选填)" input-align="right" clearable/></van-cell>
            <van-cell title="二级商品" ><van-field v-model="harvestForm.two_num" placeholder="请输入商品数量(选填)" input-align="right" clearable/></van-cell>
            <van-cell title="三级商品" ><van-field v-model="harvestForm.three_num" placeholder="请输入商品数量(选填)" input-align="right" clearable/></van-cell>
        </div>
        <!-- 弹框 -->
        <!-- <van-popup v-model="harvestshow" position="bottom" class="mainHarvestPopupBox">
            <van-nav-bar title="收获产物" left-text="返回" right-text="提交" left-arrow @click-left="harvestshow = false" @click-right="onSubmitForm"/>
            <div class="mainHarvestItemBox">
                <van-cell title="收获数量" ><van-field v-model="harvestForm.reap_num" placeholder="请输入收获数量"  input-align="right" clearable/></van-cell>
                <van-cell title="参与员工" >
                    <van-checkbox-group class="yNameBox" v-model="harvestForm.off_person">
                        <van-checkbox v-for="(item, index) in harvestInfo.off" :key="index" :name="item.off_id" checked-color="#10b269">{{ item.off_name }}-员工</van-checkbox>
                    </van-checkbox-group>
                    <van-checkbox-group class="yNameBox" v-model="harvestForm.tem_person">
                        <van-checkbox v-for="(item, index) in harvestInfo.tem" :key="index" :name="item.tem_id" checked-color="#10b269">{{ item.tem_name }}-临时工</van-checkbox>
                    </van-checkbox-group>
                </van-cell>
                <van-cell title="报损数量" ><van-field v-model="harvestForm.loss" placeholder="请输入报损数量" input-align="right" clearable/></van-cell>
                <van-cell title="报损原因" ><van-field v-model="harvestForm.case" placeholder="请输入报损原因" input-align="right" clearable/></van-cell>
                <van-cell title="一级商品" ><van-field v-model="harvestForm.one_num" placeholder="请输入商品数量(选填)" input-align="right" clearable/></van-cell>
                <van-cell title="二级商品" ><van-field v-model="harvestForm.two_num" placeholder="请输入商品数量(选填)" input-align="right" clearable/></van-cell>
                <van-cell title="三级商品" ><van-field v-model="harvestForm.three_num" placeholder="请输入商品数量(选填)" input-align="right" clearable/></van-cell>
            </div>
        </van-popup> -->
        <div class="mainSubmitBox"><van-button @click="onSubmitForm" type="info" size="large">提交</van-button></div>
        <!-- <div class="mainSubmitBox"><van-button @click="harvestshow=true" type="info" size="large">我要提交</van-button></div> -->
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId } from '@/utils/auth'
import { validateNumber } from '@/utils/validate'
import { benchReap,benchAddReap } from '@/api/workbench'
export default {
    data(){
        return{
            title:'收获产物',
            showback:true,
            showmy:false,
            // api_token:'',
            //基地信息
            harvestInfo:{},
            //收获信息
            harvestForm:{
                pro_id:'',
                dis_id:'',
                cla_id:'',
                goo_id:'',
                reap_num:'',
                off_person:[],
                tem_person:[],
                loss:'',
                case:'',
                one_num:'',
                two_num:'',
                three_num:'',
                goo_name:''
            },
            harvestshow:false,
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.harvestInfoBtn();
    },
    methods: {
        //基地信息
        harvestInfoBtn(){
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
            benchReap(data).then(success => {
                const suc = success.data;
                // console.log(success);
                if(suc.code == 200){
                    this.harvestInfo = suc.data;
                    // console.log(this.harvestInfo);
                    this.harvestForm.dis_id = suc.data.dis_id;
                    this.harvestForm.goo_name = suc.data.goo_name;
                    this.harvestForm.cla_id = suc.data.cla_id;
                    this.harvestForm.goo_id = suc.data.goo_id;
                    this.harvestForm.base_id = suc.data.base_id;
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
                this.$toast.clear();//关闭加载层
            })
            .catch(err => {
                this.$toast.fail('信息获取失败，请稍后重试!');
                this.$toast.clear();//关闭加载层
            })
        },
        //提交
        onSubmitForm(){
            if(this.harvestForm.reap_num == ''){
                this.$toast.fail('数量不能为空');
                return false;
            }
            if(this.harvestForm.loss != '' && this.harvestForm.loss != 0){
                const num2 = validateNumber(this.harvestForm.loss);
                if(!num2){
                    this.$toast.fail('报损数量只能为正数数字');
                    return false;
                }
                if(Number(this.harvestForm.loss) > Number(this.harvestForm.reap_num)){
                    this.$toast.fail('报损数量不能大于收获数量');
                    return false;
                }
                if(this.harvestForm.case == ''){
                    this.$toast.fail('请填写报损原因');
                    return false;
                }
            }
            const num = validateNumber(this.harvestForm.reap_num);
            if(!num){
                this.$toast.fail('数量只能为正数数字');
                return false;
            }
            if(this.harvestForm.one_num != ''){
                const numOne = validateNumber(this.harvestForm.one_num);
                if(!numOne){
                    this.$toast.fail('一级商品数量只能为正数数字');
                    return false;
                }
            }
            if(this.harvestForm.two_num != ''){
                const numTwo = validateNumber(this.harvestForm.two_num);
                if(!numTwo){
                    this.$toast.fail('二级商品数量只能为正数数字');
                    return false;
                }
            }
            if(this.harvestForm.three_num != ''){
                const numThree = validateNumber(this.harvestForm.three_num);
                if(!numThree){
                    this.$toast.fail('三级商品数量只能为正数数字');
                    return false;
                }
            }
            const mainNum = Number(this.harvestForm.one_num) + Number(this.harvestForm.two_num) + Number(this.harvestForm.three_num);
            if(mainNum > Number(this.harvestForm.reap_num) - Number(this.harvestForm.loss)){
                this.$toast.fail('品级数量总和不能大于收获数量减去报损数量');
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
            this.harvestForm.pro_id = getproId();
            const data = this.harvestForm;
            // data.api_token = this.api_token;
            if(this.harvestForm.loss == ''){
                data.loss = 0;
            }
            if(this.harvestForm.one_num == ''){
                data.one_num = 0;
            }
            if(this.harvestForm.two_num == ''){
                data.two_num = 0;
            }
            if(this.harvestForm.three_num == ''){
                data.three_num = 0;
            }
            benchAddReap(data).then(success => {
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
                    if(this.harvestForm.loss == 0){
                        this.harvestForm.loss = '';
                    }
                    if(this.harvestForm.one_num == 0){
                        this.harvestForm.one_num = '';
                    }
                    if(this.harvestForm.two_num == 0){
                        this.harvestForm.two_num = '';
                    }
                    if(this.harvestForm.three_num == 0){
                        this.harvestForm.three_num = '';
                    }
                }
                
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                if(this.harvestForm.loss == 0){
                    this.harvestForm.loss = '';
                }
                if(this.harvestForm.one_num == 0){
                    this.harvestForm.one_num = '';
                }
                if(this.harvestForm.two_num == 0){
                    this.harvestForm.two_num = '';
                }
                if(this.harvestForm.three_num == 0){
                    this.harvestForm.three_num = '';
                }
                this.$toast.fail('收获信息提交失败，请稍后重试!');
            })
        },
    }
}
</script>
<style scoped>
.mainTopNoneBox{height:48px;}
.mainHarvestInfoBox .van-cell__value{flex:2;}
.mainHarvestItemBox{border-top:14px solid #f5f5f5;}
/* .mainHarvestItemBox{position:fixed;top:46px;left:0;bottom:0;right:0;overflow-y:auto;} */
.mainHarvestItemBox .van-field{padding:0;}
.mainHarvestItemBox .van-cell__value{flex:2;}
.mainHarvestItemBox .yNameBox{display:inline-block;}
.mainHarvestItemBox .yNameBox .van-checkbox{display:inline-block;margin-right:10px;}

.mainSubmitBox{padding:20px 10px;}
.mainSubmitBox .van-button--info{background-color:#10b269;border:1px solid #10b269;}
.mainHarvestPopupBox{height:60%;}
</style>
