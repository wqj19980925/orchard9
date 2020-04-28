<template>
  <div class="app-container">
    <el-row>
      <el-row :gutter="20" class="app-top" v-if="!addshow">
        <div class="titleStyle" @click="showtitle" v-if="titleTop">
          <el-col :span="20">
            <div class="titlethisOne">【消息】{{titleTop}}</div>
          </el-col>
          <el-col :span="4">{{titleTime}}</el-col>
        </div>
        <el-col :span="18" style="padding-left: 0px;">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="Commodity_management">
                <p class="survry-p">商品管理</p>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="left">
                      <img src="../../../static/img/summaryPage/goods_icon_01.png" alt />
                    </div>
                    <p>品类数量</p>
                    <span class="content_font" @click="jumpPages('/Goods/GooClassifiindex')" v-if="goods.class_num">{{goods.class_num}}</span>
                    <span class="content_font" @click="jumpPages('/Goods/GooClassifiindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="left">
                      <img src="../../../static/img/summaryPage/goods_icon_02.png" alt />
                    </div>
                    <p>商品数量</p>
                    <span class="content_font" @click="jumpPages('/Goods/Goodsindex')" v-if="goods.goods_num">{{goods.goods_num}}</span>
                    <span class="content_font" @click="jumpPages('/Goods/Goodsindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="12" class>
                  <div class="content_popthis commodity_two">
                    <div class="main_content" align="left">
                      <img src="../../../static/img/summaryPage/goods_icon_03.png" alt />
                    </div>
                    <p>导航数量</p>
                    <span class="content_font" @click="jumpPages('/Goods/Navigationindex')" v-if="goods.nav_num">{{goods.nav_num}}</span>
                    <span class="content_font" @click="jumpPages('/Goods/Navigationindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="12" class>
                  <div class="content_popthis commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/goods_icon_04.png" alt />
                    </div>
                    <p>反馈建议</p>
                    <span class="content_font" @click="jumpPages('/Complain/Feedbackindex')" v-if="goods.feedback_num">{{goods.feedback_num}}</span>
                    <span class="content_font" @click="jumpPages('/Complain/Feedbackindex')" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="Commodity_management">
                <p class="survry-p">人员管理</p>
                <el-col :span="8" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/staff_icon_01.png" alt />
                    </div>
                    <p>农户数量</p>
                    <span class="content_font" @click="jumpPages('/Personnel/Farmerindex')" v-if="crew.farmer_num">{{crew.farmer_num}}</span>
                    <span class="content_font" @click="jumpPages('/Personnel/Farmerindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="8" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/staff_icon_02.png" alt />
                    </div>
                    <p>职能分类</p>
                    <span class="content_font" @click="jumpPages('/Personnel/Sectionindex')" v-if="crew.section_num">{{crew.section_num}}</span>
                    <span class="content_font" @click="jumpPages('/Personnel/Sectionindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="8" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/staff_icon_03.png" alt />
                    </div>
                    <p>角色权限</p>
                    <span class="content_font" @click="jumpPages('/System/Roleroleindex')" v-if="crew.role_num">{{crew.role_num}}</span>
                    <span class="content_font" @click="jumpPages('/System/Roleroleindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="8" class>
                  <div class="content_popthis commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/staff_icon_04.png" alt />
                    </div>
                    <p>正式员工</p>
                    <span class="content_font" @click="jumpPages('/Personnel/Officialindex')" v-if="crew.official_num">{{crew.official_num}}</span>
                    <span class="content_font" @click="jumpPages('/Personnel/Officialindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="8" class>
                  <div class="content_popthis commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/staff_icon_05.png" alt />
                    </div>
                    <p>临时员工</p>
                    <span class="content_font" @click="jumpPages('/Personnel/Temporaryindex')" v-if="crew.temporary_num">{{crew.temporary_num}}</span>
                    <span class="content_font" @click="jumpPages('/Personnel/Temporaryindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="8" class>
                  <div class="content_popthis commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/staff_icon_06.png" alt />
                    </div>
                    <p>管理员</p>
                    <span class="content_font" @click="jumpPages('/System/Manageindex')" v-if="crew.admin_num">{{crew.admin_num}}</span>
                    <span class="content_font" @click="jumpPages('/System/Manageindex')" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="Commodity_management">
                <p class="survry-p">农事任务</p>
                <el-col :span="24" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/task_icon_01.png" alt />
                    </div>
                    <p>任务分配</p>
                    <span class="content_font" @click="jumpPages('/Farmwork/FarmingTaskindex')" v-if="task.task_num">{{task.task_num}}</span>
                    <span class="content_font" @click="jumpPages('/Farmwork/FarmingTaskindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="24" class>
                  <div class="content_popthis commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/task_icon_02.png" alt />
                    </div>
                    <p>未完成</p>
                    <span class="content_font" v-if="task.undone_num">{{task.undone_num}}</span>
                    <span class="content_font" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="order_management">
                <p class="survry-p">果园管理</p>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/base_icon_01.png" alt />
                    </div>
                    <p>果园数量</p>
                    <span class="content_font" @click="jumpPages('/Massif/Digitalmapindex')" v-if="base.region_num">{{base.region_num}}</span>
                    <span class="content_font" @click="jumpPages('/Massif/Digitalmapindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/base_icon_02.png" alt />
                    </div>
                    <p>设备数量</p>
                    <span class="content_font" v-if="base.common_num">{{base.common_num}}</span>
                    <span class="content_font" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="order_management">
                <p class="survry-p">生产管理</p>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/produce_icon_01.png" alt />
                    </div>
                    <p>生产中</p>
                    <span class="content_font" v-if="produc.product_num">{{produc.product_num}}</span>
                    <span class="content_font" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/produce_icon_02.png" alt />
                    </div>
                    <p>二维码列表</p>
                    <span class="content_font" @click="jumpPages('/CodeManageindex/CodeManageindex')" v-if="produc.apply_num">{{produc.apply_num}}</span>
                    <span class="content_font" @click="jumpPages('/CodeManageindex/CodeManageindex')" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="order_management">
                <p class="survry-p">产品质检</p>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/testing_icon_01.png" alt />
                    </div>
                    <p>产品质检</p>
                    <span class="content_font addButton" @click="choseTab(1)">新增</span>
                  </div>
                </el-col>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/testing_icon_02.png" alt />
                    </div>
                    <p>异常处理</p>
                    <span class="content_font" @click="jumpPages('/Product/Abnormalindex')" v-if="quality.control_num">{{quality.control_num}}</span>
                    <span class="content_font" @click="jumpPages('/Product/Abnormalindex')" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="9">
              <div class="order_management">
                <p class="survry-p">冷库管理</p>
                <el-col :span="12" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/wareh_icon_01.png" alt />
                    </div>
                    <p>冷库数量</p>
                    <span class="content_font" @click="jumpPages('/Ware/Wareyunlist')" v-if="ware.repertory_num">{{ware.repertory_num}}</span>
                    <span class="content_font" @click="jumpPages('/Ware/Wareyunlist')" v-else>0</span>
                  </div>
                </el-col>
                <!-- <el-col :span="6" class>
                  <div class="commodity_two secondImg">
                    <img src="../../../static/img/summaryPage/wareh_icon_02.png" alt />
                    <p>待出库</p>
                    <span class="content_font" v-if="ware.deliver_num">{{ware.deliver_num}}</span>
                    <span class="content_font" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="6" class>
                  <div class="commodity_two secondImg">
                    <img src="../../../static/img/summaryPage/wareh_icon_03.png" alt />
                    <p>待入库</p>
                    <span class="content_font" v-if="ware.receipt_num">{{ware.receipt_num}}</span>
                    <span class="content_font" v-else>0</span>
                  </div>
                </el-col> -->
                <el-col :span="12" class>
                  <div class="commodity_two secondImg">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/wareh_icon_05.png" alt />
                    </div>
                    <p>仓库报损</p>
                    <span class="content_font red" v-if="ware.loss_num">{{ware.loss_num}}</span>
                    <span class="content_font red" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="15">
              <div class="order_management">
                <p class="survry-p">苗木管理</p>
                <el-col :span="8" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/seedling_icon_01.png" alt />
                    </div>
                    <p>苗木列表</p>
                    <span class="content_font" @click="jumpPages('/Seedling/Nurseryindex')" v-if="nursery.nursery_num">{{nursery.nursery_num}}</span>
                    <span class="content_font" @click="jumpPages('/Seedling/Nurseryindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="8" class>
                  <div class="commodity_two secondImg">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/seedling_icon_02.png" alt />
                    </div>
                    <p>砧木数量</p>
                    <span class="content_font" v-if="nursery.zm_num">{{nursery.zm_num}}</span>
                    <span class="content_font" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="8" class>
                  <div class="commodity_two secondImg">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/seedling_icon_03.png" alt />
                    </div>
                    <p>芽枝数量</p>
                    <span class="content_font" v-if="nursery.yz_num">{{nursery.yz_num}}</span>
                    <span class="content_font" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="order_management">
                <p class="survry-p">农资库存量</p>
                <el-col :span="4" class>
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img src="../../../static/img/summaryPage/material_icon_01.png" alt />
                    </div>
                    <p>农资品类</p>
                    <span class="content_font" @click="jumpPages('/Agric/AgrClassindex')" v-if="agric.class_num">{{agric.class_num}}</span>
                    <span class="content_font" @click="jumpPages('/Agric/AgrClassindex')" v-else>0</span>
                  </div>
                </el-col>
                <el-col :span="4" :offset="1" class v-for="item in agric.most_num">
                  <div class="commodity_two">
                    <div class="main_content" align="center">
                      <img :src="item.img" alt />
                    </div>
                    <p v-if="item.acl_name">{{item.acl_name}}</p>
                    <span class="content_font" v-if="item.acl_total">{{item.acl_total}}</span>
                    <span class="content_font" v-else>0</span>
                  </div>
                </el-col>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="Commodity_management askshow">
          <el-row :gutter="20" class="app-center">
            <el-row class="right-title">
              <el-col
                v-for="(item,index) in tab"
                :key="index"
                :class="{textborder:index==num}"
                :span="12"
                class="title-text titlecity"
                @click.native="demoClick(index)"
              >{{ item }}</el-col>
            </el-row>
            <el-row class="title">
              <el-col :span="12" class="title-one">
                <div v-if="citynum===1">
                  <i />
                </div>
              </el-col>
              <el-col :span="12" class="title-two">
                <div v-if="citynum===2">
                  <i />
                </div>
              </el-col>
            </el-row>
            <el-row class="lisrt">
              <div v-if="list.length !=0">
                <div id="charts" class="chartsbar" />
                <!-- <el-row v-for="(item,index) in list" :key="index"  >
                      <el-col :span="12" class="list-text">{{ item.name}}</el-col>
                      <el-col :span="12" class="list-text1">{{ item.count }}</el-col>
                </el-row>-->
              </div>
              <div v-else class="nodata-text">暂无数据</div>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <lineChart :info-id="info_id" @listerToChild="showList()" v-if="addshow" />
  </div>
