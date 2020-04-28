<!--溯源列表-->
<template>
  <!--外部整体盒子-->
  <div class="app-container">
    <!--信息筛选-->
    <el-row v-if="showList"class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">标签列表</div>
        <div class="sd-module-btn">
          <el-button class="btn-mainCol"@click="addBtn()">新增</el-button>
          <!-- <el-button @click="editClas()">编辑</el-button> -->
          <el-button class="openCol-btn"@click="enableClas()">启用</el-button>
          <el-button class="stopCol-btn"@click="stopClas()">停用</el-button>
          <el-button class="btn-delete"@click="delChoseBtn()">删除</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="formRules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="溯源标签"class="sd-form-item"prop="fla_name">
              <el-input v-model="formList.fla_name"class placeholder="请输入标签名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12"class="sd-col-6">
            <el-form-item label="状态"prop="fla_state">
              <el-select v-model="formList.fla_state"placeholder class="form-ipt-sed"style="width:80px;">
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <div class="plr-20 fr">
            <el-button class type="primary"@click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button> 
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button> 
          </div>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list"stripe style="width: 100%"highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection"width="55"/>
          <el-table-column label="溯源标签"min-width prop="fla_name"align="center"/>
          <el-table-column label="下属溯源信息量"min-width prop="count"align="center"/>
          <el-table-column label="状态"min-width align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.fla_state === '1'">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"width="320"prop align="center">
            <template slot-scope="scope">
              <el-button class="btn-mainCol"size="mini"@click="editBtn(scope.row)">
                编辑
              </el-button>
              <el-button v-if="scope.row.fla_state=='2'"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)">
                启用
              </el-button>
              <el-button v-if="scope.row.fla_state=='1'"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)">
                停用
              </el-button>
              <el-button size="mini"class="btn-mainCol"@click="delBtn(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0"class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
    </el-row>
     <!-- 弹窗 -->
    <el-dialog :visible.sync="showAddClas":title="AddClastitle":close-on-click-modal="false"width="500px"@close="cancleForm('addClaForm')">
      <el-form :inline="true" ref="addClaForm" :model="addClaForm" :rules="addClaRules" label-width="80px">
        <el-form-item  label="溯源标签" prop="fla_name">
          <el-input v-model="addClaForm.fla_name"style="width:200px;"placeholder="请输入溯源标签"maxlength="20" />
        </el-form-item>
        <el-form-item label="状态" prop="fla_state" style="width:300px">
          <el-select v-model="addClaForm.fla_state" class>
            <el-option v-for="item in diaState" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <!--<el-form-item v-if="upImgShow"label="图片列表" prop="goo_picurl" class="addGods-upload-img">
          <div class="company-logo-box">
            <div class="upload-img">
              <div v-if="allowAddImg" class="upload-img-bd">
                <div class="add-img-box" @click="fileClick">
                  <input id="fileIpt"type="file"accept="image/*"class="ipt-add"@change="changeImg($event)">
                  <span class="icon-add el-icon-plus"/>
                </div>
              </div>
              <div v-else class="img-list">
                <div class="img_show_box" @click="imgClick()">
                  <img :src="imgArr[0]" alt>
                  <input id="fileIpt"type="file"accept="image/*"class="ipt-add"@change="changeImg($event)">
                </div>
              </div>
            </div>
          </div>
        </el-form-item>-->
<!--         <div class="tip_box">此图片对消费者展示，请尽量选择符合标签名称的图片</div>-->
<!--         <el-form-item label="图片列表" >
           <span class="infor-btn-red">此图片对消费者展示，请尽量选择符合标签名称的图片</span>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addClaForm')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('addClaForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { formLabelList, formLabelStart, formLabelStop, AddFormLabel ,editFormLabel ,delFormLabel } from '@/api/trace'
