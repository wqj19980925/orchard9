<!--溯源列表-->
<template>
  <!--外部整体盒子-->
  <div class="app-container">
    <!--信息筛选-->
    <el-row v-if="showList"class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">质检列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol"@click="addBtn()">新增</el-button>
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
              <el-date-picker v-model="formList.con_createtime_range0"type="datetime"placeholder="选择开始日期"value-format="yyyy-MM-dd HH:mm:ss"style='width:225px;':picker-options='pickerDateBefore'>
              </el-date-picker>
               至
               <el-date-picker v-model="formList.con_createtime_range1" type="datetime" style="width:225px" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter'/>
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
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="质检单位:" class="sd-form-item" prop="dla_name">
              <el-input v-model="formList.dla_name" placeholder="请输入质检单位" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="sd-col-6">
            <el-form-item label="提交人:" class="sd-form-item" prop="adm_name">
              <el-input v-model="formList.adm_name" placeholder="请输入提交人" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="状态:"prop="con_state">
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
          <el-table-column label="商品信息"min-width prop="cla_name"align="center" >
            <template slot-scope="scope">
              <div align="left">
                <span class="blue">商品品类:</span>{{scope.row.cla_name}}<br/>
                <span class="blue">商品名称:</span>{{scope.row.goo_name}}<br/>
              </div>
            </template>
          </el-table-column>
        <!-- <el-table-column label="商品品类"min-width prop="cla_name"align="center"/>
          <el-table-column label="商品名称"min-width prop="goo_name"align="center"/> -->
          <el-table-column label="质检信息"min-width prop="cla_name"align="center">
            <template slot-scope="scope">
              <div align="left">
                <span class="blue">质检编号:</span>{{scope.row.con_number}}<br/>
                <span class="blue">质检单位:</span>{{scope.row.dit_name}}<br/>
                <span class="blue">质检结果:</span>
                  <span v-if="scope.row.con_result  === 1">合格</span>
                  <span v-else>不合格</span>
                  <br/>
              </div>
            </template>
          </el-table-column>
        <!--   <el-table-column label="质检编号"min-width prop="con_number"align="center"/>
          <el-table-column label="质检单位"min-width prop="dla_name"align="center"/> -->
          <el-table-column label="溯源码引用量"min-width prop="con_code_num"align="center"  width="120"/>
        <!--   <el-table-column label="质检结果"min-width prop="fom_cretime"align="center">
             <template slot-scope="scope">
              <div v-if="scope.row.con_result === '1'">合格</div>
              <div v-else>不合格</div>
            </template>
          </el-table-column> -->
          <el-table-column label="提交人"min-width prop="con_adm_name"align="center"  width="120"/>
          <el-table-column label="状态"min-width align="center" width="70">
            <template slot-scope="scope">
              <div v-if="scope.row.con_state === 1">显示</div>
              <div v-else>隐藏</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"width="320"prop align="center">
            <template slot-scope="scope">
              <el-button v-if="btnShow.editBtn" class="btn-mainCol"size="mini"@click="editBtn(scope.row)">
                编辑
              </el-button>
              <el-button v-if="btnShow.seeBtn" size="mini"class="btn-mainCol"@click="showthisBtn(scope.row)">
                查看
              </el-button>
              <el-button v-if="scope.row.con_state==2 && btnShow.showBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)">
                显示
              </el-button>
              <el-button v-if="scope.row.con_state==1 && btnShow.hideBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)">
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
    <el-dialog :visible.sync="showAddClas":title="AddClastitle":close-on-click-modal="false"width="650px"@close="cancleForm('addClaForm')">
      <el-form :inline="true" ref="addClaForm" :model="addClaForm" :rules="addClaRules" label-width="80px">
        <div class="addqualistyle"> 质检报告 </div>
        <el-form-item label="质检单位" prop="dla_id" >
          <el-select v-model="addClaForm.dla_id" class @change="getDataInfoUp(2,$event)">
            <el-option v-for="item in companyList" :key="item.dla_id" :label="item.dla_name" :value="item.dla_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道商" prop="dla_id" >
          <el-select v-model="addClaForm.dit_id" class @click.native="getSelect(1)">
            <el-option v-for="item in channelList" :key="item.dit_id" :label="item.dit_name" :value="item.dit_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="质检时间"class="sd-form-item"prop='con_qc_time'>
          <el-date-picker v-model="addClaForm.con_qc_time"type="datetime"placeholder="质检时间"value-format="yyyy-MM-dd HH:mm:ss"style='width:200px;':picker-options='pickerDateBefore1'>
          </el-date-picker>
        </el-form-item>
        <el-form-item  label="质检人员" prop="con_people">
          <el-input v-model="addClaForm.con_people"style="width:200px;"placeholder="请输入质检人员"maxlength="20" />
        </el-form-item>
        <el-form-item label="商品品类" prop="cla_id" >
          <el-select v-model="addClaForm.cla_id" class  @change="getDataInfoUp(5,$event)" @click.native="getSelect(3)">
            <el-option v-for="item in classList" :key="item.cla_id" :label="item.cla_name" :value="item.cla_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="goo_id" >
          <el-select v-model="addClaForm.goo_id" class @click.native="getSelect(4)">
            <el-option v-for="item in goodsList" :key="item.goo_id" :label="item.goo_name" :value="item.goo_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="质检结果" prop="con_result" >
          <el-select v-model="addClaForm.con_result" class>
            <el-option v-for="item in quaState" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <div class="addqualistyle"> 检测报告 </div>
        <el-form-item v-if="upImgShow"label="图片列表" prop="goo_picurl" class="addGods-upload-img">
          <div class="upload-img"  style='width:520px' >
            <div v-for="(item,index) in imgArr":key="index"class="img-list">
              <div class="img_show_box">
                <img :src="item"alt >
                  <i class="img_delete el-icon-circle-close"@click="deleteGoodsImg(index)"/>
                </div>
              </div>
              <div v-if="allowAddImg"class="upload-img-bd"> 
                <div class="add-img-box"@click="fileClick">
                  <input id="fileIpt"type="file"accept="image/*"class="ipt-add"@change="changeImg($event)">
                  <span class="icon-add el-icon-plus" />
                </div>
              </div>
            </div>
            <el-dialog :visible.sync="dialogVisible" width="">
              <img :src="dialogImageUrl"width="100%"alt >
            </el-dialog>
          </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addClaForm')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('addClaForm')">提 交</el-button>
      </span>
    </el-dialog>
   <!--  弹框查看 -->
    <el-dialog :visible.sync="showQuaClas":title="AddQuatitle":close-on-click-modal="false"width="700px"@close="cancleForm('addClaForm')">
      <el-form ref="quaList":model="quaList"label-width="120px"class="lk-form-addGods">
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="申请时间:" class="sd-form-item" prop="far_id">
            {{quaList.con_qc_time}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="农户姓名:" class="sd-form-item" prop="far_id">
            {{quaList.far_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="果园名称:" class="sd-form-item" prop="base_id">
            {{quaList.region_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="生产编号:" class="sd-form-item" prop="pro_id">
            {{quaList.con_number}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="品类名称:" class="sd-form-item" prop="cla_name">
            {{quaList.cla_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="商品名称:" class="sd-form-item" prop="goo_id">
            {{quaList.goo_name}}
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <div class="sd-moudle-header mar-bot-10">
            <div class="sd-module-title secondTitle">质检信息</div>
          </div>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="质检单位:" class="sd-form-item" prop="goo_id">
            {{quaList.dit_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="质检结果:" class="sd-form-item" prop="code_num">
            <span v-if="quaList.con_result === 1" >合格</span>
            <span v-else>不合格</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="质检时间:" class="sd-form-item" prop="goo_id">
            {{quaList.con_qc_time}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="质检人员:" class="sd-form-item" prop="code_num">
            {{quaList.con_people}} 
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <div class="sd-moudle-header mar-bot-10">
            <div class="sd-module-title secondTitle">检测报告</div>
          </div>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item  class="sd-form-item" >
            <div v-for="item in quaList.picList" class="imgthisstyle">
              <img :src="item"alt class="img-lookup imgThis">
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </el-dialog>
  </div>
</template>


<script>
import { quailtyInspList, showQuality, hideQuality, addQuality ,editQuality ,delQuality, checkQuality } from '@/api/ProductManage'
import { errorStatus } from '@/utils/index'

export default {
  name: 'TraceList',
  data() {
    return {
      editShow:false,
      showList: true,
      econ_id: 0,
      showQuaClas:false,
      AddQuatitle:'查看报告',
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
      quaList:{
        picList:''
      },
      baseurl: process.env.BASE_API,
      imgThisUrl:'',
      formList: {
        con_createtime_range0:'',
        con_createtime_range1:'',
        cla_name:'',
        goo_name:'',
        dla_name:'',
        adm_name: '',
        con_state: ''
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
        dla_id:'',
        dit_id:'',
        cla_id:'',
        goo_id:'',
        con_pic:'',
        con_result:'',
        con_people:'',
        con_qc_time:'',

      },
      fla_img:null,
      AddClastitle: '新增',
      diaState: [{ id: 1, name: '显示' }, { id: 2, name: '隐藏' }],
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
    this.searchBaseList()

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
      quailtyInspList(data)
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
              if (btnList[i].pri_funname === '新增') {
                this.$set(this.btnShow, 'addBtn', true)
              } else if (btnList[i].pri_funname === '编辑') {
                this.$set(this.btnShow, 'editBtn', true)
              } else if (btnList[i].pri_funname === '查看') {
                this.$set(this.btnShow, 'seeBtn', true)
              } else if (btnList[i].pri_funname === '显示') {
                this.$set(this.btnShow, 'showBtn', true)
                // this.btnShow.startBtn = true
              } else if (btnList[i].pri_funname === '隐藏') {
                this.$set(this.btnShow, 'hideBtn', true)
                // this.btnShow.stopBtn = true
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(this.btnShow, 'delBtn', true)
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
      quailtyInspList(search).then(response => {
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
    searchBaseList(){
      const data={}
      data.type=1
      addQuality(data)
        .then(response =>{
          const dataRep=response.data
          if(errorStatus(dataRep)){
            // this.farmerList=dataRep.data_info.farmer
            this.companyList=dataRep.data_info.ditch_label
          }
        })
    },
    searchPresent(Id){
      const data={}
      data.con_id=Id
       checkQuality(data)
        .then(response => {
          const dataRep =response.data
          if (errorStatus(dataRep)) {
            this.quaList=dataRep.data_info
            const url = process.env.BASE_API
            const baseUrl=url.replace('/public','/')
            const picUrl=[]
            const imgurl =dataRep.data_info.con_pic.split(',')

            for(var i in  imgurl ){
              picUrl.push(baseUrl+imgurl[i])
            }
            var imlist = {};
            for (var key in picUrl) {
                imlist[key] = picUrl[key];
            }
            this.quaList.picList=imlist
            console.log(this.quaList.picList)
            }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
     //新增获取信息
    getDataInfoUp(rolesType,id,index,ownid){
      const search={}
      search.type=rolesType
      if(rolesType===2 && !id == ''){
         search.dla_id=id  
         this.addClaForm.dit_id=''
         this.channelList=[]
      }
      else if(rolesType===5 && !id == ''){
         search.cla_id=id  
         this.addClaForm.goo_id='' 
         this.goodsList=[]
      }
      // else if(rolesType && id === ''){
      //   return
      // }
      addQuality(search)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            if(rolesType===2){
              this.channelList=dataRep.data_info
              if(this.edit){
                this.addClaForm.dit_id = ownid
              }
            }
            if(rolesType===4){
              this.classList=dataRep.data_info
              if(this.edit){
                this.addClaForm.cla_id = ownid
              }
            }
            if(rolesType===5){
              this.goodsList=dataRep.data_info
              if(this.edit){
                this.addClaForm.goo_id = ownid
              }
            }
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
    //选择
    getSelect(listType){

     if(listType === 1){
      if(this.addClaForm.dla_id==='' || !this.addClaForm.dla_id){
        this.$message.error('请先选择质检单位!')
      }
     }
     if(listType === 4){
      if(this.addClaForm.cla_id===''  || !this.addClaForm.cla_id){
        this.$message.error('请先选择商品种类!')
      }
     } 
    },
        // 弹窗-增加-提交
    addsubBtn(formName) {
      const data =this.addClaForm
      data.type=6
      if(data.dla_id===''){
        this.$message.error('请选择质检单位!')
        return false
      }
      if(data.dit_id===''){
        this.$message.error('请选择渠道商!')
        return false
      }
      if(data.cla_id===''){
        this.$message.error('请选择商品种类!')
        return false
      }
      if(data.goo_id===''){
        this.$message.error('请选择商品!')
        return false
      }
      if(data.pro_number===''){
        this.$message.error('请选择生产编号!')
        return false
      }
      if(data.pro_number===''){
        this.$message.error('请选择生产编号!')
        return false
      }
      if(this.imgArr.length===0){
        this.$message.error('请上传检测报告!')
        return false
      }
      if(data.con_result===''){
        this.$message.error('请选择质检结果!')
        return false
      }
      if(data.con_people===''){
        this.$message.error('请输入质检人员!')
        return false
      }
      if(data.con_qc_time===''){
        this.$message.error('请选择质检时间!')
        return false
      }
      data.con_pic=this.imgArr

      if(!this.edit){
        addQuality(data)
        .then(response => {
          // console.log('addAgric---', response)
          if (errorStatus(response.data)) {
            this.$message.success('提交成功!')
            this.showAddClas = false
            this.$refs[formName].resetFields()
            this.addClaForm.far_id=''
            this.addClaForm.dla_id=''
            this.addClaForm.dit_id=''
            this.getPageInfo()
          }
        })
        .catch(err => {
          console.log('err', err)
          this.$message.error('请求失败!')
        })
      }else{
        data.type=2
        data.con_id=this.addClaForm.con_id
        editQuality(data).then(response => {
          // console.log('addAgric---', response)
          if (errorStatus(response.data)) {
            this.$message.success('编辑成功!')
            this.showAddClas = false

              this.$refs[formName].resetFields()

            this.addClaForm.far_id=''
            this.addClaForm.dla_id=''
            this.addClaForm.dit_id=''
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
    //查看报告
    showthisBtn(row){
      this.searchPresent(row.con_id)
      this.showQuaClas=true
    },
    // 显示--这个--隐藏
    enableThisClas(row, num) {
      const data = {}
      data.con_id = [row.con_id]
      if (num === 1) {
        // 显示
        showQuality(data)
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
        hideQuality(data)
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
        this.$message.error('请选择要显示的质检信息!')
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
          this.$confirm('请确认,是否显示选中的质检信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              showQuality(data)
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
                  console.log('显示的质检信息err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消隐藏");
            })
        } else {
          this.$confirm("选中质检信息的状态全部为'显示'?", '提示', {
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
        this.$message.error('请选择要隐藏的质检信息!')
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
          this.$confirm('请确认,是否隐藏选中的质检信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              hideQuality(data)
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
                  console.log('显示的质检信息err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消隐藏");
            })
        } else {
          this.$confirm("选中质检信息的状态全部为'隐藏'?", '提示', {
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
      this.AddClastitle = '编辑'
      this.edit=true
      const data={}
      data.con_id=row.con_id
      data.type=1
      const img = []
      const baseUrl = process.env.BASE_API
      const str = baseUrl.replace('/public', '/')
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      editQuality(data)
        .then(response => {
          const dataRep=response.data
          if (errorStatus(dataRep)) {
            loading.close()
            this.$nextTick(() => {
              this.addClaForm.con_id=row.con_id
              this.addClaForm.con_qc_time=dataRep.data_info.qc_time
              this.addClaForm.con_people=dataRep.data_info.people
               const pic = dataRep.data_info.pic
                for (const i in pic) {
                  if (pic[0] !== '') {
                    img.push(str + pic[i])
                  }
                }
                
                if(pic.length > 5){
                  this.allowAddImg = false
                }
                this.imgArr = img
                this.addClaForm.far_id = row.con_far_id
                this.addClaForm.dla_id = row.dla_id
                this.getDataInfoUp(2,row.dla_id,'',row.dit_id)
                // this.addClaForm.cla_id = row.cla_id
                this.getDataInfoUp(4,'','',row.cla_id)
                this.getDataInfoUp(5,row.cla_id,'',row.goo_id)
                this.addClaForm.con_result = row.con_result
                this.showAddClas=true
              })
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败!')
        })
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
        if (leng === 5) {
          _this.allowAddImg = false
        }
      }
    },
    // 删除商品图片
    deleteGoodsImg(index) {
      console.log('---', index)
      this.imgArr.splice(index, 1)
      if (this.imgArr.length < 6) {
        this.allowAddImg = true
      }
    },
    imgClick() {
      document.getElementById('fileIpt').click()
    },
    cancleForm(formName) {
      this.showAddClas = false
      this.imgArr=[]
      this.addClaForm.fla_name = ''
      this.addClaForm.far_id = ''
      this.addClaForm.con_state = ''
      this.addClaForm.con_qc_time = ''
      this.addClaForm.con_people = ''
      this.allowAddImg=true
      
      this.editShow = false
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
  
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的质检信息!')
      } else {
        const data = {}
        data.con_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.con_id.push(chosed[i].con_id)
        }
        this.$confirm('请确认,是否删除所选中的质检信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delQuality(data)
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
      this.$confirm('请确认,是否删除所选中的质检信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delQuality(data)
          .then(response => {
            if (errorStatus(response.data)) {
              if(this.currentPage!==1 && this.list.length===1){
                this.currentPage=this.currentPage-1
              }
              this.$message.success('删除成功')
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
      this.getDataInfoUp(4)
      this.showAddClas = true
      this.AddClastitle = '新增'
      this.addClaForm.fla_name = ''
      this.addClaForm.far_id = ''
      this.addClaForm.con_state = ''
      this.addClaForm.con_qc_time = ''
      this.addClaForm.con_people = ''
      this.addClaForm.dit_id = ''
      this.addClaForm.dla_id = ''
      this.addClaForm.con_result = ''
    },
    
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formList.con_createtime_range1 = ''
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
    .imgThis{
      width:120px;
      height:90px
    }
    .imgthisstyle{
      float: left;
      margin-right:20px
    }
</style>
