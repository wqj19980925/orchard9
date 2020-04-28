<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">渠道列表</div>
        <div class="sd-module-btn">
          <el-button v-if="btnShow.addBtn" class="btn-mainCol"@click="addGoodsBtn()">新增</el-button>
          <el-button v-if="btnShow.startBtn" class="openCol-btn"@click="enableClas()">启用</el-button>
          <el-button v-if="btnShow.stopBtn" class="stopCol-btn"@click="stopClas()">停用</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delChoseBtn()">删除</el-button>
        </div>
      </div>
      <el-form ref="formList":model="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
        <el-row class="clearfix">
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="渠道名称"class="sd-form-item"prop="dit_name">
              <el-input v-model="formList.dit_name"placeholder="请输入渠道名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="联系人姓名"class="sd-form-item"prop="dit_person">
              <el-input v-model="formList.dit_person"placeholder="请输入联系人姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="5"class="sd-col-6">
            <el-form-item label="联系电话"class="sd-form-item"prop="dit_tel">
              <el-input v-model="formList.dit_tel"placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="4"class="sd-col-6">
            <el-form-item label="状态"class="sd-form-item"prop="dit_state">
              <el-select v-model="formList.dit_state"class >
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
        <el-table :data="list"width="100%"@selection-change="handleSelectionChange">
          <el-table-column type="selection"width="55"/>
          <el-table-column label="渠道名称"prop="dit_name"min-width align="center"/>
          <el-table-column label="联系人姓名"prop="dit_person"min-width align="center"/>
          <el-table-column label="联系电话"prop="dit_tel"align="center"/>
          <el-table-column label="地址"prop="dit_address"align="center"/>
          <el-table-column label="创建时间"prop="dit_createtime"align="center"/>
          <el-table-column label="渠道标签名称"prop="dla_name"align="center"/>
          <el-table-column label="状态"align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.dit_state == 1">启用</div>
              <div v-else>停用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"align="center"width="320">
            <template slot-scope="scope">
              <div class="opr-btn-box">
                <el-button v-if="btnShow.editBtn" size="mini"class="btn-mainCol"@click="editRow(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.dit_state==2 && btnShow.startBtn"size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)"> 启用
                </el-button>
                <el-button v-if="scope.row.dit_state==1 && btnShow.stopBtn"size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)"> 停用
                </el-button>
                <el-button v-if="btnShow.delBtn" size="mini"class="btn-delete"@click="delBtn(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="list.length>0"class="lk-page-box">
        <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
      <!-- 新增 -->
     <el-dialog :visible.sync="showAddClas":title="dialogTit":close-on-click-modal="false" min-width="600px" 
     @close="addClaForm('addCla')">
       <el-form  ref="addCla":model="addCla":rules="rulesCla"prop="rep_name" label-width="100px">
          <el-form-item label="渠道标签:" class="sd-form-item" prop="dit_dlaid" >
              <el-select v-model="addCla.dit_dlaid"  class="addClaStyle"   >
                <el-option v-for="item in taglist":key="item.dla_id":label="item.dla_name":value="item.dla_id"/>
              </el-select>
          </el-form-item>
          <el-form-item label="渠道名称:"class="sd-form-item"prop="dit_name" >
              <el-input v-model="addCla.dit_name"placeholder="请输入渠道名称"  class="addClaStyle"/>
          </el-form-item>
          <el-form-item label="联系人姓名:"class="sd-form-item"prop="dit_person" >
              <el-input v-model="addCla.dit_person"placeholder="请输入联系人姓名"  class="addClaStyle"/>
          </el-form-item>
          <el-form-item label="联系电话:"class="sd-form-item"prop="dit_tel" >
              <el-input v-model="addCla.dit_tel"placeholder="请输入联系电话" class="addClaStyle"/>
          </el-form-item>
          <el-form-item label="公司地址:"class="sd-form-item inventory">
            <el-select v-model="addCla.dit_province"value-key="id"clearable filterable placeholder="省"@change="choseProvince" class="adressStyle">
              <el-option v-for="item in province":key="item.id":label="item.value":value="item.value"/>
            </el-select>
            <el-select v-model="addCla.dit_city" class="adressStyle"clearable filterable placeholder="市"@change="choseCity">
              <el-option v-for="item in cityList":key="item.id":label="item.value":value="item.value"/>
            </el-select>
            <el-select v-model="addCla.dit_town"clearable filterable  class="adressStyle"placeholder="县/区"@change="choseBlock">
              <el-option v-for="item in countyList":key="item.id":label="item.value":value="item.value"/>
            </el-select>
          </el-form-item>