</template>

<script>
import { topTipList, homeList, topDetail } from "@/api/goods";
// import { Survey } from '@/api/dashboard'
import lineChart from "./components/lineChart";
import { getUserid } from "@/utils/auth";
import { errorStatus } from "@/utils/index";

// // 引入基本模板
require("echarts/lib/echarts");
// // 引入柱状图组件
require("echarts/lib/chart/bar");
// // 引入饼图组件
// require("echarts/lib/chart/pie");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");

require("echarts/lib/component/title");

export default {
  name: "Dashboard",
  components: { lineChart },
  data() {
    return {
      goods: {},
      crew: {},
      task: {},
      base: {},
      produc: {},
      quality: {},
      ware: {},
      nursery: {},
      agric: {},

      info_id: "",
      titleList: [],
      titleTop: "",
      titleTime: "",
      formList: {},
      ware: {
        ware_sum: 0,
        ware_product: 0,
        ware_artially: 0,
        ware_material: 0
      },
      lisd: [],
      addshow: false,
      tab: ["城市查询量", "商品查询量"],
      num: 0,
      date: [],
      width: 0,
      citynum: 1,
      list: [],
      list2: [],
      img: [
        { src: "../../../static/img/summaryPage/material_icon_02.png" },
        { src: "../../../static/img/summaryPage/material_icon_03.png" },
        { src: "../../../static/img/summaryPage/material_icon_04.png" },
        { src: "../../../static/img/summaryPage/material_icon_05.png" }
      ]
    };
  },
  created() {},
  mounted() {
    this.gettitle();
    // this.echarts();
  },
  methods: {
    gettitle() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      topTipList(data)
        .then(response => {
          loading.close();
          // console.log("addClass---", response);
          if (errorStatus(response.data)) {
            if (response.data.data.length !== 0) {
              this.titleList = response.data.data;
              this.titleTop = this.titleList[0].info_title;
              this.titleTime = this.titleList[0].info_issue_time;
              this.info_id = this.titleList[0].info_id;
            }

            // for(var i in this.titleList){
            //   if(this.titleList[i].info_top===0){

            //   }
            // }
          }
        })
        .catch(err => {
          loading.close();
          console.log("/err", err);
          this.$message.error("请求失败!");
        });
      homeList(data)
        .then(response => {
          loading.close();
          // console.log("addClass---", response);
          if (errorStatus(response.data)) {
            this.goods = response.data.data.goods;
            this.crew = response.data.data.crew;
            this.task = response.data.data.task;
            this.base = response.data.data.base;
            this.quality = response.data.data.quality;
            this.ware = response.data.data.ware;
            this.nursery = response.data.data.nursery;
            this.agric = response.data.data.agric;
            this.produc = response.data.data.produc;
            this.city = response.data.data.city;
            this.goo = response.data.data.goo;
            var img = "img";
            for (var i in this.agric.most_num) {
              if (this.agric.most_num.length === 4) {
                this.agric.most_num[i][img] = this.img[i].src;
              }
            }
            console.log(this.agric.most_num);
            this.list2 = response.data.data.goo;
            this.listd = response.data.data.city;
            this.list = this.listd;
            this.$nextTick(() => {
              this.echarts2(this.list);
            });
          }
        })
        .catch(err => {
          loading.close();
          console.log("/err", err);
          this.$message.error("请求失败!");
        });
    },
    choseTab(type) {
      this.$router.push("../Product/Controlindex");
    },
    demoClick(index) {
      // console.log('typeOf--',typeof(index));
      if (index === 0) {
        this.list = this.listd;
        this.citynum = 1;
        // console.log("list-0--",this.listd)
      } else if (index === 1) {
        this.list = this.list2;
        this.citynum = 2;
        //  console.log("list-1--",this.list2)
      }
      this.num = index;
      this.echarts2(this.list);
      // this.echarts1()
    },

    echarts2(data) {
      const countList = [];
      const nameList = [];
      const numList = [];
      for (var i in data) {
        countList.unshift(data[i].count);
        nameList.unshift(data[i].name);
      }
      var max = countList[0];
      for (var j in countList) {
        if (countList[j] > max) {
          max = countList[j];
        }
      }
      for (var k in countList) {
        numList.unshift(max);
      }
      var data = {
        countList: countList,
        nameList: nameList,
        numList: numList
      };
      const MyChart02 = this.$echarts.init(document.getElementById("charts"));
      MyChart02.setOption({
        grid: {
          show: "true",
          top: "0",
          left: 100,
          borderWidth: "0"
        },
        xAxis: {
          show: false, //是否显示x轴
          type: "value"
        },
        yAxis: [
          {
            type: "category",
            inverse: true, //让y轴数据逆向
            axisLabel: {
              show: true,
              textStyle: {
                color: "#000" //y轴字体颜色
              },
              formatter: function(value, index) {
                return ["{title|" + value + "} "].join("\n");
              },
              //定义富文本标签
              rich: {
                title: {
                  color: "#000",
                  fontSize: 14,
                  fontWeight: "normal"
                }
              }
            },
            splitLine: { show: false }, //横向的线
            axisTick: { show: false }, //y轴的端点
            axisLine: { show: false }, //y轴的线
            data: data.nameList
          }
        ],
        series: [
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "right",
                color: "#000",
                fontSize: 20,
                formatter: function(param) {
                  return data.countList[param.dataIndex];
                }
              }
            },
            barWidth: 5,
            itemStyle: {
              normal: {
                borderWidth: 1,
                barBorderRadius: 15,
                color: "#f0f2f5"
              }
            },
            z: 1,
            data: data.numList
            // data: da
          },
          {
            type: "bar",
            barGap: "-98%",
            barWidth: 5, //数据条宽度
            itemStyle: {
              normal: {
                barBorderRadius: 16,
                color: {
                  type: "linear",
                  x: 0,
                  x1: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#10b269"
                    },
                    {
                      offset: 1,
                      color: "#10b269"
                    }
                  ]
                }
              }
            },
            max: 1,

            labelLine: {
              show: true
            },
            z: 2,
            data: data.countList
          }
        ]
      });
      MyChart02.resize();
    },
    showtitle(data) {
      this.addshow = true;
    },
    showList() {
      this.addshow = false;
      this.gettitle();
    },
    // 点击数字跳转页面
    jumpPages(has) {
      console.log(has)
      this.$router.push({path: has})
    }
  }
};
</script>

