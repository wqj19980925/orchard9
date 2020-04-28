<template>
  <div class="app-survey">
    <el-row v-if="!addshow">
      <el-row :gutter="20" class="app-top">
        <el-col :span="8">
          <el-row :gutter="5">
            <p class="survry-p">商品管理</p>
          </el-row>
          <el-row :model="alldata" class="Commodity">
            <el-col :span="7" class="Commodity_management">
              <p class="commodity_one Num">{{ alldata.class_number }}</p>
              <p class="commodity_two">商品分类</p>
              <button class="commodity_button" @click="addClasClick()">+</button>
            </el-col>
            <el-col :span="7" class="Commodity_management">
              <p class="commodity_one Num">{{ alldata.goods_number }}</p>
              <p class="commodity_two">商品数量</p>
              <button class="commodity_button" @click="addShop()">+</button>
            </el-col>
            <el-col :span="7" class="Commodity_management">
              <p class="commodity_one Num">{{ alldata.formwork_number }}</p>
              <p class="commodity_two">溯源信息</p>
              <button class="commodity_button" @click="addInformation()">+</button>
            </el-col>
          </el-row>
          <el-row class="order-management">
            <el-row :gutter="5" class="order-title">
              <p class="survry-p">订单管理</p>
            </el-row>
            <el-row class="order-text">
              <el-col :span="6" class="order-one">
                <p class="text-one Num">{{ dataall.new_order }}</p>
                <p class="text-two">新订单</p>
              </el-col>
              <el-col :span="6" class="order-one">
                <p class="text-one Num">{{ dataall.apply_order }}</p>
                <p class="text-two">未出库申请</p>
              </el-col>
              <el-col :span="6" class="order-one">
                <p class="text-one Num">{{ dataall.out_order }}</p>
                <p class="text-two">待入库</p>
              </el-col>
              <el-col :span="6" class="order-one">
                <p class="text-one Num">{{ dataall.info_order }}</p>
                <p class="text-two">待出库</p>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row :gutter="5">
            <p class="survry-p">商品发码量</p>
          </el-row>
          <el-row class="hair-code">
            <div v-if="pieData" class="nodata-img">
              <img src="../../../assets/img/nodata.png" alt style class="img_nodata">
            </div>
            <div v-else id="myChart" class="myChart"/>
          </el-row>
        </el-col>

        <el-col :span="6">
          <!-- <el-row :gutter="5">
          <p class="survry-p">地块管理</p>
        </el-row>
        <el-row class="massif">
             <el-col :span="12" class="massif-text">
              <p class="massif-one Num">21</p>
              <p class="massif-two">新订单</p>
            </el-col>
            <el-col :span="12" class="massif-text">
               <p class="massif-one Num">2</p>
               <p class="massif-two">未出库申请</p>
            </el-col>
        </el-row>
          -->
          <el-row :gutter="5" class="Warehouse">
            <p class="survry-p">云仓管理</p>
          </el-row>
          <el-row class="Ware-list">
            <el-row>
              <el-col :span="12" class="Ware ware-border">
                <p class="massif-one Num">{{ ware.ware_sum }}</p>
                <p class="massif-two Ware-two">全部</p>
              </el-col>
              <el-col :span="12" class="Ware">
                <p class="massif-one Num">{{ ware.ware_product }}</p>
                <p class="massif-two Ware-two">成品库</p>
              </el-col>
            </el-row>
            <el-row class="boederes">
              <el-col :span="12" class="boederes-one">
                <i/>
              </el-col>
              <el-col :span="12" class="boederes-one">
                <i/>
              </el-col>
            </el-row>
            <el-row class="waread">
              <el-col :span="12" class="Ware ware-border">
                <p class="massif-one Num">{{ ware.ware_artially }}</p>
                <p class="massif-two Ware-two">半成品库</p>
              </el-col>
              <el-col :span="12" class="Ware">
                <p class="massif-one Num">{{ ware.ware_material }}</p>
                <p class="massif-two Ware-two">原料库</p>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="app-center">
        <el-col :span="16" class="center-left">
          <div id="charts-bar" class="charts-bar"/>
        </el-col>
        <el-col :span="5" class="center-right">
          <el-row class="right-title">
            <el-col
              v-for="(item,index) in tab"
              :key="index"
              :class="{textborder:index==num}"
              :span="12"
              class="title-text"
              @click.native="demoClick(index)"
            >{{ item }}</el-col>
            <!--    <el-col class="title-text"   @click="tab(1)" :span="12">商品查询量</el-col>-->
          </el-row>
          <el-row class="title">
            <el-col :span="12" class="title-one">
              <i/>
            </el-col>
            <el-col :span="12" class="title-one">
              <i/>
            </el-col>
          </el-row>
          <el-row class="lisrt">
            <el-row v-for="(item,index) in list" :key="index" class="list-text">
              <el-col :span="12">{{ item.name }}</el-col>
              <el-col :span="12">{{ item.value }}</el-col>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <addgoods
      v-if="addshows"
      :edit-id="edit_id"
      :ed-retrue="edretrue"
      @listerToChild="showListPages()"
    />
    <addtrace v-if="addInfor" :edit-id="edit_id" @listerToChild="showinfor()"/>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="showAddClas"
      title="新增分类"
      width="500px"
      @close="cancleForm('addClaForm')"
    >
      <el-form ref="addClaForm" :model="addClaForm" :rules="addClaRules" label-width="80px">
        <el-form-item label="分类名称" prop="cla_name">
          <el-input
            v-model="addClaForm.cla_name"
            style="width:200px;"
            placeholder="分类名称20字以内"
            max="20"
          />
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-select v-model="addClaForm.cla_stase" class>
            <el-option v-for="item in diaState" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addClaForm')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('addClaForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addClass } from '@/api/goods'
