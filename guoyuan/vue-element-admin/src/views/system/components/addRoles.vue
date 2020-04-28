<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">角色列表--{{ role_tit }}</div>
        <div class="sd-module-btn">
          <el-button :loading="subLoading" class="btn-mainCol" @click="getCheckedKeys()">提交</el-button>
          <el-button class="btn-back" @click="back()">返回</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="formRules"label-width="100px"class="lk-form-addRoles">
        <el-form-item label="角色名称" prop="rol_name">
          <el-input v-model="formList.rol_name" class="w340"/>
        </el-form-item>
        <el-form-item label="权限功能"  prop="rol_type">
          <el-switch active-text="可登录PC（电脑）端" v-model="valchoicePC" @change='changeStatus($event,1)'> </el-switch>
          <el-switch active-text="可登录PDA(手持设备)端" v-model="valchoicePDA" @change='changeStatus($event,2)'> </el-switch>
          <el-switch active-text="可登录公众号" v-model="valchoiceWX" @change='changeStatus($event,3)'> </el-switch>
        </el-form-item>
        <div class="roles-checkbox"  v-if="showPC">
          <div class="roles-chose-tit-box">
            <div class="roles-title">PC功能</div>
            <div class="sd-module-btn">
              <el-button class="stopCol-btn" size="mini" @click="resetChecked(1)">清空</el-button>
               </el-checkbox>
            </div>
          </div>
          <ul class="roles-chose">
            <div class="roles-chose-tit-box"  id="allcheck">
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange($event,1)">全选</el-checkbox>
            </div>
            <el-tree ref="tree":data="list":default-checked-keys="checkKey":props="defaultProps":expand-on-click-node="false":default-expand-all="true"show-checkbox node-key="pri_id"class="role-tree-chose"/>
          </ul>
        </div>
        <div class="roles-checkbox" v-if="showPDA">
          <div class="roles-chose-tit-box">
            <div class="roles-title">PDA功能</div>
            <div class="sd-module-btn">
              <el-button class="stopCol-btn" size="mini" @click="resetChecked(2)">清空</el-button>
            </div>
          </div>
          <ul class="roles-chose">
            <div class="roles-chose-tit-box"  id="allcheck">
              <el-checkbox v-model="checkAllPDA" @change="handleCheckAllChange($event,2)">全选</el-checkbox>
            </div>
            <el-tree ref="treePDA":data="listPDA":default-checked-keys="checkKey":props="defaultProps":expand-on-click-node="false":default-expand-all="true"show-checkbox node-key="pri_id"class="role-tree-chose"/>
          </ul>
        </div>
        <div class="roles-checkbox" v-if="showWX">
          <div class="roles-chose-tit-box">
            <div class="roles-title">公众号功能</div>
            <div class="sd-module-btn">
              <el-button class="stopCol-btn" size="mini" @click="resetChecked(3)">清空</el-button>
            </div>
          </div>
           <ul class="roles-chose">
            <div class="roles-chose-tit-box"  id="allcheck">
              <el-checkbox v-model="checkAllWX" @change="handleCheckAllChange($event,3)">全选</el-checkbox>
            </div>
            <el-tree
              ref="treeWX"
              :data="listPubNum"
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
import { roleAdd, addaction, editrole, editaction } from '@/api/system'
import { errorStatus } from '@/utils/index'
export default {
  name: 'Addroles',
  props: {
    editId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      checkAll: false,
      checkAllPDA: false,
      checkAllWX: false,
      showPC:false,
      showPDA:false,
      showWX:false,
      valchoicePC:false,
      valchoicePDA:false,
      valchoiceWX:false,
      isIndeterminate: true,
      role_tit: '角色新增',
      formList: {
        rol_name: ''
      },
      formRules: {
        rol_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      list: [],
      listPubNum:[],
      listPDA:[],
      checkKey: [],
      defaultProps: {
        children: 'subcat',
        label: 'pri_funname'
      },
      subLoading: false
    }
  },
  created() {
    this.pageInfor()
  },
  methods: {
    pageInfor() {
      const editId = this.editId
      // console.log('editId----', editId)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      if (editId === 0) {
         this.role_tit='角色列表-角色新增页面'
        // console.log('editId-00--', editId)
        roleAdd(data)
          .then(Response => {
            loading.close()
            // console.log('---', Response)
            const dataRep = Response.data
            if (errorStatus(dataRep)) {
              this.list = dataRep.pc
              this.listPubNum= dataRep.wx
              this.listPDA= dataRep.pda
            }
          })
          .catch(Error => {
            loading.close()
          })
      } else {
        data.rol_id = editId
        // console.log('data--', data)
        this.role_tit='角色列表-角色编辑页面'
        editrole(data)
          .then(response => {
            loading.close()
            // console.log('1212---', response)
            const dataRep = response.data
            if (errorStatus(dataRep)) {
               this.list = dataRep.pc
              this.listPubNum= dataRep.wx
              this.listPDA= dataRep.pda
              var result=dataRep.rol_port.split(",");
              for(var i=0;i<result.length;i++){
                if(Number(result[i])===1){
                  this.valchoicePC = true
                  this.showPC=true
                }
                if(Number(result[i])===2){
                  this.valchoicePDA = true
                  this.showPDA=true
                }
                if(Number(result[i])===3){
                  this.valchoiceWX = true
                  this.showWX=true
                }
              }
              if(dataRep.rol_port.indexOf("1") >0){

                this.valchoicePC = true
                this.showPC=true
                 
              }
              if(dataRep.rol_port.indexOf("2") >0){

                this.valchoicePDA = true
                this.showPDA=true
                 
              }
              if(dataRep.rol_port.indexOf("3") >0){
                this.valchoiceWX = true
                this.showWX=true
              }
              const lidsd = []
              const lsid = dataRep.rol_fid
              const lkds = dataRep.select_rol
              // console.log(lsid, lkds)
              for (var i = 0; i < lkds.length; i++) {
                if (lsid.indexOf(lkds[i]) === -1) {
                  lidsd.push(lkds[i])
                }
              }
              // console.log('--------------------------------------------------------', lidsd)
              this.checkKey = lidsd
              this.formList.rol_name = dataRep.rolename
            }
          })
          .catch(Error => {
            loading.close()
          })
      }
    },
    // 提交
    getCheckedKeys() {
      const editId = this.editId
      const data = {}
      if(this.showPC === false && this.showPDA === false && this.showWX === false){
        this.$message.error('请选择权限功能')
        return false
      }
      var arrall = []
      var arrall1 = []
      var arrall2 = []
      var arrall3 = []
      var arr = []
      var rol_port=[]
      var arr=[]
      if(this.valchoicePC){
        rol_port.push(1)
      }
      if(this.valchoicePDA){
         rol_port.push(2)
      }
      if(this.valchoiceWX){
         rol_port.push(3)
      }
      data.rol_port=rol_port

      if(this.showPC === true){

        const arrCheck = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        const arrCheckchild = this.$refs.tree.getCheckedKeys()
        for (var i = 0; i < arrCheck.length; i++) {
          if (arrCheckchild.indexOf(arrCheck[i]) === -1) {
            arr.push(arrCheck[i])
          }
        } 
        if (arrCheck.length === 0) {
          this.$message.error('请选择PC功能项')
          return false
        }
         arrall1.push({
           pc:arrCheck,
        })
      }
      if(this.showPDA  === true){
         const arrCheckPDA = this.$refs.treePDA.getCheckedKeys().concat(this.$refs.treePDA.getHalfCheckedKeys())
        //  if (arrCheckPDA.length === 0) {
        //   this.$message.error('请选择PDA功能项')
        //   return false
        // }
        arrall2.push({
           pda:arrCheckPDA
        })
      }
      if(this.showWX  === true){
        const arrCheckWX = this.$refs.treeWX.getCheckedKeys().concat(this.$refs.treeWX.getHalfCheckedKeys())
        if (arrCheckWX.length === 0) {
          this.$message.error('请选择公众号功能项')
          return false
        }
        arrall3.push({
           wx:arrCheckWX
        })
      }
     arrall=arrall1.concat(arrall2).concat(arrall3)
     var objall = Object.assign(arrall[0], arrall[1], arrall[2]);
      var jsonStr= JSON.stringify(objall)
      console.log(jsonStr,'jsonStr')
       console.log(objall,'objall')
      // console.log('data.pri_id----', arrCheck)
      // console.log(' data.col-piud---------------------------------------+++++++++', arr)
      data.pri_id =jsonStr

      // data.rol_fid = arr
      const rol_name = this.formList.rol_name
      if (rol_name === '' || rol_name === null) {
        this.$message.error('请输入角色名称')
        return false
      }
      data.rol_name = rol_name
      // console.log(data)
      if (editId === 0) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        addaction(data)
          .then(response => {
            loading.close()
            // console.log('---', response)
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.$message.success(dataRep.data)
              // this.$refs.tree.setCheckedKeys([])
              // this.formList.rol_name = ''
              this.$emit('listerToChild', 'Addroles')
            }
          })
          .catch(Error => {
            loading.close()
            this.$message.error('请求失败')
          })
      } else {
        this.subLoading = true
        data.rol_id = editId
        editaction(data)
          .then(response => {
            this.subLoading = false
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.$message.success(dataRep.data)
              this.$emit('listerToChild', 'Addroles')
            }
          })
          .catch(Error => {
            this.subLoading = false
            this.$message.error('请求失败')
          })
      }
    },
    //根据传递num不同全选不同的tree-
      handleCheckAllChange(val,num) {
        if(num === 1){
          if (this.checkAll) {
            this.$refs.tree.setCheckedNodes(this.list);
          } else {
            this.$refs.tree.setCheckedKeys([]);
          }
        }
        if(num === 2){
          if (this.checkAllPDA) {
            this.$refs.treePDA.setCheckedNodes(this.listPDA);
          } else {
            this.$refs.treePDA.setCheckedKeys([]);
          }
        }
        if(num === 3){
          if (this.checkAllWX) {
            this.$refs.treeWX.setCheckedNodes(this.listPubNum);
          } else {
            this.$refs.treeWX.setCheckedKeys([]);
          }
        }
       
      },
    //根据num值隐藏或显示不同的tree
    changeStatus: function($event,num){
       if(num === 1 && this.valchoicePC === $event){
          this.showPC=true
       }
       if(num === 2 && this.valchoicePDA === $event){
          this.showPDA=true
       }
       if(num === 3 && this.valchoiceWX === $event){
          this.showWX=true
       }
       if(num === 1 && this.valchoicePC === false){
          this.showPC=false
       }
       if(num === 2 && this.valchoicePDA === false){
          this.showPDA=false
       }
       if(num === 3 && this.valchoiceWX === false){
          this.showWX=false
       }  
    },
    back() {
      // console.log('1111111111111')
      this.$emit('listerToChild', 'Addroles')
    },
    //选择清空当前Num下的勾选
    resetChecked(num) {
      if(num === 1){
        this.$refs.tree.setCheckedKeys([])
      }
      if(num === 2){
        this.$refs.treePDA.setCheckedKeys([])
      }
      if(num === 3){
        this.$refs.treeWX.setCheckedKeys([])
      }
      
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-container {
  .sd-module-box {
    .lk-form-addRoles {
      .roles-checkbox {
        .roles-chose-tit-box {
          padding: 10px 0 4px 0;
          border-bottom: 1px solid #eee;
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
<style>
#allcheck{
  border-bottom:none !important
}
</style>