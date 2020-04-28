<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">账号列表</div>
        <div class="sd-module-btn">
          <el-button
            class="btn-mainCol"
            @click="addGoodsBtn()"
          >新增</el-button>
          <el-button
            class="openCol-btn"
            @click="enableClas()"
          >启用</el-button>
          <el-button
            class="stopCol-btn"
            @click="stopClas()"
          >停用</el-button>
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
          <el-col
            :span="5"
            class="sd-col-6"
          >
            <el-form-item
              label="用户名:"
              class="sd-form-item"
              prop="adm_acc"
            >
              <el-input
                v-model="formList.adm_acc"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="5"
            class="sd-col-6"
          >
            <el-form-item
              label="联系电话:"
              class="sd-form-item"
              prop="adm_mobile"
            >
              <el-input
                v-model="formList.adm_mobile"
                placeholder="请输入联系电话"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="5"
            class="sd-col-6"
          >
            <el-form-item
              label="员工姓名:"
              class="sd-form-item"
              prop="adm_name"
            >
              <el-input
                v-model="formList.adm_name"
                placeholder="请输入员工姓名"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="5"
            class="sd-col-6"
          >
            <el-form-item
              label="角色名称:"
              class="sd-form-item"
              prop="rol_name"
            >
              <el-select
                v-model="formList.rol_name"
                class
                placeholder="全部"
              >
                <el-option
                  v-for="(item,index) in godsType"
                  :key="index"
                  :label="item.rol_name"
                  :value="item.rol_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="5"
            class="sd-col-6"
          >
            <el-form-item
              label="状态分类:"
              class="sd-form-item"
              prop="adm_stase"
            >
              <el-select
                v-model="formList.adm_stase"
                class
              >
                <el-option
                  v-for="item in state"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            class="pl-50 fr w250"
            style
          >
            <el-button
              class
              type="primary"
              @click="searchList('formList',1)"
            >搜&nbsp;&nbsp;索</el-button>
            <el-button
              class
              @click="resetForm('formList')"
            >重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table
          :data="list"
          width="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="用户名"
            prop="adm_acc"
            min-width
            align="center"
          />
          <el-table-column
            label="员工姓名"
            prop="adm_name"
            align="center"
          />
          <el-table-column
            label="联系电话"
            prop="adm_mobile"
            align="center"
          />
          <el-table-column
            label="角色名称"
            prop="rol_name"
            align="center"
          />
          <el-table-column
            label="创建人"
            prop="adm_creator"
            align="center"
          />
          <el-table-column
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.adm_stase == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="320"
          >
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button
                  size="mini"
                  class="btn-mainCol"
                  @click="editPwd(scope.row)"
                >重置密码</el-button>
                <el-button
                  size="mini"
                  class="btn-mainCol"
                  @click="editRow(scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="scope.row.adm_stase==2"
                  size="mini"
                  class="openCol-btn"
                  @click="enableThisClas(scope.row,1)"
                >启用</el-button>
                <el-button
                  v-if="scope.row.adm_stase==1"
                  size="mini"
                  class="stopCol-btn"
                  @click="enableThisClas(scope.row,2)"
                >停用</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        v-show="list.length>0"
        class="lk-page-box"
      >
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
        :title="dialog.title"
        :visible.sync="dialog.show"
        :close-on-click-modal="false"
        width="600px"
        class="account_add"
        @close="cancleDia('addForm')"
      >
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addRules"
          class="account_add_form"
          size="medium"
          label-width="130px"
        >
          <el-form-item
            label="用户名"
            prop="adm_acc"
          >
            <el-input
              v-model="addForm.adm_acc"
              :disabled="dialog.editshow"
              class="w340"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="adm_mobile"
          >
            <el-input
              v-model="addForm.adm_mobile"
              class="w340"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <el-form-item
            label="员工姓名"
            prop="adm_name"
          >
            <el-input
              v-model="addForm.adm_name"
              class="w340"
              placeholder="请输入员工姓名"
            />
          </el-form-item>
          <el-form-item
            v-if="!dialog.editshow"
            label="登录密码"
            prop="adm_pas"
          >
            <el-input
              v-model="addForm.adm_pas"
              class="w340"
              placeholder="请输入登录密码"
            />
          </el-form-item>
          <el-form-item
            label="可用角色"
            prop="adm_pre"
          >
            <el-select
              v-model="addForm.adm_pre"
              placeholder="请选择角色"
              class="w340"
            >
              <el-option
                v-for="item in godsType"
                :key="item.rol_id"
                :label="item.rol_name"
                :value="item.rol_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="状态"
            prop="adm_stase"
          >
            <el-select
              v-model="addForm.adm_stase"
              class="w340"
            >
              <el-option
                v-for="item in state1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item align="right">
            <el-button @click="cancleDia('addForm')">取 消</el-button>
            <el-button
              :loading="dialog.addLoading"
              type="primary"
              @click="submitForm('addForm')"
            >确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
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
          <el-button
            type="primary"
            @click="showNPwd=false"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import {
  acotList,
  startstase,
  stopstase,
  addadmin,
  editadmin,
  resetpwd,
  getRoleInfo
} from '@/api/system'
import { errorStatus } from '@/utils/index'
import { phoneTest, valiPassword } from '@/utils/validate'
export default {
  name: 'Account',
  data() {
    const phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'))
      }
      if (!phoneTest(value)) {
        return callback(new Error('请确认手机号的正确性'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!valiPassword(value)) {
        callback(new Error('密码长度6~15'))
      } else {
        callback()
      }
    }
    return {
      formList: {
        adm_acc: '',
        adm_mobile: '',
        adm_name: '',
        rol_name: '',
        adm_stase: ''
      },
      rules: {
        adm_acc: [],
        adm_mobile: [],
        adm_name: [],
        rol_name: [],
        adm_stase: []
      },
      godsType: [],
      rolesType: null,
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      state1: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      dialog: {
        title: '新增',
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      chosed: [],
      serch_req: false,
      addForm: {
        adm_name: '',
        adm_acc: '',
        adm_mobile: '',
        adm_pre: '',
        adm_stase: '',
        adm_pas: ''
      },
      addRules: {
        adm_name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        adm_acc: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        adm_mobile: [{ required: true, trigger: 'blur', validator: phone }],
        adm_pre: [{ required: true, message: '请选择角色', trigger: 'change' }],
        adm_pas: [
          {
            required: true,
            validator: validatePassword,
            trigger: 'blur'
          }
        ]
      },
      showNPwd: false
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },
  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getPageInfo();
    // this.addForm.adm_stase = this.state1[0].name;
  },
  methods: {
    getPageInfo() {
      // console.log("9099999
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {};
      data.page = this.currentPage
      acotList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            // const role_id = { rol_id: 0, rol_name: "全部" };
             const role = dataRep.data_info.role
            this.godsType = role
            // this.godsType.splice(0, 0, role_id);
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
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
      const search = this.formList
      if (search.adm_stase === '全部' || search.adm_stase === 0) {
        search.adm_stase = ''
      }
      if (
        search.rol_name === '全部' ||
        search.rol_name === '' ||
        search.rol_name === ''
      ) {
        search.rol_name = ''
      }

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // console.log('search--', search)
      search.page = page
      acotList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            const rol = { rol_id: 0, rol_name: '全部' }
            const role = dataRep.data_info.role
            role.unshift(rol)
            this.godsType = role
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            this.serch_req = true
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
        })
    },
    // 添加
    addGoodsBtn() {
      this.dialog.title = '新增'
      this.dialog.edit_id = 0
      this.addForm.adm_stase = this.state1[0].name
      const data={};
      getRoleInfo(data).then(response=>{
        if(response.data){
          //  console.log("11111111111111111111",response.data.roleinfo)
          this.godsType = response.data.roleinfo;
          this.dialog.show = true
          this.dialog.editshow = false;
        }
      }).catch(Error=>{
        console.log("Error--",Error)
      })
    },
    // 提交
    submitForm(formName) {
      // console.log("111111111111")
      // if(1===1){
      //   return false
      // }
      const edit_id = this.dialog.edit_id
      const rolesType = this.rolesType
      this.$refs[formName].validate(valid => {
        // console.log('-formName--', valid)
        if (valid) {
          // console.log("---", valid);
          const data = this.addForm
          this.dialog.addLoading = true
          for (const i in rolesType) {
            if (data.adm_pre === rolesType[i].rol_name) {
              data.adm_pre = rolesType[i].rol_id
            }
          }
          // console.log('222222222222')
          if (data.adm_stase === '启用') {
            // console.log('3333333333333333')
            data.adm_stase = 1
          }
          // console.log("---", data);
          if (edit_id === 0) {
            addadmin(data)
              .then(response => {
                this.dialog.addLoading = false
                const dataRep = response.data
                if (errorStatus(dataRep)) {
                  this.$message.success(dataRep.data)
                  this.dialog.show = false
                  this.$refs[formName].resetFields()
                  this.getPageInfo()
                }
              })
              .catch(Error => {
                this.dialog.addLoading = false
                console.log('---', Error)
                this.$message.error('请求失败!')
              })
          } else {
            data.adm_id = edit_id
            editadmin(data)
              .then(response => {
                this.dialog.addLoading = false
                const dataRep = response.data
                if (errorStatus(dataRep)) {
                  this.$message.success(dataRep.data)
                  this.dialog.show = false
                  this.$refs[formName].resetFields()
                  this.getPageInfo()
                }
              })
              .catch(Error => {
                this.dialog.addLoading = false
                console.log('---', Error)
                this.$message.error('请求失败!')
              })
          }
        } else {
          this.$message.error('添加信息有误!')
          return false
        }
      })
    },
    // 重置密码
    editPwd(row) {
      const data = {}
      data.adm_id = row.adm_id
      this.$confirm('确定重置该账号密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetpwd(data).then(response => {
          if (errorStatus(response.data)) {
            this.showNPwd = true
          }
        })
      })
    },
    // 编辑
    editRow(row) {
      this.addForm.adm_name = row.adm_name
      this.addForm.adm_acc = row.adm_acc
      this.addForm.adm_mobile = row.adm_mobile
      this.addForm.adm_pre = row.rol_name
      this.addForm.adm_stase = row.adm_stase
      this.dialog.edit_id = row.adm_id
      this.dialog.show = true
      this.dialog.title = '编辑'
      this.dialog.editshow = true
    },
    // 单个--启用--停用
    enableThisClas(row, num) {
      const data = {}
      data.adm_id = [row.adm_id]
      if (num === 1) {
        // 启用
        startstase(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.adm_stase = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 停用
        stopstase(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.adm_stase = num
            }
          })
          .catch(Error => {
            // console.log("停用的账号err", err);
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
        this.$message.error('请选择要启用的账号!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].adm_stase === 2) {
            id.push(chosed[i].adm_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.adm_id = id
          this.$confirm('请确认,是否启用选中的账号?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              startstase(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].adm_id) {
                          list[j].adm_stase = 1
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的账号err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中账号的状态全部为'启用'", '提示', {
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
        this.$message.error('请选择要停用的账号!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].adm_stase === 1) {
            id.push(chosed[i].adm_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.adm_id = id
          this.$confirm('请确认,是否停用选中账号?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              stopstase(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].adm_id) {
                          list[j].adm_stase = 2
                        }
                      }
                    }
                    this.list = list
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的账号err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中账号状态已全部为'停用'?", '提示', {
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
    // 弹窗--取消
    cancle(formName) {
      this.$refs[formName].resetFields()
      this.dialog.show = false
    },
    cancleDia(formName) {
      const addForm = this.addForm
      this.dialog.show = false
      addForm.adm_name = ''
      addForm.adm_acc = ''
      addForm.adm_mobile = ''
      addForm.adm_pre = ''
      addForm.adm_stase = ''
      addForm.adm_pas = ''
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
      this.$refs[formName].resetFields()
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
    .el-input.is-disabled .el-input__inner {
      color: #666;
    }
  }
  .el-dialog__body {
    padding: 30px 20px 20px;
  }
}
</style>
