<!--溯源列表-->
<template>
  <!--外部整体盒子-->
  <div class="app-container">
    <!--信息筛选-->
    <el-row v-if="showList" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">信息列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addBtn()">新增</el-button>
          <!-- <el-button @click="editClas()">编辑</el-button> -->
          <el-button v-if="btnShow.startBtn" class="openCol-btn" @click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn" @click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delChoseBtn()">删除</el-button>
        </div>
      </div>
      <el-form
        ref="formList"
        :model="formList"
        :rules="formRules"
        class="sd-form-box clearfix"
        size="medium"
        label-width="100px"
      >
        <el-row class="clearfix">
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="信息名称：" class="sd-form-item" prop="tem_title">
              <el-input v-model="formList.tem_title" class placeholder="请输入信息名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="模板名称：" class="sd-form-item" prop="fom_name">
              <el-input v-model="formList.fom_name" class placeholder="请输入模板名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="溯源标签：" class="sd-form-item" prop="fla_name">
              <el-input v-model="formList.fla_name" class placeholder="请输入溯源标签" />
            </el-form-item>
          </el-col>
          <el-col :span="11" class="sd-col-6">
            <el-form-item label="时间：" class="lk-time-chose">
              <el-col :span="11">
                <el-form-item prop="start_time">
                  <el-date-picker
                    v-model="formList.start_time"
                    type="datetime"
                    placeholder="开始日期"
                    class="lk-time-box"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerDateBefore"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span class="fl">-</span>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="end_time">
                  <el-date-picker
                    v-model="formList.end_time"
                    type="datetime"
                    placeholder="结束日期"
                    class="lk-time-box"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerDateAfter"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="1" />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="状态：" prop="tem_state">
              <el-select v-model="formList.tem_state" placeholder class="form-ipt-sed">
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
          <el-table-column label="信息名称" min-width prop="tem_title" align="center" />
          <el-table-column label="标签名称" min-width prop="fla_name" align="center" />
          <el-table-column label="模板名称" min-width prop="fom_name" align="center" />
          <el-table-column label="时间" min-width prop="tem_cretime" align="center" />
          <el-table-column label="状态" min-width align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.tem_state === 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320" prop align="center">
            <template slot-scope="scope">
              <el-button
                v-if="btnShow.editBtn"
                class="btn-mainCol"
                size="mini"
                @click="editBtn(scope.row.tem_id)"
              >编辑</el-button>
              <el-button
                v-if="btnShow.copyBtn"
                class="btn-secCol"
                size="mini"
                @click="copyData(scope.row.tem_id)"
              >复制</el-button>
              <el-button
                v-if="scope.row.tem_state==2 && btnShow.startBtn "
                size="mini"
                class="openCol-btn"
                @click="enableThisClas(scope.row,1)"
              >启用</el-button>
              <el-button
                v-if="scope.row.tem_state==1 && btnShow.stopBtn"
                size="mini"
                class="stopCol-btn"
                @click="enableThisClas(scope.row,2)"
              >停用</el-button>
              <el-button size="mini" class="btn-delete" @click="delRow(scope.row)">删除</el-button>
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
    </el-row>
    <addMess v-if="!showList" :edit-id="edit_id" @listerToChild="showListPages()" :edit="editShow" />
  </div>
</template>

