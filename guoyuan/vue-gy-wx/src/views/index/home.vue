<template>
    <div class="mainContentBox">
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="mainInfoLoading" class="mainHomeContentBox">
            <!-- 公告 -->
            <div v-if="newsTitle != ''" class="mainNoticeBox"><van-notice-bar mode="link" :text="newsTitle" left-icon="volume-o" @click="newsDetailBtn(newsId)"/></div>
            <!-- 基地 生产编号 -->
            <div class="mainBenchInfoBox" @click="bench_list_show = true">
                <div class="benchNameBox">{{ bench_Info.b_name }}</div>
                <van-cell title="生产编号：" :value="bench_Info.number" :border="false"/>
                <van-cell title="农户姓名：" :value="bench_Info.name" :border="false"/>
                <van-cell title="联系电话：" :value="bench_Info.phone" :border="false"/>
                <van-cell title="商品种类：" :value="bench_Info.category" :border="false"/>
                <van-cell title="商品名称：" :value="bench_Info.goods_name" :border="false"/>
                <div class="moreBox">更换</div>
            </div>
            <!-- 导航 -->
            <div class="mainNavItemBox">
                <ul class="itemBox">
                    <li @click="navLinkBtn(item.pri_path,item.component)" v-for="item in navList" :key="item.index">
                        <span class="picBox"><img :src="item.tit_pic" /></span>
                        <span class="titleBox">{{ item.meta.title }}</span>
                    </li>
                </ul>
            </div>
        </van-pull-refresh>
        <!-- 暂无消息 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="noInfoLoading" class="mainInfoNoneBox">
            <div class="picBox"><img src="../../../static/images/list_none.png" /></div>
            <div class="txtBox">您绑定的基地暂无生产编号信息</div>
        </van-pull-refresh>
        <!-- 基地列表弹框 -->
        <van-popup v-model="bench_list_show" position="right" class="mainBenchPopupBox">
            <div class="popupHeaderBox">
                <van-icon class="backBox" name="arrow-left" @click="bench_list_show = false" />
                <div class="titleBox">基地列表</div>
            </div>
            <div class="popupHeaderNoneBox"></div>
            <ul class="benchListBox">
                <van-radio-group v-model="bench_radio">
                    <li v-for="(item,index) in benchList" :key="index" class="listItemBox">
                            <van-cell class="benchNameBox" :title="item.base_name" clickable :border="false">
                                <van-radio slot="right-icon" v-if="item.pro_state != 4" :name="item.pro_id" @click="bench_change(item.pro_state)" />
                            </van-cell>
                            <van-cell title="生产编号：" :value="item.pro_number" :border="false"/>
                            <van-cell title="农户姓名：" :value="item.far_name" :border="false"/>
                            <van-cell title="联系电话：" :value="item.far_mobile" :border="false"/>
                            <van-cell title="商品种类：" :value="item.cla_name" :border="false"/>
                            <van-cell title="商品名称：" :value="item.goo_name" :border="false"/>
                        <div class="footerBtnBox">
                            <div class="leftStateBox">
                                <span v-if="item.pro_state == 1">筹备中</span>
                                <span v-if="item.pro_state == 2">生产中</span>
                                <span v-if="item.pro_state == 3">已暂停</span>
                                <!-- <span v-if="item.pro_state == 4">生产完成</span> -->
                            </div>
                            <span v-for="itemBtn in produceBtnList" :key="itemBtn.index">
                                <span v-if="itemBtn.pri_id == 249">
                                    <van-button v-if="item.pro_state == 1" type="info" size="small" @click="produceBtn(itemBtn.pri_id,item.pro_id)">{{ itemBtn.meta.title }}</van-button>
                                </span>
                                <span v-if="itemBtn.pri_id == 250">
                                    <van-button v-if="item.pro_state == 2" type="primary" size="small" @click="produceBtn(itemBtn.pri_id,item.pro_id)">{{ itemBtn.meta.title }}</van-button>
                                </span>
                                <span v-if="itemBtn.pri_id == 251">
                                    <van-button v-if="item.pro_state == 3" type="primary" size="small" @click="produceBtn(itemBtn.pri_id,item.pro_id)">{{ itemBtn.meta.title }}</van-button>
                                </span>
                                <span v-if="itemBtn.pri_id == 252">
                                    <van-button v-if="item.pro_state != 4" type="danger" size="small" @click="produceBtn(itemBtn.pri_id,item.pro_id)">{{ itemBtn.meta.title }}</van-button>
                                </span>
                            </span>
                            <span v-if="item.pro_state == 4">生产已完成，如有疑问请联系管理员</span>
                        </div>
                    </li>
                </van-radio-group>
            </ul>
        </van-popup>
    </div>
