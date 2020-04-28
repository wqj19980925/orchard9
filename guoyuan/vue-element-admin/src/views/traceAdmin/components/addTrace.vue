<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <el-form
      :inline="true"
      ref="formList"
      :model="formList"
      :rules="formRules"
      label-width="120px"
      class="lk-form-addGods"
    >
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">模板列表--{{ title }}</div>
        <div class="sd-module-btn">
          <el-button class="btn-mainCol" @click="submitInfo('formList')">保存</el-button>
          <el-button @click="back()">返回</el-button>
        </div>
      </div>
      <el-form-item label="模板名称" prop="fom_name">
        <el-input v-model="formList.fom_name" placeholder="请输入信息名称" class="w340" />
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
        <el-button class="up_img_btn" @click="addBtn(index)">新增</el-button>
      </el-form-item>
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="9" class="add-gods-title">信息名称</el-col>
        <el-col :span="6" class="add-gods-title">类型说明</el-col>
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
          <el-col :span="9">
            <el-input
              v-model="item.key"
              :disabled="item.disabled"
              :class="item.nothing1?'border-red':''"
              placeholder="普通文本，字数限制30"
              @blur="blurKey($event,index)"
              maxlength="30"
              v-if="!item.alllist"
            />
            <template v-else>
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
            </template>
          </el-col>
          <el-col :span="6" class="add-gods-title">
            <el-input
              v-model="item.value"
              :class="item.nothing2?'border-red':''"
              :placeholder="item.placeh"
              disabled
            />
          </el-col>
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
              :disabled="item.disabled"
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
            <div class="upload-img">
              <div v-if="allowAddImg" class="upload-img-bd">
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
              </div>
              <div v-else class="img-list">
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
              </div>
            </div>
          </div>
        </el-form-item> -->
        <div class="tip_box">此图片对消费者展示，请尽量选择符合标签名称的图片</div>
        <!--    <el-form-item label="图片列表" >
           <span class="infor-btn-red">此图片对消费者展示，请尽量选择符合标签名称的图片</span>
        </el-form-item>-->
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
      width="500px"
      class="attri_dialog"
      @close="cancleForm()"
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
            v-if="index>9"
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
  </el-row>
