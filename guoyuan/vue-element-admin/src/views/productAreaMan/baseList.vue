<template>
  <div class="app-container">
    <el-row v-if="!product && !envir" class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">果园列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol"@click="addGoodsBtn()">新 增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn"@click="enableClas()">启 用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn"@click="stopClas()">停 用</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete"@click="delChoseBtn()">删 除</el-button>
          <el-button v-if="btnShow.deviceBtn"class="btn-mainCol"@click="editbindDev()">设 备</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="果园名称:"class="sd-form-item"prop="far_name" >
              <el-input v-model="formList.far_name"placeholder="请输入果园名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6"class="sd-col-6">
            <el-form-item label="果园编号:"class="sd-form-item"prop="far_serial">
              <el-input v-model="formList.far_serial"placeholder="请输入果园编号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
           <el-form-item label="负责人姓名:"class="sd-form-item"prop="far_farid" >
              <el-select v-model="formList.far_farid"  filterable>
                <el-option v-for="item in farmerlist":key="item.far_id":label="item.far_name":value="item.far_id"/>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="5"class="sd-col-6">
            <el-form-item label="联系电话:"class="sd-form-item"prop="far_farmoblie">
              <el-input v-model="formList.far_farmoblie"placeholder="请输入联系电话" clearable/>
            </el-form-item>
          </el-col>
           <el-col :span="5"class="sd-col-6">
            <el-form-item label="状态:"class="sd-form-item"prop="far_state">
              <el-select v-model="formList.far_state"class >
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
      <!-- 列表 -->
      <div class="lk-table-box">
        <table-box :list-data="list" style="width:100%;min-width:980px;">
          <tr slot="theader"class="sd-table-header">
            <th style="min-width:30px">
              <label class="el-checkbox sd-chose-all-box">
                <input v-model="checkedAll"type="checkbox"class="none"@click="changeState($event)">
                <!-- <input type="checkbox"class="none"v-model="checkedAll"> -->
                <span v-if="checkedAll===1"class="el-checkbox__input is-checked">
                  <span class="el-checkbox__inner" />
                </span>
                <span v-if="checkedAll===2"class="el-checkbox__input">
                  <span class="el-checkbox__inner" />
                </span>
                <span v-if="checkedAll===3"class="el-checkbox__input is-indeterminate">
                  <span class="el-checkbox__inner" />
                </span>
              </label>
            </th>
            <th style="min-width:100px">果园配置</th>
            <th style="min-width:100px">农户信息</th>
            <th style="min-width:100px">操作</th>
          </tr>
          <template slot="row"slot-scope="props">
            <!-- {{props.item}} -->
             <!-- 上边一行 -->
            <tr class="sd-table-intro">
              <td colspan="10">
                <label class="el-checkbox sd-chose-all-box">
                  <input v-model="checkModel":value="props.item.far_id"type="checkbox"class="none">
                  <span :class="checkModel.indexOf(props.item.far_id)>=0?'el-checkbox__input is-checked':'el-checkbox__input'">
                    <span class="el-checkbox__inner" />
                  </span>
                  <span class="">果园名称:{{ props.item.far_name }}</span>
                  <span class="">果园编号:{{ props.item.far_serial }}</span>
                  <span class="">果园面积:{{ props.item.far_area }}</span>
                  <span >状态: 
                    <span class="blue" v-if="props.item.far_state ===1">启用</span>
                    <span class="red" v-else>停用</span>
                  </span>
                </label>
              </td>
            </tr>
            <tr class="sd-table-detail"align="center"valign="top">
              <td colspan="2" class="border-left"align="center">
                <div style="padding-bottom:6px;">
                  <p class="sd-per-infor" >员工个数:
                    <span v-if="props.item.off_count!==0">{{ props.item.off_count }}</span>
                    <span v-else>0</span>
                  </p>
                  <p class="sd-per-infor" >临时工个数:
                    <span v-if="props.item.tem_count!==0">{{ props.item.tem_count }}</span>
                    <span v-else>0</span>
                  </p> 

                </div>
              </td><!-- v-if=" props.item.type_count === 4"  -->
              <td class="border-left"align="left">
                <div style="padding-bottom:6px;">
                    <p class="sd-per-infor">负责人姓名:{{ props.item.far_farname }} </p>
                    <p class="sd-per-infor">联系电话:{{ props.item.far_mobile }}</p>
                    <p class="sd-per-infor">果园地址:{{ props.item.far_pro}}{{ props.item.far_cit}}{{ props.item.far_tow}}{{ props.item.far_address }}</p> 
                </div>
              </td>
              <td class="border-left opration-btn"style="width:'80px'">
                <div>
                  <div class="orderLine-btn"style="padding:10px 0;width:180px;">
                    <el-button v-if="btnShow.editBtn" class="btn-mainCol btn-marg"size="small"@click="editRow(props.item)">
                      编辑
                    </el-button>
                    <el-button v-if="btnShow.envirBtn" class="openCol-btn btn-marg"size="small"@click="enviroData(props.item,1)"style="width:115px">
                      环境数据
                    </el-button>
                    <el-button v-if="btnShow.mangeBtn"size="small"class="btn-mainCol"@click="manageRow(props.item)">管理</el-button> 
                    <el-button v-if="props.item.far_state ===2 && btnShow.startBtn" class="btn-secCol btn-marg"size="small"@click="enableThisClas(props.item,1)">
                      启用
                    </el-button>
                     <el-button v-if="props.item.far_state ===1 && btnShow.stopBtn" class="btn-secCol btn-marg"size="small"@click="enableThisClas(props.item,2)">
                      停用
                    </el-button>
                    <el-button v-if="btnShow.delBtn" class="btn-delete btn-marg"size="small"@click="delBtn(props.item,1)">
                      删除
                    </el-button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </table-box>
        <div v-if="list.length===0"slot="nodata"class="nodata-list">暂无数据</div>
      </div>
      <div v-show="list.length>0"class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
         <!-- 弹窗 -->
      <el-dialog :visible.sync="showAddClas":title="dialogTit":close-on-click-modal="false"width="600px"
      @close="addClaForm('addCla')">
        <el-form ref="addCla":model="addCla" :inline="true" :rules="rulesCla"label-width="100px">
          <el-form-item label="果园名称:"class="sd-form-item"prop="massif_name" style="width:350px">
            <el-input v-model="addCla.massif_name"placeholder="请输入果园名称" style="width:200px"/>
          </el-form-item>
           <el-form-item label="果园地址:"prop="province"class="sd-form-item inventory">
            <el-select v-model="addCla.province"value-key="id"style="width:120px"clearable filterable placeholder="省"@change="choseProvince">
              <el-option v-for="item in province":key="item.id":label="item.value":value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item   label label-width="0px" prop="city" class="sd-form-item inventory" />
            <el-select v-model="addCla.city"class style="width:120px"clearable filterable placeholder="市"@change="choseCity">
              <el-option v-for="item in cityList":key="item.id":label="item.value":value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label label-width="0px"prop="county"class="sd-form-item inventory"/> 
            <el-select v-model="addCla.county"clearable filterable class style="width:100px"placeholder="县/区"@change="choseBlock">
              <el-option v-for="item in countyList":key="item.id":label="item.value":value="item.value"/>
            </el-select>
          </el-form-item>
