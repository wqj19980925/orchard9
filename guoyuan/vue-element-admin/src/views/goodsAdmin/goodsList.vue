<template>
  <div class="app-container">
    <el-row v-if="!showAdd" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">商品列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn" @click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn" @click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.outBtn" class="Import-btn" @click="ImportExcel()">导入</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delChoseBtn()">删除</el-button>
          <!-- v-if="btnShow.addBtn" v-if="btnShow.startBtn" v-if="btnShow.stopBtn" v-if="btnShow.outBtn"  v-if="btnShow.delBtn" -->
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
            <el-form-item label="商品名称:" class="sd-form-item" prop="goo_name">
              <el-input v-model="formList.goo_name" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="商品编号:" class="sd-form-item" prop="goo_number">
              <el-input v-model="formList.goo_number" placeholder="请输入商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="商品品类:" class="sd-form-item" prop="goo_classifi">
              <el-select v-model="formList.goo_classifi" class placeholder="全部">
                <el-option
                  v-for="item in godsType"
                  :key="item.cla_id"
                  :label="item.cla_name"
                  :value="item.cla_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="sd-col-6">
            <el-form-item label="状态分类:" class="sd-form-item" prop="goo_sta">
              <el-select v-model="formList.goo_sta" class style="width:80px;">
                <el-option
                  v-for="item in state"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="fr" style="width:190px">
            <el-button class type="primary" @click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list" width="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="商品名称" prop="goo_name" min-width align="center" />
          <el-table-column label="商品编号" prop="goo_number" align="center" />
          <el-table-column label="商品品类" prop="cla_name" align="center" />
          <!-- <el-table-column label="发码量占比(%)" prop="goo_code_percent" align="center" /> -->
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.goo_sta == 1">启用</div>
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
                  v-if="btnShow.copyBtn"
                  size="small"
                  class="btn-secCol"
                  @click="copyGoods(scope.row)"
                >复制</el-button>
                <el-button
                  v-if="scope.row.goo_sta===2 && btnShow.startBtn"
                  size="mini"
                  class="openCol-btn"
                  @click="enableThisClas(scope.row,1)"
                >启用</el-button>
                <el-button
                  v-if="scope.row.goo_sta===1 && btnShow.stopBtn"
                  size="mini"
                  class="stopCol-btn"
                  @click="enableThisClas(scope.row,2)"
                >停用</el-button>
                <el-button
                  v-if="btnShow.delBtn"
                  size="mini"
                  class="btn-delete"
                  @click="delRow(scope.row)"
                >删除</el-button>
              </div>
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
      <!-- 弹窗  导入-->
      <el-dialog
        title="导入"
        :visible.sync="dia.show"
        width="30%"
        @close="dia.show=false"
        class="dialog_data_box"
      >
        <div class="list_data_add">
          <el-form :model="diaForm" ref="diaForm" label-width="100px">
            <el-form-item label="数据来源" class="el">
              <el-button
                v-show="dia.UpBtnShow"
                class="upload_btn"
                style="width: 260px;"
                @click.native="uploadFile"
              >上传</el-button>
              <el-button v-show="!dia.UpBtnShow" class="upload_btn" style="width: 260px;">上传成功</el-button>
              <div class="tip_box">下载模板,填写数据后,再上传excel文件</div>
              <input
                type="file"
                style="display:none;"
                id="excelUpload"
                accept=".xls, .xlsx"
                v-on:change="upFileExcel($event)"
              />
            </el-form-item>
          </el-form>
          <div class="download_text">
            <el-button type="text" @click="outExcel(1)">下载模板</el-button>
          </div>
        </div>
        <!--   <span slot="footer">
      <el-button @click=" dia.show= false">取 消</el-button>
      <el-button type="primary"@click="submitDta()":loading='dia.loading'>
        确 定
      </el-button>
        </span>-->
      </el-dialog>
      <a :href="urlDownload" style="display:none" id="downLoadA"></a>
      <a id="clickA" ref="clickA22" :href="url" style="display:none;" />
    </el-row>
    <!-- 新增页面 -->
    <addgoods v-if="showAdd" :edit-id="edit_id" :btnId="btnId" @listerToChild="showListPages()" />
  </div>
