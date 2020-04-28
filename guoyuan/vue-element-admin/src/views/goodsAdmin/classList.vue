  <template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">品类列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addClasClick()">新增</el-button>
          <!-- <el-button @click="editClas()">编辑</el-button> -->
          <el-button v-if="btnShow.startBtn" class="openCol-btn" @click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn" @click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delChoseBtn()">删除</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules_sech"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="商品品类:" class="sd-form-item" prop="cla_name">
              <el-input v-model="formList.cla_name" placeholder="请输入品类名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="sd-col-6">
            <el-form-item label="状态:" class="sd-form-item" prop="cla_stase">
              <el-select v-model="formList.cla_stase" class style="width:80px;">
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
          <el-table-column  type="selection" width="55"/>
          <!-- <el-table-column prop='id' width='0'></el-table-column> -->
          <el-table-column label="商品品类" prop="cla_name" min-width align="center"/>
          <el-table-column label="下属商品数量" prop="cla_total" align="center"/>
          <el-table-column label="状态" prop="cla_stase" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.cla_stase == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" align="center">
            <template slot-scope="scope">
              <div>
                <el-button size="mini"class="btn-mainCol" v-if="btnShow.editBtn" @click="editClas(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.cla_stase == 1 && btnShow.stopBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)"> 停用
                </el-button>
                <el-button v-if="scope.row.cla_stase == 2 && btnShow.startBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)"> 启用
                </el-button>
                <el-button v-if="btnShow.delBtn" size="mini"class="btn-delete"@click="delBtn(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="list.length>0" class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog :visible.sync="showAddClas":title="AddClastitle":close-on-click-modal="false"width="500px"@close="cancleForm('addClaForm')">
      <el-form ref="addClaForm" :model="addClaForm" :rules="addClaRules" label-width="80px">
        <el-form-item :class="errInpt?'bdRed':''" label="品类名称" prop="cla_name">
          <el-input v-model="addClaForm.cla_name"style="width:200px;"placeholder="请输入品类名称"max="20"@blur="blurClass($event)" maxlength="20"/>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-select v-model="addClaForm.cla_stase" class>
            <el-option v-for="item in diaState" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addClaForm')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('addClaForm')">提 交</el-button>
      </span>
    </el-dialog>
    <!-- <div>{{LocationCity}}</div>   -->
  </div>