// import { Survey } from '@/api/dashboard'
import { getUserid } from '@/utils/auth'
import { errorStatus } from '@/utils/index'
import Addgoods from '../../goodsAdmin/component/addGoods'
import addtrace from '../../traceAdmin/components/addTrace'

// 引入基本模板
require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入饼图组件
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')

require('echarts/lib/component/title')

export default {
  name: 'TopList',
  components: { Addgoods, addtrace },
  data() {
    return {
      alldata: {
        class_number: 0,
        goods_number: 0,
        formwork_number: 0
      },
      dataall: {
        new_order: 0,
        apply_order: 0,
        out_order: 0,
        info_order: 0
      },
      ware: {
        ware_sum: 0,
        ware_product: 0,
        ware_artially: 0,
        ware_material: 0
      },
      addClaForm: {
        cla_name: '',
        cla_stase: '',
        cla_id: null
      },
      addClaRules: {
        cla_name: [
          { required: true, trigger: 'blur', message: '分类名称不能为空' }
        ]
      },
      diaState: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      showAddClas: false,
      lisd: [],
      addshow: false,
      addshows: false,
      addInfor: false,
      listd: null,
      tab: ['城市查询量', '商品查询量'],
      num: 0,
      date: [],
      edit_id: 0,
      edretrue: 0,
      lid: 1,
      width: 0,
      yMax: 0,
      list: [],
      list2: [],
      order_count: [],
      send_count: [],
      select_count: [],
      pieData: true,
      cityData: true,
      goodsData: true
    }
  },
  // created() {
  //   if (!this.addshow) {
  //     setInterval(() => {
  //       var o = document.getElementById("myChart");
  //       var h = o.offsetHeight; //高度
  //       var w = o.offsetWidth; //宽度
  //       if (this.width != w) {
  //         this.echarts2();
  //         this.width = w;
  //       } else {
  //         return false;
  //       }
  //       // console.log(h, w);
  //     }, 100);
  //   }
  // },
  mounted() {
    // this.allData() // 获取数据
    // console.log("this.addshow---", this.addshow);

    this.addGoods() // 商品与城市切换
    // this.echarts();
  },
  methods: {
    addGoods() {
      this.listd = this.list
    },
    //
    showListPages() {
      this.addshow = false
      this.addshows = false
      // this.allData()
    },
    showinfor() {
      this.addshow = false
      this.addshows = false
      this.addInfor = false
      // this.allData()
    },
    // 新增溯源信息
    addInformation() {
      this.addshow = true
      this.addshows = false
      this.addInfor = true
      this.edit_id = 0
    },

    // 新增分类
    addClasClick() {
      this.addClaSta = 1
      this.showAddClas = true
      this.AddClastitle = '新增分类'
    },
    // 添加商品
    addShop() {
      this.addshow = true
      this.addshows = true
      this.edit_id = 0
      this.edreture = 2
    },
    // 弹窗-增加-提交
    addsubBtn(formName) {
      // console.log("login--", this.addClaForm);
      const addClas = this.addClaForm
      if (addClas.cla_name === '') {
        this.$message.error('请输入分类名称!')
        return false
      } else {
        if (addClas.cla_stase === '启用') {
          addClas.cla_stase = 1
        }
        addClas.adm_id = getUserid() // userid
        delete addClas.cla_id
        addClass(addClas)
          .then(response => {
            // console.log("addClass---", response);
            if (errorStatus(response.data)) {
              this.$message.success('提交成功!')
              this.showAddClas = false
              this.$refs[formName].resetFields()
              this.addClaForm.cla_name = ''
              this.addClaForm.cla_id = ''
              this.addClaForm.cla_stase = this.diaState[0].name
              // this.allData()
            }
          })
          .catch(err => {
            console.log('/err', err)
            this.$message.error('请求失败!')
          })
      }
    },
    // // 获取数据
    // allData() {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    //   const _this = this
    //   const data = {}
    //   Survey(data)
    //     .then(response => {
    //       loading.close()
    //       console.log('获取首页数据--', response.data.data)
    //       const dataRep = response.data.data

    //       // if (dataRep.piechart_state !== 0) {
    //       //   _this.pieData = false;
    //       // }

    //       _this.alldata = dataRep.goods
    //       _this.dataall = dataRep.order
    //       _this.ware = dataRep.ware
    //       _this.lisd = []
    //       _this.list = []
    //       _this.list2 = []
    //       _this.select_count = []
    //       _this.send_count = []
    //       _this.order_count = []
    //       _this.date = []
    //       for (const i in dataRep.piechart) {
    //         _this.lisd.push({
    //           name: dataRep.piechart[i].goods_name,
    //           value: response.data.data.piechart[i].number
    //         })
    //       }
    //       for (const i in response.data.data.city_count) {
    //         _this.list.push({
    //           name: response.data.data.city_count[i].city,
    //           value: response.data.data.city_count[i].number
    //         })
    //       }
    //       for (const i in response.data.data.goods_count) {
    //         _this.list2.push({
    //           name: response.data.data.goods_count[i].goods_name,
    //           value: response.data.data.goods_count[i].number
    //         })
    //       }
    //       for (const i in response.data.data.year_count) {
    //         _this.date.push(i + 1 + '月')
    //         _this.order_count.push(response.data.data.year_count[i].order_count)
    //         _this.send_count.push(response.data.data.year_count[i].send_count)
    //         _this.select_count.push(
    //           response.data.data.year_count[i].select_count
    //         )
    //       }
    //       _this.echarts1()
    //       _this.echarts2()
    //     })
    //     .catch(Error => {
    //       loading.close()
    //       console.log('error---', Error)
    //     })
    // },
    cancleForm(formName) {
      this.showAddClas = false
      this.$refs[formName].resetFields()
      this.addClaForm.cla_name = ''
      this.addClaForm.cla_id = ''
      this.addClaForm.cla_stase = this.diaState[0].name
    },
    demoClick(index) {
      // console.log('typeOf--',typeof(index));
      if (index === 0) {
        this.list = this.listd
      } else if (index === 1) {
        this.list = this.list2
      }
      this.num = index
    },
    echarts1() {
      const MyChart = this.$echarts.init(document.getElementById('myChart'))

      MyChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },

        calculable: true,

        series: [
          {
            color: ['#6777bb', '#1db8af', '#f8a643', '#40e9fa', '#baa366'],
            // name: '销量',
            // roseType : 'radius',
            type: 'pie',
            data: this.lisd.sort(function(a, b) {
              return a.value - b.value
            })
          }
        ],
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{b} : {c} ({d}%)'
            },
            labelLine: { show: true }
          }
        }
      })

      MyChart.resize()
    },
    echarts2() {
      const MyChart02 = this.$echarts.init(
        document.getElementById('charts-bar')
      )

      MyChart02.setOption({
        color: ['#409eff', '#1db8af', '#f8a643'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['订单量', '发码量', '查询量'],
          x: 'center',
          // y:20
          top: 20
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            // type : 'category',
            data: this.date
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '订单量',
            type: 'line',
            data: this.order_count
          },
          {
            name: '发码量',
            type: 'bar',
            width: '25%',
            data: this.send_count
          },
          {
            name: '查询量',
            type: 'bar',
            width: '20%',
            data: this.select_count
          }
        ]
      })
      MyChart02.resize()
    }
    //  setInterval(function(){
    //   //        let MyChart = this.$echarts.init(document.getElementById('myChart'));
    //   //  let MyChart02 = this.$echarts.init(document.getElementById("charts-bar"));
    //       console.log("fsd");
    //       echarts()
    //       // MyChart.resize();
    //       // MyChart02.resize();
    //     },1)
  }
}
</script>

