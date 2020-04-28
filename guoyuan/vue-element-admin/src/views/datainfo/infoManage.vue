<template>
  <div class="app-container">
    <el-row v-if="!showAdd" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">信息推送</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addInfoBtn()">新增</el-button>
          <el-button v-if="btnShow.delBtn"  @click="delChoseBtn()">删除</el-button>
          <!-- v-if="btnShow.addBtn" v-if="btnShow.startBtn" v-if="btnShow.stopBtn" v-if="btnShow.outBtn"  v-if="btnShow.delBtn" -->
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="6" class="sd-col-6">
            <el-form-item label="标题名称" class="sd-form-item" prop="info_title">
              <el-input v-model="formList.info_title" class placeholder="请输入标题名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="消息类型" class="sd-form-item" prop="info_type">
              <el-select v-model="formList.info_type" class>
                <el-option v-for="item in infoType":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="重要程度" class="sd-form-item" prop="info_level">
              <el-select v-model="formList.info_level" class>
                <el-option v-for="item in impDegree":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="状态：" class="sd-form-item" prop="info_state">
              <el-select v-model="formList.info_state" class>
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <div class="plr-20 fr">
            <el-button class type="primary" @click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </div>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list" width="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column label="创建时间" prop="info_create_time" min-width align="center"/>
          <el-table-column label="标题名称" prop="info_title" align="center" :show-overflow-tooltip="true" 
          width="150"/>
          <el-table-column label="消息类型" prop="cla_name" align="center" width="100"> 
             <template slot-scope="scope">
              <div v-if="scope.row.info_type == 1">信息通知</div>
              <div v-else>病虫害预警</div>
            </template>
          </el-table-column>
          <el-table-column label="重要程度" prop="goo_code_percent" align="center" width="80">
             <template slot-scope="scope">
              <div v-if="scope.row.info_level == 1">一般</div>
              <div v-if="scope.row.info_level == 2">重要</div>
              <div v-if="scope.row.info_level == 3">紧急</div>
            </template>
          </el-table-column>
          <el-table-column label="添加人" prop="info_adm_name" align="center"/>
          <el-table-column label="发布时间" prop="info_issue_time" align="center"/>
          <el-table-column label="发布对象" prop="region_name" align="center"/>
          <el-table-column label="阅读量" prop="info_read" align="center" width="120"/>
          <el-table-column label="状态" align="center" width="70">
            <template slot-scope="scope">
              <div v-if="scope.row.info_state == 1">未发布</div>
              <div v-if="scope.row.info_state == 2">已发布</div>
              <div v-if="scope.row.info_state == 3">已撤回</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button v-if="scope.row.info_state===1 && btnShow.editBtn"size="mini"class="btn-mainCol"@click="editRow(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.info_state===2 && btnShow.recallBtn" size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,1)">
                  撤回
                </el-button>
                <el-button v-if="scope.row.info_state===1  && btnShow.pubBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,2)">
                  发布
                </el-button>
                <el-button v-if="scope.row.info_state===3  && btnShow.rePubBtn"size="mini" @click="enableThisClas(scope.row,3)">
                  再发布
                </el-button>
                <el-button size="mini" v-if="scope.row.info_state !==1 && btnShow.delBtn" class="btn-delete" @click="delRow(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="list.length>0" class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
    </el-row>
    <!-- 新增页面 -->
    <addInfo v-if="showAdd" :edit-id="edit_id" :state="infostate" @listerToChild="showListPages()"/>
  </div>
