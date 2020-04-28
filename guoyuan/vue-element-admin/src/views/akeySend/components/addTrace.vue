<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <el-radio-group v-model="radioInfo" @change="radiochangss">
      <el-radio-button label="添加信息"></el-radio-button>
      <el-radio-button label="选择模板"></el-radio-button>
    </el-radio-group>
    <el-form
      :inline="true"
      label-width="80px"
      ref="addClaThis"
      style="margin-top:10px;"
      v-if="radioInfo == '选择模板'"
    >
      <el-form-item label="标签名称" prop="fla_id">
        <el-select v-model="addClaThis.fla_id" @change="changeTag" filterable>
          <el-option
            v-for="item in tagList"
            :key="item.fla_id"
            :label="item.fla_name"
            :value="item.fla_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" prop="fom_id">
        <el-select
          v-model="addClaThis.fom_id"
          class
          @change="changeModel"
          @click.native="getSelect(1)"
        >
          <el-option
            v-for="item in modeList"
            :key="item.fom_id"
            :label="item.fom_name"
            :value="item.fom_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="搜索信息" prop="tem_id">
        <el-select
          v-model="addClaThis.tem_id"
          class
          @change="changeInfo"
          @click.native="getSelect(2)"
        >
          <el-option
            v-for="item in downAlList"
            :key="item.tem_id"
            :label="item.tem_title"
            :value="item.tem_id"
          />
        </el-select>
      </el-form-item>
      <el-row :gutter="20" class="addGods-infor-box" v-if="!addClaThis.tem_id==''">
        <div
          v-for="(item,index) in downInfoList"
          :key="index"
          class="addGods-infor-ipt clearfix"
          v-if="item.show===1"
        >
          <el-col :span="6">
            <!-- class="add-gods-title" -->
            <el-col :span="24">
              <span v-if="item.type<11">{{item.key}}</span>
              <span v-else>{{item.key.title}}</span>
            </el-col>
          </el-col>
          <el-col :span="18">
            <el-col :span="24" v-if="!item.alllist">
              <span v-if="item.type<5 ">{{item.value}}</span>
              <el-button
                v-if="item.type===5 || item.type===6"
                class="up_img_btn"
                type="primary"
                @click="lookImgs1(item)"
              >点击预览</el-button>
              <span v-if="item.type===7">完成时自动追加系统时间</span>
              <span v-if="item.type===7">{{item.value}}</span>
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
              <span v-if="item.type===15 && item.value.type===1 ">
                <span class="rightInfoWord">消耗数量</span>
                <el-input v-model="item.value.number" placeholder="请输入实际消耗农资数" style="width:180px" />
                <span class="red rightInfoWord">*库存量{{item.value.totalAll}}</span>
              </span>
            </el-col>
          </el-col>
        </div>
      </el-row>
    </el-form>
    <el-form
      :inline="true"
      ref="formList"
      :model="formList"
      :rules="formRules"
      label-width="120px"
      class="lk-form-addGods"
      v-if="radioInfo == '添加信息'"
    >
      <el-form-item label="信息名称" prop="tem_title">
        <el-input v-model="formList.tem_title" placeholder="请输入信息名称" class="w340" />
      </el-form-item>
      <el-form-item label="溯源标签:" class="sd-form-item" prop="fla_id">
        <el-select v-model="formList.fom_flaid" class>
          <el-option
            v-for="item in tagList"
            :key="item.fla_id"
            :label="item.fla_name"
            :value="item.fla_id"
          />
        </el-select>
        <el-button @click="addBtn(index)">新增</el-button>
      </el-form-item>
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="6" class="add-gods-title">信息名称</el-col>
        <el-col :span="9" class="add-gods-title">内容</el-col>
        <el-col :span="9" class="add-gods-title">
          <span class="opre-btn">上移</span>
          <span class="opre-btn">下移</span>
          <span class="opre-btn">显/隐</span>
          <span class="opre-btn">属性</span>
          <span class="opre-btn">删除</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="addGods-infor-box">
        <div v-for="(item,index) in godsDetail" :key="index" class="addGods-infor-ipt clearfix">
          <el-col :span="6">
            <el-input
              v-model="item.key"
              placeholder="信息名称"
              @blur="blurKey($event,index)"
              maxlength="30"
            />
            <!-- <template v-else>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input
                    v-model="item.key"
                    :disabled="item.disabled"
                    :class="item.nothing1?'border-red':''"
                    :placeholder="item.placeh"
                    maxlength="30"
                    @blur="blurKey($event,index)"
                  />
                </el-col>
                <el-col :span="12">
                  <el-select v-model="item.select" v-if="item.yuncang">
                    <el-option
                      v-for="item in yunCangList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      :type="item.type"
                    />
                  </el-select>
                  <el-select v-model="item.select" v-if="item.goods">
                    <el-option
                      v-for="item in goodsList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      :type="item.type"
                    />
                  </el-select>
                  <el-select v-model="item.select" v-if="item.channel">
                    <el-option
                      v-for="item in channelList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      :type="item.type"
                    />
                  </el-select>
                  <el-select v-model="item.select" v-if="item.staff">
                    <el-option
                      v-for="item in staffList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      :type="item.type"
                    />
                  </el-select>
                  <el-select v-model="item.select" v-if="item.materia">
                    <el-option
                      v-for="item in materiaList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      :type="item.type"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </template>-->
          </el-col>
          <el-col :span="9">
            <el-input
              maxlength="30"
              :placeholder="item.placeh"
              v-model="item.value"
              :disabled="item.disabled"
              :class="item.nothing2?'border-red':''"
              v-if="!item.alllist &&!item.showBtn&&!item.showTextTiny"
            />
            <el-button
              v-if="item.showBtn&&item.showTextTiny"
              class="up_img_btn"
              @click="textTincy(index)"
              style="width:310px"
            >点击查看</el-button>
            <el-button
              v-if="item.showBtn&&!item.showup&&!item.showTextTiny"
              class="up_img_btn"
              @click="activeUpload(index)"
              style="width:310px"
            >点击上传</el-button>
            <el-button
              v-if="item.showBtn&&item.showup&&!item.showTextTiny"
              class="up_img_btn"
              type="primary"
              @click="lookImg(index)"
              style="width:310px"
            >点击预览</el-button>
            <form id="formVdo" :action="baseurl+api" enctype="multipart/form-data" method="post">
              <input
                id="videoForm"
                type="file"
                name="video"
                style="display:none;"
                @change="changeImg($event)"
              />
              <input
                id="submit"
                type="submit"
                name="submit"
                style="display:none;"
                @click="submitVideo($event)"
              />
            </form>
            <input id="upFile" type="file" style="display:none;" @change="changeImg($event)" />
            <template v-if="item.alllist">
              <!-- 判断type是否是列表形式(11-15) -->
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-select
                    @change="searchNqysFun(item.type, item.value.id, item)"
                    v-model="item.value.id"
                    v-if="item.yuncang"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlist"
                      :key="item1.id"
                      :label="item1.name"
                      :value="item1.id"
                      :type="item.type"
                    />
                  </el-select>
                  <el-select
                    @change="searchNqysFun(item.type, item.value.id, item)"
                    v-model="item.value.id"
                    v-if="item.goods"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlist"
                      :key="item1.id"
                      :label="item1.name"
                      :value="item1.id"
                      :type="item1.type"
                    />
                  </el-select>
                  <el-select
                    @change="searchNqysFun(item.type, item.value.id, item)"
                    v-model="item.value.id"
                    v-if="item.channel"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlist"
                      :key="item1.id"
                      :label="item1.name"
                      :value="item1.id"
                      :type="item1.type"
                    />
                  </el-select>
                  <el-select
                    @change="searchNqysFun(item.type, item.value.id, item)"
                    v-model="item.value.id"
                    v-if="item.staff"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlist"
                      :key="item1.id"
                      :label="item1.name"
                      :value="item1.id"
                      :type="item1.type"
                    />
                  </el-select>
                  <el-select
                    @change="searchNqysFun(item.type, item.value.id, item)"
                    v-model="item.value.id"
                    v-if="item.materia"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlist"
                      :key="item1.id"
                      :label="item1.name"
                      :value="item1.id"
                      :type="item1.type"
                    />
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select
                    @change="serchNdyFun(item, item.valueId.n_id, 'rep_id', 'rep_name')"
                    v-model="item.valueId.n_id"
                    v-if="item.yuncang"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlistKey"
                      :key="item1.rep_id"
                      :label="item1.rep_name"
                      :value="item1.rep_id"
                      :type="item.type"
                    />
                  </el-select>
                  <el-select
                    @change="serchNdyFun(item, item.valueId.n_id , 'goo_id' ,'goo_name')"
                    v-model="item.valueId.n_id"
                    v-if="item.goods"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlistKey"
                      :key="item1.goo_id"
                      :label="item1.goo_name"
                      :value="item1.goo_id"
                      :type="item1.type"
                    />
                  </el-select>
                  <el-select
                    @change="serchNdyFun(item, item.valueId.n_id , 'dit_id' ,'dit_name')"
                    v-model="item.valueId.n_id"
                    v-if="item.channel"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlistKey"
                      :key="item1.dit_id"
                      :label="item1.dit_name"
                      :value="item1.dit_id"
                      :type="item1.type"
                    />
                  </el-select>
                  <el-select
                    @change="serchNdyFun(item, item.valueId.n_id , 'off_id' ,'off_name')"
                    v-model="item.valueId.n_id"
                    v-if="item.staff"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlistKey"
                      :key="item1.off_id"
                      :label="item1.off_name"
                      :value="item1.off_id"
                      :type="item1.type"
                    />
                  </el-select>
                  <el-select
                    @change="serchNdyFun(item, item.valueId.n_id , 'agr_id' ,'agr_name')"
                    v-model="item.valueId.n_id"
                    v-if="item.materia"
                    :class="item.nothing1?'border-red':''"
                  >
                    <el-option
                      v-for="item1 in item.selectlistKey"
                      :key="item1.agr_id"
                      :label="item1.agr_name"
                      :value="item1.agr_id"
                      :type="item1.type"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </template>
          </el-col>
          <!-- <el-col :span="9" class="add-gods-title">
            <el-input
              v-model="item.value"
              :class="item.nothing2?'border-red':''"
              :placeholder="item.placeh"
            />
          </el-col>-->
          <el-col :span="9" class="add-gods-title">
            <el-button icon="el-icon-arrow-up" size="mini" @click="upInfor(index)" />
            <el-button icon="el-icon-arrow-down" size="mini" @click="downInfor(index)" />
            <el-button
              v-if="item.show===1"
              icon="el-icon-view"
              size="mini"
              @click="showOrHide(index,1)"
            />
            <el-button v-else size="mini" @click="showOrHide(index,2)">
              <svg-icon icon-class="hidden" class />
            </el-button>
            <el-button
              v-for="(typeSta,ind) in typeSta"
              v-show="typeSta.show"
              :key="ind"
              size="mini"
              class="typeBtn"
              @click="choseType(ind,index)"
            >{{ item.showText }}</el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              class="btn-delete"
              @click="deleteInfo(index)"
            />
          </el-col>
        </div>
        <el-button class="add-goods-btn main-btn" @click="addInfor()">+ 增加信息项</el-button>
      </el-row>
    </el-form>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="showAddBtnClas"
      :title="AddClastitle"
      :close-on-click-modal="false"
      width="500px"
      @close="cancleForm('addClaForm')"
      append-to-body
    >
      <el-form
        :inline="true"
        ref="addClaForm"
        :model="addClaForm"
        :rules="addClaRules"
        label-width="80px"
      >
        <el-form-item label="溯源标签" prop="fla_name">
          <el-input
            v-model="addClaForm.fla_name"
            style="width:200px;"
            placeholder="请输入溯源标签"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="状态" prop="fla_state" style="width:300px">
          <el-select v-model="addClaForm.fla_state" class>
            <el-option v-for="item in diaState" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="图片列表" prop="goo_picurl" class="addGods-upload-img">
          <div class="company-logo-box">
            <div class="upload-img"> -->
              <!-- <div v-if="allowAddImg" class="upload-img-bd">
                <div class="add-img-box" @click="fileClick()">
                  <input
                    id="fileIpt"
                    type="file"
                    accept="image/*"
                    class="ipt-add"
                    @change="changeAddImg($event)"
                  />
                  <span class="icon-add el-icon-plus" />
                </div>
              </div> -->
              <!-- <div v-else class="img-list">
                <div class="img_show_box" @click="imgClick()">
                  <img :src="imgArr[0]" alt />
                  <input
                    id="fileIpt"
                    type="file"
                    accept="image/*"
                    class="ipt-add"
                    @change="changeAddImg($event)"
                  />
                </div>
              </div> -->
            </div>
          </div>
        <!-- </el-form-item> -->
        <!-- <div class="tip_box">此图片对消费者展示，请尽量选择符合标签名称的图片</div> -->
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addClaForm')">取 消</el-button>
        <el-button type="primary" @click="addTagBtn('addClaForm')">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="showAddClas"
      :close-on-click-modal="false"
      title="属性设置"
      width="550px"
      class="attri_dialog"
      @close="cancleForm()"
      append-to-body
    >
      <div class="attri_dia_box">
        <ul class="attri_dia_ul">
          <div class="roles-title">手动输入项</div>
          <li
            v-for="(item,index) in Attribute"
            :key="item.id"
            v-if="index<6"
            :class="item.attib?'atti_dia_li on':'atti_dia_li'"
            @click="choseAttr(index)"
          >
            <i class="icon_suces el-icon-circle-check" />
            <img :src="item.src" class="svg_icon" />
            <span class="icon-text">{{ item.text }}</span>
          </li>
          <div class="roles-title">系统补值</div>
          <li
            v-for="(item,index) in Attribute"
            :key="item.id"
            v-if="index>5&&index<10"
            :class="item.attib?'atti_dia_li on':'atti_dia_li'"
            @click="choseAttr(index)"
          >
            <i class="icon_suces el-icon-circle-check" />
            <!-- <svg-icon :icon-class="item.icon"class="svg_icon"/>  -->
            <img :src="item.src" class="svg_icon" />
            <span class="icon-text">{{ item.text }}</span>
          </li>
          <div class="roles-title">用户选填项</div>
          <li
            v-for="(item,index) in Attribute"
            :key="item.id"
            v-if="index > 9"
            :class="item.attib?'atti_dia_li on':'atti_dia_li'"
            @click="choseAttr(index)"
          >
            <i class="icon_suces el-icon-circle-check" />
            <img :src="item.src" class="svg_icon" />
            <span class="icon-text">{{ item.text }}</span>
          </li>
        </ul>
        <span v-show="showTip" class="red">提示:系统自动获取或生成的信息无法被修改或编辑</span>
      </div>
      <span slot="footer">
        <el-button @click="cancleForm()">取 消</el-button>
        <el-button type="primary" @click="addsubBtn()">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="showTincy"
      title="多行文本"
      :close-on-click-modal="false"
      width="500px"
      @close="cancleForm('addCla')"
      append-to-body
    >
      <el-form >
        <el-input
          type="textarea"
          :rows="8"
          v-model="textContent"
          style="width:100%"
          placeholder="请输入内容"
        />
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addCla')">取 消</el-button>
        <el-button type="primary" @click="addTincyBtn('addCla')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片展示 -->
      <el-dialog :visible.sync="img.showImg":close-on-click-modal="false"title="图片预览"width="400px"class="lookimg-dialog"@close="img.showImg=false" append-to-body>
        <img :src="img.imgUrl"alt class="img-lookup">
        <span slot="footer">
          <el-button type="primary"@click="img.showImg=false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 视频预览 -->
      <el-dialog :visible.sync="video.showImg":close-on-click-modal="false"title="视频预览"width="400px" height="340px"
        class="lookimg-dialog lookVideo-dialog"@close="video.showImg=false" append-to-body>
        <video :src="video.imgUrl"class="video-lookup"controls="controls"/>
        <span slot="footer">
          <el-button type="primary"@click="video.showImg=false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 图片展示 -->
      <el-dialog
        :visible.sync="imgs.showImg"
        :close-on-click-modal="false"
        title="图片预览"
        width="400px"
        class="lookimg-dialog"
        @close="imgs.showImg=false"
        append-to-body
      >
        <img :src="imgs.imgUrl" alt class="img-lookup" />
        <span slot="footer">
          <el-button type @click="activeUpload('null')">更换图片</el-button>
          <el-button type="primary" @click="imgs.showImg=false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 视频预览 -->
      <el-dialog
        :visible.sync="videos.showImg"
        :close-on-click-modal="false"
        title="视频预览"
        width="400px"
        class="lookimg-dialog lookVideo-dialog"
        @close="videos.showImg=false"
        append-to-body
      >
        <video :src="videos.imgUrl" class="video-lookup" controls="controls" />
        <span slot="footer">
          <el-button type @click="activeUpload('null')">更换视频</el-button>
          <el-button type="primary" @click="videos.showImg=false">关闭</el-button>
        </span>
      </el-dialog>
  </el-row>
