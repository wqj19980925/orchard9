<template>
  <div class="app-container">
    <el-row v-if='showList' class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">导航列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn"@click="enableSta(1)"> 启用 </el-button>
          <el-button v-if="btnShow.stopBtn"  class="stopCol-btn"@click="enableSta(2)"> 停用 </el-button>
          <el-button v-if="btnShow.delBtn"  class="btn-delete"  @click="delBtn(1)">删除</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="导航名称:" class="sd-form-item" prop="nav_name">
              <el-input v-model="formList.nav_name" placeholder="请输入导航名称"/>
            </el-form-item>
          </el-col>
<!--           <el-col :span="4" class="sd-col-6">
            <el-form-item label="导航样式:" class="sd-form-item" prop="nav_style">
              <el-select v-model="formList.nav_style" class>
                <el-option v-for="items in navstyle":key="items.id":label="items.name":value="items.id"/>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="4" class="sd-col-6">
            <el-form-item label="状态:" class="sd-form-item" prop="nav_state">
              <el-select v-model="formList.nav_state" class>
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="pl-50 w250">
            <el-button class type="primary" @click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list" width="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="65" align="center"/>
          <el-table-column label="导航名称" prop="nav_name" align="center"/>
         <!--  <el-table-column label="导航样式" prop="nav_style" align="center">
              <template slot-scope="scope">
              <div v-if="scope.row.nav_style=== 1">星空滑屏</div>
              <div v-if="scope.row.nav_style=== 2">炫黑滑屏</div>
              <div v-if="scope.row.nav_style=== 3">主题样式</div>
            </template>
          </el-table-column> -->
          <el-table-column label="商品引用量" prop="nav_total" align="center"/>
          <el-table-column label="状态" prop="nav_state" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.nav_state === 1">启用</div>
              <div v-if="scope.row.nav_state==2">停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button v-if="btnShow.editBtn" class="btn-mainCol"size="mini" @click="editRow(scope.row)">编辑</el-button> 
                <el-button v-if="scope.row.nav_state==2 && btnShow.startBtn"size="mini"class="openCol-btn"@click="changeSta(scope.row,1)">
                  启用
                </el-button>
                <el-button v-if="scope.row.nav_state ==1 && btnShow.stopBtn"size="mini"class="stopCol-btn"@click="changeSta(scope.row,2)">
                  停用
                </el-button>
                <el-button v-if="btnShow.delBtn" class="btn-delete"size="mini" @click="delBtn(2,scope.row)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="list.length>0" class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"
          layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
    </el-row>
    <!-- 新增页面 -->
    <addNav v-if='!showList' :edit_id='editId' @listerToChild="showListPages()"/>
  </div>
