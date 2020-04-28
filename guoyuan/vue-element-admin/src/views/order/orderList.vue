<template>
  <div class="app-orderListes">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">订单列表</div>
        <div class="sd-module-btn">
          <!-- <el-button v-if="btnShow.addBtn" class="btn-mainCol" @click="addOrderPop()" >新增</el-button>
          <el-button  v-if="btnShow.aplout" class="openCol-btn" @click="addOutExport('',0)" >订单派发</el-button>
          <el-button v-if="btnShow.getBtn" @click="addYunCang()">接受订单</el-button>
          <el-button v-if="btnShow.rejectBtn" @click="addYunCang()">拒接订单</el-button>
          <el-button v-if="btnShow.lockBtn" class="stopCol-btn" @click="locking('',0)">锁定</el-button>
          <el-button v-if="btnShow.unLock" class="openCol-btn" @click="unlock('',0)" >解锁</el-button>
          <el-button v-if="btnShow.imporOdr" class="btn-mainCol" @click="compOrders('',0)" >完成</el-button>
          <el-button v-if="btnShow.imporOdr" class="openCol-btn" @click="enable('',0)" >导入</el-button>
          <input ref="attenceInput" type="file" style="display:none" name="attence" @change="changeFile($event)" >
          <el-button v-if="btnShow.expOrder" class="stopCol-btn" @click="outExptal" >导出</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delOrders('',0)" >删除</el-button> -->
          <el-button v-if="btnShow.addBtn"  class="btn-mainCol" @click="addOrderPop()" >新增</el-button>
          <el-button v-if="btnShow.aplout" class="openCol-btn" @click="addOutExport('',0)" >订单派发</el-button>
          <el-button v-if="btnShow.lockBtn" class="stopCol-btn" @click="locking('',0)">锁定</el-button>
          <el-button v-if="btnShow.unLock"  class="openCol-btn" @click="unlock('',0)" >解锁</el-button>
          <el-button v-if="btnShow.imporOdr"  class="btn-mainCol" @click="compOrders('',0)" >完成</el-button>
          <el-button v-if="btnShow.imporOdr" class="openCol-btn" @click="importal()" >导入</el-button>
         <!--  <input ref="attenceInput" type="file" style="display:none" name="attence" @change="changeFile($event)" > -->
          <el-button v-if="btnShow.expOrder" class="stopCol-btn" @click="outExptal()" >导出</el-button>
          <el-button v-if="btnShow.delBtn" class="btn-delete" @click="delOrders('',0)" >删除</el-button>
        </div>
      </div>
      <div class="orderListes-header">
        <div class="orhead-state">
          <span class="orhead-states" style="padding-left: 35px;">状态:</span>
          <div class="sd-module-btn">
            <div :class="ordersList.state === 0?'el-tab-order on':' el-tab-order'"@click="distinguish(0)">全部&nbsp;</div>
            <div :class="ordersList.state === 1?'el-tab-order on':' el-tab-order'"@click="distinguish(1)">
              新订单(<span style="color:red;">{{ stateList.one }}</span>)
            </div>
            <div :class="ordersList.state === 4?'el-tab-order on':' el-tab-order'"@click="distinguish(4)">
              待出库(<span style="color:red;">{{ stateList.four }}</span>)
            </div>
            <div :class="ordersList.state === 5?'el-tab-order on':' el-tab-order'"@click="distinguish(5)">
              已出库(<span style="color:red;">{{ stateList.five }}</span>)
            </div>
            <div :class="ordersList.state === 6?'el-tab-order on':' el-tab-order'"@click="distinguish(6)">
              已签收(<span style="color:red;">{{ stateList.six }}</span>)
            </div>
            <div :class="ordersList.state === 8?'el-tab-order on':' el-tab-order'"@click="distinguish(8)">
              锁定(<span style="color:red;">{{ stateList.eight }}</span>)
            </div>
            <div :class="ordersList.state === 10?'el-tab-order on':' el-tab-order'"@click="distinguish(10)">
              完成(<span style="color:red;">{{ stateList.ten }}</span>)
            </div>
            <div :class="ordersList.state === 12?'el-tab-order on':' el-tab-order'"@click="distinguish(12)">
              已拒单(<span style="color:red;">{{ stateList.twelve }}</span>)
            </div>
          </div>
        </div>
        <el-form ref="ordersList":model="ordersList"class="sd-form-box clearfix"size="medium"label-width="100px">
          <el-row>
            <el-col class="sd-col-6" style="width:270px" >
              <el-form-item label="系统编号" label-width="80px" class="sd-form-item" >
                <el-input v-model="ordersList.system_number" placeholder="请输入系统编号" style="width:170px" clearable />
              </el-form-item>
            </el-col>
            <el-col class="sd-col-6" style="width:270px" >
              <el-form-item label="销售平台" label-width="80px" class="sd-form-item" >
                <el-select v-model="ordersList.plat_id" class style="width:170px" >
                  <el-option v-for="item in plot" :key="item.plat_id" :label="item.plat_name" :value="item.plat_id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="sd-col-6" style="width:270px" >
              <el-form-item label="平台单号" label-width="80px" class="sd-form-item" >
                <el-input v-model="ordersList.plat_number" placeholder="请输入平台单号" style="width:170px" clearable/>
              </el-form-item>
            </el-col>
            <el-col style="width:500px;">
              <el-form-item label="创建时间" label-width="80px" class="sd-form-item">
                <el-date-picker v-model="ordersList.create_start" style="width:180px" type="datetime" placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateBefore'/>
                至
                <el-date-picker v-model="ordersList.create_end" style="width:180px" type="datetime" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter'/>
              </el-form-item>
            </el-col>
            <el-col class="sd-col-6" style="width:270px" >
              <el-form-item label="商品名称" label-width="80px" class="sd-form-item" >
                <el-input v-model="ordersList.goods_name" placeholder="请输入商品名称" style="width:170px" clearable/>
              </el-form-item>
            </el-col>
            <el-col class="sd-col-6" style="width:270px" >
              <el-form-item label="客户名称" label-width="80px" class="sd-form-item" >
                <el-input v-model="ordersList.user_name" maxlength="10" placeholder="请输入客户名称" style="width:170px" clearable/>
              </el-form-item>
            </el-col>
            <el-col class="sd-col-6" style="width:270px">
              <el-form-item label="联系电话" label-width="80px" class="sd-form-item">
                <el-input v-model="ordersList.user_tel" maxlength="11" placeholder="请输入联系电话" style="width:170px" clearable/>
              </el-form-item>
            </el-col>
            <el-col style="width:500px;">
              <el-form-item label="完成时间" label-width="80px" class="sd-form-item">
                <el-date-picker v-model="ordersList.complete_start" type="datetime" style="width:180px" placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateBefore1'/>
                至
                <el-date-picker v-model="ordersList.complete_end" type="datetime" style="width:180px" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateAfter1'/>
              </el-form-item>
            </el-col>
            <el-col class="sd-col-6" style="width:270px">
              <el-form-item label="快递单位" label-width="80px" class="sd-form-item">
                <el-select v-model="ordersList.tra_id" class style="width:170px" >
                  <el-option v-for="item in departlist" :key="item.tra_id" :label="item.tra_name" :value="item.tra_id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="sd-col-6" style="width:270px">
              <el-form-item label="物流信息" label-width="80px" class="sd-form-item">
                <el-input v-model="ordersList.wl" placeholder="请输入物流信息" style="width:170px" clearable/>
              </el-form-item>
            </el-col>
            <el-col class="sd-col-6" style="width:270px">
              <el-form-item label="备注"  label-width="80px" class="sd-form-item">
                <el-input v-model="ordersList.remarks" placeholder="请输入备注" style="width:170px" clearable/>
              </el-form-item>
            </el-col>
            <div class="plr-10 fr">
              <el-button class type="primary" @click="orderTgoing">搜&nbsp;&nbsp;索</el-button>
              <el-button class @click="resetForm('ordersList')">重&nbsp;&nbsp;置</el-button>
            </div>
          </el-row>
        </el-form>
      </div>
      <!-- 列表 -->
      <div class="lk-table-box">
        <table-box :list-data="list" style="width:100%;min-width:980px;">
          <tr slot="theader"class="sd-table-header">
            <th style="min-width:50px">
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
            <th style="min-width:140px">商品名称</th>
            <th style="min-width:50px">单价</th>
            <th style="min-width:50px">数量</th>
            <th style="min-width:100px">总金额</th>
            <th style="min-width:120px">客户信息</th>
            <th style="min-width:120px">订单信息</th>
            <th style="min-width:120px">物流信息</th>
            <th style="min-width:120px">订单备注</th>
            <th style="min-width:50px">操作</th>
          </tr>
          <template slot="row"slot-scope="props">
            <!-- {{props.item}} -->
            <!-- 上边一行 -->
            <tr class="sd-table-intro">
              <td colspan="10">
                <label class="el-checkbox sd-chose-all-box">
                  <input v-model="checkModel":value="props.item.order_id"type="checkbox"class="none">
                  <span :class="checkModel.indexOf(props.item.order_id)>=0?'el-checkbox__input is-checked':'el-checkbox__input'">
                    <span class="el-checkbox__inner" />
                  </span>
                  <span class=""> 系统单号:{{ props.item.system_number }}</span>
                  <span v-if="props.item.plat_name!==''"class="pl-5 pr-5">销售平台:{{ props.item.plat_name }}</span>
                  <span v-if="props.item.plat_number!==''"class="pl-5">平台单号:{{ props.item.plat_number }}</span>
                  <span>状态: 
                    <div v-if="props.item.state===10"class="inBlock">
                      <span class="blue">完成</span>
                      <div class="open-more-inf red"@click="seesignforOrder(props.item.img)">查看签收凭证</div>
                    </div>
                    <span v-if="props.item.state===1"class="blue">新订单</span>
                    <span v-if="props.item.state===2"class="blue">待处理</span>
                    <span v-if="props.item.state===3"class="blue">待申请出库</span>
                    <span v-if="props.item.state===4"class="blue">待出库</span>
                    <span v-if="props.item.state===5"class="blue">已出库</span>
                    <div v-if="props.item.state===6"class="inBlock">
                      <span class="blue">已签收</span>
                      <div class="open-more-inf red"@click="seesignforOrder(props.item.img)">查看签收凭证</div>
                    </div>
                    <span v-if="props.item.state===8"class="blue">锁定</span>
                    <span v-if="props.item.state===10"class="blue">完成</span>
                    <span v-if="props.item.state===12"class="blue">已拒单</span>
                  </span>
                </label>
              </td>
            </tr>
            <tr class="sd-table-detail"align="center"valign="top">
              <td colspan="4">
                <table width="100%"border="0"cellpadding="0"cellspacing="0"class="goodsInf">
                  <tr v-for="goods in props.item.goods":key="goods.goods_name"class="goodsBox">
                    <td style="min-width:300px">
                      <img v-if='goods.goods_img!==""':src="baseUrl + goods.goods_img"alt class="img-pic">
                      <div style=' display:block; float:left;width:40px; height:40px;padding:5px;'   v-else>
                      <i class='el-icon-picture'style='font-size:30px;'></i>
                      </div>
                      <div class="goods-text" style="float: none;">
                        <a class="name">{{ goods.goods_name }}</a>
                      </div>
                    </td>
                    <td style="min-width:90px">
                      <p>￥{{ goods.goods_money }}</p>
                    </td>
                    <td style="min-width:100px"align="center">
                      <p>{{ goods.goods_number }}</p>
                    </td>
                  </tr>
                </table>
                <div v-show="props.item.goods_state==2"class="open-more-inf"style='padding:8px 0'@click="openGoods(props.item.order_id)">   查看更多
                </div>
              </td>
              <td align="center">
                <p class="padTop10">￥{{ props.item.sum_money }}</p>
              </td>
              <td class="border-left"align="left">
                <div class="clearfix padTop10">
                  <div v-for="(userInf,index) in props.item.user":key="index"class="clearfix ">
                    <p v-if="index===0">{{ userInf.user_name }} {{ userInf.user_tel }}</p>
                    <p v-if="index === 0"class="sd-per-infor">{{ userInf.province }}{{ userInf.city }}{{ userInf.county }}{{ userInf.address }}</p> 
                  </div>
                  <span v-if="props.item.user_count!==1"class="tip-yellow">
                    <i class="el-icon-info yellow" />
                    <span class="tip-yellow-text">地址已更改</span>
                  </span>
                </div>
              </td>
              <td class="border-left"align="center">
                <div style="padding-bottom:6px;">
                  <div v-for="(order,index) in props.item.order_log":key="index"class="padTop10">
                    <p v-if="index<3"class="">{{ order.details }}时间:&nbsp;<span>{{ order.create_time }}</span></p>
                    <p v-if="index<3"style="padding-top:6px">{{ order.admin_user }}</p>
                    <div v-show="index===3"class="open-more-inf"@click="openInf(props.item.order_id)">查看更多</div>
                  </div>
                </div>
              </td>
              <td class="border-left padTop10"align="center"> 
                <span v-if="props.item.wl === '' || !props.item.wl 
                  ||(props.item.wl && props.item.wl.length===0)">
                  暂无
                </span>
                <div  v-for="(ite,index ) in props.item.wl":key="index"class="">
                  <span>{{ ite }}</span>
                  <!-- <p>{{ props.item.timeAddres }}</p> -->
                </div>
              </td>
              <td class="border-left remarks-box padTop10"align="center">
                <div style="padding-bottom:10px"> 
                  <span v-if="props.item.remarks.length===0">暂无</span>
                  <div v-for="(ite,index ) in props.item.remarks":key="index"style="padding-bottom:4px;">
                    <p v-if="index<2"class="name">{{ ite.adm_name }}</p>
                    <p v-if="index<2"class="time">{{ ite.create_time }}</p>
                    <p v-if="index<2"class="det">{{ ite.remarks }}</p>
                    <div v-show="index===2"class="open-more-inf"@click="openremarksInf(props.item.order_id)">查看更多</div>
                  </div>
                </div>
              </td>
              <td class="border-left opration-btn"style="width:'80px'">
                <div>
                  <div class="orderLine-btn"style="padding:10px 0;width:180px;">
                    <div v-if="props.item.state == 10" />
                      <el-button  v-if="(props.item.state == 1 || props.item.state == 8) && btnShow.editBtn" class="btn-mainCol btn-marg"size="small"style="width:80px"@click="compile(props.item)">
                        编辑
                      </el-button>
                      <el-button  v-if="props.item.state == 1  && btnShow.sendBtn"class="openCol-btn btn-marg"size="small"style="width:80px"@click="addOutExport(props.item,1)">
                        派单
                      </el-button>
                      <el-button v-if="(props.item.state == 5 ||props.item.state == 1) && btnShow.lockBtn" class="stopCol-btn btn-marg"size="small"style="width:80px"@click="locking(props.item,1)">
                        锁定
                      </el-button>
                      <el-button v-if="(props.item.state == 1 || props.item.state == 2 || props.item.state == 4  || props.item.state == 5 || props.item.state == 6 || props.item.state == 8) && btnShow.remakBtn" class="btn-secCol btn-marg"size="small"style="width:80px"@click="addRemark(props.item)">
                        备注
                      </el-button>
                      <el-button v-if="(props.item.state == 1 || props.item.state == 8) && btnShow.delBtn" class="btn-delete btn-marg"size="small"style="width:80px"@click="delOrders(props.item,1)">
                        删除
                      </el-button>
                      <!-- <el-button v-if="props.item.state == 5  && btnShow.lossBtn"class=" btn-mainCol btn-marg"size="small"style="width:80px"@click="frmLoss(props.item)">
                        运输报损
                      </el-button> -->
                      <el-button v-if="props.item.state == 5 && btnShow.signBtn"class=" btn-mainCol btn-marg"size="small"style="width:80px"@click="signforOrders(props.item)">
                        签收
                      </el-button>
                      <el-button v-if=" props.item.state == 6 && btnShow.finBtn" class="btn-mainCol btn-marg"size="small"style="width:80px"@click="compOrders(props.item,1)">
                        完成
                      </el-button>
                      <el-button v-if="props.item.state == 8 && btnShow.unLock"class="openCol-btn btn-marg"size="small"style="width:80px"@click="unlock(props.item,1)">
                        解锁
                      </el-button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </table-box>
        <div v-if="list.length===0"slot="nodata"class="nodata-list">暂无数据</div>
      </div>
      <div v-if="list.length>0"class="lk-page-box">
        <el-pagination :current-page="exitPage.page":page-size="exitPage.page_size":total="exitPage.page_number"layout="total, prev, pager, next, jumper"background @current-change="handleCurrentChange"/>
      </div>
    </el-row>
    <!-- 订单商品展示--查看更多 -->
    <el-dialog title="订单商品":visible.sync="showGoodsInf"width="550px"@close="showGoodsInf=false"class='el_dia_goods'>
      <el-table :data="goodsList"width="100%"class='table_goods'>
        <el-table-column label="图片"align="center"width='55'> 
          <template slot-scope="scope">
            <img :src="baseUrl+ scope.row.goods_img"alt=""class='goods_img'v-if='scope.row.goods_img!==""'>
             <i class='el-icon-picture'style='font-size:30px;'v-else
            ></i>
          </template>
        </el-table-column>
        <el-table-column label='商品'prop="goods_name"min-width align="center"/>
        <el-table-column label='单价'prop="goods_money"min-width align="center"/> 
        <el-table-column label='数量'prop='goods_number'min-width align="center"/>
      </el-table>
      <span slot="footer"class=''>
        <p style='padding:0 20px;'>总金额:{{money}}元</p>
      </span>
    </el-dialog>

    <!-- 订单信息 -->
    <el-dialog :visible.sync="showOrderInf"title="订单信息"width="500px"class="showorder-dialog"@close="showOrderInf=false">
      <el-table :data="ordInfList"width="100%">
        <el-table-column label="操作人"prop="admin_user"align="center"/>
        <el-table-column label="操作功能"prop="details"align="center"/>
        <el-table-column label="操作时间"prop="create_time"align="center"width='155'/>
      </el-table>
    </el-dialog>
    <!-- 备注信息--查看 -->
    <el-dialog :visible.sync="showOrderRemarks"title="备注"width="500px"class="showorder-dialog"@close="showOrderRemarks=false">
      <el-table :data="ordergetGooName">
        <el-table-column label="操作人"prop="adm_name"align="center"min-width />
        <el-table-column label="操作时间"prop="create_time"align="center"width='155'/>
        <el-table-column label="内容"prop="remarks"align="center"/>
      </el-table>
    </el-dialog>
    <!-- 备注 -->
    <el-dialog :visible.sync="showAddRamker":close-on-click-modal="false"title="备注"width="400px"class="AddRamkerss"@close="addClaForms('addRemk')">
      <el-form ref="addRemk":model="addRemk"label-width="20px">
        <el-form-item>
          <el-input v-model="addRemk.xiuGramker"type="textarea"style="width:100%"placeholder="请输入备注,文字尽量简练"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addClaForms('addRemk')">取 消</el-button>
        <el-button type="primary"@click="addRemks('addRemk')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 签收 -->
    <el-dialog :visible.sync="showAddSign":close-on-click-modal="false"title="签收"width="400px"class="AddSigns "@close="addsignforOrderms('')">
      <div class="AddSigns-one">
        <p class="AddSigns-onet">签收时间</p>
        <p class="AddSigns-oneq">签收凭证</p>
      </div>
      <div class="AddSigns-two">
        <el-date-picker v-model="signTime"type="datetime"placeholder="选择日期时间"label="签收时间"class="AddSigns-twot"/>
        <div class="upload-img AddSigns-twoi">
          <div v-if="!allowAddImg"class="img-list">
            <div class="img_show_box">
              <img :src="imgArr"alt >
            </div>
          </div>
          <div v-if="allowAddImg"class="upload-img-bd">
            <div class="add-img-box"@click="fileClick">
              <input id="fileIpt"type="file"accept="image/*"class="ipt-add"@change="changeImg($event)">
              <span class="icon-add el-icon-plus" />
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="addsignforOrderms('')">取 消</el-button>
        <el-button type="primary"@click="addSigns('')">确 定</el-button> 
      </span>
    </el-dialog>
    <!-- 查看签收凭证 -->
    <el-dialog :visible.sync="showAddsignforOrder":close-on-click-modal="false"title="查看签收凭证"width="400px"class="AddSigncha"@close="addsignforOrderc('')">
      <div class="AddSigns-one">
        <p class="AddSigns-onet">签收时间</p>
        <p class="AddSigns-oneq">签收凭证</p>
      </div>
      <div class="AddSigns-two">
        <el-date-picker v-model="signImage.save_time"type="datetime"placeholder="选择日期时间"label="签收时间"disabled class="AddSigns-twot"/> 
        <div class="img_show_boxs">
          <img :src="signImage.image"style='cursor:pointer;'@click="innerVisible = true">
        </div>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog title="导入":visible.sync="dia.show"width="30%"@close="dia.show=false"class="dialog_data_box">
      <div class="list_data_add">
        <el-form :model="diaForm"ref="diaForm"label-width="100px">
          <el-form-item label="数据来源"class="el">
            <el-button v-show='dia.UpBtnShow'class='upload_btn'style="width: 260px;"@click.native="uploadFile">
              上传
            </el-button>
            <el-button v-show='!dia.UpBtnShow'class='upload_btn'style="width: 260px;">
              上传成功
            </el-button>
            <div class="tip_box">
              下载模板,填写数据后,再上传excel文件
            </div>
            <input type="file"style='display:none;'id='excelUpload'accept=".xls, .xlsx"v-on:change='upFileExcel($event)'>
          </el-form-item>
        </el-form>
        <div class='download_text'>
          <el-button type="text"@click="downloadExcel(1)">
            下载模板
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 运输报损 -->
    <el-dialog title="运输报损":visible.sync="lossShow"width="600px"@close="lossShow=false">
        <el-form  ref="diaForm"label-width="100px">
          <el-radio-group v-model="radio" style="margin-bottom:30px">
            <el-radio v-for="item in lossList" :rules="rules" v-if="item.wl_type===2" :key="item.wl_id" :label="item.wl_id" @change="toggleTab(item.wl_id)">
               <span class="radiospamn">运输公司:{{item.wl_unitid}}</span>
               <span class="radiospamn">负责人:{{item.wl_user}}</span>
               <span class="radiospamn">联系电话:{{item.wl_tel}}</span>
               <span class="radiospamn">车牌号:{{item.wl_license}}</span>
               <span class="radiospamn">可报损数:{{item.wl_loss}}</span>
            </el-radio>
            <el-radio v-for="item in lossList" v-if="item.wl_type===1" :key="item.wl_id" :label="item.wl_id" @change="toggleTab(item.wl_id)">
               <span class="radiospamn">运输公司:{{item.wl_unitid}}</span>
               <span class="radiospamn">运输单号:{{item.wl_courier}}</span>
               <span class="radiospamn">可报损数:{{item.wl_loss}}</span>
            </el-radio>
          </el-radio-group>
          
          <el-form-item label="报损数量"class="el" prop="ord_loss">
            <el-input v-model="addlossList.ord_loss" placeholder="请输入报损数量" style="width:300px" />
          </el-form-item>
          <el-form-item label="备注"class="el" prop="remark">
           <el-input v-model="addlossList.remark"type="textarea"style="width:300px"placeholder="请输入备注,文字尽量简练"/>
          </el-form-item>
        </el-form>
        <span slot="footer" align="right">
          <el-button @click="addClaForms('lossList')">取 消</el-button>
          <el-button  type="primary"@click="addLossBtn('lossList')">确 定</el-button>
        </span>
    </el-dialog>
    <div class='over_box'v-if='innerVisible'>
      <i class='el-icon-error over_close'@click="innerVisible=false"></i>
      <img :src="signImage.image"alt=""class='lookDetailImg'>
    </div>
     <a :href="urlDownload"style='display:none'id='downLoadA'></a>
    <order-addpop v-if="orderAddif":input-name="addPop"@childByValue="childByValue"/> 
    <order-addpops v-if="orderAddpif":input-name="addPops"@childByPops="childByPops"/> 
    <!-- 出库 -->
    <order-application v-if="orderApplif" :input-name="chardOrderid"@childByValues="childByValues"/>
    <a :href="expoUrl"id='expClic'></a>
  </div>
