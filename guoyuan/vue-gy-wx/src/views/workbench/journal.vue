<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="Journal">
            <div class="searchTabNameBox">
                <span @click="searchOpenBtn"><van-icon name="arrow-down" /></span>
                <van-search v-model="searchValue" :label='labelName' show-action placeholder="请输入搜索关键词" shape="round" @search="onSearchBtn" @click="onSearchInput">
                    <div slot="action" @click="onSearchBtn">搜索</div>
                </van-search>
            </div>
            <div class="nodatas" v-if="Journallist.length == 0">
                <img src="@/assets/nonedata.png">
            </div>
            <div class="Journallist" v-else  id="swipeups" @swipeup="swipeupdata('swipeups')"  >
                <div class="List_sect" v-for="(item, index) in Journallist" :key="index">
                    <p>
                       <span>操作人名称：</span><span>{{item.cop_admin}}</span>
                    </p>
                    <p>
                       <span>操作人IP地址：</span><span>{{item.cop_ip}}</span>
                    </p>
                    <p>
                       <span>操作模型：</span><span>{{item.cop_mode}}</span>
                    </p>
                    <p>
                        <span>操作内容：</span><span>{{item.cop_content}}</span>
                    </p>
                    <p>
                        <span>操作时间：</span><span>{{item.cop_createtime}}</span>
                    </p>
                    <p>
                        <span>基地名称：</span><span>{{item.far_name}}</span>
                    </p>
                    <p>
                        <span>生产编号：</span><span>{{item.pro_number}}</span>
                    </p>
                </div>
            </div>
        </div>
        <van-popup v-model="popupTimeShow" position="bottom" :overlay="true" @click-overlay="cancelPopup" >
            <van-datetime-picker v-model="currentDate" type="date" @confirm='confirmTime' @cancel='cancelPopup' />
        </van-popup>
        <van-popup v-model="searchTabShow" position="bottom" :overlay="true">
            <van-picker show-toolbar title="选项" :columns="searchName"  @confirm='onConfirmSearch' @cancel='cancelPopup'/>
        </van-popup>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId } from '@/utils/auth'
import { Myself_log } from '@/api/workbench'
export default {
    data(){
        return{
            title:'操作日志',
            showback:true,
            showmy:false,
            labelName:'时间',
            labelNum:0,
            loadingtype:1,
            searchValue:'',
            searchTabShow:false,
            popupTimeShow:false,
            currentDate:new Date(),
            allpage:'',
            newpage:'',
            searchName:[
                "时间",
                "操作"
            ],
            Journallist:[],
        }
    },
    components:{
        commonHeader
    },
    created(){
        this.getdatas(1);
    },
    methods: {
        getdatas(page){
            //打开加载层
            this.$toast.loading({
                mask:true,
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在加载'
            });
            var datadd = {};
            datadd.page = page;
            datadd.api_token = getToken();
            if(this.labelNum == 0){
                datadd.time = this.searchValue;
            }else{
                datadd.adm_name = this.searchValue;
            }
            Myself_log(datadd).then(success =>{
                this.allpage = success.data.data_info.last_page;
                this.newpage = success.data.data_info.current_page;
                if(success.data.code === 200){
                    if(this.loadingtype == 1){
                        this.Journallist = success.data.data_info.data;
                    }else{
                        for(var i =0;i<success.data.data_info.data.length;i++){
                            this.Journallist.push(success.data.data_info.data[i]);
                        }
                    }
                }else{
                    this.Journallist = [];
                }
                this.$toast.clear();//关闭加载层                
            }).catch(err=>{
                this.$toast.clear();//关闭加载层
            })
        },
        onConfirmSearch(value,index){
            this.searchTabShow = false;
            this.labelName = value;
            this.searchValue = '';
            this.labelNum = index;
            // this.Journallist = [];
        },
        //日期   确认
        confirmTime(value,index){
            this.popupTimeShow = false
            const y = value.getFullYear();
            var m = value.getMonth()+1;
            var d = value.getDate();
            if(m >= 1 && m <= 9){
                m = '0' + m
            }
            if(d >= 1 && d <= 9){
                d = '0' + d
            }
            this.searchValue = y+'-'+m+'-'+d;
        },
        cancelPopup(){
            this.searchTabShow = false;
        },
        searchOpenBtn(){
            this.searchTabShow = true;
        },
        onSearchBtn(){
            if(this.searchValue == ''){
                this.$toast.fail('请输入搜索条件!');
                return false;
            };
            this.loadingtype = 1;
            this.getdatas(1);
            
        },
        onSearchInput(){
            if(this.labelNum == 0){
                this.popupTimeShow = true;
            }
        },
        // 上滑
        swipeupdata(id){
            // console.log('2222333');
             var ht = document.getElementById(id).clientHeight;
            var scrollTop =  document.getElementById(id).scrollTop;
            // console.log((document.getElementById(id).scrollHeight -10)<(ht + scrollTop));
            if((document.getElementById(id).scrollHeight -10)<(ht + scrollTop)){
                // console.log(this.allpage,this.newpage)
                if(this.allpage > this.newpage){
                    this.loadingtype = 2;
                    this.getdatas(this.newpage+1);
                }else{
                    this.$toast.fail('已经是最后一页了!');
                    return false;
                }
            }
            //  if((document.getElementById(id).scrollHeight -10) < (ht + scrollTop) ) {
           
        }
    }
}
</script>
<style scoped>
.Journal{
   padding-top: 48px;
    height: 100%;
    background: #f5f5f5;
    overflow: hidden;
}
.nodatas{
    text-align: center;
}
.nodatas img{
    padding-top: 24.5%;
}
.Journallist{
    padding: 10px 20px;
    height: calc(100% - 48px);
    overflow-x: hidden;
    overflow-y: scroll;
}
.List_sect{
    padding: 10px 0;
    border-left: 2px solid #10b269;
    background: #fff;
    border-radius: 5px;
    margin-bottom: 20px;
}
.Journallist .List_sect > p{
       padding-left: 15px;
    line-height: 20px;
    font-size: 14px;
    padding-right: 10px;
    display: flex;
    margin: 5px 0;
}
.Journallist .List_sect > p span:nth-child(1){
    flex: 1;
    text-align: right;
}
.Journallist .List_sect > p span:nth-child(2){
    flex: 2;
}
.searchTabNameBox{
    position:relative;
}
.searchTabNameBox span{
    display:block;
    width:76px;
    height:34px;
    position:absolute;
    top:10px;
    left:0;
    text-align:right;
    line-height:38px;
    font-size:12px;
}

</style>
<style>
    .searchTabNameBox .van-search__label{
        padding-right:20px;
    }
</style>