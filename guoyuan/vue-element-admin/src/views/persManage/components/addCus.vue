<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">客户列表-{{ role_tit }}</div>
        <div class="sd-module-btn">
          <el-button :loading="subLoading" class="btn-mainCol" @click="getCheckedKeys()" >提交</el-button>
          <el-button class="btn-back" @click="back()" >返回</el-button>
        </div>
      </div>
      <el-form ref="formList" :model="formList" :rules="formRules" label-width="100px" class="lk-form-addRoles" >
        <div class="roles-checkbox">
          <div class="roles-chose-tit-box">
            <div class="roles-title">客户信息</div>
          </div>
          <el-row class='lk_customer'>
            <el-col :span='5' class="sd-col-6" >
              <el-form-item label="公司名称" prop='com_name'>
                <el-input v-model="formList.com_name" placeholder="请输入公司名称" class="lk-ipt" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='5'  class="sd-col-6" >
              <el-form-item label="登录账号" prop='adm_acc' >
                <el-input v-model="formList.adm_acc" placeholder="请输入登录账号" class="lk-ipt" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='5' class="sd-col-6">
              <el-form-item label="登录密码" prop='adm_pas'>
                <el-input placeholder="请输入登录密码" v-model="formList.adm_pas" class="lk-ipt" type='password' >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='5' class="sd-col-6">
              <el-form-item label="确认密码" prop='adm_repas'>
                <el-input type='password' v-model="formList.adm_repas" placeholder="请再次输入密码" class="lk-ipt" @blur='blurRepas($event)' >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='5' class="sd-col-6">
              <el-form-item label="联系人" prop='adm_name'>
                <el-input v-model="formList.adm_name" placeholder="请输入联系人" class="lk-ipt">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='5' class="sd-col-6">
              <el-form-item label="联系电话" prop='adm_mobile' >
                <el-input v-model="formList.adm_mobile" placeholder="请输入联系电话" class="lk-ipt"></el-input>
              </el-form-item>
            </el-col>
             <el-col :span='5' class="sd-col-6">
              <el-form-item label="到期时间" prop='com_expiretime'>
                  <el-date-picker  v-model="formList.com_expiretime" type="datetime" placeholder="选择到期时间" class="lk-time-box" />
              </el-form-item>
            </el-col>
            <el-col :span='4' class="sd-col-4" >
              <el-form-item label="状态" prop='com_stase' >
                <el-select v-model="formList.com_stase" class='lk-sel' >
                  <el-option v-for="item in state" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="roles-checkbox">
          <div class="roles-chose-tit-box">
            <div class="roles-title">系统功能项</div>
            <div class="sd-module-btn">
              <el-button
                class="stopCol-btn"
                size="small"
                @click="resetChecked()"
              >清空</el-button>
            </div>
          </div>
          <el-form-item
          label="角色名称"
          prop="rol_name"
        >
          <el-input
            v-model="formList.rol_name"
            class="w340"
          />
        </el-form-item>
          <ul class="roles-chose">
            <el-tree
              ref="tree"
              :data="list"
              :default-checked-keys="checkKey"
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-expand-all="true"
              show-checkbox
              node-key="pri_id"
              class="role-tree-chose"
            />
          </ul>
        </div>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { getCustInfo,addCustom,editCustom,startComp,stopComp} from '@/api/system'