<style scoped>
/* .no_data{
  color:
} */
p {
  padding: 0;
  margin: 0;
}
.app-top {
  padding: 20px;
}
.bg-purple {
  width: 100%;
  background: #fff;
}
.survry-p {
  font-size: 14px;
  color: #000;
}
.Commodity {
  margin-top: 10px;
}
.Commodity_management {
  height: 150px;
  background: #fff;
  position: relative;
  margin-left: 6.2%;
  border-bottom-right-radius: 36px;
}
.Commodity_management:nth-child(1) {
  margin-left: 0;
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
.order-one:nth-child(4) {
  border: 0;
}
.text-one {
  font-size: 47px;
  color: #409eff;
}
.text-two {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}
.hair-code {
  height: 360px;
  background: #fff;
  margin-top: 10px;
}
.hair-code .nodata-img {
  margin-top: 50px;
}
.hair-code .nodata-img .img_nodata {
  width: 250px;
  height: 200px;
  display: block;
  margin: 0 auto;
}
.myChart {
  width: 100%;
  height: 100%;
}
.massif {
  height: 100px;
  margin-top: 10px;
  background: #fff;
  padding: 20px 0;
}
.massif-text {
  text-align: center;
  height: 60px;
  border-right: 1px solid #999;
}
.massif-text:nth-child(2) {
  border: 0;
}
.massif-one {
  font-size: 35px;
  color: #409eff;
  font-weight: 700;
}
.massif-two {
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}
.Warehouse {
  // margin-top:20px;
}
.Ware {
  text-align: center;
  height: 60px;
}
.Ware-list {
  padding: 20px 0;
  margin-top: 10px;
  height: 215px;
  background: #fff;
}
.Ware-two {
  margin-top: 5px;
}
.ware-border {
  border-right: 1px solid #999;
}
.boederes {
  line-height: 1px;
  padding: 16.5px 0;
  text-align: center;
  height: 1px;
}
.boederes-one i {
  display: inline-block;
  width: 62px;
  height: 1px;
  border-top: 1px solid #999;
}
.waread {
  margin-top: 10px;
}
.app-center {
  height: 300px;
  padding: 20px;
  padding-top: 0;
  overflow: hidden;
}
.charts-bar {
  width: 100%;
  background: #fff;
  height: 300px;
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
.title-text:nth-child(1) {
  border-right: 1px solid #999;
}
.textborder {
  color: #409eff;
}
.title {
  height: 1px;
  text-align: center;
}
.title-one i {
  border-top: 1px solid #999;
  display: block;
  width: 80%;
  margin-left: 10%;
}
.lisrt {
  height: 238px;
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.list-text {
  margin: 15px 0;
  line-height: 16px;
}
</stylescoped>
