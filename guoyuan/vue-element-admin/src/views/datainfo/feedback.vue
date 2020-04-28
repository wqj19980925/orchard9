<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">投诉反馈</div>
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
            <el-form-item label="姓名:" class="sd-form-item" prop="fee_name">
              <el-input v-model="formList.fee_name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="联系电话:" class="sd-form-item" prop="fee_tel">
              <el-input v-model="formList.fee_tel" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="投诉等级:" class="sd-form-item" prop="fee_grade">
              <el-select v-model="formList.fee_grade" class>
                <el-option
                  v-for="item in gardlist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="投诉类型:" class="sd-form-item" prop="fee_type">
              <el-select v-model="formList.fee_type" class>
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
            <el-form-item label="状态分类:" class="sd-form-item" prop="fee_state">
              <el-select v-model="formList.fee_state" class>
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
          <el-table-column label="姓名" prop="fee_name" min-width align="center" />
          <el-table-column label="联系电话" prop="fee_tel" align="center" />
          <el-table-column label="投诉等级" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.fee_grade == 1">轻微</div>
              <div v-if="scope.row.fee_grade == 2">一般</div>
              <div v-if="scope.row.fee_grade == 3">严重</div>
            </template>
          </el-table-column>
          <el-table-column label="投诉类型" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.fee_type == 1">信息错误</div>
              <div v-if="scope.row.fee_type == 2">质量问题</div>
              <div v-if="scope.row.fee_type == 3">购物问题</div>
              <div v-if="scope.row.fee_type == 2">服务问题</div>
            </template>
          </el-table-column>
          <el-table-column label="投诉区域" prop="fee_location" align="center" />
          <el-table-column label="投诉原因" align="center">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button size="mini" class="btn-mainCol" @click="viewReason(scope.row)">查看</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="处理结果" align="center">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <span v-if="!scope.row.fee_result">无</span>
                <el-button
                  size="mini"
                  class="btn-mainCol"
                  @click="viewDeal(scope.row.fee_result)"
                  v-else
                >查看</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" prop="fee_time" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.fee_state == 1">待处理</div>
              <div v-else>已处理</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button
                  size="mini"
                  class="btn-mainCol"
                  v-if="scope.row.fee_state == 1 && btnShow.resultBtn"
                  @click="dealResult(scope.row,1)"
                >处理结果</el-button>
                <span v-else>已处理</span>
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
        width="500px"
        @close="addClaForm('addClaresult')"
      >
        <el-form :inline="true" ref="addClaresult" :model="addClaresult">
          <el-form-item class="sd-form-item" prop="addClaresult.fee_result">
            <span v-if="!submit">{{addClaresult.fee_result}}</span>
            <el-input
              v-else
              v-model="addClaresult.fee_result"
              type="textarea"
              placeholder="请输入投诉原因"
              :cols="85"
              :rows="8"
              style="width:450"
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addClaresult')" v-if="submit">取 消</el-button>
          <el-button @click="addClaForm('addClaresult')" v-else>关 闭</el-button>
          <el-button @click="dealThis('addClaresult')" v-if="submit">提 交</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="showRecord"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="650px"
        @close="closeWork('showViework')"
      >
        <el-form :inline="true" ref="addCla" :model="addCla" :rules="rulesCla" label-width="80px">
          <el-form-item label="姓名" prop="addCla.fee_name">
            <!-- {{addCla.fee_name}} -->
            <el-input v-model="addCla.fee_name" disabled style="width:200px" />
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <!-- {{addCla.fee_tel}} -->
            <el-input v-model="addCla.fee_tel" disabled style="width:200px" />
          </el-form-item>
          <el-form-item label="投诉类型:" class="sd-form-item" prop="fee_type">
            <!-- {{addCla.fee_type}} -->
            <el-select v-model="addCla.fee_type" class disabled>
              <el-option
                v-for="item in typelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="投诉等级:" class="sd-form-item" prop="fee_grade">
            <!-- {{addCla.fee_grade}} -->
            <el-select v-model="addCla.fee_grade" class disabled>
              <el-option
                v-for="item in gardlist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="投诉原因:" class="sd-form-item" prop="fee_case">
            <el-input
              type="textarea"
              disabled
              :rows="5"
              maxlength="200"
              v-model="addCla.fee_case"
              style="width:495px"
              placeholder="请输入投诉原因"
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button @click="dealResult('addCla',2)">处理结果</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import { feedbackList, disposeRes } from "@/api/map";
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
        fee_name: "",
        fee_tel: "",
        fee_state: "",
        fee_grade: "",
        fee_type: ""
      },
      submit: false,
      rules: {
        fee_name: [],
        fee_tel: [],
        fee_state: [],
        fee_grade: [],
        fee_type: []
      },
      rolesType: null,
      state: [
        { id: 0, name: "全部" },
        { id: 1, name: "待处理" },
        { id: 2, name: "已处理" }
      ],
      gardlist: [
        { id: 0, name: "全部" },
        { id: 1, name: "轻微" },
        { id: 2, name: "一般" },
        { id: 3, name: "严重" }
      ],
      typelist: [
        { id: 0, name: "全部" },
        { id: 1, name: "信息错误" },
        { id: 3, name: "质量问题" },
        { id: 4, name: "购物问题" },
        { id: 5, name: "服务问题" }
      ],
      state1: [{ id: 1, name: "待处理" }, { id: 2, name: "已处理" }],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addCla: {
        fee_name: null,
        fee_tel: null,
        far_id: null,
        fee_type: null,
        fee_grade: null,
        fee_case: null
      },
      addClaresult: {
        fee_result: null,
        fee_id: null
      },
      showRecord: false,
      worklist: [],
      dialogTit: "新增",
      dialog: {
        title: "新增",
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      btnShow: {
        resultBtn: false
      },
      chosed: [],
      serch_req: false,
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
    this.formList.fee_state = this.state[0].name;
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
      feedbackList(data)
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
              if (btnList[i].pri_funname === "处理结果") {
                this.btnShow.resultBtn = true;
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
    closeWork(formName) {
      this.showRecord = false;
    },
    viewReason(scope) {
      this.showRecord = true;
      this.dialogTit = "投诉原因";
      this.addCla.fee_name = scope.fee_name;
      this.addCla.fee_tel = scope.fee_tel;
      this.addCla.fee_id = scope.fee_id;
      // this.addCla.fee_type=scope.fee_type
      for (var i in this.typelist) {
        if (this.typelist[i].id === scope.fee_type) {
          this.addCla.fee_type = this.typelist[i].name;
        }
      }
      for (var i in this.gardlist) {
        if (this.gardlist[i].id === scope.fee_grade) {
          this.addCla.fee_grade = this.gardlist[i].name;
        }
      }
      // this.addCla.fee_grade=scope.fee_grade
      this.addCla.fee_case = scope.fee_case;
    },
    //提交处理结果
    dealThis() {
      if (this.addClaresult.fee_result === null) {
        this.$message.error("请输入处理结果");
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = this.addClaresult;
      disposeRes(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            this.showAddClas = false;
            this.$message.success(dataRep.data);
            this.addClaresult.fee_result = "";
            this.getPageInfo();
          }
        })
        .catch(Error => {
          loading.close();
          this.$message.error("请求失败");
        });
    },
    // 搜索
    searchList(formName, page) {
      const search = this.formList;
      if (search.fee_state === "全部" || search.fee_state === 0) {
        search.fee_state = "";
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
      feedbackList(search)
        .then(response => {
          loading.close();
          const dataRep = response.data;
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

    addClaForm(formName) {
      this.showAddClas = false;
      this.showRecord = false;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    //处理结果
    dealResult(scope, type) {
      this.showRecord = false;
      this.showAddClas = true;
      this.submit = true;
      this.dialogTit = "处理结果";
      if (type === 1) {
        this.addClaresult.fee_id = scope.fee_id;
      } else {
        this.addClaresult.fee_id = this.addCla.fee_id;
      }
    },
    // 添加-弹窗
    viewDeal(result) {
      // 点击我的云仓添加按钮后的操作
      this.showAddClas = true;
      this.submit = false;
      this.dialogTit = "处理结果";
      this.addClaresult.fee_result = result;
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
