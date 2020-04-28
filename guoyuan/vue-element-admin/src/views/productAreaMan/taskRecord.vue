<!--溯源列表-->
<template>
  <!--外部整体盒子-->
  <div class="app-container">
    <!--信息筛选-->
    <el-row
      class="sd-module-box"
    >
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">任务记录</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.exportBtn" class="btn-mainCol"@click="exportsthis()">导出</el-button> 
        </div>      
      </div>
      <el-form ref="formList":model="formList":rules="formRules"class="sd-form-box clearfix"size="medium"label-width="100px">
       <el-row class="clearfix">
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="生产编号"class="sd-form-item"prop="task_number">
              <el-input v-model="formList.task_number"class placeholder="请输入任务区域" clearable/>
            </el-form-item>
          </el-col>
           <el-col :span="5"class="sd-col-6">
            <el-form-item label="发布对象"class="sd-form-item"prop="task_object">
              <el-input v-model="formList.task_object"class placeholder="请输入发布对象" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="任务名称"class="sd-form-item"prop="task_name">
              <el-input v-model="formList.task_name"class placeholder="请输入任务名称" clearable/>
            </el-form-item>
          </el-col>
           <el-col :span="5"class="sd-col-6">
            <el-form-item label="发布人"class="sd-form-item"prop="task_adm_name">
              <el-input v-model="formList.task_adm_name"class placeholder="请输入发布人" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="任务内容"class="sd-form-item"prop="task_content">
              <el-input v-model="formList.task_content"class placeholder="请输入任务内容" clearable/>
            </el-form-item>
          </el-col>
         
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="状态"prop="task_state">
              <el-select v-model="formList.task_state"placeholder class="form-ipt-sed"style="width:120px;">
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <div class="plr-20 fr">
            <el-button class type="primary"@click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button> 
          </div>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list"stripe style="width: 100%"highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection"width="55"/>
          <el-table-column label="生产编号"min-width prop="task_number"align="center"/>
          <el-table-column label="发布对象"min-width prop="task_object"align="center"/>
          <el-table-column label="任务信息"min-width align="center">
             <template slot-scope="scope">
              <div align="left">
                <p>任务名称：{{scope.row.task_name}}</p>
                <p>溯源操作：{{scope.row.task_issue_time}}</p>
                <p>任务内容：{{scope.row.task_content}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="时间"min-width align="center">
              <template slot-scope="scope">
                <p>新增时间：{{scope.row.task_create_time}}</p>
                <p>发布时间：{{scope.row.task_issue_time}}</p>
                <p>完成时间：{{scope.row.task_achieve_time}}</p>
            </template>
          </el-table-column>
          <el-table-column label="发布人"min-width prop="task_adm_name"align="center"/>
          <el-table-column label="状态"min-width align="center" width="70">
            <template slot-scope="scope">
              <div v-if="scope.row.task_state === 1">未发布</div>
              <div v-if="scope.row.task_state === 2">发布</div>
              <div v-if="scope.row.task_state === 3">加急</div>
               <div v-if="scope.row.task_state === 4">完成</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"width="150"prop align="center" >
            <template slot-scope="scope">
              <el-button v-if="scope.row.task_state === 4 && btnShow.repubBtn" class="btn-mainCol"size="mini"@click="Release(scope.row)">
                再次发布
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0"class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
    </el-row>
    <a :href="exportUrl"id='exportFile'style='display:none;'></a>
  </div>
</template>
<script>
import { taskRecList, exportTaskRec, againTaskRec } from '@/api/productAreaMan'
import { errorStatus } from '@/utils/index'
import Agricultasks from './Agricultasks'
export default {
  name: 'TraceList',
  components: { Agricultasks },
  data() {
    return {
      exportUrl:'',
      edit_id: 0,
      formList: {
        start_time: '',
        end_time: '',
        tem_title: '',
        fom_name: '',
        fla_name: '',
        task_state: '',
        task_adm_name:''
      },
      formRules: {
        fom_title: [],
        task_state: []
      },
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '未发布' },
        { id: 2, name: '发布' },
        { id: 3, name: '加急' },
        { id: 4, name: '完成' }
      ],
      list: [],
      chosed: [],
      search_req: false,
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      btnShow: {}
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
    this.formList.task_state = this.state[0].name
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
      data.pri_id = this.$route.meta.pri_id
      data.page = this.currentPage
      taskRecList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表----', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            const btnList = dataRep.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '再次发布') {
                this.$set(this.btnShow, 'repubBtn', true)
              } else if (btnList[i].pri_funname === '导出') {
                this.$set(this.btnShow, 'exportBtn', true)
              }
            }
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败!')
        })
    },
    // 搜索
    searchList(formName, num) {
      const search = this.formList
      if (search.task_state === '全部' || search.task_state === 0) {
        search.task_state = ''
      }
      search.page = num
      search.pri_id = this.$route.meta.pri_id
      // console.log('----', search)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      taskRecList(search).then(response => {
        const dataRep = response.data
        if (errorStatus(dataRep)) {
          loading.close()
          // console.log('----', dataRep)
          this.list = dataRep.data_info.data
          this.currentPage = dataRep.data_info.current_page
          this.pageSize = dataRep.data_info.current_number
          this.totalNum = dataRep.data_info.total
        }
      }).catch(Error => {
        loading.close()
      })
    },
    Release(row){
      const data = {}
      const task_id = []
      task_id.push(row.task_id)
      data.task_id = task_id
      // console.log('删除---', data)
      this.$confirm('请确认,是否再次发布当前选中记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        againTaskRec(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.getPageInfo()
                this.$confirm('操作成功!如有内容需修改,点击确定前往农事任务列表','提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    // this.showList=false
                    this.$router.push('./FarmingTaskindex');
                })
            }
          })
          .catch(Error => {
            this.$message.error('请求失败')
          })
      })
    },
     //导出
    exportsthis() {
      const url = process.env.BASE_API
      const baseUrl=url.replace('/public','/')
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要导出的任务记录!')
      } else {
        const data = {}
        data.task_id = []
        for (const i in chosed) {
          data.task_id.push(chosed[i].task_id)
        }
        this.$confirm('请确认,是否导出选中记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportTaskRec(data)
            .then(response => {
              // console.log('delgo---', response)
              if (errorStatus(response.data)) {
                const str=response.data.data_info
                this.exportUrl=baseUrl+str
                this.clickABtn()
              }
            })
            .catch(Error => {
              this.$message.error('请求失败')
            })
        })
      }
    },
    clickABtn(){
      // console.log("url--",this.exportUrl)
      // return false
       setTimeout(() => {
        document.getElementById('exportFile').click();
      }, 1000)
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },

    // 重置
    resetForm(formName) {
      // console.log("--")
      this.$refs[formName].resetFields()
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

  }
}
</script>

<style>
</style>
