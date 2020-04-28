<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">渠道标签</div>
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
            <el-form-item label="渠道标签:" class="sd-form-item" prop="dla_name">
              <el-input v-model="formList.dla_name" placeholder="请输入渠道标签"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="sd-col-6">
            <el-form-item label="状态:" class="sd-form-item" prop="dla_state">
              <el-select v-model="formList.dla_state" class style="width:120px;">
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="pl-50 fr w250"  >
            <el-button class type="primary" @click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list" width="100%" @selection-change="handleSelectionChange">
          <el-table-column  type="selection" width="55"/>
          <!-- <el-table-column prop='id' width='0'></el-table-column> -->
          <el-table-column label="渠道标签" prop="dla_name" min-width align="center"/>
          <el-table-column label="下属渠道数量" prop="dla_total" min-width align="center"/>
          <el-table-column label="状态" prop="dla_state" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.dla_state == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" align="center">
            <template slot-scope="scope">
              <div>
                <el-button v-if="btnShow.editBtn" size="mini"class="btn-mainCol"@click="editClas(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.dla_state == 1 && btnShow.stopBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)"> 停用
                </el-button>
                <el-button v-if="scope.row.dla_state == 2 && btnShow.startBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)"> 启用
                </el-button>
                 <el-button v-if="btnShow.delBtn" size="mini"class="btn-delete"@click="delBtn(scope.row)">删除</el-button>
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
    <el-dialog :visible.sync="showAddClas":title="AddClastitle":close-on-click-modal="false"width="450px"@close="cancleForm('addClaForm')">
      <el-form :inline="true" ref="addClaForm" :model="addClaForm" :rules="addClaRules" label-width="120px">
        <el-form-item :class="errInpt?'bdRed':''" label="渠道标签名称" prop="dla_name">
          <el-input v-model="addClaForm.dla_name"style="width:200px;"placeholder="请输入渠道标签名称"maxlength="20" @blur="blurClass($event)"/>
        </el-form-item>
        <el-form-item label="状态" prop="type" >
          <el-select v-model="addClaForm.dla_state" class>
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
import { labelList, addLabel, editLabel, delLabel, labelStart, labelStop } from '@/api/channelManage'
import { errorStatus } from '@/utils/index'
import { getByteLen } from '@/utils/validate'
export default {
  name: 'ClassList',
  data() {
    return {
      formList: {
       dla_name:'',
       dla_state:''
      },
      rules_sech: {
         dla_name:[],
         dla_state:[]
      },
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      diaState: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      list: [],
      classlist:[],
      chosed: '',
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addClaSta: null, // 判断是新增还是编辑 1新增 2编辑
      addClaForm: {
        dla_id:null,
        dla_name:null,
        dla_name:null
      },
      diaType: [{ id: 1, name: '砧木' }, { id: 2, name: '芽枝' }],
      addClaRules: {
        dla_name: [
          { required: true, trigger: 'blur', message: '渠道标签名称不能为空' }
          // { min: 1, max: 20, message: '渠道标签名称过长,字数不可超过20', trigger: 'blur' }
        ]
      },
      AddClastitle: '',
      search_req: false,
      btnShow: {
        addBtn: false,
        editBtn: false,
        startBtn: false,
        stopBtn: false,
        delBtn:false
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
    this.formList.dla_state = this.state[0].name
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
      labelList(data)
        .then(response => {
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            this.search_req = false
            const btnList = dataRep.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '新增') {
                this.btnShow.addBtn = true
              } else if (btnList[i].pri_funname === '编辑') {
                this.btnShow.editBtn = true
              } else if (btnList[i].pri_funname === '启用') {
                this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === '停用') {
                this.btnShow.stopBtn = true
              } else if (btnList[i].pri_funname === '删除') {
                this.btnShow.delBtn = true
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
     if (search.dla_state === "全部" || search.dla_state === 0) {
        search.dla_state = ''
      } 
      search.pri_id = this.$route.meta.pri_id
      search.page = page
      // 获取列表
      labelList(search)
        .then(response => {
          // console.log('获取列表', response)
          const dataRep = response.data
          // console.log('获取列表---', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
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
        this.$message.error('请选择要启用的渠道标签!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].dla_state === 2) {
            id.push(chosed[i].dla_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.dla_id = id
          this.$confirm('请确认,是否启用选中的渠道标签?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              labelStart(data)
                .then(response => {
                  // console.log('addLabel---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].dla_id) {
                          list[j].dla_state = 1
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的渠道标签err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中渠道标签的状态全部为'启用'?", '提示', {
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
        this.$message.error('请选择要停用的渠道标签!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].dla_state === 1) {
            id.push(chosed[i].dla_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.dla_id = id
          this.$confirm('请确认,是否停用选中的渠道标签?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              labelStop(data)
                .then(response => {
                  // console.log('addLabel---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].dla_id) {
                          list[j].dla_state = 2
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的渠道标签err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中渠道标签的状态全部为 '停用' ?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    // 启用--这个--停用
    enableThisClas(row, num) {
      const data = {}
      data.dla_id = [row.dla_id]
      // console.log("num", num);
      // console.log("data", data);
      if (num === 1) {
        // 启用
        labelStart(data)
          .then(response => {
            // console.log("labelStart---", response);
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.dla_state = num
            }
          })
          .catch(Error => {
            // console.log("启用的渠道标签err", err);
            this.$message.error('启用失败!')
          })
      } else {
        // 停用
        labelStop(data)
          .then(response => {
            // console.log("labelStop---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.dla_state = num
            }
          })
          .catch(Error => {
            // console.log("停用的渠道标签err", err);
            this.$message.error('停用失败!')
          })
      }
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
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      // console.log('---', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的渠道标签!')
      } else {
        const data = {}
        data.dla_id = []
        for (const i in chosed) {
          data.dla_id.push(chosed[i].dla_id)
        }
        this.$confirm('请确认,是否删除所选中的渠道标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delLabel(data)
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
              this.$message.error('请求失败')
            })
        })
      }
    },
     // 删除-这个
    delBtn(row) {
      const data = {}
      // console.log('删除--', row)
      data.dla_id = [row.dla_id]
      this.$confirm('请确认,是否删除该渠道标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLabel(data)
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
            // console.log("停用的渠道标签err", err);
            this.$message.error('删除请求失败!')
          })
      })
    },
    // 新增
    addClasClick() {
      
      this.addClaSta = 1
      this.showAddClas = true
      this.AddClastitle = '新增标签'

    },
    // 编辑
    editClas(row) {
      this.addClaForm.dla_id = row.dla_id
      this.addClaForm.dla_state=row.dla_state
      this.addClaForm.dla_name=row.dla_name
      // console.log('1111', row)
      this.showAddClas = true
      this.addClaSta = 2
      this.AddClastitle = '编辑标签'
    },
    // 弹窗-增加-提交
    addsubBtn(formName) {
      // console.log('login--', this.addClaForm)
      const addClas = this.addClaForm
      const addClaSta = this.addClaSta
      if (addClas.dla_name === '') {
        this.$message.error('请输入渠道标签名称!')
        return false
      } else {
        // console.log('data---addClas', addClas)
        if (addClaSta === 1) {
          // delete addClas.acl_id
          addLabel(addClas)
            .then(response => {
              // console.log('addLabel---', response)
              if (errorStatus(response.data)) {
                this.$message.success('提交成功!')
                this.showAddClas = false
                this.$refs[formName].resetFields()
                this.addClaForm.dla_name = ''
                this.addClaForm.dla_id = ''
                this.getPageInfo()
              }
            })
            .catch(err => {
              console.log('err', err)
              this.$message.error('请求失败!')
            })
        } else if (addClaSta === 2) {
          editLabel(addClas)
            .then(response => {
              // console.log('editLabel---', response)
              if (errorStatus(response.data)) {
                this.$message.success('提交成功!')
                this.showAddClas = false
                this.$refs[formName].resetFields()
                this.addClaForm.dla_name = ''
                this.addClaForm.dla_id = ''
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
      this.addClaForm.dla_name = ''
      this.addClaForm.dla_id = ''
    }
  }
}
</script>
<style scoped >
.bdRed .el-form-item__content .el-input .el-input__inner {
  border: 1px solid red !important;
}
</style>
