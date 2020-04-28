<!--车标管理-->
<template>
  <!--外部整体盒子-->
  <div class="app-container">
    <!--信息筛选-->
    <el-row v-if="!showAdd" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">二维码列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.codeBtn" class="btn-mainCol" @click="addCode()">发码</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delChoseBtn()">删除</el-button>
          <el-button v-if="btnShow.exportBtn" class="Import-btn" @click="exportExcel()">导出</el-button>
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
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="生产编号：" class="sd-form-item" prop="pro_number">
              <el-input v-model="formList.pro_number" class placeholder="请输入生产编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="发码批次号：" class="sd-form-item" prop="app_codepnum">
              <el-input v-model="formList.app_codepnum" class placeholder="请输入发码批次号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="备注：" class="sd-form-item" prop="app_cause">
              <el-input v-model="formList.app_cause" class placeholder="请输入备注" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="商品信息" class="sd-form-item" prop="goods_info">
              <el-input v-model="formList.goods_info" class placeholder="请输入商品信息" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="时间:" class="sd-form-item" prop="createtime_range0">
              <el-date-picker
                v-model="formList.time"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:200px;"
                :picker-options="pickerDateBefore"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态：" class="sd-form-item" prop="app_state">
              <el-select v-model="formList.app_state" class>
                <el-option
                  v-for="item in state"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <div class="plr-20 fr">
            <el-button class type="primary" @click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </div>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="商品信息" align="center" width="110">
            <template slot-scope="scope">
              <span>[{{scope.row.cla_name}}]</span>
              <span>{{scope.row.goo_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发码信息" align="center" width="240">
            <template slot-scope="scope">
              <div align="left">
                <span class="blue">发码数量:</span>
                {{scope.row.app_codenum}}
                <br />
                <span class="blue">发码批次号:</span>
                {{scope.row.app_codepnum}}
                <br />
                <span class="blue">发码时间:</span>
                {{scope.row.oper_time}}
                <br />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="生产编号" prop="pro_number" align="center" width="180" />
          <!--   <el-table-column label="质检报告" prop="dit_name"  align="center" width="170">
             <template slot-scope="scope">
                {{scope.row.dit_name}}质检报告
            </template>
          </el-table-column>-->
          <el-table-column label="防伪方式" align="center" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.app_fakestate == 1">序列号防伪</div>
              <div v-else>计数防伪</div>
            </template>
          </el-table-column>
          <el-table-column label="申请人" prop="app_admname" align="center" />
          <el-table-column label="状态" prop="app_state" align="center" width="70">
            <template slot-scope="scope" align="center">
              <div v-if="scope.row.app_state == 1" class="blue">待处理</div>
              <div v-if="scope.row.app_state == 2" class="blue">已通过</div>
              <div v-if="scope.row.app_state == 3" class="red">已驳回</div>
              <div v-if="scope.row.app_state == 4" class="blue">已下载</div>
            </template>
          </el-table-column>
          <el-table-column label="备注" :show-overflow-tooltip="true" prop="app_cause" width="100" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="(scope.row.app_state===2 || scope.row.app_state===4) && btnShow.editBtn"
                class="btn-mainCol buttonsty"
                size="mini"
                @click="editthisBtn(scope.row)"
              >编辑</el-button>
              <br v-if="(scope.row.app_state===2 || scope.row.app_state===4) && btnShow.editBtn" />
              <el-button
                v-if="(scope.row.app_state===2 || scope.row.app_state===4)  && btnShow.downlBtn"
                class="btn-secCol buttonsty"
                size="mini"
                @click="downloadCodeBtn(scope.row.app_id)"
              >下载</el-button>
              <br v-if="(scope.row.app_state===2 || scope.row.app_state===4)  && btnShow.downlBtn" />
              <el-button
                v-if="scope.row.app_state===1  &&  btnShow.revokeBtn"
                size="mini"
                class="stopCol-btn buttonsty"
                @click="enableThisClas(scope.row,2)"
              >撤销</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="list.length>0" class="lk-page-box">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalNum"
          layout="total, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 编辑弹窗 -->
      <el-dialog
        :visible.sync="showEditClas"
        :title="dialogTit"
        :close-on-click-modal="false"
        width="650px"
        @close="addClaForm('editCodeList')"
      >
        <el-form :inline="true" ref="editCodeList" :rules="rulesCla" label-width="100px">
          <el-row :gutter="20" class="addGods-infor-box">
            <el-col :span="24" class="sd-col-6">
              <el-form-item label="农民姓名:" class="sd-form-item">{{editCodeList.far_name}}</el-form-item>
            </el-col>
            <el-col :span="24" class="sd-col-6">
              <el-form-item label="果园名称:" class="sd-form-item">{{editCodeList.base_name}}</el-form-item>
            </el-col>
            <el-col :span="24" class="sd-col-6">
              <el-form-item label="生产编号:" class="sd-form-item">{{editCodeList.pro_number}}</el-form-item>
            </el-col>
            <el-col :span="12" class="sd-col-6">
              <el-form-item label="商品品类:" class="sd-form-item">{{editCodeList.cla_name}}</el-form-item>
            </el-col>
            <el-col :span="12" class="sd-col-6">
              <el-form-item label="商品名称:" class="sd-form-item">{{editCodeList.goo_name}}</el-form-item>
            </el-col>
            <el-col :span="12" class="sd-col-6">
              <el-form-item label="预估产量:" class="sd-form-item">{{editCodeList.pro_estimate}}</el-form-item>
            </el-col>
            <el-col :span="12" class="sd-col-6">
              <el-form-item label="已发码量:" class="sd-form-item">
                {{editCodeList.pro_code}}
                <span class="rightInfoWords">含本次发码量</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="sd-col-6">
              <div class="Divisionline" />
            </el-col>
            <el-col :span="24" class="sd-col-6">
              <el-form-item label="发码批次号:" class="sd-form-item">{{editCodeList.app_codepnum}}</el-form-item>
            </el-col>
            <el-col :span="12" class="sd-col-6">
              <el-form-item label="防伪方式:" class="sd-form-item">{{editCodeList.app_fakestate}}</el-form-item>
            </el-col>
            <el-col :span="12" class="sd-col-6">
              <el-form-item label="申请发码量:" class="sd-form-item">{{editCodeList.app_codenum}}</el-form-item>
            </el-col>
            <div class="lk-table-box">
              <el-table height="180" :data="receList" width="100%" ref="table">
                <el-table-column label="收货编号" min-width align="center">
                  <template slot-scope="scope">
                    {{scope.row.por_number}}
                    <span v-if="scope.row.por_state ===1">(已发码)</span>
                    <span v-if="scope.row.por_state ===2">(未发码)</span>
                    <span v-if="scope.row.por_state ===3">(审核中)</span>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" min-width prop="goo_name" align="center" />
                <el-table-column label="收获数量" align="center" prop="por_count" width="120" />
              </el-table>
            </div>
            <el-form-item label="质检报告:" class="sd-form-item" prop="con_id">
              <el-select v-model="editCodeList.con_id" placeholder="请选择质检报告" class="receInput">
                <el-option
                  v-for="items in qualitylist"
                  :key="items.con_id"
                  :label="items.dit_name +'['+ items.con_number+']'"
                  :value="items.con_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" class="sd-form-item" prop="remark">
              <el-input
                v-model="editCodeList.remark"
                placeholder="请输入备注"
                class="receInput"
                clearable
              />
            </el-form-item>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('editCodeList')">取 消</el-button>
          <el-button type="primary" @click="addeditBtn('editCodeList')">提 交</el-button>
        </span>
      </el-dialog>
    </el-row>
    <a :href="exportUrl" id="exportFile" style="display:none;"></a>
    <a :href="downLoadUrl" id="downLoadFile" style="display:none;"></a>
    <creatCode v-if="showAdd" @listerToChild="showListPages()" />
  </div>
</template>

<script>
import {
  CodeList,
  searchSendCode,
  applyCode,
  showNumber,
  exportCode,
  delCode,
  manageReport,
  editCode,
  downloadCode
} from "@/api/trace";
import { errorStatus } from "@/utils/index";
import creatCode from "./components/creatCode";
export default {
  name: "CodeList",
  components: {
    creatCode
  },
  data() {
    return {
      app_id: "",
      exportUrl: "",
      downLoadUrl: "",
      showAdd: false,
      showEditClas: false,
      edit_id: 0,
      formList: {
        time: "",
        app_codepnum: "",
        pro_number: "",
        app_state: "",
        app_cause: "",
        goods_info: ""
      },
      ReceNumList: {
        receList: []
      },
      editCodeList: [],
      rulesCla: {},
      ReceNumList: [],
      rules: {},
      dialogTit: "查看",
      state: [
        { id: 0, name: "全部" },
        { id: 1, name: "待处理" },
        { id: 2, name: "已通过" },
        { id: 3, name: "已驳回" },
        { id: 4, name: "已下载" }
      ],
      list: [],
      qualitylist: [],
      receList: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      search_req: false,
      chosed: [],
      baseURL: process.env.BASE_API,
      downloadCodeUrl: "",
      btnShow: {
        editBtn: false,
        codeBtn: false,
        downlBtn: false,
        exportBtn: false,
        delBtn: false,
        revokeBtn: false
      },
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.formList.time;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      }
    };
  },
  watch: {
    $route() {
      this.getPageInfo();
    }
  },
  created() {
    // 页面加载时
    this.searchQuality(1);
    this.getPageInfo();
    this.formList.app_state = this.state[0].name;
  },
  methods: {
    // 页面加载时
    getPageInfo() {
      const data = {};
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      data.pri_id = this.$route.meta.pri_id;
      data.page = this.currentPage;
      CodeList(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log("获取列表----", dataRep);
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
            const btnList = dataRep.button_data;
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === "申请发码") {
                this.btnShow.codeBtn = true;
              } else if (btnList[i].pri_funname === "下载") {
                this.btnShow.downlBtn = true;
              } else if (btnList[i].pri_funname === "导出") {
                this.btnShow.exportBtn = true;
              } else if (btnList[i].pri_funname === "编辑") {
                this.btnShow.editBtn = true;
              } else if (btnList[i].pri_funname === "删除") {
                this.btnShow.delBtn = true;
              } else if (btnList[i].pri_funname === "撤销") {
                this.btnShow.revokeBtn = true;
              }
            }
          }
        })
        .catch(Error => {
          loading.close();
          // console.log('error--', Error)
          this.$message.error("请求失败");
        });
    },
    //质检报告
    searchQuality(type, Id) {
      const data = {};
      if (Id) {
        data.goo_id = Id;
      }
      data.type = type;
      manageReport(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.qualitylist = dataRep.data;
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    // 搜索
    searchList(formName, page) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      const search = this.formList;
      if (search.app_state === "全部" || search.app_state === 0) {
        search.app_state = "";
      }
      search.pri_id = this.$route.meta.pri_id;
      search.page = page;
      CodeList(search)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log("获取列表----", dataRep);
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
          }
        })
        .catch(Error => {
          loading.close();
          console.log("error--", Error);
          this.$message.error("请求失败");
        });
    },
    // 重置
    resetForm(formName) {
      this.formList.time = ''
      this.$refs[formName].resetFields();
    },

    //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed;
      if (chosed.length < 1) {
        this.$message.error("请选择要删除的发码记录!");
      } else {
        const data = {};
        data.app_id = [];
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.app_id.push(chosed[i].app_id);
        }
        this.$confirm("请确认,是否删除所选中的发码记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCode(data)
            .then(response => {
              // console.log('delgo---', response)
              if (errorStatus(response.data)) {
                if (this.currentPage !== 1 && this.list.length === 1) {
                  this.currentPage = this.currentPage - 1;
                }
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
    //导出
    clickABtn() {
      // console.log("url--",this.exportUrl)
      // return false
      setTimeout(() => {
        document.getElementById("exportFile").click();
      }, 1000);
    },
    exportExcel() {
      const url = process.env.BASE_API;
      const baseUrl = url.replace("/public", "/");
      const data = this.formList;
      if (data.app_state == "" || data.app_state === "全部") {
        data.app_state = "";
      }
      delete data.page;
      exportCode(data)
        .then(response => {
          if (errorStatus(response.data)) {
            const str = response.data.data;
            this.exportUrl = baseUrl + str;
            this.clickABtn();
          }
        })
        .catch(Error => {
          this.$message.error("导出请求失败");
        });
    },
    //取消
    addClaForm(formName) {
      this.showEditClas = false;
      this.editCodeList.remark = "";
      this.editCodeList.con_id = "";
      this.$refs[formName].resetFields();
    },
    //查看收获编号
    showNum(Id) {
      const data = {};
      data.app_id = Id;
      showNumber(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.ReceNumList = dataRep.data;
          }
        })
        .catch(Error => {
          this.$message.error("导出请求失败");
        });
    },
    //编辑
    editthisBtn(scope) {
      this.app_id = scope.app_id;
      this.dialogTit = "编辑";
      this.searchQuality(2, scope.goo_id);
      this.searchReceive(scope.pro_id);
      this.editCodeList = scope;
      for (var i in this.qualitylist) {
        if (scope.con_id === this.qualitylist[i].con_id) {
          this.editCodeList.con_id = this.qualitylist[i].con_id;
        } else {
          this.editCodeList.con_id =
            scope.dit_name + "[" + scope.con_number + "]";
        }
      }
      this.editCodeList.remark = scope.app_cause;
      this.showEditClas = true;
    },
    //搜索收货编号列表
    searchReceive(proId) {
      const data = {};
      data.pro_id = proId;
      data.type = 2;
      searchSendCode(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.receList = dataRep.data;
            // for(var i in this.receList){
            //   if(goo_id === this.receList[i].goo_id){

            //   }
            // }
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    //编辑提交
    addeditBtn() {
      const data = {};
      data.remark = this.editCodeList.remark;
      data.con_id = this.editCodeList.con_id;
      data.app_id = this.editCodeList.app_id;
      if (!data.con_id) {
        this.$message.error("请选择质检报告");
        return;
      }
      // if(!data.remark){
      //   this.$message.error('请输入备注')
      //   return
      // }
      editCode(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.$message.success(dataRep.data);
            this.showEditClas = false;
            this.editCodeList.remark = "";
            this.editCodeList.con_id = "";
            this.getPageInfo();
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    //查看质检报告
    qualityShow() {
      let routeData = this.$router.resolve({
        path: "/codeQuality",
        query: { app_id: this.app_id }
      });
      window.open(routeData.href, "_blank");
    },
    //下载
    downloadCodeBtn(Id) {
      const url = process.env.BASE_API;
      const baseUrl = url.replace("/public", "/");
      const data = {};
      data.app_id = Id;
      downloadCode(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            const str = dataRep.data;
            this.downLoadUrl = baseUrl + str;
            this.clickDowntn();
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    clickDowntn() {
      setTimeout(() => {
        document.getElementById("downLoadFile").click();
      }, 1000);
    },
    // 页面--分页器
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      if (this.search_req) {
        this.searchList("formList", val);
      } else {
        this.getPageInfo();
      }
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val;
    },
    showListPages() {
      this.showAdd = false;
      this.getPageInfo();
    },
    addCode() {
      this.showAdd = true;
    }
  }
};
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .sd-module-box {
    .sd-form-box {
      .lk-time-chose {
        span {
          display: block;
          padding: 0 7px;
        }
        .lk-time-box {
          width: 100%;
          float: left;
          .el-input__inner {
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>

<style  rel="stylesheet/scss" lang="scss" >
.app-container {
  .sd-module-box {
    .sd-form-box {
      .lk-time-chose {
        .lk-time-box {
          .el-input__inner {
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>

<style>
.blue {
  cursor: pointer;
}
.titleHalf {
  border: 1px solid #ddd;
  margin-top: -10px !important;
}
.rightConten {
  border-right: 1px solid #ddd;
}
.receiveTitle {
  height: 30px;
  line-height: 30px;
  background: #edeff2;
  text-align: center;
  font-size: 15px;
}
.rightdownCon {
  border-bottom: 1px solid #ddd;
}
.leftdownCon {
  text-align: center;
}
.buttonsty {
  margin-left: 0px !important;
  margin-top: 10px;
}
.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}
.rightInfoWords {
  font-size: 13px;
  color: #909399;
  margin-left: 20px;
}
.Divisionline {
  width: 100%;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}
.receInput {
  width: 400px;
}
</style>