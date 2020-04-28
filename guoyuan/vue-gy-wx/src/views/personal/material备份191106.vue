<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <dt class="mainPersonalListTabBox"><span class="nameBox">物资名称</span><span>库存</span><span>归还中</span></dt>
        <van-pull-refresh v-if="myMaterialInfo != ''" v-model="isLoading" @refresh="onRefresh" class="mainPersonalBox">
            <ul>
                <li class="listInfoBox" v-for="item in myMaterialInfo" :key="item.index">
                    <span class="nameBox">{{ item.agr_name }}</span><span>{{ item.fma_num }}{{ agrUnit[item.agr_unit-1].state}}</span><span>{{ item.fma_lock }}</span>
                </li>
            </ul>
        </van-pull-refresh>
        <van-pull-refresh v-if="myMaterialInfo == ''" v-model="isLoading" @refresh="onRefresh" class="mainInfoNoneBox">
            <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
            <div class="tetBox">暂无系统消息相关信息</div>
        </van-pull-refresh>
        <div class="mainFooterMenuBox">
            <van-button type="default" @click="returnRecordBtn">归还记录</van-button>
            <van-button type="primary" @click="checkMaterialBtn">盘点物资</van-button>
            <van-button type="info" @click="getMaterialBtn">归还物资</van-button>
        </div>
        <!-- 盘点物资 -->
        <van-popup v-model="checkShow" position="right" class="mainCheckPopupBox">
            <van-nav-bar title="盘点物资" left-text="返回" right-text="完成" left-arrow @click-left="checkShow = false,checkInfo = []" @click-right="onSubmitBtn"/>
            <div class="checkListTabBox">
                <span class="nameBox">物资名称</span>
                <span class="stockBox">库存数量</span>
                <span class="numBox">剩余数量</span>
            </div>
            <ul class="checkListBox">
                <li v-for="item in checkInfo" :key="item.index">
                    <span class="nameBox">{{ item.fma_name }}</span>
                    <span class="stockBox">{{ item.fma_stock }}{{ agrUnit[item.agr_unit-1].state}}</span>
                    <span class="numBox"><van-field v-model="item.fma_num" placeholder="数量" input-align="center" /></span>
                </li>
            </ul>
        </van-popup>
        <!-- 归还记录 -->
        <van-popup v-model="recordShow" position="right" class="mainRecordPopupBox">
            <van-nav-bar title="归还记录" left-text="返回" left-arrow @click-left="recordShow = false" />
            <div v-if="recordInfo == ''" class="recordListNoneBox">
                <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
                <div class="txtBox">暂无归还记录</div>
            </div>
            <van-panel :title="item.rep_name" :desc="item.rec_createtime" :status="rec_state[item.rec_state-1].state" v-for="item in recordInfo.data" :key="item.index">
                <div slot="footer">
                    <van-button size="small" @click="returnDetailBtn(item.rec_id)">详情</van-button>
                    <van-button size="small" v-if="item.rec_state == 1" type="danger" @click="returnRecallBtn(item.rec_id)">撤回</van-button>
                </div>
            </van-panel>
            <van-popup v-model="recordDetailShow" position="bottom" class="mainrecordDetailBox">
                <van-nav-bar title="归还详情" left-text="返回" left-arrow @click-left="recordDetailShow = false" />
                <div class="listTabBox">
                    <span class="nameBox">物资名称</span>
                    <span>归还数量</span>
                    <span>实际归还</span>
                </div>
                <ul class="listItemBox">
                    <li v-for="item in recDetailInfo" :key="item.inex">
                        <span class="nameBox">{{ item.agr_name }}</span>
                        <span>{{ item.det_real_quantity }}</span>
                        <span>{{ item.det_real_actual }}</span>
                    </li>
                </ul>
            </van-popup>
        </van-popup>
        <!-- 归还物资 -->
        <van-popup v-model="getShow" position="right" class="mainCheckPopupBox">
            <van-nav-bar title="选择物资" left-text="返回" right-text="下一步" left-arrow @click-left="getShow=false" @click-right="onDowStepBtn"/>
            <div class="checkListTabBox">
                <span class="nameBox">物资名称</span>
                <span class="stockBox">库存数量</span>
                <span class="numBox">归还数量</span>
            </div>
            <ul class="checkListBox">
                <li v-for="item in getInfo" :key="item.index">
                    <span class="nameBox">{{ item.fma_name }}</span>
                    <span class="stockBox">{{ item.fma_stock }}</span>
                    <span class="numBox"><van-field v-model="item.fma_num" placeholder="数量" input-align="center" /></span>
                </li>
            </ul>
            <van-popup v-model="getLogisticsShow" position="right" class="mainCheckPopupBox">
                <van-nav-bar title="选择仓库和物流" left-text="返回" right-text="完成" left-arrow @click-left="getLogisticsShow=false" @click-right="onSubmitGetBtn"/>
                <div class="mainGetWareBox">
                    <van-cell title="物资接收方" :value="getSubmitFormInfo.rep_name" is-link required @click="storehouseBtn" />
                    <van-cell title="运输方式" :value="getSubmitFormInfo.wl_type_val" is-link required @click="logisticsModeBtn"/>
                    <van-cell-group class="formItemBox" v-if="getSubmitFormInfo.wl_type == 1">
                        <van-cell title="快递公司" :value="getSubmitFormInfo.wl_unit_name" is-link @click="logisticsBtn" required/>
                        <van-cell title="快递单号"  required><van-field v-model="getSubmitFormInfo.wl_courier" placeholder="多个单号以逗号隔开" input-align="right" type="textarea" autosize rows="1" /></van-cell>
                    </van-cell-group>
                    <van-cell-group class="formItemBox" v-if="getSubmitFormInfo.wl_type == 2 || getSubmitFormInfo.wl_type == 3">
                        <van-cell title="运输单位"><van-field v-model="getSubmitFormInfo.wl_unit" placeholder="请输入运输单位(选填)" input-align="right" type="textarea" autosize rows="1" /></van-cell>
                        <van-cell title="负责人" required><van-field v-model="getSubmitFormInfo.wl_user" placeholder="请输入联系人姓名" input-align="right" /></van-cell>
                        <van-cell title="联系电话" required><van-field v-model="getSubmitFormInfo.wl_tel" placeholder="请输入联系人手机号" input-align="right" /></van-cell>
                        <van-cell title="车牌号" ><van-field v-model="getSubmitFormInfo.wl_license" placeholder="多个车牌号以逗号隔开" input-align="right" /></van-cell>
                    </van-cell-group>
                </div>
                <van-popup v-model="showPicker" position="bottom">
                    <van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
                </van-popup>
            </van-popup>
        </van-popup>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId,getBaseId,getPriId } from '@/utils/auth'
