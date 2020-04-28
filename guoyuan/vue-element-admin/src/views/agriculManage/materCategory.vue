<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">农资品类</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addClasClick()">新增</el-button>
          <!-- <el-button @click="editClas()">编辑</el-button> -->
          <el-button v-if="btnShow.startBtn" class="openCol-btn" @click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn" @click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delChoseBtn()">删除</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules_sech"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="农资品类:" class="sd-form-item" prop="acl_name">
              <el-input v-model="formList.acl_name" placeholder="请输入农资品类"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="sd-col-6">
            <el-form-item label="状态:" class="sd-form-item" prop="acl_state">
              <el-select v-model="formList.acl_state" class style="width:120px;">
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/> 
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="sd-col-6">
            <el-form-item label="类型:" class="sd-form-item" prop="acl_type">
              <el-select v-model="formList.acl_type" class style="width:150px;">
                <el-option v-for="item in matertype":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="pl-50 w250">
            <el-button class type="primary" @click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list" width="100%" @selection-change="handleSelectionChange">
          <el-table-column  type="selection" width="55"/>
          <!-- <el-table-column prop='id' width='0'></el-table-column> -->
          <el-table-column label="农资品类" prop="acl_name" min-width align="center"/>
          <el-table-column label="类型" prop="acl_type" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.acl_type == 1">消耗性投入品</div>
              <div v-else>固定资产</div>
            </template>
          </el-table-column>
          <el-table-column label="下属农资数量" prop="acl_total" align="center"/>
          <el-table-column label="状态" prop="acl_state" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.acl_state == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" align="center">
            <template slot-scope="scope" >
              <div align="left">
                <el-button v-if="btnShow.editBtn && scope.row.acl_id!==1" size="mini"class="btn-mainCol"@click="editClas(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.acl_state == 1 && btnShow.stopBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)"> 停用
                </el-button>
                <el-button v-if="scope.row.acl_state == 2 && btnShow.startBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)"> 启用
                </el-button>
                <el-button v-if="btnShow.delBtn && scope.row.acl_id!==1" size="mini"class="btn-delete"@click="delBtn(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="list.length>0" class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog :visible.sync="showAddClas":title="AddClastitle":close-on-click-modal="false"width="500px"@close="cancleForm('addClaForm')">
      <el-form :inline="true" ref="addClaForm" :model="addClaForm" :rules="addClaRules" label-width="80px">
        <el-form-item :class="errInpt?'bdRed':''" label="农资品类" prop="acl_name">
          <el-input v-model="addClaForm.acl_name"style="width:200px;"placeholder="请输入农资品类"maxlength="20" @blur="blurClass($event)"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addClaForm.acl_type" class>
            <el-option v-for="item in diaType" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="type" style="width:300px">
          <el-select v-model="addClaForm.acl_state" class>
            <el-option v-for="item in diaState" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addClaForm')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('addClaForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { AgriClassList, addAgriClass, editAgriClass, delAgriClass, AgriClassStart, AgriClassStop } from '@/api/agriculManage'
