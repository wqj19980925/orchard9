<template>
  <div class="app-container">
    <el-row class="sd-module-box" v-if="!senThiscode">

        <div class="sd-moudle-header mar-bot-10">
          <div class="sd-module-title">
            生产编号:
            <el-select v-model="proId" class="numselect"  placeholder="请选择生产编号" @change="changgeThisNum">
              <el-option v-for="item in numList":key="item.pro_id":label="item.pro_number":value="item.pro_id"/>
            </el-select>
          </div>
          <div class="topbuton" >
            <el-button  class="btn-mainCol"@click="addGoodsBtn()">新增</el-button>
            <el-button v-if="numdata" class="btn-delete"@click="delNumBtn()">删除</el-button>
            <el-button v-if="btnShow.seedBtn" :disabled="susDisabled" @click="addSeedling()">苗木管理</el-button>
            <el-button v-if="btnShow.agriBtn"  :disabled="susDisabled" class="openCol-btn"@click="agricTask()">农事任务
              <span class="red">{{addAgric.length}}</span>
            </el-button>
            <el-button v-if="btnShow.estimBtn" :disabled="susDisabled" class="btn-mainCol"@click="estimOutput()">预估产量</el-button>
            <el-button v-if="btnShow.lossBtn" :disabled="susDisabled" class="btn-delete"@click="viewJob()">损耗报备</el-button>
            <el-button v-if="btnShow.harvBtn" :disabled="susDisabled"  class="btn-mainCol"@click="addHarvest()">收获产物</el-button>
            <el-button v-if="btnShow.exportBtn" class="btn-delete"@click="exprotspop()">导出</el-button>
            <el-button  class="btn-delete"@click="backBtn()">返回</el-button><!-- v-if="proId || baseId" -->
          </div>
        </div>
        <div v-if="numdata">
          <el-form  ref="formList":rules="rules"class="sd-form-box clearfix"size="medium"label-width="100px">
            <el-row class="clearfix" >
              <el-col :span="16"class="sd-col-6">
                <el-col :span="8"class="sd-col-6">
                  <el-form-item  label="果园名称:"class="sd-form-item"prop="dis_name"  >
                    {{formList.base_name}}
                  </el-form-item>
                </el-col>
                <el-col :span="8"class="sd-col-6">
                  <el-form-item label="负责人姓名:"class="sd-form-item"prop="dis_number">
                    {{formList.far_name}}
                  </el-form-item>
                </el-col>
                <el-col :span="8"class="sd-col-6">
                  <el-form-item label="联系电话:"class="sd-form-item"prop="dis_number">
                     {{formList.far_mobile}}
                  </el-form-item>
                </el-col>
                <el-col :span="24"class="sd-col-6">
                  <el-form-item label="苗木信息:"class="sd-form-item"prop="reg_type">
                    <div >
                      <div style="float:left;width:10%;" v-for="(typecount,index) in formList.content":key="index"class="clearfix " >
                        <div v-if="typecount.prn_number">
                          <el-tooltip :content="typecount.nur_name+':'+typecount.prn_number" placement="top" popper-class="test"   trigger="hover" >
                            <a class="rightInfoWord" >
                              <span class="blue">{{typecount.nur_name}}:</span>{{typecount.prn_number}}
                            </a>
                          </el-tooltip>
                        </div>
                        <div v-else>
                          暂无数据
                        </div>
                      </div>
                  </div>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="8"class="sd-col-6">
                <el-col :span="16"class="sd-col-6 ">
                  <el-col :span="12"class="sd-col-6 rightInfoWord1">
                    <span class="blue">面积(㎡):</span>{{formList.far_area}}</a>
                  </el-col>
                  <el-col :span="12"class="sd-col-6 rightInfoWord1">
                    <span class="blue">生产情况:</span>
                    <span v-if="formList.pro_state===1">筹备中</span>
                    <span v-if="formList.pro_state===2">生产中</span>
                    <span v-if="formList.pro_state===3">暂停</span>
                    <span v-if="formList.pro_state===4">已结束</span>
                  </el-col>
                  <el-col :span="12"class="sd-col-6 rightInfoWord1">
                      <span class="blue">状态:</span>
                      <span v-if="formList.far_state===1">启用</span>
                      <span v-if="formList.far_state===2">停用</span>
                  </el-col>
                  <el-col :span="12"class="rightInfoWord1">
                    <span class="blue">已完成生产:</span>{{formList.pro_finish}}次
                  </el-col>
                </el-col>
                <el-col :span="8"class="sd-col-6">
                  <template  >
                  <el-button v-if="formList.pro_state===1 && btnShow.beginBtn"size="medium" type="info" class="startThisPro"@click="startProd">开始生产
                    </el-button>
                  <el-button v-if="formList.pro_state===2 && btnShow.subsendBtn" size="medium" type="warning" class="EndThisPro"
                  @click="suspProd">暂停生产
                    </el-button>
                  <el-button v-if="formList.pro_state===3 && btnShow.recovBtn" class="EndThisPro recovery" size="medium"  type="success"@click="suspProd">恢复生产
                    </el-button>
                  <el-button v-if="(formList.pro_state===3 || formList.pro_state===2) && btnShow.overBtn "  class="EndThisPro overThis"size="medium" type="info" @click="endProd">结束生产
                  </el-button>
                  <div class="recoversty"v-if="formList.pro_state===4" size="medium"  type="info" >
                    已结束生产<p>如有问题请联系管理员</p>
                  </div>
                </template>
                </el-col>
              </el-col>
            </el-row>
            <div class="Divisionline"/>
            <el-col :span="24"class="sd-col-6"  >
                <el-col :span="6"class="sd-col-6">
                  <el-form-item label="生产编号:"class="sd-form-item"prop="dis_name" >
                    {{formList.pro_number}}
                  </el-form-item>
                </el-col>
                <el-col :span="6"class="sd-col-6">
                  <el-form-item label="生产周期:"class="sd-form-item"prop="dis_number">
                    {{formList.pro_day}}天
                  </el-form-item>
                </el-col>
                <el-col :span="6"class="sd-col-6">
                  <el-form-item label="开始时间:"class="sd-form-item"prop="dis_number">
                    {{formList.pro_start}}
                  </el-form-item>
                </el-col>
                <el-col :span="6"class="sd-col-6">
                  <el-form-item label="结束时间:"class="sd-form-item"prop="dis_number">
                    {{formList.pro_end}}
                  </el-form-item>
                </el-col>
                 <el-col :span="6"class="sd-col-6">
                  <el-form-item label="预估产量:"class="sd-form-item"prop="dis_number">
                    {{formList.pro_estimate}}
                  </el-form-item>
                </el-col>
                 <el-col :span="6"class="sd-col-6">
                  <el-form-item label="实际产量:"class="sd-form-item"prop="dis_number">
                    {{formList.pro_actual}}
                  </el-form-item>
                </el-col>
                 <el-col :span="6"class="sd-col-6">
                  <el-form-item label="损耗量:"class="sd-form-item"prop="dis_number">
                    {{formList.pro_loss}}
                  </el-form-item>
                </el-col>
              </el-col>
          </el-form>
          <div class="switchThisTab">
            <el-tabs  class="allTab" v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="操作记录" name='opraRecord' v-if="btnShow.operaBtn">
                <el-form ref="operaList":rules="rulesCla"class="sd-form-box clearfix"size="medium"label-width="100px">
                  <el-row class="clearfix">
                    <el-col :span="6" class="sd-col-6">
                      <el-form-item prop="pop_time" label="时间:">
                        <el-date-picker v-model="operaList.pop_time"type="datetime"placeholder="请输入日期"class="lk-time-box" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateBefore'/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" class="sd-col-6">
                      <el-form-item label="功能:" class="sd-form-item" prop="pop_function">
                        <el-select v-model="operaList.pop_function" class style="width:120px;">
                          <el-option v-for="item in functionList":key="item.popid":label="item.popname":value="item.popid"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" class="sd-col-6">
                      <el-form-item label="内容:" class="sd-form-item" prop="pop_content">
                        <el-input v-model="operaList.pop_content" placeholder="请输入内容"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" class="sd-col-6">
                      <el-form-item label="员工姓名:" class="sd-form-item" prop="pop_admname">
                        <el-input v-model="operaList.pop_admname" placeholder="请输入员工姓名"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" class="sd-col-6">
                      <el-form-item label="用户名:" class="sd-form-item" prop="pop_admacc">
                        <el-input v-model="operaList.pop_admacc" placeholder="请输入用户名"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3" class="sd-col-6">
                      <el-form-item label="类型:" class="sd-form-item" prop="pop_state">
                        <el-select v-model="operaList.pop_state" class style="width:120px;">
                          <el-option v-for="item in operstate":key="item.id":label="item.name":value="item.id"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col class="pl-50 fr w250"  >
                      <el-button class type="primary" @click="searchList('operaList',1)">搜&nbsp;&nbsp;索</el-button>
                      <el-button class @click="resetForm('operaList')">重&nbsp;&nbsp;置</el-button>
                    </el-col>
                  </el-row>
                </el-form>
                <div class="lk-table-box">
                  <el-table :data="opeList"width="100%"@selection-change="handleSelectionChange" >
                    <el-table-column type="selection"width="55"/>
                    <el-table-column label="时间"min-width prop="pop_time" align="center" width="150"/>
                    <el-table-column label="功能"min-width align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.pop_function == 1">新增信息 / {{ scope.row.tem_title }}</div>
                        <div v-if="scope.row.pop_function == 4">农事任务 / {{ scope.row.tem_title }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="内容"min-width align="center" width="80">
                      <template slot-scope="scope">
                        <div align="left">
                          <span @click="seedetails(scope.row.pop_content,4)" class="blue" v-if="scope.row.pop_function === 4">
                            查看详情
                          </span>
                          <span @click="seedetails(scope.row.pop_content,1)" class="blue" v-if="scope.row.pop_function === 1">
                            查看详情
                          </span>
                          <span v-if="scope.row.pop_function === 6">
                           <el-tooltip :content="scope.row.pop_content" placement="top" popper-class="test"   trigger="hover" >
                              <div>
                               {{ scope.row.pop_content.substr(0,30)+'...' }}
                              </div>
                            </el-tooltip>
                          </span>
                          <span v-if="scope.row.pop_function !== 1 && scope.row.pop_function !== 4 && scope.row.pop_function !== 6">
                            {{scope.row.pop_content}}
                          </span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="用户名"min-width prop="pop_admacc" align="center"/>
                    <el-table-column label="员工姓名"min-width prop="pop_admname" align="center"/>
                    <el-table-column label="状态"align="center" width="150">
                      <template slot-scope="scope">
                        <div v-if="scope.row.pop_state == 1">显示</div>
                        <div v-if="scope.row.pop_state == 2">隐藏</div>
                        <div v-if="scope.row.pop_state == 3">不对外展示</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作"align="left"width="250">
                      <template slot-scope="scope">
                        <div class="opr-btn-box" align="left">
                          <el-button v-if="scope.row.pop_function ===1 && btnShow.editAddBtn"size="mini"class="btn-mainCol"@click="editOpreaRow(scope.row)" :disabled="susDisabled" >编辑</el-button>
                          <el-button v-if="scope.row.pop_function ===4  && btnShow.editAgriBtn"size="mini"class="btn-mainCol"@click="editOpreaRow(scope.row)" :disabled="susDisabled" >编辑</el-button>
                          <el-button v-if="scope.row.pop_state==2 && btnShow.showBtn "size="mini"class="openCol-btn"@click="enableThisClas(scope.row,1)" :disabled="susDisabled"> 显示
                          </el-button>
                          <el-button v-if="scope.row.pop_state==1  && btnShow.hideBtn "size="mini"class="stopCol-btn"@click="enableThisClas(scope.row,2)" :disabled="susDisabled"> 隐藏
                          </el-button>
                          <el-button size="mini"class="btn-delete"@click="delBtn(scope.row)">删除</el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div v-show="opeList.length>0"class="lk-page-box">
                    <el-pagination :current-page="currentPage":page-size="pageSize":total="totalNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="收获记录" name='harvestRecord'  v-if="btnShow.receiBtn">
                <el-form ref="reapList":rules="rulesCla"class="sd-form-box clearfix"size="medium"label-width="100px">
                  <el-row class="clearfix">
                    <el-col :span="6" class="sd-col-6">
                      <el-form-item prop="por_time" label="时间:">
                        <el-date-picker v-model="reapList.por_time"type="datetime"placeholder="开始日期"class="lk-time-box" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateBefore2'/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" class="sd-col-6">
                      <el-form-item label="收获编号:" class="sd-form-item" prop="por_number">
                        <el-input v-model="reapList.por_number" placeholder="请输入收获编号"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" class="sd-col-6">
                      <el-form-item label="员工姓名:" class="sd-form-item" prop="por_admname">
                        <el-input v-model="reapList.por_admname" placeholder="请输入员工姓名"/>
                      </el-form-item>
                    </el-col>
                    <el-col class="pl-50 fr w250"  >
                      <el-button class type="primary" @click="searchReList('reapList',1)">搜&nbsp;&nbsp;索</el-button>
                      <el-button class @click="resetForm('reapList')">重&nbsp;&nbsp;置</el-button>
                    </el-col>
                  </el-row>
                </el-form>
                <div class="lk-table-box">
                  <el-table :data="relist"width="100%"@selection-change="handleSelectionChange" >
                    <el-table-column type="selection"width="55"/>
                    <el-table-column label="时间"min-width prop="por_time" align="center"/>
                    <el-table-column label="收获编号"min-width prop="por_number" align="center"/>
                    <el-table-column label="内容"min-width prop="por_content" align="center"/>
                    <el-table-column label="操作人"min-width prop="por_admname" align="center"/>
                    <el-table-column label="操作"align="center"width="320">
                      <template slot-scope="scope">
                        <div class="opr-btn-box">
                          <el-button v-if="btnShow.levelBtn" size="mini"class="btn-mainCol"@click="getGrade(scope.row)">品级</el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div v-show="relist.length>0"class="lk-page-box">
                    <el-pagination :current-page="currentRePage":page-size="pageReSize":total="totalReNum"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentReChange"/>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-button  v-if="!sendCode  && btnShow.delBtn" class=" btn-delete tabRightBut1"@click="delChoseBtn()">删除</el-button>
            <el-button  v-if="!sendCode && btnShow.addBtn" :disabled="susDisabled" class=" btn-mainCol tabRightBut"@click="addBtn()">新增</el-button>
          </div>
        </div>
        <div v-if="!numdata" class="blankcontent" align="center">
          <div>暂无生产编号,请先新增</div>
        </div>
      <!-- 苗木管理弹窗 /损耗报备-->
      <el-dialog :visible.sync="showseedling":title="dialogTit":close-on-click-modal="false"width="550px"@close="addSeedClaForm('addSeed')">
        <el-form ref="addSeed":rules="rulesCla"label-width="80px" >
          <el-form-item label="砧木"prop="stock_num" v-if="thisSeeding">
             <el-select v-model="addSeed.stock_id"class > 
              <el-option v-for="item in zmList":key="item.stock_id":label="item.stock_name":value="item.stock_id"/>
            </el-select>
            <el-input v-model="addSeed.stock_num"style="width:195px"placeholder="请输入数量"/>
          </el-form-item> 
          <el-form-item label="芽枝"prop="project_num"class="sd-form-item" v-if="thisSeeding"> 
            <el-select v-model="addSeed.project_id"class > 
              <el-option v-for="item in yzList":key="item.project_id":label="item.project_name"
              :value="item.project_id"/>
            </el-select>
            <el-input v-model="addSeed.project_num"style="width:195px"placeholder="请输入数量"/>
          </el-form-item>
          <el-form-item label="损耗量:"class="sd-form-item"prop="lor_lossnum" v-if="!thisSeeding">
              <el-input v-model="addSeed.lor_lossnum"placeholder="请输入数值(不得大于预估产量值)" />
              <span class="red rightInfoWord">*生长过程中，已套袋的水果产生的坏果数量</span>
              <span class="red rightInfoWord">(剩余产量值{{surplusNum}})</span>
          </el-form-item>
          <el-form-item label="原因说明"prop="lor_case" v-if="!thisSeeding">
            <el-input type="textarea" :rows="5" maxlength="200" v-model="addSeed.lor_case"placeholder="请输入原因说明"  />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addSeedClaForm('addSeed')">取 消</el-button>
          <el-button v-if="!thisSeeding" type="primary"@click="addlossBtn('addSeed')">提 交</el-button>
          <el-button v-else type="primary"@click="addSeedBtn('addSeed')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 预估产量弹窗 -->
      <el-dialog :visible.sync="estimShow":title="dialogTit":close-on-click-modal="false"width="550px"
      @close="addClaForm('addEstim')">
        <el-form    ref="addClaEst":rules="rulesCla"label-width="80px">
          <el-form-item label="生产编号"prop="pro_number" style="width:100%">
            {{addEstim.pro_number}}
          </el-form-item>
          <el-form-item label="品类名称:"class="sd-form-item"prop="cla_name" >
            <!-- {{addEstim.cla_name}} -->
            水果种植套袋
          </el-form-item>
          <el-form-item label="商品名称:"class="sd-form-item"prop="dis_name" >
            {{addEstim.goo_name}}
          </el-form-item>
          <div class="Divisionline"/>
          <el-form-item label="消耗农资"prop="stock_num" ><!-- v-if="thisSeeding" -->
            <el-col :span="6">
             水果种植套袋
            </el-col>
        <!-- <el-input v-model="addEstim.acl_name" disabled style="width:45%"/>-->
           <el-col :span="12">
            <el-select v-model="addEstim.agr_id" class @change='changeAgri' > 
              <el-option v-for="item in agriList":key="item.agr_id":label="item.agr_name"
              :value="item.agr_id"/>
            </el-select> 
          </el-col>
            <div><span class="red rightInfoWord">*库存量{{addEstim.agr_kc}}</span></div>
          </el-form-item> 
          <el-form-item   label="预估产量:" class="sd-form-item" prop="dis_agoname" >
            <el-input v-model="addEstim.estimate"/>
            <div><span class="red rightInfoWord">*预估数量 = 这个生产编号下所有果树上套袋的数量</span></div>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addEstim')">取 消</el-button>
          <el-button  type="primary"@click="addEstBtn('addEstim')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 收获产物弹窗 -->
      <el-dialog :visible.sync="harvShow":title="dialogTit":close-on-click-modal="false"width="650px"@close="addClaForm('addharv')">
        <el-form ref="addharv"  :inline="true"   :rules="rulesCla" label-width="85px" >
          <el-row class="clearfix" >
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="果园名称:" >
                {{addharv.base_name}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="农民名称:"class="sd-form-item" > 
                {{addharv.far_name}}
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="联系电话:" >
                 {{addharv.far_mobile}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="生产编号:">
                {{addharv.pro_number}}
              </el-form-item> 
            </el-col> 
            <el-col :span="24"class="sd-col-6">
              <el-form-item label=" "class="sd-form-item " > 
                <el-col :span="8"class="sd-col-6">面积:{{addharv.far_area}}</el-col>
                <el-col :span="8"class="sd-col-6">砧木:{{addharv.zm}}</el-col>
                <el-col :span="8"class="sd-col-6">芽枝:{{addharv.yz}}</el-col>
                <el-col :span="8"class="sd-col-6">品类:{{addharv.cla_name}}</el-col>
                <el-col :span="24"class="sd-col-6">名称:{{addharv.goo_name}}</el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24"class="sd-col-6">
               <div class="Divisionline"/>    
            </el-col> 
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="开始时间:" >
                {{addharv.pro_start}}
              </el-form-item> 
            </el-col> 
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="生产周期:" >
                {{addharv.pro_day}}
              </el-form-item> 
            </el-col> 
            <el-col :span="8"class="sd-col-6">
              <el-form-item label="预估产量:">
                {{addharv.pro_estimate}}
              </el-form-item> 
            </el-col> 
          </el-row>
          <el-form-item label="收获数量:"prop="reap_num" >
            <el-input v-model="addharv.reap_num" placeholder="请输入收获数量" style="width:465px"/>
          </el-form-item> 
          <el-form-item label="产品品级:">
            <el-input value="一级" disabled/>
          </el-form-item> 
          <el-form-item label="数量:"prop="one_num" >
            <el-input v-model="addharv.one_num" placeholder="请输入一级数量"/>
          </el-form-item> 
          <el-form-item label="产品品级:" >
            <el-input value="二级" disabled/>
          </el-form-item> 
          <el-form-item label="数量:"prop="two_num" >
            <el-input v-model="addharv.two_num" placeholder="请输入二级数量"/>
          </el-form-item>
          <el-form-item label="产品品级:" >
            <el-input value="三级" disabled/>
          </el-form-item>  
          <el-form-item label="数量:"prop="three_num" >
            <el-input v-model="addharv.three_num" placeholder="请输入三级数量"/>
          </el-form-item>   
          <el-form-item label="参与员工:"prop="stock_num" >
            <div class="staffChoice main" style="float:left">
              <div class="staffChoice" >
                <el-checkbox class="personBut" v-model="checked" border disabled > 
                  {{addharv.far_name}}<p>农户</p>
                </el-checkbox>
              </div>
              <el-checkbox-group v-model="tem_person">
                <div class="staffChoice" v-for="item in tempList"    v-if="tempList.length !== 0" >
                  <el-checkbox :label="item.tem_id" :key="item.tem_id" class="personBut" border @change="checkedTem(1)">
                    {{item.tem_name}}<p>临时工</p>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
              <el-checkbox-group v-model="off_person">
                <div class="staffChoice" v-for="item in offList" v-if="offList.length !== 0"  >
                  <el-checkbox :label="item.off_id" :key="item.off_id"  class="personBut" border  @change="checkedTem(2)">
                    {{item.off_name}}<p>正式员工</p>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </el-form-item>   
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addharv')">取 消</el-button>
          <el-button type="primary"@click="addHarvBtn('addharv')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新增弹窗 -->
      <el-dialog :visible.sync="addShow":title="dialogTit":close-on-click-modal="false"width="500px"
      @close="addClaForm('addClaThis')">
        <el-form  :inline="true"  ref="addClaThis":rules="rulesCla"label-width="80px">
          <el-form-item label="标签名称"prop="fla_id" >
            <el-select v-model="addClaThis.fla_id" class @change='changeTag' filterable > 
              <el-option v-for="item in tagList":key="item.fla_id":label="item.fla_name"
              :value="item.fla_id"/>
            </el-select>
          </el-form-item> 
          <el-form-item label="模板名称"prop="fom_id" >
            <el-select v-model="addClaThis.fom_id" class @change='changeModel'  @click.native="getSelect(1)">  
              <el-option v-for="item in modeList":key="item.fom_id":label="item.fom_name"
              :value="item.fom_id"/>
            </el-select>
          </el-form-item> 
          <el-form-item label="搜索信息"prop="tem_id" >
            <el-select v-model="addClaThis.tem_id" class @change='changeInfo'  @click.native="getSelect(2)"> 
              <el-option v-for="item in downAlList":key="item.tem_id":label="item.tem_title"
              :value="item.tem_id"/>
            </el-select>
          </el-form-item> 
          <div class="Divisionline"/>
          <el-row :gutter="20"class="addGods-infor-box" v-if="!addClaThis.tem_id==''">
            <div v-for="(item,index) in downInfoList":key="index" class="addGods-infor-ipt clearfix"  v-if='item.show===1' >
              <el-col :span="6"><!-- class="add-gods-title" -->
                <el-col :span="24">
                  <span v-if='item.type<11'>{{item.key}}</span>
                  <span v-else>{{item.key.title}}</span>
                </el-col>
              </el-col>
              <el-col :span="18">
                <el-col :span="24" v-if="!item.alllist">
                  <span v-if="item.type<5 ">
                    <el-input v-model="item.value" ></el-input>
                  </span>
                  <el-button v-if="item.type===5 || item.type===6" style="width:100%;" class="up_img_btn" type="primary"@click="lookImg(index)" >
                    点击预览
                  </el-button>
                  <span v-if="item.type===7 && !edit"><el-input :disabled="true" placeholder="完成时自动追加系统时间" ></el-input></span>
                  <span v-if="item.type===7 && edit"><el-input :disabled="true" placeholder="系统补填时间信息" ></el-input></span>
                  <span v-if="item.type===8"><el-input :disabled="true" placeholder="系统补填位置信息" ></el-input></span>
                  <span v-if="item.type===9"><el-input :disabled="true" placeholder="系统补填溯源信息" ></el-input></span>
                  <span v-if="item.type===10"><el-input :disabled="true" placeholder="系统补填发布人信息" ></el-input></span>
                </el-col>
                <el-col :span="24" v-if="item.type == 11">
                  <el-col :span="12" style="padding-left:0px">
                    <span>{{item.value.name}}</span>
                  </el-col>
                  <el-col :span="12">
                    <el-select v-model="item.value.n_id" placeholder="请选择">
                      <el-option
                        v-for="item in opetion1"
                        :key="item.rep_id"
                        :label="item.rep_name"
                        :value="item.rep_id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-col>
                <el-col :span="24" v-if="item.type == 12">
                  <el-col :span="12" style="padding-left:0px">
                    <span>{{item.value.name}}</span>
                  </el-col>
                  <el-col :span="12">
                    <el-select v-model="item.value.id" placeholder="请选择">
                      <el-option
                        v-for="item in opetion2"
                        :key="item.off_id"
                        :label="item.off_name"
                        :value="item.off_id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-col>
                <el-col :span="24" v-if="item.type == 13">
                  <el-col :span="12" style="padding-left:0px">
                    <span>{{item.value.name}}</span>
                  </el-col>
                  <el-col :span="12">
                    <el-select v-model="item.value.id" placeholder="请选择">
                      <el-option
                        v-for="item in opetion3"
                        :key="item.dit_id"
                        :label="item.dit_name"
                        :value="item.dit_id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-col>
                <el-col :span="24" v-if="item.type == 14">
                  <el-col :span="12" style="padding-left:0px">
                    <span>{{item.value.name}}</span>
                  </el-col>
                  <el-col :span="12">
                    <el-select v-model="item.value.n_id" placeholder="请选择">
                      <el-option
                        v-for="item in opetion4"
                        :key="item.goo_id"
                        :label="item.goo_name"
                        :value="item.goo_id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-col>
                <span v-if="item.type===15 && item.value.type===1 ">
                  <span  class="rightInfoWord">
                    消耗数量
                  </span>
                  <el-input v-model="item.value.number" placeholder="请输入实际消耗农资数"  style="width:180px"/>
                  <span class="red rightInfoWord">*库存量{{item.value.totalAll}}</span>
                </span>
              </el-col>
            </div>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addClaThis')">取 消</el-button>
          <el-button  type="primary"@click="addClaBtn('addClaThis')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 图片展示 -->
      <el-dialog :visible.sync="img.showImg":close-on-click-modal="false"title="图片预览"width="400px"class="lookimg-dialog"@close="img.showImg=false">
        <img :src="img.imgUrl"alt class="img-lookup">
        <span slot="footer">
          <el-button @click="activeUpload()">更换图片</el-button>
          <el-button type="primary"@click="img.showImg=false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 视频预览 -->
      <el-dialog :visible.sync="video.showImg":close-on-click-modal="false"title="视频预览"width="400px" height="340px"
        class="lookimg-dialog lookVideo-dialog"@close="video.showImg=false">
        <video :src="video.imgUrl"class="video-lookup"controls="controls"/>
        <span slot="footer">
          <el-button @click="activeUpload()">更换视频</el-button>
          <el-button type="primary"@click="video.showImg=false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 农事任务 -->
      <el-dialog :visible.sync="agriShow":title="dialogTit":close-on-click-modal="false"width="600px"style="overflow-y:auto;"
      @close="addClaForm('addAgric')">
        <el-form  :inline="true"  ref="addClaEst":rules="rulesCla"label-width="80px"  style="overflow-y:auto;">
          <div align="center" class="noDatain"v-if="addAgric.length===0">暂无数据</div>
          <div v-for="agric in addAgric" style="border:1px solid #ddd">
            <div style="background:#ddd;height:30px;line-height:30px">
              {{agric.task_name}}
              <span style="float:right"class="red rightInfoWord" v-if="agric.task_state ===2"> 未完成 </span>
              <span style="float:right" class="red rightInfoWord" v-if="agric.task_state ===3"> 未完成  加急 </span>
            </div>
            <el-row :gutter="20"class="addGods-infor-box" >
              <el-col :span="12">
                <el-form-item label="发布时间:">
                  {{agric.task_issue_time}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发布人:">
                  {{agric.adm_name}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="任务内容:">
                  <div style="width:400px">{{agric.task_content}}</div>
                </el-form-item> 
              </el-col>
              <el-col :span="24">
                 <el-form-item label="信息名称:">
                  <div v-for="(item,i) in agric.task_origin" class="infonameclass">
                    <span class="blue" @click="agriThis(item.fom_temp,agric.task_id)">
                      {{item.template}}
                      <span v-if="agric.task_origin[i+1]">,</span>
                    </span>
                  </div>
                </el-form-item> 
            <!--   <el-table :data="agric.task_origin" >
                   <el-table-column  label="信息名称" >
                    <template slot-scope="scope">
                      <span class="blue" @click="agriThis(scope.row.fom_temp,agric.task_id)">{{scope.row.template}}</span>
                    </template>
                   </el-table-column>
                </el-table> -->
                <!--<div v-for="item in agric.task_origin"></div> -->
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-dialog>
      <!-- 农事任务信息 -->
      <el-dialog :visible.sync="agriOneShow":title="dialogTit":close-on-click-modal="false"width="550px"
      @close="addClathisForm('addOneAgric')" style="overflow:auto;">
        <el-form  :inline="true"  ref="addClaEst":rules="rulesCla"label-width="80px">
            <el-row :gutter="20"class="addGods-infor-box" >
              <el-col :span="24">
                <el-form-item label="任务名称:">
                  {{addThisAgric.task_name}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发布时间:">
                  {{addThisAgric.task_issue_time}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发布人:">
                  {{addThisAgric.adm_name}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <div class ="Divisionline"/>
              </el-col>
              <el-col :span="12">
                <el-form-item label="信息名称:">
                  {{addInfoAgric.template}}
                </el-form-item>
              </el-col>
               <el-col :span="24">
                <div class ="Divisionline"/>
              </el-col>
            </el-row>
            <div v-for="(item,index) in addOneAgric":key="index"class="addGods-infor-ipt clearfix" v-if="item.show===1">

              <el-col :span="6">
                <el-col :span="24">
                  <span v-if='item.type<11'>{{item.key}}</span>
                  <span v-else>{{item.key.title}}</span>
                </el-col>
              </el-col>
              <el-col :span="18">
                <el-col :span="24" v-if="!item.alllist">
                  <span v-if="item.type<5 ">{{item.value}}</span>
                  <el-button v-if="item.type===5 || item.type===6" class="up_img_btn" type="primary"@click="lookthisImg(index)" >
                    点击预览
                  </el-button>
                  <span v-if="item.type===7 && !edit">完成时自动追加系统时间</span>
                  <span v-if="item.type===7 && edit">{{item.value}}</span>
                  <span v-if="item.type===8">{{LocationCity}}</span>
                  <span v-if="item.type===9">溯源码号,系统补填</span>
                  <span v-if="item.type===10">{{adm_acc}}</span>
                </el-col>
                <el-col :span="24" v-if="item.type>10">
                  <el-col :span="12" style="padding-left:0px">
                    <span>{{item.value.name}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>{{item.value.n_name}}</span>
                  </el-col>
                  <span v-if="item.type===15 && item.value.type===1">
                    <span  class="rightInfoWord">
                      消耗数量
                    </span>
                    <el-input v-model="item.value.number" placeholder="请输入实际消耗农资数"  style="width:180px"/>
                    <span class="red rightInfoWord">*库存量{{item.value.totalAll}}</span>
                  </span>
                </el-col>
              </el-col>
            </div>     
        </el-form>
        <span slot="footer">
          <el-button @click="addClathisForm('addOneAgric')">取 消</el-button>
          <el-button  type="primary"@click="addAgriClaBtn('addOneAgric')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 品级弹窗 -->
      <el-dialog :visible.sync="gradeShow":title="dialogTit":close-on-click-modal="false"width="650px"@close="addClaForm('addGrade')">
        <el-form ref="addGrade"  :inline="true"  :rules="rulesCla" label-width="85px" >
          <el-row class="clearfix" >
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="果园名称:" >
                {{addGrade.base_name}}
              </el-form-item> 
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="农民名称:"class="sd-form-item" > 
                {{addGrade.far_name}}
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="联系电话:" >
                 {{addGrade.far_mobile}}
              </el-form-item> 
            </el-col>
            <el-col :span="24"class="sd-col-6">
              <el-form-item label="生产编号:">
                {{addGrade.pro_number}}
              </el-form-item> 
            </el-col> 
            <el-col :span="24"class="sd-col-6">
              <el-form-item label="收获编号:" prop="por_number">
                {{addGrade.por_number}}
              </el-form-item> 
            </el-col> 
          </el-row>
            <div class="Divisionline"/>
            <el-form-item label="收获数量:"prop="por_count" >
              <el-input v-model="addGrade.por_count"  style="width:465px" disabled/>
            </el-form-item> 
            <el-form-item label="产品品级:" >
              <el-input value="一级" disabled/>
            </el-form-item> 
            <el-form-item label="数量:"prop="por_one" >
              <el-input v-model="addGrade.por_one" placeholder="请输入一级数量"/>
            </el-form-item> 
            <el-form-item label="产品品级:" >
              <el-input value="二级" disabled/>
            </el-form-item> 
            <el-form-item label="数量:"prop="por_two" >
              <el-input v-model="addGrade.por_two" placeholder="请输入二级数量"/>
            </el-form-item>
            <el-form-item label="产品品级:" >
              <el-input value="三级" disabled/>
            </el-form-item>  
            <el-form-item label="数量:"prop="por_three" >
              <el-input v-model="addGrade.por_three" placeholder="请输入三级数量"/>
            </el-form-item>   
        </el-form>
        <span slot="footer">
          <el-button @click="addClaForm('addGrade')">取 消</el-button>
          <el-button type="primary"@click="addLevel('addGrade')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 农事动态弹窗 -->
      <el-dialog :visible.sync="detailShow":title="dialogTit":close-on-click-modal="false"width="500px"
      @close="addClaForm('addCla')">
         <el-form :inline="true" ref="addCla":model="addCla":rules="rulesCla"label-width="90px">
          <el-row :gutter="20"class="addGods-infor-box" >
            <div v-for="(item,index) in farmDynamics":key="index"class="addGods-infor-ipt clearfix" v-if='item.show===1' >
              <el-col :span="6"><!-- class="add-gods-title" -->
                <el-col :span="24">
                  <span v-if='item.type<11'>{{item.key}}</span>
                  <span v-else>{{item.key.title}}</span>
                </el-col>
              </el-col>
              <el-col :span="18">
                <el-col :span="24" v-if="!item.alllist">
                  <span v-if="item.type<11 && item.type!==5 && item.type!==6 && item.type!==9">{{item.value}}</span>
                  <span v-if="item.type===9">溯源码号,系统补填</span>
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
      <!-- 新增生产编号弹窗 -->
      <el-dialog :visible.sync="showAddNum":title="dialogTit":close-on-click-modal="false"width="650px"
      @close="cancleNum('addClaNum')">
        <el-form :inline="true" ref="addClaNum":model="addClaNum":rules="rulesCla"label-width="90px">
          <div style="width:100%">
            <el-form-item label="商品品类:"class="sd-form-item"prop="cla_id">
              <el-select v-model="addClaNum.cla_id"class filterable clearable @clear="getname(5)" @change="getDataInfoDown(2,$event)">
                <el-option v-for="item in classifyList":key="item.cla_id":label="item.cla_name":value="item.cla_id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称:"class="sd-form-item"prop="goo_id">
              <el-select v-model="addClaNum.goo_id"class filterable clearable @clear="getname(6)"  @change="getDataInfoDown(3,$event)" @click.native="getSelect(5)" >
                <el-option v-for="item in goodsList":key="item.goo_id":label="item.goo_name":value="item.goo_id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="水果套袋:"class="sd-form-item"prop="acl_id">
              <el-input value="水果种植套袋" style='width:200px' disabled/>
            </el-form-item>
            <el-form-item label="农资名称:"class="sd-form-item"prop="agr_id">
              <el-select v-model="addClaNum.agr_id"class filterable clearable @click.native="getSelect(6)">
                <el-option v-for="item in agricsList":key="item.agr_id":label="item.agr_name":value="item.agr_id"/>
              </el-select>
            </el-form-item>
             <el-form-item label="生产周期"prop="day" >
              <el-input v-model="addClaNum.day" style='width:200px'/>天
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer">
          <el-button @click="cancleNum('addClaNum')">取 消</el-button>
          <el-button type="primary"@click="addNumBtn('addClaNum')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <input id="submit" type="submit" name="submit" style="display:none;" @click="submitVideo($event)"/>
    <input id="videoForm" type="file" name="video" style="display:none;" @change="changeImg($event)"/>
    <input id="upFile" type="file" style="display:none;" @change="changeImg($event)" />
    <applyCode  v-bind="passParam"  @listerToChild="showList()" v-if="senThiscode"/>
  </div>
</template>
<script>
import {getProdutInfo,seedlManage,editSeedlManage,searchAgricul,addAgricul,getOutInfo,addOutInfo,operList,harvestList,exprotPop,delOperecord,startPro,suspendPro,endPro,editEstOutput,editReap,editSeeding,reportLoss,editLoss,hideThisRec,showThisRec,getLevel,getStack,addStack,addAgrtasks,saveAgrtasks,searNewInfo,addNewInfo,searchUp,searchDown,searNursery,getLevelInfo, searchKc ,editAgrtasks,editNewInfo ,editAgricul ,getEditLoss, editOutInfo, getEditOutInfo,recoverPro,getNumber,addProdut,delProdut} from '@/api/ProductManage'
import { errorStatus ,parseTime } from '@/utils/index'
import {
  imgUp,
  videoUp,
  searInfo
} from "@/api/trace";
import applyCode  from './applyCode'
import {personal} from '@/api/system'
import { mapGetters } from 'vuex'
import { getToken } from "@/utils/auth";
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'; // 局部注册
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'; //标记 点
export default {
  name: 'Account',
  components: { applyCode },
  props: {
    //产区列表进入
    baseId: {//果园id
      type: Number,
      required: false
    },
    farId: {//农户id
      type: Number,
      required: false
    },
    proNum :{
      type: String,
      required: false
    },
    priId:{
      type: Number,
      required: false
    }
  },
  data() {
    return {
      numdata:true,//生产编号是否默认选中
      proId:'',//生产编号id
      addClaNum:{
        cla_id:'',
        goo_id:'',
        day:'',
        pro_id:''
      },
      showAddNum:false,//新增生产编号
      LocationCity:"正在定位",
      timrDate:'',
      checktemList:[],
      checkoffList:[],
      surplusNum:'',//损耗报备可消耗产值量
      edit:false,
      susDisabled:false,//暂停生产时操作记录所有按钮除删除以外都禁用
      addOneAgric:[],
      addThisAgric:[],
      addInfoAgric:[],
      senThiscode:false,
      checked:true,
      thisSeeding:true,
      exportUrl:'',
      activeName:'opraRecord',
      sendCode:false,//table右上角发码还是新增
      disabled:false,
      opraRec:false,
      existConsum:false,//存在消耗农资
      formList: [],
      tagTitle:'',
      edit: false,
      showseedling:false,
      estimShow:false,
      harvShow:false,
      addShow:false,
      agriShow:false,
      gradeShow:false,
      agriOneShow:false,
      operaList:{
        pop_time:'',
        pop_content:'',
        pop_admname:'',
        pop_state:'',
        pop_function:'',
        pop_admacc:''
      },
      reapList:{
        por_time:'',
        por_state:'',
        por_time:'',
        por_number:'',
        por_content:'',
        por_admname:''
      },
      rules: {
        dis_name: [],
        dis_number:[],
        dis_state: [],
        far_id: [],
        reg_type: [],
        reg_id: []
      },
      yzList:[],
      zmList:[],
      rolesType: null,

      operstate: [
        { id: 0, name: '全部' },
        { id: 1, name: '显示' },
        { id: 2, name: '隐藏' },

      ],
      functionList:[
        { popid: 0, popname: '全部' },
        { popid: 1, popname: '新增信息' },
        { popid: 4, popname: '农事任务' },
      ],
      typelist2:[
        { id: 1, name: '耕地大田' },
        { id: 2, name: '圈舍牧区' },
        { id: 3, name: '鱼池水塘' },
        { id: 4, name: '果园林区' },
        { id: 5, name: '温室大棚' }
      ],
      numId:'',
      numList:[],
      rolesType:1,//新增生产编号信息--农户
      goodsType:1,//新增生产编号信息--商品
      regionList:[],
      farmerList:[],//新增生产编号信息--农户列表
      baseList:[],//新增生产编号信息--果园列表
      classifyList:[],//新增生产编号信息--品类列表
      goodsList:[],//新增生产编号信息--商品列表
      categList:[],//新增生产编号信息--农资品类列表
      agricsList:[],//新增生产编号信息--农资列表
      productList:[],
      agriList:[],
      offList:[],
      tempList:[],
      opeList: [],
      tagList:[],
      modeList:[],
      infoseaList:[],
      downAlList:[],
      list:[],
      currentPage: 1,
      pageSize: null,
      totalNum: null,
      relist:[],
      currentRePage: 1,
      pageReSize: null,
      totalReNum: null,
      worklist:[],
      showAddClas: false,
      showTime:false,
      showRecord:false,
      addClaThis:{
        fla_id:'',
        tem_id:'',
        fom_id:''
      },
      addSeed:{
        pro_id:'',
        stock_id: '',
        stock_num:'',
        project_id:'',
        project_num:'',
        lor_lossnum:'',
        lor_case:''
      },
      addAgric:{
        task_id:'',
        info_id:'',
      },
      tem_person:[],
      off_person:[],
      addharv:{
        reap_num:'',
        one_num:0,
        two_num:0,
        three_num:0,
        goo_name:'',
        dis_id:'',
      },
      rulesCla: {
        
      },
      addCla: {
        dis_unit:null,
        dis_id: null,
        dis_regid:null,
        dis_name:null,
        restarea:0
      },
      totalAll:'',
      addEstim:{
        acl_id:'',
        agr_id:'',
        estimate:'',
        pro_number:'',
        goo_name:'',
        cla_name:'',
        agr_kc:''
      },
      downInfoList:{
        video:'',
        img:'',
        name:'',
        alllist:false,
        total:'',
        show: 1,
        type: 1,
        disableIpt: true,
        placeh: '普通文本，字数限制30',
        showText: '文本',
        showBtn: false,
        number:null,
        matertype:''
      },
      img: {
        showImg: false,
        imgUrl: ''
      },
      video: {
        showImg: false,
        imgUrl: ''
      },
      addGrade:{
        por_count:'',
        por_one:'',
        por_two:'',
        por_three:'',
        por_id:'',
        goo_name:''
      },
      baseurl: process.env.BASE_API,
      api: '/api/formwork/videoform',
      deldis_id:'',
      dialogTit: '苗木管理',
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
        dis_state: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
      showNPwd: false,
      popId:'',//编辑用到的操作记录ID
      adm_acc:'',
      passParam:{},
      btnShow:{},
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.operaList.pop_time;
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
          let beginDateVal = this.reapList.por_time;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      },
      detailShow:false,//显示操作列表内容详情
      farmDynamics:[],//操作列表内容
      opetion1: [],
      opetion2: [],
      opetion3: [],
      opetion4: [],
      opetion5: [],
    }
  },
   computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'device', 'infor'])
  },
  beforeCreate(){

  },
  created() {
    // 页面加载时
    this.getNum()
  },
  methods: {
    getNum(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const num={}
      num.base_id=this.baseId
        getNumber(num)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.numList = dataRep.data
              if(this.numList.length!==0){
                this.numdata=true
                this.proId=this.numList[0].pro_id
                this.city() 
                this.getPageInfo();
                this.getAricMange()
                this.getOpreaInfo()
                this.getAddInfo(1)
                this.operaList.pop_function = this.functionList[0].popname
                this.operaList.pop_state = this.operstate[0].name
              }else{
                this.btnShow={}
                this.numdata=false
              }
            }
        })
        .catch(Error => {
          this.$message.error('请求失败!')
        })
    },
    searchInfo(ty, id) {
      this.opetion1= [];
      this.opetion2= [];
      this.opetion3= [];
      this.opetion4= [];
      this.opetion5= [];
      const search = {};
      search.type = ty;
      if (ty == 1) {
        search.rep_type = id;
      }
      if (ty == 2) {
        search.acl_id = id;
      }
      if (ty == 3) {
        search.dla_id = id;
      }
      if (ty == 4) {
        search.sec_id = id;
      }
      if (ty == 5) {
        search.cla_id = id;
      }
      searInfo(search)
      .then(res => {
        if(errorStatus(res.data)){
          let ds = res.data.data
          if(ty == 1){
            this.opetion1= ds; 
          }else if(ty == 2){
            this.opetion5 = ds;
          }else if(ty == 3){
            this.opetion3 = ds;
          }else if(ty == 4){
            this.opetion2 = ds;
          }else if(ty == 5){
            this.opetion4 = ds;
            console.log(this.opetion4)
          }
        }
      })
    },
    changgeThisNum(e){
      this.numdata=true
      this.proId=e
      this.city() 
      this.getPageInfo();
      this.getAricMange()
      this.getOpreaInfo()
      this.getAddInfo(1)
      this.operaList.pop_function = this.functionList[0].popname
      this.operaList.pop_state = this.operstate[0].name
    },
    getPageInfo() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
     
      const data = {};
      data.pri_id=this.priId

      data.pro_id = this.proId
      getProdutInfo(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.formList = dataRep.data.left
            this.formList.content=dataRep.data.right
            this.tagTitle=this.formList.pro_number
            this.surplusNum=dataRep.data.left.continue
            this.adm_acc = this.formList.adm_name

            if(this.formList.pro_state===3 || this.formList.pro_state===1 || this.formList.pro_state===4 ){//暂停生产或者筹备中全部按钮置灰
               this.susDisabled='disabled'
            }else{
              this.susDisabled=false
            }
            const btnList = dataRep.data.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {

              if(btnList[i].pri_funname === '苗木管理'){
                this.$set(this.btnShow, 'seedBtn', true)
              } else if (btnList[i].pri_funname === '预估产量') {
                this.$set(this.btnShow, 'estimBtn', true)
              } else if (btnList[i].pri_funname === '损耗报备') {
                this.$set(this.btnShow, 'lossBtn', true)
              } else if (btnList[i].pri_funname === '收获产物') {
                this.$set(this.btnShow, 'harvBtn', true)
              } else if (btnList[i].pri_funname === '操作记录') {
                this.$set(this.btnShow, 'operaBtn', true)
              } else if (btnList[i].pri_funname === '收获记录') {
                this.$set(this.btnShow, 'receiBtn', true)
              } else if (btnList[i].pri_funname === '导出') {
                this.$set(this.btnShow, 'exportBtn', true)
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(this.btnShow, 'delBtn', true)
              } else if (btnList[i].pri_funname === '新增信息') {
                this.$set(this.btnShow, 'addBtn', true)
              } else if (btnList[i].pri_funname === '开始生产') {
                this.$set(this.btnShow, 'beginBtn', true)
              } else if (btnList[i].pri_funname === '暂停生产') {
                this.$set(this.btnShow, 'subsendBtn', true)
              } else if (btnList[i].pri_funname === '结束生产') {
                this.$set(this.btnShow, 'overBtn', true)
              } else if (btnList[i].pri_funname === '编辑预估产量') {
                this.$set(this.btnShow, 'editEsitBtn', true)
              } else if (btnList[i].pri_funname === '编辑收获产物') {
                this.$set(this.btnShow, 'editHarvBtn', true)
              } else if (btnList[i].pri_funname === '编辑损耗报备') {
                this.$set(this.btnShow, 'editLossBtn', true)
              }else if (btnList[i].pri_funname === '编辑苗木管理') {
                this.$set(this.btnShow, 'editSeedBtn', true)
              } else if (btnList[i].pri_funname === '隐藏') {
                this.$set(this.btnShow, 'hideBtn', true)
              } else if (btnList[i].pri_funname === '显示') {
                this.$set(this.btnShow, 'showBtn', true)
              } else if (btnList[i].pri_funname === '农事任务') {
                this.$set(this.btnShow, 'agriBtn', true)
              } else if (btnList[i].pri_funname === '编辑农事任务') {
                this.$set(this.btnShow, 'editAgriBtn', true)
              } else if (btnList[i].pri_funname === '品级') {
                this.$set(this.btnShow, 'levelBtn', true)
              }else if (btnList[i].pri_funname === '恢复生产') {
                this.$set(this.btnShow, 'recovBtn', true)
              }else if (btnList[i].pri_funname === '编辑新增信息') {
                this.$set(this.btnShow, 'editAddBtn', true)
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
    city(){    //定义获取城市方法

      console.log(this.$route.meta)
        const geolocation = new BMap.Geolocation();
        var _this = this
        geolocation.getCurrentPosition(function getinfo(position){
            let city = position.address.city;             //获取城市信息
            let province = position.address.province;    //获取省份信息
            _this.LocationCity = city
        }, function(e) {
            _this.LocationCity = "定位失败"
        }, {provider: 'baidu'});  

    },
    //操作列表,收获列表
    getOpreaInfo(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.page = this.currentPage
      data.pop_proid=this.proId
      operList(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.opeList = dataRep.data
            this.currentPage = dataRep.current_page
            this.pageSize = dataRep.current_number
            this.totalNum = dataRep.total
          }
          loading.close()
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
       const search = {}
      search.por_proid=this.proId
      harvestList(search)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {

            this.relist = dataRep.data
            this.currentRePage = dataRep.current_page
            this.pageReSize= dataRep.current_number
            this.totalReNum = dataRep.total
          }
          loading.close()
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
          console.log('请求失败--', Error)
        })
    },
    //操作列表的内容查看详情
    seedetails(row,type){
      this.farmDynamics=eval(row)
      this.detailShow=true
      if(type===4){
        this.dialogTit='农事任务'
      }
      if(type===1){
        this.dialogTit='新增信息'
      }
    },
    //预估产量获取信息,农事任务获取
    getAricMange(){
      const data={}
      data.pro_id=this.proId
      searchAgricul(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
              this.addEstim=dataRep.data
              // this.addEstim.pro_number=dataRep.data.pro_number
              // this.addEstim.goo_name=dataRep.data.goo_name
              // this.addEstim.cla_name=dataRep.data.cla_name
              // this.addEstim.acl_name=dataRep.data.acl_name
              // this.addEstim.estimate=dataRep.data.estimate
              this.agriList=dataRep.data.agr_info
              this.addEstim.agr_kc=dataRep.data.agr_kc
              if( this.addEstim.agr_kc===0){
                this.addEstim.agr_id=dataRep.data.agr_name
              }else{
                for(var i in this.agriList){
                  if(dataRep.data.agr_id === this.agriList[i].agr_id){
                    this.addEstim.agr_id=this.agriList[i].agr_id
                  }
                }
              }
            }
              // for(var i in this.agriList){
              //   if(dataRep.data.agr_id === this.agriList[i].agr_id){
              //     this.addEstim.agr_id=this.agriList[i].agr_id
              //   }else{

              //     this.addEstim.agr_id=dataRep.data.agr_name
              //   }
              // }
              // this.addEstim.agr_id=dataRep.data.agr_name
              
          
        })
        .catch(err => {
          this.$message.error('请求失败!')
          console.log('获取列表err', err)
        })
      getStack(data)
        .then(response => {
           const dataRep = response.data
          if (errorStatus(dataRep)) {
           this.addAgric=dataRep.data
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
    //切换table
    handleClick(tab, event) {
       if(tab.name === 'harvestRecord'){
         this.sendCode =true
       }else if(tab.name === 'opraRecord'){
         this.sendCode =false
       }
    },
    startProd(){
      const data={}
      data.pro_id=Number(this.proId)
      if(this.formList.pro_state === 1){  
        this.$confirm('您确认要开始生产'+this.formList.goo_name+'?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            startPro(data)
            .then(response => {
               const dataRep = response.data
              if (errorStatus(dataRep)) {
                this.$message.success(dataRep.data)
                this.getPageInfo()
                this.susDisabled=false
                this.getOpreaInfo()
              }
            })
            .catch(Error => {
              this.$message.error('请求失败')
            })
          })
      }else if(this.formList.pro_state === 4 ){  
        startPro(data)
          .then(response => {
             const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.$message.success(dataRep.data)
              this.getPageInfo()
              this.getOpreaInfo()
              this.susDisabled='disabled'
            }
          })
          .catch(Error => {
            this.$message.error('请求失败')
          })
      }
    },
    endProd(){
      const data={}
      data.pro_id=this.proId
      endPro(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.$message.success(dataRep.data)
            this.getPageInfo()
            this.getOpreaInfo()
            this.susDisabled=false
            // this.$emit('listerToChild', 'addPage')

          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
    suspProd(){
      const data={}
      data.pro_id=this.proId
      if(this.formList.pro_state === 2){  
          suspendPro(data)
          .then(response => {
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.$message.success(dataRep.data)
              this.getPageInfo()
              this.getOpreaInfo()
              this.susDisabled='disabled'
            }
          })
          .catch(Error => {
            this.$message.error('请求失败')
          })
      }else if(this.formList.pro_state === 3){  
        recoverPro(data)
          .then(response => {
               const dataRep = response.data
              if (errorStatus(dataRep)) {
                this.$message.success('恢复生产成功!')
                this.getPageInfo()
                this.getOpreaInfo()
                this.susDisabled=false
              }
            })
          .catch(Error => {
              this.$message.error('请求失败')
          })
      } 
    },
    recovProd(){
      this.suspendBut=false
    },
    //苗木管理信息
    addSeedling(popList){
      this.dialogTit = '苗木管理'
      this.showseedling=true
      
      this.askList(popList)
    },
    //损耗报备
    viewJob(){
      this.showseedling=true
      this.dialogTit = '损耗报备'
      this.thisSeeding=false
    },
    //获取苗木管理下拉列表
    askList(popList){
      const data = {}
      searNursery(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
              this.zmList=dataRep.data.stock
              this.yzList=dataRep.data.project
              if(this.edit ){
                this.addSeed.project_id=popList.project_id
                this.addSeed.project_num=popList.project_num
                this.addSeed.stock_id=popList.stock_id
                this.addSeed.stock_num=popList.stock_num
              }
            }
        })
        .catch(err => {
          this.$message.error('请求失败!')
          console.log('获取列表err', err)
        })
    },
    // 添加--苗木
    addSeedBtn(formName){
      const data=this.addSeed
      delete this.addSeed.lor_lossnum
      delete this.addSeed.lor_case
      if (this.addSeed.stock_id === '') {
        this.$message.error('请选择砧木类型')
        return false
      }
      if (this.addSeed.stock_num === '') {
        this.$message.error('请输入砧木数量')
        return false
      }
      if (this.addSeed.project_id === '') {
        this.$message.error('请选择芽枝类型:')
        return false
      }
      if (this.addSeed.project_num === '') {
        this.$message.error('请输入芽枝数量:')
        return false
      }
      data.stock_num=Number(this.addSeed.stock_num)
      data.project_num=Number(this.addSeed.project_num)
      data.pro_id=this.proId
      if(this.edit){
        data.pop_id=this.popId
        editSeedlManage(data)
          .then(res => {
            if (errorStatus(res.data)) {
              this.getPageInfo()
              this.getOpreaInfo()
              this.$message.success('苗木信息编辑成功!')
              this.$refs[formName].resetFields()
              this.showseedling = false
              this.edit=false
              this.popId=''
              this.addSeed.project_id=''
              this.addSeed.stock_id=''
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      }else{
        seedlManage(data)
          .then(res => {
            if (errorStatus(res.data)) {
              this.getPageInfo()
              this.getOpreaInfo()
              this.$message.success('苗木信息增加成功!')
              this.$refs[formName].resetFields()
              this.showseedling = false
              this.addSeed.project_id=''
              this.addSeed.stock_id=''
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
        }
    },
    //提交损耗报备
    addlossBtn(formName){
      const data={}
      if (this.addSeed.lor_lossnum === '') {
        this.$message.error('请输入损耗量')
        return false
      }
      if (this.addSeed.lor_case === '') {
        this.$message.error('请输入原因说明')
        return false
      }
      data.loss=Number(this.addSeed.lor_lossnum)
      data.case=this.addSeed.lor_case
      data.goo_id=this.formList.goo_id
      data.cla_id=this.formList.cla_id
      data.pro_id=this.proId
      if(this.edit){
        delete data.goo_id
        delete data.cla_id
        data.pop_id=this.popId
         editLoss(data)
          .then(res => {
            if (errorStatus(res.data)) {
              this.getPageInfo()
              this.$message.success('损耗报备编辑成功!')
              this.addSeed.lor_case=''
              this.addSeed.lor_lossnum=''
              this.edit=false
              this.showseedling = false
              this.getOpreaInfo()
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      }else{
        reportLoss(data)
          .then(res => {
            if (errorStatus(res.data)) {
              this.getPageInfo()
              this.$message.success('损耗报备成功!')
              this.addSeed.lor_case=''
              this.addSeed.lor_lossnum=''
              this.showseedling = false
              this.getOpreaInfo()
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      }
    
    },
    //搜索库存
    changeAgri(e){
      for(var i in this.agriList){
        if(e=== this.agriList[i].agr_id){
          this.addEstim.agr_kc= this.agriList[i].agr_kc
        }
      }
    },
    //预估产量
    estimOutput(){
      this.estimShow=true
      this.dialogTit = '预估产量'
      
    },
    //预估产量--提交
    addEstBtn(formName){
      const data={}
      var estimate=this.addEstim.estimate
      if(!estimate){
        this.$message.error('预估产量不能为空!')
        return
      }else if(isNaN(estimate)){
        this.$message.error('预估产量只能输入数字!')
        return
      }else if(Number(estimate) >this.addEstim.agr_kc){
         this.$message.error('预估产量不能大于套袋库存数量!')
        return
      }
      data.far_id=this.formList.far_id
      data.pro_id =this.proId
      data.acl_id=11
      data.agr_id=this.addEstim.agr_id
      data.estimate=this.addEstim.estimate
      if(this.edit){
        data.pop_id=this.popId
        editAgricul(data)
          .then(res => {
            if (errorStatus(res.data)) {
              this.getPageInfo()
              this.$message.success(res.data.data)
              this.addEstim.estimate=''
              this.addEstim.agr_id=''
              this.getAricMange()
              this.estimShow = false
              this.getOpreaInfo()
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      }else{
        addAgricul(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.getPageInfo()
            this.$message.success(res.data.data)
            this.addEstim.estimate=''
            this.addEstim.agr_id=''
            this.getAricMange()
            this.estimShow = false
            this.getOpreaInfo()
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
      }
      
    },
    //收获产物
    addHarvest(){
      this.harvShow =true
      this.dialogTit = '收获产物'
      this.addharv=this.formList
      this.getAddharv()
    },
    //勾选收获产物人员
    checkedTem(type){
      if(type===1){
        console.log(this.tem_person,'tem')
      }
      if(type===2){
        console.log(this.off_person,'off')
      }
    },
    //提交收获产物
    addHarvBtn(){
      const data={}
      data.pro_id=this.proId
      data.reap_num=this.addharv.reap_num
      data.one_num=this.addharv.one_num
      data.two_num  =this.addharv.two_num 
      data.three_num  =this.addharv.three_num 
      data.goo_name=this.addharv.goo_name
      data.dis_id  =this.addharv.dis_id 
      data.off_person=this.off_person
      data.tem_person=this.tem_person
      if(!data.reap_num || data.reap_num===''){
        this.$message.error(' 请输入收获数量!') 
        return
      }
      if(isNaN(data.reap_num)){
        this.$message.error(' 收获数量只能输入数字!') 
        return
      }
      if(!data.one_num || data.one_num===''){
        data.one_num=0;
      }
      if(isNaN(data.one_num)){
        this.$message.error(' 一级品数量只能输入数字!') 
        return
      }
      if(!data.two_num || data.two_num===''){
       data.two_num=0;
      }
      if(isNaN(data.two_num)){
        this.$message.error(' 二级品数量只能输入数字!') 
        return
      }
      if(!data.three_num || data.three_num===''){
         data.three_num=0;
      }
      if(isNaN(data.three_num)){
        this.$message.error(' 三级品数量只能输入数字!') 
        return
      }
      if( (Number(data.one_num) + Number(data.two_num)
           + Number(data.three_num)) > Number(data.reap_num)){
        this.$message.error(' 各个品级相加总数不得大于收获数量!') 
        return
      }
      // if(data.tem_person.length===0 || data.off_person.length===0){
      //   this.$message.error('请选择员工或临时工!') 
      //   return
      // }
      if(this.edit){
        data.pop_id=this.popId
        editOutInfo(data).
          then(res=>{
            if(errorStatus(res.data)){
              this.harvShow =false
              this.$message.success(res.data.data)
              this.getOpreaInfo()
              this.tem_person=[]
              this.off_person=[]
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      }else{
        addOutInfo(data).
          then(res=>{
            if(errorStatus(res.data)){
              this.harvShow =false
              this.$message.success(res.data.data)
              this.getOpreaInfo()
              this.tem_person=[]
              this.off_person=[]
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      }
      

    },
    getAddharv(scope){
      const data={}
      data.pro_id=this.proId
      getOutInfo(data)
        .then(res => {
          if (errorStatus(res.data)) {
              this.addharv=res.data.data
              this.offList=res.data.data.off
              this.tempList=res.data.data.tem  
              if(this.edit){
                this.addharv.reap_num=scope.por_count
                this.addharv.one_num=scope.por_one
                this.addharv.two_num=scope.por_two
                this.addharv.three_num=scope.por_three
                this.tem_person=eval(scope.por_tem)
                this.off_person=eval(scope.por_off) 
              }
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
    //操作记录-新增
    addBtn(){
      this.dialogTit='新增'
      this.addShow =true
    },
    changeTag(e){
   
      this.getAddInfo(2,e)
      this.addClaThis.fom_id=''
      this.addClaThis.tem_id=''
    },
    changeModel(e){
      this.getAddInfo(3,e)
      this.addClaThis.tem_id=''
      this.$forceUpdate()
    },
    //搜索模板信息
    changeInfo(e){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      for(var j in this.downAlList){
        if(e === this.downAlList[j].tem_id){
          this.infoseaList =this.downAlList[j]
            for(var i in this.infoseaList){
            this.downInfoList= eval(this.infoseaList.tem_content)
            const goDet =  eval(this.infoseaList.tem_content)
            for (const j in goDet) {
              if (goDet[j].type === 15 && goDet[j].key.type===1) {
                  this.searchTotal(goDet[j].value.n_id,j)
                  this.existConsum=true
              }
              if (Number(goDet[j].type) === 11) {
                this.searchInfo(1, goDet[j].key.id);
              }
              if (Number(goDet[j].type) === 12) {
                this.searchInfo(4, goDet[j].key.id);
              }
              if (Number(goDet[j].type) === 13) {
                this.searchInfo(3, goDet[j].key.id);
              }
              if (Number(goDet[j].type) === 14) {
                this.searchInfo(5, goDet[j].key.id);
              }
              if (Number(goDet[j].type) === 15) {
                this.searchInfo(2, goDet[j].key.id);
              }
            }
          }
        }
       }
       setTimeout(()=>{
         loading.close()
       },1500)
    },
    getSelect(listType){
     if(listType === 1){
      if(!this.addClaThis.fla_id){
        this.$message.error('请先选择标签名称')
      }
     }
     if(listType === 2){
      if(!this.addClaThis.fom_id){
        this.$message.error('请先选择模板名称')
      }
     }
     if(listType === 3){
      if(this.addClaNum.far_id==='' || !this.addClaNum.far_id){
        this.$message.error('请先选择负责人姓名')
      }
     }
     if(listType === 5){
      if(this.addClaNum.cla_id==='' || !this.addClaNum.cla_id){
        this.$message.error('请先选择商品分类')
      }
     }
     if(listType === 6){
      if(this.addClaNum.goo_id==='' || !this.addClaNum.goo_id){
        this.$message.error('请先选择商品名称')
      }
     }
    },
    //新增生产编号提交
    addNumBtn(formName){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const that = this
      const data = that.addClaNum
      data.far_id=this.farId
      data.base_id=this.baseId
      addProdut(data)
        .then(res => {
          loading.close()
          if (errorStatus(res.data)) {
            this.getNum()
            // that.getPageInfo()
            that.$message.success('生产信息增加成功!')
            that.showAddNum = false
            this.$refs[formName].resetFields()
          }
        })
        .catch(err => {
          loading.close()
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        }) 
    },
    //新增信息获取
    getAddInfo(type,id,ownId){
      const data={}
      if(type===2){
        data.fla_id=id
      }
      if(type===3){
        data.fom_id=id
      } 
      data.type=type
      searNewInfo(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
              if(type===1){
                this.tagList=dataRep.data         
                if(this.edit){
                  for(var i in this.tagList){
                    if(Number(ownId)===this.tagList[i].fla_id){
                       this.addClaThis.fla_id =this.tagList[i].fla_id
                    }
                  }
                  // this.addClaThis.fla_id =  ownId//标签id   
                }
              }
              if(type===2){
                this.modeList=dataRep.data
                 if(this.edit){
                  for(var i in this.modeList){
                    if(Number(ownId)===this.modeList[i].fom_id){
                       this.addClaThis.fom_id =this.modeList[i].fom_id
                    }
                  }
                }
              }
              if(type===3){
                this.downAlList=dataRep.data
                for(var i in this.downAlList){
                    if(Number(ownId)===this.downAlList[i].tem_id){
                       this.addClaThis.tem_id =this.downAlList[i].tem_id
                    }
                  }
              }
            }
        })
        .catch(err => {
          this.$message.error('请求失败!')
        })
    },
    //搜索库存量
    searchTotal(id,index){
      const data={}
      data.agr_id=id
      data.far_id=this.formList.far_id
      searchKc(data)
        .then(res => {
          if (errorStatus(res.data)){
            // this.totalAll=res.data.data
            if(this.agriOneShow === true){
              this.$set(this.addOneAgric[index].value, 'totalAll', res.data.data)
            }
            else{
              this.$set(this.downInfoList[index].value, 'totalAll', res.data.data)
            }          
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })
    },
    // 查看图片
    lookImg(index) {
      var upImgVideo,url
      if(this.detailShow){ 
         url = this.farmDynamics[index].value
        upImgVideo  = Number(this.farmDynamics[index].type)
      }else{
         url = this.downInfoList[index].value
        upImgVideo = Number(this.downInfoList[index].type)
      }
      
      this.gosDetInp = index
      let str;
      if(url.indexOf('storage') != -1){
        str = this.baseurl.replace('public', '')
      }else{
        str = this.baseurl.replace('public', 'public/')
      }
      
      if(this.edit ===true){
        if (upImgVideo === 5) {
          this.img.imgUrl = str + url
          this.img.showImg = true
        } else if (upImgVideo === 6) { 
          this.video.imgUrl = str + url
          this.video.showImg = true
        }
      }else{
        if (upImgVideo === 5) {
          this.img.imgUrl = str + url
          this.img.showImg = true
        } else if (upImgVideo === 6) {
          this.video.imgUrl = str + url
          this.video.showImg = true
        }
      }
    },
        // 查看图片
    lookthisImg(index) {
      const upImgVideo = Number(this.addOneAgric[index].type)
      this.gosDetInp = index    
      const url = this.addOneAgric[index].value
        const str = this.baseurl.replace('public', '')
        if (upImgVideo === 5) {
          this.img.imgUrl = str + url
          this.img.showImg = true
        } else if (upImgVideo === 6) {
          this.video.imgUrl = str + url
          this.video.showImg = true
        }
    },
    //新增--提交
    addClaBtn(formName){
      const data = {}
      data.fla_id=this.addClaThis.fla_id
      data.fom_id=this.addClaThis.fom_id
      data.tem_id=this.addClaThis.tem_id
      data.far_id=this.formList.far_id
      for(var k in this.downAlList){
        if(this.addClaThis.tem_id === this.downAlList[k].tem_id){
          data.tem_title=this.downAlList[k].tem_title
        }
      }
      data.pro_id=this.proId
      if(data.fla_id == '' || !data.fla_id){
         this.$message.error('请选择模板名称!')
         return false
      } 
      if(data.fom_id == '' || !data.fom_id){
         this.$message.error('请选择模板名称!')
         return false
      } 
      if(data.tem_id == '' || !data.tem_id){
         this.$message.error('请选择信息名称!')
         return false
      } 
      const downInfoList = this.downInfoList
      const info_name = []
      const info_content = []
      const info_show = []
      const info_type = []
      const allkey=[]
      const allValue=[]
      var selname=null
      var seltype=null
      var selid = null 
      var infoname=null
      var nextid=null
      var nextname=null
      var number=null
      data.tem_content=downInfoList
      for (const i in downInfoList) {
        // console.log(downInfoList[i],'--=-=')
        if(Number(downInfoList[i].type) === 8){
          data.tem_content[i].value=this.LocationCity
        }
        if(Number(downInfoList[i].type) === 7){
          var date = new Date() // 获取系统当前时
          this.timrDate = parseTime(date)
          downInfoList[i].value=this.timrDate
        }
        if(Number(downInfoList[i].type) === 10){
          downInfoList[i].value=this.adm_acc
        }
        if(Number(downInfoList[i].type) === 15 && downInfoList[i].value.type === 1 &&  downInfoList[i].show === 1){
          delete data.tem_content[i].value.totalAll
          if (downInfoList[i].value.number === '' || !downInfoList[i].value.number) {
            this.$message.error('请输入实际消耗农资数量!')
            return false
          }
          if (Number(downInfoList[i].value.number) > Number(downInfoList[i].value.totalAll) ){
            this.$message.error('实际消耗农资数量不得大于库存量!')
            return 
          } 
        }
      }
      if(this.edit){
        data.pop_id=this.popId
        editNewInfo(data)
          .then(res => {
            if (errorStatus(res.data)) {
              this.addShow=false
              this.existConsum =false
              this.getOpreaInfo()
              this.$refs[formName].resetFields()
              this.$message.success(res.data.data)
              this. addClaThis.fla_id=''
              this. addClaThis.tem_id=''
              this. addClaThis.fom_id=''
              this.downInfoList={}
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      }else{
        addNewInfo(data)
          .then(res => {
            if (errorStatus(res.data)) {
              this.addShow=false
              this.existConsum =false
              this.getOpreaInfo()
              this.$refs[formName].resetFields()
              this. addClaThis.fla_id=''
              this. addClaThis.tem_id=''
              this. addClaThis.fom_id=''
              this.downInfoList={}
              this.$message.success(res.data.data)
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
      }      
    },
    //删除-这个
    delBtn(row) {
      const data = {}
      // console.log('删除--', row)
      data.pro_id = this.proId
      data.pro_number = this.formList.pro_number
      data.pop_id = [row.pop_id]
      this.$confirm('请确认,是否删除该操作记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOperecord(data)
          .then(response => {
            // console.log('delAgriClass---', response)
            if (errorStatus(response.data)) {
              this.$message.success('删除成功!')
              this.getOpreaInfo()
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
        this.$message.error('请选择要删除的商品!')
      } else {
        const data = {}
        data.pro_id = this.proId
        data.pro_number = this.formList.pro_number
        data.pop_id = []
        for (const i in chosed) {
          data.pop_id.push(chosed[i].pop_id)
        }
        this.$confirm('请确认,是否删除所选中的操作记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delOperecord(data)
            .then(response => {
              if (errorStatus(response.data)) {
                this.currentPage = 1
                this.getOpreaInfo()
                this.$message.success('删除成功!')
              }
            })
            .catch(Error => {
              this.$message.error('请求失败')
            })
        })
      }
    },
    // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
    // 分页-操作列表
    handleCurrentChange(val) {
      this.currentPage = val

      if (this.serch_req) {
        this.searchList('operaList', val)
      } else {
        this.getOpreaInfo()
      }
    },
    // 分页-收获列表
    handleCurrentReChange(val){
      this.currentRePage = val
      if (this.serch_req) {
        this.searchReList('reapList', val)
      } else {
        this.getOpreaInfo()
      }
    },
    // 搜索-操作
    searchList(formName, page) {
      const search ={}
      search.pop_proid=this.proId
      search.pop_time=this.operaList.pop_time
      search.pop_admacc=this.operaList.pop_admacc
      search.pop_function=this.operaList.pop_function
      search.pop_content=this.operaList.pop_content
      search.pop_admname=this.operaList.pop_admname
      search.pop_state=this.operaList.pop_state
      if (search.pop_state === '全部' || search.pop_state === 0) {
        search.pop_state = ''
      }
      if (search.pop_function === '全部' || search.pop_function === 0) {
        search.pop_function = ''
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.page = page
      operList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.opeList = dataRep.data
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
    // 搜索-收获
    searchReList(formName, page) {
      const search ={}
      search.por_proid=this.proId
      search.por_state=this.reapList.por_state
      search.por_time=this.reapList.por_time
      search.por_number=this.reapList.por_number
      search.por_admname=this.reapList.por_admname
      if (search.por_state === '全部' || search.por_state === 0) {
        search.por_state = ''
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      search.page = page
      harvestList(search)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.relist = dataRep.data
            this.currentRePage = dataRep.current_page
            this.pageReSize= dataRep.current_number
            this.totalReNum = dataRep.total
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败')
        })
    },
    //农事任务获取信息
    agricTask(){
      this.agriShow=true
      this.dialogTit ='农事任务'
    },
    //发码
    addSendCode(){
        this.senThiscode=true
        this.passParam.senThiscode=this.senThiscode
        this.passParam.far_name=this.formList.far_name
        this.passParam.far_id=this.formList.far_id
        this.passParam.pro_id=this.proId
        this.passParam.base_name=this.formList.base_name
        this.passParam.base_id=this.formList.base_id
        this.passParam.pro_number=this.formList.pro_number
        this.passParam.cla_name=this.formList.cla_name
        this.passParam.goo_name=this.formList.goo_name
        this.passParam.pro_estimate=this.formList.pro_estimate
        this.passParam.pro_code=this.formList.pro_code
        this.passParam.goo_id=this.formList.goo_id
      
    },
    //品级
    getGrade(scope){
      this.gradeShow =true
      this.dialogTit ='品级'
      this.addGrade.por_count=scope.por_count
      this.addGrade.por_id=scope.por_id
      this.getThisLevel(this.addGrade.por_id)
    },
    //
    getThisLevel(por_id){
      const data ={}
      data.por_id=por_id
      getLevelInfo(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.addGrade.base_name=this.formList.base_name
            this.addGrade.far_name=this.formList.far_name
            this.addGrade.far_mobile=this.formList.far_mobile
            this.addGrade.pro_number=this.formList.pro_number
            this.addGrade.goo_name=this.formList.goo_name
            this.addGrade.por_number=dataRep.data.por_number
            this.addGrade.por_one=dataRep.data.por_one
            this.addGrade.por_two=dataRep.data.por_two
            this.addGrade.por_three=dataRep.data.por_three
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
    //提交品级
    addLevel(formName){
      const data={}
      data.por_id=this.addGrade.por_id
      data.por_number=Number(this.addGrade.por_count)
      data.por_one=Number(this.addGrade.por_one)
      data.por_two  =Number(this.addGrade.por_two )
      data.por_three  =Number(this.addGrade.por_three )
      data.goo_name  =this.addGrade.goo_name 
      if(!data.por_number || data.por_number===''){
        this.$message.error(' 请输入收获数量!') 
        return
      }
      if(isNaN(data.por_number)){
        this.$message.error(' 收获数量只能输入数字!') 
        return
      }
      if(!data.por_one || data.por_one===''){
        this.$message.error(' 请输入一级品数量!') 
        return
      }
      if(isNaN(data.por_one)){
        this.$message.error(' 一级品数量只能输入数字!') 
        return
      }
      if(!data.por_two || data.por_two===''){
        this.$message.error(' 请输入二级品数量!') 
        return
      }
      if(isNaN(data.por_two)){
        this.$message.error(' 二级品数量只能输入数字!') 
        return
      }
      if(!data.por_three || data.por_three===''){
        this.$message.error(' 请输入三级品数量!') 
        return
      }
      if(isNaN(data.por_three)){
        this.$message.error(' 三级品数量只能输入数字!') 
        return
      }
      if(( data.por_one + data.por_two
           + data.por_three) > data.por_number){
        this.$message.error(' 各个品级相加总数不得大于收获数量!') 
        return
      }
       getLevel(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.getOpreaInfo()
            this.$message.success(dataRep.data)
            this.gradeShow =false
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
    //导出
    exprotspop(){
      const url = process.env.BASE_API
      const baseUrl=url.replace('/public','/')
      if(this.sendCode === false){
        const data=this.operaList
        data.pop_proid=this.proId
        data.type=1
        if(data.pop_state == ''||data.pop_state === '全部'){
           data.pop_state=''
        }
        if(data.pop_function == ''||data.pop_function === '全部'){
           data.pop_function=''
        }
        exprotPop(data).
          then(response=>{
            if(errorStatus(response.data)){
              const str=response.data.data
              this.exportUrl=baseUrl+str
              // this.clickDowBtn()

              this.$message.success("导出请求成功")
              window.location.href = this.exportUrl
            }
        }).catch(Error=>{
          this.$message.error("导出请求失败")
        })
      }else if(this.sendCode === true){
         const dataReap=this.reapList
        if(dataReap.por_state == ''||dataReap.por_state === '全部'){
           dataReap.por_state=''
        }
        dataReap.por_proid=this.proId
        dataReap.type=2
        exprotPop(dataReap).then(response=>{
          if(errorStatus(response.data)){
            const str=response.data.data
            this.exportUrl=baseUrl+str
            // this.clickDowBtn()
            window.location.href = this.exportUrl
            this.$message.success("导出请求成功")
          }
        }).catch(Error=>{
          this.$message.error("导出请求失败")
        })
      }   
    },
    
    showList() {
      this.senThiscode = false
      this.getPageInfo();
      this.getAricMange()
      this.getOpreaInfo()
      this.getAddInfo(1)
      this.operaList.pop_function = this.functionList[0].popname
      this.operaList.pop_state = this.operstate[0].name
    },
    // 编辑按钮
    editOpreaRow(scope) {
      this.showAddClas = true
      this.edit = true
      this.popId=scope.pop_id
      const poplist={}
      poplist.pop_id=scope.pop_id
      poplist.pro_id=this.proId
      if(scope.pop_function === 1){
        console.log(scope,'scope,;;;;')
        this.dialogTit = '编辑新增信息'
        this.addShow =true
        this.edit = true
        this.getAddInfo(1,'',scope.pop_label)
        this.getAddInfo(2,scope.pop_label,scope.pop_form)
        this.getAddInfo(3,scope.pop_form,scope.pop_tem)
        this.downInfoList= eval(scope.pop_content)
        const goDet =  eval(scope.pop_content)
        for (const j in goDet) {
          if (goDet[j].type === 15 && goDet[j].key.type===1) {
              this.searchTotal(goDet[j].value.n_id,j)
              this.existConsum=true
          }
          if (Number(goDet[j].type) === 11) {
            this.searchInfo(1, goDet[j].key.id);
          }
          if (Number(goDet[j].type) === 12) {
            this.searchInfo(4, goDet[j].key.id);
          }
          if (Number(goDet[j].type) === 13) {
            this.searchInfo(3, goDet[j].key.id);
          }
          if (Number(goDet[j].type) === 14) {
            this.searchInfo(5, goDet[j].key.id);
          }
          if (Number(goDet[j].type) === 15) {
            this.searchInfo(2, goDet[j].key.id);
          }
        }
      }else if(scope.pop_function === 4){
        this.dialogTit = '编辑农事任务'
        this.getAgriEditInfo(scope.pop_id)
      }
    },

    //点击农事任务功能编辑前获取信息
    getAgriEditInfo(popId){
      const data ={}
      data.pop_id=popId
      editAgrtasks(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.agriOneShow=true
            this.addThisAgric.task_name=res.data.data.task_name
            this.addThisAgric.task_issue_time=res.data.data.task_issue_time
            this.addThisAgric.adm_name=res.data.data.task_adm_name
            this.addInfoAgric.template=res.data.data.pop_tem
            this.addInfoAgric.fom_temp=res.data.data.pop_tem
            this.addOneAgric=eval(res.data.data.pop_temp)
            for(var k in  this.addOneAgric){
              if(this.addOneAgric[k].type === 15 && this.addOneAgric[k].key.type===1){
                this.searchTotal(this.addOneAgric[k].value.n_id,k)
                this.existConsum=true
              }
            }
            
          }
        })
        .catch(err => {
          this.$message.error('请求失败!')
        })
    },
    //关闭农资详情管理
    addClathisForm(formName){
      this.agriOneShow=false
     this.existConsum =false
    },
    //关闭苗木管理
    addSeedClaForm(formName){
      this.showseedling = false
      this.thisSeeding = true
      this.$refs[formName].resetFields()
      this.addSeed.project_id=''
      this.addSeed.stock_id=''
      this.addSeed.stock_num=''
      this.addSeed.project_num=''
      this.edit=false
      this.popId=''
    },
    cancleNum(formName){
      this.showAddNum = false
      this.$refs[formName].resetFields()
    },
    //取消弹框
    addClaForm(formName) {
      this.addClaThis.fla_id=''
      this.addClaThis.tem_id=''
      this.addClaThis.fom_id=''
      this.downInfoList={}
      this.showAddClas = false
      this.thisSeeding = true 
      this.estimShow = false
      this.harvShow = false
      this.addShow = false
      this.agriShow = false
      this.gradeShow =false
      this.popId=''
      this.edit=false
      this.addEstim.estimate=''
      this.addEstim.agr_id=''
      this.tem_person=[]
      this.off_person=[]
      this.getAricMange()
      if (this.$refs[formName]) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
        })
        this.showTime = false
      }
    },
    // 添加-弹窗
    addGoodsBtn() { // 点击我的云仓添加按钮后的操作
      this.showAddNum = true
      this.dialogTit = '新增生产编号'
      // this.addCla.com_type=this.equiplist[0].id
      this.getDataInfoUp(this.rolesType)
      this.getDataInfoDown(this.goodsType)
    },
    delNumBtn(){
      const data={}
      data.pro_id=this.proId
      this.$confirm('请确认,是否删除该生产编号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProdut(data)
          .then(response => {
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.$message.success(dataRep.data) 
              this.proId=''    
              this.getNum() 
            }
          })
          .catch(Error => {
            this.$message.error('请求失败')
          })
      })
    },
    getDataInfoUp(rolesType,id){
      const search={}
      search.type=rolesType
      if(rolesType===2 && !id == ''){
         search.far_id=id  
         this.addCla.base_id=''
         this.baseList=[]
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
         this.agricsList=[];
         this.addClaNum.goo_id=''
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
            }
            if(goodsType===3){
              this.agricsList=dataRep.data
            }
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
        })
    },
    //关联清空
    getname(type){
      if(type===1){
         this.addCla.base_id=''
         this.baseList=[]
      }else if(type===5){
         this.addCla.goo_id=''
         this.goodsList=[]
      }else if(type===6){
         this.addCla.agr_id=''
         this.agricsList=[]
      }
    },
    // 单个--隐藏--显示
    enableThisClas(row, num) {
      const data = {}
      data.pop_id = [row.pop_id]
      if (num === 1) {
        // 显示
        showThisRec(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('显示成功!')
              row.pop_state = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      } else if (num === 2) {
        //  隐藏
        hideThisRec(data)
          .then(response => {
            if (errorStatus(response.data)) {
              this.$message.success('隐藏成功!')
              row.pop_state = num
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
          })
      }
    },
    //点击农事任务的信息
    agriThis(tempId,agrId){
      this.agriShow = false
      this.agriOneShow=true
      // this.agriShow = false
      for(var j in this.addAgric){
        if(agrId === this.addAgric[j].task_id){
          this.addThisAgric=this.addAgric[j]
          for(var i in this.addAgric[j].task_origin){
            if(Number(tempId)=== Number(this.addAgric[j].task_origin[i].fom_temp)){
              this.addInfoAgric=this.addAgric[j].task_origin[i]
              this.addOneAgric=this.addAgric[j].task_origin[i].content
            }
          }
        }
      }
      this.addOneAgric=eval(this.addOneAgric)
      console.log(this.addOneAgric,16)
        for(var k in  this.addOneAgric){
          if(this.addOneAgric[k].type === 15 && this.addOneAgric[k].key.type===1){
            this.searchTotal(this.addOneAgric[k].value.n_id,k)
            this.existConsum=true
          }
        }
        
    },

    addAgriClaBtn(){
      const data={}
      data.task_id=this.addThisAgric.task_id

      // data.info_id=this.addInfoAgric.fom_temp
      for(var i in this.addThisAgric.task_origin){
        if(this.addInfoAgric.fom_temp === this.addThisAgric.task_origin[i].fom_temp){
          data.info_id=Number(i)
        }
      
      }
      data.fom_temp =Number(this.addInfoAgric.fom_temp)
      data.pro_id=this.proId
      data.tem_name=this.addInfoAgric.template
      data.tem_content=this.addOneAgric
      data.far_id=this.formList.far_id
      // if(this.existConsum ===false){
      //    this.$message.error('没有可消耗农资,不可提交!')
      //     return false
      // }
      for(var i in this.addOneAgric){
        if(this.addOneAgric[i].type === 8){
            if(!this.edit){
              data.tem_content[i].value=this.LocationCity
            }
          }
          if(this.addOneAgric[i].type === 7){
            if(!this.edit){
              var date = new Date() // 获取系统当前时
              this.timrDate = parseTime(date)
              this.addOneAgric[i].value=this.timrDate
            }
          }
          if(this.addOneAgric[i].type === 10){
              this.addOneAgric[i].value=this.adm_acc
            }
        if(this.addOneAgric[i].type === 15 && this.addOneAgric[i].key.type===1){
          delete data.tem_content[i].value.totalAll
          if(this.addOneAgric[i].value.number === '' || !this.addOneAgric[i].value.number){
            this.$message.error('请输入实际消耗农资数量!')
            return false
        }
          if (Number(this.addOneAgric[i].value.number) > Number(this.addOneAgric[i].value.totalAll) ){
            this.$message.error('实际消耗农资数量不得大于库存量!')
            return false
          } 
        }
      }
      if(this.edit){
        data.pop_id=this.popId
        saveAgrtasks(data)
        .then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data)
            this.agriOneShow = false
            this.existConsum = false
            this.agriShow = false
            this.edit=false
            this.popId=''
            this.getOpreaInfo()
            this.getPageInfo()
            this.getAricMange()
          }
        })
        .catch(Error => {
          this.$message.error('请求失败!')
        }) 
      }else{
        addStack(data)
        .then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data)
            this.agriOneShow = false
            this.existConsum = false
            this.agriShow = false
            this.getOpreaInfo()
            this.getPageInfo()
            this.getAricMange()

          }
        })
        .catch(Error => {
          this.$message.error('请求失败!')
        }) 
      }
      

    },
// 触发上传事件--更换图片
  activeUpload() {
    var upImgVideo = null;
    let i1 = this.gosDetInp;
    upImgVideo = Number(this.downInfoList[i1].type);

    if (upImgVideo === 5) {
      document.getElementById("upFile").click();
    } else {
      document.getElementById("videoForm").click();
    }
  },
   // 上传产品信息下图片
    changeImg(e) {
      const _this = this;
      const index = _this.gosDetInp;
      const upImgVideo = Number(_this.downInfoList[index].type);
      // 利用fileReader对象获取file
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (upImgVideo === 5) {
        const path = e.target.files[0].type;
        const imgtype = path.toString().split("/");
        if (
          imgtype[1] != "png" &&
          imgtype[1] != "jpeg" &&
          imgtype[1] != "bmp" &&
          imgtype[1] != "jpg"
        ) {
          _this.$message.error(
            "图片格式不正确,仅支持上传png,jpeg,bmp,jpg格式的图片！"
          );
          return;
        }
        reader.onload = function(e) {
          // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
          var imgcode = e.target.result;
          const data = {};
          data.images = imgcode;

          data.oldimage = _this.downInfoList[index].value;
          imgUp(data).then(response => {
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              _this.downInfoList[index].value = dataRep.path
              let str;
              if(dataRep.path.indexOf('storage') != -1){
                str = _this.baseurl.replace('public', '')
              }else{
                str = _this.baseurl.replace('public', 'public/')
              }
              _this.img.imgUrl = str + dataRep.path
            }
          });
        };
      } else if (upImgVideo === 6) {
        document.getElementById("submit").click();
      }
    },
    // 上传视频
    submitVideo(e) {
      const _this = this;
      e.preventDefault(); // 取消默认行为
      const videoObj = document.getElementById("videoForm");
      const formData = new FormData();
      formData.append("video", videoObj.files[0]);
      formData.append("api_token", getToken());
      const index = _this.gosDetInp;
      videoUp(formData).then(response => {
        const dataRep = response.data;
        if (errorStatus(dataRep)) {
          const img_path = dataRep.videoSrc;
          _this.downInfoList[index].value = img_path
          let str;
          if(img_path.indexOf('storage') != -1){
            str = _this.baseurl.replace('public', '')
          }else{
            str = _this.baseurl.replace('public', 'public/')
          }
          _this.video.imgUrl = str + img_path         
        }
      });
    },
    backBtn(){
       this.$confirm('确定离开当前页面?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.$emit('listerToChild', 'addPage')
          })
     },
    resetForm(operaList) {
      for(let i in this.reapList){
        this.reapList[i] = ''
      }
      for(let i in this.operaList){
        this.operaList[i] = ''
      }
      this.$refs[operaList].resetFields()
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
<style scoped>
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
.switchThisTab{
  position: relative;
}
.tabRightBut{
  position: absolute;
  right:100px;
  top:1px;
}
.tabRightBut1{
  position: absolute;
  right:10px;
  top:1px;
}
.rightInfoWord {
  font-size:13px
}
.rightInfoWord a{
  margin-left:50px
}
.startThisPro{
  width:120px;
  height:100px;
  background:#da6262
}
.EndThisPro{
  width:120px;
  height:40px;
  background:#E6A23C
}
.recovery{
  background:#67C23A
}
.overThis{
  background:#000000;
  margin-top:15px;
  margin-left:0px !important;
}
.personBut{
  margin-right:10px;
  margin-top:10px;
  cursor: pointer;
  border:1px solid  #ddd;
  background-color: #fff;
  width:75px ;
  height:60px;
  display: inline-block;
  font-size: 13px;
}
.staffChoice label{
   width:85px !important;
  height:60px !important;

}
.personBut p{
  width: 80px;

  margin: 8px -20px;
}
.staffChoice{
  float:left;
  text-align:center;
}
.main {
  width:475px
}
.addGods-infor-ipt {
  line-height: 40px;
}
.up_img_btn {
  width: 230px;
  height:35px;
}
.img-lookup , .video-lookup{
  width: 100%;
  height:160px;
  margin: auto;
  display: block;
}
.blue{
  cursor:pointer
}
.recoversty{
  margin-top:20px;
  font-size:14px
}
.topbuton{
    float: right;
    padding: 0px 20px;
    margin: 0;

}
.topbuton .el-button{
    border-radius: 4px;
    padding: 8px 6px;
}
.noDatain{
  margin-top:50px;
  height: 100px;
  font-size:17px
}
.blankcontent{
  width: 100%;
  height: 600px;
  overflow: hidden;
  margin: 0;
  position: absolute;
  background:#fff
}
.blankcontent div{
  margin-top:50px
}
.numselect{
  width:200px
}
.rightInfoWord1{
  font-size:13px;
  margin-top:20px
}
.infonameclass{
  float:left
}
</style>
 // border-style: solid;
 //    border: 1px solid #ff0000;