<template>
  <el-row class="sd-module-box lk-addGoods-box" style="margin:5px 15px 5px 15px;">
    <div class="sd-moudle-header mar-bot-10">
      <div class="sd-module-title">一键发码</div>
      <div class="sd-module-btn">
        <!-- <el-button class="btn-mainCol" @click="submitInfo()">提交</el-button> -->
      </div>
    </div>
    <el-form
      ref="formList"
      :model="formList"
      :rules="formRules"
      label-width="150px"
      class="lk-form-addGods"
    >
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="选择农户:" class="sd-form-item" prop="far_id">
            <el-select
              v-model="formList.far_id"
              @change="changeFarmer"
              placeholder="请选择农民"
              style="width:70%;"
              class="allselect"
            >
              <el-option
                v-for="items in farList"
                :key="items.far_id"
                :label="items.far_name"
                :value="items.far_id"
              />
            </el-select>
            <el-button @click="unfoldNyFormFun">增加</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="果园名称:" class="sd-form-item" prop="base_id">
            <el-select
              v-model="formList.base_id"
              @change="changeBase"
              placeholder="请选择果园名称"
              class="allselect"
              style="width:70%;"
              @click.native="getSelect(1)"
            >
              <el-option
                v-for="items in baseList"
                :key="items.base_id"
                :label="items.base_name"
                :value="items.base_id"
              />
            </el-select>
            <el-button @click="unfoldJdFormFun">增加</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="商品品类:" class="sd-form-item" prop="cla_name">
            <el-select
              v-model="formList.cla_id"
              placeholder="请选择商品品类"
              class="allselect"
              style="width:70%;"
              @change="changeNum($event,2)"
            >
              <el-option
                v-for="items in classList"
                :key="items.cla_id"
                :label="items.cla_name"
                :value="items.cla_id"
              />
            </el-select>
            <el-button @click="unfoldPlFormFun">增加</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="商品名称:" class="sd-form-item" prop="goo_id">
            <el-select
              v-model="formList.goo_id"
              placeholder="请选择商品名称"
              class="allselect"
              @change="changeNum(formList.goo_id,1)"
              style="width:70%;"
              @click.native="getSelect(3)"
            >
              <el-option
                v-for="items in goodsList"
                :key="items.goo_id"
                :label="items.goo_name"
                :value="items.goo_id"
              />
            </el-select>
            <el-button @click="unfoldGoodFormFun">增加</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="生产编号:" class="sd-form-item" prop="pro_id">
            <el-select
              v-model="formList.pro_id"
              placeholder="请选择生产编号"
              class="allselect"
              style="width:70%;"
              @click.native="getSelect(2)"
              @change="getsyList(formList.pro_id)"
            >
              <el-option
                v-for="items in NumList"
                :key="items.pro_id"
                :label="items.pro_number"
                :value="items.pro_id"
              />
            </el-select>
            <el-button @click="unfoldBhFormFun">增加</el-button>
            <el-button @click="showInfoFun">添加信息</el-button>
          </el-form-item>
        </el-col>
        <el-col v-if="tableData.length > 0" :span="24" class="sd-col-6">
          <el-form-item label="信息列表:" class="sd-form-item" prop="pro_id">
            <el-table
              :data="tableData"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              style="width: 70%"
              height="300"
            >
              <el-table-column align="center" prop="pop_time" label="时间"></el-table-column>
              <el-table-column align="center" label="功能">
                <template slot-scope="scope">
                  <span v-if="scope.row.pop_function == 1">新增信息</span>
                  <span v-else>农事任务</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="address" label="内容">
                <template slot-scope="scope">
                  <span v-if="scope.row.pop_function === 4">
                    <el-button size="mini" @click="seedetails(scope.row.pop_temp, 4)">查看详情</el-button>
                  </span>
                  <span v-if="scope.row.pop_function === 1">
                    <el-button size="mini" @click="seedetails(scope.row.pop_temp, 4)">查看详情</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="pop_admname" label="员工姓名"></el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.pop_state == 1">显示</span>
                  <span v-else>隐藏</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="质检报告:" class="sd-form-item" prop="con_id">
            <el-select
              v-model="formList.con_id"
              placeholder="请选择质检报告"
              class="allselect"
              @click.native="getSelect(4)"
              style="width:70%;"
            >
              <el-option
                v-for="items in qualitylist"
                :key="items.con_id"
                :label="items.result+conResult[items.con_result-1]"
                :value="items.con_id"
              >
                {{items.result}}
                <span
                  class="red"
                  v-if="items.con_result===2"
                >{{conResult[items.con_result-1]}}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="申请发码量:" class="sd-form-item" prop="code_num">
            <el-input
              style="width:70%;"
              v-model="formList.code_num"
              placeholder="请输入申请发码量"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="备注:" class="sd-form-item" prop="remark">
            <el-input style="width:70%;" v-model="formList.remark" placeholder="请输入备注" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="真伪防伪:" class="sd-form-item">
            <el-radio class="againstBut" v-model="fake_state" label="1" @change="serialNum(1)">序列号防伪</el-radio>
            <el-radio class="againstBut" v-model="fake_state" label="2" @change="serialNum(2)">计次防伪</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6" v-if="timeCount">
          <el-form-item label class="sd-form-item" prop="fake_num">
            <el-select
              style="width:70%;"
              class="allselect"
              v-model="formList.fake_num"
              placeholder="请选择防伪序列号"
            >
              <el-option
                v-for="items in antiCounList"
                :key="items.fake_num"
                :label="items.fake_name"
                :value="items.fake_num"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="border-top:1px solid #ccc; text-align:center;">
      <el-button type="primary" style="margin:20px 20px 0px 0px;" @click="submitInfo()">提交</el-button>
    </el-row>
    <!-- 新增农户 -->
    <el-dialog
      :visible.sync="nhAddformShow"
      title="新增农户"
      :close-on-click-modal="false"
      width="450px"
      @close="cancleForm()"
    >
      <el-form ref="nhAddform" :model="nhAddform" label-width="100px">
        <el-form-item label="农户姓名">
          <el-input
            v-model="nhAddform.name"
            style="width:200px;"
            placeholder="请输入农户姓名"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input
            v-model="nhAddform.mobile"
            style="width:200px;"
            placeholder="请输入联系方式"
            @blur="blurValue($event)"
            maxlength="11"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm()">取 消</el-button>
        <el-button type="primary" @click="nhAddformFun()">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 新增果园 ---  -->
    <el-dialog
      :visible.sync="jdAddformShow"
      title="新增果园"
      :close-on-click-modal="false"
      width="600px"
      @close="cancleForm()"
    >
      <el-form ref="jdAddform" :model="jdAddform" label-width="100px">
        <el-form-item label="果园名称">
          <el-input
            v-model="jdAddform.massif_name"
            style="width:250px;"
            placeholder="请输入果园名称"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="农户姓名">
          <el-select
            v-model="jdAddform.far_farid"
            placeholder="请选择农民"
            style="width:250px;"
            class="allselect"
          >
            <el-option
              v-for="items in farList"
              :key="items.far_id"
              :label="items.far_name"
              :value="items.far_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="果园地址:" prop="province" class="sd-form-item inventory">
          <el-select
            v-model="provincetext"
            value-key="id"
            style="width:120px"
            clearable
            filterable
            placeholder="省"
            @change="choseProvince"
          >
            <el-option
              v-for="item in province"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="citytext"
            style="width:120px"
            clearable
            filterable
            placeholder="市"
            @change="choseCity"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="towntext"
            clearable
            filterable
            style="width:100px"
            placeholder="县/区"
            @change="choseBlock"
          >
            <el-option
              v-for="item in countyList"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            v-model="jdAddform.address"
            style="width:250px;"
            placeholder="请输入详细地址"
            maxlength="60"
          />
        </el-form-item>
        <el-form-item label="区域面积">
          <el-input
            v-model="jdAddform.area"
            style="width:250px;"
            placeholder="0.00亩"
            maxlength="20"
            type="number"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm()">取 消</el-button>
        <el-button type="primary" @click="jdAddformFun()">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 新增品类 -->
    <el-dialog
      :visible.sync="plAddformShow"
      title="新增品类"
      :close-on-click-modal="false"
      width="450px"
      @close="cancleForm('nhAddform')"
    >
      <el-form ref="plAddform" :model="plAddform" label-width="100px">
        <el-form-item label="品类名称">
          <el-input
            v-model="plAddform.cla_name"
            style="width:200px;"
            placeholder="请输入品类名称"
            maxlength="20"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('nhAddform')">取 消</el-button>
        <el-button type="primary" @click="plAddformFun('nhAddform')">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 新增商品 -->
    <el-dialog
      :visible.sync="goodAddformShow"
      title="新增商品"
      :close-on-click-modal="false"
      width="1050px"
      @close="cancleForm()"
    >
      <Addgoods
        ref="addGood"
        :classId="formList.cla_id"
        @backDataInfo="backDataInfoF($event)"
        v-if="goodAddformShow"
      ></Addgoods>
      <span slot="footer">
        <el-button @click="cancleForm()">取 消</el-button>
        <el-button type="primary" @click="goodAddformFun()">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 新增生产编号 -->
    <el-dialog
      :visible.sync="bhAddformShow"
      title="新增生产编号"
      :close-on-click-modal="false"
      width="450px"
      @close="cancleForm()"
    >
      <el-form ref="plAddform" :model="bhAddform" label-width="100px">
        <el-form-item label="商品品类">
          <el-select
            v-model="formList.cla_id"
            placeholder="请选择商品品类"
            style="width:80%;"
            :disabled="true"
          >
            <el-option
              v-for="items in classList"
              :key="items.cla_id"
              :label="items.cla_name"
              :value="items.cla_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-select
            v-model="formList.goo_id"
            placeholder="请选择商品名称"
            style="width:80%;"
            :disabled="true"
          >
            <el-option
              v-for="items in goodsList"
              :key="items.goo_id"
              :label="items.goo_name"
              :value="items.goo_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="农资名称">
          <el-select v-model="bhAddform.agr_id" placeholder="请选择农资名称" style="width:80%;">
            <el-option
              v-for="items in nzDatas"
              :key="items.agr_id"
              :label="items.agr_name"
              :value="items.agr_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产周期">
          <el-input
            v-model="bhAddform.day"
            type="number"
            style="width:80%;"
            placeholder="请输入生产周期(天)"
            @change="setBhaDay"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm()">取 消</el-button>
        <el-button type="primary" @click="bhAddformFun()">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 溯源信息 -->
    <el-dialog
      :visible.sync="showSyBox"
      title="添加信息"
      :close-on-click-modal="false"
      width="1050px"
      @close="cancleForm()"
    >
      <addTrace
        v-if="showSyBox"
        @setInfosdd="getInfosdd"
        ref="traccc"
        :scbhNum="formList.pro_id"
        :nhNum="formList.far_id"
      ></addTrace>
      <span slot="footer">
        <el-button @click="cancleForm()">取 消</el-button>
        <el-button type="primary" @click="submitSyInfos()">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
      :visible.sync="detailShow"
      :title="dialogTit"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :inline="true" label-width="90px">
        <el-row :gutter="20" class="addGods-infor-box">
          <div
            v-for="(item,index) in farmDynamics"
            :key="index"
            class="addGods-infor-ipt clearfix"
            v-if="item.show===1"
          >
            <el-col :span="6">
              <!-- class="add-gods-title" -->
              <el-col :span="24">
                <span v-if="item.type<11">{{item.key}}</span>
                <span v-else>{{item.key.title}}</span>
              </el-col>
            </el-col>
            <el-col :span="18">
              <el-col :span="24" v-if="!item.alllist">
                <span
                  v-if="item.type<11 && item.type!==5 && item.type!==6 && item.type!==9"
                >{{item.value}}</span>
                <span v-if="item.type===9">溯源码号,系统补填</span>
                <el-button
                  v-if="item.type===5 || item.type===6"
                  class="up_img_btn"
                  type="primary"
                  @click="lookImg(index)"
                >点击预览</el-button>
              </el-col>
              <el-col :span="24" v-if="item.type>10">
                <el-col :span="12" style="padding-left:0px">
                  <span>{{item.value.name}}</span>
                </el-col>
                <el-col :span="12">
                  <span>{{item.value.n_name}}</span>
                </el-col>
                <span v-if="item.type===15 && item.value.type===1 ">
                  <span class="rightInfoWord">消耗数量:{{item.value.number}}</span>
                </span>
              </el-col>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 图片展示 -->
    <el-dialog
      :visible.sync="img.showImg"
      :close-on-click-modal="false"
      title="图片预览"
      width="400px"
      class="lookimg-dialog"
      @close="img.showImg=false"
    >
      <img :src="img.imgUrl" alt class="img-lookup" />
      <span slot="footer">
        <el-button type="primary" @click="img.showImg=false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 视频预览 -->
    <el-dialog
      :visible.sync="video.showImg"
      :close-on-click-modal="false"
      title="视频预览"
      width="400px"
      height="340px"
      class="lookimg-dialog lookVideo-dialog"
      @close="video.showImg=false"
    >
      <video :src="video.imgUrl" class="video-lookup" controls="controls" />
      <span slot="footer">
        <el-button type="primary" @click="video.showImg=false">关闭</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
