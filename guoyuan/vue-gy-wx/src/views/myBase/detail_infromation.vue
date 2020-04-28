<template>
    <div>
        <common-header :title="title" :showback="showback" :showmy="showmy"></common-header>
        <div class="mainTopNoneBox"></div>

        <div class="barsd">
            <div class="searchTabNameBox">
                <span @click="searchOpenBtn"><van-icon name="arrow-down" /></span>
                <van-search v-model="searchValue" :label='labelName' show-action placeholder="请输入搜索关键词" shape="round" @search="onSearchBtn" @click="onSearchInput">
                    <div slot="action" @click="onSearchBtn">搜索</div>
                </van-search>
            </div>
            <van-cell title="含量选择"  :value="currentDatecontent" @click="contentselect" v-if="typsed == 17 || typsed == 18" is-link />
            <div v-show="datashow" id="echartsbar"></div>
        </div>
         <van-popup  v-model="popupTimeShow" position="bottom" :overlay="true" @click-overlay="cancelPopup" >
            <van-datetime-picker v-model="currentDate" type="date" @confirm='confirmTime' @cancel='cancelPopup' />
        </van-popup>
        <van-popup v-model="searchTabShow" position="bottom" :overlay="true">
            <van-picker show-toolbar title="选项" :columns="searchName"  @confirm='onConfirmSearch' @cancel='cancelPopup'/>
        </van-popup>
        <van-popup  v-model="yeaysTabShow" position="bottom" :overlay="true">
            <van-picker show-toolbar title="年份" :columns="yearlist" @confirm='onConfirmyeays'  @cancel='cancelPopup'/>
        </van-popup>
        <van-popup  v-model="mountsTabShow" position="bottom" :overlay="true">
            <van-datetime-picker v-model="currentDatemount"  type="year-month" :min-date="minDatemount" :max-date="maxDatemount" :formatter="formatter"  @confirm='onChangemount' @cancel='cancelPopup' />
        </van-popup>
         <van-popup  v-model="daysTabShow" position="bottom" :overlay="true">
            <van-datetime-picker
            v-model="currentDateday"
            type="datetime" 
            :min-date="minDatemount" 
            :max-date="maxDatemount"
            @confirm='onChangedays'
            @cancel='cancelPopup'
            />   
        </van-popup>
        <van-popup v-model="contentTabShow" position="bottom" :overlay="true">
            <van-picker show-toolbar title="含量选项" v-model="currentDatecontent" :columns="contentName"  @confirm='onConfirmcontent' @cancel='cancelPopup'/>
        </van-popup>
    </div>
