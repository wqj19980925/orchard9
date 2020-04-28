<template>
  <div class="app-container">
    <el-row v-if="!datamang" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">设备列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol"@click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn"@click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn"@click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete"@click="delChoseBtn()">删除</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="设备名称:"class="sd-form-item"prop="com_name" >
              <el-input v-model="formList.com_name"placeholder="请输入果园名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="设备编号:"class="sd-form-item"prop="com_number">
              <el-input v-model="formList.com_number"placeholder="请输入果园编号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="添加人:"class="sd-form-item"prop="com_creatname">
              <el-input v-model="formList.com_creatname"placeholder="请输入果园编号" clearable/>
            </el-form-item>
          </el-col>
          <!--<el-col :span="5"class="sd-col-6">
           <el-form-item label="设备类型:"class="sd-form-item"prop="far_farid" >
              <el-select v-model="formList.far_farid" clearable filterable>
                <el-option v-for="item in devicetype":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="状态:"class="sd-form-item"prop="com_state">
              <el-select v-model="formList.com_state"class clearable>
                <el-option v-for="item in state":key="item.id":label="item.name":value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"class="sd-col-6" >
            <el-form-item label="数据归属:"class="sd-form-item"prop="com_state">
              <el-col :span="7"class="sd-col-6" >
                <el-select v-model="formList.com_data_baseid"class  @change="getDataInfoUp(2,$event)" >
                  <el-option v-for="item in baseList":key="item.far_id":label="item.far_name":value="item.far_id"/>
                </el-select>
              </el-col>
              <el-col :span="7"class="sd-col-6" :offset="1">
                <el-select v-model="formList.com_data_regid"class @change="getDataInfoUp(3,$event)" @click.native="getSelect(1)">
                  <el-option v-for="item in regList":key="item.reg_id":label="item.reg_name":value="item.reg_id"/>
                </el-select>
              </el-col>
              <el-col :span="7"class="sd-col-6" :offset="1">
                <el-select v-model="formList.com_data_disid"class @click.native="getSelect(2)">
                  <el-option v-for="item in areaList":key="item.dis_id":label="item.dis_name":value="item.dis_id"/>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12"class="sd-col-6">
            <el-form-item label="安装区域:"class="sd-form-item"prop="com_state" >
              <el-col :span="7"class="sd-col-6" >
                <el-select v-model="formList.com_add_baseid"class   @change="getDataInfoUp(4,$event)">
                  <el-option v-for="item in baseList":key="item.far_id":label="item.far_name":value="item.far_id"/>
                </el-select>
              </el-col>
              <el-col :span="7"class="sd-col-6" :offset="1"  >
                <el-select v-model="formList.com_add_regid"class @change="getDataInfoUp(5,$event)"  @click.native="getSelect(3)">
                  <el-option v-for="item in regList":key="item.reg_id":label="item.reg_name":value="item.reg_id"/>
                </el-select>
              </el-col>
              <el-col :span="7"class="sd-col-6" :offset="1" >
                <el-select v-model="formList.com_add_disid"class @click.native="getSelect(4)" >
                  <el-option v-for="item in areaList":key="item.dis_id":label="item.dis_name":value="item.dis_id"/>
                </el-select>
              </el-col>
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
          <el-table-column label="设备信息"min-width align="center">
            <template slot-scope="scope">
              <el-col :span="5"class="sd-col-6" >
                <div align="left">
                  <el-col :span="24">{{scope.row.com_name}}</el-col>
                  <span v-if="scope.row.com_type===1">气象站</span>
                  <span v-if="scope.row.com_type===2">摄像头</span>
                  <span v-if="scope.row.com_type===3">其他设备</span>
                </div>
              </el-col>
              <el-col :span="14"class="sd-col-6" >
                <div align="left">
                  <el-col :span="24"> 设备编号:{{scope.row.com_number}}</el-col>
                  <el-col :span="24">
                    数据归属:
                    {{scope.row.com_data_basename}}
                    {{scope.row.com_data_regname}}
                    {{scope.row.com_data_disname}}
                  </el-col>
                  <el-col :span="24">
                    安装区域:
                    {{scope.row.com_add_basename}}
                    {{scope.row.com_add_regname}}
                    {{scope.row.com_add_disname}}
                  </el-col>
                </div>
              </el-col>
              <el-col :span="5"class="sd-col-6" >
                <div align="left">
                  <el-col :span="24">{{scope.row.com_creattime}}</el-col>
                  <el-col :span="24">{{scope.row.com_creatname}}</el-col>
                </div>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column label="状态"min-width align="center" width="60">
            <template slot-scope="scope">
              <div v-if="scope.row.com_state === 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"align="center" width="450">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button v-if="btnShow.editBtn"  size="mini"class="btn-mainCol"@click="editRow(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.com_state===2 && btnShow.startBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)">  启用
                </el-button>
                <el-button v-if="scope.row.com_state===1 && btnShow.stopBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)">  停用
                </el-button>
                <el-button size="mini" v-if="btnShow.dataBtn" class="btn-mainCol"@click="manageData(scope.row)">数据管理</el-button>
                <el-button size="mini" v-if="scope.row.com_binding===2 &&  btnShow.weatherBtn " class="btn-mainCol"@click="bindingDev(scope.row)">    未绑定设备</el-button><!---->
                <el-button size="mini" v-if="scope.row.com_binding===1 &&  btnShow.editBindBtn " class="btn-mainCol"@click="editbindDev(scope.row)">   编辑绑定设备</el-button>
                <el-button v-if="btnShow.delBtn"  size="mini"class="btn-delete"@click="delRow(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 弹窗 -->
      <el-dialog :visible.sync="showAddClas":title="dialogTit":close-on-click-modal="false"width="650px"
      @close="addClaForm('addCla')">
        <el-form ref="addCla":model="addCla" :inline="true" label-width="100px">
          <el-form-item label="设备名称:"class="sd-form-item"prop="massif_name" style="width:350px">
            <el-input v-model="addCla.com_name"placeholder="请输入设备名称" style="width:200px"/>
          </el-form-item>
          <el-form-item label="设备类型:"class="sd-form-item"prop="far_farid" style="width:350px">
            <el-select v-model="addCla.com_type" filterable clearable disabled>
              <el-option v-for="item in equiplist":key="item.id":label="item.name":value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="安装地址:"class="sd-form-item"prop="com_state" >
            <el-select v-model="addCla.com_add_baseid"class  style="width:150px" @change="getDataInfoUp(4,$event)">
              <el-option v-for="item in baseList":key="item.far_id":label="item.far_name":value="item.far_id"/>
            </el-select>
            <el-select v-model="addCla.com_add_regid"class  @change="getDataInfoUp(5,$event)" style="width:150px"  @click.native="getSelect(3)">
              <el-option v-for="item in regList":key="item.reg_id":label="item.reg_name":value="item.reg_id"/>
            </el-select>
            <el-select v-model="addCla.com_add_disid"class style="width:150px"  @click.native="getSelect(4)">
              <el-option v-for="item in areaList":key="item.dis_id":label="item.dis_name":value="item.dis_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="数据隶属:"class="sd-form-item"prop="com_state" >
            <el-select v-model="addCla.com_data_baseid"class  style="width:150px" @change="getDataInfoUp(2,$event)">
              <el-option v-for="item in baseList":key="item.far_id":label="item.far_name":value="item.far_id"/>
            </el-select>
            <el-select v-model="addCla.com_data_regid"class  style="width:150px"  @change="getDataInfoUp(3,$event)" @click.native="getSelect(1)">
              <el-option v-for="item in regList":key="item.reg_id":label="item.reg_name":value="item.reg_id"/>
            </el-select>
            <el-select v-model="addCla.com_data_disid"class style="width:150px" @click.native="getSelect(2)">
              <el-option v-for="item in areaList":key="item.dis_id":label="item.dis_name":value="item.dis_id"/>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button  type="primary"@click="addBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 绑定 -->
      <el-dialog :visible.sync="showBingClas":title="dialogTit":close-on-click-modal="false"width="650px"
      @close="addClaForm('addBind')" class="equire-add-dialog">
        <el-form ref="addBind" label-width="100px" class="equire-form-add">
          <el-form-item label="设备名称:"class="sd-form-item"prop="com_id" style="width:350px">
           {{addBind.com_name}}
          </el-form-item>
          <el-form-item label="设备类型:"class="sd-form-item"prop="com_type" style="width:350px">
            <span v-if="addBind.com_type===1">气象站</span>
            <span v-if="addBind.com_type===2">摄像头</span>
            <span v-if="addBind.com_type===3">其他设备</span>
          </el-form-item>
          <div v-for="(item,index) in nodelist">
            <el-form-item label="节点名称"class="sd-form-item"prop="nod_node">
              {{item.nod_node}}
            </el-form-item>
          <!--   {{item.nod_node}} -->
            <el-form-item label="检测项目"class="sd-form-item"prop="task_number">
              <el-checkbox-group v-model="info_chose" @change="choseEquire(index,info_chose)">
                <el-checkbox-button  v-for="(item1,index1) in item.nod_explain":label="item1.key":key="item1.key">
                 {{item1.key}}
                </el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addBind')">取 消</el-button>
          <el-button  type="primary"@click="addBindBtn('addBind')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <!-- 数据管理 -->
    <dataEditing v-if="datamang" :base-id="basegetId" :reg-id='regetId' :dis-id="disgetId" :dev-name="devname" :com-id="comid"@listerToChild="showListPages()" />
  </div>