import { errorStatus } from '@/utils/index'
import addtrace from './components/addtrace'
export default {
  name: 'TraceList',
  components: { addtrace },
  data() {
    return {
      editShow:false,
      showList: true,
      efla_id: 0,
      formList: {
        fla_name: '',
        fla_state: ''
      },
      dialogImageUrl: '',
      allowAddImg: true,
      dialogVisible: false,
      formRules: {
        fla_name: [],
        fla_state: []
      },
      upImgShow: true,
      imgArr: [],
      showAddClas: false,
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      addClaForm: {
        fla_name:null,
        fla_state:null,
        fla_id:null
      },
      fla_img:null,
      AddClastitle: '',
      diaState: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      addClaRules: {
        fla_name: [
          { required: true, trigger: 'blur', message: '溯源标签不能为空' }
          // { min: 1, max: 20, message: '标签名称过长,字数不可超过20', trigger: 'blur' }
        ]
      },
      list: [],
      chosed: [],
      search_req: false,
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      btnShow: {}
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
    this.formList.fla_state = this.state[0].name
  },
  methods: {
    getPageInfo() {
      const data = {}
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      data.page = this.currentPage
      data.pri_id = this.$route.meta.pri_id
      formLabelList(data)
        .then(response => {

          loading.close()
          const dataRep = response.data
          // console.log('获取列表----', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            const btnList = dataRep.button
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '添加') {
                this.$set(this.btnShow, 'addBtn', true)
              } else if (btnList[i].pri_funname === '修改') {
                this.$set(this.btnShow, 'editBtn', true)
              } else if (btnList[i].pri_funname === '复制') {
                this.$set(this.btnShow, 'copyBtn', true)
              } else if (btnList[i].pri_funname === '启用') {
                this.$set(this.btnShow, 'startBtn', true)
                // this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === '停用') {
                this.$set(this.btnShow, 'stopBtn', true)
                // this.btnShow.stopBtn = true
              }
            }
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败!')
        })
    },
    // 搜索
    searchList(formName, num) {
      const search = this.formList
      if (search.fla_state === '全部') {
        search.fla_state = 0
      }
      search.page = num

      // console.log('----', search)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      formLabelList(search).then(response => {
        const dataRep = response.data
        if (errorStatus(dataRep)) {
          loading.close()
          this.list = dataRep.data_info.data
          this.currentPage = dataRep.data_info.current_page
          this.pageSize = dataRep.data_info.current_number
          this.totalNum = dataRep.data_info.total
        }
      }).catch(Error => {
        loading.close()
      })
    },
    // 启用--这个--停用
    enableThisClas(row, num) {
      const data = {}
      data.fla_id = [row.fla_id]
      if (num === 1) {
        // 启用
        formLabelStart(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.fla_state = '1'
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 停用
        formLabelStop(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.fla_state = '2'
            }
          })
          .catch(Error => {
            // console.log("停用的信息err", err);
            this.$message.error('请求失败!')
          })
      }
    },
    // 启用
    enableClas() {
      const list = this.list
      const chosed = this.chosed
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要启用的标签!')
      } else {
        const fla_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].fla_state === "2") {
            fla_id.push(chosed[i].fla_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (fla_id.length > 0) {
          data.fla_id = fla_id
          this.$confirm('请确认,是否启用选中的标签?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              formLabelStart(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in fla_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (fla_id[i] === list[j].fla_id) {
                          list[j].fla_state = "1"
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.getPageInfo()
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的标签err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中标签的状态全部为'启用'?", '提示', {
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
        this.$message.error('请选择要停用的标签!')
      } else {
        const fla_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].fla_state === "1") {
            fla_id.push(chosed[i].fla_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (fla_id.length > 0) {
          data.fla_id = fla_id
          this.$confirm('请确认,是否停用选中的标签?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              formLabelStop(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in fla_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (fla_id[i] === list[j].fla_id) {
                          list[j].fla_state = "2"
                        }
                      }
                    }
                    // console.log(list);
                    this.getPageInfo()
                    this.list = list
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的标签err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中标签的状态全部为'停用'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    // 触发上传图片事件
    fileClick() {
      document.getElementById('fileIpt').click();
    },
    editBtn(row) {
      this.addClaForm.fla_name = row.fla_name
      this.addClaForm.fla_state = Number(row.fla_state)
      this.addClaForm.fla_id = row.fla_id
      const img_path =  row.fla_img
      const baseUrl = process.env.BASE_API
      const str = baseUrl.replace('/public', '/')
      const img=str + img_path
      this.imgArr[0] = img
      this.allowAddImg = false
      this.showAddClas = true
      this.AddClastitle = '编辑标签'
      this.editShow=true;
      this.fla_img = img
    },
    // 上传商品图片
    changeImg(e) {
      const _this = this
      _this.imgArr=[]
      const imgArrList = _this.imgArr
      // 利用fileReader对象获取file
      var file = e.target.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        var imgcode = e.target.result
        _this.fla_img = imgcode
        // console.log(imgcode);
        const leng = imgArrList.length
        imgArrList.splice(leng, 0, imgcode)
        _this.allowAddImg = false
      }
    },
    imgClick() {
      document.getElementById('fileIpt').click()
    },
    cancleForm(formName) {
      this.showAddClas = false
      this.$refs[formName].resetFields()
      this.imgArr=[]
      this.addClaForm.fla_name = ''
      this.addClaForm.fla_state = ''
      this.allowAddImg=true
      this.editShow = false
    },
      // 弹窗-增加-提交
    addsubBtn(formName) {
      const addClas = this.addClaForm
      const data ={}
       if(this.addClaForm.fla_name == null){
         this.$message.error('请输入标签名称!')
         return false
       }
       if(this.addClaForm.fla_state == null){
         this.$message.error('请选择状态!')
         return false
       }
       // if(this.fla_img == null){
       //   this.$message.error('请上传图片!')
       //   return false
       // }
      data.fla_name=this.addClaForm.fla_name
      data.fla_state=this.addClaForm.fla_state
      data.fla_img =this.fla_img

      if(this.editShow === false){
        AddFormLabel(data)
        .then(response => {
          // console.log('addAgric---', response)
          if (errorStatus(response.data)) {
            this.$message.success('提交成功!')
            this.showAddClas = false
            this.$refs[formName].resetFields()
            this.addClaForm.fla_name = ''
            this.addClaForm.fla_state = ''
            this.imgArr =[]
            this.allowAddImg = true
            this.getPageInfo()
          }
        })
        .catch(err => {
          console.log('err', err)
          this.$message.error('请求失败!')
        })
      }else{
        data.fla_id=this.addClaForm.fla_id
        editFormLabel(data).then(response => {
          // console.log('addAgric---', response)
          if (errorStatus(response.data)) {
            this.$message.success('编辑成功!')
            this.showAddClas = false
            this.$refs[formName].resetFields()
            this.addClaForm.fla_name = ''
            this.addClaForm.fla_state = ''
            this.imgArr =[]
            this.allowAddImg = true
            this.getPageInfo()
          }
        })
        .catch(err => {
          console.log('err', err)
          this.$message.error('请求失败!')
        })
      }
      
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的标签!')
      } else {
        const data = {}
        data.fla_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.fla_id.push(chosed[i].fla_id)
        }
        this.$confirm('请确认,是否删除所选中的标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delFormLabel(data)
            .then(response => {
              if (errorStatus(response.data)) {
                if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=1
                }
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
    // 删除-这个
    delBtn(row) {
      // console.log('del---row', row)
      const data = {}
      const fla_id = []
      fla_id.push(row.fla_id)
      data.fla_id = fla_id
      // console.log('删除---', data)
      this.$confirm('请确认,是否删除所选中的标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFormLabel(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('删除成功')
              if(this.currentPage!==1 && this.list.length===1){
                this.currentPage=1
              }
              this.getPageInfo()
            }
          })
          .catch(Error => {
            this.$message.error('请求失败')
          })
      })
    },
    // 新增
    addBtn() {
      this.showAddClas = true
      this.AddClastitle = '新增标签'
      this.efla_id = 0
    },
    
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
      this.showList = true
      this.getPageInfo()
    }
  }
}
</script>

<style>
    .upload-img-bd {
      float: left;
      border: 1px dashed #ddd;
      width: 165px;
      height: 90px;
      cursor: pointer; 
    }
     .icon-add {
        width: 165px;
        height: 90px;
        line-height: 90px;
        text-align: center;
        display: block;
      }
      .ipt-add {
        display: none;
      }
    .img-list {
      float: left;
      margin-right: 10px;
      
    }
     .tip_box{
      margin-left:80px;
      color: #f35e5e;
      font-size: 12px;
      line-height: 20px;
       font-color: #F56C6C;
    }
.img_show_box {
    width: 120px;
      height: 120px;
      position: relative;
      overflow: hidden;
      cursor: pointer; 
      }
    img {
          width: 100%;
          height:100%
        }
    .img_delete {
      position: absolute;
      top: 0px;
      right: 0px;
      display: block;
      width: 20px;
      height: 20px;
      font-size: 20px;
      color: #f00;
      cursor: pointer;
    }
</style>
