<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">系统日志</div>
        <div class="sd-module-btn"/>
      </div>
      <el-form ref="formList":model="formList":rules="formRules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="操作人:" class="sd-form-item" prop="cop_admin">
              <el-input v-model="formList.cop_admin" placeholder="请输入操作人"/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="操作模块:" class="sd-form-item" prop="cop_mode">
              <el-input v-model="formList.cop_mode" placeholder="请输入操作模块"/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="操作功能:" class="sd-form-item" prop="cop_type">
              <el-input v-model="formList.cop_type" placeholder="请输入操作功能"/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="操作内容:" class="sd-form-item" prop="cop_content">
              <el-input v-model="formList.cop_content" placeholder="请输入操作内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="sd-col-6">
            <el-form-item label="操作时间:" class="lk-time-chose">
              <el-col :span="11">
                <el-form-item prop="cop_createtime_range0">
                  <el-date-picker
                    v-model="formList.cop_createtime_range0"
                    type="datetime"
                    placeholder="开始日期"
                    class="lk-time-box"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span class="fl">-</span>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="cop_createtime_range1">
                  <el-date-picker
                    v-model="formList.cop_createtime_range1"
                    type="datetime"
                    placeholder="结束日期"
                    class="lk-time-box"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="1"/>
            </el-form-item>
          </el-col>
          <div class="plr-20 fr">
            <el-button class type="primary" @click="searchList('formList',0)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </div>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list">
          <el-table-column label="操作人" prop="cop_admin" align="center" min-width/>
          <el-table-column label="操作ip" prop="cop_ip" align="center" width='130px'/>
          <el-table-column label="操作模块" prop="cop_mode" align="center" min-width/>
          <el-table-column label="操作功能" prop="cop_type" align="center" width='180px'/>
          <el-table-column label="操作时间" prop="cop_createtime" align="center"  width='150px'/>
          <el-table-column label="操作内容" prop="cop_content" align="center"/>
        </el-table>
      </div>
      <div class="lk-page-box" >
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalNum"
          layout="total, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
  </div>
</template>

<script>
import { logList } from '@/api/system'
import { errorStatus } from '@/utils/index'
export default {
  name: 'LogList',
  data() {
    return {
      formList: {
        cop_admin: '',
        cop_mode: '',
        cop_type: '',
        cop_content: '',
        cop_createtime_range0: '',
        cop_createtime_range1: ''
      },
      formRules: {
        cop_admin: [],
        cop_mode: [],
        cop_type: [],
        cop_content: [],
        cop_createtime_range0: [],
        cop_createtime_range1: []
      },
      list: null,
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      search_req: false
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
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
      data.page = this.currentPage
      data.cop_createtime_range0 = ''
      data.cop_createtime_range1 = ''
      logList(data)
        .then(response => {
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
          }
          loading.close()
        })
        .catch(err => {
          this.$message.error('请求失败!')
          loading.close()
          console.log('----', err)
        })
    },
    // 搜索
    searchList(formName, num) {
      const search = this.formList
      // console.log('搜索条件---', search)

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (num === 0) {
        search.page = 1
        this.currentPage = 1
      } else {
        search.page = this.currentPage
      }
      // 获取列表
      logList(search)
        .then(response => {
          // console.log('1212---', response)
          const dataRep = response.data
          // console.log("获取列表", dataRep);
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
          // console.log("1111111111111111err", err);
          this.$message.error('搜索请求失败')
        })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 页面跳转
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      if (this.search_req) {
        this.searchList('formList', 1)
      } else {
        this.getPageInfo()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .sd-module-box {
    .sd-form-box {
      .lk-time-chose {
        // .el-form-item__content {
        // width: 400px;
        span.fl {
          display: block;
          padding: 0 10px;
        }
        .lk-time-box {
          width: 100%;
          float: left;
          .el-input__inner {
            padding-right: 10px;
          }
        }
        // }
      }
    }
  }
}
</style>

<style  rel="stylesheet/scss" lang="scss">
.app-container {
  .sd-module-box {
    .sd-form-box {
      .el-date-editor.lk-time-box.el-input.el-input--medium.el-input--prefix.el-input--suffix.el-date-editor--datetime {
        .el-input__inner {
          padding-right: 10px;
        }
      }
    }
  }
}
</style>