</template>
<script>
import commonHeader from '@/views/components/common-header'
import { getToken,removeToken,setproId,setnewsId,setBaseId,setPriId,getBaseId,setAdmName } from '@/utils/auth'
import { mySelfNavigation,benchInfo,benchDefault,benchStartPro,benchSuspendPro,benchEndPro,benchRecoverPro,myUserInfo } from '@/api/home'
import { mySelfNews } from '@/api/personal'
export default {
    name:'home',
    data(){
        return{
            title:'果品溯源管理平台',
            showback:false,
            showmy:false,
            api_token:'',
            //基地
            bench_Info:{
                b_name:'',
                number:'',
                name:'',
                phone:'',
                category:'',
                goods_name:''
            },
            benchState:'',//基地状态
            //基地列表
            benchList:[],
            bench_list_show:false,
            bench_radio:'',
            isLoading: false,
            
            mainInfoLoading:false,//页面内容
            noInfoLoading:false,//暂无信息

            //系统消息
            newsTitle:'',
            newsId:'',

            navList:[],//导航列表
            produceBtnList:[],//基地生产操作按钮

            userInfo:{},//用户信息
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
        // this.api_token = localStorage.getItem('api_token');
        this.benchInfoBtn();
    },
    methods:{
        //获取农户信息
        myUserInfoBtn(){
            const data = {};
            myUserInfo(data).then(success => {
                const suc = success.data;
                if(suc.code == 200){
                    this.userInfo = suc.userinfo;
                    setAdmName(this.userInfo.adm_name);
                    // console.log('用户',this.userInfo);
                }
            })
            .catch(err => {

            });
        },
        //获取导航
        mySelfNavigationBtn(){
            const data = {};
            mySelfNavigation(data).then(success => {
                const suc = success.data;
                this.produceBtnList = [];//生产操作按钮
                this.navList = [];//首页导航
                if(suc.code == 200){
                    for(let i in suc.navigation_category){
                        if(suc.navigation_category[i].component == 'Home'){
                            this.produceBtnList.push(suc.navigation_category[i]);
                        }else{
                            this.navList.push(suc.navigation_category[i]);
                        }
                        if(suc.navigation_category[i].component == 'My'){
                            setPriId(suc.navigation_category[i].pri_id);
                        }
                    }
                    // console.log("生产按钮",this.produceBtnList)
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.fail('导航请求失败，请稍后重试');
            });
        },
        //获取基地
        benchInfoBtn(){
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
            benchInfo(data).then(success => {
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                // console.log(success.data)
                if(suc.code == 200){
                    this.benchList = suc.data;
                    var benchShow = true;
                    // console.log('基地',suc.data);
                    if(this.benchList.length == 0){
                        // this.$toast('暂无基地信息');
                        this.noInfoLoading = true;
                        return false;
                    }
                    for(let i in suc.data){
                        if(suc.data[i].pro_operate == 1){
                            this.bench_Info.b_name = suc.data[i].base_name;
                            this.bench_Info.number = suc.data[i].pro_number;
                            this.bench_Info.name = suc.data[i].far_name;
                            this.bench_Info.phone = suc.data[i].far_mobile;
                            this.bench_Info.category = suc.data[i].cla_name;
                            this.bench_Info.goods_name = suc.data[i].goo_name;
                            benchShow = false;
                            this.bench_radio = suc.data[i].pro_id;
                            this.benchState = suc.data[i].pro_state;
                            setproId(suc.data[i].pro_id);
                            setBaseId(suc.data[i].base_id);
                            break;
                        }
                    }
                    if(benchShow){
                        this.bench_Info.b_name = suc.data[0].base_name;
                        this.bench_Info.number = suc.data[0].pro_number;
                        this.bench_Info.name = suc.data[0].far_name;
                        this.bench_Info.phone = suc.data[0].far_mobile;
                        this.bench_Info.category = suc.data[0].cla_name;
                        this.bench_Info.goods_name = suc.data[0].goo_name;
                        this.bench_radio = suc.data[0].pro_id;
                        this.benchState = suc.data[0].pro_state;
                        setproId(suc.data[0].pro_id);
                        setBaseId(suc.data[0].base_id);
                    }
                    this.mainInfoLoading = true;
                    this.mySelfNavigationBtn();//导航按钮
                    this.newsInfoBtn();//系统消息
                    this.myUserInfoBtn();//获取用户信息
                }else{
                    if(suc.code != 300){
                        this.$toast.fail(suc.data);
                        this.mainInfoLoading = false;
                    }
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail('基地请求失败，请稍后重试');
            });
        },
        //导航跳转
        navLinkBtn(url,comp){
            // console.log('comp',comp)
            if(this.benchState != 2){
                if(comp != 'MyBase' && comp != 'My' && comp != 'Journal'){
                    this.$toast.fail('当前生产编辑未生产，请联系管理员');
                    return false;
                }
            }
            this.$router.togo(url);
        },
        //选中每个基地生产编号
        bench_change(val){
            if(val == 4){
                this.$toast.fail('当前编号不能选择');
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
            // console.log(this.bench_radio);
            const data = {};
            data.pro_id = this.bench_radio
            // data.api_token = this.api_token;
            benchDefault(data).then(success => {
                // console.log(success);
                this.$toast.clear();//关闭加载层
                const suc = success.data;
                if(suc.code == 200){
                    this.$toast.success(suc.data);
                    this.benchInfoBtn();
                    var this_ = this;
                    setTimeout(function(){
                        this_.bench_list_show = false;
                    },1000);
                }else{
                    this.$toast.fail(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast.clear();//关闭加载层
                this.$toast.fail('选择基地失败');
                return false;
            });
        },
        //下拉刷新
        onRefresh() {
            setTimeout(() => {
                this.benchInfoBtn();//基地列表
                this.$toast.success('刷新成功');
                this.isLoading = false;
            }, 500);
        },
        //生产操作指向
        produceBtn(val,id){
            if(val == 249){
                this.startProBtn(id);//开始生产
            }else if(val == 250){
                this.suspendProBtn(id);//暂停生产
            }else if(val == 251){
                this.recoverProBtn(id);//恢复生产
            }else if(val == 251){
                this.endProBtn(id);//结束生产
            }
        },
        //开始生产
        startProBtn(id){
            this.$dialog.confirm({
                message: '您确定要开始生产吗？'
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
                data.pro_id = id;
                data.base_id = getBaseId();
                // data.api_token = this.api_token;
                benchStartPro(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.benchInfoBtn();//基地列表
                        this.$toast.success('生产提交成功');
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail('生产提交失败');
                    return false;
                });
            }).catch(() => {
                this.$toast.success('取消开始生产');
            });
        },
        //恢复生产
        recoverProBtn(id){
            this.$dialog.confirm({
                message: '您确定要恢复生产吗？'
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
                data.pro_id = id;
                data.base_id = getBaseId();
                // data.api_token = this.api_token;
                benchRecoverPro(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.benchInfoBtn();//基地列表
                        this.$toast.success('恢复成功');
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail('恢复失败');
                });
            }).catch(() => {
                this.$toast.success('取消恢复生产');
            });
        },
        //暂停生产
        suspendProBtn(id){
            this.$dialog.confirm({
                message: '您确定要暂停生产吗？'
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
                data.pro_id = id;
                data.base_id = getBaseId();
                // data.api_token = this.api_token;
                benchSuspendPro(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.benchInfoBtn();//基地列表
                        this.$toast.success('暂停生产成功');
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail('暂停生产失败');
                    return false;
                });
            }).catch(() => {
                this.$toast.success('取消暂停生产');
            });
        },
        //结束生产
        endProBtn(id){
            this.$dialog.confirm({
                message: '您确定要结束生产吗？'
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
                data.pro_id = id;
                data.base_id = getBaseId();
                benchEndPro(data).then(success => {
                    this.$toast.clear();//关闭加载层
                    const suc = success.data;
                    if(suc.code == 200){
                        this.$toast.success('结束生产成功');
                        this.benchInfoBtn();//基地列表
                    }else{
                        this.$toast.fail(suc.data);
                        return false;
                    }
                })
                .catch(err => {
                    this.$toast.clear();//关闭加载层
                    this.$toast.fail('结束生产失败');
                });
            }).catch(() => {
                this.$toast.success('取消结束生产');
            });
        },
        //系统消息
        newsInfoBtn(){
            const data = {};
            // data.api_token = this.api_token;
            mySelfNews(data).then(success => {
                const suc = success.data
                // console.log(suc);
                if(suc.code == 200){
                    if(suc.data.length > 0){
                        var f = true;
                        for(let i in suc.data){
                            if(suc.data[i].info_top ==1){
                                var t = Number(suc.data[i].info_type)
                                if(t == 1){
                                    var type = '信息通知';
                                }else{
                                    var type = '病虫害预警';
                                }
                                this.newsTitle = type +"："+ suc.data[i].info_title;
                                this.newsId = suc.data[i].info_id;
                                f = false;
                                break;
                            }
                        }
                        if(f){
                            var t = Number(suc.data[0].info_type)
                            if(t == 1){
                                var type = '信息通知';
                            }else{
                                var type = '病虫害预警';
                            }
                            this.newsTitle = type +"："+ suc.data[0].info_title;
                            this.newsId = suc.data[0].info_id;
                        }
                        this.newsListInfo = suc.data;
                        // console.log(this.newsTitle);
                    }else{
                        this.newsTitle = "";
                    }
                }else{
                    this.$toast(suc.data);
                    return false;
                }
            })
            .catch(err => {
                this.$toast("系统信息请求失败，请稍后重试");
            });
        },
        //系统消息 跳转详情
        newsDetailBtn(val){
            setnewsId(val);
            this.$router.togo('/home/personal/message/detail');
        },
    }
}
</script>
<style scoped>
.mainHomeContentBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;}
.mainBenchInfoBox{font-size:14px;line-height:20px;padding:14px;position:relative;border-bottom:12px solid #f2f2f2;padding-bottom:14px;}
.mainBenchInfoBox .benchNameBox{line-height:20px;font-weight:bold;font-size:16px;padding:10px 0;}
.mainBenchInfoBox .peasantBox span{display:inline-block;margin-right:10px;}
.mainBenchInfoBox .moreBox{width:40px;height:40px;position:absolute;top:14px;right:10px;font-size:14px;line-height:40px;text-align:center;}
.mainBenchInfoBox .van-cell{padding:2px 0!important;}
.mainBenchInfoBox .van-cell .van-cell__title{flex:1;}
.mainBenchInfoBox .van-cell .van-cell__value{flex:3;text-align:left;}
.mainNoticeBox{font-size:14px;background-color:#fffbe8;}
.mainNavItemBox{padding:20px 14px;}
.mainNavItemBox .itemBox{font-size:0;}
.mainNavItemBox .itemBox li{width:33.33%;min-height:140px;display:inline-block;text-align:center;}
.mainNavItemBox .itemBox li .picBox{display:block;width:80px;height:80px;margin:0 auto;background-color:#f2f7f5;border-radius:50%;}
.mainNavItemBox .itemBox li .picBox img{width:100%;height:100%;padding:22px;}
.mainNavItemBox .itemBox li .titleBox{display:block;font-size:14px;line-height:20px;padding:10px 0;overflow:hidden;}
.mainBenchPopupBox{width:100%;height:100%;background-color:#f1f1f1;}
.mainBenchPopupBox .van-nav-bar__title{max-width:100%;}
.mainBenchPopupBox .van-radio__label{display:block!important;}
.mainBenchPopupBox .popupHeaderBox{width:100%;height:48px;line-height:48px;background-color:#fff;border-bottom:1px solid #ddd;text-align:center;position:fixed;top:0;left:0;}
.mainBenchPopupBox .popupHeaderBox .backBox{width:48px;height:48px;position:fixed;top:0;left:0;z-index:9;font-size:18px;line-height:48px;}
.mainBenchPopupBox .popupHeaderBox .titleBox{color:#333;}
.mainBenchPopupBox .popupHeaderNoneBox{height:48px;}
.mainBenchPopupBox .benchListBox{font-size:14px;position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;}
.mainBenchPopupBox .benchListBox .listItemBox{background-color:#fff;margin-top:10px;padding:20px;}
.mainBenchPopupBox .benchListBox .listItemBox .benchNameBox{font-size:16px;line-height:18px;margin-bottom:10px;color:#000;}

.mainBenchPopupBox .benchListBox .listItemBox .van-cell{padding:2px 0!important;}
.mainBenchPopupBox .benchListBox .listItemBox .van-cell .van-cell__title{flex:1;}
.mainBenchPopupBox .benchListBox .listItemBox .van-cell .van-cell__value{flex:3;text-align:left;}

.mainBenchPopupBox .benchListBox .footerBtnBox{padding:10px 0 0 0;border-top:1px solid #ddd;margin-top:10px;text-align:right;min-height:32px;}
.mainBenchPopupBox .benchListBox .footerBtnBox .leftStateBox{float:left;line-height:28px;}

.mainInfoNoneBox {padding:100px 0;text-align:center;position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainInfoNoneBox .picBox{width:200px;margin:0 auto;}
.mainInfoNoneBox .picBox img{width:100%;height:auto;}
.mainInfoNoneBox .tetBox{font-size:14px;line-height:20px;padding:20px 0;}
</style>