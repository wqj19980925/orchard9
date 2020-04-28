<!--溯源列表-->
<template>
  <!--外部整体盒子-->
  <div class="app-container">
    <!--信息筛选-->
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">任务分配</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol"@click="addBtn()">新增</el-button> <!-- <el-button @click="editClas()">编辑</el-button> -->
          <el-button v-if="btnShow.publicBtn" class="openCol-btn"@click="enableClas()">发布</el-button> 
          <el-button v-if="btnShow.revokeBtn" class="stopCol-btn"@click="stopClas()">撤销</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete"@click="delChoseBtn()">删除</el-button>
          <el-button v-if="btnShow.exportBtn" class="openCol-btn"@click="exportsBtn()">导出</el-button>
        </div>      
      </div>
      <el-form ref="formList":model="formList":rules="formRules"class="sd-form-box clearfix"size="medium"label-width="100px">
       <el-row class="clearfix">
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="生产编号"class="sd-form-item"prop="task_number">
              <el-input v-model="formList.task_number"class placeholder="请输入生产编号" clearable/>
            </el-form-item>
          </el-col>
           <el-col :span="5"class="sd-col-6">
            <el-form-item label="发布对象"class="sd-form-item"prop="region_name">
              <el-input v-model="formList.region_name"class placeholder="请输入发布对象" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="任务名称"class="sd-form-item"prop="task_name">
              <el-input v-model="formList.task_name"class placeholder="请输入任务名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
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
          <el-table-column label="生产编号"min-width prop="task_number"align="center" width="180"/>
          <el-table-column label="发布对象"min-width prop="region_name"align="center"/>
          <el-table-column label="任务信息"min-width align="center" >
             <template slot-scope="scope" >
              <div align="left" >
                <p>任务名称：{{scope.row.task_name}}</p>
                <p>溯源操作：{{scope.row.tem_title}}</p>
                <p>任务内容：{{scope.row.task_content}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="时间"min-width align="center" >
              <template slot-scope="scope">
                <p>新增时间：{{scope.row.task_create_time}}</p>
                <p>发布时间：{{scope.row.task_issue_time}}</p>
                <!-- <p>完成时间：{{scope.row.task_achieve_time}}</p> -->
            </template>
          </el-table-column>
          <el-table-column label="状态"min-width align="center" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.task_state === 1">未发布</div>
              <div v-if="scope.row.task_state === 2">发布</div>
              <div v-if="scope.row.task_state === 3">加急</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"width="320"prop align="center">
            <template slot-scope="scope">
              <el-button  v-if="scope.row.task_state === 2 && btnShow.urgentBtn" class="btn-mainCol"size="mini"@click="enableThisClas(scope.row,3)">
                加急
              </el-button> 
              <el-button  v-if="scope.row.task_state === 1 && btnShow.editBtn" class="btn-secCol"size="mini"@click="editData(scope.row)">
                编辑
              </el-button>
               <el-button  v-if="scope.row.task_state === 1 && btnShow.delBtn" class="btn-secCol"size="mini"@click="delData(scope.row)">
                删除
              </el-button>
              <el-button  v-if="scope.row.task_state === 1 && btnShow.publicBtn" class="btn-secCol"size="mini"@click="enableThisClas(scope.row,1)">
                发布
              </el-button>
              <el-button  v-if="(scope.row.task_state === 2 || scope.row.task_state === 3)&& btnShow.revokeBtn " class="btn-secCol"size="mini"@click="enableThisClas(scope.row,2)">
                撤销
              </el-button> 
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0"class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
      <!-- 弹窗 -->
      <el-dialog :visible.sync="showAddClas":title="dialogTit":close-on-click-modal="false"width="650px"
      @close="addClaForm('addCla')">
        <el-form :inline="true" ref="addCla":model="addCla":rules="rulesCla"label-width="90px">
          <div style="width:100%">
            <div>任务对象</div>
            <el-form-item label="果园名称:"class="sd-form-item"prop="region_id">
              <el-select v-model="addCla.region_id"class @change="getDataInfoUp(2,addCla.region_id)" @click.native="getSelect(1)">
                <el-option v-for="item in baseList":key="item.region_id":label="item.region_name":value="item.region_id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="生产编号:"class="sd-form-item"prop="pro_number">
              <el-select v-model="addCla.pro_number"class @click.native="getSelect(5)" >
                <el-option v-for="item in proList":key="item.pro_number":label="item.pro_number":value="item.pro_number"/>
              </el-select>
            </el-form-item>
            <div class="Divisionline"></div>
            <el-form-item label="任务名称"prop="task_name" >
              <el-input v-model="addCla.task_name" style='width:500px'/>
            </el-form-item>
            <el-form-item label="任务内容"prop="task_content">
              <el-input type="textarea" :rows="3" maxlength="200" v-model="addCla.task_content" style='width:500px'placeholder="请输入任务内容"  />
            </el-form-item>
            <div v-for="(item,index) in tracDetail"class="addGods-infor-ipt clearfix">
              <el-form-item label="信息名称"prop="acreage" >
                <el-select v-model="item.tem_id"class >
                  <el-option v-for="item in temList":key="item.tem_id" :label="item.tem_title"
                  :value="item.tem_id"/>
                </el-select>
              </el-form-item>
              <el-button @click="addInfor()" > +</el-button>
              <el-button :disabled="item.disabled"icon="el-icon-delete"class="btn-delete"@click="deleteInfo(index)"/>
            </div>
          </div>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button v-if="edit"type="primary"@click="addThisBtn('addCla')">确 定</el-button>
          <el-button v-else type="primary"@click="addThisBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
     <a :href="exportUrl"id='exportFile'style='display:none;'></a>
  </div>
</template>

<script>
import { agrTaskList, addAgrTask, publishTask, urgentTask, cancelTask, exportTask, editAgrTask ,delTask} from '@/api/productAreaMan'
import { errorStatus } from '@/utils/index'
export default {
  name: 'TraceList',
  data() {
    return {
      exportUrl:'',
      dialogTit:'新增',
      editShow:0,
      type:1,
      showAddClas: false,
      edit_id: 0,
      edit:false,
      formList: {
        start_time: '',
        end_time: '',
        tem_title: '',
        fom_name: '',
        fla_name: '',
        task_state: '',
        region_name:'',
      },
      formRules: {
        fom_title: [],
        task_state: []
      },
      addCla:{
        pro_number:'',
        region_id:'',
        task_name:'',
        task_content:'',
        task_id:''
      },
      tracDetail:[{
        tem_id:''
      }
      // ,{
      //   fla_id:'',
      //   tem_id:''
      // }
      ],
      farmerList:[],
      baseList:[],
      typeList:[],
      regList:[],
      goodsList:[],
      proList:[],
      tagList:[],
      temList:[],
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '未发布' },
        { id: 2, name: '发布' },
        { id: 3, name: '加急' },
        { id: 4, name: '完成' }
      ],
      rulesCla:{},
      list: [],
      chosed: [],
      search_req: false,
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      btnShow: {},
      rolesType:1
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
    this.formList.task_state = this.state[0].name
    this.searchinfo(this.type)
    this.getDataInfoUp(1)
    this.getDataInfoUp(3)
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
      data.pri_id = this.$route.meta.pri_id
      agrTaskList(data)
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
              if (btnList[i].pri_funname === '新增') {
                this.$set(this.btnShow, 'addBtn', true)
              } else if (btnList[i].pri_funname === '编辑') {
                this.$set(this.btnShow, 'editBtn', true)
              } else if (btnList[i].pri_funname === '导出') {
                this.$set(this.btnShow, 'exportBtn', true)
              } else if (btnList[i].pri_funname === '发布') {
                this.$set(this.btnShow, 'publicBtn', true)
                // this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === '撤销') {
                this.$set(this.btnShow, 'revokeBtn', true)
                // this.btnShow.stopBtn = true
              } else if (btnList[i].pri_funname === '加急') {
                this.$set(this.btnShow, 'urgentBtn', true)
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(this.btnShow, 'delBtn', true)
              }
            }
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败!')
        })
    },
    searchinfo(type,ownid){
      const data={}
      data.type=type
      addAgrTask(data).then(response => {
        const dataRep = response.data
        if (errorStatus(dataRep)) {
          this.farmerList = dataRep.data_info.farmer
          if(this.edit){
            this.addCla.far_id=ownid
            // for(var i in this.farmerList){
            //   if(ownid===this.farmerList[i].far_id){
            //     this.addCla.far_id = this.farmerList[i].far_id
            //   }
            // }
          }
          this.tagList= dataRep.data_info.fom_label
        }
      }).catch(Error => {
         this.$message.error('请求失败!')
      })

    },
    // 搜索
    searchList(formName, num) {
      const search = this.formList
      if (search.task_state === '全部' ) {
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
      agrTaskList(search).then(response => {
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
    //新增获取信息
    getDataInfoUp(rolesType,id,index,ownid){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const search={}
      search.type=rolesType
      if(rolesType===2 && !id == ''){
         search.region_id=id  
         this.addCla.pro_number=''
         this.proList=[]
      }
      addAgrTask(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            if(rolesType===1){
              this.baseList=dataRep.data_info
              if(this.edit){
                this.addCla.region_id = ownid
              }
            }
            if(rolesType===2){
              this.proList=dataRep.data_info
              if(this.edit){
                this.showAddClas = true
                this.addCla.pro_number = ownid
              }
            }
            if(rolesType===3){
              this.temList=dataRep.data_info
              if(this.edit){
                this.tracDetail[index].tem_id=ownid
              }
            }  
          }
        })
        .catch(Error => {
          loading.close()
          // this.$message.error('请求失败')
        })
    },
    //选择
    getSelect(listType){
     if(listType === 5){
      if(this.addCla.region_id===''  || !this.addCla.region_id){
        this.$message.error('请先选择果园名称')
      }
     }
      
    },
    addThisBtn(formName){
      const data =this.addCla
      const tem_id=[]
      data.task_number=this.addCla.pro_number
      if(data.region_id==='' || !data.region_id){
        this.$message.error('请选择果园名称!')
        return false
      }
      if(data.pro_number==='' || !data.pro_number){
        this.$message.error('请选择生产编号!')
        return false
      }
      if(data.task_name===''){
        this.$message.error('请输入任务名称!')
        return false
      }
      if(data.task_content===''){
        this.$message.error('请输入任务内容!')
        return false
      }
      for(var i in this.proList){
        if(data.task_number === this.proList[i].pro_number){
          data.pro_id = this.proList[i].pro_id
        }
      }
      for (const i in this.tracDetail) {
        tem_id.push(this.tracDetail[i].tem_id)
        if(this.tracDetail[i].tem_id===''){
          this.$message.error('请选择溯源操作!')
          return false
        }
      }
      data.tem_id=tem_id
      if(this.edit){
        data.type=2
        data.task_id=this.addCla.task_id
        editAgrTask(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success(response.data.data)
              this.showAddClas=false
              this.$refs[formName].resetFields()
              this.getPageInfo()
              for(var i in this.tracDetail){
                this.tracDetail[i].tem_id=''
              }
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      }else{
        data.type=4
        addAgrTask(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success(response.data.data)
              this.showAddClas=false
              this.$refs[formName].resetFields()
              this.getPageInfo()
              for(var i in this.tracDetail){
                this.tracDetail[i].tem_id=''
              }
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      }
    },
    // 发布--这个--撤销
    enableThisClas(row, num) {
      const data = {}
      data.task_id = [row.task_id]
      if (num === 1) {
        // 发布
        publishTask(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('发布成功!')
              row.task_state = 2
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 撤销
        cancelTask(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('撤销成功!')
              row.task_state = 1
            }
          })
          .catch(Error => {
            // console.log("撤销的信息err", err);
            this.$message.error('请求失败!')
          })
      }else if (num === 3) {
        // 撤销
        urgentTask(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('加急成功!')
              row.task_state = 3
            }
          })
          .catch(Error => {
            // console.log("撤销的信息err", err);
            this.$message.error('请求失败!')
          })
      }
    },
    exportsBtn(){
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要导出的信息!')
      }else {
        const data = {}
        data.task_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.task_id.push(chosed[i].task_id)
        }
        const url = process.env.BASE_API
        const baseUrl=url.replace('/public','/')
        exportTask(data).then(response=>{
          if(errorStatus(response.data)){
            const str=response.data.data
            this.exportUrl=baseUrl+str
            this.clickABtn()
           
          }
        }).catch(Error=>{
          this.$message.error("导出请求失败")
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
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的信息!')
      } else {
        const data = {}
        data.task_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.task_id.push(chosed[i].task_id)
        }
        this.$confirm('请确认,是否删除所选中的信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTask(data)
            .then(response => {
              // console.log('delgo---', response)
              if (errorStatus(response.data)) {
                this.currentPage = 1
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
    // 删除-这个
    delData(row) {
      // console.log('del---row', row)
      const data = {}
      const task_id = []
      task_id.push(row.task_id)
      data.task_id = task_id
      // console.log('删除---', data)
      this.$confirm('请确认,是否删除所选中的信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTask(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('删除成功')
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
    },
    // 发布
    enableClas() {
      const list = this.list
      const chosed = this.chosed
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要发布的信息!')
      } else {
        const task_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].task_state === 1) {
            task_id.push(chosed[i].task_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (task_id.length > 0) {
          data.task_id = task_id
          this.$confirm('请确认,是否发布选中的信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              publishTask(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in task_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (task_id[i] === list[j].task_id) {
                          list[j].task_state = 2
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('发布成功!')
                  }
                })
                .catch(err => {
                  console.log('发布的信息err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消撤销");
            })
        } else {
          this.$confirm("选中信息的状态全部为'发布'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    // 撤销
    stopClas() {
      const list = this.list
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要撤销的信息!')
      } else {
        const task_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].task_state === 2) {
            task_id.push(chosed[i].task_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (task_id.length > 0) {
          data.task_id = task_id
          this.$confirm('请确认,是否撤销选中的信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              cancelTask(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in task_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (task_id[i] === list[j].task_id) {
                          list[j].task_state = 1
                        }
                      }
                    }
                    // console.log(list);
                    this.list = list
                    this.$message.success('撤销成功!')
                  }
                })
                .catch(err => {
                  console.log('发布的信息err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消撤销");
            })
        } else {
          this.$confirm("选中信息的状态全部为'撤销'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    addInfor() {
      const tracDetail = this.tracDetail
      const detail = {
        tem_id: ''
      }
      const leng = tracDetail.length
      this.$set(this.tracDetail, leng, detail)
    },
     // 删除
    deleteInfo(index) {
      // console.log("index---------",index)
      // const goDet = this.godsDetail
      if (index === 0) {
        this.$message.error('不可删除!')
        return false
      } else {
        this.tracDetail.splice(index, 1)
      }
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
    // 新增
    addBtn() {
      // console.log('----111')
      this.showAddClas = true
      this.dialogTit='新增'
    },
    editData(row) {
      this.edit = true;
      this.dialogTit='编辑'
      this.$nextTick(() => {
        this.addCla.task_id = row.task_id
        this.addCla.region_id = row.task_farid
        this.addCla.pro_number = row.task_number
        this.getDataInfoUp(1,'','',row.task_farid)
        this.getDataInfoUp(2,row.task_farid,'',row.task_number)//信息
        
        this.addCla.task_name = row.task_name
        this.addCla.task_content = row.task_content 
        for(var i in row.fom_temp){
          this.getDataInfoUp(3,'',i,Number(row.fom_temp[i]))//信息
          // this.tracDetail[i].tem_id=row.fom_info[i].fom_temp
        }
      })
    },
    addClaForm(formName){
      this.showAddClas=false
      for(var i in this.tracDetail){
        this.tracDetail[i].tem_id=''
      }
      for(var i in this.addCla){
        this.addCla[i]=''
      }
      this.proList=[]
     
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
    showListPages() {
      this.showList = true
      this.getPageInfo()
    }
  }
}
</script>

<style>
.Divisionline{
  margin-bottom:20px;
  border-bottom: 1px solid #ddd;
  font-size:16px
}
</style>
