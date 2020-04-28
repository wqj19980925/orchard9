<template>
  <div class="app-orderLists">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">销售平台</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol"@click="addYunCang()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn"@click="enable('',0)">启用</el-button>
          <el-button v-if="btnShow.stopBtn"class="stopCol-btn"@click="unenable('',0)">停用</el-button>
          <el-button v-if="btnShow.exporBtn"@click="outEXcal">导出</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delChoseBtn()">删除</el-button>
          <!-- <a
            v-if="formList.name !== ''&&btnShow.exporBtn"
            :href="api_url"
            class="outa-btn"
          >
            <el-button>导出</el-button>
          </a> -->
        </div>
      </div>
      <div class="lk-table-box">
        <el-table :data="list"width="100%"@selection-change="handleSelectionChange"@sort-change="sortChang">
          <el-table-column type="selection"width="55"prop="id"/> 
          <el-table-column label="添加时间"prop="plat_create_time"align="center"/>
          <el-table-column label="销售平台"prop="plat_name"align="center"/>
          <el-table-column label="订单量"prop="plat_number"align="center"/>
          <el-table-column label="订单金额"prop="plat_money"align="center"/>
          <el-table-column label="状态"prop="state"align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.plat_state == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"align="center">
            <template slot-scope="scope" >
              <el-button v-if="btnShow.editBtn" class="btn-mainCol"size="mini"@click="compile(scope)">编辑</el-button>
              <el-button v-if="scope.row.plat_state == 1 && btnShow.stopBtn "class=" stopCol-btn"size="mini"@click="unenable(scope,1)">停用</el-button>
              <el-button v-if="scope.row.plat_state !== 1 && btnShow.startBtn"class="openCol-btn"size="mini"@click="enable(scope,1)">启用</el-button>
              <el-button v-if="btnShow.delBtn"  class="btn-delete"size="mini"@click="delplat(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0" class="lk-page-box">
        <el-pagination :current-page="exitPage.current_page":page-size="exitPage.current_number":total="exitPage.total"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog :visible.sync="showAddClas":title="dialogTit":close-on-click-modal="false"width="400px"@close="addClaForm('addCla')">
      <el-form ref="addCla":model="addCla":rules="rulesCla"label-width="80px">
        <el-form-item label="销售平台"prop="ware_name">
          <el-input maxlength="15"v-model="addCla.ware_name"class="labelwidth"placeholder="请输入销售平台"/>
        </el-form-item> 
        <el-form-item label="状态"prop="type"class="sd-form-item"> 
          <el-select v-model="addCla.type"class="labelwidth" > 
            <el-option v-for="item in type1":key="item.id":label="item.name":value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addClaForm('addCla')">取 消</el-button>
        <el-button v-if="edit"type="primary"@click="addeditBtn('addCla')">确 定</el-button> 
        <el-button v-else type="primary"@click="addsubBtn('addCla')">确 定</el-button>
      </span>
    </el-dialog>
     <a :href="expoUrl"id='expClic'></a> 
   </div>