</template>
<script>
import { InfoManList, addThisInfo, uploadImg, editThisInfo, recallInfo, pubThisInfo, delThisInfo } from '@/api/map'
import { errorStatus } from '@/utils/index'
import {  getToken } from '@/utils/auth'
import addInfo from './components/addInfo'
export default {
  name: 'InfoManList',
  components: { addInfo },
  data() {
    return {
      formList: {
        info_title: '',
        info_type: '',
        info_level: '',
        info_state: ''
      },
      rules: {
        info_title: [],
        info_type: [],
        info_level: [],
        info_state: []
      },
      list: [],
      infostate:'',
      infoType:[
        { id: 0, name: '全部' },
        { id: 1, name: '信息通知 ' },
        { id: 2, name: '病虫害预警'},
      ],
      impDegree:[
        { id: 0, name: '全部' },
        { id: 1, name: '一般' },
        { id: 2, name: '重要' },
        { id: 3, name: '紧急' }
      ],
      edit_id:'',
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '未发布' },
        { id: 2, name: '已发布' },
        { id: 3, name: '已撤回' }
      ],
      showAdd:false,
      chosed: '',
      currentPage: 1,
      pageSize: 10,
      totalNum: 50,
      search_req: false, // 是否为搜索状态
      edit:'',
      btnId:0,
      btnShow: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        recallBtn: false,
        pubBtn: false,
        rePubBtn:false
      }
    }
  },
  watch: {
    $route() {
      this.getPageInfo()
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
    // this.formList.godsType = this.godsType[0].name;
    this.formList.info_state = this.state[0].name
    this.formList.info_level = this.impDegree[0].name
    this.formList.info_type = this.infoType[0].name
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
      data.pri_id = this.$route.meta.pri_id
      // 获取列表
      InfoManList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data_info
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total

            // 获取按钮
            const btnList = dataRep.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '新增') {
                this.btnShow.addBtn = true
              } else if (btnList[i].pri_funname === '编辑') {
                this.btnShow.editBtn = true
              } else if (btnList[i].pri_funname === '删除') {
                this.btnShow.delBtn = true
              } else if (btnList[i].pri_funname === '撤回') {
                this.btnShow.recallBtn = true
              } else if (btnList[i].pri_funname === '发布') {
                this.btnShow.pubBtn = true
              } else if (btnList[i].pri_funname === '再发布') {
                this.btnShow.rePubBtn = true
              } 
            }
          }
        })
        .catch(err => {
          loading.close()
          this.$message.error('请求失败!')
          console.log('err', err)
        })
    },
    // 搜索
    searchList(formName, page) {
      const search = this.formList
      // console.log('---', search)
      search.pri_id=this.$route.meta.pri_id
      // if (
      //   search.info_title === '' &&
      //   search.info_type === '全部' &&
      //   search.info_level === '全部' &&
      //   search.info_state === '全部'
      // ) {
      //   this.$message.error('没有搜索条件')
      // } else {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (search.info_state === '全部' || search.info_state === 0) {
          search.info_state = ''
        }
        if (search.info_type === '全部' || search.info_type === 0) {
          search.info_type = ''
        }
         if (search.info_level === '全部' || search.info_level === 0) {
          search.info_level = ''
        }
        // search.page = page

        // 获取列表
        InfoManList(search)
          .then(response => {
            // console.log('获取列表', response)
            const dataRep = response.data

            // console.log("获取列表", dataRep);
            if (errorStatus(dataRep)) {
              this.list = dataRep.data_info.data_info
              this.currentPage = dataRep.data_info.current_page
              this.pageSize = dataRep.data_info.current_number
              this.totalNum = dataRep.data_info.total
              this.search_req = true
            }
            loading.close()
          })
          .catch(Error => {
            loading.close()
            this.$message.error('获取列表失败')
          })
      // }
    },
    // 新增
    addInfoBtn() {
      this.showAdd = true
      this.edit_id = 0

    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    
    // 撤回--这个--发布
    enableThisClas(row, num) {
      const data = {}
      data.info_id = [row.info_id]
      if (num === 1) {
        // 撤回
        recallInfo(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('撤回成功!')
              row.info_state = 3
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 发布
         data.info_id = row.info_id
        pubThisInfo(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('发布成功!')
              row.info_state = 2
              this.getPageInfo()
            }
          })
          .catch(Error => {
            // console.log("发布的信息err", err);
            this.$message.error('请求失败!')
          })
      }else if (num === 3) {
        // 再次发布
        data.type=1
         data.info_id = row.info_id
        pubThisInfo(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('再次发布成功!')
              row.info_state = 2
            }
          })
          .catch(Error => {
            // console.log("发布的信息err", err);
            this.$message.error('请求失败!')
          })
      }

    },

    // 编辑
    editRow(row) {
      this.edit_id = row.info_id
      this.infostate=row.info_state
      this.showAdd = true
      this.btnId = 1
    },
    //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的信息!')
      } else {
        const data = {}
        data.info_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.info_id.push(chosed[i].info_id)
        }
        this.$confirm('请确认,是否删除所选中的信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delThisInfo(data)
            .then(response => {
              // console.log('delThisInfo---', response)
              if (errorStatus(response.data)) {
                this.currentPage = 1
                this.$message.success('删除成功!')
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
      }
    },
    // 删除-这个
    delRow(row) {
      // console.log('del---row', row)
      const data = {}
      const info_id = []
      info_id.push(row.info_id)
      data.info_id = info_id
      // console.log('删除---', data)
      this.$confirm('请确认,是否删除所选中的信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delThisInfo(data)
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
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
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
      this.showAdd = false
      this.getPageInfo()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.mainColor {
  color: $mainColor;
}
.el-dialog__body .list_data_add .tip_box{
    color: #f35e5e;
    font-size: 12px;
    line-height: 20px;
}
.el-dialog__body .list_data_add .download_text button{
    color: #409EFF;
    width: 120px;
}
.el-dialog__body .list_data_add .download_text[data-v-0910273e] {
    padding-left: 100px;
}

</style>
<style>
.map_chose_loca{
  position:relative;
}
.map_chose_loca .askmap{
    width: 400px;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
  }
.wscnph{
  width:100%;
}
.el-tooltip__popper{
  max-width: 400px;
  line-height: 180%;
}
</style>