</template>
<script>
// import { addGoods,  } from '@/api/goods'
import {
  AddTemp,
  editTemp,
  searTemp,
  copyTemp,
  AddFormLabel,
  akeyCodeing
} from "@/api/trace";
import {
  AddInfo,
  editInfo,
  copyInfo,
  imgUp,
  videoUp,
  searInfo
} from "@/api/trace";
import {
  getProdutInfo,
  seedlManage,
  editSeedlManage,
  searchAgricul,
  addAgricul,
  getOutInfo,
  addOutInfo,
  operList,
  harvestList,
  exprotPop,
  delOperecord,
  startPro,
  suspendPro,
  endPro,
  editEstOutput,
  editReap,
  editSeeding,
  reportLoss,
  editLoss,
  hideThisRec,
  showThisRec,
  getLevel,
  getStack,
  addStack,
  addAgrtasks,
  saveAgrtasks,
  searNewInfo,
  addNewInfo,
  searchUp,
  searchDown,
  searNursery,
  getLevelInfo,
  searchKc,
  editAgrtasks,
  editNewInfo,
  editAgricul,
  getEditLoss,
  editOutInfo,
  getEditOutInfo,
  recoverPro,
  getNumber,
  addProdut,
  delProdut,
  searchNqys
} from "@/api/ProductManage";
import { errorStatus, parseTime } from "@/utils/index";
import { mapGetters } from "vuex";
import { phoneTest, validateURL } from "@/utils/validate";
import { getToken } from "@/utils/auth";
export default {
  name: "AddTrace",
  props: ["scbhNum", "nhNum"],
  data() {
    return {
      title: "新增",
      LocationCity: "正在定位",
      formList: {
        fom_flaid: "",
        tem_title: ""
      },
      formRules: {
        fom_title: []
      },
      tagList: [],
      imgs: {
        showImg: false,
        imgUrl: ''
      },
      videos: {
        showImg: false,
        imgUrl: ""
      },
      yunCangList: [{ id: 1, name: "农资库" }, { id: 2, name: "商品库" }],
      selName: [],
      selecttype: 1,
      textContent: '',
      channelList: [],
      staffList: [],
      goodsList: [],
      materiaList: [],
      addImgShow: true,
      showTincy: false,
      imgArr: [],
      imgAddArr: [],
      diaState: [{ id: 1, name: "启用" }, { id: 2, name: "停用" }],
      addClaRules: {
        fla_name: [
          { required: true, trigger: "blur", message: "溯源标签不能为空" }
        ]
      },
      upImgShow: false,
      allowAddImg: true,
      img_List: "",
      goo_class: null,
      goo_formwork: null,
      dialogImageUrl: "",
      dialogVisible: false,
      AddClastitle: "",
      addClaForm: {
        fla_name: null,
        fla_state: null
      },
      fla_img: null,
      selectlist1: [],
      godsDetail: [
        {
          materia: false,
          goods: false,
          channel: false,
          staff: false,
          yuncang: false,
          selectlist: [],
          selectlistKey: [],
          name: "",
          mattype: "",
          alllist: false,
          select: "",
          key: "",
          value: "",
          show: 1,
          type: 1,
          nothing2: false,
          nothing1: false,
          disableIpt: true,
          placeh: "普通文本，字数限制30",
          showText: "文本",
          showBtn: false,
          showTextTiny: false,
          disabled: false,
          showup: false
        }
      ],
      fileList: [],
      img_list: [],
      showAddClas: false,
      showAddBtnClas: false,
      imgArr: [],
      showTip: false,
      typeSta: [
        { text: "文本", show: true },
        { text: "超文本", show: false },
        { text: "网址", show: false },
        { text: "电话", show: false },
        { text: "图片", show: false },
        { text: "视频", show: false },
        { text: "时间", show: false },
        { text: "定位", show: false },
        { text: "溯源码", show: false },
        { text: "用户", show: false },
        { text: "冷库列表", show: false },
        { text: "员工列表", show: false },
        { text: "渠道列表", show: false },
        { text: "商品列表", show: false },
        { text: "农资列表", show: false }
      ],
      Attribute: [
        {
          id: 1,
          text: "普通文本",
          src: "../../static/img/modelIcon/temp_icon_01.png",
          attib: true
        },
        {
          id: 2,
          text: "超文本",
          src: "../../static/img/modelIcon/temp_icon_02.png",
          attib: false
        },
        {
          id: 3,
          text: "网址链接",
          src: "../../static/img/modelIcon/temp_icon_03.png",
          attib: false
        },
        {
          id: 4,
          text: "电话号码",
          src: "../../static/img/modelIcon/temp_icon_04.png",
          attib: false
        },
        {
          id: 5,
          text: "上传图片",
          src: "../../static/img/modelIcon/temp_icon_05.png",
          attib: false
        },
        {
          id: 6,
          text: "上传视频",
          src: "../../static/img/modelIcon/temp_icon_06.png",
          attib: false
        },
        {
          id: 7,
          text: "设备时间",
          src: "../../static/img/modelIcon/temp_icon_07.png",
          attib: false
        },
        {
          id: 8,
          text: "地理定位",
          src: "../../static/img/modelIcon/temp_icon_08.png",
          attib: false
        },
        {
          id: 9,
          text: "溯源码号",
          src: "../../static/img/modelIcon/temp_icon_09.png",
          attib: false
        },
        {
          id: 10,
          text: "账号姓名",
          src: "../../static/img/modelIcon/temp_icon_10.png",
          attib: false
        },
        {
          id: 11,
          text: "冷库列表",
          src: "../../static/img/modelIcon/temp_icon_11.png",
          attib: false
        },
        {
          id: 12,
          text: "员工列表",
          src: "../../static/img/modelIcon/temp_icon_12.png",
          attib: false
        },
        {
          id: 13,
          text: "渠道列表",
          src: "../../static/img/modelIcon/temp_icon_13.png",
          attib: false
        },
        {
          id: 14,
          text: "商品列表",
          src: "../../static/img/modelIcon/temp_icon_14.png",
          attib: false
        },
        {
          id: 15,
          text: "农资列表",
          src: "../../static/img/modelIcon/temp_icon_15.png",
          attib: false
        }
      ],
      godsDet_index: null,
      upImgVideo: null,
      img: {
        showImg: false,
        imgUrl: ""
      },
      video: {
        showImg: false,
        imgUrl: ""
      },
      gosDetInp: null,
      baseurl: process.env.BASE_API,
      api: "/api/formwork/videoform",
      chgImg: false,
      chgVid: false,
      radioInfo: "添加信息",
      chgId: [],
      chgVideoId: [],
      addClaThis: {
        fla_id: "",
        tem_id: "",
        fom_id: ""
      },
      tagList: [],
      modeList: [],
      downAlList: [],
      downInfoList: [],
      addOneAgric: [],
      adm_acc:'',
      textarIndex: '',
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  created() {
    this.getPageInfo();
    this.$emit('setInfosdd', '添加信息')
    this.adm_acc = this.$store.getters.name
  },
  methods: {
    getPageInfo() {
      this.title = "新增";
      this.searchInfo(this.selecttype);
    },
    searchInfo(selecttype, num) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var staff = [],
        channel = [],
        mater = [],
        goodss = [];
      this.selectlist1 = [];
      const search = {};
      search.type = selecttype;
      if (!selecttype) {
        loading.close();
        this.selectlist1 = this.yunCangList;
        this.$set(this.godsDetail[num], "yuncang", true);
        this.$set(this.godsDetail[num], "materia", false);
        this.$set(this.godsDetail[num], "goods", false);
        this.$set(this.godsDetail[num], "channel", false);
        this.$set(this.godsDetail[num], "staff", false);
        this.$set(this.godsDetail[num], "selectlist", this.yunCangList);
        return;
      }
      searTemp(search)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            loading.close();
            if (selecttype === 1) {
              //溯源标签
              this.tagList = dataRep.data;
            } else if (selecttype === 2) {
              //农资品类
              const agric = dataRep.data;
              for (var i = 0; i < agric.length; i++) {
                mater.push({
                  id: dataRep.data[i].acl_id,
                  name: dataRep.data[i].acl_name,
                  type: dataRep.data[i].acl_type
                });
              }
              this.materiaList = mater;
              // this.selectlist1=this.materiaList
              this.$set(this.godsDetail[num], "materia", true);
              this.$set(this.godsDetail[num], "yuncang", false);
              this.$set(this.godsDetail[num], "goods", false);
              this.$set(this.godsDetail[num], "channel", false);
              this.$set(this.godsDetail[num], "staff", false);
              this.$set(this.godsDetail[num], "selectlist", this.materiaList);
            } else if (selecttype === 3) {
              //渠道标签
              const ditch = dataRep.data;
              for (var i = 0; i < dataRep.data.length; i++) {
                channel.push({
                  id: dataRep.data[i].dla_id,
                  name: dataRep.data[i].dla_name
                });
              }
              this.channelList = channel;
              // this.selectlist1=this.channelList
              this.$set(this.godsDetail[num], "channel", true);
              this.$set(this.godsDetail[num], "materia", false);
              this.$set(this.godsDetail[num], "yuncang", false);
              this.$set(this.godsDetail[num], "goods", false);
              this.$set(this.godsDetail[num], "staff", false);
              this.$set(this.godsDetail[num], "selectlist", this.channelList);
            } else if (selecttype === 4) {
              //部门班组
              const section = dataRep.data;

              for (var i = 0; i < section.length; i++) {
                staff.push({
                  id: dataRep.data[i].sec_id,
                  name: dataRep.data[i].sec_name
                });
              }
              this.staffList = staff;
              // this.selectlist1=this.staffList
              this.$set(this.godsDetail[num], "channel", false);
              this.$set(this.godsDetail[num], "materia", false);
              this.$set(this.godsDetail[num], "yuncang", false);
              this.$set(this.godsDetail[num], "goods", false);
              this.$set(this.godsDetail[num], "staff", true);
              this.$set(this.godsDetail[num], "selectlist", this.staffList);
            } else if (selecttype === 5) {
              //商品品类
              const goods = dataRep.data;
              for (var i = 0; i < goods.length; i++) {
                goodss.push({
                  id: dataRep.data[i].cla_id,
                  name: dataRep.data[i].cla_name
                });
              }
              this.goodsList = goodss;
              // this.selectlist1=this.goodsList
              this.$set(this.godsDetail[num], "channel", false);
              this.$set(this.godsDetail[num], "materia", false);
              this.$set(this.godsDetail[num], "yuncang", false);
              this.$set(this.godsDetail[num], "goods", true);
              this.$set(this.godsDetail[num], "staff", false);
              this.$set(this.godsDetail[num], "selectlist", this.goodsList);
            }
          }
        })
        .catch(Error => {
          loading.close();
        });
    },
    // 新增
    addBtn() {
      this.showAddBtnClas = true;
      this.AddClastitle = "新增标签";
    },
    fileClick() {
      document.getElementById("fileIpt").click();
    },
    imgClick() {
      document.getElementById("fileIpt").click();
    },
    // 上传商品图片
    changeAddImg(e) {
      const _this = this;
      _this.imgAddArr = [];
      const imgArrList = _this.imgArr;
      // 利用fileReader对象获取file
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        var imgcode = e.target.result;
        _this.fla_img = imgcode;

        const leng = imgArrList.length;
        imgArrList.splice(leng, 0, imgcode);
        _this.allowAddImg = false;
      };
    },
    addTagBtn(formName) {
      const addClas = this.addClaForm;
      const data = {};
      if (this.addClaForm.fla_name == null) {
        this.$message.error("请输入标签名称!");
        return false;
      }
      if (this.addClaForm.fla_state == null) {
        this.$message.error("请选择状态!");
        return false;
      }
      data.fla_name = this.addClaForm.fla_name;
      data.fla_state = this.addClaForm.fla_state;
      data.fla_img = this.fla_img;
      AddFormLabel(data)
        .then(response => {
          if (errorStatus(response.data)) {
            this.$message.success("提交成功!");
            this.$refs[formName].resetFields();
            this.showAddBtnClas = false;
            this.imgAddArr = [];
            this.allowAddImg = true;
            this.getPageInfo();
          }
        })
        .catch(err => {
          console.log("err", err);
          this.$message.error("请求失败!");
        });
    },
    // 提交
    submitInfo(formName) {
      const _this = this;
      const list = this.formList;
      console.log(this.formList);
      if (list.tem_title == "") {
        this.$message.error("请输入信息名称!");
        return false;
      }
      if (list.fom_flaid === "") {
        list.fom_flaid = "";
        this.$message.error("请选择溯源标签!");
        return false;
      }
      console.log(this.godsDetail,'this.godsDetail;')
      const godsDetail = this.godsDetail;
      const info_name = [];
      const info_content = [];
      const info_show = [];
      const info_type = [];
      const allkey = [];
      var selname = null;
      var seltype = null;
      var selid = null;
      var infoname = null;
      console.log(godsDetail,'godsDetail====')
      for (const i in godsDetail) {
        this.$set(this.godsDetail[i], "nothing1", false);
        this.$set(this.godsDetail[i], "nothing2", false);
        if (godsDetail[i].key === "") {
          this.$message.error("请输入信息名称!");
          return false;
        }
        if(godsDetail[i].type != 7 && godsDetail[i].type != 8 && godsDetail[i].type != 9 && godsDetail[i].type != 10 && godsDetail[i].type != 2){
          if (godsDetail[i].value === "") {
            this.$message.error("请输入信息内容!");
            return false;
          }
        }
        if (godsDetail[i].type > 10) {
          let obj = {
            title: godsDetail[i].key,
            name: godsDetail[i].value.name,
            id: godsDetail[i].value.id,
            type: godsDetail[i].types,
          }
          allkey.push(obj)
          let obj1 = {
            id: godsDetail[i].value.id,
            name: godsDetail[i].value.name,
            type: godsDetail[i].types,
            n_id: godsDetail[i].valueId.n_id,
            n_name: godsDetail[i].valueId.n_name,
          }
          info_content.push(obj1);
        } else {
          allkey.push(godsDetail[i].key);
          info_content.push(godsDetail[i].value);
        }
        
        info_show.push(godsDetail[i].show);
        info_type.push(godsDetail[i].type);
      }

      list.temkey = allkey;
      list.temvalue = info_content;
      list.temshow = info_show;
      list.temtype = info_type;
      list.type = 7;
      list.pro_id = this.scbhNum;
      list.far_id = this.nhNum;

      console.log(list, "end");
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      akeyCodeing(list)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.$emit("listerToChild", "addPage"); // 返回
            this.$message.success(dataRep.data);
            _this.$refs[formName].resetFields();
            const godsDetail = this.godsDetail;
            this.$emit("setInfosdd", 1);
            for (const i in godsDetail) {
              this.godsDetail[i].key = "";
              this.godsDetail[i].value = "";
              this.godsDetail.splice(i, 1);
            }
          }
          loading.close();
        })
        .catch(Error => {
          // this.$message.error("提交请求失败!");
          console.log("err--", Error);
          loading.close();
        });
    },
    // 增加
    addInfor() {
      const godsDetail = this.godsDetail;
      const detail = {
        alllist: false,
        select: "",
        key: "",
        value: "",
        show: 1,
        type: 1,
        selectlist: [],
        selectlistKey: [],
        nothing2: false,
        nothing1: false,
        disableIpt: true,
        placeh: "普通文本，字数限制30",
        showText: "文本"
      };
      const leng = godsDetail.length;
      this.$set(this.godsDetail, leng, detail);
    },
    // 删除
    deleteInfo(index) {
      // const goDet = this.godsDetail
      if (index === 0) {
        this.$message.error("不可删除!");
        return false;
      } else {
        this.godsDetail.splice(index, 1);
      }
    },
    // 显示与隐藏
    showOrHide(index, num) {
      if (num === 1) {
        this.godsDetail[index].show = 2;
      } else if (num === 2) {
        this.godsDetail[index].show = 1;
      }
    },
    // 上移
    upInfor(index) {
      if (index === 0) {
        return false;
      }

      const index_0 = index - 1;
      const goodsDetail = this.godsDetail;
      const infor = goodsDetail[index];
      const infor_0 = goodsDetail[index_0];
      this.$set(this.godsDetail, index, infor_0);
      this.$set(this.godsDetail, index_0, infor);
    },
    // 下移
    downInfor(index) {
      const leng = this.godsDetail.length - 1;
      const godsDetail = this.godsDetail;
      if (index === leng) {
        return false;
      }
      const index_0 = index + 1;
      const infor = godsDetail[index];
      const infor_0 = godsDetail[index_0];
      this.$set(this.godsDetail, index, infor_0);
      this.$set(this.godsDetail, index_0, infor);
    },
    // 选择类型
    choseType(index, num) {
      this.showAddClas = true;
      this.godsDet_index = num;
      this.upImgVideo = index;
    },
    // 选择类型--设置属性
    choseAttr(index) {
      this.showTip = false;
      const num = index;
      if (num > 5 && num < 10) {
        this.showTip = true;
      }

      // this.Attribute[num].attib=true;
      for (const i in this.Attribute) {
        this.$set(this.Attribute[i], "attib", false);
      }
      // if (num === 1 || num === 2) {
      //   this.showTip = true
      // }
      this.$set(this.Attribute[num], "attib", true);
    },
    cancleForm(formName) {
      this.showAddClas = false;
      this.showAddBtnClas = false;
      this.showTincy = false
      this.textContent = ''
      if (formName) {
        this.$refs[formName].resetFields();
      }
      this.imgArr = [];
      this.allowAddImg = true;
    },
    // 弹窗-增加-提交
    addsubBtn() {
      const attrList = this.Attribute;
      const num = this.godsDet_index;
      for (const i in attrList) {
        if (attrList[i].attib === true) {
          this.upImgVideo = i;
          if (i === "0" || i === "1" || i === "2") {
            // this.$set(this.godsDetail[num], "key", "");
            this.$set(this.godsDetail[num], "select", "");
            this.$set(this.godsDetail[num], "alllist", false);
            if (i === "0") {
              this.$set(this.godsDetail[num], "placeh", "普通文本，字数限制30");
              this.$set(this.godsDetail[num], "showText", "文本");
              this.$set(this.godsDetail[num], "type", 1);
            } else if (i === "1") {
              this.$set(this.godsDetail[num], "placeh", "超文本，不限制字符");
              this.$set(this.godsDetail[num], "showText", "超文本");
              this.$set(this.godsDetail[num], "type", 2);
            } else {
              this.$set(
                this.godsDetail[num],
                "placeh",
                "网址链接,类型如http://"
              );
              this.$set(this.godsDetail[num], "showText", "网址");
              this.$set(this.godsDetail[num], "type", 3);
            }
          } else if (i === "3" || i === "4" || i === "5") {
            // this.$set(this.godsDetail[num], "key", "");
            this.$set(this.godsDetail[num], "select", "");
            this.$set(this.godsDetail[num], "alllist", false);
            if (i === "3") {
              this.$set(this.godsDetail[num], "placeh", "手机号码格式");
              this.$set(this.godsDetail[num], "showText", "电话");
              this.$set(this.godsDetail[num], "type", 4);
            } else if (i === "4") {
              this.$set(
                this.godsDetail[num],
                "placeh",
                "图片类型如.jpg,.png,.jpeg"
              );
              this.$set(this.godsDetail[num], "showText", "图片");
              this.$set(this.godsDetail[num], "type", 5);
            } else {
              this.$set(this.godsDetail[num], "placeh", "视频类型如.mp4等");
              this.$set(this.godsDetail[num], "showText", "视频");
              this.$set(this.godsDetail[num], "type", 6);
            }
          } else if (i === "6" || i === "7" || i === "8" || i === "9") {
            // this.$set(this.godsDetail[num], "key", "");
            this.$set(this.godsDetail[num], "select", "");
            this.$set(this.godsDetail[num], "alllist", false);
            if (i === "6") {
              this.$set(this.godsDetail[num], "placeh", "设备时间,系统补填");
              this.$set(this.godsDetail[num], "showText", "时间");
              this.$set(this.godsDetail[num], "type", 7);
            } else if (i === "7") {
              this.$set(this.godsDetail[num], "placeh", "地理定位,系统补填");
              this.$set(this.godsDetail[num], "showText", "定位");
              this.$set(this.godsDetail[num], "type", 8);
            } else if (i === "8") {
              this.$set(this.godsDetail[num], "placeh", "溯源码号,系统补填");
              this.$set(this.godsDetail[num], "showText", "溯源码");
              this.$set(this.godsDetail[num], "type", 9);
            } else {
              this.$set(this.godsDetail[num], "placeh", "账号姓名,系统补填");
              this.$set(this.godsDetail[num], "showText", "用户");
              this.$set(this.godsDetail[num], "type", 10);
            }
          } else {
            this.$set(this.godsDetail[num], "alllist", true);
            // this.$set(this.godsDetail[num], "key", "");
            this.$set(this.godsDetail[num], "select", "");
            if (i === "10") {
              this.searchInfo("", num);
              this.$set(this.godsDetail[num], "placeh", "冷库列表,用户选填");
              this.$set(this.godsDetail[num], "showText", "冷库");
              this.$set(this.godsDetail[num], "type", 11);
            } else if (i === "11") {
              this.searchInfo(4, num);
              this.$set(this.godsDetail[num], "placeh", "员工列表,用户选填");
              this.$set(this.godsDetail[num], "showText", "员工");
              this.$set(this.godsDetail[num], "type", 12);
            } else if (i === "12") {
              this.searchInfo(3, num);
              this.$set(this.godsDetail[num], "placeh", "渠道列表,用户选填");
              this.$set(this.godsDetail[num], "showText", "渠道");
              this.$set(this.godsDetail[num], "type", 13);
            } else if (i === "13") {
              this.searchInfo(5, num);
              this.$set(this.godsDetail[num], "placeh", "商品列表,用户选填");
              this.$set(this.godsDetail[num], "showText", "商品");
              this.$set(this.godsDetail[num], "type", 14);
              // this.$set(this.godsDetail[num], 'selectlist', this.goodsList)
            } else {
              this.searchInfo(2, num);
              this.$set(this.godsDetail[num], "placeh", "农资列表,用户选填");
              this.$set(this.godsDetail[num], "showText", "农资");
              this.$set(this.godsDetail[num], "type", 15);
            }
          }

          let k = Number(i) + 1;
          if (Number(k) < 5) {
            this.$set(this.godsDetail[num], "showBtn", false);
            this.$set(this.godsDetail[num], "alllist", false);
            this.$set(this.godsDetail[num], "disabled", false);
            this.$set(this.godsDetail[num], "showTextTiny", false);
            if (Number(k) === 1) {
              this.$set(this.godsDetail[num], "showText", "文本");
              this.$set(this.godsDetail[num], "placeh", "普通文本，字数限制30");
            } else if (Number(k) === 2) {
              this.$set(this.godsDetail[num], "showText", "超文本");
              this.$set(this.godsDetail[num], "placeh", "超文本，不限制字符");
              this.$set(this.godsDetail[num], "showBtn", true);
              this.$set(this.godsDetail[num], "showTextTiny", true);
            } else if (Number(k) === 3) {
              this.$set(this.godsDetail[num], "showText", "网址");
              this.$set(
                this.godsDetail[num],
                "placeh",
                "网址链接,类型如http://"
              );
              this.$set(this.godsDetail[num], "value", "http://");
            } else if (Number(k) === 4) {
              this.$set(this.godsDetail[num], "showText", "电话");
              this.$set(this.godsDetail[num], "placeh", "手机号码格式");
            }
          } else if (Number(k) === 6 || Number(k) === 5) {
            this.$set(this.godsDetail[num], "showTextTiny", false);
            this.$set(this.godsDetail[num], "showBtn", true);
            this.$set(this.godsDetail[num], "showBtn", true);
            this.$set(this.godsDetail[num], "disabled", false);
            this.$set(this.godsDetail[num], "alllist", false);
            if (Number(k) === 5) {
              this.$set(this.godsDetail[num], "showText", "图片");
              this.$set(
                this.godsDetail[num],
                "placeh",
                "图片类型如.jpg,.png,.jpeg"
              );
            }
            if (Number(k) === 6) {
              this.$set(this.godsDetail[num], "showText", "视频");
              this.$set(this.godsDetail[num], "placeh", "视频类型如.mp4等");
            }
          } else if (Number(k) > 6 && Number(k) < 11) {
            this.$set(this.godsDetail[num], "showTextTiny", false);
            this.$set(this.godsDetail[num], "showBtn", false);
            this.$set(this.godsDetail[num], "disabled", true);
            this.$set(this.godsDetail[num], "alllist", false);
            if (Number(k) === 7) {
              this.$set(this.godsDetail[num], "disabled", true);
              this.$set(this.godsDetail[num], "showText", "时间");
              this.$set(this.godsDetail[num], "placeh", "设备时间,系统补填");
              var date = new Date(); // 获取系统当前时
              const time = parseTime(date);
            } else if (Number(k) === 8) {
              this.$set(this.godsDetail[num], "showText", "定位");
              this.$set(this.godsDetail[num], "placeh", "地理定位,系统补填");
              this.$set(this.godsDetail[num], "value", "");
            } else if (Number(k) === 9) {
              this.$set(this.godsDetail[num], "showText", "溯源码");
              this.$set(this.godsDetail[num], "placeh", "溯源码号,系统补填");
              this.$set(this.godsDetail[num], "value", "");
            } else if (Number(k) === 10) {
              this.$set(this.godsDetail[num], "showText", "用户");
              this.$set(this.godsDetail[num], "placeh", "账号姓名,系统补填");
            }
          } else if (Number(k) > 10) {
            this.$set(this.godsDetail[num], "showTextTiny", false);
            this.$set(this.godsDetail[num], "showBtn", false);
            this.$set(this.godsDetail[num], "disabled", false);
            this.$set(this.godsDetail[num], "alllist", true);

            this.$set(this.godsDetail[num], "select", '');
            this.$set(this.godsDetail[num], "types", '');
            this.$set(this.godsDetail[num], "value", {
              id: '',
              name: '',
            });
            this.$set(this.godsDetail[num], "valueId", {
              n_id: '',
              n_name: '',
            });
            console.log(this.godsDetail[num],'this.godsDetail[num]')
          }

          for (const j in this.typeSta) {
            this.$set(this.typeSta[j], "show", false);
            if (i === j) {
              this.$set(this.typeSta[j], "show", true);
            }
          }
          this.showAddClas = false;
          console.log(this.godsDetail[num], "-=-=-=");
        }
      }
    },
    blurKey(e, index) {
      const val = e.target.value;
      if (val === "") {
        this.$set(this.godsDetail[index], "nothing1", true);
      } else {
        this.$set(this.godsDetail[index], "nothing1", false);
      }
    },
    textTincy(index) {
      this.showTincy = true;
      this.textarIndex = index;
      this.textContent = this.godsDetail[index].value;
    },
    // 触发上传事件--更换图片
    activeUpload(index) {
      var upImgVideo = null;
      if (index !== "null") {
        this.gosDetInp = index;
        upImgVideo = Number(this.godsDetail[index].type);
      } 
      // else {
      //   const index = this.gosDetInp;
      //   upImgVideo = Number(this.godsDetail[index].type);
      // }
      if (upImgVideo === 5) {
        document.getElementById("upFile").click();
      } else {
        document.getElementById("videoForm").click();
      }
    },
    // 查看图片
    lookImg(index) {
      const upImgVideo = Number(this.godsDetail[index].type);
      this.gosDetInp = index;
      const baseUrl = process.env.BASE_API;
      const url = this.godsDetail[index].value;
      // if (this.edit === 1) {
        const str = baseUrl
        if (upImgVideo === 5) {
          this.imgs.imgUrl = str + '/' + url;
          this.imgs.showImg = true;
        } else if (upImgVideo === 6) {
          this.videos.imgUrl = str + '/' + url;
          this.videos.showImg = true;
        }
      // } else if (this.edit === 0) {
      //   const str = baseUrl.replace("public", "/public/");
      //   if (upImgVideo === 5) {
      //     this.imgs.imgUrl = str + url;
      //     this.imgs.showImg = true;
      //   } else if (upImgVideo === 6) {
      //     this.videos.imgUrl = str + url;
      //     this.videos.showImg = true;
      //   }
      // }
    },
    // 选择模板的查看图片
    lookImgs1(item) {
      const baseUrl = process.env.BASE_API;
      const str = baseUrl.replace("public", "");
      if(item.type == 5){
        this.img.showImg = true;
        this.img.imgUrl = str + item.value;
      }
      if(item.type == 6){
        this.video.showImg = true;
        this.video.imgUrl = str + item.value;
      }
    },
    // 上传产品信息下图片
    changeImg(e) {
      const _this = this;
      // const imgArrList = _this.imgArr
      const index = _this.gosDetInp;
      const upImgVideo = Number(_this.godsDetail[index].type);
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
        _this.chgId.splice(_this.chgId.length, 0, index);
        // 编辑上传
        if (_this.editId !== 0) {
          _this.chgImg = true;
        }

        reader.onload = function(e) {
          // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
          var imgcode = e.target.result;
          const data = {};
          data.images = imgcode;

          data.oldimage = _this.godsDetail[index].value;
          imgUp(data).then(response => {
            const dataRep = response.data;
            // console.log('----', dataRep)
            if (errorStatus(dataRep)) {
              const index = _this.gosDetInp;
              const img_path = dataRep.path;
              var imgtype = img_path.toString().split(".");

              _this.$set(_this.godsDetail[index], "showup", true);
              _this.$set(_this.godsDetail[index], "value", img_path);
              const baseUrl = process.env.BASE_API;
              const str = baseUrl.replace("public", "/public/");
              _this.imgs.imgUrl = str + img_path;
              _this.godsDetail[index].img = str + img_path;
            }
          });
        };
      } else if (upImgVideo === 6) {
        // console.log('777777')
        document.getElementById("submit").click();
        _this.chgVideoId.splice(_this.chgVideoId.length, 0, index);
        // 编辑上传
        if (_this.editId !== 0) {
          _this.chgVid = true;
        }
      }
    },
    // 上传视频
    submitVideo(e) {
      const _this = this;
      e.preventDefault(); // 取消默认行为
      const videoObj = document.getElementById("videoForm");

      const formData = new FormData();
      // console.log('视频上传--', videoObj.files[0])

      formData.append("video", videoObj.files[0]);
      formData.append("api_token", getToken());
      // console.log('formData', formData)
      const index = _this.gosDetInp;

      videoUp(formData).then(response => {
        // console.log('response--', response)
        const dataRep = response.data;
        // console.log('----', dataRep)
        if (errorStatus(dataRep)) {
          const img_path = dataRep.videoSrc;
          // console.log('index---', index)
          // console.log('godsDetail--', _this.godsDetail)
          _this.$set(_this.godsDetail[index], "showup", true);
          _this.$set(_this.godsDetail[index], "value", img_path);
          // console.log('godsDetail--', _this.godsDetail)
          const baseUrl = process.env.BASE_API;
          const str = baseUrl.replace("public", "public/");
          _this.videos.imgUrl = str + img_path;
          _this.godsDetail[index].video = str + img_path;
          _this.chgvid = true;
        }
      });
    },
    changeTag(e) {
      this.getAddInfo(2, e);
      this.addClaThis.fom_id = "";
      this.addClaThis.tem_id = "";
    },
    changeModel(e) {
      this.getAddInfo(3, e);
      this.addClaThis.tem_id = "";
      this.$forceUpdate();
    },
    //搜索模板信息
    changeInfo(e) {
      for (var j in this.downAlList) {
        if (e === this.downAlList[j].tem_id) {
          this.infoseaList = this.downAlList[j];
          console.log(this.infoseaList, 'this.infoseaList')
          for (var i in this.infoseaList) {
            this.downInfoList = eval(this.infoseaList.tem_content);
            const goDet = eval(this.infoseaList.tem_content);
            for (const j in goDet) {
              if (goDet[j].type === 15 && goDet[j].key.type === 1) {
                this.searchTotal(goDet[j].value.n_id, j);
                this.existConsum = true;
              }
            }
          }
        }
      }
      this.$forceUpdate();
    },
    //搜索库存量
    searchTotal(id, index) {
      const data = {};
      data.agr_id = id;
      data.far_id = this.nhNum;
      searchKc(data)
        .then(res => {
          if (errorStatus(res.data)) {
            if (this.agriOneShow === true) {
              this.$set(
                this.addOneAgric[index].value,
                "totalAll",
                res.data.data
              );
            } else {
              this.$set(
                this.downInfoList[index].value,
                "totalAll",
                res.data.data
              );
            }
          }
        })
        .catch(err => {
          console.log("获取列表err", err);
          this.$message.error("请求失败!");
        });
    },
    //新增信息获取
    getAddInfo(type, id, ownId) {
      const data = {};
      if (type === 2) {
        data.fla_id = id;
      }
      if (type === 3) {
        data.fom_id = id;
      }
      data.type = type;
      searNewInfo(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            if (type === 1) {
              this.tagList = dataRep.data;
              if (this.edit) {
                for (var i in this.tagList) {
                  if (Number(ownId) === this.tagList[i].fla_id) {
                    this.addClaThis.fla_id = this.tagList[i].fla_id;
                  }
                }
                // this.addClaThis.fla_id =  ownId//标签id
              }
            }
            if (type === 2) {
              this.modeList = dataRep.data;
              if (this.edit) {
                for (var i in this.modeList) {
                  if (Number(ownId) === this.modeList[i].fom_id) {
                    this.addClaThis.fom_id = this.modeList[i].fom_id;
                  }
                }
              }
            }
            if (type === 3) {
              this.downAlList = dataRep.data;
              for (var i in this.downAlList) {
                if (Number(ownId) === this.downAlList[i].tem_id) {
                  this.addClaThis.tem_id = this.downAlList[i].tem_id;
                }
              }
            }
          }
        })
        .catch(err => {
          this.$message.error("请求失败!");
        });
    },
    getSelect(listType) {
      if (listType === 1) {
        if (!this.addClaThis.fla_id) {
          this.$message.error("请先选择标签名称");
        }
      }
      if (listType === 2) {
        if (!this.addClaThis.fom_id) {
          this.$message.error("请先选择模板名称");
        }
      }
      if (listType === 3) {
        if (this.addClaNum.far_id === "" || !this.addClaNum.far_id) {
          this.$message.error("请先选择农户姓名");
        }
      }
      if (listType === 5) {
        if (this.addClaNum.cla_id === "" || !this.addClaNum.cla_id) {
          this.$message.error("请先选择商品分类");
        }
      }
      if (listType === 6) {
        if (this.addClaNum.goo_id === "" || !this.addClaNum.goo_id) {
          this.$message.error("请先选择商品名称");
        }
      }
    },
    //新增--提交
    addAgriClaBtn(formName){
      const data = {}
      data.fla_id=this.addClaThis.fla_id
      data.fom_id=this.addClaThis.fom_id
      data.tem_id=this.addClaThis.tem_id
      data.far_id=this.nhNum
      for(var k in this.downAlList){
        if(this.addClaThis.tem_id === this.downAlList[k].tem_id){
          data.tem_title=this.downAlList[k].tem_title
        }
      }
      data.pro_id=this.scbhNum
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
        if(Number(downInfoList[i].type) === 15 && downInfoList[i].value.type === 1){
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
      data.type = 8
      akeyCodeing(data)
        .then(res => {
          if (errorStatus(res.data)) {
            this.$message.success('新增成功')
            this.$emit('setInfosdd', 1)
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
          this.$message.error('请求失败!')
        })    
    },
    radiochangss() {
      this.$emit('setInfosdd', this.radioInfo)
    },
    // 搜索信息
    searchNqysFun(type, id, item) {
      console.log(type, id)
      for(let i in item.selectlist){
        if(item.selectlist[i].id == id){
          item.value.name = item.selectlist[i].name
          if(type == 15){
            item.types = item.selectlist[i].type
            console.log(item)
          }
        }
      }
      console.log(type,'type')
      console.log(item)
      
      const data = {}
      if(type == 11){
        data.rep_type = id
        data.type = 1
      }else if(type == 12){
        data.sec_id = id
        data.type = 4
      }else if(type == 13){
        data.dla_id = id
        data.type = 3
      }else if(type == 14){
        data.cla_id = id
        data.type = 5
      }else if(type == 15){
        data.acl_id = id
        data.type = 2
      }
      searchNqys(data)
      .then(res => {
        if(errorStatus(res.data)){
          item.selectlistKey = res.data.data
        }
      })
    },
    // 检索1
    serchNdyFun(item, id, idTex, natext) {
      for(let i in item.selectlistKey){
        if(item.selectlistKey[i][idTex] == id){
          item.valueId.n_name = item.selectlistKey[i][natext];
        }
      }
      
    },
    // 提交多行文本
    addTincyBtn() {
      let index = this.textarIndex
      this.godsDetail[index].value = this.textContent
      this.showTincy = false
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
@import "src/styles/mixin.scss";
.lk-addGoods-box {
  .lk-form-addGods {
    .addGods-infor-box {
      padding: 15px 0 0 20px;
      width: 900px;
      .add-gods-title {
        text-align: center;
        .opre-btn {
          padding: 0 10px;
        }
        .typeBtn {
          width: 56px;
          text-align: center;
          padding: 7px 0;
        }
      }
      .addGods-infor-ipt {
        // height: 58px;
        line-height: 56px;
        .add-gods-title {
          .btn_svg {
            width: 14px;
            height: 13px;
            color: #777;
          }
          .up_img_btn {
            width: 310px;
            height: 36px;
          }
        }
      }
      .add-goods-btn.main-btn {
        margin: 10px 15px 0 0;
        float: right;
      }
    }
  }
  .lookimg-dialog {
    &.lookVideo-dialog {
      padding: 15px 20px;
    }
    .img-lookup {
      width: 240px;
      height: 150px;
      margin: auto;
      display: block;
    }
    .video-lookup {
      width: 340px;
      height: 150px;
      margin: auto;
      display: block;
    }
  }
}
.attri_dialog {
  .el-dialog__body {
    padding: 10px 0;
  }
  .attri_dia_box {
    .attri_dia_ul {
      @include clearfix;
      padding: 0 20px;
      margin-bottom: 5px;
      .atti_dia_li {
        float: left;
        width: 100px;
        height: 90px;
        position: relative;
        z-index: 1;
        margin: 0 14px 10px 0;
        .icon_suces {
          display: none;
          color: #c0c4cc;
          position: absolute;
          top: -4px;
          right: -4px;
          z-index: 6;
        }
        .svg_icon {
          width: 45px;
          height: 45px;
          font-size: 30px;
          display: block;
          color: #c0c4cc;
          position: absolute;
          left: 50%;
          margin-left: -23px;
          top: 8%;
          z-index: 0;
        }
        .icon-text {
          margin-top: 59px;
          line-height: 30px;
          text-align: center;
          width: 100%;
          display: block;
        }

        &.on {
          border: 1px solid #c0c4cc;
          .icon_suces {
            display: block;
          }
        }
      }
    }
    .red {
      margin-left: 40px;
      font-size: 12px;
    }
  }
}
.attri_dialog {
  .el-dialog__body {
    padding: 10px 0;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" >
.lk-addGoods-box {
  .lk-form-addGods {
    padding-top: 10px;
    .el-form-item__label {
      padding-right: 40px;
      font-size: 16px;
    }
    .el-input.is-disabled .el-input__inner {
      color: #666;
      &::-webkit-input-placeholder {
        /* WebKit browsers 适配谷歌 */
        color: #c0c4cc;
      }
    }
    .addGods-infor-box {
      .addGods-infor-ipt {
        .border-red {
          .el-input__inner {
            border: 1px solid red !important;
          }
        }
      }
      .add-gods-title {
        i {
          font-weight: 800;
        }
      }
    }
  }
  .lookimg-dialog {
    .el-dialog__footer {
      // text-align: center;
    }
  }
  .lookVideo-dialog {
    .el-dialog__body {
      padding: 15px 20px;
    }
  }
}
</style>
<style>
.Divisionline {
  width: 100%;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}
.switchThisTab {
  position: relative;
}
.tabRightBut {
  position: absolute;
  right: 100px;
  top: 1px;
}
.tabRightBut1 {
  position: absolute;
  right: 10px;
  top: 1px;
}
.rightInfoWord {
  font-size: 13px;
}
.rightInfoWord a {
  margin-left: 50px;
}
.startThisPro {
  width: 120px;
  height: 100px;
  background: #000000;
}
.EndThisPro {
  width: 120px;
  height: 40px;
  background: #e6a23c;
}
.recovery {
  background: #67c23a;
}
.overThis {
  background: #000000;
  margin-top: 15px;
  margin-left: 0px !important;
}
.personBut {
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  background-color: #fff;
  width: 75px;
  height: 60px;
  display: inline-block;
  font-size: 13px;
}
.staffChoice label {
  width: 85px !important;
  height: 60px !important;
}
.personBut p {
  width: 80px;

  margin: 8px -20px;
}
.staffChoice {
  float: left;
  text-align: center;
}
.main {
  width: 475px;
}
.addGods-infor-ipt {
  line-height: 40px;
}
.up_img_btn {
  width: 230px;
  height: 35px;
}
.img-lookup,
.video-lookup {
  width: 100%;
  height: 160px;
  margin: auto;
  display: block;
}
.blue {
  cursor: pointer;
}
.recoversty {
  margin-top: 20px;
  font-size: 14px;
}
.topbuton {
  float: right;
  padding: 0px 20px;
  margin: 0;
}
.topbuton .el-button {
  border-radius: 4px;
  padding: 8px 6px;
}
.noDatain {
  margin-top: 50px;
  height: 100px;
  font-size: 17px;
}
.blankcontent {
  width: 100%;
  height: 600px;
  overflow: hidden;
  margin: 0;
  position: absolute;
  background: #fff;
}
.blankcontent div {
  margin-top: 50px;
}
.numselect {
  width: 200px;
}
.rightInfoWord1 {
  font-size: 13px;
  margin-top: 20px;
}
.infonameclass {
  float: left;
}
.roles-title {
  border-left: 1px solid #1d92c9;
  padding: 2px 0 2px 26px;
  font-size: 16px;
  width: 100%;
  float: left;
}
.upload-img-bd {
  float: left;
  border: 1px dashed #ddd;
  width: 165px;
  height: 90px;
  cursor: pointer;
}
.icon-add {
  width: 165px;
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
.tip_box {
  margin-left: 80px;
  color: #f35e5e;
  font-size: 12px;
  line-height: 20px;
  font-color: #f56c6c;
}
.img_show_box {
  width: 120px;
  height: 120px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
img {
  width: 100%;
  height: 100%;
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
</style>