</template>
<script>
import { startNav,navList,stopNav ,delNav, editNav,addNav} from '@/api/goods'
import AddNav from './component/addNav';
import Pagination from '@/components/Pagination'
import { errorStatus } from '@/utils/index'
export default {
  name: 'TemplateList',
  components: { AddNav,Pagination },
  data() {
    return {
      showList: true,
      editId: 0,
      formList: {
        nav_name: '',
        // nav_style: '',
        nav_state:''
      },
      list: [],
      navstyle:[
        {id: 0, name: '全部'},
        {id: 1, name: '星空滑屏'},
        {id: 2, name: '炫黑滑屏'},
        {id: 3, name: '主题样式'}
        ],
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      chosed: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      search_req: false,
      rules: {
        nav_name: [],
        nav_state: [],
        // nav_style:[]
      },
      showAdd: false,
      edit_id: 0,
      btnShow: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        startBtn: false,
        stopBtn: false
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
    this.formList.nav_state = this.state[0].name
    // this.formList.nav_style = this.navstyle[0].name
  },
  methods: {
    // 获取列表信息
    getPageInfo(page) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.pri_id = this.$route.meta.pri_id
      data.page = this.currentPage
      navList(data)
        .then(response => {
          const dataRep = response.data
          console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data.navigation
            // console.log(this.list);
            this.currentPage = dataRep.data.page.page
            this.pageSize = dataRep.data.page.page_size
            this.totalNum = dataRep.data.page.count
            const btnList = dataRep.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '编辑') {
                this.btnShow.editBtn = true
              }else if (btnList[i].pri_funname === '新增') {
                this.btnShow.addBtn = true
              } else if (btnList[i].pri_funname === '删除') {
                this.btnShow.delBtn = true
              } else if (btnList[i].pri_funname === '启用') {
                this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === '停用') {
                this.btnShow.stopBtn = true
              }
            }
          }
          loading.close()
        })
        .catch(err => {
          loading.close()
          this.$message.error('请求失败!')
          console.log('---', err)
        })
    },
    // 搜索
    searchList(formName, page) {
      const search = this.formList
      //  if (
      //     search.nav_name === '' &&
      //     // search.nav_style === '全部' &&
      //     search.nav_state === '全部'
      // ) {
      //   this.$message.error('没有搜索条件')
      // }else{
        // search.pri_id = this.$route.meta.pri_id
        // console.log('---', search.pri_id)
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (search.nav_state === '全部') {
          search.nav_state = 0
        }
        // if (search.nav_style === '全部') {
        //   search.nav_style = 0
        // }
        search.pri_id = this.$route.meta.pri_id
        search.page = page
        navList(search)
          .then(response => {
            const dataRep = response.data
            // console.log('获取列表', dataRep)
            if (errorStatus(dataRep)) {
              this.list = dataRep.data.navigation
              this.currentPage =dataRep.data.page.page
              this.pageSize =dataRep.data.page.page_size
              this.totalNum =dataRep.data.page_count
            }
            loading.close()
          })
          .catch(err => {
            loading.close()
            this.$message.error('请求失败!')
            console.log('---', err)
          })
      // }
    },

    enableSta (sta) {
      const chosed = this.chosed;
      // console.log("chosed--", chosed);
      // console.log("sta--", sta);
      const list = this.list;
      if (sta === 1) {
        // console.log("000")
        if (chosed.length === 0) {
          this.$message.error('请选择要启用的导航!');
          return false
        } else {
          const id = []
          const data = {}
          for (const i in chosed) {
            if (chosed[i].nav_state === 2) {
              id.push(chosed[i].nav_id)
            }
          }
          if (id.length > 0) {
            this.$confirm('请确认,是否启用选中的导航?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              data.nav_id = id;
              startNav(data).then(response => {
                if (errorStatus(response.data)) {
                  for (const i in id) {
                    for (var j = 0; j < list.length; j++) {
                      if (id[i] === list[j].nav_id) {
                        list[j].nav_state = 1
                      }
                    }
                  }
                  // console.log(list)
                  this.list = list
                  this.$message.success('启用成功')
                }
              })
            })

          } else {
            this.$confirm('选中导航的状态全部为"启用"', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {

            }).catch(err => {
             this.$message.error('请求失败')
          }) 
          }

        }
      } else if (sta === 2) {
        if (chosed.length === 0) {
          this.$message.error('请选择要停用的导航!');
          return false
        } else {
          const id = []
          const data = {}
          for (const i in chosed) {
            if (chosed[i].nav_state === 1) {
              id.push(chosed[i].nav_id)
            }
          }
          if (id.length > 0) {
            this.$confirm('请确认,是否停用选中的导航?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              data.nav_id = id;
              stopNav(data).then(response => {
                if (errorStatus(response.data)) {
                  for (const i in id) {
                    for (var j = 0; j < list.length; j++) {
                      if (id[i] === list[j].nav_id) {
                        list[j].nav_state = 2
                      }
                    }
                  }
                  this.list = list
                  this.$message.success('停用成功')
                }
              })
            })
          } else {
            this.$confirm('选中导航的状态全部为"停用"', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
            })
          }
        }
      }

    },
      // 启用// 停用--DAN个
    changeSta (row, sta) {
      // console.log("row--", row)
      const list = this.list;
      const data = {};
      data.nav_id = [row.nav_id];
      if (sta === 1) {
          startNav(data).then(response => {
            if (errorStatus(response.data)) {
              for (var j = 0; j < list.length; j++) {
                if (row.nav_id === list[j].nav_id) {
                  list[j].nav_state = 1
                }
              }
              this.list = list
              this.$message.success('启用成功')
            }
          })
      } else {
          stopNav(data).then(response => {
            if (errorStatus(response.data)) {
              for (var j = 0; j < list.length; j++) {
                if (row.nav_id === list[j].nav_id) {
                  list[j].nav_state = 2
                }
              }
              this.list = list
              this.$message.success('停用成功')
            }
          })
      }
    },
        // 编辑
    editRow(row){
      // console.log("row--",row);
      this.editId=row.nav_id;
      this.showList = false;

    },
    // 编辑
    // editRow(row) {
    //   // console.log('row--', row)
    //   this.edit_id = row.for_id
    //   // console.log('row--', this.edit_id)
    //   this.showAdd = true
    // },
    // 增加
    addBtn () {
      this.showList = false;
      this.editId=0;
    },
    // 新增页面
    showListPages() {
      this.showList = true
      this.getPageInfo(1);
      this.editId=0;
    },
      // 删除
    delBtn (sta, row) {
      const chosed = this.chosed;
      // console.log("chosed--", chosed);
      const data = {};
      if (sta === 1) {
        if (chosed.length === 0) {
          this.$message.error('请选择要删除的导航!');
          return false
        } else {
          const id = [];
          for (const i in chosed) {
            id.push(chosed[i].nav_id)
          }
          data.nav_id = id;
          this.$confirm('请确认,是否删除选中的导航?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delNav(data).then(response => {
              if (errorStatus(response.data)) {
                this.$message.success(response.data.data);
                if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=this.currentPage-1
                }
                this.getPageInfo()
              }
            })
          })

        }

      } else {
        data.nav_id = [row.nav_id];
        this.$confirm('请确认,是否删除该导航?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delNav(data).then(response => {
            if (errorStatus(response.data)) {
              this.$message.success(response.data.data);
              this.getPageInfo()
            }
          })
        })

      }

    },
    
    addGoodsBtn() {
      this.showAdd = true
      this.edit_id = 0
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.mainColor {
  color: $mainColor;
}
</style>
