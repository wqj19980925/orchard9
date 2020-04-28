<template>
  <div class="app-container2">
    <el-row class="sd-module-box" v-if="!dataMan">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">环境数据--{{baseName}}</div>
        <div class="sd-module-btn">
          <el-button class="btn-mainCol" v-if="btnShow.dataBtn" @click="dataManange()">数据管理</el-button>
          <el-button class="btn-mainCol" v-if="btnShow.refreBtn" @click="refresh()">刷新</el-button>
          <el-button class="btn-delete" @click="backBtn()">返回</el-button>
        </div>
      </div>
      <el-form
        ref="formList"
        :model="formList"
        :inline="true"
        class="sd-form-box clearfix"
        size="medium"
        label-width="100px"
      >
        <el-row class="clearfix">
          <el-col :span="24" class="sd-col-6">
            <el-form-item label="编号:" class="sd-form-item">{{farNum}}</el-form-item>
            <el-form-item label="负责人名称:" class="sd-form-item">{{farName}}</el-form-item>
            <el-form-item label="地址:" class="sd-form-item">{{baseAddress}}</el-form-item>
          </el-col>
          <el-col :span="24" class="sd-col-6 contentthisPart">
            <div v-for="item in img" class="mainconten">
              <img :src="item.src" alt @click="getClass(item.id,listtype)" />

              <p style>{{item.name}}</p>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-col :span="24">
          <div class="choseThis">
            <el-radio-group v-model="radio1" @change="changeTime" align="right" class="choseInput">
              <el-radio-button label="1">年</el-radio-button>
              <el-radio-button label="2">月</el-radio-button>
              <el-radio-button label="3">日</el-radio-button>
            </el-radio-group>
            <div class="choseThis2">
              <el-date-picker
                v-if="listtype===1"
                v-model="chosetime"
                type="year"
                placeholder="选择年"
                :picker-options="pickerDateBefore"
                value-format="yyyy"
                @change="chooseTime"
              />
              <el-date-picker
                v-if="listtype===2"
                v-model="chosetime"
                type="month"
                placeholder="选择月"
                :picker-options="pickerDateBefore"
                value-format="yyyy-MM"
                @change="chooseTime"
              />
              <el-date-picker
                v-if="listtype===3"
                v-model="chosetime"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerDateBefore"
                value-format="yyyy-MM-dd"
                @change="chooseTime"
              />
            </div>
            <el-button
              :class="primary"
              @click="getThisTime()"
              v-if="listclass!==18 && listclass!==19 "
              :label="1"
            >{{Xname[this.listclass-1]}}:{{averg}}</el-button>
            <el-col :span="24">
              <el-button
                v-if="listclass===18"
                @click="getThisChoice(item.id,1)"
                :class="item.primary"
                v-for="(item,index) in waterlist"
                :label="index+1"
                style="width:130px"
              >{{item.name}}:{{item.averg}}</el-button>
              <el-button
                v-if="listclass===19"
                @click="getThisChoice(item.id,2)"
                :class="item.primary"
                v-for="(item,index) in soillist"
                :label="index+1"
              >{{item.name}}:{{item.averg}}</el-button>
            </el-col>
          </div>
        </el-col>
        <el-col :span="24">
          <div>
            <div v-if="!datanone" align="center" class="chartsExcel">暂无数据</div>
            <div id="charts" class="chartsExcel" />
          </div>
        </el-col>
      </div>
    </el-row>
    <!-- 数据管理 -->
    <dataEditing
      v-if="dataMan"
      :base-id="baseId"
      base-list="1"
      :dev-name="baseName"
      @listerToChild="showListPages()"
    />
  </div>
