<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">临时工列表</div>
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
            <el-form-item label="临时工姓名:" class="sd-form-item" prop="tem_name">
              <el-input v-model="formList.tem_name" maxlength="4" placeholder="请输入临时工姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="联系电话:" class="sd-form-item" prop="tem_tel">
              <el-input v-model="formList.tem_tel" @change="blurValue($event,index)" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态分类:" class="sd-form-item" prop="tem_state">
              <el-select v-model="formList.tem_state" class>
                <el-option
                  v-for="item in state"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" class="sd-col-6">
            <el-form-item label="工作时段:" class="lk-time-chose">
              <el-col :span="11">
                <el-form-item prop="tem_start">
                  <el-date-picker
                    v-model="formList.tem_start"
                    type="datetime"
                    placeholder="开始日期"
                    class="lk-time-box"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span class="fl">-</span>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="tem_end">
                  <el-date-picker
                    v-model="formList.tem_end"
                    type="datetime"
                    placeholder="结束日期"
                    class="lk-time-box"
                    @change="chanTime(formList.tem_start, formList.tem_end)"
                    @focus="yStartInf()"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="1" />
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
          <el-table-column label="临时工姓名" prop="tem_name" min-width align="center" />
          <el-table-column label="联系电话" prop="tem_tel" align="center" />
          <el-table-column label="最后一次工作时段" align="center">
            <template slot-scope="scope">
              <span>
                {{scope.row.tem_start}}
                <span v-if="!scope.row.tem_start==''">至</span>
                {{scope.row.tem_end}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="工作记录" prop="rol_name" align="center">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button size="mini" class="btn-mainCol" @click="viewJob(scope.row)">查看</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.tem_state == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="320">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button
                  v-if="btnShow.addjobBtn"
                  size="mini"
                  class="btn-mainCol"
                  @click="addWork(scope.row)"
                >新增工作</el-button>
                <el-button
                  v-if="btnShow.editBtn"
                  size="mini"
                  class="btn-mainCol"
                  @click="editRow(scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="scope.row.tem_state==2  && btnShow.startBtn"
                  size="mini"
                  class="openCol-btn"
                  @click="enableThisClas(scope.row,1)"
                >启用</el-button>
                <el-button
                  v-if="scope.row.tem_state==1  && btnShow.stopBtn"
                  size="mini"
                  class="stopCol-btn"
                  @click="enableThisClas(scope.row,2)"
                >停用</el-button>
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
      <!-- 弹窗 -->
      <el-dialog
        :visible.sync="showAddClas"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="400px"
        @close="addClaForm('addCla')"
      >
        <el-form ref="addCla" :model="addCla" :rules="rulesCla" label-width="100px">
          <el-form-item label="临时工姓名" prop="name">
            <el-input v-model="addCla.name" maxlength="4" class="labelwidth" placeholder="请输入临时工姓名" />
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="addCla.tel" @change="blurValue($event)" class="labelwidth" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="工作果园:" class="sd-form-item" prop="baseid">
            <el-select v-model="addCla.baseid" class="labelwidth" placeholder="全部">
              <el-option
                v-for="item in workList"
                :key="item.far_id"
                :label="item.far_name"
                :value="item.far_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门班组:" class="sd-form-item" prop="secid">
            <el-select v-model="addCla.secid" class="labelwidth" placeholder="全部">
              <el-option
                v-for="item in departList"
                :key="item.sec_id"
                :label="item.sec_name"
                :value="item.sec_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工类型" prop="type">
            <el-select v-model="addCla.type" class="labelwidth" disabled="disabled">
              <el-option
                v-for="item in staffType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
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
      <!-- 弹窗 -->
      <el-dialog
        :visible.sync="showTime"
        :title="dialogTit1"
        :close-on-click-modal="false"
        width="400px"
        @close="addClaForm('addTmWork')"
      >
        <el-form ref="addTmWork" :model="addTmWork" :rules="rulesCla" label-width="100px">
          <el-form-item label="开始时间" prop="wor_start">
            <el-date-picker
              v-model="addTmWork.wor_start"
              type="datetime"
              placeholder="开始日期"
              class="lk-time-box"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="wor_end">
            <el-date-picker
              v-model="addTmWork.wor_end"
              type="datetime"
              placeholder="结束日期"
              class="lk-time-box"
            />
          </el-form-item>
          <el-form-item label="工作内容" prop="wor_content">
            <el-input
              type="textarea"
              :rows="5"
              maxlength="200"
              v-model="addTmWork.wor_content"
              style="width:220px"
              placeholder="请输入工作内容"
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addTmWork')">取 消</el-button>
          <el-button type="primary" @click="addWorktime('addTmWork')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="showRecord"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="600px"
        @close="closeWork('showViework')"
      >
        <el-table :data="worklist" width="100%">
          <el-table-column label="次数" prop="wor_count" min-width align="center" />
          <el-table-column label="开始时间" prop="wor_start" align="center" />
          <el-table-column label="结束时间" prop="wor_end" align="center" />
          <el-table-column label="工作内容" prop="wor_content" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button size="mini" class="btn-mainCol" @click="delWork(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="worklist.length>0" class="lk-page-box">
          <el-pagination
            :current-page="currentWkPage"
            :page-size="pageWkSize"
            :total="totalWkNum"
            layout="total, prev, pager, next, jumper"
            background
            @current-change="handleCurrentWkChange"
          />
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import {
  tempList,
  startTemp,
  stopTemp,
  addTemp,
  editTemp,
  delTemp,
  delRecord,
  recordList,
  addWork,
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
        tem_id: "",
        tem_name: "",
        tem_tel: "",
        tem_start: "",
        tem_end: "",
        tem_state: ""
      },
      edit: false,
      rules: {
        tem_name: [],
        tem_tel: [],
        tem_state: [],
        tem_start: [],
        tem_end: []
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
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      worklist: [],
      currentWkPage: 1,
      pageWkSize: null,
      totalWkNum: null,
      showAddClas: false,
      showTime: false,
      showRecord: false,
      addCla: {
        name: null,
        tel: null,
        baseid: null,
        secid: null,
        type: null
      },
      deltem_id: "",
      addTmWork: {
        wor_content: null,
        wor_start: null,
        wor_end: null,
        wor_id: null,
        tem_id: null
      },
      rulesCla: {
        tem_name: [
          { required: true, message: "请输入临时工姓名", trigger: "blur" }
        ],
        tem_tel: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ]
      },
      dialogTit1: "新增",
      dialogTit: "工作记录",
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
        tem_tel: [{ required: true, trigger: "blur", validator: phone }],
        tem_state: [
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
    this.formList.tem_state = this.state[0].name;

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
      tempList(data)
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
              } else if (btnList[i].pri_funname === "工时") {
                this.$set(this.btnShow, "addjobBtn", true);
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
    blurValue(e) {
      if (!phoneTest(e)) {
        this.$message.error("请输入正确的手机号!");
        this.addCla.tel = ''
        this.formList.tem_tel = ''
        return false;
      }
    },
    // 搜索
    searchList(formName, page) {
      const search = {};
      search.name = this.formList.tem_name;
      search.tel = this.formList.tem_tel;
      search.state = this.formList.tem_state;
      if (search.state === "全部" || search.state === 0) {
        search.state = "";
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
      tempList(search)
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
    viewJob(scope, delid) {
      this.dialogTit = "工作记录";
      this.showRecord = true;
      const data = {};
      if (!delid) {
        data.tem_id = scope.tem_id;
      } else {
        data.tem_id = delid;
      }
      recordList(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.worklist = dataRep.data;
            this.currentWkPage = dataRep.current_page;
            this.pageWkSize = dataRep.current_number;
            this.totalWkNum = dataRep.total;
            this.deltem_id = scope.tem_id;
          }
        })
        .catch(Error => {
          this.$message.error("请求失败");
          console.log("请求失败--", Error);
        });
    },
    // 删除工作记录
    delWork(row) {
      // console.log('del---row', row)

      const data = {};
      const wor_id = [];
      wor_id.push(row.wor_id);
      data.wor_id = wor_id;
      // console.log('删除---', data)
      this.$confirm("请确认,是否删除所选中的工作记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delRecord(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.viewJob("", this.deltem_id);
              this.$message.success("删除成功");
            }
          })
          .catch(Error => {
            this.$message.error("请求失败");
          });
      });
    },
    //新增工作
    addWork(scope) {
      this.showTime = true;
      this.addTmWork.tem_id = scope.tem_id;
    },
    closeWork(formName) {
      this.showTime = false;
    },
    addWorktime() {
      const that = this;
      const data = {};
      if (that.addTmWork.wor_start === "") {
        this.$message.error("请输入开始时间");
        return false;
      }
      if (that.addTmWork.wor_end === "") {
        this.$message.error("请输入结束时间");
        return false;
      }
      if (that.addTmWork.wor_content === "") {
        this.$message.error("请输入工作内容");
        return false;
      }
      data.start = that.addTmWork.wor_start;
      data.end = that.addTmWork.wor_end;
      data.content = that.addTmWork.wor_content;
      data.tem_id = this.addTmWork.tem_id;
      addWork(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo();
            this.$message.success("工作内容增加成功!");
            this.showTime = false;
          }
        })
        .catch(err => {
          console.log("获取列表err", err);
          this.$message.error("请求失败!");
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
    // 编辑按钮
    editRow(scope) {
      this.showAddClas = true;
      this.dialogTit = "编辑临时工";
      this.edit = true;
      this.askWork();
      this.$nextTick(() => {
        this.addCla.type = this.staffType[0].name;
        // console.log(scope)
        this.addCla.name = scope.tem_name;
        this.addCla.tel = scope.tem_tel;
        this.addCla.id = scope.tem_id;
        this.addCla.secid = scope.tem_secid;
        this.addCla.baseid = scope.tem_baseid;
      });
    },
    addClaForm(formName) {
      this.showAddClas = false;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
      this.showTime = false;
    },
    // 添加-弹窗
    addGoodsBtn() {
      // 点击我的云仓添加按钮后的操作
      this.showAddClas = true;
      this.dialogTit = "新增临时工";
      this.addCla.type = this.staffType[0].name;
      this.edit = false;
      this.askWork();
      // this.$refs[addCla].resetFields()
      /*      this.addCla.type = this.type[1].name*/
    },
    // 添加--提交
    addBtn() {
      const that = this;
      const data = {};
      if (that.addCla.tem_name === "") {
        this.$message.error("请输入临时工姓名");
        return false;
      }
      if (that.addCla.tem_tel === "") {
        this.$message.error("请输入联系方式");
        return false;
      }
      if (!phoneTest(that.addCla.tel)) {
        this.$message.error("请输入正确的手机号!");
        return false;
      }
      data.name = that.addCla.name;
      data.tel = that.addCla.tel;
      data.baseid = that.addCla.baseid;
      data.secid = that.addCla.secid;

      addTemp(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo();
            that.$message.success("员工信息增加成功!");
            that.showAddClas = false;
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
      if (that.addCla.name === "") {
        this.$message.error("请输入临时工姓名");
        return false;
      }
      if (that.addCla.tel === "") {
        this.$message.error("请输入联系方式");
        return false;
      }
      if (!phoneTest(that.addCla.tel)) {
        this.$message.error("请输入正确的手机号!");
        return false;
      }
      data.name = that.addCla.name;
      data.tel = that.addCla.tel;
      data.id = that.addCla.id;
      data.baseid = that.addCla.baseid;
      data.secid = that.addCla.secid;
      editTemp(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.$message.success("编辑员工信息成功!");
            that.showAddClas = false;
            that.$refs[formName].resetFields();
            that.addCla.name = "";
            that.addCla.tel = "";
            that.getPageInfo();
          }
        })
        .catch(err => {
          console.log("获取列表err", err);
          this.$message.error("请求失败!");
        });
    },
    // 删除-这个
    delBtn(row) {
      // console.log('del---row', row)
      const data = {};
      const tem_id = [];
      tem_id.push(row.tem_id);
      data.id = tem_id;
      // console.log('删除---', data)
      this.$confirm("请确认,是否删除所选中的临时工?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delTemp(data)
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
    // 重置密码
    editPwd(row) {
      const data = {};
      data.id = row.tem_id;
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
      data.id = [row.tem_id];
      if (num === 1) {
        // 启用
        startTemp(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success("启用成功!");
              row.tem_state = num;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败!");
          });
      } else if (num === 2) {
        // 停用
        stopTemp(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success("停用成功!");
              row.tem_state = num;
            }
          })
          .catch(Error => {
            // console.log("停用的临时工err", err);
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
        this.$message.error("请选择要启用的临时工!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].tem_state === "2") {
            id.push(chosed[i].tem_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.id = id;
          this.$confirm("请确认,是否启用选中的临时工?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              startTemp(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].tem_id) {
                          list[j].tem_state = 1;
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
                  console.log("启用的临时工err", err);
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
        this.$message.error("请选择要停用的临时工!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].tem_state === "1") {
            id.push(chosed[i].tem_id);
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
              stopTemp(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].tem_id) {
                          list[j].tem_state = 2;
                        }
                      }
                    }
                    this.list = list;
                    this.getPageInfo();
                    this.$message.success("停用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的临时工err", err);
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
    handleCurrentWkChange(val) {
      this.currentWkPage = val;
      this.viewJob();
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
      this.$refs[formName].resetFields();
    },
    // 日期筛选
    chanTime(strt, end){
      let t1 = new Date(strt);
      let t2 = new Date(end);
      if(Date.parse(t1) - Date.parse(t2)>0){
        this.$message.error('结束日期必须要开始日期之后')
        this.formList.tem_end = ''
        return;
      }
    },
    yStartInf() {
      if(this.formList.tem_start == ''){
        this.$message.error('请先选择开始时间')
        return;
      }
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
</style>