</template>
<script>
import { platindex, startstase, platdel,shopstase, platadd, platedit,platimpt } from '@/api/orderAdmin'
import { errorStatus } from '@/utils/index'
import { getToken } from '@/utils/auth'
export default {
  components: {},
  data() {
    return {
      expoUrl:'',
      formList: {// 我的云仓里的input框里的数据
        name: '',
        states: 0
      },
      chosed: [],
      list: [],
      edit: false,
      exitPage: [],
      radio: [],
      showAddClas: false,
      addCla: {
        ware_name: null, // 名称
        type: null, // 类型
        plat_id: null
      },
      derive: [],
      type: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      type1: [
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      // api_url: '',
      sortOrder: '',
      sortProp: '',
      rulesCla: {
        ware_name: [
          { required: true, message: '请输入销售平台', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      currentPage: 1,
      btnShow: {},
      seachData: false,
      dialogTit: '新增'
    }
  },
  created() {
    this.addCla.type = this.type1.name
    // 页面加载时
    this.getSalesInfo()
  },
  methods: {
    getSalesInfo() {
      const that = this
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const url = process.env.BASE_API;
      this.baseUrl = url.replace('/public', '/');
      const data = {}
      data.sort = that.sortProp
      data.rank = that.sortOrder
      data.plat_name = that.formList.name
      data.plat_state = that.formList.states
      data.pri_id = this.$route.meta.pri_id
      data.page = this.currentPage
      // 搜索仓库
      // console.log(data)
      platindex(data)
        .then(response => {
          // console.log(response)
          if (errorStatus(response.data)) {
            that.list = response.data.data_info.data
            that.exitPage = response.data.data_info
            const btnList = response.data.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '新增') {
                this.$set(this.btnShow, 'addBtn', true)
                // this.btnShow.codeBtn = true
              } else if (btnList[i].pri_funname === '编辑') {
                this.$set(this.btnShow, 'editBtn', true)
                // this.btnShow.downlBtn = true
              } else if (btnList[i].pri_funname === '导出') {
                // this.btnShow.derivBtn = true
                this.$set(this.btnShow, 'exporBtn', true)
              } else if (btnList[i].pri_funname === '启用') {
                this.$set(this.btnShow, 'startBtn', true)
                // this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === '停用') {
                this.$set(this.btnShow, 'stopBtn', true)
                // this.btnShow.stopBtn = true
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(this.btnShow, 'delBtn', true)
                // this.btnShow.stopBtn = true
              }
            }
          }
          loading.close()
        })
        .catch(err => {
          loading.close()
          console.log('获取列表err', err)
        })
    },
    handleCurrentChange(val) { // 分页器的方法
      // console.log(`当前页: ${val}`)
      const seachData = this.seachData
      this.currentPage = val
      if (seachData) {
        this.searchTgoing(val)
      } else {
        this.getSalesInfo()
      }
    },
    // 添加-弹窗
    addYunCang() { // 点击我的云仓添加按钮后的操作
      this.showAddClas = true
      this.dialogTit = '新增'
      this.edit = false
      // this.$refs[addCla].resetFields()
      this.addCla.ware_name = ''
      this.addCla.type = this.type[1].name
    },
    handleSelectionChange(val) {
      // 我的云仓单选框被选中的
      const that = this
      that.radio = []
      that.derive = []
      that.chosed = val
      for (var i = 0; i < val.length; i++) {
        that.radio.push(val[i].plat_id)
        that.derive.push(val[i].plat_name)
      }
    },
    addsubBtn(label) { // 添加确定按钮后要做的操作
      // console.log(data)
      const that = this
      if (that.addCla.type === '启用') {
        that.addCla.type = 1
      }
      if (that.addCla.ware_name === '') {
        this.$message.error('请输入销售平台')
        return
      }
      const data = {}
      data.plat_name = that.addCla.ware_name
      data.plat_state = that.addCla.type
      platadd(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getSalesInfo()
            this.$message.success('新增销售平台成功!')
            this.showAddClas = false
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
    addClaForm(formName) {
      this.showAddClas = false
      this.$refs[formName].resetFields()
    },
    compile(scope) { // 编辑按钮
      this.showAddClas = true
      this.dialogTit = '编辑平台'
      this.edit = true
      // console.log(scope)
      this.addCla.ware_name = scope.row.plat_name
      this.addCla.type = scope.row.plat_state
      this.addCla.plat_id = scope.row.plat_id
    },
    // 添加--提交
    addeditBtn() {
      const that = this
      if (that.addCla.type === '启用') {
        that.addCla.type = 1
      }
      const data = {}
      if (that.addCla.ware_name === '') {
        this.$message.error('请输入销售平台')
        return false
      }
      data.plat_name = that.addCla.ware_name
      data.plat_state = that.addCla.type
      data.plat_id = that.addCla.plat_id
      platedit(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getSalesInfo()
            this.$message.success('编辑销售平台成功!')
            this.showAddClas = false
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
    // 删除-这个
    delplat(row) {
      // console.log('del---row', row)
      const data = {}
      const plat_id = []
      plat_id.push(row.plat_id)
      data.plat_id = plat_id
      // console.log('删除---', data)
      this.$confirm('请确认,是否删除所选中的平台?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        platdel(data)
          .then(response => {
            if (errorStatus(response.data)) {
              if(this.currentPage!==1 && this.list.length===1){
                this.currentPage=this.currentPage-1
              }
              this.$message.success('删除成功')
              this.getSalesInfo()
            }
          })
          .catch(Error => {
            this.$message.error('请求失败')
          })
      })
    },
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的平台!')
      } else {
        const data = {}
        data.plat_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.plat_id.push(chosed[i].plat_id)
        }
        this.$confirm('请确认,是否删除所选中的平台?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          platdel(data)
            .then(response => {
              // console.log('delgo---', response)
              if (errorStatus(response.data)) {
                if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=this.currentPage-1
                }
                this.getSalesInfo()
                this.$message.success('删除成功!')
              }
            })
            .catch(Error => {
              this.$message.error('请求失败')
            })
        })
      }
    },
    sortChang(column) {
      // console.log(column)
      if (column.order === 'ascending') {
        // console.log('ascending')
        const that = this
        if (that.sortProp === column.prop && that.sortOrder === 'asc') {
          console.log()
        } else {
          that.sortOrder = 'asc'
          that.sortProp = column.prop
          that.getSalesInfo()
        }
      } else {
        // console.log('232323232323232')
        const that = this
        if (that.sortProp === column.prop && that.sortOrder === 'desc') {
          console.log()
        } else {
          that.sortOrder = 'desc'
          that.sortProp = column.prop
          that.getSalesInfo()
        }
      }
    },
    enable(scope, judgeId) {
      const that = this
      const data = {}

      if (judgeId === 1) {
          const plat_id = []
          plat_id.push(scope.row.plat_id)
          data.plat_id = plat_id
        startstase(data)
          .then(res => {
            if (errorStatus(res.data)) {
              that.getSalesInfo()
              this.$message.success('启用成功!')
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      } else {
        if (that.radio.length === 0) {
          this.$message.error('请选择要启用的平台!')
          return false
        } else {
          const id = []
          // console.log(this.chosed)
          const choseds = this.chosed
          for (const i in choseds) {
            if (choseds[i].plat_state === 2) {
              id.push(choseds[i].plat_id)
            }
          }
          if (id.length > 0) {
            data.plat_id = id
            this.$confirm('请确认,是否启用选中的平台?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              startstase(data)
                .then(res => {
                  if (errorStatus(res.data)) {
                    that.getSalesInfo()
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('获取列表err', err)
                  this.$message.error('请求失败!')
                })
            })
              .catch(() => {
                // console.log("取消停用");
              })
          } else {
            this.$confirm("选中平台的状态全部为'启用'?", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {})
          }
        }
      }
    },
    unenable(scope, judgeId) {
      const that = this
      const data = {}
      if (judgeId === 1) {
          const plat_id = []
          plat_id.push(scope.row.plat_id)
          data.plat_id = plat_id
        shopstase(data)
          .then(res => {
            if (errorStatus(res.data)) {
              that.getSalesInfo()
              this.$message.success('停用成功!')
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      } else {
        if (that.radio.length === 0) {
          this.$message.error('请选择要停用的平台!')
        } else {
          const id = []
          // console.log(this.chosed)
          const choseds = this.chosed
          for (const i in choseds) {
            if (choseds[i].plat_state === 1) {
              id.push(choseds[i].plat_id)
            }
          }
          if (id.length > 0) {
            data.plat_id = id
            this.$confirm('请确认,是否停用选中的平台?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              shopstase(data)
                .then(res => {
                  if (errorStatus(res.data)) {
                    that.getSalesInfo()
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('获取列表err', err)
                  this.$message.error('请求失败!')
                })
            })
              .catch(() => {
                // console.log("取消停用");
              })
          } else {
            this.$confirm("选中平台的状态全部为'停用'?", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {})
          }
        }
      }
    },
    // 导出
    outEXcal() {
      const data=this.formList;
      delete data.page
      delete data.page_size
      // console.log("data--",data);
      // return false
      platimpt(data).then(response=>{
        if(errorStatus(response.data)){
          // console.log(response.data);
          // return false
        this.expoUrl=this.baseUrl+response.data.data;
        setTimeout(() => {
          document.getElementById('expClic').click();
        }, 800);
        }
      }).catch(Error=>{
        this.$message.error("请求失败")
      })
    },
  /*  resetForm() {
      this.formList = {
        name: '',
        states: 0
      }
    },
    // 搜索
    searchTgoing(page) {
      const that = this
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.sort = that.sortProp
      data.rank = that.sortOrder
      data.plat_name = that.formList.name
      data.plat_state = that.formList.states
      data.page = page
      data.pri_id = this.$route.meta.pri_id
      this.seachData = true
      // 搜索仓库
      // console.log(data)
      platindex(data)
        .then(response => {
          // console.log(response)
          if (errorStatus(response.data)) {
            that.list = response.data.data_info.data
            that.exitPage = response.data.data_info
          }
          loading.close()
        })
        .catch(err => {
          loading.close()
          console.log('获取列表err', err)
        })
    },*/
    // goodsOuturl() {
    //   const that = this
    //   // console.log(that.formList.name)
    //   const api_token = getToken()
    //   const plat_name = that.formList.name
    //   const 
    //   that.api_url = baseUrl + '/api/platform/platimpot' + '/api_token/' + api_token + '/plat_name/' + plat_name
    // }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.app-orderLists {
  padding: 20px;
  .operation-style {
    padding: 6px 4px;
    font-size: 10px;
  }
  .outa-btn {
    margin-left: 10px;
  }
  .primary-absolute {
    position: absolute;
    right: 0;
  }
}
</style>
<style>
.labelwidth{
  width:200px
}
</style>