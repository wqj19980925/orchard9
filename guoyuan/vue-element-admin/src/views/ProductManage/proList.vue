<template>
  <div class="app-container">
    <el-row v-if="!currentList" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">生产列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol"@click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.exportBtn" class="stopCol-btn"@click="exportsd()">导出</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete"@click="delChoseBtn()">删除</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="生产编号:"class="sd-form-item"prop="pro_number" >
              <el-input v-model="formList.pro_number"placeholder="请输入生产编号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="商品品类:"class="sd-form-item"prop="cla_name">
              <el-input v-model="formList.cla_name"placeholder="请输入商品品类" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="商品名称:"class="sd-form-item"prop="goo_name">
              <el-input v-model="formList.goo_name"placeholder="请输入商品名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="农户名称:"class="sd-form-item"prop="far_name">
              <el-input v-model="formList.far_name"placeholder="请输入农民姓名" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="果园名称:"class="sd-form-item"prop="base_name">
              <el-input v-model="formList.base_name"placeholder="请输入果园名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="产区名称:"class="sd-form-item"prop="reg_name">
              <el-input v-model="formList.reg_name"placeholder="请输入产区名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4"class="sd-col-6">
            <el-form-item label="生产状态:"class="sd-form-item"prop="pro_state">
              <el-select v-model="formList.pro_state"class >
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
          <el-table-column label="生产信息"min-width align="center" width="450">
             <template  slot-scope="scope" >
              <table class="proinfo">
                <tr align="left">
                  <td colspan="3"> <span class="blue">[生产编号]</span>{{scope.row.pro_number}}</td> 
                </tr>
                <tr align="left">
                  <td><span class="blue">[品类]</span>{{scope.row.cla_name}} </td>
                  <td colspan="3"><span class="blue">[名称]</span>{{scope.row.goo_name}} </td>
                </tr>
                <tr align="left">
                  <td ><span class="blue">[农户]</span>{{scope.row.far_name}}</td>
                  <td><span class="blue">[果园]</span>{{scope.row.base_name}}</td>
                  <td><span class="blue">[产区]</span>{{scope.row.reg_name}}</td>
                </tr>
              </table>
            </template>
          </el-table-column>
          <el-table-column label="产量信息" sortable="true" align="center" width="100">
             <template  slot-scope="scope">
              <p ><span class="blue">预估:</span>{{scope.row.pro_estimate}}</p>
              <p ><span class="blue">实际:</span>{{scope.row.pro_actual}}</p>
              <p ><span class="blue">损耗:</span>{{scope.row.pro_loss}}</p>
            </template>
          </el-table-column>
           <el-table-column label="农事动态"   align="center" width="200">
              <template slot-scope="scope"> 
                  <div align="left">
                    <div v-for = "(item,index) in scope.row.pop_content">
                      <el-tooltip :content="item.value" v-if="item.type===2" placement="top" popper-class="test"   trigger="hover" >
                        <span v-if="item.type===2">{{index+1}}.{{item.value.substr(0,15)+'...' }}</span>
                      </el-tooltip>
                      <span  v-if="item.type===1">{{index+1}}.
                        <span @click="seedetails(item.value,1)" class="blue">查看详情</span>
                      </span>
                      <span  v-if="item.type===3">{{index+1}}.
                        <span @click="seedetails(item.value,3)" class="blue">查看详情</span>
                      </span>
                     
                    </div>
                  </div>
              </template>   
           </el-table-column>
          <el-table-column label="生产情况"align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.pro_state == 1">筹备中</div>
              <div v-if="scope.row.pro_state == 2">生产中</div>
              <div v-if="scope.row.pro_state == 3">暂停</div>
              <div v-if="scope.row.pro_state == 4">已结束</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"align="center"width="150">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button v-if="btnShow.editBtn && scope.row.pro_state===1 " size="mini"class="btn-mainCol"@click="editRow(scope.row)">编辑</el-button>
                <el-button v-if="btnShow.manageBtn" size="mini"class="btn-mainCol"@click="manageRow(scope.row)">管理</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0"class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
      <!-- 弹窗 -->
      <el-dialog :visible.sync="showAddClas":title="dialogTit":close-on-click-modal="false"width="650px"
      @close="addClaForm('addCla')">
        <el-form :inline="true" ref="addCla":model="addCla":rules="rulesCla"label-width="90px">
          <div style="width:100%">
            <div>任务对象</div>
            <el-form-item  label="农户姓名"prop="far_id">
              <el-select v-model="addCla.far_id"class  @change="getDataInfoUp(2,$event)" @clear="getname(1)" filterable clearable>
                <el-option v-for="item in farmerList":key="item.far_id":label="item.far_name":value="item.far_id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="果园名称:"class="sd-form-item"prop="base_id" >
              <el-select v-model="addCla.base_id" class filterable clearable  @clear="getname(2)" @click.native="getSelect(1)" @change="getDataInfoUp(0)">
                <el-option v-for="item in baseList":key="item.base_id":label="item.base_name":value="item.base_id"/>
              </el-select>
            </el-form-item>
            <el-form-item  label="产区类型:"class="sd-form-item"prop="reg_type">
              <el-select v-model="addCla.reg_type"class @click.native="getSelect(2)" @clear="getname(3)" @change="getDataInfoUp(3,$event,addCla.base_id)" filterable clearable >
                <el-option v-for="item in typeList":key="item.reg_type":label="item.type_name":value="item.reg_type"/>
              </el-select>
            </el-form-item>
             <el-form-item  label="产区名称:"class="sd-form-item"prop="reg_id">
              <el-select v-model="addCla.reg_id"class @click.native="getSelect(3)" @clear="getname(4)" @change="getDataInfoUp(4,$event)" filterable clearable>
                <el-option v-for="item in proList":key="item.reg_id":label="item.reg_name":value="item.reg_id"/>
              </el-select>
            </el-form-item>
            <el-form-item  label="区域名称:"class="sd-form-item"prop="dis_id">
              <el-select v-model="addCla.dis_id"class @click.native="getSelect(4)" filterable clearable style="width:300px">
                <el-option v-for="item in areaList":key="item.dis_id":label="item.dis_name":value="item.dis_id"/>
              </el-select>
            </el-form-item>
            <div class="Divisionline"/>
            <el-form-item label="商品品类:"class="sd-form-item"prop="cla_id">
              <el-select v-model="addCla.cla_id"class filterable clearable @clear="getname(5)" @change="getDataInfoDown(2,$event)">
                <el-option v-for="item in classifyList":key="item.cla_id":label="item.cla_name":value="item.cla_id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称:"class="sd-form-item"prop="goo_id">
              <el-select v-model="addCla.goo_id"class filterable clearable @clear="getname(6)"  @change="getDataInfoDown(3,$event)" @click.native="getSelect(5)" >
                <el-option v-for="item in goodsList":key="item.goo_id":label="item.goo_name":value="item.goo_id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="水果套袋:"class="sd-form-item"prop="acl_id">
              <el-select v-model="addCla.acl_id" disabled>
                <el-option v-for="item in categList":key="item.acl_id":label="item.acl_name":value="item.acl_id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="农资名称:"class="sd-form-item"prop="agr_id">
              <el-select v-model="addCla.agr_id"class filterable clearable @click.native="getSelect(6)">
                <el-option v-for="item in agricsList":key="item.agr_id":label="item.agr_name":value="item.agr_id"/>
              </el-select>
            </el-form-item>
             <el-form-item label="生产周期"prop="day" >
              <el-input v-model="addCla.day" style='width:200px'/>天
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button v-if="edit"type="primary"@click="addeditBtn('addCla')">确 定</el-button>
          <el-button v-else type="primary"@click="addBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
       <!-- 农事动态弹窗 -->
      <el-dialog :visible.sync="detailShow":title="dialogTit":close-on-click-modal="false"width="500px"
      @close="addClaForm('addCla')">
         <el-form :inline="true" ref="addCla":model="addCla":rules="rulesCla"label-width="90px">
          <el-row :gutter="20"class="addGods-infor-box" >
            <div v-for="(item,index) in farmDynamics":key="index"class="addGods-infor-ipt clearfix">
              <el-col :span="6"><!-- class="add-gods-title" -->
                <el-col :span="24">
                  <span v-if='item.type<11'>{{item.key}}</span>
                  <span v-else>{{item.key.title}}</span>
                </el-col>
              </el-col>
              <el-col :span="18">
                <el-col :span="24" v-if="!item.alllist">
                  <span v-if="item.type<11 && item.type!==5 && item.type!==6">{{item.value}}</span>
                  <el-button v-if="item.type===5 || item.type===6" class="up_img_btn" type="primary"@click="lookImg(index)" >
                    点击预览
                  </el-button>
                </el-col>
                <el-col :span="24" v-if="item.type>10">
                  <el-col :span="12" style="padding-left:0px">
                    <span>{{item.value.name}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>{{item.value.n_name}}</span>
                  </el-col>
                  <span v-if="item.type===15 && item.value.type===1 ">
                    <span  class="rightInfoWord">
                      消耗数量:{{item.value.number}}
                    </span>
                  </span>
                </el-col>
              </el-col>
            </div>
          </el-row>
         </el-form>
      </el-dialog>
    </el-row>
    <a :href="exportUrl"id='exportFile'style='display:none;'></a>
    <proListMange  :pro-id="pro_id" :pri-id="pri_id" :pro-num="pro_num" @listerToChild="showList()" v-if="currentList"/>
  </div>
</template>
<script>
import {produtList, addProdut, editProdut, delProdut,exprotProdut,getProdutInfo,seedlManage,searchAgricul,addAgricul,getOutInfo,addOutInfo,operList,harvestList,exprotPop,delOperecord,startPro,suspendPro,endPro,editEstOutput,editReap,editSeeding,reportLoss,editLoss,hideThisRec,showThisRec,getLevel,getStack,addStack,addAgrtasks,saveAgrtasks,searNewInfo,addNewInfo,searchUp,searchDown,searNursery,getLevelInfo } from '@/api/ProductManage'
import { errorStatus } from '@/utils/index'
import proListMange  from './components/proListMange'
export default {
  name: 'Account',
  components: { proListMange },
  data() {
    return {
      farmDynamics:[],//农事动态数组
      detailShow:false,//查看农事动态是json时的详情
      fardis:false,
      regdis:false,
      exportUrl:'',
      currentList:false,
      formList: {
        pro_number:'',
        cla_name: '',
        goo_name: '',
        far_name: '',
        base_name: '',
        reg_name: '',
        pro_state: ''
      },
      pro_id:'',
      pro_num:'',
      base_id: '',//编辑时获取到的id,在list为空的时候提交给后台id
      reg_id: '',//编辑时获取到的id,在list为空的时候提交给后台id
      dis_id:'',//编辑时获取到的id,在list为空的时候提交给后台id
      base_name: '',//编辑时获取到的名,在list为空的时候插入到form中
      reg_name: '',//编辑时获取到的名,在list为空的时候插入到form中
      dis_name:'',//编辑时获取到的名,在list为空的时候插入到form中
      categList:[
        { acl_id: 15, acl_name: '水果种植套袋' },//暂时写成15
      ],
      typeList1:[
        { reg_type: 1, type_name: '耕地大田' },
        { reg_type: 2, type_name: '圈舍牧区' },
        { reg_type: 3, type_name: '鱼池水塘' },
        { reg_type: 4, type_name: '果园林区' },
        { reg_type: 5, type_name: '温室大棚' }
      ],
       addCla: {
        acl_id:11,
        agr_id:'',
        cla_id:'',
        goo_id:'',
        far_id:'',
        base_id:'',
        reg_id:'',
        reg_type:'',
        dis_id:'',
        day:'',
        pro_id:''
      },
      rulesCla: {
        acl_id: [
          { required: true, message: '请输入农资品类', trigger: 'change' }
        ],
        // agr_id: [
        //   { required: true, message: '请输入农资名称', trigger: 'change' }
        // ],
        // cla_id: [
        //   { required: true, message: '请输入商品品类名称', trigger: 'change' }
        // ],
        // goo_id: [
        //   { required: true, message: '请输入商品名称', trigger: 'change' }
        // ],
        // far_id: [
        //   { required: true, message: '请输入农户姓名', trigger: 'change' }
        // ],
        // base_id: [
        //   { required: true, message: '请输入果园名称', trigger: 'change' }
        // ],
        // reg_id: [
        //   { required: true, message: '请输入产区名称', trigger: 'change' }
        // ],
        // reg_type: [
        //   { required: true, message: '请输入区域名称', trigger: 'change' }
        // ],
        // dis_id: [
        //   { required: true, message: '请输入产区类型', trigger: 'change' }
        // ],
      },
      tagTitle:'',
      edit: false,
      rules: {
        dis_name: [],
        dis_number:[],
        pro_state: [],
        far_id: [],
        reg_type: [],
        reg_id: []
      },
      rolesType:1,
      goodsType:1,
      object:[
        { id: 0, name: '全部' },
        { id: 1, name: '农资' },
        { id: 2, name: '商品' }
      ],
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '筹备中' },
        { id: 2, name: '生产中' },
        { id: 3, name: '已暂停' },
        { id: 4, name: '已结束' }
      ],
      state1: [
        { id: 1, name: '筹备中' },
        { id: 2, name: '生产中' },
        { id: 3, name: '已暂停' },
        { id: 4, name: '已结束' }
        ],
      agricsList:[],
      typeList:[],
      goodsList:[],
      classifyList:[],
      areaList:[],
      proList:[],
      baseList:[],
      farmerList:[],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      worklist:[],
      showAddClas: false,
      showTime:false,
      showRecord:false,
     
      deldis_id:'',

      dialogTit: '新增',
      dialog: {
        title: '新增',
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      chosed: [],
      serch_req: false,
      showNPwd: false,
      btnShow:{},
      pri_id:''
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },
  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getPageInfo();
    this.formList.pro_state = this.state[0].name
    this.getDataInfoUp(this.rolesType)
    this.getDataInfoDown(this.goodsType)
    // this.formList.reg_type = this.typelist[0].name
    this.addCla.acl_id = this.categList[0].acl_id
  },
  methods: {
    getPageInfo() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {};
      data.pri_id = this.$route.meta.pri_id
      
      data.page = this.currentPage
      produtList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            // const role_id = { rol_id: 0, rol_name: "全部" };
            // this.godsType.splice(0, 0, role_id);
            this.list = dataRep.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total

            const btnList = dataRep.button_data
            // console.log('btnList---', btnList)
          
            for (const i in btnList) {

              if(btnList[i].pri_funname === '新增'){
                this.$set(this.btnShow, 'addBtn', true)
              } else if (btnList[i].pri_funname === '导出') {
                this.$set(this.btnShow, 'exportBtn', true)
              } else if (btnList[i].pri_funname === '管理') {
                this.$set(this.btnShow, 'manageBtn', true)
                this.pri_id = btnList[i].pri_id
              } else if (btnList[i].pri_funname === '编辑') {
                this.$set(this.btnShow, 'editBtn', true)
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(this.btnShow, 'delBtn', true)
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
    //查看农事动态
    seedetails(row,type){
      this.farmDynamics=eval(row)
      this.detailShow=true
      if(type===1){
        this.dialogTit='农事任务'
      }
      if(type===3){
        this.dialogTit='新增信息'
      }
      
    },
    getDataInfoUp(rolesType,id,baseId,ownerId){
      const search={}
      search.type=rolesType
      if(rolesType===2 && !id == ''){
         search.far_id=id  
         this.addCla.reg_type=''
         this.addCla.base_id=''
         this.addCla.reg_id=''
         this.addCla.dis_id=''
         this.baseList=[]
         this.proList=[]
         this.typeList=[]
         this.areaList=[]
      }else if(rolesType===0 ){
         this.addCla.reg_type=''
         this.addCla.reg_id=''
         this.addCla.dis_id=''
         this.typeList=this.typeList1
         if(this.edit === true){
          this.addCla.reg_type=id
         }
         return
      }else if(rolesType===3 && !id == ''){ 
        if(baseId){
         search.reg_type=id
         search.base_id=baseId
         this.addCla.reg_id=''
         this.addCla.dis_id=''
        }else{
          return
        }
      }else if(rolesType===4 && !id == ''){
         search.reg_id=id
         this.addCla.dis_id=''
      }else if(rolesType && id === ''){
        return
      }
      searchUp(search)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            if(rolesType===1){
              this.farmerList=dataRep.data
            }
            if(rolesType===2){
              this.baseList=dataRep.data
              if(this.edit === true){
                this.addCla.base_id=ownerId
                if(this.baseList.length===0){
                  this.addCla.base_id = this.base_name
                  this.base_id=ownerId
                }
              }
            }
            if(rolesType===3){
              this.proList=dataRep.data

              if(this.edit === true){
                  this.addCla.reg_id=ownerId
                if(this.proList.length===0){
                  this.addCla.reg_id = this.reg_name
                  this.reg_id=ownerId
                }
              }
            }
            if(rolesType===4){
              this.areaList=dataRep.data
              if(this.edit === true){
                  this.addCla.dis_id=ownerId
                if(this.areaList.length===0){
                  this.addCla.dis_id = this.dis_name
                  this.dis_id=ownerId
                }
              }
            }
            
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
    getDataInfoDown(goodsType,id,ownerId){
      const search={}
      search.type=goodsType
      if(goodsType===2 && !id == ''){
         search.cla_id=id  
         this.agricsList=[],
         this.goo_id=''
         this.agr_id=''
      }
      else if(goodsType===3 && !id == ''){ 
         search.acl_id=15//暂时定死传15
      }
      else if(goodsType && id === ''){
        return
      }
      searchDown(search)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            if(goodsType===1){
              this.classifyList=dataRep.data
            }
            if(goodsType===2){
              this.goodsList=dataRep.data
              if(this.edit === true){
                this.addCla.goo_id=ownerId

              }
            }
            if(goodsType===3){
              this.agricsList=dataRep.data
              if(this.edit === true){
                this.addCla.agr_id=ownerId
              }
            }
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
    getSelect(listType){
     if(listType === 1){
      if(this.addCla.far_id==='' || !this.addCla.far_id){
        this.$message.error('请先选择农户姓名')
      }
     }
     if(listType === 2){
      if(this.addCla.base_id==='' || !this.addCla.base_id){
        this.$message.error('请先选择果园名称')
      }
     }
     if(listType === 3){
      if(this.addCla.reg_type==='' || !this.addCla.reg_type){
        this.$message.error('请先选择产区类型')
      }
      if(this.addCla.base_id==='' || !this.addCla.base_id){
        this.$message.error('请先选择果园名称')
      }
     }
     if(listType === 4){
      if(this.addCla.reg_id==='' || !this.addCla.reg_id){
        this.$message.error('请先选择产区名称')
      }
     }
     if(listType === 5){
      if(this.addCla.cla_id==='' || !this.addCla.cla_id){
        this.$message.error('请先选择商品分类')
      }
     }
     if(listType === 6){
      if(this.addCla.goo_id==='' || !this.addCla.goo_id){
        this.$message.error('请先选择商品名称')
      }
     }
      
    },
    // 搜索
    searchList(formName, page) {
      const search ={}
      search.pro_number=this.formList.pro_number
      search.cla_name=this.formList.cla_name
      search.far_name=this.formList.far_name
      search.base_name=this.formList.base_name
      search.reg_name=this.formList.reg_name
      search.pro_state=this.formList.pro_state
      search.goo_name=this.formList.goo_name
      if (search.pro_state === '全部' || search.pro_state === 0) {
        search.pro_state = ''
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // console.log('search--', search)
      search.pri_id = this.$route.meta.pri_id
      search.page = page
      produtList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            // const rol = { rol_id: 0, rol_name: '全部' }
            // const role = dataRep.data_info.role
            // role.unshift(rol)
            // this.godsType = role
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


    // 编辑按钮
     editRow(scope) { 
      this.showAddClas = true
      this.dialogTit = '编辑生产'
      this.edit = true
      this.$nextTick(() => {
      
        // console.log(scope)
        this.addCla.acl_id = 11
        this.addCla.far_id = scope.far_id
        this.addCla.pro_id = scope.pro_id
        // this.addCla.base_id= scope.base_name
        // this.addCla.reg_id= scope.reg_name
        // this.addCla.dis_id=scope.dis_name
        this.addCla.day = scope.pro_day
        for(var i in this.typeList1){
          if(scope.reg_type===this.typeList1[i].reg_type){
            this.addCla.reg_type=this.typeList1[i].type_name
          }
        }
        this.getDataInfoUp(2,scope.far_id,'',scope.base_id)
        this.getDataInfoUp(0,scope.reg_type)
        this.getDataInfoUp(3,scope.reg_type,scope.base_id,scope.reg_id)
        this.getDataInfoUp(4,scope.reg_id,'',scope.pro_disid)
        this.base_name= scope.base_name
        this.reg_name = scope.reg_name
        this.dis_name = scope.dis_name
        // this.base_id= scope.base_id
        // this.reg_id= scope.reg_id
        // this.agr_id= scope.pro_agrid
        this.addCla.cla_id= scope.cla_id
        this.getDataInfoDown(2,scope.cla_id,scope.goo_id)//获取商品名称
        this.getDataInfoDown(3,15,scope.pro_agrid)//根据水果套袋定死的15选择农资名称
        // this.addCla.goo_id= scope.goo_id 
        // this.addCla.agr_id = scope.pro_agrid
      })
    },
    addClaForm(formName) {
      this.showAddClas = false
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
      this.showTime = false
    },
    // 添加-弹窗
    addGoodsBtn() { // 点击我的云仓添加按钮后的操作
      this.showAddClas = true
      this.getDataInfoUp(1)
      this.dialogTit = '新增生产'
      this.edit = false
    },
     // 添加--提交
    addBtn(formName){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const that = this
      const data = that.addCla
      addProdut(data)
        .then(res => {
          loading.close()
          if (errorStatus(res.data)) {
            that.getPageInfo()
            that.$message.success('生产信息增加成功!')
            that.showAddClas = false
            this.$refs[formName].resetFields()
          }
        })
        .catch(err => {
          loading.close()
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
    // 添加--提交
    addeditBtn(formName) {
      const that = this
      const data =that.addCla
      if(that.baseList.length === 0){
        data.base_id=that.base_id
      }else{
        data.base_id=that.addCla.base_id
      }
      if(that.proList.length === 0){
        data.reg_id=that.reg_id
      }else{
        data.reg_id=that.addCla.reg_id
      }
      if(that.areaList.length === 0){
        data.dis_id=that.dis_id
      }else{
        data.dis_id=that.addCla.dis_id
      }
      data.day=Number(that.addCla.day)
      editProdut(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.$message.success('编辑生产信息成功!')
            that.showAddClas = false
            that.$refs[formName].resetFields()
            that.getPageInfo()
            
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
    clickABtn(){
      // console.log("url--",this.exportUrl)
      // return false
       setTimeout(() => {
        document.getElementById('exportFile').click();
      }, 1000)
    },
    exportsd(){
      const url = process.env.BASE_API
      const baseUrl=url.replace('/public','/')
      const data=this.formList
      if(data.pro_state == ''||data.pro_state === '全部'){
        data.pro_state=''
      }
      delete data.page
      exprotProdut(data).then(response=>{
        if(errorStatus(response.data)){
          const str=response.data.data
          this.exportUrl=baseUrl+str
          this.clickABtn()
         
        }
      }).catch(Error=>{
        this.$message.error("导出请求失败")
      })
    },
    manageRow(row){
      this.currentList = true
      this.pro_id=row.pro_id
      this.pro_num=row.pro_number
    },
    showList() {
      this.currentList = false
      this.getPageInfo();
      this.formList.pro_state = this.state[0].name
      this.getDataInfoUp(this.rolesType)
      this.getDataInfoDown(this.goodsType)
      // this.formList.reg_type = this.typelist[0].name
      this.addCla.acl_id = this.categList[0].acl_id
    },
     //  删除--多选
    delChoseBtn() {
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的生产信息!')
      } else {
        const data = {}
        data.pro_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.pro_id.push(chosed[i].pro_id)

        }

        this.$confirm('请确认,是否删除所选中的生产信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delProdut(data)
            .then(response => {
              // console.log('delgo---', response)
              if (errorStatus(response.data)) {
                // this.currentPage = 1
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
    getname(type){
      if(type===1){
         this.addCla.reg_type=''
         this.addCla.base_id=''
         this.addCla.reg_id=''
         this.addCla.dis_id=''
         this.baseList=[]
         this.proList=[]
         this.typeList=[]
         this.areaList=[]
      }else if(type===2 ){
         this.addCla.reg_type=''
         this.addCla.reg_id=''
         this.addCla.dis_id=''
         this.proList=[]
         this.typeList=[]
         this.areaList=[]
      }else if(type===3){ 
         this.addCla.reg_id=''
         this.addCla.dis_id=''
         this.proList=[]
         this.areaList=[]
      }else if(type===4){
         this.addCla.dis_id=''
         this.areaList=[]
      }else if(type===5){
         this.addCla.goo_id=''
         this.goodsList=[]
      }else if(type===6){
         this.addCla.agr_id=''
         this.agricsList=[]
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
    // backBtn(){
    //   var tagName={}

    //    this.$confirm('确定离开'+tagName+'的生产列表?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //     .then(() => {
    //       this.$emit('listerToChild', 'addPage')
    //       }).catch(() => {
    //     })
    //  },
    cancleDia(formName) {
      const addForm = this.addForm
      this.dialog.show = false
      addForm.adm_name = ''
      addForm.adm_acc = ''
      addForm.adm_mobile = ''
      addForm.adm_pre = ''
      addForm.adm_stase = ''
      addForm.adm_pas = ''
      // if(addForm.adm_name!==''||addForm.adm_acc!==''||addForm.adm_mobile!==''||addForm.adm_pre!==''||addForm.adm_stase!==''||addForm.adm_pas!==''){
      //     this.$confirm('添加尚未完成,是否确定离开', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {

      //   }).catch(() => {

      // })
      // }
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
  font-size:14px
}
.Divisionline{
  width:100%;
  margin-bottom:20px;
  border-bottom: 1px solid #ddd;
  font-size:16px
}
.proinfo tr td{
  min-width:100px
}
.el-tooltip__popper{
  max-width: 400px;
  line-height: 180%;
}
</style>