</template>
<script>
// import { addGoods,  } from '@/api/goods'
import {
  AddTemp,
  editTemp,
  searTemp,
  copyTemp,
  AddFormLabel
} from "@/api/trace";
import { errorStatus, parseTime } from "@/utils/index";
import { mapGetters } from "vuex";
import { phoneTest, validateURL } from "@/utils/validate";
import { getToken } from "@/utils/auth";
export default {
  name: "AddTrace",
  props: {
    editId: {
      type: Number,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: "新增",
      LocationCity: "正在定位",
      formList: {
        fom_name: "",
        fom_flaid: ""
      },
      formRules: {
        fom_title: []
      },
      tagList: [],
      yunCangList: [{ id: 1, name: "农资库" }, { id: 2, name: "商品库" }],
      selName: [],
      selecttype: 1,
      channelList: [],
      staffList: [],
      goodsList: [],
      materiaList: [],
      addImgShow: true,
      imgArr: [],
      imgAddArr: [],
      diaState: [{ id: 1, name: "启用" }, { id: 2, name: "停用" }],
      addClaRules: {
        fla_name: [
          { required: true, trigger: "blur", message: "溯源标签不能为空" }
          // { min: 1, max: 20, message: '分类名称过长,字数不可超过20', trigger: 'blur' }
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
          showText: "文本"
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
      chgId: [],
      chgVideoId: []
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  created() {
    this.getPageInfo();
  },
  methods: {
    getPageInfo() {
      const edit_id = this.editId;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (edit_id === 0) {
        this.title = "新增";
        this.searchInfo(this.selecttype);
      } else {
        if (this.edit) {
          this.title = "编辑";
        } else {
          this.title = "复制";
        }
        this.chgImg = false;
        this.chgVid = false;
        const data = {};
        data.fom_id = edit_id;
        data.type = 1;
        editTemp(data)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.searchInfo(1);
              this.formList.fom_name = dataRep.data.fom_name;
              this.formList.fom_flaid = dataRep.data.fom_flaid;
              const goDet = dataRep.data.fom_content;
              this.godsDetail = dataRep.data.fom_content;
              for (const i in goDet) {
                if (goDet[i].type < 11) {
                  this.$set(this.godsDetail[i], "alllist", false);
                  if (goDet[i].type === 1) {
                    this.$set(this.godsDetail[i], "showText", "文本");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "普通文本，字数限制30"
                    );
                  } else if (goDet[i].type === 2) {
                    this.$set(this.godsDetail[i], "showText", "超文本");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "超文本，不限制字符"
                    );
                  } else if (goDet[i].type === 3) {
                    this.$set(this.godsDetail[i], "showText", "网址");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "网址链接,类型如http://"
                    );
                  } else if (goDet[i].type === 4) {
                    this.$set(this.godsDetail[i], "showText", "电话");
                    this.$set(this.godsDetail[i], "placeh", "手机号码格式");
                  } else if (goDet[i].type === 5) {
                    this.$set(this.godsDetail[i], "showText", "图片");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "图片类型如.jpg,.png,.jpeg"
                    );
                  } else if (goDet[i].type === 6) {
                    this.$set(this.godsDetail[i], "showText", "视频");
                    this.$set(this.godsDetail[i], "placeh", "视频类型如.mp4等");
                  } else if (goDet[i].type === 7) {
                    this.$set(this.godsDetail[i], "showText", "时间");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "设备时间,系统补填"
                    );
                  } else if (goDet[i].type === 8) {
                    this.$set(this.godsDetail[i], "showText", "定位");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "地理定位,系统补填"
                    );
                  } else if (goDet[i].type === 9) {
                    this.$set(this.godsDetail[i], "showText", "溯源码");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "溯源码号,系统补填"
                    );
                  } else if (goDet[i].type === 10) {
                    this.$set(this.godsDetail[i], "showText", "用户");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "账号姓名,系统补填"
                    );
                  }
                } else if (goDet[i].type > 10) {
                  this.$set(this.godsDetail[i], "alllist", true);
                  if (goDet[i].type === 11) {
                    this.searchInfo("", i);
                    this.$set(this.godsDetail[i], "showText", "冷库");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "冷库列表,用户选填"
                    );
                    this.$set(
                      this.godsDetail[i],
                      "select",
                      this.godsDetail[i].key.id
                    );
                    this.$set(
                      this.godsDetail[i],
                      "key",
                      this.godsDetail[i].key.title
                    );
                  } else if (goDet[i].type === 12) {
                    this.searchInfo(4, i);
                    this.$set(this.godsDetail[i], "showText", "员工");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "员工列表,用户选填"
                    );
                    this.$set(
                      this.godsDetail[i],
                      "select",
                      this.godsDetail[i].key.id
                    );
                    this.$set(
                      this.godsDetail[i],
                      "key",
                      this.godsDetail[i].key.title
                    );
                  } else if (goDet[i].type === 13) {
                    this.searchInfo(3, i);
                    this.$set(this.godsDetail[i], "showText", "渠道");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "渠道列表,用户选填"
                    );
                    this.$set(
                      this.godsDetail[i],
                      "select",
                      this.godsDetail[i].key.id
                    );
                    this.$set(
                      this.godsDetail[i],
                      "key",
                      this.godsDetail[i].key.title
                    );
                  } else if (goDet[i].type === 14) {
                    this.searchInfo(5, i);
                    this.$set(this.godsDetail[i], "showText", "商品");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "商品列表,用户选填"
                    );
                    this.$set(
                      this.godsDetail[i],
                      "select",
                      this.godsDetail[i].key.id
                    );
                    this.$set(
                      this.godsDetail[i],
                      "key",
                      this.godsDetail[i].key.title
                    );
                  } else if (goDet[i].type === 15) {
                    this.searchInfo(2, i);
                    this.$set(this.godsDetail[i], "showText", "农资");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "农资列表,用户选填"
                    );
                    this.$set(
                      this.godsDetail[i],
                      "select",
                      this.godsDetail[i].key.id
                    );
                    this.$set(
                      this.godsDetail[i],
                      "key",
                      this.godsDetail[i].key.title
                    );
                  }
                }
              }
            }
          })
          .catch(Error => {
            loading.close();
          });
      }
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
              // if(this.editId===0){
              //   this.formList.fom_flaid=this.tagList[0].fla_name
              // }
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
      const edit_id = this.editId;
      const list = this.formList;
      console.log(this.formList);
      if (list.fom_name == "") {
        this.$message.error("请输入模板名称!");
        return false;
      }
      if (list.fom_flaid === "全部" || list.fom_flaid === 0 || list.fom_flaid == '') {
        list.fom_flaid = "";
        this.$message.error("请选择溯源标签!");
        return false;
      }
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
      for (const i in godsDetail) {
        this.$set(this.godsDetail[i], "nothing1", false);
        this.$set(this.godsDetail[i], "nothing2", false);
        if (godsDetail[i].key === "") {
          this.$message.error("请输入信息名称!");
          this.$set(this.godsDetail[i], "nothing1", true);
          return false;
        }
        if (godsDetail[i].type > 10) {
          for (var j = 0; j < this.godsDetail[i].selectlist.length; j++) {
            if (godsDetail[i].select === this.godsDetail[i].selectlist[j].id) {
              selname = godsDetail[i].selectlist[j].name;
              seltype = godsDetail[i].selectlist[j].type;
              infoname = godsDetail[i].key;
              selid = godsDetail[i].selectlist[j].id;
              console.log(selname, "99");
              allkey.push({
                id: selid,
                title: infoname,
                name: selname,
                type: seltype
              });
            }
          }
        } else {
          allkey.push(godsDetail[i].key);
        }
        info_content.push(godsDetail[i].value);
        info_show.push(godsDetail[i].show);
        info_type.push(godsDetail[i].type);
      }
      list.fomkey = allkey;
      list.fomvalue = info_content;
      list.fomshow = info_show;
      list.fomtype = info_type;
      console.log(list, "end");
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (this.title == '新增') {
        AddTemp(list)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.$emit("listerToChild", "addPage"); // 返回
              this.$message.success(dataRep.data);
              _this.$refs[formName].resetFields();
              const godsDetail = this.godsDetail;
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
      } else if(this.title == '编辑' || this.title == '复制') {
        list.fom_id = edit_id;
        if (this.title == '编辑') {
          editTemp(list)
            .then(response => {
              loading.close();
              const dataRep = response.data;
              if (errorStatus(dataRep)) {
                this.$message.success(dataRep.data);
                this.$emit("listerToChild", "addPage"); // 返回
              }
            })
            .catch(Error => {
              loading.close();
              console.log("Error=>", Error);
            });
        } else {
          copyTemp(list)
            .then(response => {
              loading.close();
              const dataRep = response.data;
              if (errorStatus(dataRep)) {
                this.$message.success("复制成功");
                this.$emit("listerToChild", "addPage"); // 返回
              }
            })
            .catch(Error => {
              loading.close();
              console.log("Error=>", Error);
            });
        }
      }
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
    // 返回
    back() {
      const editId = this.editId;
      const _this = this;
      if (editId === 0) {
        if (this.formList.fom_title !== "" || this.formList.fom_label !== "") {
          this.$confirm("溯源信息未保存, 确定离开?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              const godDet = this.godsDetail;
              const data = {};
              data.images = [];
              if (this.chgId.length > 0 || this.chgVideoId.length > 0) {
                for (const i in godDet) {
                  if (godDet[i].type === 6 || godDet[i].type === 7) {
                    data.images.push(godDet[i].value);
                  }
                  delImg(data).then(response => {
                    if (errorStatus(response.data)) {
                      this.$emit("listerToChild", "addPage");
                    }
                  });
                }
              } else {
                this.$emit("listerToChild", "addPage");
              }
            })
            .catch(() => {});
          return false;
        } else {
          const godDet = this.godsDetail;
          const data = {};
          data.images = [];
          const id = [];
          for (const i in godDet) {
            if (godDet[i].value !== "" || godDet[i].key !== "") {
              id.push(i);
              if (godDet[i].type === 6 || godDet[i].type === 7) {
                data.images.push(godDet[i].value);
              }
            }
          }
          if (id.length > 0) {
            this.$confirm("溯源信息未保存, 确定离开?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              if (data.images.length > 0) {
                delImg(data).then(response => {
                  if (errorStatus(response.data)) {
                    this.$emit("listerToChild", "addPage");
                    return false;
                  }
                });
              }
              this.$emit("listerToChild", "addPage");
            });
          } else {
            this.$emit("listerToChild", "addPage");
          }
        }
      } else {
        this.$confirm("溯源信息未保存, 确定离开?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (_this.chgImg || _this.chgVid) {
            if (_this.chgImg) {
              const godDet = this.godsDetail;
              const data = {};
              data.images = [];
              for (const i in godDet) {
                for (const j in _this.chgId) {
                  if (i == _this.chgId[j]) {
                    data.images.push(godDet[i].value);
                  }
                }
              }
              delImg(data).then(response => {
                if (errorStatus(response.data)) {
                  this.$emit("listerToChild", "addPage");
                }
              });
            }
            if (_this.chgVid) {
              const godDet = this.godsDetail;
              const data = {};
              data.video = [];
              for (const i in godDet) {
                for (const j in _this.chgVideoId) {
                  if (i == _this.chgVideoId[j]) {
                    data.video.push(godDet[i].value);
                  }
                }
              }
              delVideo(data).then(response => {
                if (errorStatus(response.data)) {
                  this.$emit("listerToChild", "addPage");
                }
              });
            }
          } else {
            this.$emit("listerToChild", "addPage");
          }
        });
      }
    },
    cancleForm(formName) {
      this.showAddClas = false;
      this.showAddBtnClas = false;
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
            } else {
              this.searchInfo(2, num);
              this.$set(this.godsDetail[num], "placeh", "农资列表,用户选填");
              this.$set(this.godsDetail[num], "showText", "农资");
              this.$set(this.godsDetail[num], "type", 15);
              console.log(this.godsDetail[num], "=");
            }
          }

          for (const j in this.typeSta) {
            this.$set(this.typeSta[j], "show", false);
            if (i === j) {
              this.$set(this.typeSta[j], "show", true);
            }
          }
          this.showAddClas = false;
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
            color: $light-blue;
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
            color: $light-blue;
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
            border: 1px solid $light-blue;
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
  .attri_dialog {
    .el-dialog__body {
      padding: 10px 0;
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
