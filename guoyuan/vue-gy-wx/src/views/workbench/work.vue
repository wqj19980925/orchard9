<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainTopHeaderNoneBox"></div>
        <!-- 标签 -->
        <div class="mainLabelItemBox" v-if="mainInfoLoading">
            <ul class="itemBox">
                <li v-for="(item,index) in labelNameInfo" :class="item.fla_state ? 'show' : ''" :key="index" @click="labelInfoQueryBtn(item.fla_id)">{{ item.fla_name }}</li>
            </ul>
        </div>
        <!-- 标签信息 -->
        <div class="mainLabelInfoBox" v-if="mainInfoLoading">
            <van-cell v-for="(item,index) in labelListInfo" :key="index" :title="item.tem_title" is-link @click="labelInfoBtn(item)" />
            <div v-if="noInfoLoading02" class="mainInfoNoneBox">
                <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
                <div class="tetBox">当前标签暂无相关信息</div>
            </div>
        </div>
        <div v-if="noInfoLoading" class="mainInfoNoneBox">
            <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
            <div class="tetBox">当前标签暂无相关信息</div>
        </div>
        <!-- 溯源信息 -->
        <van-popup v-model="labelDetailShow" position="bottom" class="mainLabelDetailPopupBox">
            <van-nav-bar :title="labelDetailTitle" left-text="返回" right-text="完成" left-arrow @click-left="labelDetailShow = false,labelDetailInfo = []" @click-right="onSubmitForm"/>
            <ul class="mainDetailInfoBox">
                <li v-for="item in labelDetailInfo" :key="item.index">
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
import { getToken,getproId,getBaseId,getAdmName } from '@/utils/auth'
import { validateNumber } from '@/utils/validate'
import { benchLabel,benchInfo } from '@/api/workbench'
import { myselfConsume } from '@/api/personal'
export default {
    data(){
        return{
            title:'工作台',
            showback:true,
            showmy:false,
            // api_token:'',
            mainInfoLoading:false,//页面内容
            noInfoLoading:false,//暂无标签
            noInfoLoading02:false,//暂无标签信息
            //标签信息
            labelNameInfo:[],
            labelListInfo:[],
            labelDetailShow:false,
            labelDetailInfo:[],
            labelDetailTitle:'',
            baseUrl:'',
            location:'',
            myMaterialInfo:[],//物资列表
            formData:{},//提交表单
            stockName:'库存：',
            userLoginName:'',//当前登录用户姓名
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.labelQueryBtn();
        const url = process.env.BASE_API;
        this.baseUrl = url.replace('/public/', '/');
        this.userLoginName = getAdmName();
        this.getCurrentCity();//定位
    },
    methods: {
        //标签名称
        labelQueryBtn(){
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
            data.type = 1;
            benchLabel(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                // console.log(suc);
                if(suc.code == 200){
                    this.labelNameInfo = [];
                    if(suc.data != ''){
                        for(let i in suc.data){
                            var state = false;
                            if(i == 0){
                                state = true;
                            }
                            this.labelNameInfo.push({
                                fla_id : suc.data[i].fla_id,
                                fla_name : suc.data[i].fla_name,
                                fla_state : state
                            })
                        }
                        // console.log(this.labelNameInfo);
                        this.labelInfoQueryBtn(suc.data[0].fla_id);
                        this.mainInfoLoading = true;
                        this.noInfoLoading = false;
                    }else{
                        this.mainInfoLoading = false;
                        this.noInfoLoading = true;
                    }
                    this.myMaterialInfoBtn();//物资列表
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail('标签列表获取失败，请稍后重试!');
                return false;
            })
        },
        //标签信息
        labelInfoQueryBtn(id){
            for(let i in this.labelNameInfo){
                if(id == this.labelNameInfo[i].fla_id){
                    this.labelNameInfo[i].fla_state = true;
                    this.formData.fla_id = this.labelNameInfo[i].fla_id;
                }else{
                    this.labelNameInfo[i].fla_state = false;
                }
            }
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
            data.type = 2;
            data.fla_id = id;
            benchLabel(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                // console.log(suc);
                if(suc.code == 200){
                    if(suc.data.length != 0){
                        this.labelListInfo = suc.data;
                        // this.mainInfoLoading = true;
                        this.noInfoLoading = false;
                        this.noInfoLoading02 = false;
                    }else{
                        this.labelListInfo = [];
                        // this.mainInfoLoading = false;
                        this.noInfoLoading02 = true;
                    }
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail('标签信息获取失败，请稍后重试!');
                return false;
            })
        },
        //标签信息 溯源信息
        labelInfoBtn(val){
            // console.log('溯源',JSON.parse(val.tem_content));
            this.labelDetailInfo = JSON.parse(val.tem_content)
            this.labelDetailTitle = val.tem_title
            this.formData.tem_title = val.tem_title;
            this.formData.tem_id = val.tem_id;
            this.formData.fom_id = val.fom_id;
            for(let i in this.labelDetailInfo){
                if(this.labelDetailInfo[i].type == 15 && this.labelDetailInfo[i].value.type == 1){
                    var nId = this.labelDetailInfo[i].value.n_id;
                    var f = true;
                    for(let a in this.myMaterialInfo){
                        var agrId = this.myMaterialInfo[a].agr_id
                        if(nId == agrId){
                            this.labelDetailInfo[i].stockNum = this.myMaterialInfo[a].fma_num;
                            this.labelDetailInfo[i].value.number = '';
                            f = false;
                            break;
                        }
                    }
                    if(f){
                        this.labelDetailInfo[i].stockNum = 0;
                        this.labelDetailInfo[i].value.number = '';
                    }
                }
            }
            this.formData.tem_content = this.labelDetailInfo;
            this.labelDetailShow = true;
            // console.log(this.labelDetailInfo);
        },
        //提交
        onSubmitForm(){
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
                this.formData.base_id = getBaseId();
                // this.formData.api_token = this.api_token;
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
                benchInfo(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    // console.log(suc);
                    if(suc.code == 200){
                        this.$toast.success(suc.data);
                        var this_ = this;
                        setTimeout(function(){
                            this_.labelDetailShow = false;
                            this_.myMaterialInfoBtn();
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
            }).catch(() => {
                this.$toast.success("取消提交");
                return false;
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
.mainLabelItemBox{width:100px;background-color:#f5f5f5;position:fixed;top:48px;left:0;bottom:0;overflow-y:auto;font-size:14px;}
.mainLabelItemBox .itemBox{padding-top:10px;}
.mainLabelItemBox .itemBox li{min-height:60px;padding:20px 10px;border-left:4px solid #f5f5f5;border-radius:4px 0 0 4px;}
.mainLabelItemBox .itemBox li.show{background-color:#fff;border-left:4px solid #10b269;}
.mainLabelInfoBox{position:fixed;top:48px;left:100px;right:0;bottom:0;overflow-y:auto;}
.mainInfoNoneBox {padding:100px 0;text-align:center;}
.mainInfoNoneBox .picBox{width:200px;margin:0 auto;}
.mainInfoNoneBox .picBox img{width:100%;height:auto;}
.mainInfoNoneBox .tetBox{font-size:14px;line-height:20px;padding:20px 0;}
.mainLabelDetailPopupBox{width:100%;height:60%;}

.mainDetailInfoBox{position:fixed;top:46px;left:0;right:0;bottom:0;overflow-y:auto;}
.mainDetailInfoBox .textBox{border-bottom:1px solid #eee;}
.mainDetailInfoBox .textBox .van-cell__value{flex:2;}
.mainDetailInfoBox .hypertextBox{font-size:14px;line-height:24px;padding:10px 15px;border-bottom:1px solid #eee;}
.mainDetailInfoBox .hypertextBox .titleBox{padding-bottom:6px;}
.mainDetailInfoBox .hypertextBox .valueBox{color:#969799;}
.mainDetailInfoBox .defaultBox{font-size:14px;line-height:24px;padding:10px 15px;border-bottom:1px solid #eee;display:flex;}
.mainDetailInfoBox .defaultBox .titleBox{flex:1;}
.mainDetailInfoBox .defaultBox .valueBox{flex:2;text-align:right;color:#969799;}
.mainDetailInfoBox .defaultBox.picBox .valueBox img{width:120px;height:80px;display:block;float:right;}
.mainDetailInfoBox .consumeBox .van-cell__value{flex:2;}
.mainDetailInfoBox .consumeBox .van-cell__value .van-field{padding:0;}
</style>