</template>
<script>
import { getEnviroment, refreshBase, dataManage } from "@/api/productAreaMan";
import { errorStatus, parseTime } from "@/utils/index";
import dataEditing from "./dataEditing";

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
  name: "Account",
  components: {
    dataEditing
  },
  props: {
    baseName: {
      type: String,
      required: false
    },
    baseId: {
      type: Number,
      required: false
    },
    farNum: {
      type: String,
      required: false
    },
    farName: {
      type: String,
      required: false
    },
    baseAddress: {
      type: String,
      required: false
    },
    proExist: {
      type: String,
      required: false
    },
    regId: {
      type: Number,
      required: false
    },
    envirId: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      primary: "",
      btnShow: {},
      chooseBut: false,
      dataMan: false,
      dialogTit: "选择时间",
      formList: {},
      chosetime: null,
      radio1: 3,
      radio: 0,
      dataList: [],
      img: [],
      waterlist: [],
      soillist: [],
      water: [
        "ph值",
        "浊度(NTU)",
        "汞含量(mg/L)",
        "砷含量(mg/L)",
        "镉含量(mg/L)",
        "铅含量(mg/L)",
        "铬含量(mg/L)",
        "氟化物(mg/L)",
        "六价铬(mg/L)"
      ],
      soil: [
        "土壤ph",
        "氮含量(ppm)",
        "钾含量(ppm)",
        "磷含量(ppm)",
        "汞含量(mg/kg)",
        "砷含量(mg/kg)",
        "镉含量(mg/kg)",
        "铅含量(mg/kg)",
        "铜含量(mg/kg)",
        "铬含量(mg/kg)"
      ],
      monthList: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      timeList: [
        "1点",
        "2点",
        "3点",
        "4点",
        "5点",
        "6点",
        "7点",
        "8点",
        "9点",
        "10点",
        "11点",
        "12点"
      ],
      Xname: [
        "降雨量(mm/min)",
        "风向(度)",
        "风速 (m/s)",
        "土壤水分( %)",
        "CO2(ppm)",
        "光照度(Lux)",
        "太阳辐射(W/㎡)",
        "土壤电导率(μs/cm)",
        "土壤温度(℃)",
        "PM2.5(ug/m3)",
        "空气温度(℃)",
        "环境湿度(%)",
        "二氧化硫(mg/m3)",
        "二氧化氮(mg/m3)",
        "",
        "",
        "蚊虫检测(次)",
        "",
        ""
      ],
      titleName: [
        "降雨量",
        "风向",
        "风速",
        "土壤水分",
        "CO2",
        "光照度",
        "太阳辐射",
        "土壤电导率",
        "土壤温度",
        "PM2.5",
        "空气温度",
        "环境湿度",
        "二氧化硫",
        "二氧化氮",
        "",
        "",
        "蚊虫检测",
        "",
        ""
      ],
      Yname: [],
      list: [],
      listtype: 3, //点击默认选择日期,
      blur: false,
      listclass: 1,
      averList: [],
      averg: "",
      datanone: false, //暂无折线图
      dataList: [],
      waterId: "",
      soilId: "",
      dateList: [],
      btnShow: {},

      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.chosetime;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      }
    };
  },

  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getButtonList();
    this.getTimes();
    this.getPageInfo(1, 3);
    this.chooseTime();
    // this.addForm.adm_stase = this.state1[0].name;
  },
  methods: {
    getTimes() {
      const thisdatas = new Date();
      const mytime = thisdatas.toLocaleDateString();
      this.chosetime = mytime.replace(/\//g, "-");
    },

    getPageInfo(listclass, listtype, waterId) {
      const data = {};
      data.pri_id = this.envirId;
      if (this.chosetime === null) {
        var date = new Date(); // 获取系统当前时
        var time = parseTime(date);
        time = time.substring(0, 10);
        data.type = 3;
        data.time = time;
      } else {
        data.type = listtype;
        data.time = this.chosetime;
      }
      data.class = listclass;

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (this.proExist) {
        data.regid = this.regId;
      }
      data.baseid = this.baseId;
      data.page = this.currentPage;
      getEnviroment(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            const btnList = dataRep.button_data;
            for (var i in btnList) {
              if (btnList[i].pri_funname === "刷新") {
                this.$set(this.btnShow, "refreBtn", true);
              } else if (btnList[i].pri_funname === "数据管理") {
                this.$set(this.btnShow, "dataBtn", true);
              }
            }
            if (listclass === 18) {
              this.averList = dataRep.avg;
              const avger = [];
              for (var i in dataRep.avg) {
                avger.push(dataRep.avg[i]);
              }
              this.waterlist = [];
              for (var j in avger) {
                this.waterlist.push({
                  id: Number(j),
                  name: this.water[j],
                  averg: avger[j],
                  primary: ""
                });
              }
              for (var i in this.waterlist) {
                //循环找出waterId(是当前选中的节点id)赋值class为primary,选中样式
                if (waterId === this.waterlist[i].id) {
                  this.waterlist[i].primary = "primary";
                }
              }
              const arsenic = [];
              const cadmium = [];
              const fluorine = [];
              const large = [];
              const lead = [];
              const mercury = [];
              const ph = [];
              const sexaval = [];
              const turbid = [];
              const dateList = [];
              for (var i in dataRep.data) {
                arsenic.push(dataRep.data[i].arsenic);
                cadmium.push(dataRep.data[i].cadmium);
                fluorine.push(dataRep.data[i].fluorine);
                large.push(dataRep.data[i].large);
                lead.push(dataRep.data[i].lead);
                mercury.push(dataRep.data[i].mercury);
                ph.push(dataRep.data[i].ph);
                sexaval.push(dataRep.data[i].sexaval);
                turbid.push(dataRep.data[i].turbid);
                if (listtype === 1) {
                  dateList.push(i + "月");
                }
                if (listtype === 2) {
                  dateList.push(i + "日");
                }
                if (listtype === 3) {
                  dateList.push(i + "时");
                }
              }
              const datass = [];
              datass.push(
                ph,
                turbid,
                mercury,
                arsenic,
                cadmium,
                lead,
                large,
                fluorine,
                sexaval
              );
              for (var j in datass) {
                if (
                  this.waterId === Number(j) &&
                  dateList.length !== 0 &&
                  this.blur
                ) {
                  this.echarts(datass[j], dateList); // console.log( datass[j],1234567890)
                }
              }
            } else if (listclass === 19) {
              this.averList = dataRep.avg;

              const avger = [];
              for (var i in dataRep.avg) {
                avger.push(dataRep.avg[i]);
              }
              // console.log(dataRep.avg,1111111)
              this.soillist = [];
              for (var j in avger) {
                this.soillist.push({
                  id: Number(j),
                  name: this.soil[j],
                  averg: avger[j],
                  primary: ""
                });
              }
              for (var i in this.soillist) {
                //循环找出waterId(是当前选中的节点id)赋值class为primary,选中样式
                if (waterId === this.soillist[i].id) {
                  this.soillist[i].primary = "primary";
                }
              }
              const arsenic = [];
              const cadmium = [];
              const copper = [];
              const large = [];
              const lead = [];
              const mercury = [];
              const nitrogen = [];
              const ph = [];
              const phosphor = [];
              const potassium = [];
              const dateList = [];
              for (var i in dataRep.data) {
                arsenic.push(dataRep.data[i].arsenic);
                cadmium.push(dataRep.data[i].cadmium);
                copper.push(dataRep.data[i].copper);
                large.push(dataRep.data[i].large);
                lead.push(dataRep.data[i].lead);
                mercury.push(dataRep.data[i].mercury);
                nitrogen.push(dataRep.data[i].nitrogen);
                ph.push(dataRep.data[i].ph);
                phosphor.push(dataRep.data[i].phosphor);
                potassium.push(dataRep.data[i].potassium);
                if (listtype === 1) {
                  dateList.push(i + "月");
                }
                if (listtype === 2) {
                  dateList.push(i + "日");
                }
                if (listtype === 3) {
                  dateList.push(i + "时");
                }
              }

              const datass = [];
              datass.push(
                ph,
                nitrogen,
                potassium,
                phosphor,
                mercury,
                arsenic,
                cadmium,
                lead,
                copper,
                large
              );
              for (var j in datass) {
                if (
                  this.soilId === Number(j) &&
                  dateList.length !== 0 &&
                  this.blur
                ) {
                  this.echarts(datass[j], dateList);
                }
              }
            } else {
              this.averg = dataRep.avg;
              console.log(this.averg, 1111);
              const dataList = [];
              const dateList = [];
              for (var i in dataRep.data) {
                dataList.push(dataRep.data[i]);
                if (listtype === 1) {
                  dateList.push(i + "月");
                }
                if (listtype === 2) {
                  dateList.push(i + "日");
                }
                if (listtype === 3) {
                  dateList.push(i + "时");
                }
              }
              this.dataList = dataList;
              if (this.blur && dateList.length !== 0) {
                this.echarts(dataList, dateList);
              }
            }
          }
        })
        .catch(Error => {
          loading.close();
          this.$message.error("请求失败");
          console.log("请求失败--", Error);
        });
    },
    getButtonList() {
      const data = {};
      dataManage(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.img = dataRep.data;
            this.refreshDis = false;
            for (var i in this.img) {
              this.img[i].name = this.img[i].key;
              this.img[i].id = this.img[i].sort;
              var num = parseInt(i) + parseInt(1);
              if (i < 9) {
                this.img[i].src =
                  "../../../static/img/dataStatistics/statis_icon_0" +
                  num +
                  ".png";
              } else {
                this.img[i].src =
                  "../../../static/img/dataStatistics/statis_icon_" +
                  num +
                  ".png";
              }
            }
          }
        })
        .catch(Error => {
          this.$message.error("请求失败");
        });
    },
    getClass(listclass, listtype) {
      this.primary = "";
      this.listclass = listclass;
      this.blur = false;
      this.datanone = false;
      this.getPageInfo(listclass, listtype);
      this.chooseTime();
    },
    changeTime(e) {
      this.primary = "";
      this.blur = false;
      this.datanone = false;
      if (this.waterlist.length !== 0) {
        this.waterlist[0].primary = "";
      }
      this.primary = "";
      const times = new Date();
      if (Number(e) === 1) {
        this.listtype = 1;
      } else if (Number(e) === 2) {
        this.listtype = 2;
        console.log(this.chosetime, "chosetim");
      } else if (Number(e) === 3) {
        this.listtype = 3;
      }
      this.chooseTime();
    },
    chooseTime(e) {
      console.log(this.chooseTime, "chooseTime");
      this.chooseBut = true;
      // this.getPageInfo(this.listclass,this.listtype)
      this.blur = true;
      this.datanone = true;
      if (this.listclass < 18) {
        this.primary = "primary";
        this.getPageInfo(this.listclass, this.listtype);
      } else {
        if (this.listclass === 18) {
          this.waterId = this.waterlist[0].id;
          this.getPageInfo(this.listclass, this.listtype, this.waterlist[0].id);
        }
        if (this.listclass === 19) {
          this.soilId = this.soillist[0].id;
          this.getPageInfo(this.listclass, this.listtype, this.soillist[0].id);
        }
      }
      //  if(this.chosetime===null){
      //   this.$message.warning('请选择日期')
      //   this.datanone=false
      //   return
      // }else{
      //   this.blur=true
      //   this.datanone=true
      //   this.getPageInfo(this.listclass,this.listtype)
      // }
    },
    getThisTime(type) {
      if (this.chosetime === null) {
        this.$message.warning("请选择日期");
        this.datanone = false;
        return;
      } else {
        this.blur = true;
        this.datanone = true;
        this.getPageInfo(this.listclass, this.listtype);
      }
    },
    getThisChoice(Id, type) {
      if (type === 1) {
        this.waterId = "";
      } else {
        this.soilId = "";
      }

      if (this.chosetime === null) {
        this.$message.warning("请选择日期");
        this.datanone = false;
        return;
      } else {
        for (var i in this.waterlist) {
          if (Id === this.waterlist[i].id) {
            this.waterlist[i].primary = "primary";
          } else {
            this.waterlist[i].primary = "";
          }
        }
        if (type === 1) {
          this.waterId = Id;
        } else {
          this.soilId = Id;
        }

        this.blur = true;
        this.datanone = true;
        this.getPageInfo(this.listclass, this.listtype, Id);
      }
    },
    echarts(data, list) {
      console.log(list);
      console.log(data);
      const MyChart = this.$echarts.init(document.getElementById("charts"));
      const Xname = this.Xname;
      const titleName = this.titleName;
      MyChart.setOption({
        title: {
          text: titleName[this.listclass - 1],
          left: "center",
          top: 30,
          textStyle: {
            color: "#666"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: list
        },
        yAxis: {
          name: Xname[this.listclass - 1],
          type: "value"
        },
        series: [
          {
            name: "数据值",
            data: data,
            type: "line",
            color: "#10b269"
          }
        ]
      });
      MyChart.resize();
    },
    refresh() {
      const data = {};
      console.log(this.img);
      for (var i in this.img) {
        if (this.listclass === this.img[i].id) {
          data.nod_id = this.img[i].nod_id;
          data.nod_node = this.img[i].nod_node;
          data.sort = this.img[i].sort;
        }
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      refreshBase(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            if (dataRep.code === 500) {
              this.$message.error(dataRep.data);
            } else {
              this.$message.success(dataRep.data);
              this.getPageInfo(1, 3);
            }
          }
        })
        .catch(Error => {
          loading.close();
          this.$message.error("请求失败");
          console.log("请求失败--", Error);
        });
    },
    //数据管理
    dataManange() {
      this.dataMan = true;
    },
    showListPages() {
      this.dataMan = false;
      this.getPageInfo(1, 3);
    },
    backBtn() {
      // this.$confirm('确定离开环境数据列表?', '提示', {
      //    confirmButtonText: '确定',
      //    cancelButtonText: '取消',
      //    type: 'warning'
      //  })
      //  .then(() => {
      this.$emit("listerToChild", "addPage");
      //   }).catch(() => {
      // })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scope>
@import "@/styles/variables.scss";
.dialog_resetPwd {
  .resetPwd_box {
    // padding:0 70px;
    .succes-icon-box {
      padding: 8px 20px;
      height: 56px;
      float: left;
    }
    p {
      font-size: 16px;
      text-align: center;
      &.tip_success {
        // padding:[], 120px;
        font-size: 20px;
        font-weight: bold;
        .el-icon-success {
          color: $blue;
          font-size: 22px;
          padding-right: 16px;
        }
      }
      &.tip_suc {
        padding-top: 16px;
        .text-pwd {
          color: #333;
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.account_add {
  .account_add_form {
    .el-form-item__label {
      padding: [], 40px 0 0;
    }
    .el-input.is-disabled .el-input__inner {
      color: #666;
    }
  }
  .el-dialog__body {
    padding: 30px 20px 20px;
    .list_data_add .tip_box {
      color: #f35e5e;
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
<style>
.mainconten {
  height: 80px;
  width: 65px;
  display: inline-block;
  margin: 5px 12px 15px 0;
}

.mainconten img {
  cursor: pointer;
  background: #666;
  width: 65px;
  height: 65px;
  padding: 15px;
  border-radius: 50%;
}

.mainconten p {
  font-size: 13px;
  text-align: center;
}

.contentthisPart {
  margin: 5px 20px 5px 20px;
}

.chartsExcel {
  height: 550px;
  width: 100%;
  margin-top: 30px;
}

.choseInput {
  margin: 5px 20px 5px 20px;
}

.choseThis {
  margin: 5px 70px 5px 20px;
}

.choseThis2 {
  margin: 25px;
  display: inline-block;
}

.primary {
  background: #409eff !important;
  color: #fff !important;
  border: 1px solid #409eff;
}
</style>