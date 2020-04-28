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
      <el-form
        ref="formList"
        :model="formList"
        :rules="formRules"
        label-width="100px"
        class="lk-form-addRoles"
      >
        <el-form-item label="角色名称" prop="rol_name">
          <el-input v-model="formList.rol_name" class="w340"/>
        </el-form-item>
        <div class="roles-checkbox">
          <div class="roles-chose-tit-box">
            <div class="roles-title">系统功能项</div>
            <div class="sd-module-btn">
              <el-button class="stopCol-btn" size="mini" @click="resetChecked()">清空</el-button>
            </div>
          </div>

          <!-- <ul class="roles-checkbox-box">
            <li v-for="(role,index) in list" :key="role.pri_id" class="roles-check-unit">
              <el-checkbox
                :indeterminate="check[index].isIndeter"
                v-model="check[index].checkAll"
                @change="handleCheckAllChange"
                class="role-check-all"
              >{{role.pri_funname}}</el-checkbox>
              <ul class="role-sec-check">
                <li class="roles-sec-box" v-for="(sec,indSec) in role.subcat" :key="sec.pri_id">
                  <div class="roles-sec">
                    <el-checkbox
                      :indeterminate="check[index].isIndetSec"
                      v-model="check[index].sec"
                      @change="checkSecChange($event,index,indSec)"
                    >{{sec.pri_funname}}</el-checkbox>
                  </div>
                  <el-checkbox-group
                    v-model="check[index].third"
                    @change="checkThird($event,index)"
                    class="role-third-check"
                  >
                    <el-checkbox
                      v-for="thi in sec.subcat"
                      :label="thi.pri_id"
                      :key="thi.pri_id"
                    >{{ thi.pri_funname }}</el-checkbox>
                  </el-checkbox-group>
                </li>
              </ul>
            </li>
          </ul>-->
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
        // console.log('editId-00--', editId)
        roleAdd(data)
          .then(Response => {
            loading.close()
            // console.log('---', Response)
            const dataRep = Response.data
            if (errorStatus(dataRep)) {
              this.list = dataRep.privileges_info
            }
          })
          .catch(Error => {
            loading.close()
          })
      } else {
        data.rol_id = editId
        // console.log('data--', data)
        editrole(data)
          .then(response => {
            loading.close()
            // console.log('1212---', response)
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.list = dataRep.privileges_info
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
      // console.log('data.pri_id----', arrCheck)
      // console.log(' data.col-piud---------------------------------------+++++++++', arr)
      data.pri_id = arrCheck
      data.rol_fid = arr
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
              this.$refs.tree.setCheckedKeys([])
              this.formList.rol_name = ''
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
    back() {
      // console.log('1111111111111')
      this.$emit('listerToChild', 'Addroles')
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
