<template>
  <div class="app-container">
    <el-row v-if="showList" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">角色列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn" @click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn" @click="stopClas()">停用</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="角色名称:" class="sd-form-item" prop="rol_name">
              <el-input v-model="formList.rol_name" placeholder="请输入角色名称"/>
            </el-form-item>
          </el-col>
           <el-col :span="5" class="sd-col-6">
            <el-form-item label="权限功能:" class="sd-form-item" prop="rol_type">
              <el-select v-model="formList.rol_type" class>
                <el-option v-for="item in roletype":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态分类:" class="sd-form-item" prop="rol_sta">
              <el-select v-model="formList.rol_sta" class>
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
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
          <el-table-column type="selection" width="55"/>
          <el-table-column label="角色名称" prop="rol_name" min-width align="center"/>
          <el-table-column label="权限功能" align="center">
             <template slot-scope="scope">
              <div v-if="scope.row.rol_type == 1">全局功能</div>
              <div v-else>部分功能</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.rol_sta == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="320">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button v-if="btnShow.editBtn" :disabled="scope.row.rol_id===1" size="mini" class="btn-mainCol" @click="editRow(scope.row)">
                  编辑
                </el-button>
                <el-button v-if="scope.row.rol_sta==2 && btnShow.startBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)">
                  启用
                </el-button> 
                <el-button v-if="scope.row.rol_sta==1 && btnShow.stopBtn":disabled="scope.row.rol_id===1"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)">
                  停用
                </el-button>
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
    </el-row>
    <!-- 新增页面 -->
    <addroles v-if="!showList" :edit-id="edit_id" @listerToChild="showListPages()"/>
  </div>
</template>

<script>
import { roleindex, roleStart, roleStop } from '@/api/system'
import { errorStatus } from '@/utils/index'
import Addroles from './components/addRoles'
export default {
  name: 'RoleList',
  components: { Addroles },
  data() {
    return {
      showList: true,
      edit_id: 0,
      formList: {
        rol_name: '',
        rol_type: '',
        rol_sta: ''
      },
      rules: {
        rol_name: [],
        rol_type: [],
        rol_sta: []
      },
      roletype:[
        { id: 0, name: '全部' },
        { id: 1, name: '全局功能' },
        { id: 2, name: '部分功能' }
      ],
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      chosed: [],
      serch_req: false,
      btnShow: {}
    }
  },
  watch: {
    $route() {
      this.getPageInfo()
    }
  },
  created() {
    this.formList.rol_sta = this.state[0].name
    this.formList.rol_type = this.roletype[0].name
    // 页面加载时
    this.getPageInfo()
  },
  methods: {
    getPageInfo() {
      const data = {}
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      data.page = this.currentPage
      data.pri_id = this.$route.meta.pri_id// 传入按钮id
      roleindex(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            const btnList = dataRep.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '新增') {
                this.$set(this.btnShow, 'addBtn', true)
              } else if (btnList[i].pri_funname === '编辑') {
                this.$set(this.btnShow, 'editBtn', true)
                // this.$set(this.btnId, 'addBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '启用') {
                this.$set(this.btnShow, 'startBtn', true)
                // this.$set(that.btnId, 'startBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '停用') {
                this.$set(this.btnShow, 'stopBtn', true)
                // this.$set(that.btnId, 'stopBtn', btnList[i].pri_id)
              }
            }
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    // 搜索
    searchList(formName, page) {
      const search ={}
      search.rol_name=this.formList.rol_name
      search.rol_sta=this.formList.rol_sta
      search.rol_type=this.formList.rol_type
      if (search.rol_sta === '全部' || search.rol_sta === 0) {
        search.rol_sta = ''
      }
      if (search.rol_type === '全部' || search.rol_type === 0) {
        search.rol_type = ''
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.pri_id = this.$route.meta.pri_id
      // console.log('search--', search)
      search.page = page
      roleindex(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            this.serch_req = true
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
        })
    },
    // 添加
    addGoodsBtn() {
      this.edit_id = 0
      this.showList = false
    },
    // 编辑
    editRow(row) {
      this.edit_id = row.rol_id
      this.showList = false
    },
    // 单个--启用--停用
    enableThisClas(row, num) {
      const data = {}
      data.rol_id = [row.rol_id]
      if (num === 1) {
        // 启用
        roleStart(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.rol_sta = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 停用
        roleStop(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.rol_sta = num
            }
          })
          .catch(Error => {
            // console.log("停用的角色err", err);
            this.$message.error('请求失败!')
          })
      }
    },
    // 启用
    enableClas() {
      const list = this.list
      const chosed = this.chosed
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要启用的角色!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].rol_sta === 2) {
            id.push(chosed[i].rol_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.rol_id = id
          this.$confirm('请确认,是否启用选中的角色?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              roleStart(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].rol_id) {
                          list[j].rol_sta = 1
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的角色err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中角色的状态全部为'启用'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    // 停用
    stopClas() {
      const list = this.list
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要停用的角色!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].rol_sta === 1) {
            id.push(chosed[i].rol_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.rol_id = id
          this.$confirm('请确认,是否停用选中角色?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              roleStop(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].rol_id) {
                          list[j].rol_sta = 2
                        }
                      }
                    }
                    this.list = list
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的角色err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中角色状态已全部为'停用'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      if (this.serch_req) {
        this.searchList('formList', val)
      } else {
        this.getPageInfo()
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    showListPages() {
      // console.log('999999999')
      this.showList = true
      this.getPageInfo()
    }
  }
}
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
  }
  .el-dialog__body {
    padding: 30px 20px 20px;
  }
}
</style>
