<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">农户列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn" @click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn" @click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.etBtn" class="openCol-btn" @click="exportfarmerFun()">导出</el-button>
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
            <el-form-item label="负责人姓名:" class="sd-form-item" prop="far_name">
              <el-input v-model="formList.far_name" placeholder="请输入负责人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="联系电话:" class="sd-form-item" prop="far_mobile">
              <el-input v-model="formList.far_mobile" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态分类:" class="sd-form-item" prop="far_state">
              <el-select v-model="formList.state" class>
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
      <!--                 @click="viewJob(scope.row,1)" -->
      <div class="lk-table-box">
        <el-table :data="list" width="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="ID" prop="far_id" min-width align="center" />
          <el-table-column label="负责人姓名" prop="far_name" min-width align="center" />
          <el-table-column label="联系电话" prop="far_mobile" align="center" />
          <el-table-column label="果园名称" prop="far_count" align="center">
            <template slot-scope="scope">
              <span
                class="blue"
              >{{scope.row.far_count}}</span>
            </template>
          </el-table-column>
          <el-table-column label="子账号" prop="rol_name" align="center">
            <template slot-scope="scope">
              <span
                class="blue"
                v-if="scope.row.acc_count"
                @click="viewJob(scope.row,2)"
              >{{scope.row.acc_count}}</span>
              <span v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column label="农户物资" prop="adm_creator" align="center">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button size="mini" class="btn-mainCol" @click="viewJob(scope.row,3)">查看</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.far_state == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="320">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button
                  v-if="btnShow.resetBtn"
                  size="mini"
                  class="btn-mainCol"
                  @click="editPwd(scope.row)"
                >重置密码</el-button>
                <el-button
                  v-if="btnShow.editBtn"
                  size="mini"
                  class="btn-mainCol"
                  @click="editRow(scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="scope.row.far_state==2 && btnShow.startBtn"
                  size="mini"
                  class="openCol-btn"
                  @click="enableThisClas(scope.row,1)"
                >启用</el-button>
                <el-button
                  v-if="scope.row.far_state==1 && btnShow.stopBtn"
                  size="mini"
                  class="stopCol-btn"
                  @click="enableThisClas(scope.row,2)"
                >停用</el-button>
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
      <!-- 重置密码 -->
      <el-dialog
        :visible.sync="showNPwd"
        :close-on-click-modal="false"
        title="重置密码"
        width="30%"
        class="dialog_resetPwd"
        @close="showNPwd=false"
      >
        <div class="resetPwd_box">
          <!-- <div class="succes-icon-box">

          </div>-->
          <div class="succes-text-box">
            <p class="tip_success">
              <i class="el-icon-success" />成功!
            </p>
            <p class="tip_suc">
              重置密码为:
              <span class="text-pwd">111111</span>
            </p>
          </div>
        </div>
        <span slot="footer">
          <el-button type="primary" @click="showNPwd=false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹窗 -->
      <el-dialog
        :visible.sync="showAddClas"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="400px"
        @close="addClaForm('addCla')"
      >
        <el-form ref="addCla" :model="addCla" :rules="rulesCla" label-width="100px">
          <el-form-item label="负责人姓名" prop="far_name">
            <el-input v-model="addCla.far_name" style="width:195px" placeholder="请输入负责人姓名" />
          </el-form-item>
          <el-form-item label="联系方式" prop="far_mobile">
            <el-input
              v-model="addCla.far_mobile"
              style="width:195px"
              placeholder="请输入联系方式"
              @blur="blurValue($event,index)"
            />
          </el-form-item>
          <div class="tip_box">使用手机号在公众号“ 果品溯源管理平台 ”获取验证码进行登陆</div>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button v-if="edit" type="primary" @click="addeditBtn('addCla')">确 定</el-button>
          <el-button v-else type="primary" @click="addBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="showRecord"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="650px"
        @close="closeWork('addCla')"
      >
        <el-form :inline="true" ref="addCla" :model="addCla" :rules="rulesCla">
          <el-form-item label="负责人姓名" prop="far_name">
            <el-input
              v-model="addCla.far_name"
              :disabled="true"
              style="width:195px"
              placeholder="请输入临时工姓名"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="far_mobile">
            <el-input
              v-model="addCla.far_mobile"
              :disabled="true"
              style="width:195px"
              placeholder="请输入联系方式"
            />
          </el-form-item>
        </el-form>
        <el-table :data="worklist" width="100%" v-if="showevery===3">
          <el-table-column label="商品/农资名称" prop="agr_name" align="center" min-height="250" />
          <el-table-column label="数量" prop="fma_num" align="center" />
        </el-table>
        <el-table :data="worklist" width="100%" v-if="showevery===2" min-height="250">
          <el-table-column label="姓名" prop="adm_name" align="center" />
          <el-table-column label="联系电话" prop="adm_mobile" align="center" />
        </el-table>
        <el-table :data="worklist" width="100%" v-if="showevery===1" min-height="250">
          <el-table-column label="果园名称" prop="far_name" align="center" />
          <el-table-column label="地址" prop="far_address" align="center" />
        </el-table>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import {
  farmerList,
  startFarmer,
  stopFarmer,
  addFarmer,
  editFarmer,
  resetFmpwd,
  getBaseInfo,
  getMaterInfo,
  getAccount,
  exportfarmerAx
} from "@/api/personMange";
import { errorStatus } from "@/utils/index";
import { phoneTest, valiPassword } from "@/utils/validate";
export default {
  name: "Account",
  data() {
    const phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      }
      if (!phoneTest(value)) {
        return callback(new Error("请确认手机号的正确性"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!valiPassword(value)) {
        callback(new Error("密码长度6~15"));
      } else {
        callback();
      }
    };
    return {
      formList: {
        far_name: "",
        far_mobile: "",
        state: ""
      },
      showevery: "",
      edit: false,
      rules: {
        far_name: [],
        far_mobile: [],
        far_state: []
      },
      rolesType: null,
      state: [
        { id: 0, name: "全部" },
        { id: 1, name: "启用" },
        { id: 2, name: "停用" }
      ],
      state1: [{ id: 1, name: "启用" }, { id: 2, name: "停用" }],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addCla: {
        far_name: null,
        far_mobile: null,
        far_id: null
      },
      rulesCla: {
        far_name: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" }
        ],
        far_mobile: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          { validator: phone, trigger: "change" }
        ]
      },
      showRecord: false,
      worklist: [],
      currentWkPage: 1,
      pageWkSize: null,
      totalWkNum: null,
      dialogTit: "新增",
      dialog: {
        title: "新增",
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      btnShow: {
        addBtn: false,
        editBtn: false,
        startBtn: false,
        stopBtn: false,
        resetBtn: false,
        etBtn: false,
      },
      chosed: [],
      serch_req: false,
      addRules: {
        far_name: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" }
        ],
        far_mobile: [{ required: true, trigger: "blur", validator: phone }],
        far_state: [
          { required: true, message: "请选择角色", trigger: "change" }
        ]
      },
      showNPwd: false
    };
  },
  beforeCreate() {
    // console.log("--111111111111------------")
  },
  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getPageInfo();
    this.formList.far_state = this.state[0].name;
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
      data.pri_id = this.$route.meta.pri_id;
      data.page = this.currentPage;
      farmerList(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            this.$forceUpdate()
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
            const btnList = dataRep.button_data;
            for (const i in btnList) {
              if (btnList[i].pri_funname === "新增") {
                this.btnShow.addBtn = true;
              } else if (btnList[i].pri_funname === "编辑") {
                this.btnShow.editBtn = true;
              } else if (btnList[i].pri_funname === "启用") {
                this.btnShow.startBtn = true;
              } else if (btnList[i].pri_funname === "停用") {
                this.btnShow.stopBtn = true;
              } else if (btnList[i].pri_funname === "重置密码") {
                this.btnShow.resetBtn = true;
              } else if (btnList[i].pri_funname === "导出") {
                this.btnShow.etBtn = true;
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
    handleCurrentWkChange(val) {
      this.currentWkPage = val;
      this.viewJob();
    },
    closeWork(formName) {
      this.showRecord = false;
      this.showevery = "";
      this.dialogTit = "";
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
      this.worklist = [];
    },
    viewJob(scope, type) {
      this.showRecord = true;

      this.$nextTick(() => {
        this.addCla.far_name = scope.far_name;
        this.addCla.far_mobile = scope.far_mobile;
      });
      const data = {};
      data.far_id = scope.far_id;
      if (type === 1) {
        this.dialogTit = "果园信息";
        this.showevery = 1;
        getBaseInfo(data)
          .then(response => {
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.worklist = dataRep.data.farm;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败");
            console.log("请求失败--", Error);
          });
      }
      if (type === 2) {
        this.dialogTit = "子账号信息";
        this.showevery = 2;
        getAccount(data) //子账号信息接口没写好先写成果园的
          .then(response => {
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.worklist = dataRep.data;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败");
            console.log("请求失败--", Error);
          });
      }
      if (type === 3) {
        this.dialogTit = "农户物资";
        this.showevery = 3;
        getMaterInfo(data)
          .then(response => {
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.worklist = dataRep.data;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败");
            console.log("请求失败--", Error);
          });
      }
    },
    blurValue(e, index) {
      const val = e.target.value;
      if (!phoneTest(val)) {
        this.$message.error("请输入正确的手机号!");
        return false;
      }
    },
    // 搜索
    searchList(formName, page) {
      const search = {};
      search.name = this.formList.far_name;
      search.mobile = this.formList.far_mobile;
      if (this.formList.state == "全部" || this.formList.state == 0) {
        search.state = "";
      }else{
        search.state = this.formList.state;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      search.pri_id = this.$route.meta.pri_id;
      search.page = page;
      farmerList(search)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
            const btnList = dataRep.button_data;
            for (const i in btnList) {
              if (btnList[i].pri_funname === "新增") {
                this.btnShow.addBtn = true;
              } else if (btnList[i].pri_funname === "编辑") {
                this.btnShow.editBtn = true;
              } else if (btnList[i].pri_funname === "启用") {
                this.btnShow.startBtn = true;
              } else if (btnList[i].pri_funname === "停用") {
                this.btnShow.stopBtn = true;
              } else if (btnList[i].pri_funname === "重置密码") {
                this.btnShow.resetBtn = true;
              } else if (btnList[i].pri_funname === "导出") {
                this.btnShow.etBtn = true;
              }
            }
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
      this.dialogTit = "编辑农户";
      this.edit = true;
      // console.log(scope)
      this.$nextTick(() => {
        this.addCla.far_name = scope.far_name;
        this.addCla.far_mobile = scope.far_mobile;
        this.addCla.far_id = scope.far_id;
      });
    },
    addClaForm(formName) {
      this.showAddClas = false;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    // 添加-弹窗
    addGoodsBtn() {
      // 点击我的云仓添加按钮后的操作
      this.showAddClas = true;
      this.edit = false;
      this.dialogTit = "新增农户";
      // this.$refs[addCla].resetFields()
      /*      this.addCla.type = this.type[1].name*/
    },
    // 添加--提交
    addBtn(formName) {
      const that = this;
      const data = {};
      if (that.addCla.far_name === "") {
        this.$message.error("请输入负责人姓名");
        return false;
      }
      if (that.addCla.far_mobile === "") {
        this.$message.error("请输入联系电话");
        return false;
      }
      if (!phoneTest(that.addCla.far_mobile)) {
        this.$message.error("请输入正确的联系电话!");
        return false;
      }
      data.name = that.addCla.far_name;
      data.mobile = that.addCla.far_mobile;
      addFarmer(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo();
            this.$message.success("农户信息增加成功!");
            this.$refs[formName].resetFields();
            this.showAddClas = false;
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
      const data = {};
      if (that.addCla.far_name === "") {
        this.$message.error("请输入负责人姓名");
        return false;
      }
      if (that.addCla.far_mobile === "") {
        this.$message.error("请输入联系方式");
        return false;
      }
      if (!phoneTest(that.addCla.far_mobile)) {
        this.$message.error("请输入正确的联系电话!");
        return false;
      }
      data.name = that.addCla.far_name;
      data.mobile = that.addCla.far_mobile;
      data.id = that.addCla.far_id;
      editFarmer(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.$message.success("编辑农户信息成功!");
            this.showAddClas = false;
            this.$refs[formName].resetFields();
            this.addCla.cla_name = "";
            this.addCla.cla_id = "";
            that.getPageInfo();
          }
        })
        .catch(err => {
          console.log("获取列表err", err);
          this.$message.error("请求失败!");
        });
    },
    // 重置密码
    editPwd(row) {
      const data = {};
      data.id = row.far_id;
      this.$confirm("确定重置该账号密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        resetFmpwd(data).then(response => {
          if (errorStatus(response.data)) {
            this.showNPwd = true;
          }
        });
      });
    },
    // 单个--启用--停用
    enableThisClas(row, num) {
      const data = {};
      data.id = [row.far_id];
      if (num === 1) {
        // 启用
        startFarmer(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success("启用成功!");
              row.far_state = num;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败!");
          });
      } else if (num === 2) {
        // 停用
        stopFarmer(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success("停用成功!");
              row.far_state = num;
            }
          })
          .catch(Error => {
            // console.log("停用的农户err", err);
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
        this.$message.error("请选择要启用的农户!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].far_state === 2) {
            id.push(chosed[i].far_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.id = id;
          this.$confirm("请确认,是否启用选中的农户?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              startFarmer(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].far_id) {
                          list[j].far_state = 1;
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list;
                    this.$message.success("启用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的农户err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消停用");
            });
        } else {
          this.$confirm("选中账号的状态全部为'启用'", "提示", {
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
        this.$message.error("请选择要停用的农户!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].far_state === 1) {
            id.push(chosed[i].far_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.id = id;
          this.$confirm("请确认,是否停用选中账号?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              stopFarmer(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].far_id) {
                          list[j].far_state = 2;
                        }
                      }
                    }
                    this.list = list;
                    this.$message.success("停用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的农户err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消停用");
            });
        } else {
          this.$confirm("选中账号状态已全部为'停用'?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error"
          }).then(() => {});
        }
      }
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
    // 弹窗--取消
    cancle(formName) {
      this.$refs[formName].resetFields();
      this.dialog.show = false;
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
      this.formList.state = ''
      this.$refs[formName].resetFields();
    },
    // 导出
    exportfarmerFun() {
      const data = {}
      data.far_mobile = this.formList.far_mobile
      data.far_name = this.formList.far_name
      exportfarmerAx(data)
      .then(res => {
        if(errorStatus(res.data)){
          console.log(res.data, '导出')
          let baseurl = process.env.BASE_API;
          let str = baseurl.replace('public', '')
          window.location.href = str + '/' + res.data.data;
        }
      })
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
.blue {
  cursor: pointer;
}
.tip_box {
      color: #f35e5e;
      font-size: 12px;
      line-height: 20px;
    }
</style>