</template>
<script>
import {
  goodsList,
  openGoods,
  downExcel,
  stopGoods,
  impExcel,
  delgo,
  exports,
  duplication
} from "@/api/goods";
import { errorStatus } from "@/utils/index";
import { getToken } from "@/utils/auth";
import Addgoods from "./component/addGoods";
export default {
  name: "GoodsList",
  components: { Addgoods },
  data() {
    return {
      formList: {
        goo_name: "",
        goo_number: "",
        goo_classifi: "",
        goo_sta: ""
      },
      rules: {
        goo_name: [],
        goo_number: [],
        goo_classifi: [],
        goo_sta: []
      },
      dia: {
        tit: "导入",
        show: false,
        loading: false,
        UpBtnShow: true
      },
      diaForm: {
        file: "",
        upstate: 0
      },
      list: [],
      diaEdit: {
        show: false,
        showDown: true,
        loading: false,
        editId: null,
        downLoad: false,
        downLoad1: false,
        subLoad: false
      },
      state: [
        { id: 0, name: "全部" },
        { id: 1, name: "启用" },
        { id: 2, name: "停用" }
      ],
      godsType: null,
      chosed: "",
      currentPage: 1,
      pageSize: 10,
      totalNum: 50,
      search_req: false, // 是否为搜索状态
      showAdd: false,
      edit_id: 0,
      btnId: 0,
      baseURL: process.env.BASE_API,
      url: null,
      outLoad: false,
      urlDownload: "",
      btnShow: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        startBtn: false,
        stopBtn: false,
        outBtn: false,
        codeBtn: false,
        copyBtn: false
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
    this.getPageInfo();
    // this.formList.godsType = this.godsType[0].name;
    this.formList.goo_sta = this.state[0].name;
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
      data.page = this.currentPage;
      data.pri_id = this.$route.meta.pri_id;
      // 获取列表
      goodsList(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          console.log(dataRep, "1");
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
            const gos = { cla_id: 0, cla_name: "全部" };
            const goo_cla = dataRep.goo_class;
            goo_cla.unshift(gos);
            this.godsType = goo_cla;
            // 获取按钮
            const btnList = dataRep.button_data;
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === "添加") {
                this.btnShow.addBtn = true;
              } else if (btnList[i].pri_funname === "编辑") {
                this.btnShow.editBtn = true;
              } else if (btnList[i].pri_funname === "删除") {
                this.btnShow.delBtn = true;
              } else if (btnList[i].pri_funname === "启用") {
                this.btnShow.startBtn = true;
              } else if (btnList[i].pri_funname === "停用") {
                this.btnShow.stopBtn = true;
              } else if (btnList[i].pri_funname === "导入") {
                this.btnShow.outBtn = true;
              } else if (btnList[i].pri_funname === "发码") {
                this.btnShow.codeBtn = true;
              } else if (btnList[i].pri_funname === "复制") {
                this.btnShow.copyBtn = true;
              }
            }
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error("请求失败!");
          console.log("err", err);
        });
    },
    // 搜索
    searchList(formName, page) {
      const search = this.formList;
      search.pri_id = this.$route.meta.pri_id;
      // console.log('---', search)

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (search.goo_sta === "全部") {
        search.goo_sta = 0;
      }
      // search.page = page

      // 获取列表
      goodsList(search)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.list = dataRep.data;
            this.currentPage = dataRep.current_page;
            this.pageSize = dataRep.current_number;
            this.totalNum = dataRep.total;
            const gos = { cla_id: 0, cla_name: "全部" };
            const goo_cla = dataRep.goo_class;
            goo_cla.unshift(gos);
            this.godsType = goo_cla;
            // 获取按钮
            const btnList = dataRep.button_data;
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === "添加") {
                this.btnShow.addBtn = true;
              } else if (btnList[i].pri_funname === "编辑") {
                this.btnShow.editBtn = true;
              } else if (btnList[i].pri_funname === "删除") {
                this.btnShow.delBtn = true;
              } else if (btnList[i].pri_funname === "启用") {
                this.btnShow.startBtn = true;
              } else if (btnList[i].pri_funname === "停用") {
                this.btnShow.stopBtn = true;
              } else if (btnList[i].pri_funname === "导入") {
                this.btnShow.outBtn = true;
              } else if (btnList[i].pri_funname === "发码") {
                this.btnShow.codeBtn = true;
              } else if (btnList[i].pri_funname === "复制") {
                this.btnShow.copyBtn = true;
              }
            }
          }
          loading.close();
        })
        .catch(Error => {
          loading.close();
          this.$message.error("获取列表失败");
        });
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    ImportExcel() {
      this.edit_id;
      this.dia.tit = "导入";
      this.dia.show = true;
      this.diaEdit.editId = null;
      this.dia.UpBtnShow = true;
    },
    //上传
    uploadFile() {
      document.getElementById("excelUpload").click();
    },
    // 导出
    outExcel() {
      const data = {};
      downExcel(data)
        .then(response => {
          if (errorStatus(response.data)) {
            const str = response.data.url;
            const url = this.baseURL;
            const base = url.replace("/public", "/");
            this.urlDownload = base + str;
            this.clickABtn();
          }
        })
        .catch(Error => {
          this.$message.error("请求失败");
        });
    },
    clickABtn() {
      setTimeout(() => {
        document.getElementById("downLoadA").click();
      }, 500);
    },
    upFileExcel(el) {
      //  console.log("上传")
      var _this = this;
      // console.log("el---",el)
      el.preventDefault(); //取消默认行为
      // var fileDta=document.getElementById('excelUpload')
      let uploadEventFile = document.getElementById("excelUpload").value;
      if (
        uploadEventFile.lastIndexOf(".xls") > 0 ||
        uploadEventFile.lastIndexOf(".XLS") > 0
      ) {
        let formData = new FormData();
        var file = el.target.files[0];
        formData.append("api_token", getToken());
        formData.append("file", file);
        impExcel(formData)
          .then(response => {
            if (errorStatus(response.data)) {
              this.dia.UpBtnShow = false;
              this.$message.success(response.data.data);
              this.dia.show = false;
              this.getPageInfo();
              // _this.showAddFile=false
            }
          })
          .catch(Error => {});

        document.getElementById("excelUpload").value = null;
      } else {
        this.$message.error("请上传正确的excel文件");
      }
    },
    /*   submitDta(){
        if(this.diaForm.upstate==1){
          this.dia.show=false
        }
        else{
          this.$message.error("请选择需要上传的文件")
        }
     
    },*/
    // 启用--这个--停用
    enableThisClas(row, num) {
      const data = {};
      data.goo_id = [row.goo_id];
      if (num === 1) {
        // 启用
        openGoods(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success("启用成功!");
              row.goo_sta = num;
            }
          })
          .catch(Error => {
            this.$message.error("请求失败!");
          });
      } else if (num === 2) {
        // 停用
        stopGoods(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success("停用成功!");
              row.goo_sta = num;
            }
          })
          .catch(Error => {
            // console.log("停用的商品err", err);
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
        this.$message.error("请选择要启用的商品!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].goo_sta === 2) {
            id.push(chosed[i].goo_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.goo_id = id;
          this.$confirm("请确认,是否启用选中的商品?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              openGoods(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].goo_id) {
                          list[j].goo_sta = 1;
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list;
                    this.$message.success("启用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的商品err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消停用");
            });
        } else {
          this.$confirm("选中商品的状态全部为'启用'?", "提示", {
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
        this.$message.error("请选择要停用的商品!");
      } else {
        const id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].goo_sta === 1) {
            id.push(chosed[i].goo_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.goo_id = id;
          this.$confirm("请确认,是否停用选中的商品?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              stopGoods(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].goo_id) {
                          list[j].goo_sta = 2;
                        }
                      }
                    }
                    // console.log(list);
                    this.list = list;
                    this.$message.success("停用成功!");
                  }
                })
                .catch(err => {
                  console.log("err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消停用");
            });
        } else {
          this.$confirm("选中商品的状态全部为'停用'?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error"
          }).then(() => {});
        }
      }
    },
    // 新增
    addGoodsBtn() {
      this.showAdd = true;
      this.btnId = 0;
    },
    // 编辑
    editRow(row) {
      this.edit_id = row.goo_id;
      this.showAdd = true;
      this.btnId = 1;
    },
    // 复制
    copyGoods(row) {
      this.edit_id = row.goo_id;
      this.showAdd = true;
      this.btnId = 2;
    },
    //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed;
      if (chosed.length < 1) {
        this.$message.error("请选择要删除的商品!");
      } else {
        const data = {};
        data.del_id = [];
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.del_id.push(chosed[i].goo_id);
        }
        this.$confirm("请确认,是否删除所选中的商品?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delgo(data)
            .then(response => {
              // console.log('delgo---', response)
              if (errorStatus(response.data)) {
                this.currentPage = 1;
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
    // 删除-这个
    delRow(row) {
      // console.log('del---row', row)
      const data = {};
      const del_id = [];
      del_id.push(row.goo_id);
      data.del_id = del_id;
      // console.log('删除---', data)
      this.$confirm("请确认,是否删除所选中的商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delgo(data)
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
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val;
    },
    // 页面--分页器
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val;
      if (this.search_req) {
        this.searchList("formList", val);
      } else {
        this.getPageInfo();
      }
    },
    showListPages() {
      this.showAdd = false;
      this.getPageInfo();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.mainColor {
  color: $mainColor;
}
.el-dialog__body .list_data_add .tip_box {
  color: #f35e5e;
  font-size: 12px;
  line-height: 20px;
}
.el-dialog__body .list_data_add .download_text button {
  color: #409eff;
  width: 120px;
}
.el-dialog__body .list_data_add .download_text[data-v-0910273e] {
  padding-left: 100px;
}
</style>
