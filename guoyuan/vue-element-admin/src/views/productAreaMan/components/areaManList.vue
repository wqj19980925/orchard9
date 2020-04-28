<template>
  <div class="app-container">
    <el-row class="sd-module-box" >
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">区域管理--{{areaThisList.dis_name}}</div>
        <div class="sd-module-btn">
          <el-button class="btn-mainCol"@click="exportsThis()">导出</el-button>
           <el-button  class="btn-delete"@click="backBtn()">返回</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="18"class="sd-col-6">
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="果园名称:"class="sd-form-item">
               {{areaThisList.base_name}}
              </el-form-item>
            </el-col>
             <el-col :span="8"class="sd-col-6">
              <el-form-item label="农户名称:"class="sd-form-item">
               {{areaThisList.far_name}}
              </el-form-item>
            </el-col>
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="联系电话:"class="sd-form-item">
               {{areaThisList.far_mobile}}
              </el-form-item>
            </el-col>
             <el-col :span="8"class="sd-col-6">
              <el-form-item label="产区类型:"class="sd-form-item">
                <span v-if="areaThisList.reg_type===1">耕地大田</span>
                <span v-if="areaThisList.reg_type===2">圈舍牧区</span>
                <span v-if="areaThisList.reg_type===3">鱼池水塘</span>
                <span v-if="areaThisList.reg_type===4">林区果园</span>
                <span v-if="areaThisList.reg_type===5">温室大棚</span>
              </el-form-item>
            </el-col>
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="区域名称:"class="sd-form-item">
                 {{areaThisList.dis_name}}
              </el-form-item>
            </el-col>
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="区域编号:"class="sd-form-item"prop="dis_number">
                 {{areaThisList.dis_number}}
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-col :span="24"class="sd-col-6 ">
              <a class="rightInfoWord">
                <span class="blue">检测设备:</span>{{areaThisList.dis_number}}
                <a><span class="blue">面积(㎡):</span>{{areaThisList.dis_unit}}</a>
              </a>
              <p class="rightInfoWord">
                  <span class="blue">已完成生产:</span>
                  <span v-if="areaThisList.finish">{{areaThisList.finish}}次</span>
                  <span v-else>0次</span>
                 <a>
                  <span class="blue">状态:</span>
                  <span v-if="areaThisList.dis_state==='1'">启用</span>
                  <span v-if="areaThisList.dis_state==='2'">停用</span>
                </a>
              </p>
            </el-col>
          </el-col>
        </el-row>
        <div class="Divisionline"/>
        <el-col :span="6"class="sd-col-6">
          <el-form-item prop="pop_time" label="时间:">
            <el-date-picker v-model="formList.pop_time"type="datetime"placeholder="请输入日期"class="lk-time-box" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateBefore'/>
          </el-form-item>
        </el-col>
         <el-col :span="5"class="sd-col-6">
          <el-form-item label="内容:"class="sd-form-item"prop="pop_content">
           <el-input v-model="formList.pop_content"placeholder="请输入内容" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5"class="sd-col-6">
          <el-form-item label="员工姓名:"class="sd-form-item"prop="pop_admname">
            <el-input v-model="formList.pop_admname"placeholder="请输入员工姓名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5"class="sd-col-6">
          <el-form-item label="用户名:"class="sd-form-item"prop="pop_admacc">
            <el-input v-model="formList.pop_admacc"placeholder="请输入用户名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6"class="sd-col-6">
          <el-form-item label="生产编号:"class="sd-form-item"prop="pop_number">
            <el-input v-model="formList.pop_number"placeholder="请输入生产编号" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5"class="sd-col-6">
          <el-form-item label="功能:"class="sd-form-item"prop="pop_function">
            <el-select v-model="formList.pop_function"class  filterable clearable>
              <el-option v-for="item in functionList":key="item.popid":label="item.popname":value="item.popid"/>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="5"class="sd-col-6">
          <el-form-item label="状态:"class="sd-form-item"prop="pop_state">
            <el-select v-model="formList.pop_state"class >
              <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>  
        <el-col class="pl-50 fr w250"style >
          <el-button class type="primary"@click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
          <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
        </el-col>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list" width="100%"@selection-change="handleSelectionChange" >
          <el-table-column type="selection"width="55"/>
          <el-table-column label="时间"prop="pop_time"align="center"/>
          <el-table-column label="生产编号"prop="pop_number"align="center"/>
          <el-table-column label="功能"min-width align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.pop_function == 1">新增信息</div>
              <div v-if="scope.row.pop_function == 2">删除信息</div>
              <div v-if="scope.row.pop_function == 3">苗木管理</div>
              <div v-if="scope.row.pop_function == 4">农事任务</div>
              <div v-if="scope.row.pop_function == 5">预估产量</div>
              <div v-if="scope.row.pop_function == 6">损耗报备</div>
              <div v-if="scope.row.pop_function == 7">收货产物</div>
              <div v-if="scope.row.pop_function == 8">导出</div>
              <div v-if="scope.row.pop_function == 9">开始生产</div>
              <div v-if="scope.row.pop_function == 10">暂停生产</div>
              <div v-if="scope.row.pop_function == 11">结束生产</div>
            </template>
          </el-table-column>
          <el-table-column label="内容"prop="pop_content"align="center"/>
          <el-table-column label="用户名"prop="pop_admacc"align="center"/>
          <el-table-column label="员工姓名"prop="pop_admname"align="center"/>
          <el-table-column label="状态"align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.pop_state == 1">显示</div>
              <div v-if="scope.row.pop_state == 2">隐藏</div>
              <div v-if="scope.row.pop_state == 3">不对外展示</div>
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
import {areadownManage, areaUpManage,areaExport} from '@/api/productAreaMan'
import { errorStatus } from '@/utils/index'