<style scoped>
.nodata-text {
  line-height: 100px;
}
p {
  padding: 0;
  margin: 0;
}
.app-top {
  padding: 0 0 0 10px;
}
.bg-purple {
  width: 100%;
  background: #fff;
}
.survry-p {
  color: #303133;
  line-height: 50px;
  margin-left: 20px;
}
.Commodity {
  margin-top: 10px;
}
.Commodity_management {
  height: 240px;
  background: #fff;
  position: relative;
}
.askshow {
  min-height: 720px;
}
.commodity_one {
  font-size: 50px;
  margin-top: 25px;
  color: #409eff;
  display: block;
  overflow: hidden;
  text-align: center;
}
.commodity_two {
  display: block;
  font-size: 14px;
  color: #999;
  font-weight: 700;
  text-align: center;
}
.commodity_button {
  position: absolute;
  outline: none;
  cursor: pointer;
  right: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  border-radius: 26px;
  font-size: 20px;
  color: #fff;
  font-weight: 700;
  background: #409eff;
  border: 0;
}
.order_management {
  margin-top: 10px;
  height: 150px;
  background: #fff;
  position: relative;
}
.wareAndSeed {
  height: 180px;
}
.order-title {
  margin-top: 25px;
}
.order-text {
  height: 160px;
  background: #fff;
  margin-top: 10px;
  padding: 40px 0;
}
.order-one {
  text-align: center;
  height: 80px;
  border-right: 1px solid #999;
}