import { validateNumber,phoneTest } from "@/utils/validate"
import { mySelfMaterials,mySelfCheck,mySelfRecord,mySelfRecall,mySelfGetWare,mySelfReturn } from '@/api/personal'
export default {
    data(){
        return{
            title:'我的物资',
            showback:true,
            showmy:false,
            // api_token:'',
            isLoading:false,
            //物资单位
            agrUnit:[
                {
                    state:'个'
                },{
                    state:'KG'
                }
            ],
            myMaterialInfo:[],
            checkShow:false,//盘点弹框
            checkInfo:[],
            recordShow:false,//归还记录
            recordInfo:[],
            getShow:false,//归还物资
            getInfo:[],
            getLogisticsShow:false,
            getFormInfo:[],
            getStorehouseInfo:[],//仓库列表
            getLogisticsInfo:[],//物流列表
            showPicker:false,
            columns:[],
            getStorLogis:0,
            storehouseIndex:0,
            logisticsIndex:0,
            logisticsModeIndex:0,
            getSubmitFormInfo:{
                agric:[],
                rep_id:'',
                rep_name:'',
                wl_type:'',
                wl_type_val:'',
                wl_unit:'',
                wl_unitid:'',
                wl_unit_name:'',
                wl_courier:'',
                wl_user:'',
                wl_tel:'',
                wl_license:''
            },
            //归还快递公司
            logisticsMode:[
                {
                    value:'1',
                    state:'快递公司'
                },{
                    value:'2',
                    state:'生产方配送'
                // },{
                //     value:'3',
                //     state:'收货方自提'
                // },{
                //     value:'4',
                //     state:'无物流信息'
                }
            ],
            //归还记录 状态
            rec_state:[
                {
                    value:'1',
                    state:'归还中'
                },{
                    value:'2',
                    state:'归还成功'
                },{
                    value:'3',
                    state:'归还异常'
                }
            ],
            //归还记录 详情
            recDetailInfo:[],
            recordDetailShow:false,
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        this.myMaterialInfoBtn();
        
    },
    methods: {
        //我的 物资列表
        myMaterialInfoBtn(){
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
            mySelfMaterials(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data
                // console.log(suc);
                if(suc.code == 200){
                    this.myMaterialInfo = suc.data;
                    // console.log(this.myMaterialInfo);
                    this.gainWareBtn(1);//仓库
                    this.gainWareBtn(2);//物流方式
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("物资列表请求失败，请稍后重试");
            });
        },
        //盘点物资 打开
        checkMaterialBtn(){
            if(this.myMaterialInfo == ''){
                this.$toast.fail('您没有物资，不能盘点');
                return false;
            }
            this.checkInfo = [];
            for(let i in this.myMaterialInfo){
                this.checkInfo.push({
                    fma_id:this.myMaterialInfo[i].fma_id,
                    fma_name:this.myMaterialInfo[i].agr_name,
                    fma_stock:this.myMaterialInfo[i].fma_num,
                    agr_unit:this.myMaterialInfo[i].agr_unit,
                    fma_num:''
                });
            }
            // console.log('this.checkInfo',this.checkInfo);
            this.checkShow = true;
        },
        //盘点物资 提交
        onSubmitBtn(){
            const agric = [];
            for(let i in this.checkInfo){
                if(this.checkInfo[i].fma_num != ''){
                    const num = validateNumber(this.checkInfo[i].fma_num);
                    if(!num){
                        this.$toast.fail('数量只能为正数数字');
                        return false;
                    }
                    agric.push({
                        fma_id:this.checkInfo[i].fma_id,
                        fma_num:this.checkInfo[i].fma_num,
                    });
                }
            }
            if(agric == ''){
                this.$toast.fail("您没有修改任何数据，不能提交");
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
            const data = {};
            // data.api_token = this.api_token;
            data.agric = agric;
            data.base_id = getBaseId();
            mySelfCheck(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                if(suc.code == 200){
                    this.$toast.success(suc.data);
                    this.checkShow = false;
                    this.myMaterialInfoBtn();
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("盘点请求失败，请稍后重试");
            });
        },
        //归还记录
        returnRecordBtn(){
            //打开加载层
            this.$toast.loading({
                mask:true,
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在加载'
            });
            const data = {};
            data.base_id = getBaseId();
            data.pri_id = getPriId();
            // data.api_token = this.api_token;
            mySelfRecord(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                // console.log(suc)
                if(suc.code == 200){
                    if(suc.data != ''){
                        this.recordInfo = suc.data;
                        // console.log('this.recordInfo',this.recordInfo);
                        this.recordShow = true;
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("归还记录请求失败，请稍后重试");
            });
        },
        //归还记录 撤回
        returnRecallBtn(val){
            this.$dialog.confirm({
                message: '确定要撤回归还物资'
            }).then(() => {
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
                data.rec_id = val;
                data.base_id = getBaseId();
                mySelfRecall(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.$toast.success(suc.data);
                        this.returnRecordBtn();//归还记录列表
                        this.myMaterialInfoBtn();//我的物资列表
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail("撤回请求失败，请稍后重试");
                });
            }).catch(() => {
                this.$toast.success("取消撤回");
                return false;
            });
        },
        //归还记录 详情
        returnDetailBtn(val){
            for(let i in this.recordInfo){
                var id = this.recordInfo[i].rec_id
                if(id == val){
                    this.recDetailInfo = this.recordInfo[i].agric;
                    break;
                }
            }
            // console.log('this.recDetailInfo',this.recDetailInfo);
            this.recordDetailShow = true;
        },
        //归还物资
        getMaterialBtn(){
            if(this.myMaterialInfo == ''){
                this.$toast.fail('您没有物资，不能归还');
                return false;
            }
            this.getInfo = [];
            for(let i in this.myMaterialInfo){
                this.getInfo.push({
                    fma_id:this.myMaterialInfo[i].fma_id,
                    fma_name:this.myMaterialInfo[i].agr_name,
                    fma_stock:this.myMaterialInfo[i].fma_num,
                    fma_num:''
                });
            }
            // console.log('this.getInfo',this.getInfo);
            this.getShow = true;
        },
        //归还物资 下一步（仓库和物流）
        onDowStepBtn(){
            this.getFormInfo = []
            for(let i in this.getInfo){
                if(this.getInfo[i].fma_num != '' && this.getInfo[i].fma_num > 0){
                    const num = validateNumber(this.getInfo[i].fma_num);
                    if(!num){
                        this.$toast.fail('数量只能为正数数字');
                        return false;
                    }
                    if(this.getInfo[i].fma_num > this.getInfo[i].fma_stock){
                        this.$toast.fail('归还数量不能大于库存数量');
                        return false;
                    }
                    this.getFormInfo.push({
                        fma_id:this.getInfo[i].fma_id,
                        fma_num:this.getInfo[i].fma_num,
                    });
                }
            }
            if(this.getFormInfo == ''){
                this.$toast.fail("您没有归还任何数据，不能提交");
                return false;
            }
            // console.log('this.getFormInfo',this.getFormInfo);
            this.getLogisticsShow = true;
        },
        //仓库和物流
        gainWareBtn(num){
            const data = {};
            // data.api_token = this.api_token;
            data.type = num;
            mySelfGetWare(data).then(success => {
                const suc = success.data;
                if(suc.code == 200){
                    if(num ==1){
                        this.getStorehouseInfo = suc.data;
                        // console.log('仓库',suc.data);
                    }else{
                        this.getLogisticsInfo = suc.data;
                        // console.log('物流',suc.data);
                    }
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                if(num ==1){
                    this.$toast.fail("仓库请求失败，请稍后重试");
                }else{
                    this.$toast.fail("物流请求失败，请稍后重试");
                }
                return false;
            });
        },
        //选择仓库
        storehouseBtn(){
            var arr = []
            for (let i in this.getStorehouseInfo) {
                arr.push(this.getStorehouseInfo[i].rep_name);
            }
            arr.defaultIndex = this.storehouseIndex
            // console.log(arr);
            this.columns = arr,
            this.getStorLogis = 1;
            this.showPicker = true;
        },
        //选择物流方式
        logisticsModeBtn(){
            var arr = []
            for (let i in this.logisticsMode) {
                arr.push(this.logisticsMode[i].state);
            }
            arr.defaultIndex = this.logisticsModeIndex
            // console.log(arr);
            this.columns = arr,
            this.getStorLogis = 2;
            this.showPicker = true;
        },
        //选择物流
        logisticsBtn(){
            var arr = []
            for (let i in this.getLogisticsInfo) {
                arr.push(this.getLogisticsInfo[i].tra_name);
            }
            arr.defaultIndex = this.logisticsIndex
            // console.log(arr);
            this.columns = arr,
            this.getStorLogis = 3;
            this.showPicker = true;
        },
        //仓库和物流  确认选择
        onConfirm(val,index) {
            if(this.getStorLogis == 1){
                //仓库
                this.storehouseIndex = index;
                this.getSubmitFormInfo.rep_id = this.getStorehouseInfo[index].rep_id;
                this.getSubmitFormInfo.rep_name = this.getStorehouseInfo[index].rep_name;
            }else if(this.getStorLogis == 2){
                //方式
                this.logisticsModeIndex = index;
                this.getSubmitFormInfo.wl_type = this.logisticsMode[index].value;
                this.getSubmitFormInfo.wl_type_val = this.logisticsMode[index].state;
            }else if(this.getStorLogis == 3){
                //物流
                this.getSubmitFormInfo.wl_unitid = this.getLogisticsInfo[index].tra_id;
                this.getSubmitFormInfo.wl_unit_name = this.getLogisticsInfo[index].tra_name;
                this.logisticsIndex = index;
            }
            this.showPicker = false;
            // console.log(this.getSubmitFormInfo)
        },
        //归还物资 提交
        onSubmitGetBtn(){
            this.getSubmitFormInfo.agric = this.getFormInfo;
            if(this.getSubmitFormInfo.rep_id == '' || this.getSubmitFormInfo.wl_type == ''){
                this.$toast.fail("物资接收方或运输方式不能为空");
                return false;
            }
            if(this.getSubmitFormInfo.wl_type == 1){
                if(this.getSubmitFormInfo.wl_unitid == '' || this.getSubmitFormInfo.wl_courier == ''){
                    this.$toast.fail("快递公司和快递单号不能为空");
                    return false;
                }
            }
            if(this.getSubmitFormInfo.wl_type == 2 || this.getSubmitFormInfo.wl_type == 3){
                if(this.getSubmitFormInfo.wl_user == '' || this.getSubmitFormInfo.wl_tel == ''){
                    this.$toast.fail("负责人和联系电话不能为空");
                    return false;
                }
                // if(getSubmitFormInfo.wl_license == ''){
                //     this.$toast("车牌号不能为空");
                //     return false;
                // }
                const num = phoneTest(this.getSubmitFormInfo.wl_tel);
                if(!num){
                    this.$toast.fail('手机号格式不正确');
                    return false;
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
            const data = this.getSubmitFormInfo
            data.base_id = getBaseId();
            // data.api_token = this.api_token;
            mySelfReturn(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                if(suc.code == 200){
                    this.$toast.success(suc.data);
                    this.getShow = false;
                    this.getLogisticsShow = false;
                    this.myMaterialInfoBtn();
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail("归还物资提交失败，请稍后重试");
                return false;
            });
        },
        //下拉刷新
        onRefresh() {
            setTimeout(() => {
                this.myMaterialInfoBtn();//列表
                this.gainWareBtn(1);//仓库
                this.gainWareBtn(2);//物流方式
                this.$toast.success('刷新成功');
                this.isLoading = false;
            }, 500);
        },
    }
}
</script>
<style scoped>
.mainPersonalListTabBox{width:100%;height:44px;position:fixed;top:48px;font-size:13px;text-align:center;line-height:44px;font-weight:bold;background-color:#fff;display:flex;padding:0 15px;border-bottom:1px solid #eee;}
.mainPersonalListTabBox span{flex:1;}
.mainPersonalListTabBox span.nameBox{flex:3;text-align:left;}
.mainPersonalBox{position:fixed;top:92px;left:0;right:0;bottom:60px;overflow-y:auto;background-color:#f5f5f5;}
.mainPersonalBox .listInfoBox{font-size:12px;line-height:20px;border-bottom:1px solid #eee;display:flex;text-align:center;padding:12px 15px;background-color:#fff;}
.mainPersonalBox .listInfoBox span{flex:1;}
.mainPersonalBox .listInfoBox span.nameBox{flex:3;text-align:left;}
.mainFooterMenuBox{position:fixed;left:0;bottom:0;width:100%;height:60px;background-color:#fff;padding:8px 10px;text-align:right;-webkit-box-shadow: #ddd 0px 0px 10px;-moz-box-shadow: #ddd 0px 0px 10px;box-shadow: #ddd 0px 0px 10px;}
.mainCheckPopupBox,.mainRecordPopupBox{background-color:#f1f1f1;width:100%;height:100%;}
.mainCheckPopupBox .checkListTabBox{background-color:#f1f1f1;height:46px;font-size:14px;line-height:46px;font-weight:bold;display:flex;padding:0 10px;}
.mainCheckPopupBox .checkListTabBox span{flex:1;text-align:center;}
.mainCheckPopupBox .checkListTabBox span.nameBox{flex:2;text-align:left;}
.mainCheckPopupBox .checkListBox{position:fixed;top:92px;left:0;right:0;bottom:0;overflow-y:auto;}
.mainCheckPopupBox .checkListBox li{background-color:#fff;display:flex;border-bottom:1px solid #ebedf0;font-size:14px;line-height:44px;padding:0 10px;}
.mainCheckPopupBox .checkListBox li span{flex:1;}
.mainCheckPopupBox .checkListBox li span.nameBox{flex:2;}
.mainCheckPopupBox .checkListBox li span.stockBox{text-align:center;}
/* 归还记录 */
.mainRecordPopupBox .recordListNoneBox{padding:100px 0;text-align:center;}
.mainRecordPopupBox .recordListNoneBox .picBox{width:200px;margin:0 auto;}
.mainRecordPopupBox .recordListNoneBox .picBox img{width:100%;}
.mainRecordPopupBox .recordListNoneBox .txtBox{font-size:14px;line-height:30px;padding:20px 0;}
/* 归还物资 */
.mainGetWareBox{padding-top:10px;position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;}
.mainGetWareBox .formItemBox{margin-top:10px;}
.mainGetWareBox .formItemBox .van-field{padding:0px;}
.mainGetWareBox .formItemBox .van-cell__value{flex:2;}
/* 归还记录 */
.mainrecordDetailBox{height:400px;font-size:14px;}
.mainrecordDetailBox .listTabBox{height:44px;line-height:20px;padding:12px 10px;display:flex;text-align:center;border-bottom:1px solid #eee;}
.mainrecordDetailBox .listTabBox span{flex:1;}
.mainrecordDetailBox .listTabBox span.nameBox{flex:3;text-align:left;}
.mainrecordDetailBox .listItemBox{padding:10px;overflow-y:auto;height:310px;}
.mainrecordDetailBox .listItemBox li{display:flex;line-height:20px;padding:12px 0;border-bottom:1px dashed #eee;text-align:center;}
.mainrecordDetailBox .listItemBox li span{flex:1;}
.mainrecordDetailBox .listItemBox li span.nameBox{flex:3;text-align:left;}

.mainInfoNoneBox {padding:100px 0;text-align:center;}
.mainInfoNoneBox .picBox{width:200px;margin:0 auto;}
.mainInfoNoneBox .picBox img{width:100%;height:auto;}
.mainInfoNoneBox .tetBox{font-size:14px;line-height:20px;padding:20px 0;}

</style>
