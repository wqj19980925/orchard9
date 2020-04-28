<!--溯源列表-->
<template>
  <!--外部整体盒子-->
  <div class="app-container">
    <!--信息筛选-->
    <el-row v-if="showList"class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">异常处理</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.exceptBtn" class="btn-mainCol"@click="editBtn()">异常处理</el-button>
          <!-- <el-button @click="editClas()">编辑</el-button> -->
          <el-button v-if="btnShow.showBtn" class="openCol-btn"@click="enableClas()">显示</el-button>
          <el-button v-if="btnShow.hideBtn" class="stopCol-btn"@click="stopClas()">隐藏</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete"@click="delChoseBtn()">删除</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="formRules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="10"class="sd-col-6">
           <el-form-item label="提交时间:"class="sd-form-item"prop='con_createtime_range0'>
              <el-date-picker v-model="formList.con_createtime_range0"type="datetime"placeholder="提交时间"value-format="yyyy-MM-dd HH:mm:ss"style='width:225px;':picker-options='pickerDateBefore'>
              </el-date-picker>
               至
               <el-date-picker v-model="formList.con_createtime_range1" type="datetime" style="width:225px" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter'/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="质检单位:" class="sd-form-item" prop="dla_name">
              <el-input v-model="formList.dla_name" placeholder="请输入质检单位" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="质检编号:" class="sd-form-item" prop="con_number">
              <el-input v-model="formList.con_number" placeholder="请输入质检编号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="提交人:" class="sd-form-item" prop="adm_name">
              <el-input v-model="formList.adm_name" placeholder="请输入提交人" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="果园名称:" class="sd-form-item" prop="region_name">
              <el-input v-model="formList.region_name" placeholder="请输入果园名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="商品品类:" class="sd-form-item" prop="cla_name">
              <el-input v-model="formList.cla_name" placeholder="请输入商品品类" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="商品名称:" class="sd-form-item" prop="goo_name">
              <el-input v-model="formList.goo_name" placeholder="请输入商品名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="状态"prop="con_state">
              <el-select v-model="formList.con_state"placeholder class="form-ipt-sed">
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
        <el-table :data="list" stripe style="width: 100%"highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection"width="55"/>
          <el-table-column label="提交时间"min-width prop="con_create_time"align="center" width="150"/>
          <el-table-column label="果园名称"min-width prop="region_name"align="center" width="100"/>
          <el-table-column label="商品信息"min-width prop="cla_name"align="center" >
            <template slot-scope="scope">
              <div align="left">
                <span class="blue">商品品类:</span>{{scope.row.cla_name}}<br/>
                <span class="blue">商品名称:</span>{{scope.row.goo_name}}<br/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="质检信息"min-width prop="cla_name"align="center">
            <template slot-scope="scope">
              <div align="left">
                <span class="blue">质检编号:</span>{{scope.row.con_number}}<br/>
                <span class="blue">质检单位:</span>{{scope.row.dla_name}}<br/>
                <span class="blue">质检结果:</span>
                  <span v-if="scope.row.con_result  === 1">合格</span>
                  <span v-else>不合格</span>
                  <br/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="溯源码引用量"min-width prop="con_code_num"align="center"  width="120"/>
          <el-table-column label="处理结果"min-width prop="con_result_msg"align="center"  width="120"/>
          <el-table-column label="处理人"min-width prop="con_adm_name"align="center"  width="120"/>
          <el-table-column label="状态"min-width align="center" width="70">
            <template slot-scope="scope">
              <div v-if="scope.row.con_state === 1">显示</div>
              <div v-else>隐藏</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"width="320"prop align="center">
            <template slot-scope="scope">
              <el-button v-if="btnShow.exceptBtn" class="btn-mainCol"size="mini"@click="editthisBtn(scope.row)">
                异常处理
              </el-button>
              <el-button v-if="scope.row.con_state==2  && btnShow.showBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)">
                显示
              </el-button>
              <el-button v-if="scope.row.con_state==1  && btnShow.hideBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)">
                隐藏
              </el-button>
              <el-button v-if="btnShow.delBtn" size="mini"class="btn-delete"@click="delBtn(scope.row)">
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
       
        <el-form-item  label="处理结果" prop="result_msg">
           <el-input type="textarea" :rows="5" maxlength="200" v-model="addClaForm.result_msg" style='width:300px'placeholder="请输入处理结果"  />
        </el-form-item>
        
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addClaForm')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('addClaForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { handleList, showException, hideException,delException, handleQuality } from '@/api/ProductManage'
import { errorStatus } from '@/utils/index'