</template>
<script>
import orderAddpop from './components/orderAddPop'
import orderAddpops from './components/orderAddPops'
import orderApplication from './components/orderApplication'
import {orderList,excalOut,addOrderpage, addOrder ,editOrder ,getGooName ,remarkslist,getOrderEidt, addRemarks, LockingOrder, unlockOrder, delOrder, getDistriOrder, distriware,  signforOrder ,lossOrder, compOrder, importOrder ,getOrdeRemark ,getlossInfo ,searchTrans} from '@/api/orderAdmin'
import { errorStatus } from '@/utils/index'
import { getToken } from '@/utils/auth'
import TableBox from '@/components/tableBox'
export default {
  components: { orderAddpop, orderApplication, orderAddpops, TableBox },
  data() {
    return {
      money:0,
      expoUrl:'',
      innerVisible:false,
      showOrderRemarks: false,
      showOrderInf: false,
      ordInfList: null,
      ordergetGooName: null,
      goodsList:null,
      showGoodsInf:false,
      lossShow:false,
      checkModel: [],
      checkedAll: 2,
      addRemk: {
        xiuGramker: '',
        xiuGramkid: null
      },
      dia:{
        tit:'导入',
        show:false,
        loading:false,
        UpBtnShow:true
      },
      diaForm:{
        file:'',
        upstate:0
      },
      urlDownload:'',
      allowAddImg: true,
      signTime: null,
      imgArr: '',
      remarkList: [],
      showAddRamker: false,
      showAddSign: false,
      showAddsignforOrder: false,
      signImage: {},
      attence: '',
      attenceFile: {},
      addPop: {},
      addPops: null,
      chardOrderid: [],
      list: [],
      orderAddif: false,
      orderApplif: false,
      orderAddpif: false,
      lossList:[],
      addlossList:{
        ord_loss:'',
        wl_id:'',
        remark:''
      },
      rules:{
        ord_loss:[
        { required: true, message: '请输入运输报损数量', trigger: 'blur' },
        ]
      },
      radio: '1',
      picURL:'',
      ordersList: {
        state: 0, // 订单状态
        create_start: '', // 订单创建—开始时间
        create_end: '', // 订单创建—结束时间
        complete_start: '', // 订单完结—开始时间
        complete_end: '', // 订单完结—结束时间
        system_number: '', // 系统单号
        plat_id: '', // 平台id
        plat_number:'', // 平台单号
        goods_name: '', //	商品名称
        user_name: '', // 客户名称
        user_tel:'', //	客户电话
        wl: '', // 物流消息
        remarks: '', // 备注
        page: 1, // 请求页码
        page_size: 10 // 每页显示条数
      },
      exitPage: [],
      currentPage: 1,
      pageSize: 10,
      totalNum: 100,
      departlist:[],//快递单位
      addClaForm: {
        name: ''
      },
      checkModel: [],
      stateList: [],
      plot: [],
      type: [
        { id: 0, name: '全部' },
        { id: 1, name: '正常' },
        { id: 2, name: '待处理' },
        { id: 3, name: '待申请出库'},
        { id: 4, name: '待出库' },
        { id: 5, name: '已出库' },
        { id: 6, name: '已签收' },
        { id: 8, name: '锁定' },
        { id: 10, name: '完成' },
        { id: 12, name: '已拒单' }
      ],
      btnShow: {},
      btnId: {},
      baseUrl: null,
      pickerDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          let beginDateVal = this.ordersList.create_start;
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
          let DateVal = this.ordersList.create_end;
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
          let beginDateVal = this.ordersList.complete_start;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return time.getTime() > _now;
          }
        }
      },
      pickerDateAfter1: {
        disabledDate: time => {
          let _now = Date.now();
          let DateVal = this.ordersList.complete_end;
          if (DateVal) {
            return time.getTime() < DateVal||time.getTime() > _now;
          } else {
            return time.getTime() > _now;
          }
        }
      }
    }
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
    // 页面加载时
    this.getSalesInfo()
    this.getTransport()
  },
  methods: {
    getSalesInfo() {
      const that = this
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const url = process.env.BASE_API
      this.baseUrl = url.replace('/public', '/')
      // console.log('baseUrl---', this.baseUrl)
      const data = {}
      data.page = this.currentPage
      data.state = that.ordersList.state
      data.create_start = that.ordersList.create_start
      data.create_end = that.ordersList.create_end
      data.complete_start = that.ordersList.complete_start
      data.complete_end = that.ordersList.complete_end
      data.system_number = that.ordersList.system_number
      data.plat_id = that.ordersList.plat_id
      data.plat_number = that.ordersList.plat_number
      data.goods_name = that.ordersList.goods_name
      data.user_name = that.ordersList.user_name
      data.user_tel = that.ordersList.user_tel
      data.wl = that.ordersList.wl
      data.remarks = that.ordersList.remarks
      data.page = that.ordersList.page
      data.pri_id = this.$route.meta.pri_id // 传入按钮id
      // 搜索仓库
      orderList(data)
        .then(response => {
          // console.log(response)
          if (errorStatus(response.data)) {
            that.list = response.data.data.order_list
            that.plot = response.data.data.plot
            that.stateList = response.data.data.state_count
            that.exitPage = response.data.data.page
            const btnList = response.data.button_data
            // console.log('btnList---', btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '新增') {
                this.$set(that.btnShow, 'addBtn', true)
                this.$set(that.btnId, 'addBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '编辑') {
                this.$set(that.btnShow, 'editBtn', true)
                this.$set(that.btnId, 'editBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '备注') {
                this.$set(that.btnShow, 'remakBtn', true)
                this.$set(that.btnId, 'remakBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '锁定') {
                this.$set(that.btnShow, 'lockBtn', true)
                this.$set(that.btnId, 'lockBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '解锁') {
                this.$set(that.btnShow, 'unLock', true)
                this.$set(that.btnId, 'unLock', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(that.btnShow, 'delBtn', true)
                this.$set(that.btnId, 'delBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '订单派发') {
                this.$set(that.btnShow, 'sendBtn', true)
                this.$set(that.btnId, 'sendBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '签收') {
                this.$set(that.btnShow, 'signBtn', true)
                this.$set(that.btnId, 'signBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '完成') {
                this.$set(that.btnShow, 'finBtn', true)
                this.$set(that.btnId, 'finBtn', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '导入') {
                this.$set(that.btnShow, 'imporOdr', true)
                this.$set(that.btnId, 'imporOdr', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '导出') {
                this.$set(that.btnShow, 'expOrder', true)
                this.$set(that.btnId, 'expOrder', btnList[i].pri_id)
              } else if (btnList[i].pri_funname === '运输报损') {
                this.$set(that.btnShow, 'lossBtn', true)
                this.$set(that.btnId, 'lossBtn', btnList[i].pri_id)
              } 

            }
               console.log( that.btnShow)
            this.btnShow = that.btnShow
          }
          loading.close()
        })
        .catch(err => {
          loading.close()
          console.log('获取列表err', err) 
        })
    },
    getTransport(){
      const data={}

      searchTrans(data).then(response=>{
      if(errorStatus(response.data)){
        this.departlist=response.data.data
       }
     })
    },
    //导入
    importal(){
       this.dia.tit='导入'
       this.dia.show=true
       this.dia.UpBtnShow=true
    },
    //下载
    downloadExcel(){
      const url = process.env.BASE_API
      const str ='storage/excel/order/templat.xlsx'
      const base = url.replace('/public', '/')
      this.urlDownload=base+str
      this.clickABtn()
    },
    clickABtn(){
       setTimeout(() => {
        document.getElementById('downLoadA').click();
      }, 500)
    },
    //上传
    uploadFile(){
       document.getElementById('excelUpload').click();
    },
    upFileExcel(el){
      //  console.log("上传")
      var _this=this
      // console.log("el---",el)
      el.preventDefault();//取消默认行为
      // var fileDta=document.getElementById('excelUpload')
      let uploadEventFile =document.getElementById('excelUpload').value
      if(uploadEventFile.lastIndexOf(".xls") > 0 || uploadEventFile.lastIndexOf(".XLS") > 0){
      let formData = new FormData();
       var file = el.target.files[0]
      formData.append('api_token', getToken())
       formData.append('file',file);
          importOrder(formData).then(response=>{
            if(errorStatus(response.data)){
              this.dia.UpBtnShow=false
        /*    this.diaForm.upstate=1*/
              this.$message.success(response.data.data)
              this.dia.show=false
              this.getSalesInfo()
            // _this.showAddFile=false
          }
          }).catch(Error=>{
            this.$message.error('请求失败!')
          })

        document.getElementById('excelUpload').value=null
      }else{
        this.$message.error("请上传正确的excel文件")
      }
     },
    // 导出
    outExptal(){
      const data=this.ordersList;
      delete data.page
      delete data.page_size
      // console.log("data--",data);
      excalOut(data).then(response=>{
        if(errorStatus(response.data)){
          // console.log(response.data)
        this.expoUrl=this.baseUrl+response.data.data;
        setTimeout(() => {
          document.getElementById('expClic').click();
        }, 800);
        }
      }).catch(Error=>{
        this.$message.error("请求失败")
      })
    },
    // 商品信息  查看更多
    openGoods(id){
    const data={};
    data.order_id=id;

    data.type=3;
    getGooName(data).then(response=>{
      if(errorStatus(response.data)){
       
        this.goodsList = response.data.data;
        this.showGoodsInf = true
        this.money=response.data.money;
         console.log("this.goodsList--",this.goodsList)
      }
    }).catch(Error=>{
      this.$message.error("请求失败!")
    })
    },
    // 订单信息 查看更多
    openInf(id) {
      //  console.log("row--",id)
      const data={};
      data.order_id=id;
      data.type=2;
      getOrdeRemark(data).then(response=>{
        if(errorStatus(response.data)){
          // console.log("response.data--",response.data.data)
          this.ordInfList = response.data.data;
      this.showOrderInf = true
        }
      }).catch(Error=>{
        this.$message.error("请求失败!")
      })
      
    },
    // 备注 查看更多
    openremarksInf(id) {
      // console.log("row--",id)
      const data={};
      data.order_id=id;
      data.type=1;
      getGooName(data).then(response=>{
        if(errorStatus(response.data)){
          this.ordergetGooName = response.data.data;
          this.showOrderRemarks = true
        }
      }).catch(Error=>{
        this.$message.error("请求失败!")
      })
    },
    
    // 模板
    moban() {
      // console.log("")
      window.location.href=this.baseUrl+'public/template.xlsx'
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
          _this.checkModel.push(data.order_id)
          // _this.chardOrderid.push(data.order_id);
        })
      }
    },
    handleCurrentChange(val) {
      // 分页器的方法
      this.ordersList.page = val
      this.getSalesInfo()
    },
    addYunCang() {
      // 点击我的云仓添加按钮后的操作
      this.showAddClas = true
    },
    handleSelectionChange(val) {
      // 我的云仓单选框被选中的
      const that = this
      that.chosed = val
      that.radio = []
      that.chardOrderid = []
      for (var i = 0; i < val.length; i++) {
        that.radio.push(val[i].order_id)
        that.chardOrderid.push(val[i].order_id)
      }
    },
    
    sortChang(column, prop, order) {
      // console.log(column, prop, order)
      // if (column.order === 'ascending') {
      //   this.formList.order = 2
      //   this.searchCargo()
      // } else {
      //   this.formList.order = 1
      //   this.searchCargo()
      // }
    },
    addOrderPop() {
      this.orderAddif = true
    },
    childByValue(inter) {
      // childValue就是子组件传过来的值
      if (inter === 1) {
        this.orderAddif = false
      } else {
        this.orderAddif = false
        this.getSalesInfo()
      }
    },
    childByValues(inter) {
      if (inter === 1) {
        this.orderApplif = false
      } else {
        this.orderApplif = false
        this.getSalesInfo()
      }
    },
    childByPops(inter) {
      // console.log(inter)
      if (inter === 1) {
        this.orderAddpif = false
      } else {
        this.orderAddpif = false
        this.getSalesInfo()
      }
    },
    orderTgoing() {
      const that = this
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.state = that.ordersList.state
      data.create_start = that.ordersList.create_start
      data.create_end = that.ordersList.create_end
      data.complete_start = that.ordersList.complete_start
      data.complete_end = that.ordersList.complete_end
      data.system_number = that.ordersList.system_number
      data.plat_id = that.ordersList.plat_id
      data.plat_number = that.ordersList.plat_number
      data.goods_name = that.ordersList.goods_name
      data.user_name = that.ordersList.user_name
      data.user_tel = that.ordersList.user_tel
      data.wl = that.ordersList.wl
      data.remarks = that.ordersList.remarks
      data.page = 1
      data.pri_id = that.$route.meta.pri_id // 传入按钮id
      data.tra_id = that.ordersList.tra_id
      // 搜索仓库
      orderList(data)
        .then(response => {
          // console.log(response)
          if (errorStatus(response.data)) {
            that.list = response.data.data.order_list
            that.plot = response.data.data.plot
            that.stateList = response.data.data.state_count
            that.exitPage = response.data.data.page
          }
          loading.close()
        })
        .catch(err => {
          loading.close()
          console.log('获取列表err', err)
        })
    },
    // 出库
    addOutExport(scope, exporIf) {
      const that = this
      // const data = {}
      // console.log('出库--', scope)
      if (exporIf === 1) {
        that.chardOrderid = [scope.order_id]
        // data.order_id = props.item.order_id
        that.orderApplif = true
      } else {
        if (that.checkModel.length === 0) {
          this.$message.error('请选择要派单的订单!')
          // loading.close()
        } else {
          that.chardOrderid = that.checkModel
          that.orderApplif = true
        }
      }
    },
    addRemark(scope) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}

      data.order_id = scope.order_id
      this.addRemk.xiuGramkid = scope.order_id
      // 搜索仓库
      remarkslist(data)
        .then(response => {
          // console.log(response)
          if (errorStatus(response.data)) {
            this.remarkList = response.data.data
            this.getSalesInfo()
            this.showAddRamker = true
          }
          loading.close()
        })
        .catch(err => {
          loading.close()
          console.log('获取列表err', err)
        })
    },
    addRemks() {
      
      if(this.addRemk.xiuGramker===''){
        this.$message.error("请输入备注内容");
        return false
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.order_id = this.addRemk.xiuGramkid
      data.content = this.addRemk.xiuGramker
      // 搜索仓库
      addRemarks(data)
        .then(response => {
          loading.close()
          // console.log(response)
          if (errorStatus(response.data)) {
            this.showAddRamker = false
            this.addRemk.xiuGramker = ''
            this.getSalesInfo()
          }
        })
        .catch(err => {
          loading.close()
          console.log('获取列表err', err)
        })
    },
    addClaForms(formName) {
      this.showAddRamker = false
      this.addRemk.xiuGramker = ''
      this.lossShow=false
      this.addlossList.ord_loss=''
      this.addlossList.wl_id=''
      this.addlossList.remark=''
      this.radio=''
    },
    compile(ropect) {
      if(ropect.state == 8){
        this.$message.error('订单已锁定，无法编辑')
        return
      }
      this.addPops = ropect.order_id
      this.orderAddpif = true
    },
    distinguish(goId) {
      switch (goId) {
        case 0:
          this.ordersList.state = 0
          this.tabClick0 = true
          break
        case 1:
          this.ordersList.state = 1
          break
        case 2:
          this.ordersList.state = 2
          break
        case 3:
          this.ordersList.state = 3
          break
        case 4:
          this.ordersList.state = 4
          break
        case 5:
          this.ordersList.state = 5
          break
        case 6:
          this.ordersList.state = 6
          break
        case 8:
          this.ordersList.state = 8
          break
        case 10:
          this.ordersList.state = 10
          break
        case 12:
          this.ordersList.state = 12
          break
        default:
      }
      this.orderTgoing()
    },
    // 锁定
    locking(scope, judgeId) {
      const that = this
      const data = {}
      if (judgeId === 1) {
        data.order_id = scope.order_id
        this.$confirm('请确认,是否锁定选中的订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            LockingOrder(data)
              .then(res => {
                if (errorStatus(res.data)) {
                  this.$message.success(res.data.data)
                  that.getSalesInfo()
                }
              })
              .catch(err => {
                console.log('获取列表err', err)
                this.$message.error('请求失败!')
              })
          })
          .catch(() => {
            // console.log("取消停用");
          })
      } else {
        if (that.checkModel.length === 0) {
          this.$message.error('请选择要锁定的订单!')
        } else {
          const id = that.checkModel
          const list = this.list
          const order_sta = []
          for (const i in list) {
            for (const j in id) {
              if (list[i].order_id === id[j]) {
                //
                if (list[i].state !== 8) {
                  order_sta.push(list[i].state)
                }
              }
            }
          }
          if (order_sta.length > 0) {
            data.order_id = that.checkModel
            this.$confirm('请确认,是否锁定选中的订单?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                LockingOrder(data)
                  .then(res => {
                    if (errorStatus(res.data)) {
                      this.$message.success('订单锁定成功!')
                      that.getSalesInfo()
                    }
                  })
                  .catch(err => {
                    console.log('获取列表err', err)
                    this.$message.error('请求失败!')
                  })
              })
              .catch(() => {
                // console.log("取消停用");
              })
          } else {
            this.$confirm("选中订单的状态全部为'非锁定'", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {})
          }
        }
      }
    },
    // 解锁
    unlock(scope, judgeId) {
      const that = this
      const data = {}
      if (judgeId === 1) {
        data.order_id = scope.order_id
        this.$confirm('请确认,是否解锁选中的订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            unlockOrder(data)
              .then(res => {
                if (errorStatus(res.data)) {
                  this.$message.success(res.data.data)
                  that.getSalesInfo()
                }
              })
              .catch(err => {
                console.log('获取列表err', err)
                this.$message.error('请求失败!')
              })
          })
          .catch(() => {
            // console.log("取消停用");
          })
      } else {
        if (that.checkModel.length === 0) {
          this.$message.error('请选择要解锁的订单!')
        } else {
          const id = that.checkModel
          const list = this.list
          const order_sta = []
          for (const i in list) {
            for (const j in id) {
              if (list[i].order_id === id[j]) {
                //
                if (list[i].state === 8) {
                  order_sta.push(list[i].state)
                }
              }
            }
          }
          if (order_sta.length > 0) {
            data.order_id = that.checkModel
            this.$confirm('请确认,是否解锁选中的订单?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                unlockOrder(data)
                  .then(res => {
                    if (errorStatus(res.data)) {
                      this.$message.success(res.data.data)
                      that.getSalesInfo()
                    }
                  })
                  .catch(err => {
                    console.log('获取列表err', err)
                    this.$message.error('请求失败!')
                  })
              })
              .catch(() => {
                // console.log("取消停用");
              })
          } else {
            this.$confirm('选中订单的状态未锁定', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {})
          }
        }
      }
    },
    delOrders(scope, judgeId) {
      const that = this
      const data = {}
      if (judgeId === 1) {
        data.order_id = scope.order_id
        this.$confirm('请确认,是否删除订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delOrder(data)
              .then(res => {
                if (errorStatus(res.data)) {
                  if(this.currentPage!==1 && this.list.length===1){
                    this.currentPage=this.currentPage-1
                  }
                  that.getSalesInfo()
                  this.$message.success(res.data.data)
                }
              })
              .catch(err => {
                console.log('获取列表err', err)
                this.$message.error('请求失败!')
              })
          })
          .catch(() => {
            // console.log("取消停用");
          })
      } else {
        if (that.checkModel.length === 0) {
          this.$message.error('请选择要删除的订单!')
          return false
        } else {
          data.order_id = that.checkModel
          this.$confirm('请确认,是否删除选中的订单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              delOrder(data)
                .then(res => {
                  if (errorStatus(res.data)) {
                    if(this.currentPage!==1 && this.list.length===1){
                      this.currentPage=this.currentPage-1
                    }
                    that.getSalesInfo()
                    this.$message.success(res.data.data)
                  }
                })
                .catch(err => {
                  console.log('获取列表err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        }
      }
    },
    //运输报损
    frmLoss(scope){
    	console.log(scope);
      this.lossShow=true
      const data={}
      data.ord_id=scope.order_id
      this.addlossList.ord_number=scope.system_number
      this.addlossList.ord_id=scope.order_id
      getlossInfo(data)
        .then(res => {
         if (errorStatus(res.data)) {
              this.lossList=res.data.data
            }
          })
          .catch(err => {
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
    },
    getTemplateRow(){
      // alert(e)
    },
    //提交报损
    addLossBtn(){
      const data=this.addlossList
      // if(data.wl_id === ''){
      //   this.$message.error('该订单暂无运输物流信息!')
      //   return
      // }
      for(var i in this.lossList){
        if(data.wl_id === this.lossList[i].wl_id){
           if(data.ord_loss > this.lossList[i].wl_loss){
            this.$message.error('输入的运输报损数量不得大于可报损数量!')
            return
          }
        }
      }
      if(isNaN(data.ord_loss)){
          this.$message.error('运输报损数量只能输入数字!')
          return
      }
      if(data.ord_loss === ''){
        this.$message.error('报损数量不能为空!')
        return
      }
      if(data.remark === ''){
        this.$message.error('备注不能为空!')
        return
      }
       const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      lossOrder(data)
        .then(res => {
          loading.close()
          if (errorStatus(res.data)) {
              this.$message.success(res.data.data)
              this.lossShow=false
              this.addlossList.ord_loss=''
              this.addlossList.wl_id=''
              this.addlossList.remark=''
              this.radio=''
            }
          })
          .catch(err => {
            loading.close()
            console.log('获取列表err', err)
            this.$message.error('请求失败!')
          })
    },
    //选中报损
    toggleTab(id){
      this.addlossList.wl_id=id
    },
    compOrders(scope, judgeId) {
      const that = this
      const data = {}
      if (judgeId === 1) {
        data.order_id = scope.order_id
        this.$confirm('请确认是否完成订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            compOrder(data)
              .then(res => {
                if (errorStatus(res.data)) {
                  that.getSalesInfo()
                }
              })
              .catch(err => {
                console.log('获取列表err', err)
                this.$message.error('请求失败!')
              })
          })
          .catch(() => {
            // console.log("取消停用");
          })
      } else {
        if (that.checkModel.length === 0) {
          this.$message.error('请选择要完成的订单!')
        } else {
          data.order_id = that.checkModel
          this.$confirm('请确认是否完成订单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              compOrder(data)
                .then(res => {
                  if (errorStatus(res.data)) {
                    this.$message.success(res.data.data)
                    that.getSalesInfo()
                  }
                })
                .catch(err => {
                  console.log('获取列表err', err)
                  this.$message.error('请求失败!')
                })
            })
            .catch(() => {
              // console.log("取消停用");
            })
        }
      }
    },
    signforOrders(scope) {
      this.showAddSign = true
      this.signOrid = scope.order_id
    },
    addsignforOrderms() {
      this.allowAddImg = true
      this.signTime = null
      this.imgArr = ''
      this.showAddSign = false
    },
    addSigns() {
      if(this.imgArr == ''){
        this.$message.error('签收凭证不能为空')
        return
      }
      if(this.signTime == null){
        this.$message.error('签收时间不能为空')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.order_img = this.imgArr
      data.create_img = this.signTime
      data.order_id = this.signOrid
      // 搜索仓库
      signforOrder(data)
        .then(response => {
          // console.log(response)
          if (errorStatus(response.data)) {
            this.getSalesInfo()
            this.$message.success('签收成功!')
            // this.picURL=response.data.data
            this.showAddSign = false
          }
          loading.close()
        })
        .catch(err => {
          this.$message.error('请求失败!')
          loading.close()
          console.log('获取列表err', err)
        })
    },
    handleAvatarSuccess(res, file) {
      // console.log(res, file)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    enable() {
      this.$refs.attenceInput.click()
      // console.log(this.$refs.attenceInput)
    },
    // 触发上传图片事件
    fileClick() {
      document.getElementById('fileIpt').click()
    },
    // 上传图片
    changeImg(e) {
      const _this = this
      // 利用fileReader对象获取file
      var file = e.target.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        var imgcode = e.target.result
        _this.imgArr = imgcode
        _this.allowAddImg = false
      }
    },
    changeFile(e) {
      // console.log(e.target)
      this.attence = e.target.files[0].name
      this.attenceFile = e.target.files[0]
      const filename = this.attenceFile.name
      const arr = filename.split('.')
      if (arr[1] !== 'xls' && arr[1] !== 'xlsx') {
        this.$message.error("请导入文件格式为'xlsx'或者'xls'");
        return false
      }
      const fileData = new window.FormData()
      fileData.append('api_token', getToken())
      fileData.append('file', this.attenceFile)
      // console.log(fileData)
      const xhr = new window.XMLHttpRequest()
      const baseUrl = process.env.BASE_API
      // const str = baseUrl.replace('/public', '/public')
      xhr.open('POST', baseUrl + '/api/order/importorder', true)
      xhr.send(fileData)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          // console.log(xhr.readyState)
          if (xhr.status === 200) {
            this.$refs.attenceInput.value = ''
            // console.log(xhr.status)
            const response = JSON.parse(xhr.response)
            if (response.code === 200) {
              this.getSalesInfo()
              // console.log(this.$refs.attenceInput)
              this.$refs.attenceInput.value = ''
            } else {
              this.$message.error(response.data)
            }
          } else {
            const error = this.$emit('upload-error', xhr)
            if (error !== false) {
              console.log(error)
            }
          }
        }
      }
    },
    // doSth() {
    //   const that = this
    //   const api_token = getToken()
    //   const baseUrl = process.env.BASE_API
    //   that.api_url =
    //     baseUrl +
    //     '/api/order/orderexport?api_token=' +
    //     api_token +
    //     '&state=' +
    //     that.ordersList.state +
    //     '&create_start=' +
    //     that.ordersList.create_start +
    //     '&create_end=' +
    //     that.ordersList.create_end +
    //     '&complete_start=' +
    //     that.ordersList.complete_start +
    //     '&system_number=' +
    //     that.ordersList.system_number +
    //     '&plat_id=' +
    //     that.ordersList.plat_id +
    //     '&plat_number=' +
    //     that.ordersList.plat_number +
    //     '&goods_name=' +
    //     that.ordersList.goods_name +
    //     '&user_name=' +
    //     that.ordersList.user_name +
    //     '&user_tel=' +
    //     that.ordersList.user_tel +
    //     '&wl=' +
    //     that.ordersList.wl +
    //     '&remarks=' +
    //     that.ordersList.remarks

    //   return that.api_url
    // },

    seesignforOrder(scope) {
      // console.log(scope)
      this.signImage = scope
      this.showAddsignforOrder = true
      this.signImage.image=scope.image.replace('comstorage', 'com/storage')
    },
    addsignforOrderc() {
      this.showAddsignforOrder = false
    },
    resetForm(formList) {
      this.ordersList.tra_id = ''
      this.ordersList.create_start = '' // 订单创建—开始时间
      this.ordersList.create_end = '' // 订单创建—结束时间
      this.ordersList.complete_start = '' // 订单完结—开始时间
      this.ordersList.complete_end = '' // 订单完结—结束时间
      this.ordersList.system_number = '' // 系统单号
      this.ordersList.plat_id = '' // 平台id
      this.ordersList.plat_number = '' // 平台单号
      this.ordersList.goods_name = '' //	商品名称
      this.ordersList.user_name = '' // 客户名称
      this.ordersList.user_tel = '' //	客户电话
      this.ordersList.wl = '' // 物流消息
      this.ordersList.remarks = '' // 备注
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
// 展示图片
.over_box {
  width: 100%;
  height: 100%;
  opacity: 1;
  background: #000;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
  .over_close {
    position: fixed;
    right: 20px;
    top: 20px;
    width: 30px;
    height: 30px;
    color: red;
    z-index: 100001;
  }
  .lookDetailImg {
    position: absolute;
    z-index: 100001;
    margin: auto;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    max-width: 80%;
  }
}
// .showorder-dialog {
//   height: 100px;
// }
.open-more-inf {
  color: #409eff;
  cursor: pointer;
  &.red {
    color: red;
    display: inline-block;
  }
}
.btn-marg {
  display: block;
}
.app-orderListes {
  padding: 20px;
  p {
    padding: 0;
    margin: 0;
  }
  .primary-absolute {
    position: absolute;
    right: 0;
  }

  .sd-module-box {
    .sd-moudle-header {
      .sd-module-title {
        width: 30%;
      }
    }
    .orderListes-header {
      .orhead-state {
        display: flex;
        align-items: center;
        .orhead-states {
          padding: 0 10px;
        }
        .sd-module-btn {
          color: #666;
          .el-tab-order {
            display: inline-block;
            width: 80px;
            height: 34px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-align: center;
            line-height: 34px;
            cursor: pointer;
          }
          .el-tab-order.on {
            color: #409eff;
            border: 1px solid #409eff;
          }
        }
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
  .orderLine-one {
  }
  .orderLine-color {
    color: #fff;
    background-color: #409eff;
  }
  .orderLine-two {
    display: flex;
    flex-direction: row;
    .orderLine-classify {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 175px;
      border-right: 1px solid #c1c1c1;
      overflow: auto;
      .orderLine-voucher {
        color: #409eff;
        cursor: pointer;
        padding-top: 10px;
        span {
          border-bottom: 1px solid #409eff;
        }
      }
    }
  }
  .orderLine-btn {
    // height: 170px;
    overflow: auto;
  }
  .AddRamkerss {
    .el-dialog {
      .el-dialog__body {
        // padding: 0 !important;
        max-height: 200px;
        overflow: hidden;
        overflow-y: auto;
        ul {
          padding: 0;
          padding-left: 10px;
          margin: 0;
          li:nth-child(2n) {
            padding: 5px 0 20px 10px;
          }
        }
        .el-form-item__content {
          margin: 0;
          // margin: 20px 20px 0 20px;
          .el-textarea {
            width: 100%;
          }
        }
      }
    }
  }
  .AddSigns {
    .el-dialog {
      .el-dialog__body {
        padding: 0 !important;
        display: flex;
        justify-content: flex-start;
        .AddSigns-one {
          float: left;
          padding: 0 20px 0 10px;
          .AddSigns-onet {
            margin-top: 20px;
          }
          .AddSigns-oneq {
            margin-top: 20px;
          }
        }
        .AddSigns-two {
          height: 200px;
          .AddSigns-twot {
            margin-top: 10px;
          }
          .upload-img {
            .upload-img-bd {
              float: left;
              border: 1px dashed #ddd;
              width: 120px;
              height: 120px;
              cursor: pointer;
              &:hover {
                border: 1px dashed $blue;
              }
              .icon-add {
                width: 120px;
                height: 120px;
                line-height: 118px;
                text-align: center;
                display: block;
              }
              .ipt-add {
                display: none;
              }
            }
            .img-list {
              float: left;
              margin-right: 10px;
              .img_show_box {
                width: 120px;
                height: 120px;
                position: relative;
                img {
                  width: 120px;
                  height: 120px;
                }
                .img_delete {
                  position: absolute;
                  top: -5px;
                  right: -6px;
                  display: block;
                  width: 20px;
                  height: 20px;
                  font-size: 20px;
                  color: #f00;
                  cursor: pointer;
                }
              }
            }
          }
          .AddSigns-twoi {
            margin-top: 10px;
          }
        }
      }
    }
  }
  .AddSigncha {
    .el-dialog {
      .el-dialog__body {
        padding: 0 !important;
        display: flex;
        justify-content: flex-start;
        .AddSigns-one {
          float: left;
          padding: 0 20px 0 10px;
          .AddSigns-onet {
            margin-top: 20px;
          }
          .AddSigns-oneq {
            margin-top: 20px;
          }
        }
        .AddSigns-two {
          margin-bottom: 40px;
          .AddSigns-twot {
            margin-top: 10px;
          }

          .AddSigns-twoi {
            margin-top: 10px;
          }
        }
      }
      .img_show_boxs {
        margin-top: 10px;
        img {
          width: 150px;
          height: 150px;
        }
      }
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.lookDetailImg_box {
  position: relative;
  width: 100%;
  height: 100%;
  .lookDetailImg {
    max-width: 80%;
    max-height: 90%;
  }
}
.el_dia_goods {
  .table_goods {
    .goods_img {
      width: 45px;
      height: 45px;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.showorder-dialog {
  .el-dialog__body {
    max-height: 500px;
    overflow: hidden;
    overflow-y: auto;
  }
}
.el_dia_goods {
  .el-dialog__body {
    max-height: 300px;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.mainColor {
  color: $mainColor;
}
.el-dialog__body .list_data_add .tip_box{
    color: #f35e5e;
    font-size: 12px;
    line-height: 20px;
}
.el-dialog__body .list_data_add .download_text button{
    color: #409EFF;
    width: 120px;
}
.el-dialog__body .list_data_add .download_text[data-v-0910273e] {
    padding-left: 100px;
}

</style>
<style>
.el-form--inline .el-form-item {
    display: inline-block;
    margin-right: 10px;
    vertical-align: baseline !important;
}
.radiospamn{
  margin-right:20px;
}
.el-radio__input.is-checked+.el-radio__label {
    color: #409EFF;
}
</style>