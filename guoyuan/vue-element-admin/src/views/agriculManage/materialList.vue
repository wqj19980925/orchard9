<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">农资列表</div>
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
            <el-form-item label="农资名称:" class="sd-form-item" prop="agr_name">
              <el-input v-model="formList.agr_name" placeholder="请输入农资名称"/>
            </el-form-item>
          </el-col>
           <el-col :span="4" class="sd-col-6">
            <el-form-item label="农资品类:" class="sd-form-item" prop="agr_class">
              <el-select v-model="formList.agr_class" class style="width:120px;">
                <el-option v-for="item in classlist":key="item.acl_id":label="item.acl_name":value="item.acl_id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="sd-col-6">
            <el-form-item label="状态:" class="sd-form-item" prop="agr_state">
              <el-select v-model="formList.agr_state" class style="width:120px;">
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
          <el-table-column label="农资名称" prop="agr_name" min-width align="center"/>
          <el-table-column label="农资品类" prop="acl_name" min-width align="center"/>
          <el-table-column label="类型" prop="acl_type" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.acl_type == 1">消耗性投入品</div>
              <div v-else>固定资产</div>
            </template>
          </el-table-column>
          <el-table-column label="库存数量" prop="surplus" align="center"/>
          <el-table-column label="状态" prop="agr_state" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.agr_state == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" align="center">
            <template slot-scope="scope">
              <div>
                <el-button  v-if="btnShow.editBtn"  size="mini"class="btn-mainCol"@click="editClas(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.agr_state == 1 && btnShow.stopBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)"> 停用
                </el-button>
                <el-button v-if="scope.row.agr_state == 2 && btnShow.startBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)"> 启用
                </el-button>
                <el-button  v-if="btnShow.delBtn" size="mini"class="btn-delete"@click="delBtn(scope.row)">删除</el-button>
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
        <el-form-item :class="errInpt?'bdRed':''" label="农资名称" prop="agr_name">
          <el-input v-model="addClaForm.agr_name"style="width:200px;"placeholder="请输入农资名称"maxlength="20"/>
        </el-form-item>
         <el-form-item label="单位" prop="agr_unit">
          <el-select v-model="addClaForm.agr_unit" class>
            <el-option v-for="item in unitlist" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="农资品类" prop="acl_name">
          <el-select v-model="addClaForm.agr_class" class>
            <el-option v-for="item in classlistno" :key="item.acl_id" :label="item.acl_name" :value="item.acl_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="agr_state" style="width:300px">
          <el-select v-model="addClaForm.agr_state" class>
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
import { AgriList, addAgric, editAgric, delAgric, AgricStart, AgricStop ,searchAgric } from '@/api/agriculManage'
import { errorStatus } from '@/utils/index'
import { getByteLen } from '@/utils/validate'
export default {
  name: 'ClassList',
  data() {
    return {
      classlistno:[],
      formList: {
        agr_name: '',
        agr_state: '',
        acl_type:'',
        agr_class:'全部'
      },
      rules_sech: {
        acl_name: [],
        agr_state: []
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
      classlist:[],
      chosed: '',
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addClaSta: null, // 判断是新增还是编辑 1新增 2编辑
      addClaForm: {
        agr_class:null,
        agr_id:null,
        agr_state:null,
        agr_name:null,
        agr_unit:null
      },
      unitlist: [{ id: 1, name: '个' }, { id: 2, name: 'kg' }],
      diaState: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      diaType: [{ id: 1, name: '消耗性投入品' }, { id: 2, name: '固定资产' }],
      addClaRules: {
        agr_name: [
          { required: true, trigger: 'blur', message: '农资名称不能为空' }
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
      this.getPageInfo();
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
    this.formList.agr_state = this.state[0].name
    this.formList.acl_type = this.matertype[0].name
    this.matClass();
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
      AgriList(data)
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
    //品类
    matClass(){
      const data={}
      searchAgric(data).then(response=>{
        const dataRep=response.data
        if(errorStatus(dataRep)){
            this.classlist=dataRep.data_info
            const gos = { acl_id: 0, acl_name: '全部' }
            this.classlist.unshift(gos)
            this.formList.agr_class = this.classlist[0].acl_name   
          // this.classlist.splice(0,0,'ttt') 
           
        }
      }).catch(Error => {
          this.$message.error('请求失败')
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
     if (search.agr_state === "全部" || search.agr_state === 0) {
        search.agr_state = ''
      } 
      if (search.acl_type === "全部" || search.acl_type === 0) {
        search.acl_type = ''
      } 
      if (search.agr_class === "全部" || search.agr_class === 0) {
        search.agr_class = ''
      } 
      search.pri_id = this.$route.meta.pri_id
      search.page = page
      // 获取列表
      AgriList(search)
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
        this.$message.error('请选择要启用的农资!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].agr_state === 2) {
            id.push(chosed[i].agr_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.agr_id = id
          this.$confirm('请确认,是否启用选中的农资?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              AgricStart(data)
                .then(response => {
                  // console.log('addAgric---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].agr_id) {
                          list[j].agr_state = 1
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的农资err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中农资的状态全部为'启用'?", '提示', {
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
        this.$message.error('请选择要停用的农资!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].agr_state === 1) {
            id.push(chosed[i].agr_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.agr_id = id
          this.$confirm('请确认,是否停用选中的农资?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              AgricStop(data)
                .then(response => {
                  // console.log('addAgric---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].agr_id) {
                          list[j].agr_state = 2
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的农资err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中农资的状态全部为 '停用' ?", '提示', {
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
        this.$message.error('请选择要删除的农资!')
      } else {
        const data = {}
        data.agr_id = []
        for (const i in chosed) {
          data.agr_id.push(chosed[i].agr_id)
        }
        this.$confirm('请确认,是否删除所选中的农资?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAgric(data)
            .then(response => {
              // console.log('delAgric---', response)
              if (errorStatus(response.data)) {
                this.getPageInfo()
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
    // 启用--这个--停用
    enableThisClas(row, num) {
      const data = {}
      data.agr_id = [row.agr_id]
      // console.log("num", num);
      // console.log("data", data);
      if (num === 1) {
        // 启用
        AgricStart(data)
          .then(response => {
            // console.log("AgricStart---", response);
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.agr_state = num
            }
          })
          .catch(Error => {
            // console.log("启用的农资err", err);
            this.$message.error('启用失败!')
          })
      } else {
        // 停用
        AgricStop(data)
          .then(response => {
            // console.log("AgricStop---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.agr_state = num
            }
          })
          .catch(Error => {
            // console.log("停用的农资err", err);
            this.$message.error('停用失败!')
          })
      }
    },
    // 删除-这个
    delBtn(row) {
      const data = {}
      // console.log('删除--', row)
      data.agr_id = [row.agr_id]
      this.$confirm('请确认,是否删除该农资?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAgric(data)
          .then(response => {
            // console.log('delAgric---', response)
            if (errorStatus(response.data)) {
              this.$message.success('删除成功!')
              if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=this.currentPage-1
              }
              this.getPageInfo()
            }
          })
          .catch(Error => {
            // console.log("停用的农资err", err);
            this.$message.error('删除请求失败!')
          })
      })
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
    // 新增
    addClasClick() {
      this.addClaSta = 1
      this.showAddClas = true
      this.AddClastitle = '新增农资'
      // delete this.classlist[0]  

      if(this.classlist[0].acl_name==='全部'){//先删除全部选项,关闭窗口后再加回来
        this.$delete(this.classlist,0)
      }
      this.classlistno = this.classlist
    },
    // 编辑
    editClas(row) {
      this.addClaForm.agr_name = row.agr_name
      this.addClaForm.agr_id = row.agr_id
      this.addClaForm.agr_state=row.agr_state
      this.addClaForm.agr_class=row.acl_id
      this.addClaForm.agr_unit=row.agr_unit
      this.classlistno = this.classlist
      // console.log('1111', row)
      this.showAddClas = true
      this.addClaSta = 2
      this.AddClastitle = '编辑农资'
    },
    // 弹窗-增加-提交
    addsubBtn(formName) {
      // console.log('login--', this.addClaForm)
      const addClas = this.addClaForm
      const addClaSta = this.addClaSta
      const data ={}
      data.agr_name=this.addClaForm.agr_name
      data.agr_class=this.addClaForm.agr_class
      data.agr_state =this.addClaForm.agr_state
      data.agr_unit =this.addClaForm.agr_unit
      if (addClas.agr_name === '') {
        this.$message.error('请输入农资名称!')
        return false
      } else {
        // console.log('data---addClas', addClas)
        if (addClaSta === 1) {
          // delete addClas.acl_id
          addAgric(data)
            .then(response => {
              // console.log('addAgric---', response)
              if (errorStatus(response.data)) {
                this.$message.success('提交成功!')
                this.showAddClas = false
                this.$refs[formName].resetFields()
                this.addClaForm.acl_name = ''
                this.addClaForm.agr_id = ''
                this.getPageInfo()
                
                if(this.classlist[0].acl_name!=='全部'){
                  const gos = { acl_id: 0, acl_name: '全部' }
                  this.classlist.unshift(gos)
                }
              }
            })
            .catch(err => {
              console.log('err', err)
              this.$message.error('请求失败!')
            })
        } else if (addClaSta === 2) {
          data.agr_id=this.addClaForm.agr_id
          editAgric(data)
            .then(response => {
              // console.log('editAgric---', response)
              if (errorStatus(response.data)) {
                this.$message.success('提交成功!')
                this.showAddClas = false
                this.$refs[formName].resetFields()
                this.addClaForm.acl_name = ''
                this.addClaForm.agr_id = ''
                this.getPageInfo()
                if(this.classlist[0].acl_name!=='全部'){
                  const gos = { acl_id: 0, acl_name: '全部' }
                  this.classlist.unshift(gos)
                }
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
      this.addClaForm.agr_class = ''
      this.addClaForm.agr_name = ''
      this.addClaForm.agr_id = ''
      this.addClaForm.agr_state = ''
      this.addClaForm.agr_unit = ''
      if(this.classlist[0].acl_name!=='全部'){
        const gos = { acl_id: 0, acl_name: '全部' }
        this.classlist.unshift(gos)
      }

    }
  }
}
</script>
<style scoped >
.bdRed .el-form-item__content .el-input .el-input__inner {
  border: 1px solid red !important;
}
</style>