<script>
import {
  InfoList,
  InfoStart,
  InfoStop,
  AddInfo,
  editInfo,
  delInfo,
  copyInfo
} from "@/api/trace";
import { errorStatus } from "@/utils/index";
import addMess from "./components/addMess";
export default {
  name: "TraceList",
  components: { addMess },
  data() {
    return {
      editShow: 0,
      showList: true,
      edit_id: 0,
      formList: {
        start_time: "",
        end_time: "",
        tem_title: "",
        fom_name: "",
        fla_name: "",
        tem_state: ""
      },
      formRules: {
        fom_title: [],
        tem_state: []
      },
      state: [
        { id: 0, name: "全部" },
        { id: 1, name: "启用" },
        { id: 2, name: "停用" }
      ],
      list: [],
      chosed: [],
      search_req: false,
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      btnShow: {},
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.formList.start_time;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      },
      pickerDateAfter: {
        disabledDate: time => {
          let _now = Date.now();
          let DateVal = this.formList.end_time;
          if (DateVal) {
            return time.getTime() < DateVal || time.getTime() > _now;
          } else {
            return time.getTime() > _now;
          }
        }
      }
    };
  },
  created() {
    // 页面加载时
    this.getPageInfo();
    this.formList.tem_state = this.state[0].name;
  },
  methods: {
    getPageInfo() {
      const data = {};
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      data.page = this.currentPage;
      data.pri_id = this.$route.meta.pri_id;
      InfoList(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          // console.log('获取列表----', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data;
            this.currentPage = dataRep.data_info.current_page;
            this.pageSize = dataRep.data_info.current_number;
            this.totalNum = dataRep.data_info.total;
            const btnList = dataRep.data_info.button_data;
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === "新增") {
                this.$set(this.btnShow, "addBtn", true);
              } else if (btnList[i].pri_funname === "编辑") {
                this.$set(this.btnShow, "editBtn", true);
              } else if (btnList[i].pri_funname === "复制") {
                this.$set(this.btnShow, "copyBtn", true);
              } else if (btnList[i].pri_funname === "启用") {
                this.$set(this.btnShow, "startBtn", true);
                // this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === "停用") {
                this.$set(this.btnShow, "stopBtn", true);
                // this.btnShow.stopBtn = true
              } else if (btnList[i].pri_funname === "删除") {
                this.$set(this.btnShow, "delBtn", true);
                // this.btnShow.stopBtn = true
              }
            }
          }
        })
        .catch(Error => {
          loading.close();
          this.$message.error("请求失败!");
        });
    },
    // 搜索
    searchList(formName, num) {
      const search = this.formList;
      if (search.tem_state === "全部") {
        search.tem_state = 0;
      }
      search.page = num;
      search.pri_id = this.$route.meta.pri_id;
      // console.log('----', search)
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      InfoList(search)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            loading.close();
            // console.log('----', dataRep)
            this.list = dataRep.data_info.data;
            this.currentPage = dataRep.data_info.current_page;
            this.pageSize = dataRep.data_info.current_number;
            this.totalNum = dataRep.data_info.total;
          }
        })
        .catch(Error => {
          loading.close();
        });
    },
    // 启用--这个--停用
    enableThisClas(row, num) {
      const data = {};
      data.tem_id = [row.tem_id];
      if (num === 1) {
        // 启用
        InfoStart(data)
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
        InfoStop(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success("停用成功!");
              row.tem_state = num;
            }
          })
          .catch(Error => {
            // console.log("停用的信息err", err);
            this.$message.error("请求失败!");
          });
      }
    },
    //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed;
      if (chosed.length < 1) {
        this.$message.error("请选择要删除的信息!");
      } else {
        const data = {};
        data.tem_id = [];
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.tem_id.push(chosed[i].tem_id);
        }
        this.$confirm("请确认,是否删除所选中的信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delInfo(data)
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
    // 删除-这个
    delRow(row) {
      // console.log('del---row', row)
      const data = {};
      const tem_id = [];
      tem_id.push(row.tem_id);
      data.tem_id = tem_id;
      // console.log('删除---', data)
      this.$confirm("请确认,是否删除所选中的信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delInfo(data)
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
    // 启用
    enableClas() {
      const list = this.list;
      const chosed = this.chosed;
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error("请选择要启用的信息!");
      } else {
        const tem_id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].tem_state === 2) {
            tem_id.push(chosed[i].tem_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (tem_id.length > 0) {
          data.tem_id = tem_id;
          this.$confirm("请确认,是否启用选中的信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              InfoStart(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in tem_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (tem_id[i] === list[j].tem_id) {
                          list[j].tem_state = 1;
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list;
                    this.$message.success("启用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的信息err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消停用");
            });
        } else {
          this.$confirm("选中信息的状态全部为'启用'?", "提示", {
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
        this.$message.error("请选择要停用的信息!");
      } else {
        const tem_id = [];
        const data = {};
        for (const i in chosed) {
          if (chosed[i].tem_state === 1) {
            tem_id.push(chosed[i].tem_id);
          }
        }
        // console.log('选择的数据-id-', id)
        if (tem_id.length > 0) {
          data.tem_id = tem_id;
          this.$confirm("请确认,是否停用选中的信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              InfoStop(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in tem_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (tem_id[i] === list[j].tem_id) {
                          list[j].tem_state = 2;
                        }
                      }
                    }
                    // console.log(list);
                    this.list = list;
                    this.$message.success("停用成功!");
                  }
                })
                .catch(err => {
                  console.log("启用的信息err", err);
                  this.$message.error("请求失败!");
                });
            })
            .catch(() => {
              // console.log("取消停用");
            });
        } else {
          this.$confirm("选中信息的状态全部为'停用'?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error"
          }).then(() => {});
        }
      }
    },

    //复制
    copyData(id) {
      this.showList = false;
      this.edit_id = id;
      this.editShow = 2;
      // alert('id')
      // console.log('--复制--', id)
    },
    // copyData(id) {
    //   // alert('id')
    //   // console.log('--复制--', id)
    //   const data = {}
    //   data.tem_id = id
    //   copyInfo(data)
    //     .then(response => {
    //       const dataRep = response.data
    //       if (errorStatus(dataRep)) {
    //         // console.log('dataRep--', dataRep)
    //         this.$message.success(dataRep.data)
    //         this.getPageInfo()
    //       }
    //     })
    //     .catch(Error => {
    //       console.log('Error--', Error)
    //     })
    // },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val;
    },
    // 新增
    addBtn() {
      // console.log('----111')
      this.showList = false;
      this.edit_id = 0;
      this.editShow = 0;
    },
    editBtn(id) {
      // console.log("----",id);
      this.showList = false;
      this.edit_id = id;
      this.editShow = 1;
    },
    // 重置
    resetForm(formName) {
      // console.log("--")
      this.$refs[formName].resetFields();
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
      this.showList = true;
      this.getPageInfo();
    }
  }
};
</script>

<style>
</style>