export default {
  name: 'TraceList',
  data() {
    return {
      editShow:false,
      showList: true,
      econ_id: 0,
      companyList:[],
      channelList:[],
      farmerList:[],
      regionList:[],
      classList:[],
      goodsList:[],
      imgArr: [],
      quaState:[
        {id:1,name:'合格'},
        {id:2,name:'不合格'},
      ],
      formList: {
        con_createtime_range0:'',
        con_createtime_range1:'',
        region_name:'',
        cla_name:'',
        goo_name:'',
        dla_name:'',
        adm_name: '',
        con_state: '',
        con_number:''
      },
      dialogImageUrl: '',
      allowAddImg: true,
      dialogVisible: false,
      formRules: {
        adm_name: [],
        con_state: []
      },
      upImgShow: true,
      imgArr: [],
      showAddClas: false,
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '显示' },
        { id: 2, name: '隐藏' }
      ],
      addClaForm: {
        result_msg:'',
      },
      fla_img:null,
      AddClastitle: '异常处理',
      addClaRules: {
        fla_name: [
          { required: true, trigger: 'blur', message: '溯源标签不能为空' }
          // { min: 1, max: 20, message: '分类名称过长,字数不可超过20', trigger: 'blur' }
        ]
      },
      list: [],
      chosed: [],
      search_req: false,
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      btnShow: {},
      con_id:[],
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.formList.con_createtime_range0;
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
          let DateVal = this.formList.con_createtime_range1;
          if (DateVal) {
            return time.getTime() < DateVal||time.getTime() > _now;
          } else {
            return time.getTime() > _now;
          }
        }
      },
      pickerDateBefore1: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.addClaForm.con_qc_time;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      },
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
    this.formList.con_state = this.state[0].name
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
      handleList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表----', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data_info.data_info
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            const btnList = dataRep.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '处理') {
                this.$set(this.btnShow, 'exceptBtn', true)
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(this.btnShow, 'delBtn', true)
              } else if (btnList[i].pri_funname === '显示') {
                this.$set(this.btnShow, 'hideBtn', true)
                // this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === '隐藏') {
                this.$set(this.btnShow, 'showBtn', true)
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
      if (search.con_state === '全部') {
        search.con_state = 0
      }
      search.pri_id = this.$route.meta.pri_id
      search.page = num

      // console.log('----', search)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      handleList(search).then(response => {
        const dataRep = response.data
        if (errorStatus(dataRep)) {
          loading.close()
          this.list = dataRep.data_info.data_info
          this.currentPage = dataRep.data_info.current_page
          this.pageSize = dataRep.data_info.current_number
          this.totalNum = dataRep.data_info.total
        }
      }).catch(Error => {
        loading.close()
      })
    },

        // 弹窗-增加-提交
    addsubBtn(formName) {
      const data =this.addClaForm
      data.con_id=this.con_id
        handleQuality(data).then(response => {
          // console.log('addAgric---', response)
          const dataRep=response.data
          if (errorStatus(dataRep)) {
            this.$message.success(dataRep.data)
            this.showAddClas = false
            this.$refs[formName].resetFields()
            this.getPageInfo()
          }
        })
        .catch(err => {
          console.log('err', err)
          this.$message.error('请求失败!')
        })
      
    },
    // 显示--这个--隐藏
    enableThisClas(row, num) {
      const data = {}
      data.con_id = [row.con_id]
      if (num === 1) {
        // 显示
        showException(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('显示成功!')
              row.con_state = 1
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 隐藏
        hideException(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('隐藏成功!')
              row.con_state = 2
            }
          })
          .catch(Error => {
            // console.log("隐藏的信息err", err);
            this.$message.error('请求失败!')
          })
      }
    },
    // 显示
    enableClas() {
      const list = this.list
      const chosed = this.chosed
      // console.log('选择的数据--', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要显示的信息!')
      } else {
        const con_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].con_state === 2) {
            con_id.push(chosed[i].con_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (con_id.length > 0) {
          data.con_id = con_id
          this.$confirm('请确认,是否显示选中的信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              showException(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in con_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (con_id[i] === list[j].con_id) {
                          list[j].con_state = 1
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
                  console.log('显示的信息err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消隐藏");
            })
        } else {
          this.$confirm("选中信息的状态全部为'显示'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    // 隐藏
    stopClas() {
      const list = this.list
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要隐藏的信息!')
      } else {
        const con_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].con_state === 1) {
            con_id.push(chosed[i].con_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (con_id.length > 0) {
          data.con_id = con_id
          this.$confirm('请确认,是否隐藏选中的信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              hideException(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in con_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (con_id[i] === list[j].con_id) {
                          list[j].con_state = 2
                        }
                      }
                    }
                    // console.log(list);
                    this.getPageInfo()
                    this.list = list
                    this.$message.success('隐藏成功!')
                  }
                })
                .catch(err => {
                  console.log('显示的信息err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消隐藏");
            })
        } else {
          this.$confirm("选中信息的状态全部为'隐藏'?", '提示', {
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
    editBtn() {
     const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要处理异常的信息!')
      } else {
        const con_id = []
        for (const i in chosed) {
          con_id.push(chosed[i].con_id)
        }
        this.con_id=con_id
        this.showAddClas = true
        this.AddClastitle = '异常处理'
      }
    },
    editthisBtn(row){
      const con_id = []
      con_id.push(row.con_id)
      this.con_id=con_id
      this.showAddClas = true
      this.AddClastitle = '异常处理'
    },
    // 上传商品图片
    changeImg(e) {
      const _this = this
      const imgArrList = _this.imgArr
      // 利用fileReader对象获取file
      var file = e.target.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        var imgcode = e.target.result
        // console.log(imgcode);
        const leng = imgArrList.length
        imgArrList.splice(leng, 0, imgcode)
        console.log('length--', leng)
        if (leng === 4) {
          _this.allowAddImg = false
        }
      }
    },
    // 删除商品图片
    deleteGoodsImg(index) {
      console.log('---', index)
      this.imgArr.splice(index, 1)
      if (this.imgArr.length < 5) {
        this.allowAddImg = true
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
      this.addClaForm.con_state = ''
      this.allowAddImg=true
      this.editShow = false
    },
  
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的渠道信息!')
      } else {
        const data = {}
        data.con_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.con_id.push(chosed[i].con_id)
        }
        this.$confirm('请确认,是否删除所选中的渠道信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delException(data)
            .then(response => {
              if (errorStatus(response.data)) {
                if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=this.currentPage-1
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
      const con_id = []
      con_id.push(row.con_id)
      data.con_id = con_id
      // console.log('删除---', data)
      this.$confirm('请确认,是否删除所选中的信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delException(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('删除成功')
              this.getPageInfo()
            }
          })
          .catch(Error => {
            this.$message.error('请求失败')
          })
      })
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
      width: 120px;
      height: 90px;
      cursor: pointer; 
    }
     .icon-add {
        width:120px;
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

.img_show_box {
      width: 120px;
      height:90px;
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
    .addqualistyle{
      height:20px; 
      line-height: 20px;
      background:#edeff2;
      text-align:center;
      font-size:15px;
      margin-top:-15px;
      margin-bottom:25px
    }
</style>
