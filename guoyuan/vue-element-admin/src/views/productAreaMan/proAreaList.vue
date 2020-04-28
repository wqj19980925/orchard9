<template>
  <div class="app-container">
    <el-row v-if="!areaPage && !envir" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">{{tagTitle}}产区列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn"  class="btn-mainCol"@click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn"  class="openCol-btn"@click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn"  class="stopCol-btn"@click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.delBtn"  class="btn-delete"@click="delChoseBtn()">删除</el-button>
          <el-button v-if="baseId" class="btn-delete"@click="backBtn()">返回</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="产区名称:"class="sd-form-item"prop="reg_name" >
              <el-input v-model="formList.reg_name"placeholder="请输入产区名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="产区编号:"class="sd-form-item"prop="reg_number" >
              <el-input v-model="formList.reg_number"placeholder="请输入产区编号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="产区类型:"class="sd-form-item"prop="reg_type" >
              <el-select v-model="formList.reg_type"class clearable>
                <el-option v-for="item in typelist":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="状态:"class="sd-form-item"prop="reg_state">
              <el-select v-model="formList.reg_state"class >
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="pl-50 fr w250"style >
            <el-button class type="primary"@click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
            <el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="lk-table-box">
        <el-table :data="list"width="100%"@selection-change="handleSelectionChange" >
          <el-table-column type="selection"width="55"/>
          <el-table-column label="产区名称"min-width align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.reg_name">产区名称:{{scope.row.reg_name}}</span>
              <p v-if="scope.row.reg_number">产区编号:{{scope.row.reg_number}}</p>
            </template>
          </el-table-column>
          <el-table-column label="产区类型"prop="reg_type"align="center" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.reg_type == 1">耕地大田</div>
              <div v-if="scope.row.reg_type == 2">圈舍牧区</div>
              <div v-if="scope.row.reg_type == 3">鱼池水塘</div>
              <div v-if="scope.row.reg_type == 4">果园林区</div>
              <div v-if="scope.row.reg_type == 5">温室大棚</div>
            </template>
          </el-table-column>
          <el-table-column label="区域数量"prop="dis_count"align="center" width="100"/>
          <el-table-column label="面积"prop="acreage"align="center" width="150"/>
          <el-table-column label="设备"prop="dis_admin"align="center"/>
          <el-table-column label="状态"min-width align="center" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.reg_state === 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"align="center"width="180">
            <template slot-scope="scope">
              <div class="opr-btn-box" align="left">
                <el-button v-if="btnShow.editBtn" size="mini"class="btn-mainCol buttonsty"@click="editRow(scope.row)">编辑</el-button>
                <el-button v-if="btnShow.envirBtn" size="mini"class="btn-mainCol buttonsty"@click="enviroData(scope.row)">环境管理</el-button>
                <el-button v-if="scope.row.reg_state==2 && btnShow.startBtn"size="mini"class="openCol-btn buttonsty"@click="enableThisClas(scope.row,1)"> 启用
                </el-button>
                <el-button v-if="scope.row.reg_state==1 && btnShow.stopBtn"size="mini"class="stopCol-btn buttonsty"@click="enableThisClas(scope.row,2)"> 停用
                </el-button>
                <el-button size="mini"class="btn-mainCol buttonsty"@click="getArealist(scope.row)">区域管理</el-button>
                 <!-- v-if="btnShow.areaBtn" -->
                <el-button v-if="btnShow.delBtn"  size="mini"class="btn-delete buttonsty"@click="delRow(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0"class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
      <!-- 弹窗 -->
      <el-dialog :visible.sync="showAddClas":title="dialogTit":close-on-click-modal="false"width="400px"
      @close="addClaForm('addCla')">
        <el-form ref="addCla":model="addCla":rules="rulesCla"label-width="80px">
          <el-form-item label="果园名称:"class="sd-form-item"prop="far_id" style="width:280px" >
             <el-select v-model="addCla.far_id"class :disabled="disabled" filterable clearable @change="changeBase($event)">
                <el-option v-for="item in baseList":key="item.far_id":label="item.far_name":value="item.far_id"/>
              </el-select>
          </el-form-item>
          <el-form-item label="产区名称:"class="sd-form-item"prop="reg_name" style="width:280px">
            <el-input v-model="addCla.reg_name"placeholder="请输入产区名称"  clearable/>
          </el-form-item>
          <el-form-item label="产区类型"prop="reg_type">
             <el-select v-model="addCla.reg_type"class @click.native="changeType" filterable clearable>
                <el-option v-for="item in typelist":key="item.id":label="item.name":value="item.id"/>
              </el-select>
          </el-form-item>
          <el-form-item label="区域面积"prop="acreage">
            <el-input v-model="addCla.acreage"placeholder="0.00亩" style="width:100px"  clearable/>亩
            <span  class="add-gods-title">果园剩余面积：{{addCla.restarea}}㎡</span>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <!-- <el-button v-if="edit"type="primary"@click="addeditBtn('addCla')">确 定</el-button> -->
          <el-button  type="primary"@click="addthisBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <areaList  :pro-id="progetId" :pro-name="proname"  :prir-id="areaPriId" :secbase="nextbaseId" @listerToChild="showList()" v-if="areaPage && !envir"/>
    <envirList v-if="!areaPage && envir" :envir-id="envirgetId" :base-id="basegetId" :base-name='produname'  :reg-id="regetId" pro-exist="true" :base-address='baseadress' :far-name="far_name" :far-num="far_serial" @listerToChild="showList()"/>
  </div>