import { errorStatus } from '@/utils/index'
import { getUserid } from '@/utils/auth'
import { getByteLen } from '@/utils/validate'
export default {
  name: 'ClassList',
  data() {
    return {
      formList: {
        acl_name: '',
        acl_state: '',
        acl_type:''
      },
      rules_sech: {
        acl_name: [],
        acl_state: []
      },
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      matertype: [
        { id: 0, name: '全部' },
        { id: 1, name: '消耗性投入品' },
        { id: 2, name: '固定资产' }
      ],
      list: [],
      chosed: '',
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addClaSta: null, // 判断是新增还是编辑 1新增 2编辑
      addClaForm: {
        acl_name:null,
        acl_state:null,
        acl_id:null,
        acl_type:null
      },
      diaState: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      diaType: [{ id: 1, name: '消耗性投入品' }, { id: 2, name: '固定资产' }],
      addClaRules: {
        acl_name: [
          { required: true, trigger: 'blur', message: '农资品类不能为空' }
          // { min: 1, max: 20, message: '农资品类名称过长,字数不可超过20', trigger: 'blur' }
        ]
      },
      AddClastitle: '',
      search_req: false,
      btnShow: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        startBtn: false,
        stopBtn: false
      },
      errInpt: false
    }
  },
  watch: {
    $route() {
      this.getPageInfo()
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
    this.formList.acl_state = this.state[0].name
    this.formList.acl_type = this.matertype[0].name
  },
  methods: {
    getPageInfo() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.pri_id = this.$route.meta.pri_id
      data.page = this.currentPage
      // 获取列表
      AgriClassList(data)
        .then(response => {
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            this.search_req = false
            const btnList = dataRep.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '新增') {
                this.btnShow.addBtn = true
              } else if (btnList[i].pri_funname === '编辑') {
                this.btnShow.editBtn = true
              } else if (btnList[i].pri_funname === '删除') {
                this.btnShow.delBtn = true
              } else if (btnList[i].pri_funname === '启用') {
                this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === '停用') {
                this.btnShow.stopBtn = true
              }
            }
          }
          loading.close()
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败!')
          // console.log("获取列表err", err);
        })
    },
    // 搜索
    searchList(formName, page) {
      const search = this.formList
      // console.log('---', search)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
     if (search.acl_state === "全部" || search.acl_state === 0) {
        search.acl_state = ''
      } 
      if (search.acl_type === "全部" || search.acl_type === 0) {
        search.acl_type = ''
      } 
      search.pri_id = this.$route.meta.pri_id
      search.page = page
      // 获取列表
      AgriClassList(search)
        .then(response => {
          // console.log('获取列表', response)
          const dataRep = response.data
          // console.log('获取列表---', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            this.search_req = true
          }
          loading.close()
        })
        .catch(Error => {
          loading.close()
          this.$message.error('获取列表失败')
        })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 启用
    enableClas() {
      const list = this.list
      const chosed = this.chosed
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要启用的农资品类!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].acl_state === 2) {
            id.push(chosed[i].acl_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.acl_id = id
          data.adm_id = getUserid()
          this.$confirm('请确认,是否启用选中的农资品类?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              AgriClassStart(data)
                .then(response => {
                  // console.log('addAgriClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].acl_id) {
                          list[j].acl_state = 1
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的农资品类err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中农资品类的状态全部为'启用'?", '提示', {
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
        this.$message.error('请选择要停用的农资品类!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].acl_state === 1) {
            id.push(chosed[i].acl_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.acl_id = id
          data.adm_id = getUserid()
          this.$confirm('请确认,是否停用选中的农资品类?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              AgriClassStop(data)
                .then(response => {
                  // console.log('addAgriClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].acl_id) {
                          list[j].acl_state = 2
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的农资品类err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中农资品类的状态全部为 '停用' ?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      // console.log('---', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的农资品类!')
      } else {
        const data = {}
        data.acl_id = []
        for (const i in chosed) {
          data.acl_id.push(chosed[i].acl_id)
        }
        this.$confirm('请确认,是否删除所选中的农资品类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAgriClass(data)
            .then(response => {
              // console.log('delAgriClass---', response)
              if (errorStatus(response.data)) {
                if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=this.currentPage-1
                }
                this.getPageInfo()
                this.$message.success('删除成功!')
              }
            })
            .catch(Error => {
              this.$message.error('请求失败')
            })
        })
      }
    },
    // 启用--这个--停用
    enableThisClas(row, num) {
      const data = {}
      data.acl_id = [row.acl_id]
      data.adm_id = getUserid()
      // console.log("num", num);
      // console.log("data", data);
      if (num === 1) {
        // 启用
        AgriClassStart(data)
          .then(response => {
            // console.log("AgriClassStart---", response);
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.acl_state = num
            }
          })
          .catch(Error => {
            // console.log("启用的农资品类err", err);
            this.$message.error('启用失败!')
          })
      } else {
        // 停用
        AgriClassStop(data)
          .then(response => {
            // console.log("AgriClassStop---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.acl_state = num
            }
          })
          .catch(Error => {
            // console.log("停用的农资品类err", err);
            this.$message.error('停用失败!')
          })
      }
    },
    // 删除-这个
    delBtn(row) {
      const data = {}
      // console.log('删除--', row)
      data.acl_id = [row.acl_id]
      data.adm_id = getUserid()
      this.$confirm('请确认,是否删除该农资品类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAgriClass(data)
          .then(response => {
            // console.log('delAgriClass---', response)
            if (errorStatus(response.data)) {
              this.$message.success('删除成功!')
              if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=this.currentPage-1
              }
              this.getPageInfo()
            }
          })
          .catch(Error => {
            // console.log("停用的农资品类err", err);
            this.$message.error('删除请求失败!')
          })
      })
    },
    // 新增-
    addClasClick() {
      this.addClaSta = 1
      this.showAddClas = true
      this.AddClastitle = '新增农资品类'
    },
    // 编辑
    editClas(row) {
      this.addClaForm.acl_name = row.acl_name
      this.addClaForm.acl_id = row.acl_id
      this.addClaForm.acl_state=row.acl_state
      this.addClaForm.acl_type=row.acl_type
      // console.log('1111', row)
      this.showAddClas = true
      this.addClaSta = 2
      this.AddClastitle = '编辑农资品类'
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
    // 页面--分页器
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      if (this.search_req) {
        this.searchList('formList', val)
      } else {
        this.getPageInfo()
      }
    },
    blurClass(e) {
      const val = e.target.value
      if (getByteLen(val) > 12) {
        this.$message.error('农资品类过长,汉字10个字以内,英文20字符以内!')
        return false
      }
    },

    // 弹窗-增加-提交
    addsubBtn(formName) {
      // console.log('login--', this.addClaForm)
      const addClas = this.addClaForm
      const addClaSta = this.addClaSta

      if (addClas.acl_name === '') {
        this.$message.error('请输入农资品类!')
        return false
      } else {
        if (getByteLen(addClas.acl_name) > 20) {
          this.$message.error('农资品类名称过长,汉字10个字以内,英文20字符以内!')
          return false
        }
        // console.log('data---addClas', addClas)
        if (addClaSta === 1) {
          // delete addClas.acl_id
          addAgriClass(addClas)
            .then(response => {
              // console.log('addAgriClass---', response)
              if (errorStatus(response.data)) {
                this.$message.success('提交成功!')
                this.showAddClas = false
                this.$refs[formName].resetFields()
                this.addClaForm.acl_name = ''
                this.addClaForm.acl_id = ''
                this.addClaForm.acl_type=''
                this.addClaForm.acl_state=''
                this.getPageInfo()
              }
            })
            .catch(err => {
              console.log('err', err)
              this.$message.error('请求失败!')
            })
        } else if (addClaSta === 2) {
          editAgriClass(addClas)
            .then(response => {
              // console.log('editAgriClass---', response)
              if (errorStatus(response.data)) {
                this.$message.success('提交成功!')
                this.showAddClas = false
                this.$refs[formName].resetFields()
                this.addClaForm.acl_name = ''
                this.addClaForm.acl_id = ''
                this.addClaForm.acl_type=''
                this.addClaForm.acl_state=''
                this.getPageInfo()
              }
            })
            .catch(err => {
              console.log('err', err)
              this.$message.error('请求失败!')
            })
        }
      }
    },
    cancleForm(formName) {
      this.showAddClas = false
      this.$refs[formName].resetFields()
      this.addClaForm.acl_name = ''
      this.addClaForm.acl_id = ''
      this.addClaForm.acl_type=''
      this.addClaForm.acl_state=''
      
    }
  }
}
</script>
<style scoped >
.bdRed .el-form-item__content .el-input .el-input__inner {
  border: 1px solid red !important;
}
</style>