<!--             <el-form-item label prop="city"label-width="0px" class="sd-form-item inventory"/>
            <el-form-item label label-width="0px"prop="county"class="sd-form-item inventory"/> -->
          <el-form-item label="详细地址" prop="detailAddress"class="sd-form-item inventory" >
            <el-input v-model="addCla.address"placeholder="请输入详细地址" style="width:200px"/>
          </el-form-item>
          <el-form-item label="负责人姓名:"class="sd-form-item"prop="far_farid" style="width:350px">
            <el-select v-model="addCla.far_farid" filterable clearable>
              <el-option v-for="item in farmerlist":key="item.far_id":label="item.far_name":value="item.far_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="区域面积"prop="area" >
            <el-input v-model="addCla.area"placeholder="0.00亩" type="number" @change="serNumb()" style="width:200px"/>亩
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button v-if="edit"type="primary"@click="addeditBtn('addCla')">确 定</el-button>
          <el-button v-else type="primary"@click="addBtn('addCla')">确 定</el-button>
        </span>
      </el-dialog>
            <!-- 绑定 -->
      <el-dialog :visible.sync="showBingClas":title="dialogTit":close-on-click-modal="false"width="650px"
      @close="addClaForm('addBind')" class="equire-add-dialog">
        <el-form ref="addBind" label-width="100px" class="equire-form-add">
          <div v-for="(item,index) in editNodeList">
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
    <envirList v-if="!product && !area && envir" :envir-id="pri_id1" :base-id="basegetId" :base-name='basename' :far-name="far_name" :far-num="far_serial" :base-address="base_address"  @listerToChild="showListPages()" />
    <proListMange v-if="product && !envir" :base-id="base_id" :pri-id="pri_id" :far-id="far_id" @listerToChild="showListPages()"/>
  </div>
