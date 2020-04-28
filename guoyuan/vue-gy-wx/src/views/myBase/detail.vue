<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainBaseEnvironBox">
            <!-- <ul class="environListBox">
                <li v-for="item in environNavInfo" :key="item.index">
                    <div class="picBox"><img :src="item.pic" /></div>
                    <div class="nameBox">{{ item.name }}</div>
                </li>
            </ul> -->
            <div class="mainNavItemBox">
                <ul class="itemBox">
                    <li @click="navLinkBtn(item,index)" v-for="(item,index) in environNavInfo" :key="index">
                        <span class="picBox"><img :src="item.pic" /></span>
                        <span class="titleBox">{{ item.name }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId } from '@/utils/auth'
import { validateNumber } from '@/utils/validate'
import { mybaseIndex } from '@/api/myBase'
export default {
    data(){
        return{
            title:'基地环境',
            childtitle:'',
            showback:true,
            showmy:false,
            // api_token:'',
            environNavInfo:[
                {
                    pic:require('../../../static/images/statis_icon_01.png'),
                    name:'降雨量',
                },{
                    name:'风向',
                    pic:require('../../../static/images/statis_icon_02.png'),
                },{
                    pic:require('../../../static/images/statis_icon_03.png'),
                    name:'风速',
                },{
                    pic:require('../../../static/images/statis_icon_04.png'),
                    name:'土壤水分',
                },{
                    pic:require('../../../static/images/statis_icon_05.png'),
                    name:'CO2',
                },{
                    name:'光照度',
                    pic:require('../../../static/images/statis_icon_06.png'),
                },{
                    pic:require('../../../static/images/statis_icon_07.png'),
                    name:'太阳辐射',
                },{
                    pic:require('../../../static/images/statis_icon_08.png'),
                    name:'土壤电导率',
                },{
                    pic:require('../../../static/images/statis_icon_09.png'),
                    name:'土壤温度',
                },{
                    pic:require('../../../static/images/statis_icon_10.png'),
                    name:'PM2.5',
                },{
                    pic:require('../../../static/images/statis_icon_11.png'),
                    name:'空气温度',
                },{
                    pic:require('../../../static/images/statis_icon_12.png'),
                    name:'环境湿度',
                },{
                    pic:require('../../../static/images/statis_icon_13.png'),
                    name:'二氧化硫',
                },{
                    pic:require('../../../static/images/statis_icon_14.png'),
                    name:'二氧化氮',
                },
                // {
                //     pic:require('../../../static/images/statis_icon_15.png'),
                //     name:'',
                // },{
                //     pic:require('../../../static/images/statis_icon_16.png'),
                //     name:'',
                // },
                {
                    pic:require('../../../static/images/statis_icon_17.png'),
                    name:'蚊虫检测',
                },{
                    pic:require('../../../static/images/statis_icon_18.png'),
                    name:'水质检测',
                },{
                    pic:require('../../../static/images/statis_icon_19.png'),
                    name:'土质检测',
                }
            ],
        }
    },
    components:{
        commonHeader
    },
    created(){
        // this.api_token = getToken();
    },
    methods: {
        navLinkBtn(data,index){
            this.$router.togo('/home/myBase/detail/detailInformat');
            // this.childtitle = data.name;
            var datadd = {};
            datadd = data;
            datadd.index = index; 
            localStorage.setItem('detailinfor',JSON.stringify(datadd));
            // console.log(this)
        }
    }
}
</script>
<style scoped>
.mainBaseEnvironBox{position:fixed;top:48px;left:0;right:0;bottom:0;overflow-y:auto;background-color:#f5f5f5;}
.mainNavItemBox{padding:20px 14px;background: #fff;}
.mainNavItemBox .itemBox{font-size:0;}
.mainNavItemBox .itemBox li{width:33.33%;min-height:140px;display:inline-block;text-align:center;}
.mainNavItemBox .itemBox li .picBox{display:block;width:80px;height:80px;margin:0 auto;background-color:#f2f7f5;border-radius:50%;}
.mainNavItemBox .itemBox li .picBox img{width:100%;height:100%;padding:22px;}
.mainNavItemBox .itemBox li .titleBox{display:block;font-size:14px;line-height:20px;padding:10px 0;overflow:hidden;}
</style>