</template>
<script>
import commonHeader from '../components/common-header'
import { getToken,getproId,getBaseId } from '@/utils/auth'
import echarts from 'echarts'
import {Mybase_env} from '@/api/myBase'
export default {
    components:{commonHeader},
    data(){
        return{
            title:'基地环境',
            showback:true,
            currentDate:new Date(),
            currentDatemount:new Date((new Date()).getFullYear(),1),
            currentDateday:new Date(),
            currentDatecontent:'',
            curdataindex:0,
            typsed:'',
            showmy:false,
            prentdata:'',
            labelName:'年份',
            minDatemount:'',
            maxDatemount:'',
            serachtype:0,
            searchValue:'',
            currentDate:'',
            popupTimeShow:false,
            searchTabShow:false,
            yeaysTabShow:false,
            mountsTabShow:false,
            datashow:true,
            daysTabShow:false,
            timers08:'',
            contentTabShow:false,
            yearlist:[],
            searchName:[
                '年份',
                '月份',
                '日期'
            ],
            mountName:[],
            contentName:[],
            alldata:[],
        }
    },
    created(){
        this.title = JSON.parse(localStorage.getItem('detailinfor')).name;
        this.prentdata = JSON.parse(localStorage.getItem('detailinfor'));
        if(this.prentdata.index > 14){
            this.typsed = this.prentdata.index + 2; 
        }else{
            this.typsed = this.prentdata.index; 
        }
        var date = new Date(); 
        var searchValue = date.getFullYear();
        this.searchValue = searchValue+'';
        this.yearlist.push(searchValue+'');
        this.yearlist.push((searchValue-1 )+ '');
        this.yearlist.push((searchValue-2)+ '');
        this.minDatemount = new Date(searchValue-2,0)
        this.maxDatemount = new Date(searchValue,date.getMonth(),date.getDate())
    },
    mounted (){
        this.$nextTick(function () {
            this.getdatabar();
            this.getdata();
        })
    },
    methods:{
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`
            } else if( type === 'day'){
                return `${value}日`
            }
            return value;
        },
        getdata(){

              //打开加载层
            this.$toast.loading({
                mask:true,
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在加载'
            });
            var datadd = {};
            datadd.api_token = getToken();
            datadd.baseid = getBaseId();
            datadd.class = this.typsed+1;
            datadd.type = this.serachtype + 1;
            datadd.time = this.searchValue;
            Mybase_env(datadd).then(success =>{
                // console.log(success);
                this.alldata = success.data.data;
                if(success.data.code==200){
                    if(this.typsed === 17){
                        this.contentName = [];
                        this.contentName.push('ph值-'+success.data.avg.phAvg);
                        this.contentName.push('浊度-'+success.data.avg.turbidAvg);
                        this.contentName.push('汞含量-'+success.data.avg.mercuryAvg);
                        this.contentName.push('砷含量-'+success.data.avg.arsenicAvg);
                        this.contentName.push('镉含量-'+success.data.avg.cadmiumAvg);
                        this.contentName.push('铅含量-'+success.data.avg.leadAvg);
                        this.contentName.push('硌含量-'+success.data.avg.largeAvg);
                        this.contentName.push('氟化物-'+success.data.avg.fluorineAvg);
                        this.contentName.push('六价硌-'+success.data.avg.sexavalAvg);
                        this.currentDatecontent = this.contentName[0];
                        var dsta = [];
                        for(let i in success.data.data){
                            dsta.push(i.ph);
                        }
                        this.getdatabar(dsta);
                    }else if(this.typsed == 18){
                        this.contentName = [];
                        this.contentName.push('土壤ph-'+success.data.avg.phAvg);
                        this.contentName.push('氮含量-'+success.data.avg.nitrogenAvg);
                        this.contentName.push('钾含量-'+success.data.avg.potassiumAvg);
                        this.contentName.push('磷含量-'+success.data.avg.phosphorAvg);
                        this.contentName.push('汞含量-'+success.data.avg.mercuryAvg);
                        this.contentName.push('砷含量-'+success.data.avg.arsenicAvg);
                        this.contentName.push('镉含量-'+success.data.avg.cadmiumAvg);
                        this.contentName.push('铅含量-'+success.data.avg.leadAvg);
                        this.contentName.push('铜含量-'+success.data.avg.copperAvg);
                        this.contentName.push('硌含量-'+success.data.avg.largeAvg);
                        this.currentDatecontent = this.contentName[0];
                        var dsta = [];
                        for(let i in success.data.data){
                            dsta[i]=success.data.data[i].ph;
                        }
                        this.getdatabar(dsta);
                    }else{
                        this.getdatabar(success.data.data);
                    }
                }else{
                    this.$toast.fail('暂无数据');
                }
                this.$toast.clear();//关闭加载层
            }).catch(err =>{
                this.$toast.clear();//关闭加载层
                // console.log(err);
            })
        },
        getdatabar(datas){
            // console.log(datas,'ppp');
            if(this.timers08 !== ''){
                clearInterval(this.timers08);
            }
            var data = [];
            var titlename = [];
           
            for(let i in datas){
                data.push(datas[i]);
                if(this.serachtype == 0){
                    titlename.push(i+'月');
                    document.getElementsByClassName('barsd')[0].style.height = '100%';
                }else if(this.serachtype == 1){
                    titlename.push(i+'日');
                    document.getElementsByClassName('barsd')[0].style.height = '135%';
                }else if(this.serachtype == 2){
                    titlename.push(i+'时');
                    document.getElementsByClassName('barsd')[0].style.height = '120%';
                }
            }
            // console.log(document.getElementById('echartsbar'))
            var myEcharts = echarts.init(document.getElementById('echartsbar'));
            var myColor = [
                    '#1089E7', '#F57474', '#56D0E3', '#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6', '#F8B448', '#8B78F6',
                    '#1089E7', '#F57474', '#56D0E3', '#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6', '#F8B448', '#8B78F6',
                    '#1089E7', '#F57474', '#56D0E3', '#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6', '#F8B448', '#8B78F6'
            ];
            let option = {
                backgroundColor: '#fff',
                //图标位置
                grid: {
                    top: '1%',
                    left: '18%'

                },
                xAxis: {
                    show: false
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow',
                    }
                },
                yAxis: [{
                    show: true,
                    data: titlename,
                    inverse: true,
                    axisLine: {
                        show: true,
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        color: '#333',
                        // formatter: (value, index) => {
                        //     return [value].join('\n')
                        // },
                        formatter: function (value) {
                            return (value.length > 4 ? (value.slice(0,4)+"...") : value )
                        },
                    },
                }],
                series: [{
                        type: 'bar',
                        yAxisIndex: 0,
                        data: data,
                        barWidth: 10,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: '#333',
                                    fontSize: '16',
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: function(params) {
                                    var num = myColor.length;
                                    return myColor[params.dataIndex % num]
                                },
                                // 渐变色
                                // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    // offset: 0,
                                    // color: 'rgba(0,255,0)'
                                // }, {
                                    // offset: 1,
                                    // color: 'rgb(215 ,255,0)'
                                // }]),
                                
                            }
                        },

                    },
                ]
            };
           
            myEcharts.setOption(option);
            myEcharts.resize();
            window.addEventListener('resize',function() {myEcharts.resize()});
            // var index0_8 = 0; //播放所在下标
			// this.timers08 = setInterval(function () {
			// 	myEcharts.dispatchAction({
			// 		type: 'showTip',
			// 		seriesIndex: 0,
			// 		dataIndex: index0_8
			// 	});
			// 	index0_8++;
			// 	if (index0_8 > titlename.length) {
			// 		index0_8 = 0;
			// 	}
			// }, 2000);
        },
        searchOpenBtn(){
            this.searchTabShow = true;
        },
        // 搜索
        onSearchInput(){
            if(this.serachtype == 0){
                this.yeaysTabShow = true
            }else if(this.serachtype == 1){
                this.mountsTabShow = true;
            }else if(this.serachtype == 2){
                this.daysTabShow = true;
            }
        },
        contentselect(){
            this.contentTabShow = true;
        },
        onSearchBtn(){
            this.getdata();
        },
        confirmTime(){

        },
        // 含量选择
        onConfirmcontent(value,index){
            this.currentDatecontent = value
            this.curdataindex = index;
            // console.log(value,index);
            if(this.typsed == 17){
                if(index === 0){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].ph;
                    }
                    this.getdatabar(dsta);
                }else if(index === 1){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].turbid;
                    }
                    this.getdatabar(dsta)
                }else if(index === 2){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].mercury;
                    }
                    this.getdatabar(dsta)
                }else if(index === 3){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].arsenic;
                    }
                    this.getdatabar(dsta)
                }else if(index === 4){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].cadmium;
                    }
                    this.getdatabar(dsta)
                }else if(index === 5){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].lead;
                    }
                    this.getdatabar(dsta)
                }else if(index === 6){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].large;
                    }
                    this.getdatabar(dsta)
                }else if(index === 7){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].fluorine;
                    }
                    this.getdatabar(dsta)
                }else if(index === 8){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].sexaval;
                    }
                    this.getdatabar(dsta)
                }
            }else if(this.typsed == 18){
                 if(index === 0){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].ph;
                    }
                    this.getdatabar(dsta);
                }else if(index === 1){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].nitrogen;
                    }
                    this.getdatabar(dsta)
                }else if(index === 2){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].potassium;
                    }
                    this.getdatabar(dsta)
                }else if(index === 3){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].phosphor;
                    }
                    this.getdatabar(dsta)
                }else if(index === 4){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].mercury;
                    }
                    this.getdatabar(dsta)
                }else if(index === 5){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].arsenic;
                    }
                    this.getdatabar(dsta)
                }else if(index === 6){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].cadmium;
                    }
                    this.getdatabar(dsta)
                }else if(index === 7){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].lead;
                    }
                    this.getdatabar(dsta)
                }else if(index === 8){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].copper;
                    }
                    this.getdatabar(dsta)
                }else if(index === 9){
                    var dsta = [];
                    for(let i in this.alldata){
                        dsta[i] = this.alldata[i].large;
                    }
                    this.getdatabar(dsta)
                }
            }
            this.contentTabShow = false;
            
        },
        onChangedays(value){
            this.searchValue = this.dateFormat('YY-mm-dd HH:MM',value);
            this.getdata();
            this.daysTabShow = false;
        },
        onConfirmSearch(value,index){
            this.searchTabShow = false;
            this.labelName = value;
            this.searchValue = '';
            this.serachtype = index;
        },
        onChangemount(value,index){
            this.searchValue = this.dateFormat('YY-mm',value);
            this.getdata();
            this.mountsTabShow = false;
        },
        onConfirmyeays(value){
            this.searchValue = value;
            this.yeaysTabShow = false;
            this.getdata();
        },
        // 时间格式化
        dateFormat(fmt, date) {
            let ret;
            let opt = {
                "Y+": date.getFullYear().toString(),        // 年
                "m+": (date.getMonth() + 1).toString(),     // 月
                "d+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "M+": date.getMinutes().toString(),         // 分
                "S+": date.getSeconds().toString()          // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        },
        cancelPopup(){
            this.popupTimeShow  = false;
            this.searchTabShow = false;
            this.yeaysTabShow = false;
            this.mountsTabShow = false;
            this.daysTabShow = false;
            this.contentTabShow = false;
        }
    },
    destroyed(){
        localStorage.removeItem('detailinfor');
        clearInterval(this.timers08);
    }
}
</script>
<style scoped>
.barsd{
    /* padding-top: 48px; */
    height: 100%;
    /* transform: rotate(90deg); */
    /* -ms-transform: rotate(90deg);*//* IE 9 */
}
#echartsbar {
    height:100%;
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
/* .pupzindex{
    z-index: 10000001 ;
}
.van-overlay{
    z-index: 10000000 !important;
} */
.mainTopNoneBox{height:48px;}

</style>
<style>
    .searchTabNameBox .van-search__label{
        padding-right:20px;
    }
    /* .van-popup--bottom,.van-toast{
        z-index: 10000001 !important;
    }
    .van-overlay{
        z-index: 10000000 !important;
    } */
    
    /* 100000000 */
</style>