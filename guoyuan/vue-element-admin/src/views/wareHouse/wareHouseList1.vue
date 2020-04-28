<template>
  <div class="app-orderList">
    <el-row class="sd-module-box" v-if="closeAdd">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">我的冷库</div>
        <div class="sd-module-btn">
          <el-button
            v-if="jurisdictionList.waremodify=='1'"
            class="btn-mainCol"
            @click="centerDialogVisible = true"
          >新增</el-button>
          <el-button
            v-if="jurisdictionList.warenable=='1'"
            class="openCol-btn"
            @click="enable(1)"
          >启用</el-button>
          <el-button v-if="jurisdictionList.warestop=='1'" class="stopCol-btn" @click="enable(2)">停用</el-button>
          <el-button v-if="jurisdictionList.waredel=='1'" class="btn-delete" @click="enable(3)">删除</el-button>
        </div>
      </div>
      <el-form
        class="sd-form-box clearfix"
        size="medium"
        label-width="100px"
        ref="formList"
        :model="formList"
      >
        <el-row>
          <el-col :span="5" class="sd-col-6 lk-col-5">
            <el-form-item label="冷库名称:" prop="ware_name" class="sd-form-item">
              <el-input v-model="formList.ware_name" placeholder="请输入冷库名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4" class="sd-col-6" style="width:230px">
            <el-form-item label="库存数量:" prop="warehouse_min" class="sd-form-item">
              <el-input
                :min="0"
                type="number"
                style="width:95%"
                placeholder="最小值"
                v-model="formList.warehouse_min"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3" class="sd-col-6" style="width:180px">
            <el-form-item label-width="20px" prop="warehouse_max" class="sd-form-item">
              <el-input
                :min="1"
                type="number"
                style="width:75%"
                placeholder="最大值"
                v-model="formList.warehouse_max"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="sd-col-6" style="width:600px">
            <el-form-item label="冷库地址:" prpo="province" class="sd-form-item inventory">
              <el-select
                style="width:80px"
                v-model="formList.province"
                value-key="id"
                @change="choseProvince"
                clearable
                placeholder="省"
              >
                <el-option
                  v-for="item in province"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
              <el-select
                style="width:80px"
                v-model="formList.city"
                value-key="id"
                @change="choseCity"
                clearable
                placeholder="市"
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
              <el-select
                clearable
                v-model="formList.county"
                value-key="id"
                @change="choseBlock"
                style="width:80px"
                placeholder="县/区"
              >
                <el-option
                  v-for="item in countyList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label label-width="0px" prop="address" class="sd-form-item inventory">
              <el-input class="w200" v-model="formList.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="clearfix">
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="订单设置:" class="sd-form-item">
              <el-select class v-model="formList.is_ok" placeholder="请选择设置状态">
				<el-option key="0" label="全部" value="0" />
                <el-option
                  v-for="item in is_ok"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="冷库类型:" class="sd-form-item">
              <el-select class v-model="formList.type" placeholder="请选择冷库类型">
                <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态:" class="sd-form-item">
              <el-select v-model="formList.state" placeholder="请选择冷库状态">
                <el-option
                  v-for="item in state"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="fr w200">
            <el-button type="primary" @click="getListInformation()">搜&nbsp;&nbsp;索</el-button>
            <el-button @click="resetForm()">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box amountQuan">
        <el-table
          :data="tableList"
          width="100%"
          @selection-change="handleSelectionChange"
          @sort-change="sortChang"
        >
          <el-table-column type="selection" width="55" prop="ware_id" />
          <el-table-column label="冷库名称" min-width align="center" prop="ware_name" />
          <el-table-column label="类型" width="105" align="center" prop="type">
            <template slot-scope="scope">
              <div v-if="scope.row.type == 1">农资库</div>
              <div v-else>商品库</div>
            </template>
          </el-table-column>
          <el-table-column label="订单设置" width="105" align="center" prop="is_ok">
            <template slot-scope="scope">
              <div v-if="scope.row.is_ok == 1">可接单</div>
              <div v-else>不可接单</div>
            </template>
          </el-table-column>
          <el-table-column
            label="库存数量"
            width="105"
            align="center"
            prop="good_number"
            sortable="custom"
            class="detail_num"
          />
          <el-table-column label="状态" width="105" align="center" prop="state">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 1">正常</div>
              <div v-else-if="scope.row.state == 2">停用</div>
              <div v-else>已删除</div>
            </template>
          </el-table-column>
          <el-table-column label="冷库地址" align="center" prop="address">
            <template slot-scope="scope">
              <div>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.county }}{{ scope.row.address }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="jurisdictionList.modifyedit=='1'"
                class="btn-mainCol"
                size="mini"
                @click="compile(scope)"
              >编辑</el-button>
              <el-button
                v-if="jurisdictionList.writeList=='1'"
                class="btn-secCol"
                size="mini"
                @click="addReceipt03(scope.row)"
              >入库</el-button>
              <el-button
                v-if="jurisdictionList.index=='1'"
                class="stopCol-btn"
                size="mini"
                @click="addReceipt04(scope.row)"
              >出库</el-button>
              <el-button
                v-if="jurisdictionList.posiList=='1'"
                class="openCol-btn"
                size="mini"
                @click="addReceipt(scope.row)"
              >库位</el-button>
              <el-button
                v-if="jurisdictionList.Inventorylist=='1'"
                class="btn-delete"
                size="mini"
                @click="addReceipt02(scope.row)"
              >查库存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="lk-page-box" style="padding-top: 10px;">
        <el-pagination
          :current-page="page"
          :page-size="page_size"
          :total="page_count"
          layout="total, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
    <!-- 添加仓库 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      title="添加冷库"
      width="500px"
      @close="addCancel('addCancel')"
    >
      <el-form label-width="85px" ref="addWarehouses" :model="addWarehouses" :rules="rulesCla">
        <el-form-item label="冷库名称:" prop="ware_name" class="sd-form-item">
          <el-input v-model="addWarehouses.ware_name" placeholder="请输入冷库名称" style="width:380px" />
        </el-form-item>
        <el-form-item label="冷库类型:" prop="state" clearable class="sd-form-item">
          <el-select v-model="addWarehouses.state" style="width:380px" placeholder="请选择冷库类型">
            <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单设置:" prop="is_ok" clearable class="sd-form-item">
          <el-select v-model="addWarehouses.is_ok" style="width:380px" placeholder="请选择设置状态">
            <el-option v-for="item in is_ok" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="冷库地址:" prop="province" clearable class="sd-form-item inventory">
          <el-select
            style="width:122px"
            v-model="addWarehouses.province"
            value-key="id"
            @change="choseProvince"
            clearable
            placeholder="省"
          >
            <el-option
              v-for="item in province"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <el-select
            style="width:122px"
            v-model="addWarehouses.city"
            value-key="id"
            @change="choseCity"
            clearable
            placeholder="市"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <el-select
            clearable
            v-model="addWarehouses.county"
            value-key="id"
            @change="choseBlock"
            style="width:122px"
            placeholder="县/区"
          >
            <el-option
              v-for="item in countyList"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="    " prop="address" class="sd-form-item inventory">
          <el-input v-model="addWarehouses.address" style="width:380px" placeholder="请输入详细地址" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCancel('addCancel')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('addCla')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加仓库 -->
    <!-- 编辑仓库 -->
    <el-dialog
      :visible.sync="romewDialogVisible"
      :close-on-click-modal="false"
      title="编辑冷库"
      width="500px"
      @close="addCancel('editsCancel')"
    >
      <el-form label-width="85px" ref="addWarehouses" :model="addWarehouses" :rules="rulesCla">
        <el-form-item label="冷库名称:" prop="ware_name" class="sd-form-item">
          <el-input v-model="addWarehouses.ware_name" placeholder="请输入冷库名称" style="width:380px" />
        </el-form-item>
        <el-form-item label="冷库类型:" prop="state" clearable class="sd-form-item">
          <el-select class v-model="addWarehouses.state" style="width:380px" placeholder="请选择冷库类型">
            <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单设置:" prop="is_ok" clearable class="sd-form-item">
          <el-select class v-model="addWarehouses.is_ok" style="width:380px" placeholder="请选择设置状态">
            <el-option v-for="item in is_ok" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="冷库地址:" prop="province" clearable class="sd-form-item inventory">
          <el-select
            style="width:122px"
            v-model="addWarehouses.province"
            value-key="id"
            @change="choseProvince"
            clearable
            placeholder="省"
          >
            <el-option
              v-for="item in province"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <el-select
            style="width:122px"
            v-model="addWarehouses.city"
            value-key="id"
            @change="choseCity"
            clearable
            placeholder="市"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <el-select
            clearable
            v-model="addWarehouses.county"
            value-key="id"
            @change="choseBlock"
            style="width:122px"
            placeholder="县/区"
          >
            <el-option
              v-for="item in countyList"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="    " prop="address" class="sd-form-item inventory">
          <el-input v-model="addWarehouses.address" style="width:380px" placeholder="请输入详细地址" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCancel('editsCancel')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('compile')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加仓库 -->
    <!--<<库位-->
    <goodStored
      v-if="showAdd"
      v-bind:ware_ids="waresid"
      @submit="submit"
      @listerToChild="showListPages()"
    />
    <!--库位>>-->
    <!--<<查库存-->
    <manageExit
      v-if="showAdd02"
      v-bind:ware_ids="waresid"
      @submit="submit"
      @listerToChild="showListPages()"
    />
    <!--查库存>>-->
    <!--<<入库-->
    <addReceipt
      v-if="showAdd03"
      v-bind:ware_ids="waresid"
      @submit="submit"
      @listerToChild="showListPages()"
    />
    <!--入库>>-->
    <!--<<出库-->
    <addReceiptOut
      v-if="showAdd04"
      v-bind:ware_ids="waresid"
      @submit="submit"
      @listerToChild="showListPages()"
    />
    <!--出库>>-->
  </div>
</template>
<script>
import {
  wareList,
  enableWare,
  warestop,
  waredel,
  addWarehouse,
  modifyWarehouse
} from "@/api/wareHouse";
import { errorStatus } from "@/utils/index";
import axios from "axios";
import goodStored from "./components/goodStored";
import manageExit from "./components/manageExit";
import addReceipt from "./components/addReceipt";
import addReceiptOut from "./components/addReceiptOut";
export default {
  components: {
    goodStored,
    manageExit,
    addReceipt,
    addReceiptOut
  },
  data() {
    return {
      mapJson: "../../../static/map/map.json", //省市区
      provinceList: [], //省
      cityList: [], //市
      countyList: [], //区
      ware_id: "", //冷库ID
      waresid: 0,
      ware_name: "", //冷库名称
      warehouse_max: 0, //最大库存
      warehouse_min: 0, //最小库存
      province: "", //省
      city: "", //市
      county: "", //县
      address: "", //详细地址
      good_number: 0, //库存数量
      rulesCla: {
        ware_name: [
          {
            required: true,
            message: "请输入冷库名称",
            trigger: "blur"
          }
        ],
        state: [
          {
            required: true,
            message: "请选择冷库类型",
            trigger: "change"
          }
        ],
        is_ok: [
          {
            required: true,
            message: "请选择订单设置",
            trigger: "change"
          }
        ],
        province: [
          {
            required: true,
            message: "请选择省市县",
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur"
          },
          {
            min: 6,
            max: 100,
            message: "详细地址应大于6个字符",
            trigger: "blur"
          }
        ]
      },
      type: [
        //冷库类型
        {
          id: 1,
          name: "农资库"
        },
        {
          id: 2,
          name: "商品库"
        }
      ],
      state: [
        //冷库状态
        {
          id: 1,
          name: "正常"
        },
        {
          id: 2,
          name: "停用"
        }
      ],
      is_ok: [
        {
          id: 1,
          name: "可接订单"
        },
        {
          id: 2,
          name: "不可接订单"
        }
      ], //是否接单
      page_size: 0, //当前展示多少行
      page: 0, //当前页
      page_number: 0,
      page_count: 0,
      pagesizeMain: 1,
      tableList: [],
      formList: {
        //搜索
        ware_name: "", //冷库名称
        warehouse_max: "", //最大库存
        warehouse_min: "", //最小库存
        province: "", //省
        city: "", //市
        county: "", //县
        address: "", //详细地址
        is_ok: "", //是否接单
        type: "", //冷库类型
        state: "", //冷库状态
        order: 0 //库存排序
      },
      radio: [], //被选中
      centerDialogVisible: false,
      romewDialogVisible: false,
      showAdd: false,
      showAdd02: false,
      showAdd03: false,
      showAdd04: false,
      closeAdd: true,
      addWarehouses: {
        ware_id: null, //冷库ID
        ware_name: null, //冷库名称
        state: null, //冷库类型
        is_ok: null, //订单设置
        province: null, //省
        city: null, //市
        county: null, //县
        address: null //详细地址
      },
      jurisdictionList: {
        waremodify: 0, //新增
        warenable: 0, //启用
        warestop: 0, //停用
        waredel: 0, //删除
        modifyedit: 0, //编辑
        Inventorylist: 0, //查库存
        posiList: 0, //库位
        writeList: 0, //入库
        index: 0 //出库
      }
    };
  },
  created() {
    // 页面加载时
    this.getListInformation();
    this.getCityData();
  },
  methods: {
    // 加载china地点数据，三级
    getCityData: function() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function(response) {
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
                that.city.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else {
                // 区
                that.block.push({
                  id: item,
                  value: data[item]
                });
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
    // 选省
    choseProvince: function(e) {
      this.cityList = [];
      this.countyList = [];
      for (var index2 in this.province) {
        if (e === this.province[index2].value) {
          this.cityList = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.countyList = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.countyList[0].value;
        }
      }
      console.log(countyList);
    },
    // 选市
    choseCity: function(e) {
      this.countyList = [];
      for (var index3 in this.city) {
        if (e === this.city[index3].value) {
          // console.log("------",this.city)
          // console.log('111111',this.city[index3])
          this.countyList = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.countyList[0].value;
        }
      }
    },
    // 选区
    choseBlock: function(e) {
      this.E = e;
    },
    getListInformation() {
      //请求列表数据
      const that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
	  const ListData = that.formList;
	  if(ListData.is_ok == 0){
		  ListData.is_ok = ''
	  }
      ListData.pri_id = this.$route.meta.pri_id;
      ListData.page = this.pagesizeMain;
      wareList(ListData)
        .then(response => {
          console.log("列表数据", response);
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            if (response.data.code == 200) {
              that.tableList = response.data.list;
              that.page = response.data.page;
              that.page_count = response.data.page_count;
              that.page_number = response.data.page_number;
              that.page_size = response.data.page_size;
              loading.close();
              for (let i = 0; i < response.data.button.length; i++) {
                if (response.data.button[i].pri_id == "149") {
                  this.jurisdictionList.waremodify = 1;
                } else if (response.data.button[i].pri_id == "150") {
                  this.jurisdictionList.warenable = 1;
                } else if (response.data.button[i].pri_id == "151") {
                  this.jurisdictionList.warestop = 1;
                } else if (response.data.button[i].pri_id == "152") {
                  this.jurisdictionList.waredel = 1;
                } else if (response.data.button[i].pri_id == "153") {
                  this.jurisdictionList.modifyedit = 1;
                } else if (response.data.button[i].pri_id == "154") {
                  this.jurisdictionList.Inventorylist = 1;
                } else if (response.data.button[i].pri_id == "155") {
                  this.jurisdictionList.posiList = 1;
                } else if (response.data.button[i].pri_id == "162") {
                  this.jurisdictionList.writeList = 1;
                } else if (response.data.button[i].pri_id == "163") {
                  this.jurisdictionList.index = 1;
                }
              }
              console.log(this.jurisdictionList);
            } else {
              loading.close();
              this.$message.error(response.data.data);
            }
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error("列表查询失败!");
        });
    },
    handleCurrentChange(val) {
      console.log(val);
      this.pagesizeMain = val;
      this.getListInformation();
    },
    handleSelectionChange(val) {
      //我的云仓单选框被选中的
      const that = this;
      that.chosed = val;
      that.radio = [];
      for (var i = 0; i < val.length; i++) {
        that.radio.push(val[i].ware_id);
      }
    },
    sortChang(column, prop, order) {
      //列表排序
      console.log(column);
      if (column.prop == "good_number") {
        //库存
        if (column.order == "descending") {
          this.formList.order = 2;
          this.getListInformation();
        } else {
          this.formList.order = 1;
          this.getListInformation();
        }
      }
    },
    resetForm(formName) {
      //重置
      this.formList = {
        // 我的云仓里的input框里的数据
        ware_name: "", //冷库名称
        warehouse_max: "", //最大库存
        warehouse_min: "", //最小库存
        province: "", //省
        city: "", //市
        county: "", //县
        address: "", //详细地址
        is_ok: "", //是否接单
        type: "", //冷库类型
        state: "", //冷库状态
        order: 0 //库存排序
      };
      this.getListInformation();
    },
    enable(data) {
      //冷库停启用
      const that = this;
      if (that.radio == "") {
        this.$message.error("请选择操作的冷库!");
      } else {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        const wareids = {};
        wareids.ware_id = that.radio;
        if (data == 1) {
          //1启
          console.log(wareids);
          enableWare(wareids)
            .then(response => {
              console.log("启用", response);
              const dataRep = response.data;
              if (errorStatus(dataRep)) {
                if (response.data.code == 200) {
                  this.getListInformation();
                  loading.close();
                  this.$message.success("启用成功!");
                } else {
                  loading.close();
                  this.$message.error(response.data.data);
                }
              }
            })
            .catch(err => {
              loading.close();
              this.$message.error("操作失败!");
            });
        } else if (data == 2) {
          //2停
          warestop(wareids)
            .then(response => {
              const dataRep = response.data;
              if (errorStatus(dataRep)) {
                if (response.data.code == 200) {
                  this.getListInformation();
                  loading.close();
                  this.$message.success("停用成功!");
                } else {
                  loading.close();
                  this.$message.error(response.data.data);
                }
              }
            })
            .catch(err => {
              loading.close();
              this.$message.error("操作失败!");
            });
        } else {
          //3删
          waredel(wareids)
            .then(response => {
              console.log("删除", response);
              const dataRep = response.data;
              if (errorStatus(dataRep)) {
                if (response.data.code == 200) {
                  this.getListInformation();
                  loading.close();
                  this.$message.success("删除成功!");
                } else {
                  loading.close();
                  this.$message.error(response.data.data);
                }
              }
            })
            .catch(err => {
              loading.close();
              this.$message.error("操作失败!");
            });
        }
      }
    },
    addCancel(data) {
      this.addWarehouses = {
        ware_id: null, //冷库ID
        ware_name: null, //冷库名称
        state: null, //冷库类型
        is_ok: null, //订单设置
        province: "", //省
        city: null, //市
        county: null, //县
        address: null //详细地址
      };
      if (data == "addCancel") {
        this.centerDialogVisible = false;
      } else {
        this.romewDialogVisible = false;
      }
      this.$nextTick(function() {
        this.$refs["addWarehouses"].clearValidate();
      });
    },
    addsubBtn(data) {
      const that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const addware = that.addWarehouses;
      if (addware.ware_name == "" || addware.ware_name == null) {
        this.$message.error("冷库名称不能为空!");
        loading.close();
        return false;
      } else if (addware.state == "" || addware.state == null) {
        this.$message.error("请选择冷库类型!");
        loading.close();
        return false;
      } else if (addware.is_ok == "" || addware.is_ok == null) {
        this.$message.error("请选择订单设置!");
        loading.close();
        return false;
      } else if (addware.province == "" || addware.province == null) {
        this.$message.error("请选择省!");
        loading.close();
        return false;
      } else if (addware.city == "" || addware.city == null) {
        this.$message.error("请选择市!");
        loading.close();
        return false;
      } else if (addware.county == "" || addware.county == null) {
        this.$message.error("请选择县!");
        loading.close();
        return false;
      } else if (addware.address == "" || addware.address == null) {
        this.$message.error("请输入详细地址!");
        loading.close();
        return false;
      }

      if (data == "addCla") {
        addWarehouse(addware)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              if (response.data.code == 200) {
                this.$message.success("添加成功!");
                this.centerDialogVisible = false;
                this.getListInformation();
              } else {
                this.$message.error(response.data.data);
              }
            }
          })
          .catch(err => {
            loading.close();
            this.$message.error("添加失败!");
          });
      } else if (data == "compile") {
        modifyWarehouse(addware)
          .then(response => {
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              console.log(response);
              if (response.data.code == 200) {
                loading.close();
                this.$message.success("编辑成功!");
                this.romewDialogVisible = false;
                this.getListInformation();
              } else {
                loading.close();
                this.$message.error(response.data.data);
              }
            }
          })
          .catch(err => {
            loading.close();
            this.$message.error("编辑失败!");
          });
      }
    },
    compile(data) {
      this.addWarehouses.ware_id = data.row.ware_id;
      this.addWarehouses.ware_name = data.row.ware_name;
      this.addWarehouses.state = data.row.type;
      this.addWarehouses.is_ok = data.row.is_ok;
      this.addWarehouses.province = data.row.province;
      this.addWarehouses.city = data.row.city;
      this.addWarehouses.county = data.row.county;
      this.addWarehouses.address = data.row.address;
      this.romewDialogVisible = true;
    },
    addReceipt(data) {
      (this.waresid = data), (this.showAdd = true);
      this.closeAdd = false;
    },
    addReceipt02(data) {
      (this.waresid = data), (this.showAdd02 = true);
      this.closeAdd = false;
    },
    addReceipt03(data) {
      (this.waresid = data), (this.showAdd03 = true);
      this.closeAdd = false;
    },
    addReceipt04(data) {
      (this.waresid = data), (this.showAdd04 = true);
      this.closeAdd = false;
    },
    showListPages() {
      this.showAdd = false;
      this.showAdd02 = false;
      this.showAdd03 = false;
      this.showAdd04 = false;
      this.closeAdd = true;
    },
    submit() {
      this.showListPages();
      this.getListInformation();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.inventory {
  display: inline-block;
}
</style>