<!--             <el-form-item label prop="city"label-width="0px" class="sd-form-item inventory"/>
            <el-form-item label label-width="0px"prop="county"class="sd-form-item inventory"/> -->
          <el-form-item label="详细地址" prop="dit_address"class="sd-form-item inventory" >
            <el-input v-model="addCla.dit_address"placeholder="请输入详细地址" class="addClaStyle"/>
          </el-form-item>
       </el-form>
       <span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button v-if="edit"type="primary"@click="addeditBtn('addCla')">确 定</el-button>
          <el-button v-else type="primary"@click="addBtn('addCla')">确 定</el-button>
       </span>
     </el-dialog>
    </el-row>
  </div>
</template>
<script>
import {ditchList, ditchStart, ditchStop, addDitch, editDitch, delDitch, searchDitchTag } from '@/api/channelManage'
import { errorStatus } from '@/utils/index'
import { phoneTest, valiPassword } from '@/utils/validate'
import axios from 'axios'

export default {
  name: 'Account',
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'))
      }
      if (!phoneTest(value)) {
        return callback(new Error('请确认手机号的正确性'))
      } else {
        callback()
      }
    }
      
    const validatePassword = (rule, value, callback) => {
      if (!valiPassword(value)) {
        callback(new Error('密码长度6~15'))
      } else {
        callback()
      }
    }
    return {
      chosed: [],
      formList: {
        dit_dlaid: '',
        dit_name: '',
        dit_person: '',
        dit_tel: '',
        dit_state: '',
      },
      mapJson: '../../../static/map/map.json',
      sheng: '',
      shi: '',
      qu: '',
      city: '',
      block: '',
      cityList: [],
      countyList: [],
      warnBd:{
        city:false
      },
      edit: false,
      rules: {
        dit_dlaid: [],
        dit_name:[],
        dit_person: [],
        dit_tel:  [],
        dit_state:  [],
      },
      rolesType: null,
      state: [
        { id: 0, name: '全部' },
        { id: 1, name: '启用' },
        { id: 2, name: '停用' }
      ],
      state1: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
      list: [],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      showAddClas: false,
      addCla: {
        dit_dlaid: null,
        dit_name:null,
        dit_person:null,
        dit_tel:null,
        dit_province:null,
        dit_town:null,
        dit_address:null,
        dit_address:null,
      },
      rulesCla: {
       
        dit_name: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' }
        ],
        dit_person: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        dit_tel: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' },
          {validator: checkPhone, trigger: 'change'}
        ],
        dit_address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
      },
      showRecord:false,
      taglist:[],
      dialogTit: '新增',
      dialog: {
        title: '新增',
        show: false,
        addLoading: false,
        editshow: false,
        edit_id: 0
      },
      serch_req: false,
      showNPwd: false,
      btnShow:{}
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },
  created() {
    // console.log("--2323------------")
    // 页面加载时
    this.getPageInfo();
    this.getCityData()
    this.formList.dit_state = this.state[0].name
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
      ditchList(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            // const role_id = { rol_id: 0, rol_name: "全部" };
            // this.godsType.splice(0, 0, role_id);
            this.list = dataRep.data_info.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            const btnList = dataRep.data_info.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {

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
      this.addCla.dit_city = ''
      this.addCla.dit_town = ''
      this.addCla.dit_address = ''

      for (var index2 in this.province) {
        if (e === this.province[index2].value) {
          this.cityList = this.province[index2].children
          this.shi = this.province[index2].children[0].value
          this.countyList = this.province[index2].children[0].children
          this.qu = this.province[index2].children[0].children[0].value
          this.E = this.countyList[0].value
        }
      }
      // for(var i in this.province){
      //   if(this.province[i].value === e){
      //     this.addCla.dit_province=this.province[i].value
      //   }
      // }    
    },
    // 选市
    choseCity: function(e) {  
      this.warnBd.city=false;
      if(e ===''){
        this.warnBd.city=true;
      }
      this.countyList = []
      // this.addCla.city='';
      this.addCla.dit_address = ''
      this.addCla.dit_town = ''
      for (var index3 in this.city) {
        if (e === this.city[index3].value) {
          this.countyList = this.city[index3].children
          this.qu = this.city[index3].children[0].value
          this.E = this.countyList[0].value
        }
      }
      //  for(var i in this.cityList){
      //   if(e === this.cityList[i].value){
      //     this.addCla.cityId=this.cityList[i].id
      //   }
      // }    
    },
    // 选区
    choseBlock: function(e) {
      this.E = e
      this.addCla.dit_address = '';
      if(e ===''){
        this.warnBd.county=true;
      }
      // for(var i in this.countyList){
      //   if(this.countyList[i].value === e){
      //     this.addCla.countyId =this.countyList[i].id
      //   }
      // }        
    },
    closeWork(formName) {
      this.showRecord = false
    },
    searchTag(){
      const data = {};
      data.type = 1 
      searchDitchTag(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.taglist = dataRep.info
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        }) 
    },
    blurValue(e, index) {
      const val = e.target.value
          // console.log('this.godsDetail[index].type', this.godsDetail[index].type)
        if (!phoneTest(val)) {
          this.$message.error('请输入正确的手机号!')
          return false
        }
    },
    // 搜索
    searchList(formName, page) {
      const search =this.formList
      if (search.dit_state === '全部' || search.dit_state === 0) {
        search.dit_state = ''
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.pri_id = this.$route.meta.pri_id
      // console.log('search--', search)
      search.page = page
      ditchList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('----', dataRep)
          if (errorStatus(dataRep)) {
            // const rol = { rol_id: 0, rol_name: '全部' }
            // const role = dataRep.data_info.role
            // role.unshift(rol)
            // this.godsType = role
            this.list = dataRep.data_info.data
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
      this.dialogTit = '编辑渠道'
      this.edit = true
      this.searchTag()
      this.$nextTick(() => {
        this.addCla.dit_id=scope.dit_id
        this.addCla.dit_dlaid=scope.dla_id
        this.addCla.dit_name=scope.dit_name
        this.addCla.dit_person=scope.dit_person
        this.addCla.dit_tel=scope.dit_tel
        this.addCla.dit_address=scope.dit_address
        this.addCla.dit_city = scope.dit_city
        this.addCla.dit_province = scope.dit_province
        this.addCla.dit_town = scope.dit_town
      })
    },
    addClaForm(formName) {
      this.showAddClas = false
      this.addCla.dit_city=''
      this.addCla.dit_town=''
      this.addCla.dit_province=''
      if(this.edit){
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
        })
      }else{
        this.$refs[formName].resetFields()
      }
      
    },
       // 添加-弹窗
    addGoodsBtn() { // 点击我的云仓添加按钮后的操作
      this.dialogTit ='新增渠道'
      this.searchTag()
      this.showAddClas = true
      this.edit = false
      // this.$refs[addCla].resetFields()
/*      this.addCla.type = this.type[1].name*/
    },
     // 添加--提交
    addBtn(formName) {
      const that = this
      const data = that.addCla 
      if (this.addCla.dit_dlaid === null) {
        this.$message.error('请选择渠道标签')
        return false
      }
      if (that.addCla.dit_name === null) {
        this.$message.error('请输入渠道名称')
        return false
      }
      if (that.addCla.dit_person === null) {
        this.$message.error('请输入联系人姓名')
        return false
      }
      if (that.addCla.dit_tel === null) {
        this.$message.error('请输入联系电话')
        return false
      }
      if (that.addCla.dit_address === null) {
        this.$message.error('请输入公司地址')
        return false
      }
      if (!phoneTest(that.addCla.dit_tel)) {
        this.$message.error('请输入正确的联系电话!')
        return false
      }
      addDitch(data)
        .then(res => {
          if (errorStatus(res.data)) {
            that.getPageInfo()
            this.$message.success('渠道信息增加成功!')
            this.showAddClas = false
            this.addCla.dit_city=''
            this.addCla.dit_town=''
            this.addCla.dit_province=''
            this.$nextTick(() => {
              this.$refs[formName].resetFields()
            })
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
      const data = that.addCla 
      if (this.addCla.dit_dlaid === null) {
        this.$message.error('请选择渠道标签')
        return false
      }
      if (that.addCla.dit_name === null) {
        this.$message.error('请输入渠道名称')
        return false
      }
      if (that.addCla.dit_person === null) {
        this.$message.error('请输入联系人姓名')
        return false
      }
      if (that.addCla.dit_tel === null) {
        this.$message.error('请输入联系电话')
        return false
      }
      if (!phoneTest(that.addCla.dit_tel)) {
        this.$message.error('请输入正确的联系电话!')
        return false
      }
      if (that.addCla.dit_address === null) {
        this.$message.error('请输入公司地址')
        return false
      }
      editDitch(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.$message.success('编辑渠道信息成功!')
            this.showAddClas = false
            this.$nextTick(() => {
              this.$refs[formName].resetFields()
            })
            this.addCla.dit_city=''
            this.addCla.dit_town=''
            this.addCla.dit_province=''
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
      data.id = row.dit_id
      this.$confirm('确定重置该渠道密码?', '提示', {
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
    // 单个--启用--停用
    enableThisClas(row, num) {
      const data = {}
      data.dit_id = [row.dit_id]
      if (num === 1) {
        // 启用
        ditchStart(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('启用成功!')
              row.dit_state = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        // 停用
        ditchStop(data)
          .then(response => {
            // console.log("stopeClas---", response);
            if (errorStatus(response.data)) {
              this.$message.success('停用成功!')
              row.dit_state = num
            }
          })
          .catch(Error => {
            // console.log("停用的渠道err", err);
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
        this.$message.error('请选择要启用的渠道信息!')
      } else {
        const dit_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].dit_state === 2) {
            dit_id.push(chosed[i].dit_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (dit_id.length > 0) {
          data.dit_id = dit_id
          this.$confirm('请确认,是否启用选中的渠道信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              ditchStart(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in dit_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (dit_id[i] === list[j].dit_id) {
                          list[j].dit_state = 1
                        }
                      }
                    }
                    // console.log(list)
                    this.list = list
                    this.$message.success('启用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的渠道信息err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中渠道信息的状态全部为'启用'", '提示', {
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
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的渠道信息!')
      } else {
        const data = {}
        data.dit_id = []
        // console.log('chosed---', chosed)
        for (const i in chosed) {
          data.dit_id.push(chosed[i].dit_id)
        }
        this.$confirm('请确认,是否删除所选中的渠道信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDitch(data)
            .then(response => {
              if (errorStatus(response.data)) {
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
    delBtn(row) {
      const data = {}
      // console.log('删除--', row)
      data.dit_id = [row.dit_id]
      this.$confirm('请确认,是否删除该渠道信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDitch(data)
          .then(response => {
            // console.log('delAgriClass---', response)
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
    // 停用
    stopClas() {
      const list = this.list
      const chosed = this.chosed
      if (chosed.length < 1) {
        this.$message.error('请选择要停用的渠道信息!')
      } else {
        const dit_id = []
        const data = {}
        for (const i in chosed) {
          if (chosed[i].dit_state === 1) {
            dit_id.push(chosed[i].dit_id)
          }
        }
        // console.log('选择的数据-id-', id)
        if (dit_id.length > 0) {
          data.dit_id = dit_id
          this.$confirm('请确认,是否停用选中渠道信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              ditchStop(data)
                .then(response => {
                  // console.log('addClass---', response)
                  if (errorStatus(response.data)) {
                    for (const i in dit_id) {
                      for (var j = 0; j < list.length; j++) {
                        if (dit_id[i] === list[j].dit_id) {
                          list[j].dit_state = 2
                        }
                      }
                    }
                    this.list = list
                    this.$message.success('停用成功!')
                  }
                })
                .catch(err => {
                  console.log('启用的渠道信息err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        } else {
          this.$confirm("选中渠道状态已全部为'停用'?", '提示', {
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
.addClaStyle{
  width:350px
}
.adressStyle{
  min-width:100px
}
</style>