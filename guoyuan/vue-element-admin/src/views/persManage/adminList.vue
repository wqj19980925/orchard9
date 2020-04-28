<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">账号列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn" @click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn" @click="stopClas()">停用</el-button>
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
            <el-form-item label="员工姓名:" class="sd-form-item" prop="adm_name">
              <el-input v-model="formList.adm_name" placeholder="请输入员工姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="联系电话:" class="sd-form-item" prop="adm_tel">
              <el-input v-model="formList.adm_tel" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="备注:" class="sd-form-item" prop="adm_remark">
              <el-input v-model="formList.adm_remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="角色权限:" class="sd-form-item" prop="rol_id">
              <el-select v-model="formList.rol_id" class>
                <el-option
                  v-for="item in rolelist"
                  :key="item.rol_id"
                  :label="item.rol_name"
                  :value="item.rol_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态分类:" class="sd-form-item" prop="adm_stase">
              <el-select v-model="formList.adm_stase" class>
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
          <el-table-column label="员工姓名" prop="adm_name" min-width align="center" />
          <el-table-column label="联系电话" prop="adm_mobile" align="center" />
          <el-table-column label="部门班组" prop="sec_name" align="center" />
          <el-table-column label="角色名称" prop="rol_name" align="center" />
          <el-table-column label="备注" show-overflow-tooltip prop="adm_remark" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.adm_stase == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="320">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button
                  v-if="btnShow.editBtn"
                  size="mini"
                  class="btn-mainCol"
                  @click="editRow(scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="scope.row.adm_stase==2 && btnShow.startBtn"
                  size="mini"
                  class="openCol-btn"
                  @click="enableThisClas(scope.row,1)"
                >启用</el-button>
                <el-button
                  v-if="scope.row.adm_stase==1 && btnShow.stopBtn"
                  size="mini"
                  class="stopCol-btn"
                  @click="enableThisClas(scope.row,2)"
                >停用</el-button>
                <el-button
                  v-if="btnShow.resetBtn"
                  size="mini"
                  class="btn-mainCol"
                  @click="editPwd(scope.row)"
                >重置密码</el-button>
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
        <el-form ref="addCla" :model="addCla" :rules="rulesCla" label-width="80px">
          <el-form-item label="员工姓名" prop="off_name">
            <el-select
              v-model="addCla.off_name"
              filterable
              remote
              placeholder="请输入管理员姓名并选择"
              style="width:200px;"
              :remote-method="changeName"
              @change="cleanbox($event)"
              clearable
            >
              <el-option
                v-for="item in namelist"
                :key="item.off_name"
                :label="item.off_name"
                :value="item.off_name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="!addCla.off_name==''" label="联系电话" prop="off_tel">
            <el-input v-model="addCla.off_tel" class="labelwidth" disabled />
          </el-form-item>
          <el-form-item v-if="!addCla.off_name==''" label="部门班组" class="sd-form-item" prop="sec_id">
            <el-input v-model="addCla.sec_name" class="labelwidth" disabled />
            <!-- <el-select v-model="addCla.sec_name" class="labelwidth" placeholder="全部"  clearable>
            <el-option v-for="item in teamlist":key="item.sec_id":label="item.sec_name":value="item.sec_id"/>
            </el-select>-->
          </el-form-item>
          <el-form-item label="登录密码" prop="off_pwd">
            <el-input v-model="addCla.off_pwd" class="labelwidth" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="角色权限" class="sd-form-item" prop="rol_id">
            <el-select
              v-model="addCla.rol_id"
              class="labelwidth"
              placeholder="全部"
              filterable
              clearable
            >
              <el-option
                v-for="item in rolelistno"
                :key="item.rol_id"
                :label="item.rol_name"
                :value="item.rol_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addCla.remark" class="labelwidth" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button type="primary" @click="addBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改弹窗 -->
      <el-dialog
        :visible.sync="showEditClas"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="650px"
        @close="addClaForm('addCla',1)"
      >
        <el-form :inline="true" ref="addCla" :model="addCla" :rules="rulesCla" label-width="80px">
          <el-form-item label="员工姓名" prop="off_name">
            <el-input v-model="addCla.off_name" class="labelwidth" disabled />
          </el-form-item>
          <el-form-item label="联系电话" prop="off_tel">
            <el-input v-model="addCla.off_tel" class="labelwidth" disabled />
          </el-form-item>
          <el-form-item label="部门班组" class="sd-form-item" prop="sec_id">
            <el-input v-model="addCla.sec_name" class="labelwidth" disabled />
          </el-form-item>
          <el-form-item label="状态" class="sd-form-item" prop="sec_id">
            <el-select v-model="addCla.adm_stase" class="labelwidth">
              <el-option v-for="item in state" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色权限" class="sd-form-item" prop="rol_id">
            <el-select v-model="addCla.rol_id" class="labelwidth" placeholder="全部">
              <el-option
                v-for="item in rolelistno"
                :key="item.rol_id"
                :label="item.rol_name"
                :value="item.rol_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addCla.remark" class="labelwidth" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla',1)">取 消</el-button>
          <el-button type="primary" @click="addeditBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import {
  adminList,
  startAdmin,
  stopAdmin,
  addAdmin,
  editAdmin,
  resetAdminpwd,
  searchRoal,
  searchAdmin
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
        off_name: "",
        off_tel: "",
        rol_id: "",
        adm_remark: "",
        adm_stase: "",
        sec_id: "",
        off_id: "",
        adm_id: ""
      },
      rules: {
        off_name: [],
        off_tel: [],
        adm_stase: []
      },
      secType: null,
      baseType: null,
      offstate: [
        { id: 0, name: "全部" },
        { id: 1, name: "参与" },
        { id: 2, name: "未参与" }
      ],
      state: [
        { id: 0, name: "全部" },
        { id: 1, name: "启用" },
        { id: 2, name: "停用" }
      ],
      state1: [{ id: 1, name: "启用" }, { id: 2, name: "停用" }],
      rolelist: [],
      rolelistno: [],
      list: [],
      namelist: [],
      phonelist: [],
      teamlist: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showEditClas: false,
      showAddClas: false,
      addCla: {
        adm_stase: null,
        off_id: null,
        off_name: null,
        off_tel: null,
        off_base: null,
        sec_id: null,
        off_baseid: null,
        sec_name: null
      },
      rulesCla: {
        off_name: [
          { required: true, message: "请输入员工姓名", trigger: "blur" }
        ],
        off_tel: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
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
        off_name: [
          { required: true, message: "请输入员工姓名", trigger: "blur" }
        ],
        off_tel: [{ required: true, trigger: "blur", validator: phone }],
        adm_stase: [
          { required: true, message: "请选择角色", trigger: "change" }
        ]
      },
      showNPwd: false,
      btnShow: {}
    };
  },
  created() {
    // 页面加载时
    this.getPageInfo();
    this.formList.adm_stase = this.state[0].name;
    this.RoleList(1);
  },
  methods: {
    getPageInfo() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      data.pri_id = this.$route.meta.pri_id;
      data.page = this.currentPage;
      adminList(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
            const btnList = dataRep.button_data;
            for (const i in btnList) {
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
              } else if (btnList[i].pri_funname === "重置密码") {
                this.$set(this.btnShow, "resetBtn", true);
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
    //角色权限
    RoleList(type) {
      const data = {};
      data.type = type;
      searchRoal(data)
        .then(response => {
          console.log(response)
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            if ((type = 1)) {
              this.rolelist = dataRep.data;
              const gos = { rol_id: 1, rol_name: "全部" };
              this.rolelist.unshift(gos);
              if (this.rolelist.length !== 0) {
                this.formList.rol_id = this.rolelist[0].rol_id;
              }
              console.log(this.rolelist, 'this.rolelist')
            }
          }
        })
        .catch(Error => {
          this.$message.error("请求失败");
        });
    },
    //部门班组
    teamList(type) {
      const data = {};
      data.type = type;
      searchRoal(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            if ((type = 1)) {
              this.teamlist = dataRep.data;
              // this.addCla.sec_id = this.rolelist[0].sec_id
              this.addCla.sec_id = 1;
            }
          }
        })
        .catch(Error => {
          this.$message.error("请求失败");
        });
    },
    // 搜索
    searchList(formName, page) {
      const search = {};
      search.adm_name = this.formList.adm_name;
      search.adm_tel = this.formList.adm_tel;
      search.adm_remark = this.formList.adm_remark;
      search.rol_id = this.formList.rol_id;
      search.adm_state = this.formList.adm_state;
      if (search.adm_stase === "全部" || search.adm_stase === 1) {
        search.adm_stase = "";
      }
      if (search.rol_id === "全部" || search.rol_id === 1) {
        search.rol_id = "";
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      search.pri_id = this.$route.meta.pri_id;
      // console.log('search--', search)
      search.page = page;
      adminList(search)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
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
    // 删除-这个
    delBtn(row) {
      const data = {};
      const off_id = [];
      off_id.push(row.off_id);
      data.off_id = off_id;
      // console.log('删除---', data)
      this.$confirm("请确认,是否删除所选中的用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delStaff(data)
          .then(response => {
            if (errorStatus(response.data)) {
              if (this.currentPage !== 1 && this.list.length === 1) {
                this.currentPage = this.currentPage - 1;
              }
              this.$message.success("删除成功");
              this.getPageInfo();
            }
          })
          .catch(Error => {
            this.$message.error("请求失败");
          });
      });
    },
    // 编辑按钮
    editRow(scope) {
      if (this.rolelist[0].rol_name === "全部") {
        this.$delete(this.rolelist, 1);
      }
      this.rolelistno = this.rolelist;
      this.showEditClas = true;
      this.dialogTit = "编辑管理员";
      this.$nextTick(() => {
        this.addCla.adm_stase = scope.adm_stase;
        this.addCla.off_name = scope.adm_name;
        this.addCla.rol_id = scope.rol_id;
        this.addCla.off_tel = scope.adm_mobile;
        this.addCla.sec_name = scope.sec_name;
        this.addCla.off_base = scope.off_base;
        this.addCla.rol_name = scope.rol_name;
        this.addCla.adm_stase = scope.adm_stase;
        this.addCla.remark = scope.adm_remark;
        this.addCla.adm_id = scope.adm_id;
      });
    },
    addClaForm(formName, type) {
      this.showAddClas = false;
      this.showEditClas = false;
      if (type) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
        });
      } else {
        this.$refs[formName].resetFields();
      }
      this.addCla.sec_name = "";
      if (this.rolelist[0].rol_name !== "全部") {
        const gos = { rol_id: 1, rol_name: "全部" };
        this.rolelist.unshift(gos);
      }
    },
    // 添加-弹窗
    addGoodsBtn() {
      // 点击我的云仓添加按钮后的操作
      this.dialogTit = "新增管理员";
      if (this.rolelist[0].rol_name === "全部") {
        this.$delete(this.rolelist, 0);
      }
      this.rolelistno = this.rolelist;
      this.showAddClas = true;
      this.getStaffName(1);
      this.teamList(2);
    },
    //输入框员工姓名改变时type=2
    changeName(val) {
      var type = 2;
      this.getStaffName(type, val);
    },
    //改变时
    cleanbox(val) {
      this.addCla.off_tel = "";
      for (var i = 0; i < this.namelist.length; i++) {
        if (val === this.namelist[i].off_name) {
          this.addCla.off_tel = this.namelist[i].off_tel;
          this.addCla.off_id = this.namelist[i].off_id;
          this.addCla.sec_name = this.namelist[i].sec_name;
        }
      }
    },
    //获取员工名称并搜索
    getStaffName(type, name) {
      const data = {};
      data.type = type;
      data.off_name = name;
      searchAdmin(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.namelist = dataRep.data;
          }
        })
        .catch(Error => {
          this.$message.error("请求失败");
        });
    },
    // 添加--提交
    addBtn(formName) {
      const that = this;
      const data = {};
      if (that.addCla.off_name === "") {
        this.$message.error("请输入管理员姓名");
        return false;
      }
      if (that.addCla.off_tel === "") {
        this.$message.error("请输入联系电话");
        return false;
      }
      if (that.addCla.sec_name === "") {
        this.$message.error("请输入部门班组");
        return false;
      }
      data.off_name = that.addCla.off_name;
      data.off_tel = that.addCla.off_tel;
      data.sec_name = 1;
      data.rol_id = that.addCla.rol_id;
      data.remark = that.addCla.remark;
      data.off_secid = that.addCla.sec_id;
      data.off_id = that.addCla.off_id;
      addAdmin(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.getPageInfo();
            this.$message.success("管理员信息增加成功!");
            this.showAddClas = false;
            this.$refs[formName].resetFields();
            if (this.rolelist[0].rol_name !== "全部") {
              const gos = { rol_id: 1, rol_name: "全部" };
              this.rolelist.unshift(gos);
            }
          }
        })
        .catch(err => {
          console.log("获取列表err", err);
          // this.$message.error("请求失败!");
        });
    },
    // 添加--提交
    addeditBtn(formName) {
      const that = this;
      const data = {};
      if (that.addCla.off_name === "") {
        this.$message.error("请输入用户姓名");
        return false;
      }
      if (that.addCla.off_tel === "") {
        this.$message.error("请输入联系方式");
        return false;
      }
      if (that.addCla.adm_stase === "全部" || that.addCla.adm_stase === 0) {
        that.addCla.adm_state = "";
        this.$message.error("请选择状态启用或停用");
        return false;
      }
      data.adm_id = that.addCla.adm_id;
      data.rol_id = that.addCla.rol_id;
      data.remark = that.addCla.remark;
      data.off_id = that.addCla.off_id;
      data.adm_state = that.addCla.adm_stase;
      editAdmin(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.$message.success("编辑用户信息成功!");
            this.showAddClas = false;
            this.formList.adm_stase = this.state[0].name;
            this.formList.off_case = this.offstate[0].name;
            this.showEditClas = false;
            this.$nextTick(() => {
              this.$refs[formName].resetFields();
            });
            if (this.rolelist[0].rol_name !== "全部") {
              const gos = { rol_id: 0, rol_name: "全部" };
              this.rolelist.unshift(gos);
            }
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
      data.id = row.off_id;
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
      data.adm_id = [row.adm_id];
      if (num === 1) {
        // 启用
        startAdmin(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success("启用成功!");
              row.adm_stase = num;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败!");
          });
      } else if (num === 2) {
        // 停用
        stopAdmin(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success("停用成功!");
              row.adm_stase = num;
            }
          })
          .catch(Error => {
            // console.log("停用的管理员err", err);
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
        this.$message.error("请选择要启用的管理员!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].adm_stase === 2) {
            id.push(chosed[i].adm_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.adm_id = id;
          this.$confirm("请确认,是否启用选中的管理员?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              startAdmin(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].adm_id) {
                          list[j].adm_stase = 1;
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list;
                    this.$message.success("启用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的管理员err", err);
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
        this.$message.error("请选择要停用的管理员!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].adm_stase === 1) {
            id.push(chosed[i].adm_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.adm_id = id;
          this.$confirm("请确认,是否停用选中账号?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              stopAdmin(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].adm_id) {
                          list[j].adm_stase = 2;
                        }
                      }
                    }
                    this.list = list;
                    this.$message.success("停用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的管理员err", err);
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
    // 重置密码
    editPwd(row) {
      const data = {};
      data.adm_id = row.adm_id;
      this.$confirm("确定重置该账号密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        resetAdminpwd(data).then(response => {
          if (errorStatus(response.data)) {
            this.showNPwd = true;
          }
        });
      });
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
      addForm.off_name = "";
      addForm.adm_acc = "";
      addForm.adm_mobile = "";
      addForm.adm_pre = "";
      addForm.adm_stase = "";
      addForm.adm_pas = "";
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
.labelwidth {
  width: 200px;
}
.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}
</style>