.secondImg img {
  width: 60px;
  height: 60px;
}
.titleStyle {
  background: #fffbe8;
  color: #ed6a0c;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  margin: -10px 0 10px 0;
  cursor: pointer;
}
.main_content {
  float: left;
}
.red {
  color: red !important;
}
.content_font {
  cursor: pointer;
  color: #000;
  font-weight: normal;
  font-size: 25px;
  line-height: 50px;
}
.addButton {
  cursor: pointer;
  font-size: 16px;
  color: #409eff;
}
.content_popthis {
  margin-top: 30px;
}
.app-center {
  padding: 20px;
  padding-top: 0;
  overflow: hidden;
}
.center-right {
  height: 300px;
  padding: 10px 0;
  width: 23%;
  margin-left: 10px;
  background: #fff;
}
.right-title {
  padding-bottom: 5px;
}
.title-text {
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  font-weight: bold;
}
.titlecity {
  font-size: 15px;
  font-weight: normal;
}
.textborder {
  color: #000;
}
.chartsbar {
  height: 750px;
  width: 300px;
}
.title {
  height: 1px;
  text-align: center;
}
.title-one i {
  border-top: 2px solid #00c957;
  display: block;
  width: 35%;
  margin-left: 35%;
}
.title-two i {
  border-top: 2px solid #00c957;
  display: block;
  width: 35%;
  margin-left: 135%;
}

.lisrt {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.list-text {
  margin: 15px 0;
  line-height: 16px;
  font-size: 15px;
  color: #000;
}
.list-text1 {
  margin: 15px 0;
  line-height: 16px;
  font-size: 19px;
  color: #000;
}
.titlethisOne {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}
</stylescoped>

