<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">员工列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.inBtn" class="openCol-btn" @click="enableClas()">在职</el-button>
          <el-button v-if="btnShow.quitBtn" class="stopCol-btn" @click="stopClas()">离职</el-button>
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
            <el-form-item label="员工姓名:" class="sd-form-item" prop="off_name">
              <el-input v-model="formList.off_name" placeholder="请输入员工姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="联系电话:" class="sd-form-item" prop="off_tel">
              <el-input v-model="formList.off_tel" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="工作果园:" class="sd-form-item" prop="off_baseid">
              <el-select v-model="formList.off_baseid" class placeholder="请选择工作果园">
                <el-option key="0" label="全部" value="0" />
                <el-option
                  v-for="item in workList"
                  :key="item.far_id"
                  :label="item.far_name"
                  :value="item.far_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="部门班组:" class="sd-form-item" prop="off_secid">
              <el-select v-model="formList.off_secid" class placeholder="请选择部门班组">
                <el-option key="0" label="全部" value="0" />
                <el-option
                  v-for="item in departList"
                  :key="item.sec_id"
                  :label="item.sec_name"
                  :value="item.sec_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="工作情况:" class="sd-form-item" prop="off_case">
              <el-select v-model="formList.off_case" class>
                <el-option
                  v-for="item in offstate"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态分类:" class="sd-form-item" prop="off_state">
              <el-select v-model="formList.off_state" class>
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
          <el-table-column label="员工姓名" prop="off_name" min-width align="center" />
          <el-table-column label="联系电话" prop="off_tel" align="center" />
          <el-table-column label="部门班组" prop="sec_name" align="center" />
          <el-table-column label="工作果园" prop="far_name" align="center" />
          <el-table-column label="工作情况" prop="off_case" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.off_case == 1">参与</div>
              <div v-else>未参与</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.off_state == 1">在职</div>
              <div v-else>离职</div>
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
                  v-if="scope.row.off_state==2 && btnShow.inBtn"
                  size="mini"
                  class="openCol-btn"
                  @click="enableThisClas(scope.row,1)"
                >在职</el-button>
                <el-button
                  v-if="scope.row.off_state==1 && btnShow.quitBtn"
                  size="mini"
                  class="stopCol-btn"
                  @click="enableThisClas(scope.row,2)"
                >离职</el-button>
                <el-button size="mini" class="btn-mainCol" @click="openAccount(scope.row)">开通账号</el-button>
                <el-button
                  v-if="btnShow.delBtn"
                  size="mini"
                  class="btn-mainCol"
                  @click="delBtn(scope.row)"
                >删除</el-button>
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
            <el-input v-model="addCla.off_name" style="width:195px" placeholder="请输入员工姓名" />
          </el-form-item>
          <el-form-item label="联系电话" prop="off_tel">
            <el-input
              v-model="addCla.off_tel"
              style="width:195px"
              placeholder="请输入联系电话"
              @blur="blurValue($event,index)"
            />
          </el-form-item>
          <el-form-item label="工作果园:" class="sd-form-item" prop="off_baseid">
            <el-select v-model="addCla.off_baseid" class placeholder="全部">
              <el-option
                v-for="item in workList"
                :key="item.far_id"
                :label="item.far_name"
                :value="item.far_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门班组:" class="sd-form-item" prop="off_secid">
            <el-select v-model="addCla.off_secid" class placeholder="全部">
              <el-option
                v-for="item in departList"
                :key="item.sec_id"
                :label="item.sec_name"
                :value="item.sec_id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button v-if="edit" type="primary" @click="addeditBtn('addCla')">确 定</el-button>
          <el-button v-else type="primary" @click="addBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import {
  staffList,
  startStaff,
  stopStaff,
  addStaff,
  editStaff,
  delStaff,
  searchDepart
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
        off_secid: "0",
        off_baseid: "0",
        off_case: "",
        off_state: ""
      },
      edit: false,
      rules: {
        off_name: [],
        off_tel: [],
        off_state: []
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
        { id: 1, name: "在职" },
        { id: 2, name: "离职" }
      ],
      state1: [{ id: 1, name: "在职" }, { id: 2, name: "离职" }],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addCla: {
        off_id: null,
        off_tel: null,
        off_secid: null,
        off_baseid: null
      },
      departList: [],
      workList: [],
      rulesCla: {
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
      btnShow: {},
      chosed: [],
      serch_req: false,
      addRules: {
        off_name: [
          { required: true, message: "请输入农户姓名", trigger: "blur" }
        ],
        off_tel: [{ required: true, trigger: "blur", validator: phone }],
        off_state: [
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
    this.askWork();
    this.formList.off_state = this.state[0].name;
    this.formList.off_case = this.offstate[0].name;
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
      staffList(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            // console.log('list1',dataRep.data)
            //  this.list=[]
            // for(var i=0; i<dataRep.data.length; i++){
            //   const off_sta=dataRep.data[i].off_state

            //   if(off_sta === 1 || off_sta === 2){
            //     this.list.push(dataRep.data[i])
            // console.log('list',this.list)
            /*                  const gos = { off_baseid: 0, sec_name: '全部' }
                  const goo_cla = dataRep.goo_class
                  goo_cla.unshift(gos)
                  this.secType = goo_cla*/
            //   }
            // }
            // const role_id = { rol_id: 0, rol_name: "全部" };
            // this.godsType.splice(0, 0, role_id);
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
            const btnList = dataRep.button_data;
            // console.log('btnList---', btnList)

            for (const i in btnList) {
              if (btnList[i].pri_funname === "新增") {
                this.$set(this.btnShow, "addBtn", true);
              } else if (btnList[i].pri_funname === "启用") {
                this.$set(this.btnShow, "inBtn", true);
              } else if (btnList[i].pri_funname === "停用") {
                this.$set(this.btnShow, "quitBtn", true);
              } else if (btnList[i].pri_funname === "编辑") {
                this.$set(this.btnShow, "editBtn", true);
              } else if (btnList[i].pri_funname === "删除") {
                this.$set(this.btnShow, "delBtn", true);
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
    blurValue(e, index) {
      const val = e.target.value;
      // console.log('this.godsDetail[index].type', this.godsDetail[index].type)
      if (!phoneTest(val)) {
        this.$message.error("请输入正确的手机号!");
        return false;
      }
    },
    // 搜索
    searchList(formName, page) {
      const search = {};
      search.off_name = this.formList.off_name;
      search.off_tel = this.formList.off_tel;
      if(this.formList.off_secid == 0){
        search.off_secid = ''
      }else{
        search.off_secid = this.formList.off_secid;
      }
      if(this.formList.off_baseid == 0){
        search.off_baseid = ''
      }else{
        search.off_baseid = this.formList.off_baseid;
      }
      search.off_case = this.formList.off_case;
      search.off_state = this.formList.off_state;
      if (search.off_state === "全部" || search.off_state === 0) {
        search.off_state = "";
      }
      if (search.off_case === "全部" || search.off_case === 0) {
        search.off_case = "";
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
      staffList(search)
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
    openAccount() {
      this.$confirm("点击确定后即将前往管理员列表", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$router.push("./Manageindex");
      });
    },
    // 删除-这个
    delBtn(row) {
      // console.log('del---row', row)
      const data = {};
      const off_id = [];
      off_id.push(row.off_id);
      data.off_id = off_id;
      // console.log('删除---', data)
      this.$confirm("请确认,是否删除所选中的员工?", "提示", {
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
      this.showAddClas = true;
      this.dialogTit = "编辑员工";
      this.edit = true;
      // console.log(scope)
      this.$nextTick(() => {
        this.addCla.off_name = scope.off_name;
        this.addCla.off_tel = scope.off_tel;

        for (var i in this.workList) {
          if (scope.far_name === this.workList[i].far_name) {
            this.addCla.off_baseid = this.workList[i].far_id;
          }
        }

        for (var i in this.departList) {
          if (scope.sec_name === this.departList[i].sec_name) {
            this.addCla.off_secid = this.departList[i].sec_id;
          }
        }
        this.addCla.off_id = scope.off_id;
      });
    },
    //部门班组
    askWork() {
      const data = {};

      searchDepart(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.departList = dataRep.data.section;
            this.workList = dataRep.data.base;
            // this.addCla.sec_id = this.rolelist[0].sec_id
          }
        })
        .catch(Error => {
          this.$message.error("请求失败");
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
      // this.$refs[addCla].resetFields()
      /*      this.addCla.type = this.type[1].name*/
    },
    // 添加--提交
    addBtn() {
      const that = this;
      const data = {};
      if (that.addCla.off_name === "") {
        this.$message.error("请输入员工姓名");
        return false;
      }
      if (that.addCla.off_tel === "") {
        this.$message.error("请输入联系电话");
        return false;
      }
      if (that.addCla.off_secid === "") {
        this.$message.error("请输入部门班组");
        return false;
      }
      if (that.addCla.off_baseid === "") {
        this.$message.error("请选择工作果园");
        return false;
      }
      data.off_name = that.addCla.off_name;
      data.off_tel = that.addCla.off_tel;
      data.off_secid = that.addCla.off_secid;
      data.off_baseid = that.addCla.off_baseid;
      addStaff(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.$message.success("员工信息增加成功!");
            this.showAddClas = false;
            this.getPageInfo();
            this.formList.off_state = this.state[0].name;
            this.formList.off_case = this.offstate[0].name;
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
      if (that.addCla.off_name === "") {
        this.$message.error("请输入用户姓名");
        return false;
      }
      if (that.addCla.off_tel === "") {
        this.$message.error("请输入联系方式");
        return false;
      }
      data.off_name = that.addCla.off_name;
      data.off_tel = that.addCla.off_tel;
      data.off_id = that.addCla.off_id;
      data.off_secid = that.addCla.off_secid;
      data.off_baseid = that.addCla.off_baseid;
      editStaff(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.$message.success("编辑用户信息成功!");
            this.showAddClas = false;
            this.formList.off_state = this.state[0].name;
            this.formList.off_case = this.offstate[0].name;
            /*            this.$refs[formName].resetFields()
            this.addCla.off_name = ''
            this.addCla.off_tel = ''*/
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
    // 单个--在职--离职
    enableThisClas(row, num) {
      const data = {};
      data.off_id = [row.off_id];
      if (num === 1) {
        // 在职
        startStaff(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success("在职成功!");
              row.off_state = num;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败!");
          });
      } else if (num === 2) {
        // 离职
        stopStaff(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success("离职成功!");
              row.off_state = num;
            }
          })
          .catch(Error => {
            // console.log("离职的员工err", err);
            this.$message.error("请求失败!");
          });
      }
    },
    // 在职
    enableClas() {
      const list = this.list;
      const chosed = this.chosed;
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error("请选择要在职的员工!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].off_state === 2) {
            id.push(chosed[i].off_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.off_id = id;
          this.$confirm("请确认,是否在职选中的员工?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              startStaff(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].off_id) {
                          list[j].off_state = 1;
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list;
                    this.$message.success("在职成功!");
                  }
                })
                .catch(err => {
                  console.log("在职的员工err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消离职");
            });
        } else {
          this.$confirm("选中账号的状态全部为'在职'", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error"
          }).then(() => {});
        }
      }
    },
    // 离职
    stopClas() {
      const list = this.list;
      const chosed = this.chosed;
      if (chosed.length < 1) {
        this.$message.error("请选择要离职的员工!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].off_state === 1) {
            id.push(chosed[i].off_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.off_id = id;
          this.$confirm("请确认,是否离职选中账号?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              stopStaff(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].off_id) {
                          list[j].off_state = 2;
                        }
                      }
                    }
                    this.list = list;
                    this.$message.success("离职成功!");
                  }
                })
                .catch(err => {
                  console.log("在职的员工err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消离职");
            });
        } else {
          this.$confirm("选中账号状态已全部为'离职'?", "提示", {
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
