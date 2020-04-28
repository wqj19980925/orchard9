<template>
  <div class="app-container">
    <el-row class="sd-module-box" v-if="!areaManage">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">{{tagTitle}}区域列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn" @click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn" @click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delChoseBtn()">删除</el-button>
          <el-button v-if="proId || baseId" class="btn-delete" @click="backBtn()">返回</el-button>
        </div>
      </div>
      <el-form
        ref="formList"
        :model="formList"
        :rules="rules"
        class="sd-form-box clearfix"
        size="medium"
        label-width="100px"
      >
        <el-row class="clearfix">
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="区域名称:" class="sd-form-item" prop="dis_name">
              <el-input v-model="formList.dis_name" placeholder="请输入区域名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="区域编号:" class="sd-form-item" prop="dis_number">
              <el-input v-model="formList.dis_number" placeholder="请输入区域编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="果园名称:" class="sd-form-item" prop="far_id">
              <el-select v-model="formList.far_id" class :disabled="fardis" filterable clearable>
                <el-option
                  v-for="item in baseList"
                  :key="item.far_id"
                  :label="item.far_name"
                  :value="item.far_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="产区类型:" class="sd-form-item" prop="reg_type">
              <el-select v-model="formList.reg_type" class filterable clearable>
                <el-option
                  v-for="item in typelist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="产区名称:" class="sd-form-item" prop="reg_id">
              <el-select v-model="formList.reg_id" class filterable clearable>
                <el-option
                  v-for="item in regionList"
                  :key="item.reg_id"
                  :label="item.reg_name"
                  :value="item.reg_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="生产情况:" class="sd-form-item" prop="product">
              <el-select v-model="formList.product" class filterable clearable>
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态:" class="sd-form-item" prop="dis_state">
              <el-select v-model="formList.dis_state" class>
                <el-option
                  v-for="item in state"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col class="pl-50 fr w250" style>
            <el-button class type="primary" @click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list" width="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="区域名称" min-width align="left">
            <template slot-scope="scope">
              <div align="left">
                <p>{{scope.row.dis_name}}</p>
                <p>{{scope.row.dis_number}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="基础信息" align="left">
            <template slot-scope="scope">
              <div align="left">
                <p>
                  <span class="blue">面积:</span>
                  {{scope.row.dis_unit}}㎡
                </p>
                <p>
                  <span class="blue">检测设备:</span>
                  {{scope.row.env_count}}
                </p>
                <p>
                  <span class="blue">生产情况:</span>
                  <span v-if="scope.row.dis_prod===1">闲置中</span>
                  <span v-if="scope.row.dis_prod===2">筹备</span>
                  <span v-if="scope.row.dis_prod===3">生产中</span>
                  <span v-if="scope.row.dis_prod===4">暂停</span>
                </p>
                <p>
                  <span class="blue">已完成生产:</span>
                  {{scope.row.finish}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="位置信息" align="left">
            <template slot-scope="scope">
              <div align="left">
                <p>
                  <span class="blue">[果园]</span>
                  {{scope.row.far_name}}
                </p>
                <p v-if="scope.row.reg_type == 1">
                  <span class="blue">[类型]</span>耕地大田
                </p>
                <p v-if="scope.row.reg_type == 2">
                  <span class="blue">[类型]</span>圈舍牧区
                </p>
                <p v-if="scope.row.reg_type == 3">
                  <span class="blue">[类型]</span>鱼池水塘
                </p>
                <p v-if="scope.row.reg_type == 4">
                  <span class="blue">[类型]</span>果园林区
                </p>
                <p v-if="scope.row.reg_type == 5">
                  <span class="blue">[类型]</span>温室大棚
                </p>
                <p>
                  <span class="blue">[产区]</span>
                  {{scope.row.reg_name}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="添加人" prop="dis_admin" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.dis_state == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button
                  v-if="btnShow.editBtn"
                  size="mini"
                  class="btn-mainCol"
                  @click="editRow(scope.row)"
                >编辑</el-button>
                <br />
                <el-button
                  v-if="scope.row.dis_state==2 && btnShow.startBtn"
                  size="mini"
                  class="openCol-btn buttonsty"
                  @click="enableThisClas(scope.row,1)"
                >启用</el-button>
                <br v-if="scope.row.dis_state==2 && btnShow.startBtn" />
                <el-button
                  v-if="scope.row.dis_state==1 && btnShow.stopBtn"
                  size="mini"
                  class="stopCol-btn buttonsty"
                  @click="enableThisClas(scope.row,2)"
                >停用</el-button>
                <br v-if="scope.row.dis_state==1 && btnShow.stopBtn" />
                <el-button
                  v-if="btnShow.mangeBtn"
                  size="mini"
                  class="btn-mainCol buttonsty"
                  @click="manageRow(scope.row)"
                >管理</el-button>
                <br />
                <el-button
                  v-if="btnShow.delBtn"
                  size="mini"
                  class="btn-delete buttonsty"
                  @click="delRow(scope.row)"
                >删除</el-button>
                <br />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0" class="lk-page-box">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalNum"
          layout="total, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 弹窗 -->
      <el-dialog
        :visible.sync="showAddClas"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="400px"
        @close="addClaForm('addCla')"
      >
        <el-form ref="addCla" :model="addCla" :rules="rulesCla" label-width="80px">
          <el-form-item label="产区类型" prop="reg_type">
            <el-select v-model="addCla.reg_type" class>
              <el-option
                v-for="item in typelist2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产区名称:" class="sd-form-item" prop="dis_regid">
            <el-select
              v-model="addCla.dis_regid"
              class
              :disabled="regdis"
              @change="changeReg($event)"
              filterable
              clearable
            >
              <el-option
                v-for="item in regionList"
                :key="item.reg_id"
                :label="item.reg_name"
                :value="item.reg_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区域名称:" class="sd-form-item" prop="dis_name" style="width:280px">
            <el-input v-model="addCla.dis_name" placeholder="请输入区域名称" clearable />
          </el-form-item>
          <el-form-item
            v-if="edit && addCla.dis_agoname"
            label="上次命名:"
            class="sd-form-item"
            prop="dis_agoname"
            style="width:280px"
          >
            <el-input v-model="addCla.dis_agoname" disabled />
          </el-form-item>
          <el-form-item label="区域面积" prop="dis_unit">
            <el-input v-model="addCla.dis_unit" placeholder="0.00亩" style="width:100px" />亩
            <span class="add-gods-title">产区剩余面积：{{addCla.restarea}}㎡</span>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button v-if="edit" type="primary" @click="addeditBtn('addCla')">确 定</el-button>
          <el-button v-else type="primary" @click="addBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <areaManList :dis-id="dis_id" @listerToChild="showList()" v-if="areaManage" />
  </div>
</template>
<script>
import {
  areaList,
  startArea,
  stopArea,
  addArea,
  editArea,
  delArea,
  searArea,
  areaBase,
  areaProduct
} from "@/api/productAreaMan";
import { errorStatus } from "@/utils/index";
import areaManList from "./components/areaManList";
export default {
  name: "Account",
  components: { areaManList },
  props: {
    //产区列表进入
    proId: {
      type: Number,
      required: false
    },
    proName: {
      type: String,
      required: false
    },
    secbase: {
      type: Number,
      required: false
    },
    //果园列表进入
    baseId: {
      type: Number,
      required: false
    },
    baseName: {
      type: String,
      required: false
    },
    prirId: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      dis_id: "",
      areaManage: false,
      fardis: false,
      regdis: false,
      formList: {
        dis_name: "",
        dis_number: "",
        far_id: "",
        reg_type: "",
        reg_id: "",
        dis_state: ""
      },
      tagTitle: "",
      edit: false,
      rules: {
        dis_name: [],
        dis_number: [],
        dis_state: [],
        far_id: [],
        reg_type: [],
        reg_id: []
      },
      departList: [],
      workList: [],
      rolesType: null,
      staffType: [{ id: 0, name: "临时工" }],
      state: [
        { id: 0, name: "全部" },
        { id: 1, name: "启用" },
        { id: 2, name: "停用" }
      ],
      state1: [{ id: 1, name: "启用" }, { id: 2, name: "停用" }],
      typelist: [
        { id: 0, name: "全部" },
        { id: 1, name: "耕地大田" },
        { id: 2, name: "圈舍牧区" },
        { id: 3, name: "鱼池水塘" },
        { id: 4, name: "果园林区" },
        { id: 5, name: "温室大棚" }
      ],
      typelist2: [
        { id: 1, name: "耕地大田" },
        { id: 2, name: "圈舍牧区" },
        { id: 3, name: "鱼池水塘" },
        { id: 4, name: "果园林区" },
        { id: 5, name: "温室大棚" }
      ],
      regionList: [],
      baseList: [],
      productList: [],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      worklist: [],
      showAddClas: false,
      showTime: false,
      showRecord: false,
      addCla: {
        dis_unit: null,
        dis_id: null,
        dis_regid: null,
        dis_name: null,
        restarea: 0
      },
      deldis_id: "",
      rulesCla: {
        tem_name: [
          { required: true, message: "请输入临时工姓名", trigger: "blur" }
        ]
      },
      dialogTit: "新增",
      dialog: {
        title: "新增",
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      chosed: [],
      serch_req: false,
      addRules: {
        tem_name: [
          { required: true, message: "请输入临时工姓名", trigger: "blur" }
        ],
        dis_state: [
          { required: true, message: "请选择角色", trigger: "change" }
        ]
      },
      showNPwd: false,
      btnShow: {}
    };
  },
  beforeCreate() {
    // console.log("--111111111111------------")
  },
  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getPageInfo();
    this.formList.dis_state = this.state[0].name;
    this.formList.reg_type = this.typelist[0].name;
    this.askList();
    // this.addForm.adm_stase = this.state1[0].name;
  },
  methods: {
    getPageInfo() {
      // console.log("9099999

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      data.page = this.currentPage;
      if (this.proId) {
        data.pri_id = 324; //写死传324
        this.tagTitle = this.proName + "--";
        data.far_id = this.secbase;
        const reg_id = [];
        reg_id.push(this.proId);
        data.reg_id = reg_id;
        areaProduct(data)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            // console.log('获取列表', dataRep)
            if (errorStatus(dataRep)) {
              // const role_id = { rol_id: 0, rol_name: "全部" };
              // this.godsType.splice(0, 0, role_id);
              this.list = dataRep.data;
              this.currentPage = dataRep.current_page;
              this.pageSize = dataRep.current_number;
              this.totalNum = dataRep.total;
              const btnList = dataRep.button_data;
              for (var i in btnList) {
                if (btnList[i].pri_funname === "新增") {
                  this.$set(this.btnShow, "addBtn", true);
                } else if (btnList[i].pri_funname === "启用") {
                  this.$set(this.btnShow, "startBtn", true);
                } else if (btnList[i].pri_funname === "停用") {
                  this.$set(this.btnShow, "stopBtn", true);
                } else if (btnList[i].pri_funname === "编辑") {
                  this.$set(this.btnShow, "editBtn", true);
                } else if (btnList[i].pri_funname === "删除") {
                  this.$set(this.btnShow, "delBtn", true);
                } else if (btnList[i].pri_funname === "管理") {
                  this.$set(this.btnShow, "mangeBtn", true);
                }
              }
            }
          })
          .catch(Error => {
            loading.close();
            this.$message.error("请求失败");
            console.log("请求失败--", Error);
          });
      } else if (this.baseId) {
        data.pri_id = 324;
        this.tagTitle = this.baseName + "--";
        data.far_id = this.baseId;
        areaBase(data)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            // console.log('获取列表', dataRep)
            if (errorStatus(dataRep)) {
              // const role_id = { rol_id: 0, rol_name: "全部" };
              // this.godsType.splice(0, 0, role_id);
              this.list = dataRep.data;
              this.currentPage = dataRep.current_page;
              this.pageSize = dataRep.current_number;
              this.totalNum = dataRep.total;
              const btnList = dataRep.button_data;
              for (var i in btnList) {
                if (btnList[i].pri_funname === "新增") {
                  this.$set(this.btnShow, "addBtn", true);
                } else if (btnList[i].pri_funname === "启用") {
                  this.$set(this.btnShow, "startBtn", true);
                } else if (btnList[i].pri_funname === "停用") {
                  this.$set(this.btnShow, "stopBtn", true);
                } else if (btnList[i].pri_funname === "编辑") {
                  this.$set(this.btnShow, "editBtn", true);
                } else if (btnList[i].pri_funname === "删除") {
                  this.$set(this.btnShow, "delBtn", true);
                } else if (btnList[i].pri_funname === "管理") {
                  this.$set(this.btnShow, "mangeBtn", true);
                }
              }
            }
          })
          .catch(Error => {
            loading.close();
            this.$message.error("请求失败");
            console.log("请求失败--", Error);
          });
      } else {
        data.pri_id = this.$route.meta.pri_id;
        areaList(data)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            // console.log('获取列表', dataRep)
            if (errorStatus(dataRep)) {
              // const role_id = { rol_id: 0, rol_name: "全部" };
              // this.godsType.splice(0, 0, role_id);
              this.list = dataRep.data;
              this.currentPage = dataRep.current_page;
              this.pageSize = dataRep.current_number;
              this.totalNum = dataRep.total;
              const btnList = dataRep.button_data;
              for (var i in btnList) {
                if (btnList[i].pri_funname === "新增") {
                  this.$set(this.btnShow, "addBtn", true);
                } else if (btnList[i].pri_funname === "启用") {
                  this.$set(this.btnShow, "startBtn", true);
                } else if (btnList[i].pri_funname === "停用") {
                  this.$set(this.btnShow, "stopBtn", true);
                } else if (btnList[i].pri_funname === "编辑") {
                  this.$set(this.btnShow, "editBtn", true);
                } else if (btnList[i].pri_funname === "删除") {
                  this.$set(this.btnShow, "delBtn", true);
                } else if (btnList[i].pri_funname === "管理") {
                  this.$set(this.btnShow, "mangeBtn", true);
                }
              }
            }
          })
          .catch(Error => {
            loading.close();
            this.$message.error("请求失败");
            console.log("请求失败--", Error);
          });
      }
    },
    askList(name) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      searArea(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            loading.close();
            const gos = { reg_id: 0, reg_name: "全部" };
            const goo_cla = dataRep.data.region;
            goo_cla.unshift(gos);
            this.regionList = goo_cla;

            const farmland = dataRep.data.farmland;
            const farm = { far_id: 0, far_name: "全部" };
            farmland.unshift(farm);
            this.baseList = farmland;
            if (this.edit) {
              for (var i in this.regionList) {
                if (this.regionList[i].reg_name === name) {
                  this.addCla.dis_regid = this.regionList[i].reg_id;
                  this.addCla.restarea = this.regionList[i].reg_surplus;
                }
              }
            }
            if (!this.proId && !this.baseId) {
              this.formList.reg_id = this.regionList[0].reg_id;
              this.formList.far_id = this.regionList[0].far_id;
            } else {
              if (this.proId) {
                for (var i in this.regionList) {
                  if (this.regionList[i].reg_id === this.proId) {
                    this.formList.reg_id = this.regionList[i].reg_id;
                    this.addCla.dis_regid = this.regionList[i].reg_id;
                    this.addCla.restarea = this.regionList[i].reg_surplus;
                    this.regdis = true;
                  }
                }
              }
            }
          }
        })
        .catch(err => {
          this.$message.error("请求失败!");
          console.log("获取列表err", err);
        });
    },

    // 搜索
    searchList(formName, page) {
      const search = {};
      search.dis_name = this.formList.dis_name;
      search.dis_number = this.formList.dis_number;
      search.far_id = this.formList.far_id;
      search.reg_id = this.formList.reg_id;
      search.reg_type = this.formList.reg_type;
      search.dis_state = this.formList.dis_state;
      if (search.dis_state === "全部" || search.dis_state === 0) {
        search.dis_state = "";
      }
      if (search.reg_type === "全部" || search.reg_type === 0) {
        search.reg_type = "";
      }
      if (search.far_id === "全部" || search.far_id === 0) {
        search.far_id = "";
      }
      if (search.reg_id === "全部" || search.reg_id === 0) {
        search.reg_id = "";
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // console.log('search--', search)
      search.pri_id = this.$route.meta.pri_id;
      search.page = page;
      areaList(search)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            // const rol = { rol_id: 0, rol_name: '全部' }
            // const role = dataRep.data_info.role
            // role.unshift(rol)
            // this.godsType = role
            this.list = dataRep.data;
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
            this.serch_req = true;
          }
        })
        .catch(Error => {
          loading.close();
          this.$message.error("请求失败");
        });
    },

    // 编辑按钮
    editRow(scope) {
      this.showAddClas = true;
      this.dialogTit = "编辑区域";
      this.edit = true;
      this.$nextTick(() => {
        this.askList(scope.reg_name);
        // console.log(scope)
        this.addCla.dis_name = scope.dis_name;
        this.addCla.far_name = scope.far_name;
        this.addCla.reg_type = scope.reg_type;
        this.addCla.dis_id = scope.dis_id;
        this.addCla.dis_agoname = scope.dis_agoname;
        this.addCla.dis_unit = scope.dis_unit;
        for (var i in this.regionList) {
          if (this.regionList[i].reg_name === scope.reg_name) {
            this.addCla.dis_regid = this.regionList[i].reg_id;
            this.addCla.restarea = this.regionList[i].reg_surplus;
          }
        }
      });
    },
    addClaForm(formName) {
      this.showAddClas = false;
      if (this.regionList[0].reg_name !== "全部") {
        const gos = { reg_id: 0, reg_name: "全部" };
        this.regionList.unshift(gos);
      }
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
        this.addCla.restarea = 0;
      });
      this.showTime = false;
    },
    // 添加-弹窗
    addGoodsBtn() {
      // 点击我的云仓添加按钮后的操作
      if (this.regionList[0].reg_name === "全部") {
        //加上判断这个否则走一次方法删一个最后删没了
        this.$delete(this.regionList, 0);
      }
      this.showAddClas = true;
      this.dialogTit = "新增区域";
      this.edit = false;
      // this.$refs[addCla].resetFields()
      /*      this.addCla.type = this.type[1].name*/
    },
    // 添加--提交
    addBtn() {
      const that = this;
      const data = that.addCla;

      if (that.addCla.dis_ === "") {
        this.$message.error("请选择产区名称");
        return false;
      }
      if (that.addCla.dis_name === "") {
        this.$message.error("请输入区域名称:");
        return false;
      }
      // data.name = that.addCla.name
      // data.tel = that.addCla.tel
      // data.baseid = 1
      // data.secid = that.addCla.secid

      addArea(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo();
            that.$message.success("区域信息增加成功!");
            that.showAddClas = false;
            if (this.regionList[0].reg_name !== "全部") {
              const gos = { reg_id: 0, reg_name: "全部" };
              this.regionList.unshift(gos);
            }
          }
        })
        .catch(err => {
          console.log("获取列表err", err);
          this.$message.error("请求失败!");
        });
    },
    // 添加--提交
    addeditBtn(formName) {
      const that = this;
      const data = that.addCla;

      // if (that.addCla.name === '') {
      //   this.$message.error('请输入临时工姓名')
      //   return false
      // }
      // if (that.addCla.tel === '') {
      //   this.$message.error('请输入联系方式')
      //   return false
      // }
      // data.name = that.addCla.name
      // data.tel = that.addCla.tel
      // data.id = that.addCla.id
      // data.baseid = 1
      // data.secid = that.addCla.secid
      editArea(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.$message.success("编辑区域信息成功!");
            that.showAddClas = false;
            that.$refs[formName].resetFields();
            that.addCla.name = "";
            if (this.regionList[0].reg_name !== "全部") {
              const gos = { reg_id: 0, reg_name: "全部" };
              this.regionList.unshift(gos);
            }
            that.getPageInfo();
          }
        })
        .catch(err => {
          console.log("获取列表err", err);
          this.$message.error("请求失败!");
        });
    },
    //切換区域剩余面积
    changeReg(e) {
      for (var i in this.regionList) {
        if (this.regionList[i].reg_id === e) {
          this.addCla.restarea = this.regionList[i].reg_surplus;
        }
      }
    },
    //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed;
      if (chosed.length < 1) {
        this.$message.error("请选择要删除的区域!");
      } else {
        const data = {};
        data.dis_id = [];
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.dis_id.push(chosed[i].dis_id);
        }
        this.$confirm("请确认,是否删除所选中的区域?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delArea(data)
            .then(response => {
              // console.log('delgo---', response)
              if (errorStatus(response.data)) {
                this.currentPage = 1;
                this.getPageInfo();
                this.$message.success("删除成功!");
              }
            })
            .catch(Error => {
              this.$message.error("请求失败");
            });
        });
      }
    },
    // 删除-这个
    delRow(row) {
      // console.log('del---row', row)
      const data = {};
      const dis_id = [];
      dis_id.push(row.dis_id);
      data.dis_id = dis_id;
      // console.log('删除---', data)
      this.$confirm("请确认,是否删除所选中的区域?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delArea(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success("删除成功");
              if (this.currentPage !== 1 && this.list.length === 1) {
                this.currentPage = this.currentPage - 1;
              }
              this.getPageInfo();
            }
          })
          .catch(Error => {
            this.$message.error("请求失败");
          });
      });
    },
    // 单个--启用--停用
    enableThisClas(row, num) {
      const data = {};
      data.dis_id = [row.dis_id];
      if (num === 1) {
        // 启用
        startArea(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success("启用成功!");
              row.dis_state = num;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败!");
          });
      } else if (num === 2) {
        // 停用
        stopArea(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success("停用成功!");
              row.dis_state = num;
            }
          })
          .catch(Error => {
            // console.log("停用的区域err", err);
            this.$message.error("请求失败!");
          });
      }
    },
    // 启用
    enableClas() {
      const list = this.list;
      const chosed = this.chosed;
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error("请选择要启用的区域!");
      } else {
        const dis_id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].dis_state === "2") {
            dis_id.push(chosed[i].dis_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (dis_id.length > 0) {
          data.dis_id = dis_id;
          this.$confirm("请确认,是否启用选中的区域?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              startArea(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in dis_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (dis_id[i] === list[j].dis_id) {
                          list[j].dis_state = 1;
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list;
                    this.getPageInfo();
                    this.$message.success("启用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的区域err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消停用");
            });
        } else {
          this.$confirm("选中区域的状态全部为'启用'", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error"
          }).then(() => {});
        }
      }
    },
    // 停用
    stopClas() {
      const list = this.list;
      const chosed = this.chosed;
      if (chosed.length < 1) {
        this.$message.error("请选择要停用的区域!");
      } else {
        const dis_id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].dis_state === "1") {
            dis_id.push(chosed[i].dis_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (dis_id.length > 0) {
          data.dis_id = dis_id;
          this.$confirm("请确认,是否停用选中区域?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              stopArea(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in dis_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (dis_id[i] === list[j].dis_id) {
                          list[j].dis_state = 2;
                        }
                      }
                    }
                    this.list = list;
                    this.getPageInfo();
                    this.$message.success("停用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的区域err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消停用");
            });
        } else {
          this.$confirm("选中区域状态已全部为'停用'?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error"
          }).then(() => {});
        }
      }
    },
    //进入区域管理页面
    manageRow(row) {
      this.areaManage = true;
      this.dis_id = row.dis_id;
    },
    showList() {
      this.areaManage = false;
      this.getPageInfo();
      this.formList.dis_state = this.state[0].name;
      this.formList.reg_type = this.typelist[0].name;
      this.askList();
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val;
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.serch_req) {
        this.searchList("formList", val);
      } else {
        this.getPageInfo();
      }
    },
    handleCurrentWkChange(val) {
      this.currentWkPage = val;
      this.viewJob();
    },
    // 弹窗--取消
    cancle(formName) {
      this.$refs[formName].resetFields();
      this.dialog.show = false;
    },
    backBtn() {
      // var tagName={}
      // if(this.baseId){
      //   tagName=this.baseName
      // }else if(this.proId){
      //   tagName=this.proName
      // }
      //  this.$confirm('确定离开'+tagName+'的区域列表?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   })
      //   .then(() => {
      this.$emit("listerToChild", "addPage");
      //   }).catch(() => {
      // })
    },
    cancleDia(formName) {
      const addForm = this.addForm;
      this.dialog.show = false;
      addForm.adm_name = "";
      addForm.adm_acc = "";
      addForm.adm_mobile = "";
      addForm.adm_pre = "";
      addForm.adm_stase = "";
      addForm.adm_pas = "";
      // if(addForm.adm_name!==''||addForm.adm_acc!==''||addForm.adm_mobile!==''||addForm.adm_pre!==''||addForm.adm_stase!==''||addForm.adm_pas!==''){
      //     this.$confirm('添加尚未完成,是否确定离开', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {

      //   }).catch(() => {

      // })
      // }
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
        // padding: 0 120px;
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
      padding: 0 40px 0 0;
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
.add-gods-title {
  color: #c0c4cc;
  font-size: 14px;
}
.buttonsty {
  margin-left: 0px !important;
  margin-top: 10px;
}
</style>