</template>
<script>
import {proAreaList, getBase,openProArea, stopProArea, addProArea, editProArea, delProArea,getAddProArea,productBase } from '@/api/productAreaMan'
import { errorStatus } from '@/utils/index'
import areaList from './areaList'
import envirList from './components/envirList'
import axios from 'axios'
export default {
  components: { areaList ,envirList},
  name: 'Account',
  props: {
    baseId: {
      type: Number,
      required: false
    },
    areaNum :{
      type: String,
      required: false
    },
    baseName :{
      type: String,
      required: false
    },
  },
  data() {

    return {
      baseadress:'',
      mapJson: '../../../static/map/map.json',
      province: [],
      checkModel: [],
      sheng: '',
      shi: '',
      qu: '',
      city: '',
      block: '',
      regname:'',
      basegetId:'',
      produname:'',
      regetId:'',
      far_name:'',
      far_serial:'',
      nextbaseId:'',
      areaPage:false,
      envir:false,
      progetId:'',
      proname:'',
      tagTitle:'',
      formList: {
        reg_name:'',
        reg_number: '',
        reg_type: '',
        reg_state: '',
        reg_id: '',
      },
      edit: false,
      disabled:false,
      rules: {
        reg_name: [],
        reg_number:[],
        reg_state: [],
        reg_type: [],
        reg_id: []
      },
      departList:[],
      workList:[],
      rolesType: null,
      staffType:[
        {id: 0, name: '临时工'}
      ],
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      state1: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      typelist:[
        { id: 0, name: '全部' },
        { id: 1, name: '耕地大田' },
        { id: 2, name: '圈舍牧区' },
        { id: 3, name: '鱼池水塘' },
        { id: 4, name: '果园林区' },
        { id: 5, name: '温室大棚' }
      ],
      baseList:[],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      showTime:false,
      showRecord:false,
      addCla: {
        reg_name: null,
        reg_type:null,
        far_id:null,
        acreage:null,
        far_name:null,
        restarea:0,
        reg_id:null,
      },
      delreg_id:'',
      rulesCla: {
        tem_name: [
          { required: true, message: '请输入临时工姓名', trigger: 'blur' }
        ],
        tem_tel: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ]
      },
      dialogTit: '新增',
      dialog: {
        title: '新增',
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      chosed: [],
      envirgetId:'',//传给环境数据的pri_id
      areaPriId:'',//传给区域的pri_id
      serch_req: false,
      addRules: {
        tem_name: [{ required: true, message: '请输入临时工姓名', trigger: 'blur' }],
        reg_state: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
      showNPwd: false,
      btnShow:{},
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },
  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getCityData()
    this.getPageInfo();
    this.formList.reg_state = this.state[0].name
    this.formList.reg_type = this.typelist[0].name
    this.getBaseList()
    // this.askList()
    // this.addForm.adm_stase = this.state1[0].name;
  },
  methods: {
    getPageInfo() {
      // console.log("9099999
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {};
      data.pri_id=this.$route.meta.pri_id
      data.page = this.currentPage
      if(this.baseId){
        this.tagTitle=this.baseName+'--'
        data.far_id=this.baseId
        productBase(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            // const role_id = { rol_id: 0, rol_name: "全部" };
            // this.godsType.splice(0, 0, role_id);
            this.list = dataRep.data
            for( var i in this.list){
              for(var j in this.province){
                if(this.list[i].base_province === Number(this.province[j].id) ){
                   this.list[i].base_province=this.province[j].value           
                }
              }
              for(var j in this.city){
                if(this.list[i].base_city === Number(this.city[j].id) ){
                   this.list[i].base_city=this.city[j].value           
                }
              }        
              for(var j in this.block){
                if(this.list[i].base_town === Number(this.block[j].id) ){
                   this.list[i].base_town=this.block[j].value   
                         
                }
              }
            }
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            const btnList=dataRep.button_data
            for(var i in btnList){
              if(btnList[i].pri_funname === '新增'){
                this.$set(this.btnShow, 'addBtn', true)
              } else if (btnList[i].pri_funname === '启用') {
                this.$set(this.btnShow, 'startBtn', true)
              } else if (btnList[i].pri_funname === '停用') {
                this.$set(this.btnShow, 'stopBtn', true)
              } else if (btnList[i].pri_funname === '编辑') {
                this.$set(this.btnShow, 'editBtn', true)
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(this.btnShow, 'delBtn', true)
              } else if (btnList[i].pri_funname === '环境数据') {
                this.$set(this.btnShow, 'envirBtn', true)
              } else if (btnList[i].pri_funname === '区域管理') {
                this.$set(this.btnShow, 'areaBtn', true)
              }    
            }
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        }) 
      }else{
        proAreaList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            // const role_id = { rol_id: 0, rol_name: "全部" };
            // this.godsType.splice(0, 0, role_id);
            this.list = dataRep.data
            for( var i in this.list){
              for(var j in this.province){
                if(this.list[i].base_province === Number(this.province[j].id) ){
                   this.list[i].base_province=this.province[j].value           
                }
              }
              for(var j in this.city){
                if(this.list[i].base_city === Number(this.city[j].id) ){
                   this.list[i].base_city=this.city[j].value           
                }
              }        
              for(var j in this.block){
                if(this.list[i].base_town === Number(this.block[j].id) ){
                   this.list[i].base_town=this.block[j].value   
                         
                }
              }
            }
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            const btnList=dataRep.button_data
            for(var i in btnList){
              if(btnList[i].pri_funname === '新增'){
                this.$set(this.btnShow, 'addBtn', true)
              } else if (btnList[i].pri_funname === '启动') {
                this.$set(this.btnShow, 'startBtn', true)
              } else if (btnList[i].pri_funname === '停用') {
                this.$set(this.btnShow, 'stopBtn', true)
              } else if (btnList[i].pri_funname === '编辑') {
                this.$set(this.btnShow, 'editBtn', true)
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(this.btnShow, 'delBtn', true)
              } else if (btnList[i].pri_funname === '环境数据') {
                this.$set(this.btnShow, 'envirBtn', true)
                this.envirgetId=btnList[i].pri_id
              } else if (btnList[i].pri_funname === '区域管理') {
                this.$set(this.btnShow, 'areaBtn', true)
                this.areaPriId=btnList[i].pri_id
              }    
            }
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        }) 
      }

    },
    // 加载china地点数据，三级
    getCityData: function() {
      var that = this
      axios.get(this.mapJson)
        .then(function(response) {
          if (response.status === 200) {
            var data = response.data
            that.province = []
            that.city = []
            that.block = []
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                // 省
                that.province.push({
                  id: item,
                  value: data[item],
                  children: []
                })
              } else if (item.match(/00$/)) {
                // 市
                that.city.push({ id: item, value: data[item], children: [] })
              } else {
                // 区
                that.block.push({ id: item, value: data[item] })
              }
            }
   
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (
                  that.province[index].id.slice(0, 2) ===
                  that.city[index1].id.slice(0, 2)
                ) {
                  that.province[index].children.push(that.city[index1])
                }
              }
            }
            // 分类区级
            for (var item1 in that.city) {
              for (var item2 in that.block) {
                if (
                  that.block[item2].id.slice(0, 4) ===
                  that.city[item1].id.slice(0, 4)
                ) {
                  that.city[item1].children.push(that.block[item2])
                }
              }
            }
          } else {
            console.log(response.status)
          }
        })
        .catch(function(error) {
          console.log(typeof +error)
        })
    },
    getBaseList(firsbaseId){
      const data = {}
      getBase(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.baseList = dataRep.data_info
            if(this.baseId || this.edit === true){//从果园列表进产区列表
              if(this.baseId){
                this.addCla.far_id=this.baseId
              }
              for(var i in this.baseList){
                if(this.baseList[i].far_id === this.addCla.far_id){
                  this.addCla.far_name=this.baseList[i].far_name
                  this.addCla.restarea=this.baseList[i].reg_surplus
                }
              }
             this.disabled=true
            }else{
              this.disabled=false
            }
            if(this.edit && !this.baseId) {//直接进入产区列表
              this.addCla.far_id=firsbaseId
            }
          }
        })
        .catch(err => {
          this.$message.error('请求失败!')
          console.log('获取列表err', err)
        })
    },

    // 搜索
    searchList(formName, page) {
      const search =this.formList
      if (search.reg_state === '全部' || search.reg_state === 0) {
        search.reg_state = ''
      }
      if (search.reg_type === '全部' || search.reg_type === 0) {
        search.reg_type = ''
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // console.log('search--', search)
      search.pri_id=this.$route.meta.pri_id
      search.page = page
      proAreaList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            this.serch_req = true
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
        })
    },
    closeWork(formName) {
      this.showTime = false
    },
    
    // 编辑按钮
     editRow(scope) { 
      this.addCla.far_id=scope.far_id
      this.showAddClas = true
      this.dialogTit = '编辑产区'
      this.edit = true
      this.getBaseList(scope.base_id)
      this.$nextTick(() => {
        this.addCla.reg_type=scope.reg_type
        this.addCla.reg_name=scope.reg_name
        this.addCla.acreage=scope.acreage
        this.addCla.reg_id=scope.reg_id
        this.addCla.restarea=scope.reg_surplus

        // this.addCla.far_id=scope.baseId

      })
    },
    addClaForm(formName) {
      this.showAddClas = false
      this.disabled=false
      this.addCla.far_id=''
      this.addCla.far_name=''
      this.addCla.restarea=0
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
      this.showTime = false
    },
    changeBase(e){
      for(var i in this.baseList){
        if(this.baseList[i].far_id === e){
          this.addCla.far_name=this.baseList[i].far_name
          this.addCla.restarea=this.baseList[i].reg_surplus
        }
      }
    },
    // 添加-弹窗
    addGoodsBtn() { // 点击我的云仓添加按钮后的操作
      this.showAddClas = true
      this.dialogTit = '新增产区'
      this.edit = false


      // this.$refs[addCla].resetFields()
/*      this.addCla.type = this.type[1].name*/
    },
     // 添加--提交
    addthisBtn(formName){
      const that = this
      const data = that.addCla
      if (that.addCla.far_id === null) {
        this.$message.error('请选择果园名称')
        return false
      }
      if (that.addCla.reg_name === null) {
        this.$message.error('请输入产区名称')
        return false
      }
      if (that.addCla.reg_type === null) {
        this.$message.error('请选择产区类型')
        return false
      }
      if (that.addCla.acreage === null) {
        this.$message.error('请输入产区面积')
        return false
      }
      if(!this.edit){
        data.acreage=parseFloat(that.addCla.acreage).toFixed(2)
        addProArea(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo()
            that.$message.success('产区信息增加成功!')
            that.$refs[formName].resetFields()
            that.showAddClas = false
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
      }else{
        data.reg_area=parseFloat(that.addCla.acreage).toFixed(2)
        editProArea(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.$message.success('产区信息编辑成功!')
            that.showAddClas = false
            this.disabled=false
            that.$refs[formName].resetFields()
            this.addCla.far_id=''
            this.addCla.far_name=''
            this.addCla.restarea=0
            that.getPageInfo()  
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
      }
    
    },
    enviroData(row){
      this.envir =true
      this.areaPage = false
      this.far_serial=row.reg_number
      this.far_name=row.far_name
      this.basegetId=row.base_id
      this.produname=row.reg_name
      this.regetId=row.reg_id
      this.baseadress=row.base_province+row.base_city+row.base_town+row.base_address
    },
    getArealist(row){
      this.areaPage = true
      this.progetId=row.reg_id
      this.proname=row.reg_name
      this.nextbaseId=row.far_id
    },
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的产区!')
      } else {
        const data = {}
        data.reg_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.reg_id.push(chosed[i].reg_id)
        }
        this.$confirm('请确认,是否删除所选中的产区?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delProArea(data)
            .then(response => {
              // console.log('delgo---', response)
              if (errorStatus(response.data)) {
                this.currentPage = 1
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
    delRow(row) {
      // console.log('del---row', row)
      const data = {}
      const reg_id = []
      reg_id.push(row.reg_id)
      data.reg_id = reg_id
      // console.log('删除---', data)
      this.$confirm('请确认,是否删除所选中的产区?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProArea(data)
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
    // 单个--启用--停用
    enableThisClas(row, num) {
      const data = {}
      data.reg_id = [row.reg_id]
      if (num === 1) {
        // 启用
        openProArea(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.reg_state = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 停用
        stopProArea(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.reg_state = num
            }
          })
          .catch(Error => {
            // console.log("停用的产区err", err);
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
        this.$message.error('请选择要启用的产区!')
      } else {
        const reg_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].reg_state === 2) {
            reg_id.push(chosed[i].reg_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (reg_id.length > 0) {
          data.reg_id = reg_id
          this.$confirm('请确认,是否启用选中的产区?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              openProArea(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in reg_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (reg_id[i] === list[j].reg_id) {
                          list[j].reg_state = 1
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
                  console.log('启用的产区err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中产区的状态全部为'启用'", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    changeType(){
         this.$message.warning(' 更换产区类型，将清除该产区下的所有区域')
    //   if(this.edit){
    //      this.$confirm(' 更换产区类型，将清除该产区下的所有区域,是否继续更换类型?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       })
    //      .then(() => {
       
    //   }).catch(() => {
    //           // console.log("取消停用");
    //         })
    // }
    },
    // 停用
    stopClas() {
      const list = this.list
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要停用的产区!')
      } else {
        const reg_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].reg_state === 1) {
            reg_id.push(chosed[i].reg_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (reg_id.length > 0) {
          data.reg_id = reg_id
          this.$confirm('请确认,是否停用选中产区?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              stopProArea(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in reg_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (reg_id[i] === list[j].reg_id) {
                          list[j].reg_state = 2
                        }
                      }
                    }
                    this.list = list
                    this.getPageInfo()
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的产区err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中产区状态已全部为'停用'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
    },
    backBtn(){
       // this.$confirm('确定离开'+this.baseName+'的产区列表?', '提示', {
       //    confirmButtonText: '确定',
       //    cancelButtonText: '取消',
       //    type: 'warning'
       //  })
       //  .then(() => {
          this.$emit('listerToChild', 'addPage')
        //   }).catch(() => {
        // })
     },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      if (this.serch_req) {
        this.searchList('formList', val)
      } else {
        this.getPageInfo()
      }
    },

    showList() {
      this.areaPage = false
      this.envir=false
      this.getPageInfo();
      this.getCityData()
      this.getBaseList()
      this.formList.reg_state = this.state[0].name
      this.formList.reg_type = this.typelist[0].name
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scope>
@import "@/styles/variables.scss";
.dialog_resetPwd {
  .resetPwd_box {
    // padding:0 70px;
    .succes-icon-box {
      padding: 8px 20px;
      height: 56px;

      float: left;
    }
    p {
      font-size: 16px;
      text-align: center;
      &.tip_success {
        // padding: 0 120px;
        font-size: 20px;
        font-weight: bold;
        .el-icon-success {
          color: $blue;
          font-size: 22px;
          padding-right: 16px;
        }
      }
      &.tip_suc {
        padding-top: 16px;
        .text-pwd {
          color: #333;
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.account_add {
  .account_add_form {
    .el-form-item__label {
      padding: 0 40px 0 0;
    }
    .el-input.is-disabled .el-input__inner {
      color: #666;
    }
  }
  .el-dialog__body {
    padding: 30px 20px 20px;
    .list_data_add .tip_box{
      color: #f35e5e;
      font-size: 12px;
      line-height: 20px;
    }
  }

}

</style>
<style>
.add-gods-title{
  color:#c0c4cc;
  font-size:12px
}
.buttonsty{
   margin-left: 0px !important; 
   margin-top:10px
}
</style>