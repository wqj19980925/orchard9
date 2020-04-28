<template>
  <div class="app-container">
    <el-row class="sd-module-box" >
      <div class="switchThisTab">
        <el-tabs  class="allTab" v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="出库记录" name='outWare' >
            <el-form ref="formOutlist"class="sd-form-box clearfix"size="medium"label-width="100px">
              <el-row class="clearfix">
                <el-col :span="10" class="sd-col-6">
                  <el-form-item label="操作时间:"class="sd-form-item"prop='con_createtime_range0'>
                    <el-date-picker v-model="formOutlist.rec_time_start"type="datetime"placeholder="选择开始日期"value-format="yyyy-MM-dd HH:mm:ss"style='width:225px;':picker-options='pickerDateBefore' clearable>
                    </el-date-picker>
                     至
                     <el-date-picker v-model="formOutlist.rec_time_stop" type="datetime" style="width:225px" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter'/>
                  </el-form-item>
                </el-col> 
                <el-col :span="6" class="sd-col-6">
                  <el-form-item label="系统单号:" class="sd-form-item" prop="del_order">
                    <el-input v-model="formOutlist.del_order" placeholder="请输入系统单号" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="操作人:" class="sd-form-item" prop="adm_name">
                    <el-input v-model="formOutlist.adm_name" placeholder="请输入操作人" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="发货信息:" class="sd-form-item" prop="rep_name">
                    <el-input v-model="formOutlist.rep_name" placeholder="请输入发货信息" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="备注:" class="sd-form-item" prop="del_remarks">
                    <el-input v-model="formOutlist.del_remarks" placeholder="请输入备注" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="状态：" class="sd-form-item" prop="info_state">
                    <el-select v-model="formInlist.del_state" class>
                      <el-option v-for="item in outState":key="item.id":label="item.name":value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="pl-50 fr w250"  >
                  <el-button class type="primary" @click="searchList('formOutlist',1)">搜&nbsp;&nbsp;索</el-button>
                  <el-button class @click="resetForm('formOutlist')">重&nbsp;&nbsp;置</el-button>
                </el-col>
              </el-row>
            </el-form>
            <div class="lk-table-box">
              <el-table :data="wareOutList"width="100%"@selection-change="handleSelectionChange" >
                <el-table-column type="selection"width="55"/>
                <el-table-column label="操作时间"min-width prop="del_time" align="center" width="160"/>
                <el-table-column label="系统单号"min-width prop="del_order" align="center">
                  <template slot-scope="scope">
                    <div class="blue" @click="showWareDe(scope.row)">{{scope.row.del_order}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="数量"min-width prop="del_count" align="center" />
                <el-table-column label="发货方"min-width prop="rep_name" align="center"/>
                <el-table-column label="操作人"min-width prop="adm_name" align="center" width="120"/>
                <el-table-column label="状态" align="center" width="150">
                  <template slot-scope="scope">
                    <div v-if="scope.row.del_state == 2">已出库</div>
                    <div v-else>非正常出库</div>
                  </template>
                </el-table-column>
                <el-table-column label="备注"align="center" :show-overflow-tooltip="true"width="150" >
                  <template slot-scope="scope" >
                    <span v-if="scope.row.del_remarks">{{scope.row.del_remarks}}</span>
                    <span v-else>无</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="操作"min-width align="center"width="55">
                  <template slot-scope="scope" >
                    <span class="blue" @click="showAbnormal(scope.row)">
                      查看
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <div v-show="wareInList.length>0"class="lk-page-box" style="padding-top: 10px;">
                <el-pagination :current-page="currentWaPage":page-size="pageWaSize":total="totalWaNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="入库记录" name='inWare'  >
            <el-form ref="formInlist"class="sd-form-box clearfix"size="medium"label-width="100px">
              <el-row class="clearfix">
                <el-col :span="10" class="sd-col-6">
                  <el-form-item label="操作时间:"class="sd-form-item"prop='con_createtime_range0'>
                    <el-date-picker v-model="formInlist.rec_time_start"type="datetime"placeholder="选择开始日期"value-format="yyyy-MM-dd HH:mm:ss"style='width:225px;':picker-options='pickerDateBefore2' clearable>
                    </el-date-picker>
                     至
                     <el-date-picker v-model="formInlist.rec_time_stop" type="datetime" style="width:230px" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter2'/>
                  </el-form-item>
                </el-col>          
                <el-col :span="6" class="sd-col-6">
                  <el-form-item label="系统单号:" class="sd-form-item" prop="rec_order">
                    <el-input v-model="formInlist.rec_order" placeholder="请输入系统单号" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="操作人:" class="sd-form-item" prop="adm_name">
                    <el-input v-model="formInlist.adm_name" placeholder="请输入操作人" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="收货信息:" class="sd-form-item" prop="rep_name">
                    <el-input v-model="formInlist.rep_name" placeholder="请输入收货信息" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="备注:" class="sd-form-item" prop="rec_remarks">
                    <el-input v-model="formInlist.rec_remarks" placeholder="请输入备注" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="状态：" class="sd-form-item" prop="info_state">
                    <el-select v-model="formInlist.rec_state" class>
                      <el-option v-for="item in inState":key="item.id":label="item.name":value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="pl-50 fr w250"  >
                  <el-button class type="primary" @click="searchWaList('formInlist',1)">搜&nbsp;&nbsp;索</el-button>
                  <el-button class @click="resetForm('formInlist')">重&nbsp;&nbsp;置</el-button>
                </el-col>
              </el-row>
            </el-form>
            <div class="lk-table-box">
              <el-table :data="wareInList"width="100%"@selection-change="handleSelectionChange" >
                <el-table-column type="selection"width="55"/>
                <el-table-column label="操作时间"min-width prop="rec_time" align="center" width="160"/>
                <el-table-column label="系统单号"min-width prop="rec_order" align="center">
                  <template slot-scope="scope">
                    <div class="blue" @click="showWareDe(scope.row)">{{scope.row.rec_order}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="数量"min-width prop="rec_count" align="center" />
                <el-table-column label="收货方"min-width prop="rep_name" align="center"/>
                <el-table-column label="状态" align="center" width="150">
                  <template slot-scope="scope">
                    <div v-if="scope.row.rec_state == 2">已入库</div>
                    <div v-else>非正常入库</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作人"min-width prop="adm_name" align="center" width="80"/>
                
                <el-table-column label="备注"align="center" :show-overflow-tooltip="true"width="100" >
                  <template slot-scope="scope" >
                    <span v-if="scope.row.rec_state">{{scope.row.rec_state}}</span>
                    <span v-else>无</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="操作"min-width align="center"width="120">
                  <template slot-scope="scope" >
                    <span class="blue" @click="showAbnormal(scope.row)">
                      查看
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <div v-show="wareInList.length>0"class="lk-page-box" style="padding-top: 10px;">
                <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentWaChange"/>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
     
      <!-- 出库详情弹窗 -->
      <el-dialog :visible.sync="addWaShow":title="dialogTit":close-on-click-modal="false"width="650px"@close="addClaForm('addTrans')">
        <el-form ref="addOutWare"  :inline="true"    label-width="100px" >
          <el-row class="clearfix" >
            <el-col :span="24"class="sd-col-6">
              <el-form-item label="系统编号:" >
                <span v-if="activeName==='inWare'">{{addOutWare.rec_order}}</span>
                <span v-else>{{addOutWare.del_order}}</span>
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="数量：" >
                <span v-if="activeName==='inWare'">{{addOutWare.rec_count}}</span>
                <span v-else>{{addOutWare.del_count}}</span>
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="状态：" >
                <span v-if="activeName==='inWare'">
                  <span class="red"v-if="addOutWare.rec_state == 1">已入库</span>
                  <span class="red"v-else>非正常入库</span>
                </span>
                <span v-else>
                  <span class="red"v-if="addOutWare.del_state == 1">已出库</span>
                  <span class="red"v-else>非正常出库</span>
                </span> 
              </el-form-item> 
            </el-col>
            <el-col :span="24"class="sd-col-6">
              <div class="Divisionline"/>
            </el-col>
            <div v-if="activeName==='inWare'">

              <el-col :span="24"class="sd-col-6">
                <el-form-item label="收货渠道：" >
                  {{addOutWare.rep_name}}
                </el-form-item> 
              </el-col>
              <!-- <el-col :span="12"class="sd-col-6">
                <el-form-item label="联系人：" >
                  {{addOutWare.del_receiving.cli_name}}
                </el-form-item> 
              </el-col>
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="联系电话："class="sd-form-item" > 
                 {{addOutWare.del_receiving.cli_mobile}}
                </el-form-item>
              </el-col>
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="地址："class="sd-form-item" > 
                  {{addOutWare.del_receiving.cli_address}}
                </el-form-item>
              </el-col> -->
              <el-col :span="24"class="sd-col-6">
                <div class="Divisionline"/>
              </el-col>
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="备注："class="sd-form-item" > 
                  <span v-if="addOutWare.del_remarks">{{addOutWare.del_remarks}}</span>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </div>
            <div v-if="activeName==='outWare'">
              <!-- <el-col :span="24"class="sd-col-6">
                <el-form-item label="发货渠道：" >
                  {{addOutWare.rep_name}}
                </el-form-item> 
              </el-col> -->
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="仓库名称" >
                  {{addOutWare.rep_name}} 
                </el-form-item>
              </el-col>
              <!--<el-col :span="12"class="sd-col-6">
                <el-form-item label="联系人："class="sd-form-item" > 
                  {{del_receiving.cli_name}}
                </el-form-item>
              </el-col>
              <el-col :span="12"class="sd-col-6">
                <el-form-item label="联系电话："class="sd-form-item" > 
                  {{del_receiving.cli_mobile}}
                </el-form-item>
              </el-col>
              <el-col :span="12"class="sd-col-6">
                <el-form-item label="地址："class="sd-form-item" > 
                  {{del_receiving.cli_mobile}}
                </el-form-item>
              </el-col>-->
              <el-col :span="24"class="sd-col-6">
                <div class="Divisionline"/>
              </el-col>
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="备注："class="sd-form-item" > 
                  <span v-if="addOutWare.del_remarks">{{addOutWare.del_remarks}}</span>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </div>
            <el-col :span="24"class="sd-col-6">
              <div class="Divisionline"/>
            </el-col>
           <!--  <div v-for="">
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="运输方式："class="sd-form-item" > 
                  {{addOutWare.sto_name}}
                </el-form-item>
              </el-col>
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="快递单位："class="sd-form-item" > 
                  {{addOutWare.sto_name}}
                </el-form-item>
              </el-col>
              <el-col :span="12"class="sd-col-6">
                <el-form-item label="负责人："class="sd-form-item" > 
                  {{addOutWare.sto_name}}
                </el-form-item>
              </el-col>
              <el-col :span="12"class="sd-col-6">
                <el-form-item label="联系电话："class="sd-form-item" > 
                  {{addOutWare.sto_name}}
                </el-form-item>
              </el-col>
              <el-col :span="12"class="sd-col-6">
                <el-form-item label="车牌号："class="sd-form-item" > 
                  {{addOutWare.sto_name}}
                </el-form-item>
              </el-col>
            </div> -->
            <el-table :data="goodsList"width="60%"@selection-change="handleSelectionChange" >
              <el-table-column label="商品名称"min-width prop="goo_name" align="center" />
              <el-table-column label="出库数量"min-width  prop="det_real_actual" align="center" width="150"/>
            </el-table>
          </el-row>
        </el-form> 
      </el-dialog>
        <!-- 出库详情弹窗 -->
      <el-dialog :visible.sync="AbnoramalShow":title="dialogTit":close-on-click-modal="false"width="650px"@close="addClaForm('addTrans')">
        <el-form ref="abnoramal"  :inline="true"    label-width="120px" >
          <el-row class="clearfix" >
            <div v-if="activeName==='inWare'"> 
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="系统编号:" >
                  <span >{{abnoramal.rec_order}}</span>
                </el-form-item> 
              </el-col>
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="备注："class="sd-form-item" > 
                    <span v-if="abnoramal.del_remarks">{{abnoramal.del_remarks}}</span>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              <el-table :data="goodsList"width="60%"@selection-change="handleSelectionChange" >
                <el-table-column label="商品名称"min-width prop="goo_name" align="center" />
                <el-table-column label="要求入库数量"min-width  prop="det_real_quantity" align="center" width="150"/>
                <el-table-column label="实际入库数量"min-width  prop="det_real_actual" align="center" width="150"/>
              </el-table>
            </div>
            <div v-if="activeName==='outWare'"> 
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="系统编号:" >
                  <span >{{abnoramal.del_order}}</span>
                </el-form-item> 
              </el-col>
              <el-col :span="24"class="sd-col-6">
                <el-form-item label="备注："class="sd-form-item" > 
                    <span v-if="abnoramal.del_remarks">{{abnoramal.del_remarks}}</span>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              <el-table :data="goodsList"width="60%"@selection-change="handleSelectionChange" >
                <el-table-column label="商品名称"min-width prop="goo_name" align="center" />
                <el-table-column label="要求出库数量"min-width  prop="det_real_quantity" align="center" width="150"/>
                <el-table-column label="实际出库数量"min-width  prop="det_real_actual" align="center" width="150"/>
              </el-table>
            </div>
          </el-row>
        </el-form>
      </el-dialog>

    </el-row>
    <a :href="exportUrl" id='exportFile'style='display:none;'></a>

  </div>
</template>
<script>
import {inLogList,inAbnormal, outAbnormal,outLogList} from '@/api/wareHouse'
import { errorStatus ,parseTime } from '@/utils/index'
import TableBox from '@/components/tableBox'
import {personal} from '@/api/system'
export default {
  components: {TableBox },
  name: 'Account',
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 30) {
        return value.slice(0, 30) + "...";
      }
      return value;
    }
  },
  data() {
    return {
      AbnoramalShow:false,
      dialogTit:'',
      addWaShow:false,
      exportUrl:'',
      activeName:'outWare',
      inStock:false,//table左上角tab是不是入库
      abnoramal:{},
      formOutlist:{
        del_order:'',
        del_time_start:'',
        del_time_stop:'',
        rep_name:'',
        adm_name:'',
        del_remarks:'',
        del_state:'',
      },
      formInlist:{
        rec_order:'',
        rec_time_start:'',
        rec_time_stop:'',
        rep_name:'',
        adm_name:'',
        rec_remarks:'',
        rec_state:'',
      },
      addOutWare:{},
      del_receiving:{},
      addShow : false,
      addTrans:{},
      search:0,
      currentWaPage: 1,
      pageWaSize: null,
      totalWaNum: null,
      wareInList:[],
      wareOutList:[],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      page1:1,
      page2:1,
      outState:[
        { id: 0, name: '全部' },
        { id: 2, name: '已入库' },
        { id: 3, name: '非正常入库' },
      ],
      inState:[
        { id: 0, name: '全部' },
        { id: 2, name: '已出库' },
        { id: 3, name: '非正常出库' },
      ],
      goodsList:[],
      receiptList:[],
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.formOutlist.rec_time_start;
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
          let DateVal = this.formOutlist.rec_time_stop;
          if (DateVal) {
            return time.getTime() < DateVal||time.getTime() > _now;
          } else {
            return time.getTime() > _now;
          }
        }
      },
      pickerDateBefore2: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.formInlist.con_createtime_range0;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      },
      pickerDateAfter2: {
        disabledDate: time => {
          let _now = Date.now();
          let DateVal = this.formInlist.con_createtime_range1;
          if (DateVal) {
            return time.getTime() < DateVal||time.getTime() > _now;
          } else {
            return time.getTime() > _now;
          }
        }
      }
      
    }
  },
  beforeCreate(){
// console.log("--111111111111------------")
  },
  created() {

    // console.log("--2323------------")
    // 页面加载时
    this.getPageInfo();
    
    // this.getInRecorde()
    // this.formInlist.rec_state=this.inState[0].name
    // this.formOutlist.del_state=this.outState[0].name
    // this.getCompany()
  },
  methods: {


    getPageInfo() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data1 = {};
      const data2 = {};
      if(this.search ===1){
        data1.page = this.page1
      }else if(this.search ===2){
        data2.page = this.page2
      }else if(this.search ===0){
        data1.page = this.page1
        data2.page = this.page2

      }
      inLogList(data1)
        .then(response => {
        	console.log('入库',response);
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.wareInList = dataRep.data_info.data_info
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
            this.search=0
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
      outLogList(data2)
        .then(response => {
        	console.log('出库',response);
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.wareOutList = dataRep.data_info.data_info
            this.currentWaPage = dataRep.data_info.current_page
            this.pageWaSize = dataRep.data_info.current_number
            this.totalWaNum = dataRep.data_info.total
            this.search=0
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    getOutRecorde(prlId){
      const data ={}
      data.prl_id=prlId
      getlossDetail(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.addProd = dataRep.data
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    //切换table
    handleClick(tab, event) {
       if(tab.name === 'inWare'){
         this.productThis =false
       }else if(tab.name === 'outWare'){
         this.productThis =true//如果为false会显示右上角导出按钮
       }
    },
 



    //运输报损弹框
    showDetail(row){
      this.dialogTit='查看'
      this.addShow =true
      
      for(var i in this.listTrans){
        if(row.orl_id === this.listTrans[i].orl_id){
          this.addTrans=this.listTrans[i]
        }
      }
      // console.log(this.addTrans)
    },
    //仓库报损弹框
    showWareDe(scope){
      this.dialogTit='查看'
      this.addWaShow=true
      this.addOutWare=scope
     
      if(this.activeName==='outWare'){
//      this.del_receiving=scope.del_receiving
        this.getWareInfo(scope.del_id,1)
      }else{
        this.getWareInfo(scope.rec_id,2)

      }
    },
    //获取仓库报损信息
    getWareInfo(Id,type){
      const data={}
     if(type===1){
      data.del_id=Id
      outAbnormal(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.goodsList = dataRep.data_info.goods
            this.abnoramal = dataRep.data_info.receipt
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
      }else{
        data.rec_id=Id
        inAbnormal(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.goodsList = dataRep.data_info.goods
            this.abnoramal = dataRep.data_info.receipt
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
      }
      
    },
    showAbnormal(row){
      this.AbnoramalShow=true
      if(this.activeName==='outWare'){
        this.dialogTit='查看出库单'
        this.getWareInfo(row.del_id,1,row.del_order)
      }else{
        this.dialogTit='查看入库单'

        this.getWareInfo(row.rec_id,2,row.rec_order)
      }
     
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },

    // 重置
    resetForm(formName) {
      for(let i in this.formOutlist){
        this.formOutlist[i] = ''
      }
      // if(this.$refs[formName]){
         this.$refs[formName].resetFields()
      // }
     
    },
    // 分页-操作列表
    handleCurrentChange(val) {
    	console.log(val);
      this.page2=val;
    this.getPageInfo()
    },
    handleCurrentWaChange(val) {
    	console.log(val);
    	this.page1=val;
    	this.getPageInfo()
    },
    searchWaList(formName, page){
      if(this.formInlist.rec_state==='全部'){
        this.formInlist.rec_state=''
      }
      this.search=2
      const search =this.formInlist
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.page = page
      inLogList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.wareInList = dataRep.data_info.data_info
            this.currentWaPage = dataRep.data_info.current_page
            this.pageWaSize = dataRep.data_info.current_number
            this.totalWaNum = dataRep.data_info.total
          }
        })
    },
    // 搜索-操作
    searchList(formName, page) {
      if(this.formOutlist.del_state==='全部'){
        this.formOutlist.del_state=''
      }
      const search =this.formOutlist
      this.search=1
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.page = page
      outLogList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.wareOutList = dataRep.data_info.data_info
            this.currentPage = dataRep.data_info.current_page
            this.pageSize = dataRep.data_info.current_number
            this.totalNum = dataRep.data_info.total
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
        })
    },
    searchTrList(formName, page) {
      this.search=1
      const search =this.tranpList
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.page = page
      outLogList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.listTrans = dataRep.data
            this.currentTrPage = dataRep.current_page
            this.pageTrSize = dataRep.current_number
            this.totalTrNum = dataRep.total
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
        })
    },
    //下载
    clickDowBtn(){
      setTimeout(() => {
        document.getElementById('exportFile').click();
      }, 1000)
    },
  
    //取消弹框
    addClaForm(formName) {
      this.addWaShow=false
      this.harvShow = false
      this.addShow = false
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })

    },

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

.Divisionline{
  width:100%;
  margin-bottom:20px;
  border-bottom: 1px solid #ddd;
  font-size:16px
}
.switchThisTab{
  position: relative;
}

.tabRightBut1{
  position: absolute;
  right:10px;
  top:1px;
}
.blue{
  cursor:pointer
}

.el-tooltip__popper[x-placement^=right] .popper__arrow{
      border-right-color: #1ab394;
}
.el-tooltip__popper[x-placement^=right] .popper__arrow:after {
  border-right-color: #1ab394;
}
.el-tooltip__popper{
  max-width: 400px;
  line-height: 180%;
}
</style>
 // border-style: solid;
 //    border: 1px solid #ff0000;


 