</template>
<script>
import { ClasList, addClass, editClass, delClas, openClas, stopeClas } from '@/api/goods'
import { errorStatus } from '@/utils/index'
import { getUserid } from '@/utils/auth'
import { getByteLen } from '@/utils/validate'
// import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'; // 局部注册
// import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'; //标记 点
export default {
  name: 'ClassList',
  data() {
    return {
       LocationCity:"正在定位",
      formList: {
        cla_name: '',
        cla_stase: ''
      },
      rules_sech: {
        cla_name: [],
        cla_stase: []
      },
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      list: [],
      chosed: '',
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addClaSta: null, // 判断是新增还是编辑 1新增 2编辑
      addClaForm: {
        cla_name: '',
        cla_stase: '',
        cla_id: null
      },
      diaState: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      addClaRules: {
        cla_name: [
          { required: true, trigger: 'blur', message: '品类名称不能为空' }
          // { min: 1, max: 20, message: '品类名称过长,字数不可超过20', trigger: 'blur' }
        ]
      },
      AddClastitle: '',
      search_req: false,
      btnShow: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        startBtn: false,
        stopBtn: false
      },
      errInpt: false
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
    // this.city() 
    this.formList.cla_stase = this.state[0].name
    this.addClaForm.cla_stase = this.diaState[0].name
  },
  methods: {
    //   city(){    //定义获取城市方法
    //     const geolocation = new BMap.Geolocation();
    //     var _this = this
    //     geolocation.getCurrentPosition(function getinfo(position){
    //         let city = position.address.city;             //获取城市信息
    //         let province = position.address.province;    //获取省份信息
    //         _this.LocationCity = city
    //     }, function(e) {
    //         _this.LocationCity = "定位失败"
    //     }, {provider: 'baidu'});    
    // },

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
      ClasList(data)
        .then(response => {
          
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            this.search_req = false
            const btnList = dataRep.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '新增') {
                this.btnShow.addBtn = true
              } else if (btnList[i].pri_funname === '编辑') {
                this.btnShow.editBtn = true
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
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败!')
          // console.log("获取列表err", err);
        })
    },
    // 搜索
    searchList(formName, page) {
      const search = this.formList
      search.pri_id = this.$route.meta.pri_id
      // console.log('---', search)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (search.cla_stase === '全部') {
        search.cla_stase = 0
      }
      search.page = page
      // 获取列表
      ClasList(search)
        .then(response => {
          // console.log('获取列表', response)
          const dataRep = response.data
          // console.log('获取列表---', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            this.search_req = true
          }
          loading.close()
        })
        .catch(Error => {
          loading.close()
          this.$message.error('获取列表失败')
        })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 启用
    enableClas() {
      const list = this.list
      const chosed = this.chosed
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要启用的品类!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].cla_stase === 2) {
            id.push(chosed[i].cla_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.cla_id = id
          data.adm_id = getUserid()
          this.$confirm('请确认,是否启用选中的品类?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              openClas(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].cla_id) {
                          list[j].cla_stase = 1
                        }
                      }
                    }
                    this.getPageInfo()
                    // console.log(list)
                    this.list = list
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的品类err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中品类的状态全部为'启用'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    // 停用
    stopClas() {
      const list = this.list
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要停用的品类!')
      } else {
        const id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].cla_stase === 1) {
            id.push(chosed[i].cla_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (id.length > 0) {
          data.cla_id = id
          data.adm_id = getUserid()
          this.$confirm('请确认,是否停用选中的品类?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              stopeClas(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in id) {
                      for (var j = 0; j < list.length; j++) {
                        if (id[i] === list[j].cla_id) {
                          list[j].cla_stase = 2
                        }
                      }
                    }
                    this.getPageInfo()
                    // console.log(list)
                    this.list = list
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的品类err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中品类的状态全部为 '停用' ?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      // console.log('---', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的品类!')
      } else {
        const data = {}
        data.cla_id = []
        for (const i in chosed) {
          data.cla_id.push(chosed[i].cla_id)
        }
        this.$confirm('请确认,是否删除所选中的品类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delClas(data)
            .then(response => {
              // console.log('delClas---', response)
              if (errorStatus(response.data)) {
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
    // 启用--这个--停用
    enableThisClas(row, num) {
      const data = {}
      data.cla_id = [row.cla_id]
      data.adm_id = getUserid()
      // console.log("num", num);
      // console.log("data", data);
      if (num === 1) {
        // 启用
        openClas(data)
          .then(response => {
            // console.log("openClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.cla_stase = num
            }
          })
          .catch(Error => {
            // console.log("启用的品类err", err);
            this.$message.error('启用失败!')
          })
      } else {
        // 停用
        stopeClas(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.cla_stase = num
            }
          })
          .catch(Error => {
            // console.log("停用的品类err", err);
            this.$message.error('停用失败!')
          })
      }
    },
    // 删除-这个
    delBtn(row) {
      const data = {}
      // console.log('删除--', row)
      data.cla_id = [row.cla_id]
      data.adm_id = getUserid()
      this.$confirm('请确认,是否删除该品类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delClas(data)
          .then(response => {
            // console.log('delClas---', response)
            if (errorStatus(response.data)) {
              this.$message.success('删除成功!')
              if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=this.currentPage-1
                }
              this.getPageInfo()
            }
          })
          .catch(Error => {
            // console.log("停用的品类err", err);
            this.$message.error('删除请求失败!')
          })
      })
    },
    // 新增-
    addClasClick() {
      this.addClaSta = 1
      this.showAddClas = true
      this.AddClastitle = '新增品类'
    },
    // 编辑
    editClas(row) {
      this.addClaForm.cla_name = row.cla_name
      this.addClaForm.cla_id = row.cla_id
      // console.log('1111', row)
      if (row.cla_stase === 1) {
        this.addClaForm.cla_stase = '启用'
      } else {
        this.addClaForm.cla_stase = '停用'
      }
      this.showAddClas = true
      this.addClaSta = 2
      this.AddClastitle = '编辑品类'
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
    blurClass(e) {
      const val = e.target.value
      if (getByteLen(val) > 12) {
        this.$message.error('品类名称过长,汉字10个字以内,英文20字符以内!')
        return false
      }
    },

    // 弹窗-增加-提交
    addsubBtn(formName) {
      // console.log('login--', this.addClaForm)
      const addClas = this.addClaForm
      const addClaSta = this.addClaSta
      if (addClas.cla_name === '') {
        this.$message.error('请输入品类名称!')
        return false
      } else {
        if (addClas.cla_stase === '启用') {
          addClas.cla_stase = 1
        }
        if (addClas.cla_stase === '停用') {
          addClas.cla_stase = 2
        }
        if (getByteLen(addClas.cla_name) > 20) {
          this.$message.error('品类名称过长,汉字10个字以内,英文20字符以内!')
          return false
        }

        // console.log('data---addClas', addClas)
        if (addClaSta === 1) {
          delete addClas.cla_id
          addClass(addClas)
            .then(response => {
              // console.log('addClass---', response)
              if (errorStatus(response.data)) {
                this.$message.success('提交成功!')
                this.showAddClas = false
                this.$refs[formName].resetFields()
                this.addClaForm.cla_name = ''
                this.addClaForm.cla_id = ''
                this.addClaForm.cla_stase = this.diaState[0].name
                this.getPageInfo()
              }
            })
            .catch(err => {
              console.log('err', err)
              this.$message.error('请求失败!')
            })
        } else if (addClaSta === 2) {
          editClass(addClas)
            .then(response => {
              // console.log('editClass---', response)
              if (errorStatus(response.data)) {
                this.$message.success('提交成功!')
                this.showAddClas = false
                this.$refs[formName].resetFields()
                this.addClaForm.cla_name = ''
                this.addClaForm.cla_id = ''
                this.addClaForm.cla_stase = this.diaState[0].name
                this.getPageInfo()
              }
            })
            .catch(err => {
              console.log('err', err)
              this.$message.error('请求失败!')
            })
        }
      }
    },
    cancleForm(formName) {
      this.showAddClas = false
      this.$refs[formName].resetFields()
      this.addClaForm.cla_name = ''
      this.addClaForm.cla_id = ''
      this.addClaForm.cla_stase = this.diaState[0].name
    }
  }
}
</script>
<style scoped >
.bdRed .el-form-item__content .el-input .el-input__inner {
  border: 1px solid red !important;
}
</style>