import {
  searchSendCode,
  applyCode,
  manageReport,
  searInfo,
  searTemp,
  akeyCodeing
} from "@/api/trace";
import { searchDown } from "@/api/ProductManage";
import { searchUp } from "@/api/ProductManage";
import { phoneTest, valiPassword } from "@/utils/validate";
import { errorStatus } from "@/utils/index";
import Addgoods from "./components/addGoods";
import addTrace from "./components/addTrace";
import axios from "axios";
export default {
  name: "AddTrace",
  components: { Addgoods, addTrace },
  data() {
    return {
      fake_state: "1",
      formRules: {},
      qualitylist: [],
      formList: {
        far_id: "",
        base_id: "",
        pro_id: "",
        con_id: "",
        por_number: "",
        fake_num: "",
        remark: "",
        fake_state: "",
        goo_id: ""
      },
      timeCount: true,
      NumList: [],
      farList: [],
      baseList: [],
      classList: [],
      goodsList: [],
      mapJson: "../../../static/map/map.json",
      antiCounList: [
        { fake_num: 1, fake_name: "请选择防伪序列号位数-该项为【不开启防伪】" },
        { fake_num: 8, fake_name: "8位防伪序列号" },
        { fake_num: 9, fake_name: "9位防伪序列号" },
        { fake_num: 10, fake_name: "10位防伪序列号" },
        { fake_num: 11, fake_name: "11位防伪序列号" },
        { fake_num: 12, fake_name: "12位防伪序列号" },
        { fake_num: 13, fake_name: "13位防伪序列号" },
        { fake_num: 14, fake_name: "14位防伪序列号" },
        { fake_num: 15, fake_name: "15位防伪序列号" }
      ],
      conResult: ["", "不合格"],
      province: [],
      cityList: [],
      countyList: [],
      nzDatas: [],
      nhAddformShow: false,
      jdAddformShow: false,
      plAddformShow: false,
      goodAddformShow: false,
      bhAddformShow: false,
      showSyBox: false,
      nhAddform: {
        name: "",
        mobile: ""
      },
      provincetext: "",
      citytext: "",
      towntext: "",
      jdAddform: {
        far_farid: "",
        massif_name: "",
        province: "",
        city: "",
        town: "",
        address: "",
        area: "",
        far_qh: "",
        city_name: ""
      },
      plAddform: {
        cla_name: ""
      },
      bhAddform: {
        far_id: "",
        base_id: "",
        agr_id: "",
        day: "",
        goo_id: ""
      },
      klsdi: "",
      tableData: [],
      detailShow: false,
      farmDynamics: [],
      dialogTit: "",
      baseurl: process.env.BASE_API,
      img: {
        showImg: false,
        imgUrl: '',
      },
      video: {
        showImg: false,
        imgUrl: ''
      }
    };
  },
  created() {
    this.searchFarmer();
    this.getCityData();
    this.geiClassList();
  },
  methods: {
    // 加载china地点数据，三级
    getCityData: function() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function(response) {
          console.log(response, "------");
          if (response.status === 200) {
            var data = response.data;
            that.province = [];
            that.city = [];
            that.block = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                // 省
                that.province.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else if (item.match(/00$/)) {
                // 市
                that.city.push({ id: item, value: data[item], children: [] });
              } else {
                // 区
                that.block.push({ id: item, value: data[item] });
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (
                  that.province[index].id.slice(0, 2) ===
                  that.city[index1].id.slice(0, 2)
                ) {
                  that.province[index].children.push(that.city[index1]);
                }
              }
            }
            // 分类区级
            for (var item1 in that.city) {
              for (var item2 in that.block) {
                if (
                  that.block[item2].id.slice(0, 4) ===
                  that.city[item1].id.slice(0, 4)
                ) {
                  that.city[item1].children.push(that.block[item2]);
                }
              }
            }
          } else {
            console.log(response.status);
          }
        })
        .catch(function(error) {
          console.log(typeof +error);
        });
    },
    // 省change
    choseProvince(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].value) {
          this.cityList = this.province[index2].children;
          this.countyList = this.province[index2].children[0].children;
        }
      }
      for (var i in this.province) {
        if (this.province[i].value === e) {
          this.jdAddform.province = this.province[i].id;
        }
      }
    },
    // 市change
    choseCity(e) {
      for (var i in this.cityList) {
        if (e === this.cityList[i].value) {
          this.jdAddform.city = this.cityList[i].id;
        }
      }
    },
    // 区change
    choseBlock(e) {
      for (var i in this.countyList) {
        if (this.countyList[i].value === e) {
          this.jdAddform.town = this.countyList[i].id;
        }
      }
    },
    //搜索质检
    searchQuality(Id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      data.type = 2;
      data.goo_id = Id;
      manageReport(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.qualitylist = dataRep.data;
            var reslt = [];
            for (var i in dataRep.data) {
              if (dataRep.data[i].con_result === 1) {
                this.qualitylist[i].result =
                  dataRep.data[i].dit_name +
                  "[" +
                  dataRep.data[i].con_number +
                  "] ";
              } else {
                this.qualitylist[i].result =
                  dataRep.data[i].dit_name +
                  "[" +
                  dataRep.data[i].con_number +
                  "]";
              }
            }
          }
        })
        .catch(Error => {
          loading.close();
          this.$message.error("请求数据失败");
        });
    },
    //搜索农户
    searchFarmer(tex, id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      data.type = 3;
      searchSendCode(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.farList = dataRep.data;
            if (tex == "一") {
              this.formList.far_id = id;
            }
          }
          loading.close();
        })
        .catch(Error => {
          loading.close();
          this.$message.error("请求数据失败");
        });
    },
    // 获取品类
    geiClassList(tex, id) {
      const lis = {};
      lis.type = 5;
      searTemp(lis)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.classList = dataRep.data;
            if (tex == "一") {
              this.formList.cla_id = id;
            }
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    //搜索果园
    changeFarmer(e, tex, id) {
      const data = {};
      data.type = 4;
      data.far_id = e;
      this.formList.base_id = "";
      this.formList.pro_id = "";
      this.formList.cla_name = "";
      this.formList.goo_name = "";
      this.formList.con_id = "";
      searchSendCode(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.baseList = dataRep.data;
            if (tex == "一") {
              this.formList.base_id = id;
            }
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    //搜索生产编号
    changeBase(e, tex, id) {
      const search = {};
      search.type = 1;
      search.base_id = e;
      search.pro_type = 1;
      this.formList.pro_id = "";
      this.formList.cla_name = "";
      this.formList.goo_name = "";
      this.formList.con_id = "";
      searchSendCode(search)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.NumList = dataRep.data;
            if (tex == "一") {
              this.formList.pro_id = id;
            }
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    getSelect(listType) {
      if (listType === 1) {
        if (this.formList.far_id === "" || !this.formList.far_id) {
          this.$message.error("请先选择农户姓名");
        }
      }
      if (listType === 2) {
        if (this.formList.base_id === "" || !this.formList.base_id) {
          this.$message.error("请先选择果园名称");
        }
      }
      if (listType === 3) {
        if (this.formList.cla_id === "" || !this.formList.cla_id) {
          this.$message.error("请先选择商品品类");
        }
      }
      if (listType === 4) {
        if (this.formList.goo_id === "" || !this.formList.goo_id) {
          this.$message.error("请先选择商品名称");
        }
      }
    },
    //搜索收货编号
    changeNum(e, type) {
      if (type === 1) {
        this.formList.con_id = "";
        this.searchQuality(e);
      } else {
        this.formList.goo_id = "";
        this.formList.con_id = "";
        const data = {};
        data.type = 5;
        data.cla_id = this.formList.cla_id;
        searInfo(data)
          .then(response => {
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.goodsList = dataRep.data;
            }
          })
          .catch(Error => {
            this.$message.error("请求数据失败");
          });
      }
    },
    serialNum(type) {
      if (type === 2) {
        this.timeCount = false;
      } else {
        this.timeCount = true;
      }
    },
    // 提交
    submitInfo(formName) {
      const list = {};
      if (this.formList.far_id === "") {
        this.$message.error("请选择农户!");
        return;
      }
      if (this.formList.cla_id === "") {
        this.$message.error("请选择商品品类!");
        return;
      }
      if (this.formList.goo_id === "") {
        this.$message.error("请选择商品名称!");
        return;
      }
      if (
        this.formList.code_num === "" ||
        Number(this.formList.code_num) === 0
      ) {
        this.$message.error("请输入不为0的申请发码量!");
        return;
      }
      if (isNaN(this.formList.code_num)) {
        this.$message.error("申请发码量只能输入数字!");
        return;
      }
      if (this.fake_state === "1" && !this.formList.fake_num) {
        this.$message.error("请选择防伪序列号!");
        return;
      } else {
        list.fake_num = this.formList.fake_num;
      }
      if (this.fake_state === "2") {
        list.fake_num = 0;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      list.far_id = this.formList.far_id;
      list.goo_id = this.formList.goo_id;
      list.cla_id = this.formList.cla_id;
      list.code_num = Number(this.formList.code_num);
      list.pro_id = this.formList.pro_id;
      list.con_id = this.formList.con_id;
      list.remark = this.formList.remark;
      list.fake_state = Number(this.fake_state);
      list.type = 10;
      akeyCodeing(list)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            // console.log('response---', dataRep)
            this.$message.success(dataRep.data);
            this.$router.push({ path: "/CodeManageindex/CodeManageindex" });
          }
        })
        .catch(Error => {
          loading.close();
          // console.log("Error=>", Error);
        });
    },
    // 显示农户增加
    unfoldNyFormFun() {
      this.nhAddformShow = true;
    },
    // 提交新增 -- 农户
    nhAddformFun() {
      if (this.nhAddform.name == "") {
        this.$message.error("农户名称不能为空");
        return;
      }
      if (this.nhAddform.mobile == "") {
        this.$message.error("农户手机号不能为空");
        return;
      }
      const data = this.nhAddform;
      data.type = 1;
      akeyCodeing(data).then(res => {
        if (errorStatus(res.data)) {
          this.$message.success("添加农户成功");
          this.searchFarmer("一", res.data.far_id);
          this.changeFarmer(res.data.far_id);
          this.nhAddform = {
            name: "",
            mobile: ""
          };
          this.nhAddformShow = false;
        }
      });
    },
    // 验证农户手机号
    blurValue(e, index) {
      const val = e.target.value;
      if (!phoneTest(val)) {
        this.$message.error("请输入正确的手机号!");
        this.nhAddform.mobile = "";
        return false;
      }
    },
    // 显示果园增加
    unfoldJdFormFun() {
      this.jdAddform.far_farid = this.formList.far_id;
      this.jdAddformShow = true;
    },
    // 提交新增 -- 果园
    jdAddformFun() {
      if (this.jdAddform.massif_name == "") {
        this.$message.error("果园名称不能为空");
        return;
      }
      if (this.jdAddform.far_farid == "") {
        this.$message.error("农户名称不能为空");
        return;
      }
      if (this.jdAddform.area == "") {
        this.$message.error("区域面积不能为空");
        return;
      }
      if (
        this.jdAddform.province == "" ||
        this.jdAddform.city == "" ||
        this.jdAddform.town == ""
      ) {
        this.$message.error("地址不能为空");
        return;
      }
      const data = this.jdAddform;
      data.far_qh = data.town;
      data.city_name = this.citytext;
      data.type = 2;
      akeyCodeing(data).then(res => {
        if (errorStatus(res.data)) {
          this.jdAddformShow = false;
          if (this.jdAddform.far_farid == this.formList.far_id) {
            this.changeFarmer(this.formList.far_id, "一", res.data.massif_id);
          }

          for (let i in this.jdAddform) {
            this.jdAddform[i] = "";
          }
        }
      });
    },
    // 显示品类
    unfoldPlFormFun() {
      this.plAddformShow = true;
    },
    // 新增提交 -- 品类
    plAddformFun() {
      if (this.plAddform.cla_name == "") {
        this.$message.error("品类名称不能为空");
        return;
      }
      const data = this.plAddform;
      data.type = 3;
      akeyCodeing(data).then(res => {
        if (errorStatus(res.data)) {
          console.log(res.data, "新增品类");
          this.geiClassList("一", res.data.cla_id);
          this.plAddformShow = false;
          this.plAddform.cla_name = "";
        }
      });
    },
    // 显示商品
    unfoldGoodFormFun() {
      this.goodAddformShow = true;
    },
    // 新增商品 -- 提交
    goodAddformFun() {
      this.$refs.addGood.submitInfo("formList");
    },
    // 接收商品组件传回的值处理
    backDataInfoF(val) {
      console.log(val, "-0000");
      if (val.code == 200) {
        this.goodAddformShow = false;
        if (val.classId == this.formList.cla_id) {
          this.changeNum(val.classId, 2);
          this.formList.goo_id = val.res_goods;
        }
      }
    },
    // 显示出生产编号框
    unfoldBhFormFun() {
      if (
        this.formList.cla_id == "" ||
        this.formList.goo_id == "" ||
        this.formList.far_id == "" ||
        this.formList.base_id == ""
      ) {
        this.$message.error("农户、果园、商品、品类不能为空");
        return;
      }
      const data = {};
      data.acl_id = this.formList.goo_id;
      data.type = 3;
      searchDown(data).then(res => {
        if (errorStatus(res.data)) {
          this.nzDatas = res.data.data;
        }
      });
      this.bhAddformShow = true;
    },
    // 提交生产编号
    bhAddformFun() {
      if (this.bhAddform.agr_id == "") {
        this.$message.error("请选择农资名称");
        return;
      }
      if (this.bhAddform.day == "") {
        this.$message.error("生产周期不能为空");
        return;
      }
      const data = {};
      data.type = 6;
      data.far_id = this.formList.far_id;
      data.base_id = this.formList.base_id;
      data.agr_id = this.bhAddform.agr_id;
      data.day = this.bhAddform.day;
      data.cla_id = this.formList.cla_id;
      data.goo_id = this.formList.goo_id;
      akeyCodeing(data).then(res => {
        if (errorStatus(res.data)) {
          this.$message.success("新增成功");
          let pid = res.data.pro_id;
          // 开始生产
          const dt = {};
          dt.type = 9;
          dt.pro_id = pid;
          akeyCodeing(dt).then(res => {
            if (errorStatus(res.data)) {
              this.bhAddformShow = false;
              this.changeBase(this.formList.base_id, "一", pid);
              for (let i in this.bhAddform) {
                this.bhAddform[i] = "";
              }
            }
          });
        }
      });
    },
    // 显示溯源信息添加弹框
    showInfoFun() {
      if (this.formList.pro_id == "") {
        this.$message.error("生产编号不能为空");
        return;
      }
      this.showSyBox = true;
    },
    // 提交溯源信息
    submitSyInfos() {
      if (this.klsdi == "添加信息") {
        this.$refs.traccc.submitInfo("formList");
      } else {
        this.$refs.traccc.addAgriClaBtn("addOneAgric");
      }
      this.getsyList(this.formList.pro_id)
    },
    // 获取溯源信息页面的值
    getInfosdd(val) {
      this.klsdi = val;
      if (val == 1) {
        this.showSyBox = false;
      }
    },
    // 取消 -- 关闭
    cancleForm() {
      this.jdAddformShow = false;
      this.nhAddformShow = false;
      this.plAddformShow = false;
      this.goodAddformShow = false;
      this.bhAddformShow = false;
      this.showSyBox = false;
      this.plAddform.cla_name = "";
      this.nhAddform = {
        name: "",
        mobile: ""
      };
      for (let i in this.jdAddform) {
        this.jdAddform[i] = "";
      }
      for (let i in this.bhAddform) {
        this.bhAddform[i] = "";
      }
    },
    // 通过生产编号获取信息列表
    getsyList(id) {
      const data = {};
      data.type = 11;
      data.pro_id = id;
      akeyCodeing(data).then(res => {
        if (errorStatus(res.data)) {
          console.log(res.data, "获取信息列表");
          this.tableData = res.data.data_info;
        }
      });
    },
    //操作列表的内容查看详情
    seedetails(row, type) {
      this.farmDynamics = eval(row);
      console.log(this.farmDynamics, "-=-=-");
      this.detailShow = true;
      if (type === 4) {
        this.dialogTit = "农事任务";
      }
      if (type === 1) {
        this.dialogTit = "新增信息";
      }
    },
    // 查看图片
    lookImg(index) {
      // var upImgVideo,url
      console.log(this.farmDynamics[index]);
      const str = this.baseurl.replace("public", "/");
      const url = this.farmDynamics[index].value;
      const upImgVideo = Number(this.farmDynamics[index].type);
      if (upImgVideo == 5) {
        this.img.imgUrl = str + url;
        this.img.showImg = true;
      } else if (upImgVideo == 6) {
        this.video.imgUrl = str + url;
        this.video.showImg = true;
      }
    },
    setBhaDay() {
      this.bhAddform.day = parseFloat(this.bhAddform.day)
      if(this.bhAddform.day < 1){
        this.bhAddform.day = 1
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
@import "src/styles/mixin.scss";
.lk-addGoods-box {
  .lk-form-addGods {
    .addGods-infor-box {
      padding: 15px 0 0 20px;
      width: 1000px;
      .add-gods-title {
        text-align: center;
        .opre-btn {
          padding: 0 10px;
        }
        .typeBtn {
          width: 56px;
          text-align: center;
          padding: 7px 0;
        }
      }
      .addGods-infor-ipt {
        // height: 58px;
        line-height: 56px;
        .add-gods-title {
          .btn_svg {
            width: 14px;
            height: 13px;
            color: #777;
          }
          .up_img_btn {
            width: 310px;
            height: 36px;
          }
        }
      }
      .add-goods-btn.main-btn {
        margin: 10px 15px 0 0;
        float: right;
      }
    }
  }
  .attri_dialog {
    .el-dialog__body {
      padding: 10px 0;
    }
    .attri_dia_box {
      .attri_dia_ul {
        @include clearfix;
        padding: 0 20px;
        margin-bottom: 5px;
        .atti_dia_li {
          float: left;
          width: 100px;
          height: 90px;
          position: relative;
          z-index: 1;
          margin: 0 14px 10px 0;
          .icon_suces {
            display: none;
            color: $light-blue;
            position: absolute;
            top: -4px;
            right: -4px;
            z-index: 6;
          }
          .svg_icon {
            width: 45px;
            height: 45px;
            font-size: 30px;
            display: block;
            color: $light-blue;
            position: absolute;
            left: 50%;
            margin-left: -23px;
            top: 8%;
            z-index: 0;
          }
          .icon-text {
            margin-top: 59px;
            line-height: 30px;
            text-align: center;
            width: 100%;
            display: block;
          }

          &.on {
            border: 1px solid $light-blue;
            .icon_suces {
              display: block;
            }
          }
        }
      }
      .red {
        margin-left: 40px;
        font-size: 12px;
      }
    }
  }
  .lookimg-dialog {
    &.lookVideo-dialog {
      padding: 15px 20px;
    }
    .img-lookup {
      width: 240px;
      height: 150px;
      margin: auto;
      display: block;
    }
    .video-lookup {
      width: 340px;
      height: 150px;
      margin: auto;
      display: block;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.lk-addGoods-box {
  .lk-form-addGods {
    .add-class-btn {
      margin-left: 30px;
    }
    .addGods-infor-box {
      padding: 15px 0 0 20px;
      width: 1000px;
      .add-gods-title {
        text-align: center;
        .opre-btn {
          padding: 0 10px;
        }
      }
      .addGods-infor-ipt {
        // height: 56px;
        line-height: 56px;
      }
      .add-goods-btn.main-btn {
        margin: 10px 15px 0 0;
        float: right;
      }
    }
    .addGods-upload-img {
      .upload-img {
        .upload-img-bd {
          float: left;
          border: 1px dashed #ddd;
          width: 165px;
          height: 90px;
          cursor: pointer;
          &:hover {
            border: 1px dashed $blue;
          }
          .icon-add {
            width: 165px;
            height: 90px;
            line-height: 90px;
            text-align: center;
            display: block;
          }
          .ipt-add {
            display: none;
          }
        }
        .img-list {
          float: left;
          margin-right: 10px;
          .img_show_box {
            width: 160px;
            height: 90px;
            position: relative;
            overflow: hidden;
            img {
              width: 165px;
              // height: 120px;
            }
            .img_delete {
              position: absolute;
              top: 0px;
              right: 0px;
              display: block;
              width: 20px;
              height: 20px;
              font-size: 20px;
              color: #f00;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" >
.lk-addGoods-box {
  .lk-form-addGods {
    padding-top: 10px;
    .el-form-item__label {
      padding-right: 40px;
      font-size: 16px;
    }
    .el-input.is-disabled .el-input__inner {
      color: #666;
    }
    .addGods-infor-box {
      .addGods-infor-ipt {
        .border-red {
          .el-input__inner {
            border: 1px solid red !important;
          }
        }
      }
      .add-gods-title {
        i {
          font-weight: 800;
        }
      }
    }
  }
  .attri_dialog {
    .el-dialog__body {
      padding: 10px 0;
    }
  }
  .lookimg-dialog {
    .el-dialog__footer {
      // text-align: center;
    }
  }
  .lookVideo-dialog {
    .el-dialog__body {
      padding: 15px 20px;
    }
  }
}
</style>
<style>
.againstBut {
  width: 25%;
  margin: 0px auto !important;
}
.allselect {
  width: 100%;
}
.rightInfoWords {
  font-size: 13px;
  color: #909399;
}
/* .goodsBox{
  height: 600px;
  overflow: hidden;
  overflow-y: auto;
} */
</style>