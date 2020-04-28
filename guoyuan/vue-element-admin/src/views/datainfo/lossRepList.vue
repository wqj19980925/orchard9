chan<template>
  <div class="app-container">
    <el-row class="sd-module-box" >
      <div class="switchThisTab">
        <el-tabs  class="allTab" v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="生产报损记录" name='productName' v-if="btnShow.produBtn">
            <el-form ref="prodList":rules="rulesCla"class="sd-form-box clearfix"size="medium"label-width="100px">
              <el-row class="clearfix">
                <el-col :span="6" class="sd-col-6">
                  <el-form-item label="生产编号:" class="sd-form-item" prop="pop_content">
                    <el-input v-model="prodList.pop_content" placeholder="请输入生产编号" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="品类:" class="sd-form-item" prop="cla_name">
                    <el-input v-model="prodList.cla_name" placeholder="请输入品类" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="名称:" class="sd-form-item" prop="goo_name">
                    <el-input v-model="prodList.goo_name" placeholder="请输入名称" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="sd-col-6">
                  <el-form-item label="用户名:" class="sd-form-item" prop="prl_admacc">
                    <el-input v-model="prodList.prl_admacc" placeholder="请输入用户名" clearable/>
                  </el-form-item>
                </el-col>
                <!--  <el-col :span="6" class="sd-col-6">
                  <el-form-item label="发码批次号:" class="sd-form-item" prop="pop_content">
                    <el-input v-model="prodList.pop_content" placeholder="请输入发码批次号" clearable/>
                  </el-form-item>
                </el-col> -->
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="员工姓名:" class="sd-form-item" prop="prl_admname">
                    <el-input v-model="prodList.prl_admname" placeholder="请输入员工姓名" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="备注:" class="sd-form-item" prop="prl_remark">
                    <el-input v-model="prodList.prl_remark" placeholder="请输入备注" clearable/>
                  </el-form-item>
                </el-col>
                <el-col class="pl-50 fr w250"  >
                  <el-button class type="primary" @click="searchList('prodList',1)">搜&nbsp;&nbsp;索</el-button>
                  <el-button class @click="resetForm('prodList')">重&nbsp;&nbsp;置</el-button>
                </el-col>
              </el-row>
            </el-form>
            <div class="lk-table-box">
              <el-table :data="listProdc"width="100%"@selection-change="handleSelectionChange" >
                <el-table-column type="selection"width="55"/>
                <el-table-column label="时间"min-width prop="prl_time" align="center" width="150"/>
                <el-table-column label="生产编号"min-width prop="pro_number" align="center"/>
                <el-table-column label="品类"min-width prop="cla_name" align="center" />
                <el-table-column label="名称"min-width prop="goo_name" align="center"/>
                <el-table-column label="损耗数量"min-width prop="prl_loss" align="center" width="120"/>
                <el-table-column label="用户名"min-width prop="prl_admacc" align="center" width="120"/>
                
                <el-table-column label="备注"align="center" prop="prl_remark"width="200" >
                  <template slot-scope="scope" >
                    <el-tooltip :content="scope.row.prl_remark" placement="top" popper-class="test" width="10">
                      <div align="left">
                         {{scope.row.prl_remark | ellipsis}}
                        <span class="blue" v-if="scope.row.prl_remark " @click="showProduDe(scope.row)">
                          查看详情
                        </span>
                      </div>
                     
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="员工姓名"min-width prop="prl_admname" align="center"width="120"/>
              </el-table>
              <div v-show="listProdc.length>0"class="lk-page-box">
                <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="仓库报损记录" name='WareName' v-if="btnShow.wareBtn" >
            <el-form ref="depotList":rules="rulesCla"class="sd-form-box clearfix"size="medium"label-width="100px">
              <el-row class="clearfix">
                 <el-col :span="6" class="sd-col-6">
                  <el-form-item label="操作人:" class="sd-form-item" prop="adm_name">
                    <el-input v-model="depotList.adm_name" placeholder="请输入操作人" clearable/>
                  </el-form-item>
                </el-col>  
                <el-col :span="10" class="sd-col-6">
                  <el-form-item label="操作时间:"class="sd-form-item"prop='con_createtime_range0'>
                    <el-date-picker v-model="depotList.con_createtime_range0"type="datetime"placeholder="选择开始日期"value-format="yyyy-MM-dd HH:mm:ss"style='width:225px;':picker-options='pickerDateBefore2' clearable>
                    </el-date-picker>
                     至
                     <el-date-picker v-model="depotList.con_createtime_range1" type="datetime" style="width:230px" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter2'/>
                  </el-form-item>
                </el-col>             
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="备注:" class="sd-form-item" prop="loss_remark">
                    <el-input v-model="depotList.loss_remark" placeholder="请输入备注" clearable/>
                  </el-form-item>
                </el-col>
                <el-col class="pl-50 fr w250"  >
                  <el-button class type="primary" @click="searchWaList('depotList',1)">搜&nbsp;&nbsp;索</el-button>
                  <el-button class @click="resetForm('depotList')">重&nbsp;&nbsp;置</el-button>
                </el-col>
              </el-row>
            </el-form>
            <div class="lk-table-box">
              <el-table :data="listWare"width="100%"@selection-change="handleSelectionChange" >
                <el-table-column type="selection"width="55"/>
                <el-table-column label="操作时间"min-width prop="loss_time" align="center" width="150"/>
                <el-table-column label="云仓名称"min-width align="center"prop="rep_name" />
                <el-table-column label="损毁数量"min-width prop="loss_num" align="center" width="350"/>
                <el-table-column label="详情"align="center"width="250">
                  <template slot-scope="scope">
                   <!--  <el-tooltip :content="'['+scope.row.sto_name+']'+scope.row.loss_num+''" placement="top" popper-class="test" width="10"> -->
                      <div align="left">
                         [{{scope.row.sto_name}}]{{scope.row.loss_num}} 
                        <span class="blue" v-if="scope.row.sto_name " @click="showWareDe(scope.row)">
                          查看详情
                        </span>
                      </div>
                     
                  <!--   </el-tooltip> -->
                  </template>
                </el-table-column>
                <el-table-column label="备注"min-width prop="loss_remark" align="center" :show-overflow-tooltip="true" width="150"/>
                <el-table-column label="操作人"min-width prop="adm_name" align="center"/> 
              </el-table>
              <div v-show="listProdc.length>0"class="lk-page-box">
                <el-pagination :current-page="currentWaPage":page-size="pageWaSize":total="totalWaNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentWaChange"/>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="运输报损记录" name='transpName' v-if="btnShow.transBtn">
            <el-form ref="tranpList":rules="rulesCla"class="sd-form-box clearfix"size="medium"label-width="100px">
              <el-row class="clearfix">
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="物品信息:" class="sd-form-item" prop="por_number">
                    <el-input v-model="tranpList.info" placeholder="请输入物品信息" clearable/>
                  </el-form-item>
                </el-col>
                <!--<el-col :span="5" class="sd-col-6">
                  <el-form-item label="快递公司:" class="sd-form-item" prop="por_state">
                    <el-select v-model="tranpList.wl_unitid" class >
                      <el-option v-for="item in companyList":key="item.id":label="item.name":value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="快递单号:" class="sd-form-item" prop="system_number">
                    <el-input v-model="tranpList.system_number" placeholder="请输入快递单号" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="操作人:" class="sd-form-item" prop="orl_adm">
                    <el-input v-model="tranpList.orl_adm" placeholder="请输入操作人" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="sd-col-6">
                  <el-form-item label="备注:" class="sd-form-item" prop="orl_remark" >
                    <el-input v-model="tranpList.orl_remark" placeholder="请输入备注" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="10" class="sd-col-6">
                  <el-form-item label="操作时间:"class="sd-form-item"prop='con_createtime_range0'>
                    <el-date-picker v-model="tranpList.orl_time"type="datetime"placeholder="选择开始日期"value-format="yyyy-MM-dd HH:mm:ss"style='width:225px;':picker-options='pickerDateBefore' clearable>
                    </el-date-picker>
                  <!--    至
                     <el-date-picker v-model="depotList.con_createtime_range1" type="datetime" style="width:225px" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter'/> -->
                  </el-form-item>
                </el-col>           
                
                <el-col class="pl-50 fr w250"  >
                  <el-button class type="primary" @click="searchTrList('tranpList',1)">搜&nbsp;&nbsp;索</el-button>
                  <el-button class @click="resetForm('tranpList')">重&nbsp;&nbsp;置</el-button>
                </el-col>
              </el-row>
            </el-form>
            <div class="lk-table-box">
              <el-table :data="listTrans"width="100%"@selection-change="handleSelectionChange" >
                 <el-table-column type="selection"width="55"/>
                <el-table-column label="操作时间"min-width prop="orl_time" align="center"/>
                <el-table-column label="物品信息"min-width align="center">
                  <template slot-scope="scope">
                    <div align="left">
                      <span class="blue" v-if="scope.row.plat_number">系统单号:</span>{{scope.row.plat_number}}<br/>
                      <span class="blue" v-if="scope.row.plat_name">销售平台:</span>{{scope.row.plat_name}}<br/>
                      <span class="blue" v-if="scope.row.system_number">快递单号:</span>{{scope.row.system_number}}<br/>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="损毁数量"min-width prop="orl_loss" align="center" width="100"/>
                <el-table-column label="详情"align="center"width="250">
                  <template slot-scope="scope">
                    <div v-for="item in scope.row.details">
                      <span v-if="item.goo_name">[{{item.goo_name}}]</span>
                      <span v-if="item.goods_number">{{item.goods_number}}</span><br/>
                    </div>
                    <span class="blue" v-if="scope.row.details " @click="showDetail(scope.row)">
                      查看详情
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="快递公司"min-width prop="tra_name" align="center"  width="120"/>
                <el-table-column label="快递单号"min-width align="center">
                  <template slot-scope="scope">
                    {{scope.row.wl_courier}}
                    <span v-if="!scope.row.wl_courier">无</span>
                  </template>
                </el-table-column>
                <el-table-column label="备注"min-width  align="center"  :show-overflow-tooltip="true" width="150">
                   <template slot-scope="scope">
                    {{scope.row.orl_remark}}
                    <span v-if="!scope.row.orl_remark">无</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作人"min-width prop="orl_adm" align="center"  width="100"/>
              </el-table>
              <div v-show="listTrans.length>0"class="lk-page-box">
                <el-pagination :current-page="currentTrPage":page-size="pageTrSize":total="totalTrNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentTrChange"/>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-button  v-if="btnShow.exportBtn " class=" tabRightBut1"@click="exprotspop()">导出</el-button>
      </div>
     

      <!-- 生产报损详情弹窗 -->
      <el-dialog :visible.sync="addProdShow":title="dialogTit":close-on-click-modal="false"width="650px"@close="addClaForm('addProd')">
        <el-form ref="addProd"  :inline="true"   :rules="rulesCla" label-width="85px" >
          <el-row class="clearfix" >
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="果园名称:" >
                {{addProd.base_name}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="农民名称:"class="sd-form-item" > 
                {{addProd.far_name}}
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="联系电话:" >
                 {{addProd.far_mobile}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="产区类型:"class="sd-form-item" > 
                {{addProd.reg_type}}林区果园
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="生产类型:"class="sd-form-item" > 
                农资
              </el-form-item>
            </el-col> 
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="生产编号:">
                {{addProd.pro_number}}
              </el-form-item> 
            </el-col> 
            <el-col :span="24"class="sd-col-6">
              <el-form-item label=" "class="sd-form-item " > 
                <el-col :span="8"class="sd-col-6">面积:{{addProd.dis_unit}}</el-col>
                <el-col :span="8"class="sd-col-6">砧木:{{addProd.zm}}</el-col>
                <el-col :span="8"class="sd-col-6">芽枝:{{addProd.yz}}</el-col>
                <el-col :span="8"class="sd-col-6">品类:{{addProd.cla_name}}</el-col>
                <el-col :span="16"class="sd-col-6">名称:{{addProd.goo_name}}</el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24"class="sd-col-6">
               <div class="Divisionline"/>    
            </el-col> 
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="开始时间:" >
                {{addProd.pro_start}}
              </el-form-item> 
            </el-col> 
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="生产周期:" >
                {{addProd.pro_day}}
              </el-form-item> 
            </el-col> 
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="预估产量:">
                {{addProd.pro_estimate}}
              </el-form-item> 
            </el-col> 
            <el-col :span="24"class="sd-col-6">
              <el-form-item label="损耗数量:">
                {{addProd.prl_loss}}
              </el-form-item> 
            </el-col> 
            <el-col :span="24"class="sd-col-6">
              <el-form-item label="备注:">
                <div style="width:500px">
                  {{addProd.prl_remark}}
                </div>
              </el-form-item> 
            </el-col> 
          </el-row>
        </el-form>
      </el-dialog>
        <!-- 运输报损详情弹窗 -->
      <el-dialog :visible.sync="addShow":title="dialogTit":close-on-click-modal="false"width="650px"@close="addClaForm('addTrans')">
        <el-form ref="addTrans"  :inline="true"   :rules="rulesCla" label-width="85px" >
          <el-row class="clearfix" >
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="客户姓名:" >
                {{addTrans.oru_user_name}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="联系电话:" >
                 {{addTrans.oru_user_tel}}
              </el-form-item> 
            </el-col>
            <el-col :span="24"class="sd-col-6">
              <el-form-item label="收货地址:"class="sd-form-item" > 
                {{addTrans.oru_province}} 
                {{addTrans.oru_city}} 
                {{addTrans.oru_county}}
                {{addTrans.oru_address}}
              </el-form-item>
            </el-col>
            <el-col :span="24"class="sd-col-6">
              <el-form-item label=" 系统单号:"class="sd-form-item" > 
                {{addTrans.plat_number}}
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="销售平台:"class="sd-form-item" > 
                {{addTrans.plat_name}}
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="快递单号:"class="sd-form-item" > 
                {{addTrans.system_number}}
              </el-form-item>
            </el-col> 
            <!-- <el-col :span="12"class="sd-col-6">
              <el-form-item label="仓库发货人:">
                {{addTrans.pro_number}}
              </el-form-item> 
            </el-col> 
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="联系电话:">
                {{addTrans.pro_number}}
              </el-form-item> 
            </el-col>  -->
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="快递单位:">
                {{addTrans.tra_name}}
              </el-form-item> 
            </el-col> 
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="快递单号:">
                {{addTrans.wl_courier}}
                <span v-if="!addTrans.wl_courier">无</span>
              </el-form-item> 
            </el-col> 
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="损耗数量:">
                {{addTrans.orl_loss}} 
              </el-form-item> 
            </el-col> 
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="备注:">
                {{addTrans.orl_remark}}
                <span v-if="!addTrans.orl_remark">无</span>
              </el-form-item> 
            </el-col> 
          </el-row>
        </el-form> 
      </el-dialog>

      <!-- 仓库报损详情弹窗 -->
      <el-dialog :visible.sync="addWaShow":title="dialogTit":close-on-click-modal="false"width="650px"@close="addClaForm('addTrans')">
        <el-form ref="addWare"  :inline="true"   :rules="rulesCla" label-width="100px" >
          <el-row class="clearfix" >
            <el-col :span="24"class="sd-col-6">
              <el-form-item label="仓库名称:" >
                {{addWare.rep_name}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="提交人:" >
                 {{addWare.adm_name}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="联系电话:" >
                 {{addWare.adm_mobile}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="总溯源码量:" >
                <span v-if="addWare.codeCount">{{addWare.codeCount}}</span>
                <span v-else>0</span>
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="报损总数:" >
                 <span v-if="addWare.loss_num">{{addWare.loss_num}}</span>
                  <span v-else>0</span>
              </el-form-item> 
            </el-col>
            <el-col :span="24"class="sd-col-6">
              <el-form-item label=" 备注:"class="sd-form-item" > 
                {{addWare.loss_remark}}
              </el-form-item>
            </el-col>
            <el-col :span="24"class="sd-col-6">
              <el-form-item label=" 库位:"class="sd-form-item" > 
                {{addWare.sto_name}}
              </el-form-item>
            </el-col>
            <el-table :data="addWare.loss_codes"width="60%"@selection-change="handleSelectionChange" >
              <el-table-column label="报损信息"min-width  align="center" >
                <template slot-scope="scope">
                  <div align="left">
                    <el-col :span="24">
                      <span v-if="scope.row.goo_name">[商品名称]{{scope.row.goo_name}}</span>
                    </el-col>
                    <span v-if="scope.row.gco_number">[溯源码号]{{scope.row.gco_number}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="坏果数量"min-width  prop="num" align="center" width="150"/>
            </el-table>
          </el-row>
        </el-form> 
      </el-dialog>
    </el-row>
    <a :href="exportUrl" id='exportFile'style='display:none;'></a>

  </div>
</template>
<script>
import {lossList, getlossDetail,transList,wareList,wareDetail,wareExport,lossExport,transExport} from '@/api/map'
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
      dialogTit:'',
      addProd:[],
      addProdShow:false,
      addWaShow:false,
      exportUrl:'',
      activeName:'productName',
      productThis:false,//table左上角tab是不是运输
    
      prodList:{
        prl_time:'',
        cla_name:'',
        goo_name:'',
        prl_admacc:'',
        prl_admname:'',
        prl_remark:'',
      },
      companyList:[],
      tranpList:{
        orl_time:'',
        info:'',
        wl_unitid:'',
        system_number:'',
        orl_adm:'',
        orl_remark:'',
      },
      depotList:{
        con_createtime_range0:'',
        con_createtime_range1:'',
        adm_name:'',
        loss_remark:'',

      },
      addWare:{},
      addShow : false,
      addTrans:{},
      rulesCla: {
        dis_name: [],
        dis_number:[],
        dis_state: [],
        far_id: [],
        reg_type: [],
        reg_id: []
      },
      search:0,
      listWare:[],
      currentWaPage: 1,
      pageWaSize: null,
      totalWaNum: null,
      listProdc:[],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      listTrans:[],
      currentTrPage: 1,
      pageTrSize: null,
      totalTrNum: null,
      addProd:{},
      reapstate:[
        { id: 0, name: '全部' },
        { id: 1, name: '未发码' },
        { id: 2, name: '已发码' },
      ],
      btnShow:{
        exportBtn:false,
        produBtn:false,
        wareBtn:false,
        transBtn:false
      },
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.tranpList.orl_time;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      },
      pickerDateBefore2: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.depotList.con_createtime_range0;
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
          let DateVal = this.depotList.con_createtime_range1;
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
      const data3 = {};
      data1.pri_id=this.$route.meta.pri_id
      if(this.search ===1){
        data1.page = this.currentPage
      }else if(this.search ===2){
        data2.page = this.currentPage
      }else if(this.search ===3){
        data3.page = this.currentPage
      }else if(this.search ===0){
        data1.page = this.currentPage
        data2.page = this.currentPage
        data3.page = this.currentPage
      }
     
      lossList(data1)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.listProdc = dataRep.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
            this.search=0
            const btnList = dataRep.button_data
            for(var i in btnList){
              if(btnList[i].pri_funname === '导出'){
                this.btnShow.exportBtn = true
              } else if (btnList[i].pri_funname === '生产报损记录') {
                this.btnShow.produBtn = true
              } else if (btnList[i].pri_funname === '仓库报损记录') {
                this.btnShow.wareBtn = true
              } else if (btnList[i].pri_funname === '运输报损记录') {
                this.btnShow.transBtn = true
              }             }
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
      transList(data2)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.listTrans = dataRep.data
            this.currentTrPage = dataRep.current_page
            this.pageTrSize = dataRep.current_number
            this.totalTrNum = dataRep.total
            this.search=0
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
      wareList(data3)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.listWare = dataRep.data_info.data_info
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
    getprodTail(prlId){
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
       if(tab.name === 'transpName'){
         this.productThis =true
       }else if(tab.name === 'productName'){
         this.productThis =false
       }else if(tab.name === 'WareName'){
         this.productThis =true//如果为false会显示右上角导出按钮
       }
    },
 


    //生产报损弹框
    showProduDe(row){
      this.dialogTit='查看'
      this.addProdShow=true
      this.getprodTail(row.prl_id)
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
      this.getWareInfo(scope.loss_id)
    },
    //获取仓库报损信息
    getWareInfo(lossId){
      const data={}
      data.loss_id=lossId
      wareDetail(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.addWare = dataRep.data_info
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },

    // 重置
    resetForm(formName) {
      for(let i in this.prodList){
        this.prodList[i] = ''
      }
      // if(this.$refs[formName]){
         this.$refs[formName].resetFields()
      // }

    },
    // 分页-操作列表
    handleCurrentChange(val) {
      this.search=1
      this.currentPage = val
      if (this.serch_req) {
        this.searchList('prodList', val)
      } else {
        this.getPageInfo()
      }
    },
    handleCurrentTrChange(val) {
      this.search=2
      this.currentTrPage = val
      if (this.serch_req) {
        this.searchTrList('tranpList', val)
      } else {
        this.getPageInfo()
      }
    },
    handleCurrentWaChange(val) {
      this.currentWaPage = val
      this.search=3
      if (this.serch_req) {
        this.searchWaList('depotList', val)
      } else {
        this.getPageInfo()
      }
    },
    searchWaList(formName, page){
      this.search=3
      const search =this.depotList

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.page = page
      wareList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.listWare = dataRep.data_info.data_info
            this.currentWaPage = dataRep.data_info.current_page
            this.pageWaSize = dataRep.data_info.current_number
            this.totalWaNum = dataRep.data_info.total
          }
        })
    },
    // 搜索-操作
    searchList(formName, page) {
      const search =this.prodList
      this.search=1
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.page = page
      lossList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.listProdc = dataRep.data
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
      transList(search)
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
    //导出
    exprotspop(){
      const url = process.env.BASE_API
      const baseUrl=url.replace('/public','/')
      if(this.activeName === 'productName'){
        const data=this.prodList
        // data.pop_proid=this.proId
        // data.type=1
        lossExport(data).
          then(response=>{
            if(errorStatus(response.data)){
              const str=response.data.data
              this.exportUrl=baseUrl+str
              this.clickDowBtn()
              this.$message.success("导出请求成功")
            }
        }).catch(Error=>{
          this.$message.error("导出请求失败")
        })
      }else if(this.activeName === 'transpName'){
        const dataReap=this.tranpList
        // dataReap.por_proid=this.proId
        // dataReap.type=2
        transExport(dataReap).then(response=>{
          if(errorStatus(response.data)){
            const str=response.data.data
            this.exportUrl=baseUrl+str
            this.clickDowBtn()
            this.$message.success("导出请求成功")
          }
        }).catch(Error=>{
          this.$message.error("导出请求失败")
        })
      }else{
         const dataReap=this.depotList
        // dataReap.por_proid=this.proId
        // dataReap.type=2
        wareExport(dataReap).then(response=>{
          if(errorStatus(response.data)){
            const str=response.data.data
            this.exportUrl=baseUrl+str
            this.clickDowBtn()
            this.$message.success("导出请求成功")
          }
        }).catch(Error=>{
          this.$message.error("导出请求失败")
        })
      }      



      
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


 