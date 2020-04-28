<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">我的农资</div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="农资名称:"class="sd-form-item"prop="agr_name">
              <el-input v-model="formList.agr_name"placeholder="请输入农资名称"/>
            </el-form-item>
          </el-col>
         <el-col :span="4" class="sd-col-6">
            <el-form-item label="农资品类:" class="sd-form-item" prop="agr_class">
              <el-select v-model="formList.agr_class" class style="width:120px;">
                <el-option v-for="item in classlist":key="item.acl_id":label="item.acl_name":value="item.acl_id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="pl-50 fr w250"style >
            <el-button class type="primary"@click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list"width="100%"@selection-change="handleSelectionChange">
          <el-table-column type="selection"width="55"/>
          <el-table-column label="农资名称"prop="agr_name"min-width align="center"/>
          <el-table-column label="农资品类"prop="acl_name"align="center"/>
          <el-table-column label="剩余数量"prop="surplus"align="center"/>
          <el-table-column label="损毁数量"prop="agr_lossnum"align="center"/>
          <el-table-column label="操作"align="center"width="320">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button v-if="btnShow.lossBtn"size="mini"class="btn-mainCol"@click="viewJob(1,scope.row)">损耗报备</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0"class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
      <!-- 损耗报备 -->
    <el-dialog :visible.sync="showRecord":title="dialogTit":close-on-click-modal="false"width="500px" 
     @close="addClaForm('addCla')">
       <el-form  ref="addCla":model="addCla":rules="rulesCla"prop="rep_name" label-width="80px">
          <el-form-item label="仓库名称:" class="sd-form-item" prop="agr_class" >
              <el-select v-model="addCla.rep_name" class  style='width:300px' @change="viewJob(2,$event)">
                <el-option v-for="item in warelist":key="item.rep_id":label="item.rep_name":value="item.rep_id"/>
              </el-select>
          </el-form-item>
          <el-form-item label="库位名称:" class="sd-form-item" prop="sto_name" v-if="addCla.rep_name">
              <el-select  v-model="addCla.sto_name" class style='width:300px'>
                <el-option v-for="item in storageList":key="item.sto_id":label="item.sto_name":value="item.sto_id"/>
              </el-select>
          </el-form-item>
          <el-form-item label="损耗量:"class="sd-form-item"prop="lor_lossnum" >
              <el-input v-model="addCla.lor_lossnum"placeholder="请输入数值(不得大于预估产量值)" style='width:300px'/>
          </el-form-item>
          <el-form-item label="原因说明"prop="lor_case">
            <el-input type="textarea" :rows="5" maxlength="200" v-model="addCla.lor_case" style='width:300px'placeholder="请输入原因说明"  />
          </el-form-item>
       </el-form>
       <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button  type="primary"@click="addBtn('addCla')">确 定</el-button>
       </span>
     </el-dialog>
    </el-row>
  </div>
</template>
<script>
import {myMaterialList, searWarehouse, lossMyMaterial, searchAgric,} from '@/api/agriculManage'
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
        agr_name: '',
        agr_class:'全部'
      },
      edit: false,
      rules: {
        agr_name: [],
        agr_class:[],
      },
      rolesType: null,
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addCla: {
        rep_name: null,
        sto_name:null,
        lor_lossnum:null,
        lor_case:null,
        agr_id:null
      },
      rulesCla: {
        agr_name: [
          { required: true, message: '请输入农资名称', trigger: 'blur' }
        ],
        far_mobile: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ]
      },
      showRecord:false,
      storageList:[],
      warelist:[],
      dialogTit: '损耗报备',
      dialog: {
        title: '新增',
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      classlist:[],
      chosed: [],
      serch_req: false,
      addRules: {
        agr_name: [{ required: true, message: '请输入农资名称', trigger: 'blur' }],
        far_mobile: [{ required: true, trigger: 'blur', validator: phone }],
      },
      showNPwd: false,
      btnShow:{
        lossBtn:false
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
    this.matClass()
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
      data.pri_id = this.$route.meta.pri_id
      data.page = this.currentPage
      myMaterialList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            // const role_id = { rol_id: 0, rol_name: "全部" };
            // this.godsType.splice(0, 0, role_id);
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            const btnList = dataRep.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '损耗报备') {
                this.btnShow.lossBtn = true
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
    //品类
    matClass(){
      const data={}
      searchAgric(data).then(response=>{
        const dataRep=response.data
        if(errorStatus(dataRep)){
            const gos = { acl_id: 0, acl_name: '全部' }
            this.classlist=dataRep.data_info
            this.classlist.unshift(gos)
            this.formList.agr_class = this.classlist[0].acl_name
            // this.addCla.rol_id = this.rolelist[0].rol_id        
        }
      }).catch(Error => {
          this.$message.error('请求失败')
      })
    },
    closeWork(formName) {
      this.showRecord = false
    },
    viewJob(type,scope){
      this.addCla.sto_name=''
      const data = {};
      if(type ===1 ){
         this.showRecord = true
         this.addCla.agr_id=scope.agr_id
      } 
      if(type === 2){
         data.rep_id=this.addCla.rep_name
      }
      data.type=type
      searWarehouse(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            if(type === 1){
              this.warelist=dataRep.data_info
            }
           if(type === 2){
              this.storageList=dataRep.data_info
           }
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    //  changeName(val){
    //   const data={}
    //   data.rep_id=this.addCla.rep_name
    //   data.type=2
    //    searWarehouse(data)
    //     .then(response => {
    //       const dataRep = response.data
    //       if (errorStatus(dataRep)) {
    //         this.storageList=dataRep.data_info
    //       }
    //     })
    //     .catch(Error => {
    //       this.$message.error('请求失败')
    //       console.log('请求失败--', Error)
    //     })
    // },
    // 搜索
    searchList(formName, page) {
      const search = this.formList
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (search.agr_class === "全部" || search.agr_class === 0) {
        search.agr_class = ''
      } 
      search.pri_id = this.$route.meta.pri_id
      search.page=page
      // console.log('search--', search)
      myMaterialList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            // const rol = { rol_id: 0, rol_name: '全部' }
            // const role = dataRep.data_info.role
            // role.unshift(rol)
            // this.godsType = role
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
    // 损耗报备
    addBtn() {
      const that = this
      const data = {}
      if (that.addCla.rep_name === null) {
        this.$message.error('请输入仓库名称')
        return false
      }
      if (this.addCla.sto_name === null) {
        this.$message.error('请输入库位名称')
        return false
      }
      if (this.addCla.lor_lossnum === null) {
        this.$message.error('请输入损耗量')
        return false
      }
      if (that.addCla.lor_case === null) {
        this.$message.error('请输入原因说明')
        return false
      }
      data.agr_id=that.addCla.agr_id
      data.lor_repid=that.addCla.rep_name
      data.lor_stoid=that.addCla.sto_name
      data.lor_lossnum=that.addCla.lor_lossnum
      data.lor_case=that.addCla.lor_case
      lossMyMaterial(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.$message.success(res.data.data)
            this.showRecord = false
            that.getPageInfo()
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
    addClaForm(formName){
      this.showRecord=false
      this.$refs[formName].resetFields()
      this.addCla.rep_name=null
      this.addCla.sto_name=null
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
