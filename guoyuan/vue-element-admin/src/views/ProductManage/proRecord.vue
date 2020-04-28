<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">生产记录</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.showBtn" class="btn-mainCol"@click="showProData()">显示生产数据</el-button>
          <el-button v-if="btnShow.hideBtn" class="openCol-btn"@click="hideProData()">隐藏生产数据</el-button>
          <el-button v-if="btnShow.exportBtn" class="stopCol-btn"@click="exportsthis()">导出</el-button>

        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="生产编号:"class="sd-form-item"prop="pro_number" >
              <el-input v-model="formList.pro_number"placeholder="请输入生产编号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="10"class="sd-col-6">
            <el-form-item label="生产时段:" class="lk-time-chose">
              <el-col :span="11">
                <el-form-item prop="start_time">
                  <el-date-picker v-model="formList.pro_start"type="datetime"placeholder="开始日期"class="lk-time-box" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateBefore'/>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span class="fl">&nbsp;&nbsp;-</span>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="end_time">
                  <el-date-picker v-model="formList.pro_endtime"type="datetime"placeholder="结束日期"class="lk-time-box" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter'/>
                </el-form-item>
              </el-col>
              <el-col :span="1"/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="商品品类:"class="sd-form-item"prop="cla_name">
              <el-input v-model="formList.cla_name"placeholder="请输入商品品类" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="商品名称:"class="sd-form-item"prop="goo_name">
              <el-input v-model="formList.goo_name"placeholder="请输入商品名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="状态:"class="sd-form-item"prop="pro_show">
              <el-select v-model="formList.pro_show"class >
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="农民姓名:"class="sd-form-item"prop="far_name">
              <el-input v-model="formList.far_name"placeholder="请输入农民姓名" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="果园名称:"class="sd-form-item"prop="base_name">
              <el-input v-model="formList.base_name"placeholder="请输入果园名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="产区类型:"class="sd-form-item"prop="reg_type">
              <el-select v-model="formList.reg_type"class filterable clearable>
                <el-option v-for="item in typelist":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="产区名称:"class="sd-form-item"prop="reg_name">
              <el-input v-model="formList.reg_name"placeholder="请输入产区名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col class="pl-50 fr w250"style >
            <el-button class type="primary"@click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list"width="100%"@selection-change="handleSelectionChange" >
          <el-table-column type="selection"width="55"/>
          <el-table-column label="生产信息"min-width align="center" width="350">
             <template  slot-scope="scope">
              <div align="left">
                <p>
                  <span v-if="scope.row.pro_number" class="blue">生产编号:</span>{{scope.row.pro_number}} 
                </p>
                <p>
                  <span v-if="scope.row.pro_start"class="blue ">时间:</span>
                  {{scope.row.pro_start}} 
                  <span v-if="scope.row.pro_start">至</span>
                  {{scope.row.pro_endtime}}
                </p>
                <p>
                  <span v-if="scope.row.cla_name"class="blue">品类:</span>{{scope.row.cla_name}} 
                  <span  v-if="scope.row.goo_name"class="blue righttit">名称:</span>{{scope.row.goo_name}} 
                </p>
                <p>
                  <span v-if="scope.row.far_name"class="blue">农户:</span>{{scope.row.far_name}} 
                  <span v-if="scope.row.reg_name"class="blue righttit">产区:</span>{{scope.row.reg_name}} 
                </p>
                <p>
                  <span v-if="scope.row.base_name"class="blue ">果园:</span>{{scope.row.base_name}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="预估产量" prop="pro_estimate" align="center" />
          <el-table-column label="实际产量" prop="pro_actual" align="center" />
          <el-table-column label="损耗" prop="pro_loss" align="center" />
          <el-table-column label="发码量"prop="pro_code"align="center" />
          <el-table-column label="产品品级"align="center">
             <template  slot-scope="scope">
              <div align="left">
                <p ><span v-if="scope.row.pro_one" class="blue">一级:</span>{{scope.row.pro_one}}</p>
                <p ><span v-if="scope.row.pro_two" class="blue">二级:</span>{{scope.row.pro_two}}</p>
                <p ><span v-if="scope.row.pro_three" class="blue">三级:</span>{{scope.row.pro_three}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态"align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.pro_show == 1">显示</div>
              <div v-else>隐藏</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"align="center"width="250">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button v-if="scope.row.pro_show==2 && btnShow.showBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)"> 显示生产数据
                </el-button>
                <el-button v-if="scope.row.pro_show==1 && btnShow.hideBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)"> 隐藏生产数据
                </el-button>
                <el-button v-if="btnShow.contiBtn" size="mini"  class="openCol-btn"@click="restartProd(scope.row)">重新开始生产
                </el-button>
              </div>
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
import {proRecordList, hideProRec, showProRec, exprotProRec,continuePro } from '@/api/ProductManage'
import { errorStatus } from '@/utils/index'
export default {
  name: 'Account',
  data() {
    return {
      exportUrl:'',
      fardis:false,
      regdis:false,
      formList: {
        pro_number:'',
        time: '',
        cla_name: '',
        goo_name: '',
        far_name: '',
        base_name: '',
        reg_name: '',
        pro_show: '',
        reg_type: ''
      },
      typelist:[
        { id: 0, name: '全部' },
        { id: 1, name: '耕地大田' },
        { id: 2, name: '圈舍牧区' },
        { id: 3, name: '鱼池水塘' },
        { id: 4, name: '果园林区' },
        { id: 5, name: '温室大棚' }
      ],
      rulesCla: {
        pro_number: [
          { required: true, message: '请输入生产编号', trigger: 'blur' }
        ],
         time: [
          { required: true, message: '请输入生产时段', trigger: 'blur' }
        ],
         cla_name: [
          { required: true, message: '请输入商品品类名称', trigger: 'blur' }
        ],
         goo_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
         far_name: [
          { required: true, message: '请输入农户姓名', trigger: 'blur' }
        ],
         base_name: [
          { required: true, message: '请输入果园名称', trigger: 'blur' }
        ],
         reg_name: [
          { required: true, message: '请输入产区名称', trigger: 'blur' }
        ],
        reg_type: [
          { required: true, message: '请输入产区类型', trigger: 'change' }
        ],

      },
      tagTitle:'',
      edit: false,
      rules: {
        
      },
      departList:[],
      workList:[],
      rolesType: null,
      staffType:[
        {id: 0, name: '临时工'}
      ],
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '显示' },
        { id: 2, name: '隐藏' }
      ],
      state1: [{ id: 1, name: '显示' }, { id: 2, name: '隐藏' }],
      regionList:[],
      baseList:[],
      productList:[],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      worklist:[],
      showAddClas: false,
      showTime:false,
      showRecord:false,
      addCla: {
        dis_unit:null,
        pro_id: null,
        dis_regid:null,
        dis_name:null,
        restarea:0
      },
      delpro_id:'',

      dialogTit: '新增',
      dialog: {
        title: '新增',
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      chosed: [],
      serch_req: false,
      addRules: {
        tem_name: [{ required: true, message: '请输入临时工姓名', trigger: 'blur' }],
        pro_show: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
      showNPwd: false,
      btnShow:{},
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.formList.pro_start;
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
          let DateVal = this.formList.pro_endtime;
          if (DateVal) {
            return time.getTime() < DateVal||time.getTime() > _now;
          } else {
            return time.getTime() > _now;
          }
        }
      }
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },
  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getPageInfo();
    this.formList.pro_show = this.state[0].name
    // this.formList.reg_type = this.typelist[0].name
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
      data.pri_id = this.$route.meta.pri_id
      data.page = this.currentPage
      proRecordList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            // const role_id = { rol_id: 0, rol_name: "全部" };
            // this.godsType.splice(0, 0, role_id);
            this.list = dataRep.data
            console.log(dataRep.data)
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total

            const btnList = dataRep.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '显示') {
                this.$set(this.btnShow, 'showBtn', true)
              } else if (btnList[i].pri_funname === '隐藏') {
                this.$set(this.btnShow, 'hideBtn', true)
              } else if (btnList[i].pri_funname === '导出') {
                this.$set(this.btnShow, 'exportBtn', true)
              } else if (btnList[i].pri_funname === '继续生产') {
                this.$set(this.btnShow, 'contiBtn', true)
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
    restartProd(row){
      const data={}
      data.pro_id=row.pro_id
        this.$confirm('您确认要重新开始生产'+row.goo_name+'?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            continuePro(data)
            .then(response => {
               const dataRep = response.data
              if (errorStatus(dataRep)) {
                this.$message.success(dataRep.data)
                this.getPageInfo()
              }
            })
            .catch(Error => {
              this.$message.error('请求失败')
            })
          })
      },
    // 搜索
    searchList(formName, page) {
      const search =this.formList
      if (search.pro_show === '全部' || search.pro_show === 0) {
        search.pro_show = ''
      }
      if (search.reg_type === '全部' || search.reg_type === 0) {
        search.reg_type = ''
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
      proRecordList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            // const rol = { rol_id: 0, rol_name: '全部' }
            // const role = dataRep.data_info.role
            // role.unshift(rol)
            // this.godsType = role
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
    // 单个--显示--隐藏
    enableThisClas(row, num) {
      const data = {}
      data.pro_id = [row.pro_id]
      if (num === 1) {
        // 显示
        showProRec(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('显示生产数据成功!')
              row.pro_show = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 隐藏
        hideProRec(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('隐藏生产数据成功!')
              row.pro_show = num
            }
          })
          .catch(Error => {
            // console.log("隐藏的生产数据err", err);
            this.$message.error('请求失败!')
          })
      }
    },
 // 显示
    showProData() {
      const list = this.list
      const chosed = this.chosed
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要显示的生产数据!')
      } else {
        const pro_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].pro_show === 2) {
            pro_id.push(chosed[i].pro_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (pro_id.length > 0) {
          data.pro_id = pro_id
          this.$confirm('请确认,是否显示选中的生产数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              showProRec(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in pro_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (pro_id[i] === list[j].pro_id) {
                          list[j].pro_show = 1
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.getPageInfo()
                    this.$message.success('显示成功!')
                  }
                })
                .catch(err => {
                  console.log('显示的生产数据err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消隐藏");
            })
        } else {
          this.$confirm("选中生产数据的状态全部为'显示'", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    // 隐藏
    hideProData() {
      const list = this.list
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要隐藏的生产数据!')
      } else {
        const pro_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].pro_show === 1) {
            pro_id.push(chosed[i].pro_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (pro_id.length > 0) {
          data.pro_id = pro_id
          this.$confirm('请确认,是否隐藏选中生产数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              hideProRec(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in pro_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (pro_id[i] === list[j].pro_id) {
                          list[j].pro_show = 2
                        }
                      }
                    }
                    this.list = list
                    this.getPageInfo()
                    this.$message.success('隐藏成功!')
                  }
                })
                .catch(err => {
                  console.log('显示的生产数据err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消隐藏");
            })
        } else {
          this.$confirm("选中生产数据状态已全部为'隐藏'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    clickABtn(){
      // console.log("url--",this.exportUrl)
      // return false
       setTimeout(() => {
        document.getElementById('exportFile').click();
      }, 1000)
    },
    //导出
    exportsthis(){
      const url = process.env.BASE_API
      const baseUrl=url.replace('/public','/')
      const data=this.formList
      if(data.pro_show == ''||data.pro_show === '全部'){
        data.pro_show=''
      }
      if (data.reg_type === '全部' || data.reg_type === 0) {
        data.reg_type = ''
      } 
      delete data.page
      exprotProRec(data).then(response=>{
        if(errorStatus(response.data)){
          const str=response.data.data
          this.exportUrl=baseUrl+str
          this.clickABtn()
         
        }
      }).catch(Error=>{
        this.$message.error("导出请求失败")
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
    handleCurrentWkChange(val){
      this.currentWkPage = val
       this.viewJob()
    },
    // 弹窗--取消
    cancle(formName) {
      this.$refs[formName].resetFields()
      this.dialog.show = false
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
.add-gods-title{
  color:#c0c4cc;
  font-size:14px
}
.righttit{
  margin-left:50px
}
</style>