</template>
<script>
import {baseList, startBase, stopBase, addBase, editBase, delBase,getEditBase ,getFarmer,getEnviroment,getBindInfo,subBind} from '@/api/productAreaMan'
import { errorStatus } from '@/utils/index'
import TableBox from '@/components/tableBox'
import axios from 'axios'
import proListMange  from '../ProductManage/components/proListMange'
import envirList from './components/envirList'
export default {
  components: {  TableBox, envirList,proListMange },
  name: 'Account',
  data() {
    return {
      base_id:'',
      far_id:'',
      pri_id:'',
      pri_id1:'',
      showBingClas:false,//编辑绑定设备
      info_chose:[],
      addBind:{
        com_name:'',
        com_id:null,
        com_number:'',
        nod_node:''
      },
      info_chose:[],
      editNodeList:[],
      basename:'',
      resArea:'',
      basegetId:'',
      far_serial:'',
      far_name:'',
      base_address:'',
      product:false,
      area:false,
      envir:false,
      mapJson: '../../../static/map/map.json',
      province: [],
      checkModel: [],
      sheng: '',
      shi: '',
      qu: '',
      city: '',
      block: '',
      checkedAll: 2,
      formList: {
        far_name:'',
        far_serial: '',
        far_farname:'',
        far_farmoblie:'',
        far_state: '',
        far_farid:'',
      },
      edit: false,
      rules: {
        far_name: [],
        far_serial:[],
        far_state: [],
        far_farmoblie:[],
        far_farname:[]
      },
      provinceList: [],
      cityList: [],
      countyList: [],
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
      regionList:[],
      productList:[],
      farmerlist:[],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      worklist:[],
      currentWkPage: 1,
      pageWkSize: null,
      totalWkNum: null,
      showAddClas: false,
      showTime:false,
      showRecord:false,
      addCla: {
        massif_name:'',
        far_farid: '',
        area:'',
        province: '', // 省
        city: '', // 市
        county: '', // 县
        address: '', // 详细地址
        far_qh:'',//区号
        provinceId:'',
        cityId:'',
        countyId:'',
        massif_id:'',
        city_name:''
      },
      delfar_id:'',
      rulesCla: {
        dis_unit: [
          { required: true, message: '请输入云仓名称', trigger: 'blur' }
        ],
        far_name: [
          { required: true, message: '请选择仓库类型', trigger: 'blur' }
        ],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        city: [{ required: true, message: '请选择市', trigger: 'change' }],
        county: [{ required: true, message: '请选择区/县', trigger: 'change' }],
      },
      dialogTit: '查看设备',
      dialog: {
        title: '新增',
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      chosed: [],
      serch_req: false,
      addRules: {
        tem_name: [{ required: true, message: '请输入临时工姓名', trigger: 'blur' }],
        far_state: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
      showNPwd: false,
      warnBd:{
        city:false
      },
      btnShow:{},
      envirgetId:'',
      areaPriId:'',
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },
  watch: {
    // 监视双向绑定的数据数组
    'checkModel': {
      handler: function(val, oldVal) {
        if (val.length === this.list.length) {
          this.checkedAll = 1
        } else if (val.length < this.list.length && val.length !== 0) {
          this.checkedAll = 3
        } else {
          this.checkedAll = 2
        }
      },
      deep: true
    }
  },
  created() {
    this.getPageInfo();
    this.getCityData()
    this.getFarmerlist()
    this.getEditDev()
    this.formList.far_state = this.state[0].id
    // this.formList.reg_type = this.typelist[0].name
    // this.addForm.adm_stase = this.state1[0].name;
  },
  methods: {
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
    // 选省
    choseProvince: function(e) {
      this.warnBd.city=false;
      this.cityList = []
      this.countyList = []
      this.addCla.city = ''
      this.addCla.county = ''
      this.addCla.address = ''

      for (var index2 in this.province) {
        if (e === this.province[index2].value) {
          this.cityList = this.province[index2].children
          this.shi = this.province[index2].children[0].value
          this.countyList = this.province[index2].children[0].children
          this.qu = this.province[index2].children[0].children[0].value
          this.E = this.countyList[0].value
        }
      }
      for(var i in this.province){
        if(this.province[i].value === e){
          this.addCla.provinceId=this.province[i].id
        }
      }   
    },
    // 选市
    choseCity: function(e) {  
      this.warnBd.city=false;
      if(e ===''){
        this.warnBd.city=true;
      }
      this.countyList = []
      // this.addCla.city='';
      this.addCla.county = ''
      this.addCla.address = ''
      for (var index3 in this.city) {
        if (e === this.city[index3].value) {
          this.countyList = this.city[index3].children
          this.qu = this.city[index3].children[0].value
          this.E = this.countyList[0].value
        }
      }
       for(var i in this.cityList){
        if(e === this.cityList[i].value){
          this.addCla.cityId=this.cityList[i].id
        }
      }    
    },
    // 选区
    choseBlock: function(e) {
      this.E = e
      this.addCla.address = '';
      if(e ===''){
        this.warnBd.county=true;
      }
      for(var i in this.countyList){
        if(this.countyList[i].value === e){
          this.addCla.countyId =this.countyList[i].id
        }
      }        
    },
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
      baseList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
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
                this.pri_id1=btnList[i].pri_id
                this.envirgetId=btnList[i].pri_id
              } else if (btnList[i].pri_funname === '管理') {
                this.$set(this.btnShow, 'mangeBtn', true)
                this.pri_id=btnList[i].pri_id
              } else if (btnList[i].pri_funname === '设备') {
                this.$set(this.btnShow, 'deviceBtn', true)
              }      
            }
            // for(var i in this.list){
            //   const typeC=[]
            //   typeC.push({
            //     type: this.list[i].type_count[i].type,
            //     count:this.list[i].type_count[i].count,
            //     })
            //   console.log
            //   this.typecount=typeC
            // }         
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    getFarmerlist(){
      const data = {};
      getFarmer(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.farmerlist = dataRep.data
            const gos = { far_id: 0, far_name: '全部' }
            this.farmerlist.unshift(gos)
            this.formList.far_farid = this.farmerlist[0].far_id
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    // 搜索
    searchList(formName, page) {
      const search =this.formList
      // search.name=this.formList.tem_name
      // search.tel=this.formList.tem_tel
      // search.state=this.formList.far_state
      if (search.far_state === '全部' || search.far_state === 0) {
        search.far_state = ''
      }
      if (search.far_farid === '全部' || search.far_farid === 0) {
        search.far_farid = ''
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
      baseList(search)
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
    viewJob(scope,delid){
      this.showRecord =true
      const data = {};
      if(this.delfar_id ===''){
        data.far_id = scope.far_id
      }else{
        data.far_id = this.delfar_id
      }
      recordList(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.worklist = dataRep.data
            console.log( this.worklist )
            this.currentWkPage = dataRep.current_page
            this.pageWkSize = dataRep.current_number
            this.totalWkNum = dataRep.total
            this.delfar_id = scope.far_id
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
      if(this.farmerlist[0].far_name==='全部'){
        this.$delete(this.farmerlist,0)
      }
      this.dialogTit = '编辑果园'
      this.edit = true
      this.$nextTick(() => {
        this.addCla.massif_name = scope.far_name
        this.addCla.province = scope.far_pro
        this.addCla.city = scope.far_cit
        this.addCla.county = scope.far_tow
        this.addCla.address = scope.far_address
        this.addCla.area = scope.far_area
        this.addCla.far_farid = scope.farmer_id
        this.addCla.provinceId = scope.far_province
        this.addCla.cityId = scope.far_city
        this.addCla.countyId = scope.far_town
        this.addCla.massif_id = scope.far_id
      })
    },

    addClaForm(formName) {
      this.showAddClas = false
      this.showBingClas = false
      if(this.farmerlist[0].far_name!=='全部'){
        const gos = { far_id: 0, far_name: '全部' }
        this.farmerlist.unshift(gos)
      }
      if(this.edit){
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
          this.addCla.address=''
        })
      }else{
         this.$refs[formName].resetFields()
      }
      
      this.showTime = false
    },
    // 添加-弹窗
    addGoodsBtn() { // 点击添加按钮后的操作
      if(this.farmerlist[0].far_name==='全部'){
        this.$delete(this.farmerlist,0)
      }
      this.showAddClas = true
      this.dialogTit = '新增果园'
      this.edit = false

      // this.$refs[addCla].resetFields()
/*      this.addCla.type = this.type[1].name*/
    },
     // 添加--提交
    addBtn(){
      const that = this
      const data = {}
      if (that.addCla.massif_name === '') {
        this.$message.error('请输入果园名称')
        return false
      }
      if (that.addCla.far_farid === ''){
        this.$message.error('请输入负责人姓名')
        return false
      }
      if (that.addCla.address === ''){
        this.$message.error('请输入详细地址')
        return false
      }
      if (that.addCla.province === ''){
        this.$message.error('请选择省')
        return false
      }
      if (that.addCla.city === '') {
        this.$message.error('请选择市')
        return false
      }
      if (that.addCla.county === '') {
        this.$message.error('请选择区')
        return false
      }
      for(var i in that.city){
        if(Number(that.addCla.cityId) === Number(that.city[i].id)){
          data.city_name=that.city[i].value
        }
      }
      data.far_farid = that.addCla.far_farid
      data.address = that.addCla.address
      data.province = Number(that.addCla.provinceId)
      data.city =  Number(that.addCla.cityId)
      data.far_qh = that.addCla.countyId
      data.town =  Number(that.addCla.countyId)
      data.area = parseFloat(that.addCla.area).toFixed(2)
      data.massif_name = that.addCla.massif_name
      addBase(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo()
            that.$message.success('果园信息增加成功!')
            that.showAddClas = false
            if(this.farmerlist[0].far_name!=='全部'){
              const gos = { far_id: 0, far_name: '全部' }
              this.farmerlist.unshift(gos)
            }
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
    // 添加--提交
    addeditBtn(formName) {
      const that = this
      const data = {}
      if (that.addCla.massif_name === '') {
        this.$message.error('请输果园名称')
        return false
      }
      if (that.addCla.far_farid === '') {
        this.$message.error('请输入负责人姓名')
        return false
      }
      if (that.addCla.address === '') {
        this.$message.error('请输入详细地址')
        return false
      }
      if (that.addCla.province === '') {
        this.$message.error('请选择省')
        return false
      }
      if (that.addCla.city === '') {
        this.$message.error('请选择市')
        return false
      }
      if (that.addCla.county === '') {
        this.$message.error('请选择区')
        return false
      }
      for(var i in that.city){
        if(Number(that.addCla.cityId) ===  Number(that.city[i].id)){
          data.city_name=that.city[i].value
        }
      }
      data.far_farid = that.addCla.far_farid
      data.address = that.addCla.address
      data.province = Number(that.addCla.provinceId)
      data.city =  Number(that.addCla.cityId)
      data.far_qh = that.addCla.countyId
      data.town =  Number(that.addCla.countyId)
      data.area = parseFloat(that.addCla.area).toFixed(2)
      data.massif_name = that.addCla.massif_name
      data.massif_id = that.addCla.massif_id
      editBase(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.$message.success('编辑成功!')
            that.showAddClas = false
            that.$refs[formName].resetFields()
            if(this.farmerlist[0].far_name!=='全部'){
              const gos = { far_id: 0, far_name: '全部' }
              this.farmerlist.unshift(gos)
            }
            // that.addCla.name = ''
            // that.addCla.tel = ''
            that.getPageInfo()
            
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
     
    // 重置密码
    editPwd(row) {
      const data = {}
      data.id = row.far_id
      this.$confirm('确定重置该账号密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetFmpwd(data).then(response => {
          if (errorStatus(response.data)) {
            this.showNPwd = true
          }
        })
      })
    },

    //管理
    manageRow(row){
      this.product = true
      this.base_id=row.far_id
      this.far_id=row.farmer_id
      this.envir = false
      // this.pro_id=row.pro_id
      // this.pro_num=row.pro_number
    },
    //环境数据
    enviroData(row){
      var provName,cityName,blockName

      for(var j in this.province){
        if(row.far_province === Number(this.province[j].id) ){
          provName=this.province[j].value           
        }
      }
      for(var j in this.city){
        if(row.far_city === Number(this.city[j].id) ){
           cityName=this.city[j].value           
        }
      }        
      for(var j in this.block){
        if(row.far_town === Number(this.block[j].id) ){
           blockName=this.block[j].value           
        }
      }
      this.envir =true
      this.area = false
      this.product = false
      this.basegetId=row.far_id
      this.far_serial=row.far_serial
      this.far_name=row.far_farname
      this.basename=row.far_name
      this.base_address=provName+cityName+blockName+row.far_address

    },
    //编辑绑定设备
    editbindDev(){
      this.showBingClas=true
     
      // this.addBind.com_id=scope.com_id
      // this.addBind.com_name=scope.com_name
      // this.addBind.com_number=scope.com_number
      // this.addBind.com_type=scope.com_type
    },
    //获取编辑绑定信息
    getEditDev(id){
      const data={}
      data.com_id=id
      const info =[]
       getBindInfo(data)
          .then(response => {
           const dataRep=response.data
            if (errorStatus(dataRep)) {
              this.editNodeList=dataRep.data
              for(var i in this.editNodeList){
                if(this.editNodeList[i].nod_explain !== '' || this.editNodeList[i].nod_explain){
                  this.editNodeList[i].nod_explain=eval(dataRep.data[i].nod_explain)
                }else{
                  this.editNodeList[i].nod_explain=''
                } 
                this.editNodeList[i].nod_node=dataRep.data[i].nod_node
                this.editNodeList[i].nod_id=dataRep.data[i].nod_id
                for(let m in this.editNodeList[i].nod_explain){
                  if(this.editNodeList[i].nod_explain[m].show  === 2){
                    info.push(this.editNodeList[i].nod_explain[m].key)
                    this.info_chose=info
                  }
                }
              }
              console.log(this.editNodeList)
            
            }
          })
          .catch(Error => {
            // console.log("停用的分类err", err);
            this.$message.error('请求失败!')
          })
    },
    choseEquire(num,choose){
      for(var j in this.editNodeList[num].nod_explain){
        if(!this.editDev){
           this.editNodeList[num].nod_explain[j].show=1
        }
          for( var k in choose){
            if(this.editNodeList[num].nod_explain[j].key===choose[k]){
              this.editNodeList[num].nod_explain[j].show=2
            }
          }
      }
    },
    //提交绑定
    addBindBtn(){
      const data={}  
      data.node=this.editNodeList
      subBind(data)
        .then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data)
            this.showBingClas=false
            this.getPageInfo()
            this.info_chose=[]
            this.getEditDev()
            
          }
        })
        .catch(Error => {
          // console.log("停用的分类err", err);
          this.$message.error('请求失败!')
        })
    },
      

     // 删除-这个
    delBtn(row) {
      const data = {}
      // console.log('删除--', row)
      data.massif_id = [row.far_id]
      this.$confirm('请确认,是否删除该果园?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBase(data)
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
      if (this.checkModel.length < 1) {
        this.$message.error('请选择要删除果园!')
      } else {
        const data = {}
        data.massif_id = this.checkModel
        this.$confirm('请确认,是否删除所选中的果园?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBase(data)
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
      data.massif_id = [row.far_id]
      if (num === 1) {
        // 启用
        startBase(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.far_state = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 停用
        stopBase(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.far_state = num
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
      const chosed = this.checkModel
      // console.log('选择的数据--', chosed)

      if (chosed.length < 1) {
        this.$message.error('请选择要启用的果园!')
      } else {
        const far_id = []
        const data = {}
        for (const i in chosed) {
          for(const j in list){
             if (list[j].far_state === 2 && chosed[i]===list[j].far_id) {
              far_id.push(list[j].far_id)
            }
          }
        }
        // console.log('选择的数据-id-', id)
        if (far_id.length > 0) {
          data.massif_id = far_id
          this.$confirm('请确认,是否启用选中的果园?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              startBase(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in far_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (far_id[i] === list[j].far_id) {
                          list[j].far_state = 1
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.getPageInfo()
                    this.checkModel=[]
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的果园err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中果园的状态全部为'启用'", '提示', {
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
      const chosed =this.checkModel
      if (chosed.length < 1) {
        this.$message.error('请选择要停用的果园!')
      } else {
        const far_id = []
        const data = {}
        for (const i in chosed) {
          for(const j in list){
             if (list[j].far_state === 1 && chosed[i]===list[j].far_id) {
              far_id.push(list[j].far_id)
            }
          }
        }
        // console.log('选择的数据-id-', id)
        if (far_id.length > 0) {
          data.massif_id = far_id
          this.$confirm('请确认,是否停用选中果园?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              stopBase(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in far_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (far_id[i] === list[j].far_id) {
                          list[j].far_state = 2
                        }
                      }
                    }
                    this.list = list
                    this.getPageInfo()
                    this.checkModel=[]
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
          this.$confirm("选中果园状态已全部为'停用'?", '提示', {
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
    cancleDia(formName) {
      const addForm = this.addForm
      this.dialog.show = false
      addForm.adm_name = ''
      addForm.adm_acc = ''
      addForm.adm_mobile = ''
      addForm.adm_pre = ''
      addForm.adm_stase = ''
      addForm.adm_pas = ''
    },
    showListPages() {
      this.product = false
      this.envir=false
      // this.getPageInfo()
      // this.getCityData()
      // this.getFarmerlist()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formList.far_farid = this.farmerlist[0].far_id
    },
    serNumb() {
      console.log(this.addCla.area)
      if(this.addCla.area < 0){
        this.$message.error('不能以输入小于0的数字')
        this.addCla.area = ''
        return;
      }
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
    .el-checkbox-group{
      width:520px;
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
}
</style>
<style>
.add-gods-title{
  color:#c0c4cc;
  font-size:12px
}
</style>