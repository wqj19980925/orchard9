<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">监控列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addMtBtn()">新增</el-button>
          <el-button v-if="btnShow.deleBtn" class="stopCol-btn" @click="deleTabl()">删除</el-button>
        </div>
      </div>
      <el-form
        ref="formList"
        :model="formList"
        class="sd-form-box clearfix"
        size="medium"
        label-width="100px"
      >
        <el-row class="clearfix">
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="监控名称:" class="sd-form-item" prop="mon_name">
              <el-input v-model="formList.mon_name" placeholder="请输入监控名称" />
            </el-form-item>
          </el-col>
          <el-col class="pl-50 fr w250" style>
            <el-button class type="primary" @click="getPageInfo()">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="qxMtForm()">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list" width="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="监控名称" prop="mon_name" min-width align="center" />
          <el-table-column label="地址" prop="mon_address" align="center" />
          <el-table-column label="添加时间" prop="mon_create_time" align="center" />
          <el-table-column label="操作" align="center" width="320">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button size="mini" class="btn-mainCol" @click="lookRow(scope.row)">查看</el-button>
                <el-button size="mini" v-if="btnShow.editBtn" class="btn-mainCol" @click="editRow(scope.row)">编辑</el-button>
                <el-button size="mini" v-if="btnShow.deleBtn" class="stopCol-btn" @click="deletRow(scope.row)">删除</el-button>
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
        :visible.sync="showAdd"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="400px"
        @close="qxMtForm()"
      >
        <el-form :model="addMtForm" label-width="90px">
          <el-form-item label="摄像头名称" prop="mon_name">
            <el-input v-model="addMtForm.mon_name" maxlength="25" placeholder="请输入摄像头名称" />
          </el-form-item>
          <el-form-item label="地址" prop="mon_name">
            <el-input v-model="addMtForm.mon_address" maxlength="100" placeholder="请输入地址" />
          </el-form-item>
          <el-form-item label="网址" prop="mon_name">
            <el-input v-model="addMtForm.mon_url" placeholder="请输入网址" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="qxMtForm()">取 消</el-button>
          <el-button type="primary" @click="submitMtFrom()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看 -->
      <el-dialog
        :visible.sync="lookDialog"
        title="查看"
        :close-on-click-modal="false"
        width="700px"
        @close="qxMtForm()"
      >
        <iframe :src="urlInfo" style="width:660px; height:660px;" frameborder="0"></iframe>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import {
  addMonitoring,
  IndexMonitoring,
  deletMonitoring,
  editMonitoring
} from "@/api/personMange";
import { errorStatus } from "@/utils/index";
export default {
  name: "Account",
  data() {
    return {
      formList: {
        mon_name: ""
      },
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      btnShow: {
        addBtn: false,
        editBtn: false,
        deleBtn: false,
      },
      showAdd: false,
      lookDialog: false,
      addMtForm: {
        mon_name: "",
        mon_address: "",
        mon_url: "http://"
      },
      rowID: '',
      dialogTit: "新增",
      urlInfo: '',
      tableSele: [],
    };
  },
  created() {
    // 页面加载时
    this.getPageInfo();
  },
  methods: {
    // 获取页面数据
    getPageInfo() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = this.formList;
      data.pri_id = this.$route.meta.pri_id;
      data.page = this.currentPage;
      IndexMonitoring(data).then(res => {
        loading.close();
        if (errorStatus(res.data)) {
          console.log(res.data, "列表");
          this.list = res.data.data;
          this.currentPage = res.data.current_page;
          this.pageSize = res.data.current_number;
          this.totalNum = res.data.total;
          let buttonData = res.data.button_data;
          for(let item of buttonData){
            if(item.pri_funname == '添加'){
              this.btnShow.addBtn = true;
            }else if(item.pri_funname == '编辑'){
              this.btnShow.editBtn = true;
            }else if(item.pri_funname == '删除'){
              this.btnShow.deleBtn = true;
            }
          }
        }
      });
    },
    // 显示新增
    addMtBtn() {
      this.showAdd = true;
      this.dialogTit = "新增";
    },
    // 显示编辑
    editRow(row) {
      this.addMtForm.mon_name = row.mon_name;
      this.addMtForm.mon_address = row.mon_address;
      this.addMtForm.mon_url = row.mon_url;
      this.rowID = row.mon_id
      this.showAdd = true;
      this.dialogTit = "编辑";
    },
    // 新增提交
    submitMtFrom() {
      if(this.addMtForm.mon_name == ''){
        this.$message.error('摄像头名称不能为空')
        return
      }
      if(this.addMtForm.mon_address == ''){
        this.$message.error('地址不能为空')
        return
      }
      let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
      if(!reg.test(this.addMtForm.mon_url)){
        this.$message.error('网址格式有误')
        return
      }
      const data = this.addMtForm;
      if(this.dialogTit == '新增'){
        addMonitoring(data).then(res => {
          if (errorStatus(res.data)) {
            this.$message.success("新增成功");
            this.addMtForm= {
              mon_name: "",
              mon_address: "",
              mon_url: "http://"
            },
            this.getPageInfo()
            this.showAdd = false;
          }
        });
      }else{
        data.mon_id = this.rowID
        editMonitoring(data).then(res => {
          if (errorStatus(res.data)) {
            this.$message.success("编辑成功");
            for (let i in this.addMtForm) {
              this.addMtForm[i] = "";
            }
            this.getPageInfo()
            this.showAdd = false;
          }
        });
      }
    },
    // 关闭弹框
    qxMtForm() {
      this.showAdd = false;
      this.lookDialog = false;
      this.addMtForm= {
        mon_name: "",
        mon_address: "",
        mon_url: "http://"
      },
      this.formList.mon_name = ''
    },
    // 删除 -- 单个
    deletRow(row) {
      this.$confirm("确定要删除该监控吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const data = {};
        data.mon_id = [row.mon_id];
        deletMonitoring(data).then(res => {
          if (errorStatus(res.data)) {
            this.$message.success('删除成功')
            this.getPageInfo()
          }
        });
      });
    },
    // 删除 -- 多个
    deleTabl() {
      if(this.tableSele.length == 0){
        this.$message.error('请选择要删除监控')
        return
      }
      this.$confirm("确定要删除选中的监控吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const data = {};
        data.mon_id = [];
        for(let item of this.tableSele){
          data.mon_id.push(item.mon_id)
        }
        deletMonitoring(data).then(res => {
          if (errorStatus(res.data)) {
            this.$message.success('删除成功')
            this.getPageInfo()
          }
        });
      })
    },
    // 查看
    lookRow(row) {
      // this.lookDialog = true;
      // this.urlInfo = row.mon_url
      window.open(row.mon_url)
    },
    // 列表选中
    handleSelectionChange(val) {
      this.tableSele = val
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getPageInfo();
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