</template>
<script>
import {deviceList, startEquipment, stopEquipment, searchBase,  addEquipment, editEquipment, delEquipment,geteditEquipment ,hideEquipment, showEquipment , getBinding ,getEditBinding ,getUntying, addDataManage, dataManageList, editDataManage, delDataManage, getDataManage,bindingThis ,EditBinding} from '@/api/productAreaMan'
import { errorStatus } from '@/utils/index'
import TableBox from '@/components/tableBox'
import dataEditing from './components/dataEditing'
import axios from 'axios'
export default {
  components: {dataEditing},
  name: 'Account',
  data() {

    return {
      devname:'',
      basegetId:'',
      regetId:'',
      disgetId:'',
      comid:'',
      showBingClas:false,
      showAddClas:false,
      datamang:false,
      addBind:{
        com_name:'',
        com_id:null,
        com_number:'',
        nod_node:''
      },
      info_chose:[],
      nodelist:{
        nod_explain:[]
      },
      editNodeList:{},
      editDev:false,
      baseList:[],
      regList:[],
      areaList:[],
      formList: {
        com_name:'',
        com_number: '',
        com_creatname:'',
        com_type:'',
        com_state: '',
        com_add_baseid:'',
        com_add_regid: '',
        com_add_disid:'',
        com_data_baseid:'',
        com_data_regid: '',
        com_data_disid: '',
      },
      addBind:[],
      devicetype:[
        { id: 0, name: '全部' },
        { id: 1, name: '摄像头' },
        { id: 2, name: '气象站' },
        { id: 3, name: '其他设备' }
      ],
      edit: false,
      equiplist:[
        { id: 1, name: '气象站' },
        { id: 2, name: '摄像头' },
        { id: 3, name: '其他设备' }
      ],
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],  
      equipment:{
        node_id:'',
        nod_node:'',
      },
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,  
      addCla: {
        com_id:'',
        com_name:'',
        com_type: '',
        com_add_baseid:'',
        com_add_regid:'',
        com_add_disid:'',
        com_data_baseid:'',
        com_data_regid:'',
        com_data_disid:''
      },
      dialogTit: '新增',
      chosed: [],
      serch_req: false,
      btnShow:{}
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },

  created() {
    this.getPageInfo();
    this.getDataInfoUp(1)
    this.getthisBind()
    // this.formList.com_state = this.state[0].name
    // this.formList.reg_type = this.typelist[0].name
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
      deviceList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.list = dataRep.data
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
              } else if (btnList[i].pri_funname === '显示') {
                this.$set(this.btnShow, 'showBtn', true)
              } else if (btnList[i].pri_funname === '隐藏') {
                this.$set(this.btnShow, 'hideBtn', true)
              } else if (btnList[i].pri_funname === '气象站绑定') {
                this.$set(this.btnShow, 'weatherBtn', true)
              } else if (btnList[i].pri_funname === '摄像头绑定') {
                this.$set(this.btnShow, 'cameraBtn', true)
              } else if (btnList[i].pri_funname === '气象站编辑绑定') {
                this.$set(this.btnShow, 'editBindBtn', true)
              } else if (btnList[i].pri_funname === '数据管理') {
                this.$set(this.btnShow, 'dataBtn', true)
              }         
            }
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    getDataInfoUp(listType,Id,ownid){
      const data = {};
      if(listType===1 ){
        data.type=1
      }
      if(listType===2 ){
        data.far_id=Id
        this.regList=[]
        this.areaList=[]
        data.type=listType
        if(this.showAddClas){
          this.addCla.com_data_regid=''
          this.addCla.com_data_disid=''
        }else{
          this.formList.com_data_regid=''
          this.formList.com_data_disid=''
        }
      }
      if(listType===3){
        data.reg_id=Id
        data.type=listType
        this.areaList=[]
        if(this.showAddClas){
          this.addCla.com_data_disid=''
        }else{
          this.formList.com_data_disid=''
        }
      }
      if(listType===4 && !Id == ''){
        data.far_id=Id
        data.type=2
        this.regList=[]
        this.areaList=[]
        if(this.showAddClas){
          this.addCla.com_add_regid=''
          this.addCla.com_add_disid=''
        }else{
          this.formList.com_add_regid=''
          this.formList.com_add_disid=''
        }
      }
      if(listType===5 && !Id == ''){
        data.reg_id=Id
        data.type=3
        this.areaList=[]
        if(this.showAddClas){
          this.addCla.com_add_disid=''
        }else{
          this.formList.com_add_disid=''
        } 
      }
      searchBase(data)
        .then(response => {
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            if(listType===1){
              this.baseList = dataRep.data
            }
            if(listType===2 || listType===4){
              this.regList=dataRep.data
              if(this.edit && listType===2 ){
                this.addCla.com_data_regid = ownid
              }
               if(this.edit && listType===4 ){
                this.addCla.com_add_regid = ownid
              }
            }
            if(listType===3 || listType===5){
              this.areaList=dataRep.data
              if(this.edit && listType===3 && ownid){
                this.addCla.com_data_disid = ownid
              }
              if(this.edit && listType===5 && ownid){
                this.addCla.com_add_disid = ownid
              }
            }
            
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    getSelect(listType){
      if(listType === 1){
        if(this.showAddClas){
          if(this.addCla.com_data_baseid==='' || !this.addCla.com_data_baseid){
            this.$message.error('请先选择果园名称')
          }
        }else{
          if(this.formList.com_data_baseid==='' || !this.formList.com_data_baseid){
            this.$message.error('请先选择果园名称')
          }
        }
      }
      if(listType === 2){
        if(this.showAddClas){
          if(this.addCla.com_data_regid===''  || !this.addCla.com_data_regid){
            this.$message.error('请先选择产区名称')
          }
        }else{
          if(this.formList.com_data_regid===''  || !this.formList.com_data_regid){
            this.$message.error('请先选择产区名称')
          }
        }
      }
      if(listType === 3){
        if(this.showAddClas){
          if(this.addCla.com_add_baseid===''  || !this.addCla.com_add_baseid){
            this.$message.error('请先选择果园名称')
          }
        }else{
          if(this.formList.com_add_baseid===''  || !this.formList.com_add_baseid){
            this.$message.error('请先选择果园名称')
          }
        }
      }
      if(listType === 4){
        if(this.showAddClas){
          if(this.addCla.com_add_baseid===''  || !this.addCla.com_add_baseid){
            this.$message.error('请先选择产区名称')
          }
        }else{
          if(this.formList.com_add_baseid===''  || !this.formList.com_add_baseid){
            this.$message.error('请先选择产区名称')
          }
        }    
       }
    },

    // 搜索
    searchList(formName, page) {
      const search =this.formList
      // search.name=this.formList.tem_name
      // search.tel=this.formList.tem_tel
      // search.state=this.formList.com_state
      if (search.state === '全部' || search.state === 0) {
        search.state = ''
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
      deviceList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
           this.list = dataRep.data
            for( var i in this.list){
              for(var j in this.province){
                if(this.list[i].far_province === Number(this.province[j].id) ){
                   this.list[i].far_pro=this.province[j].value           
                }
              }
              for(var j in this.city){
                if(this.list[i].far_city === Number(this.city[j].id) ){
                   this.list[i].far_cit=this.city[j].value           
                }
              }        
              for(var j in this.block){
                if(this.list[i].far_town === Number(this.block[j].id) ){
                   this.list[i].far_tow=this.block[j].value           
                }
              }
            }
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
        })
    },

    //获取绑定设备节点
    getthisBind(){
      const data={}
      getBinding(data)
        .then(response => {
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.nodelist = dataRep.data

            for(var i in this.nodelist){
              this.nodelist[i].typestate=1
              this.nodelist[i].nod_explain=eval(dataRep.data[i].nod_explain)

            }
       
            console.log(this.nodelist)
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    // 编辑按钮
    editRow(scope) { 
      this.showAddClas = true
      this.dialogTit = '编辑设备'
      this.edit = true
      this.$nextTick(() => {
        this.addCla.com_name=scope.com_name
        this.addCla.com_add_baseid=scope.com_add_baseid
        this.addCla.com_data_baseid=scope.com_data_baseid
        this.addCla.com_type=scope.com_type
        this.addCla.com_id=scope.com_id
        if(scope.com_data_regid){
           this.getDataInfoUp(2,scope.com_data_baseid,scope.com_data_regid)//数据产区
        }
        if(scope.com_data_disid){
         this.getDataInfoUp(3,scope.com_data_regid,scope.com_data_disid)//数据区域
        }
        if(scope.com_add_regid){
          this.getDataInfoUp(4,scope.com_add_baseid,scope.com_add_regid)//数据产区
        }
        if(scope.com_add_regid){
          this.getDataInfoUp(5,scope.com_add_regid,scope.com_add_disid)//数据区域
        }
        
        //       this.addCla.com_add_regid=scope.com_add_regid
        // this.addCla.com_add_disid=scope.com_add_disid
        //       this.addCla.com_add_disid=scope.com_add_disid
        //       this.addCla.com_data_regid=scope.com_data_regid
        //       this.addCla.com_data_disid=scope.com_data_disid
     
      })
    },

    addClaForm(formName) {
      this.showBingClas=false
      this.showAddClas = false
      this.info_chose=[]
      this.addCla.com_name=''
      this.addCla.com_add_regid=''
      this.addCla.com_add_baseid=''
      this.addCla.com_add_disid=''
      this.addCla.com_data_regid=''
      this.addCla.com_data_baseid=''
      this.addCla.com_data_disid=''
      
      this.edit = false
      if (this.$refs[formName]) {
        this.$nextTick(() => {  
          this.$refs[formName].resetFields()
        })
      }
    },
    // 添加-弹窗
    addGoodsBtn() { // 点击添加按钮后的操作
      this.showAddClas = true
      this.dialogTit = '新增设备'
      this.edit = false
      this.addCla.com_type=this.equiplist[0].id

      // this.$refs[addCla].resetFields()
/*      this.addCla.type = this.type[1].name*/
    },
     // 添加--提交
    addBtn(){
      const that = this
      const data = that.addCla
      if (that.addCla.com_name === '') {
        this.$message.error('请选择设备名称')
        return false
      }
      if (that.addCla.com_add_baseid === '') {
        this.$message.error('请选择安装地址果园名称')
        return false
      }
      if (that.addCla.com_data_baseid === '') {
        this.$message.error('请选择数据隶属果园名称')
        return false
      }
      if(!this.edit){
        addEquipment(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo()
            that.$message.success(res.data.data)
            that.showAddClas = false
            that.addCla.com_name=''
            that.addCla.com_add_regid=''
            that.addCla.com_add_baseid=''
            that.addCla.com_add_disid=''
            that.addCla.com_data_regid=''
            that.addCla.com_data_baseid=''
            that.addCla.com_data_disid=''
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
      }else{
        data.com_id=that.addCla.com_id
        editEquipment(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo()
            that.$message.success(res.data.data)
            that.showAddClas = false
            that.addCla.com_id=''
            that.addCla.com_name=''
            that.addCla.com_add_regid=''
            that.addCla.com_add_baseid=''
            that.addCla.com_add_disid=''
            that.addCla.com_data_regid=''
            that.addCla.com_data_baseid=''
            that.addCla.com_data_disid=''
            
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
      }
      
    },
    // addClaForm(formName){
    //   this.showAddClas = false
    //   this.$refs[formName].resetFields()
    // },
    //绑定设备
    bindingDev(scope){
      this.showBingClas=true
      this.addBind.com_id=scope.com_id
      this.addBind.com_name=scope.com_name
      this.addBind.com_number=scope.com_number
      this.addBind.com_type=scope.com_type
    },
    choseEquire(num,choose){

      this.nodelist[num].typestate=1

      for(var j in this.nodelist[num].nod_explain){
        if(!this.editDev){
           this.nodelist[num].nod_explain[j].show=1
        }
          for( var k in choose){
            if(this.nodelist[num].nod_explain[j].key===choose[k]){
              this.nodelist[num].nod_explain[j].show=2
              this.nodelist[num].typestate=2
            }
          }
      }
    },
    //提交绑定
    addBindBtn(){
      const data={}
      data.com_id=this.addBind.com_id
      if(this.editDev){
         data.com_number=this.addBind.com_number
      }
        data.com_number=this.addBind.com_number
      
      const equipment=[]
      for(var i in this.nodelist){
        if(this.nodelist[i].typestate===2){
         equipment.push(this.nodelist[i])
         // delete(this.nodelist[i].typestate)
        }
      }
      data.equipment=equipment
      if(this.editDev){
        EditBinding(data)
        .then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data)
            this.showBingClas=false
            this.getPageInfo()
            this.editDev=false
            this.info_chose=[]
          }
        })
        .catch(Error => {
          // console.log("停用的分类err", err);
          this.$message.error('请求失败!')
        })
      }else{
        bindingThis(data)
        .then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data)
            this.showBingClas=false
            this.getPageInfo()
            this.info_chose=[]
          }
        })
        .catch(Error => {
          // console.log("停用的分类err", err);
          this.$message.error('请求失败!')
        })
      }
      

    },
    //编辑绑定
    editbindDev(scope){
      this.showBingClas=true
      this.editDev=true
      this.getEditDev(scope.com_id)
      this.addBind.com_id=scope.com_id
      this.addBind.com_name=scope.com_name
      this.addBind.com_number=scope.com_number
      this.addBind.com_type=scope.com_type
    },
    //获取编辑绑定信息
    getEditDev(id){
      const data={}
      data.com_id=id
      const info =[]
       getEditBinding(data)
          .then(response => {
           const dataRep=response.data
            if (errorStatus(dataRep)) {
              this.editNodeList=dataRep.data
              for(var i in this.editNodeList){
                this.editNodeList[i].nod_explain=eval(dataRep.data[i].env_equipment)
                this.editNodeList[i].nod_node=dataRep.data[i].env_node
                this.editNodeList[i].nod_id=dataRep.data[i].env_nodeid
                this.editNodeList[i].typestate=2
                delete this.editNodeList[i].env_node
                delete this.editNodeList[i].env_nodeid
                delete this.editNodeList[i].env_equipment
                for(let m in this.editNodeList[i].nod_explain){
                  if(this.editNodeList[i].nod_explain[m].show  === 2){
                    info.push(this.editNodeList[i].nod_explain[m].key)
                    this.info_chose=info
                  }
                }
              }
              for(var j in this.nodelist){
                for(var k in this.editNodeList){
                  if(this.editNodeList[k].nod_id===this.nodelist[j].nod_id){
                    this.nodelist[j]=this.editNodeList[k]
                    this.nodelist[j].typestate=2
                  }
                }
              }

              // for(var i in dataRep.data){
              //   const showThis=eval(dataRep.data[i].env_equipment)
              //   for(var j in this.nodelist){
              //     if(dataRep.data[i].env_nodeid === this.nodelist[j].nod_id){
              //       for(var k in this.nodelist[j].nod_explain){
              //         for(var m in showThis){
              //           if(showThis[m].key === this.nodelist[j].nod_explain[k].key){
              //             const info=[]
              //             info.push(showThis[m].key)
              //             this.info_chose=info
              //           }
              //         }
              //       }
              //     }
              //   }
              // }
              // this.nodelist=eval(response.data.data)
              // for(var i in this.nodelist){
              //   this.nodelist[i].typestate=1
              //   this.nodelist[i].nod_explain=eval(response.data.data[i].nod_explain)
              //   for(var j in this.nodelist[i].nod_explain){
              //     if(this.nodelist[i].nod_explain[j].show===2){
              //       this.info_chose=this.nodelist[i].nod_explain[j].key
              //     }
              //   }
              // }
            }
          })
          .catch(Error => {
            // console.log("停用的分类err", err);
            this.$message.error('请求失败!')
          })
    },
    //数据管理
    manageData(scope){
      this.datamang=true
      this.basegetId=scope.com_data_baseid
      this.regetId=scope.com_data_regid
      this.disgetId=scope.com_data_disid
      this.devname=scope.com_name
      this.comid=scope.com_id

    },
    showListPages() {
      this.datamang = false
      this.getPageInfo();
      this.getDataInfoUp(1)
      this.getthisBind()
    },
    // 删除-这个
    delRow(row) {
      const data = {}
      // console.log('删除--', row)
      data.com_id = [row.com_id]
      this.$confirm('请确认,是否删除该设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delEquipment(data)
          .then(response => {
            // console.log('delAgric---', response)
            if (errorStatus(response.data)) {
              this.$message.success('删除成功!')
              if(this.currentPage!==1 && this.list.length===1){
                  this.currentPage=this.currentPage-1
              }
              this.getPageInfo()
            }
          })
          .catch(Error => {
            // console.log("停用的分类err", err);
            this.$message.error('删除请求失败!')
          })
      })
    },
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的设备!')
      } else {
        const data = {}
        data.com_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.com_id.push(chosed[i].com_id)
        }
        this.$confirm('请确认,是否删除所选中的设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delEquipment(data)
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
    // 全选
    changeState(e) {
      const _this = this
      // console.log('_this.checkedAll', _this.checkedAll)
      // console.log('_this.checkModel', _this.checkModel)
      // console.log('e--', e)
      _this.checkModel = []
      // _this.chardOrderid=[];
      if (_this.checkedAll === 1) {
        _this.checkModel = []
      } else {
        _this.list.forEach((data, index) => {
          _this.checkModel.push(data.far_id)
          // _this.chardOrderid.push(data.order_id);
        })
      }
    },
    // 单个--启用--停用
    enableThisClas(row, num) {
      const data = {}
      data.com_id = [row.com_id]
      if (num === 1) {
        // 启用
        startEquipment(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.com_state = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 停用
        stopEquipment(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.com_state = num
            }
          })
          .catch(Error => {
            // console.log("停用的账号err", err);
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
        this.$message.error('请选择要启用的设备!')
      } else {
        const com_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].com_state === 2) {
            com_id.push(chosed[i].com_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (com_id.length > 0) {
          data.com_id = com_id
          this.$confirm('请确认,是否启用选中的设备?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              startEquipment(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in com_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (com_id[i] === list[j].com_id) {
                          list[j].com_state = 1
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
                  console.log('启用的设备err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中设备的状态全部为'启用'", '提示', {
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
      const chosed =this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要停用的设备!')
      } else {
        const com_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].com_state === 1) {
            com_id.push(chosed[i].com_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (com_id.length > 0) {
          data.com_id = com_id
          this.$confirm('请确认,是否停用选中设备?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              stopEquipment(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in com_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (com_id[i] === list[j].com_id) {
                          list[j].com_state = 2
                        }
                      }
                    }
                    this.list = list
                    this.getPageInfo()
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的账号err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中设备状态已全部为'停用'?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {})
        }
      }
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
    handleCurrentWkChange(val){
      this.currentWkPage = val
       this.viewJob()
    },
    // 弹窗--取消
    cancle(formName) {
      this.$refs[formName].resetFields()
      this.dialog.show = false
    },
  

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formList.com_data_baseid=''
      this.formList.com_data_regid=''
      this.formList.com_data_disid=''
      this.formList.com_add_baseid=''
      this.formList.com_add_regid=''
      this.formList.com_add_disid=''

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
.el-row {
    .lk-table-box {
      .nodata-list {
        height: 50px;
        line-height: 50px;
        width: 100%;
        text-align: center;
        // background-color: #edeef2;
        color: #606266;
      }
      .box.box-solid {
        .sd-table-header {
          height: 65px;
          line-height: 65px;
          background-color: #e6e9f2;
          color: #666;
        }
        .sd-table-intro {
          background-color: #edeef2;
          height: 50px;
          line-height: 50px;
          padding-left: 20px;
          .el-checkbox.sd-chose-all-box {
            // margin-left: 20px;
            padding-left: 20px;
          }
          span {
            font-size: 14px;
            margin-right: 10px;
          }
        }
        .sd-table-detail {
          font-size: 14px;
          color: #666;
          .goodsInf {
            padding-left: 10px;
            .goodsBox {
              padding-top: 5px;
              height: 50px;
            }
            .img-pic {
              width: 40px;
              height: 40px;
              border: 1px solid #ddd;
              display: block;
              float: left;
            }
            .goods-text {
              float: left;
              // display: inline-block;
              // width:40px;
              padding-left: 10px;
              line-height: 40px;
            }
          }
          .padTop10 {
            padding-top: 15px;
          }
          .border-left {
            border-left: 1px solid #eee;
            padding: 0 10px;
            .tip-yellow {
              display: block;
              height: 20px;
              line-height: 20px;
              font-size: 12px;
              float: right;
              padding-right: 15px;
            }
            .sd-per-infor {
              padding: 15px 0 5px;
            }
            &.opration-btn {
              .el-button {
                margin: 5px 0 0;
              }
            }
            &.padTop10 {
              padding-top: 15px;
            }
          }
          .remarks-box {
            p {
              padding: 0px 0 2px;
              &.time {
                // color:#999;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
.equire-add-dialog {
  .equire-form-add {
    .el-checkbox-button.el-checkbox-button--medium {
      margin: 0 5px 5px 0;
      border: 1px solid #eee;
      border-radius: 5px 5px;
    }
    .el-checkbox-button--medium .el-checkbox-button__inner {
      border-radius: 5px 5px;
    }
    .el-checkbox-button--medium.is-focus .el-checkbox-button__inner {
      border: 1px solid #409eff;
    }
  }
}
</style>

<style>
.add-gods-title{
  color:#c0c4cc;
  font-size:12px
}
.rightInfoDevice{
  font-size:13px;
  color:#909399;
}
.Divisionline{
  margin-bottom:20px;
  border-bottom: 1px solid #ddd;
  font-size:16px
}
</style>