import { errorStatus } from '@/utils/index'
import { phoneTest, valiPassword } from '@/utils/validate'
export default {
  name: 'addCustomer',
  props: {
    editId: {
      type: Number,
      required: true
    },
    admPre: {

      required: true
    },
  },
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
    const validatePass = (rule, value, callback) => {
      if (!valiPassword(value)) {
        callback(new Error('请确认两次输入的密码是否一致'))
      } else {
        callback()
      }
    }
    return {
      role_tit: '新增',
      formList: {
        rol_name: '',
        com_name:'',
        adm_acc:'',
        com_stase:'',
        adm_pas:'',
        adm_repas:'',
        adm_mobile:'',
        com_expiretime:'',
      },
      type:1,
      state:[
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
       ],
      formRules: {
        rol_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        com_name: [
          { required: true, message: '请输入客户所在公司', trigger: 'blur' }
        ],
        adm_acc: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' }
        ],
        adm_name: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        adm_pas: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        adm_repas: [
          { required: true, validator: validatePass,trigger: 'blur' }
        ],
        adm_mobile: [
          { required: true, validator: phone, trigger: 'blur' }
        ],
        com_stase: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        com_expiretime: [
          { required: true, message: '请选择到期时间', trigger: 'blur' }
        ]
      },
      list: [],
      checkKey: [],
      defaultProps: {
        children: 'subcat',
        label: 'pri_funname'
      },
      subLoading: false
    }
  },
  created() {
    this.pageInfor();
    this.formList.com_stase=this.state[0].name;
   
  },
  methods: {
    pageInfor() {
      const editId = this.editId
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.type=1
      if (editId === 0) {

        // console.log('editId-00--', editId)
        addCustom(data).then(Response => {
            loading.close()
            const dataRep = Response.data
            if (errorStatus(dataRep)) {
              this.list = dataRep.privileges_info
            }
          }).catch(Error => {
            loading.close();
            this.$message.error("请求失败")
          })
        } else {
        this.role_tit='编辑'
        data.com_id = editId;
        console.log('编辑data--', data)
        editCustom(data).then(response => {
            loading.close()
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.list = dataRep.privileges_info;
              const lidsd = [];
              const lsid = dataRep.rol_fid;
              const lkds = dataRep.select_rol;
              for (var i = 0; i < lkds.length; i++) {
                if (lsid.indexOf(lkds[i]) === -1) {
                  lidsd.push(lkds[i]);
                }
              }
              this.checkKey = lidsd;
              this.formList = dataRep.companyinfo;
              this.formList.rol_name = dataRep.rolename;
            }
          })
          .catch(Error => {
            loading.close();
          })
      }
    },
    // 提交
    getCheckedKeys() {
      console.log("formList--",this.formList)
      this.$refs.formList.validate(valid => {
      if (valid) {
        const editId = this.editId;
        const data = this.formList;
        const arrCheck = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        const arrCheckchild = this.$refs.tree.getCheckedKeys()
        const arr = []
        for (var i = 0; i < arrCheck.length; i++) {
          if (arrCheckchild.indexOf(arrCheck[i]) === -1) {
            arr.push(arrCheck[i])
          }
        }
       if (arrCheck.length === 0) {
         this.$message.error('请选择系统功能项')
         return false
       }
       data.rol_pri = arrCheck
       data.rol_fid = arr;
       if(data.com_stase==='启用'){
         data.com_stase=1
       }
       if (editId === 0) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        addCustom(data).then(response => {
            loading.close()
            // console.log('---', response)
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.$message.success(dataRep.data);
              this.$emit('listerToChild', 'addCustomer')
            }
          })
          .catch(Error => {
            loading.close()
            this.$message.error('请求失败')
          })
      } else {
        this.subLoading = true
        data.com_id = editId;
        data.adm_pre=this.admPre;
        console.log("data--编辑--",data)
        editCustom(data)
          .then(response => {
            this.subLoading = false
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.$message.success(dataRep.data)
             this.$emit('listerToChild', 'addCustomer')
            }
          })
          .catch(Error => {
            this.subLoading = false
            this.$message.error('请求失败')
          })
      }
        }else{
          this.$message.error("填写信息有误")
        }
       })
    
     
      // console.log('data.pri_id----', arrCheck)
      // console.log(' data.col-piud---------------------------------------+++++++++', arr)
      
      // const rol_name = this.formList.rol_name
      // if (rol_name === '' || rol_name === null) {
      //   this.$message.error('请输入角色名称')
      //   return false
      // }
      // data.rol_name = rol_name
      // console.log(data)
      
    },
    // 确认密码
    blurRepas(e){
      console.log("value--",value)
      console.log("this.formList.adm_pas--",this.formList.adm_pas)
      const value=e.target.value;
      if(value!==this.formList.adm_pas){
        this.$message.error("请确认两次输入的密码是否一致");
        this.formList.adm_repas=''
      }
    },
    back() {
      // console.log('1111111111111')
      this.$emit('listerToChild', 'addCustomer')
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-container {
  .sd-module-box {
    .lk-form-addRoles {
      .lk_customer {
        margin: 10px 0;
        .sd-col-6 {
          min-width: 280px;
          .lk-ipt {
            min-width: 180px;
          }
        }
        .sd-col-4 {
          min-width: 240px;
          .lk-sel {
            min-width: 140px;
          }
        }
      }
      .roles-checkbox {
        .roles-chose-tit-box {
          padding: 10px 0 4px 0;
          border-bottom: 1px solid #eee;
          margin-bottom:10px;
          @include clearfix;
          .roles-title {
            border-left: 1px solid #1d92c9;
            padding: 2px 0 2px 26px;
            font-size: 16px;
            width: 40%;
            float: left;
          }
          .sd-module-btn {
            float: right;
            padding-right: 20px;
          }
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.roles-chose {
  margin-top: 0;
  .role-tree-chose {
    .el-tree-node {
      @include clearfix;
      // width: 100%;
      .el-tree-node__expand-icon {
        color: #666;
      }
      .el-checkbox__inner {
        border: 1px solid #999;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        border: 1px solid #409eff;
      }
      padding: 10px 0 8px;
      .el-tree-node__content {
      }
      .el-tree-node__children {
        .el-tree-node__expand-icon {
          display: none;
        }
        .el-tree-node {
          padding: 6px 0 0px;
          .el-tree-node__content {
            padding-left: 40px !important;
          }
          .el-tree-node__children {
            padding-left: 60px !important;
            @include clearfix;
            // padding: 0 0 0 50px;
            .el-tree-node {
              padding: 0 30px;
              float: left;
              .el-tree-node__content {
                padding-left: 0 !important;
              }
              .el-tree-node__children {
                // padding-left: 0 !important;
                padding: 6px 0 0 0 !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