export default {
  name: 'Account',
  props: {
    disId: {
      type: Number,
      required: false
    },


  },
  data() {
    return {
      formList: {
        pop_admacc:'',
        pop_time:'',
        pop_function: '',
        pop_content: '',
        pop_number: '',
        pop_admname: '',
        pop_state: '',
      },
      tagTitle:'',
      exportUrl:'',
      rules: {
        pop_time:[],
        pop_function:[],
        pop_content:[],
        pop_number: [],
        pop_admname: [],
        pop_state:[],
      },
      functionList:[
        { popid: 0, popname: '全部' },
        { popid: 1, popname: '新增信息' },
        { popid: 2, popname: '删除信息' },
        { popid: 3, popname: '苗木管理 ' },
        { popid: 4, popname: '农事任务' },
        { popid: 5, popname: '预估产量' },
        { popid: 6, popname: '损耗报备 ' },
        { popid: 7, popname: '收货产物' },
        { popid: 8, popname: '导出' },
        { popid: 9, popname: '开始生产' },
        { popid: 10, popname: '暂停生产 ' },
        { popid: 11, popname: '结束生产' }
      ],
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '显示' },
        { id: 2, name: '隐藏' },
        { id: 3, name: '不外展示' }
      ],
      areaThisList: [],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      
      chosed: [],
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.formList.pop_time;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      },
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },
  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getPageInfo();
    this.formList.pop_state = this.state[0].name
    this.formList.pop_function = this.functionList[0].popname
    // this.addForm.adm_stase = this.state1[0].name;
  },
  methods: {
    getPageInfo() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {};
      data.dis_id=this.disId
      data.page = this.currentPage
      areadownManage(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.list = dataRep.data
            console.log(this.list)
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })

        const datalist ={}
        datalist.dis_id=this.disId
        areaUpManage(datalist)
          .then(response => {
            loading.close()
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.areaThisList = dataRep.data
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
      const search =this.formList
      if (search.pop_state === '全部' || search.pop_state === 0) {
        search.pop_state = ''
      }
      if (search.pop_function === '全部' || search.pop_function === 0) {
        search.pop_function = ''
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // console.log('search--', search)
      search.page = page
      areadownManage(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.list = dataRep.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            this.serch_req = true
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
        })
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
    exportsThis(){
      const url = process.env.BASE_API
      const baseUrl=url.replace('/public','/')
      const data=this.formList
      data.dis_id=this.disId
      if(data.pop_state == ''||data.pop_state === '全部'){
        data.pop_state=''
      }
      if(data.pop_function == ''||data.pop_function === '全部'){
        data.pop_function=''
      }
      delete data.page
      areaExport(data).then(response=>{
        if(errorStatus(response.data)){
          const str=response.data.data
          this.exportUrl=baseUrl+str
          this.clickABtn()
         
        }
      }).catch(Error=>{
        this.$message.error("导出请求失败")
      })
    },
    clickABtn(){
       setTimeout(() => {
        document.getElementById('exportFile').click();
      }, 1000)
    },
    backBtn(){
      var tagName=''
      if(this.baseId){
        tagName=this.baseName

      }else if(this.proId){
        tagName=this.proName
      }
       // this.$confirm('确定离开'+tagName+'区域列表?', '提示', {
       //    confirmButtonText: '确定',
       //    cancelButtonText: '取消',
       //    type: 'warning'
       //  })
       //  .then(() => {
          this.$emit('listerToChild', 'addPage')
        //   }).catch(() => {
        // })
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
    .list_data_add .tip_box{
      color: #f35e5e;
      font-size: 12px;
      line-height: 20px;
    }
  }

}

</style>
<style>
.rightInfoWord {
  font-size:13px
}
.rightInfoWord a{
  margin-left:50px
}
</style>