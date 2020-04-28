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
        <div class="sd-module-title">信息列表--{{ title }}</div>
        <div class="sd-module-btn">
          <el-button class="btn-mainCol" @click="submitInfo('formList')">保存</el-button>
          <el-button @click="back()">返回</el-button>
        </div>
      </div>
      <el-form-item label="信息名称" prop="tem_title">
        <el-input v-model="formList.tem_title" placeholder="请输入信息名称" class="w340" />
      </el-form-item>
      <el-form-item label="溯源标签:" class="sd-form-item" prop="fla_id">
        <el-select v-model="formList.fom_flaid" class @change="findTag($event)">
          <el-option
            v-for="item in tagList"
            :key="item.fla_id"
            :label="item.fla_name"
            :value="item.fla_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="溯源模板:" class="sd-form-item" prop="fom_id" v-if="!formList.fom_flaid==''">
        <el-select v-model="formList.fom_id" class @change="findTemp($event)">
          <el-option
            v-for="item in tempList"
            :key="item.fom_id"
            :label="item.fom_name"
            :value="item.fom_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="信息可见性" style="width:500px" v-if="!formList.fom_flaid==''">
        <el-switch
          active-text="显示"
          inactive-text="隐藏"
          v-model="tem_show"
          @change="changeStatus($event)"
        ></el-switch>
      </el-form-item>
      <el-row :gutter="20" class="addGods-infor-box" v-if="!formList.fom_id==''">
        <el-col :span="3" class="add-gods-title">
          <span class="opre-btn">可见性</span>
        </el-col>
        <el-col :span="6" class="add-gods-title">标题名称</el-col>
        <el-col :span="9" class="add-gods-title">内容</el-col>
        <el-col :span="6" class="add-gods-title">类型</el-col>
      </el-row>
      <el-row :gutter="20" class="addGods-infor-box" v-if="!formList.fom_id==''">
        <div v-for="(item,index) in godsDetail" :key="index" class="addGods-infor-ipt clearfix">
          <el-col :span="3" class="add-gods-title">
            <el-button
              v-if="item.show===1"
              icon="el-icon-view"
              size="mini"
              @click="showOrHide(index,1)"
            />
            <el-button v-else size="mini" @click="showOrHide(index,2)">
              <svg-icon icon-class="hidden" class />
            </el-button>
          </el-col>
          <el-col :span="6" class="add-gods-title">
            <el-input
              v-model="item.key"
              :class="item.nothing1?'border-red':''"
              placeholder="普通文本，字数限制30"
              @blur="blurKey($event,index)"
              maxlength="30"
              disabled
            />
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
                  <el-input v-model="item.select" disabled :class="item.nothing1?'border-red':''" />
                </el-col>
                <el-col :span="12">
                  <el-select
                    v-model="item.value"
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
                    v-model="item.value"
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
                    v-model="item.value"
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
                    v-model="item.value"
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
                    v-model="item.value"
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
              </el-row>
            </template>
          </el-col>
          <el-col :span="6" class="add-gods-title">
            <el-input :placeholder="item.placeh" disabled maxlength="30" />
          </el-col>
        </div>
      </el-row>
    </el-form>
    <!-- 图片展示 -->
    <el-dialog
      :visible.sync="img.showImg"
      :close-on-click-modal="false"
      title="图片预览"
      width="400px"
      class="lookimg-dialog"
      @close="img.showImg=false"
    >
      <img :src="img.imgUrl" alt class="img-lookup" />
      <span slot="footer">
        <el-button type @click="activeUpload('null')">更换图片</el-button>
        <el-button type="primary" @click="img.showImg=false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 视频预览 -->
    <el-dialog
      :visible.sync="video.showImg"
      :close-on-click-modal="false"
      title="视频预览"
      width="400px"
      class="lookimg-dialog lookVideo-dialog"
      @close="video.showImg=false"
    >
      <video :src="video.imgUrl" class="video-lookup" controls="controls" />
      <span slot="footer">
        <el-button type @click="activeUpload('null')">更换视频</el-button>
        <el-button type="primary" @click="video.showImg=false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 损耗报备 -->
    <el-dialog
      :visible.sync="showTincy"
      title="多行文本"
      :close-on-click-modal="false"
      width="500px"
      @close="addClaTincy('addCla')"
    >
      <el-form ref="addCla" :model="addCla" :rules="rulesCla" prop="rep_name">
        <el-input
          type="textarea"
          :rows="8"
          v-model="addCla.textContent"
          style="width:100%"
          placeholder="请输入内容"
        />
      </el-form>
      <span slot="footer">
        <el-button @click="addClaTincy('addCla')">取 消</el-button>
        <el-button type="primary" @click="addTincyBtn('addCla')">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
// import { addGoods,  } from '@/api/goods'
import {
  AddInfo,
  editInfo,
  copyInfo,
  imgUp,
  videoUp,
  searInfo
} from "@/api/trace";
import { personal } from "@/api/system";
import { errorStatus, parseTime } from "@/utils/index";
import { mapGetters } from "vuex";
import { phoneTest, validateURL } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import BaiduMap from "vue-baidu-map/components/Map/Map.vue"; // 局部注册
import BmMarker from "vue-baidu-map/components/overlays/Marker.vue"; //标记 点
export default {
  name: "AddTrace",
  props: {
    editId: {
      type: Number,
      required: true
    },
    edit: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      addCla: {
        textContent: "",
        index: ""
      },
      rulesCla: {
        textContent: [
          { required: true, trigger: "blur", message: "超文本内容不能为空" }
        ]
      },
      showTincy: false,
      // adm_acc:'',//获取账号姓名
      title: "新增",
      LocationCity: "正在定位",
      formList: {
        tem_title: "",
        fom_flaid: "",
        fom_id: ""
      },
      tem_show: true, //可见性显示隐藏
      seltype: 2,
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
          textbut: "",
          video: "",
          img: "",
          showup: false,
          showTextTiny: false,
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
          valueId: "",
          show: 1,
          type: 1,
          nothing2: false,
          nothing1: false,
          disableIpt: true,
          placeh: "普通文本，字数限制30",
          showText: "文本",
          showBtn: false,
          matertype: ""
        }
      ],
      tempList: [],
      fileList: [],
      img_list: [],
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
        { text: "云仓列表", show: false },
        { text: "员工列表", show: false },
        { text: "渠道列表", show: false },
        { text: "商品列表", show: false },
        { text: "农资列表", show: false }
      ],
      Attribute: [
        { id: 1, text: "普通文本", icon: "documentation", attib: true },
        { id: 2, text: "超文本", icon: "documentation", attib: false },
        { id: 3, text: "网址链接", icon: "bindData", attib: false },
        { id: 4, text: "电话号码", icon: "in-ex-hale", attib: false },
        { id: 5, text: "上传图片", icon: "pic", attib: false },
        { id: 6, text: "上传视频", icon: "video", attib: false },
        { id: 7, text: "设备时间", icon: "date", attib: false },
        { id: 8, text: "地理定位", icon: "documentation", attib: false },
        { id: 9, text: "溯源码号", icon: "bindData", attib: false },
        { id: 10, text: "账号姓名", icon: "user-cog", attib: false },
        { id: 11, text: "云仓列表", icon: "pic", attib: false },
        { id: 12, text: "员工列表", icon: "video", attib: false },
        { id: 13, text: "渠道列表", icon: "in-ex-hale", attib: false },
        { id: 14, text: "商品列表", icon: "pic", attib: false },
        { id: 15, text: "农资列表", icon: "video", attib: false }
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
    this.city();
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
      // const mylist={}
      //  personal(mylist)
      //  .then(response => {
      //    const dataRep = response.data
      //    // console.log('获取列表', dataRep)
      //    if (errorStatus(dataRep)) {
      //      this.adm_acc = dataRep.admin.adm_acc
      //      }
      //  })
      //  .catch(Error => {
      //    this.$message.error('请求失败!')
      //  })
      if (edit_id === 0) {
        this.title = "新增";
        this.searchList(this.seltype);
      } else {
        if (this.edit === 1) {
          this.title = "编辑";
        } else {
          this.title = "复制";
        }
        this.searchList(2);
        this.chgImg = false;
        this.chgVid = false;
        const data = {};
        data.tem_id = edit_id;
        data.type = 1;
        editInfo(data)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              var model = dataRep.data_info.template;
              console.log(eval(model.tem_content), 11111);
              this.formList.fom_flaid = model.fom_flaid;
              this.formList.tem_title = model.tem_title;
              this.searchList(1, model.fom_flaid);
              this.formList.fom_id = dataRep.data_info.template.tem_fomid;
              this.godsDetail = eval(model.tem_content);
              const goDet = eval(model.tem_content);
              for (const i in goDet) {
                // console.log(goDet[i])
                if (Number(goDet[i].type) < 5) {
                  this.$set(this.godsDetail[i], "showTextTiny", false);
                  this.$set(this.godsDetail[i], "value", goDet[i].value);
                  this.$set(this.godsDetail[i], "disabled", false);
                  this.$set(this.godsDetail[i], "alllist", false);
                  this.$set(this.godsDetail[i], "showBtn", false);
                  this.$set(this.godsDetail[i], "key", goDet[i].key);
                  if (Number(goDet[i].type) === 1) {
                    this.$set(this.godsDetail[i], "showText", "文本");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "普通文本，字数限制30"
                    );
                  } else if (Number(goDet[i].type) === 2) {
                    this.$set(
                      this.godsDetail[i],
                      "textbut",
                      this.godsDetail[i].value
                    );
                    this.$set(this.godsDetail[i], "showText", "超文本");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "超文本, 不限制字符"
                    );
                    this.$set(this.godsDetail[i], "showBtn", true);
                    this.$set(this.godsDetail[i], "showTextTiny", true);
                    // this.addCla.textContent=goDet[i].value
                  } else if (Number(goDet[i].type) === 3) {
                    this.$set(this.godsDetail[i], "showText", "网址");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "网址链接,类型如http://"
                    );
                    this.$set(this.godsDetail[i], "value", goDet[i].value);
                  } else if (Number(goDet[i].type) === 4) {
                    this.$set(this.godsDetail[i], "showText", "电话");
                    this.$set(this.godsDetail[i], "placeh", "手机号码格式");
                  }
                } else if (
                  Number(goDet[i].type) === 5 ||
                  Number(goDet[i].type) === 6
                ) {
                  this.$set(this.godsDetail[i], "key", goDet[i].key);
                  this.$set(this.godsDetail[i], "showTextTiny", false);
                  const baseUrl = process.env.BASE_API;
                  const str = baseUrl.replace("public", "public/");
                  this.$set(this.godsDetail[i], "value", goDet[i].value);
                  this.$set(this.godsDetail[i], "showup", true);
                  this.$set(this.godsDetail[i], "showBtn", true);
                  this.$set(this.godsDetail[i], "disabled", false);
                  this.$set(this.godsDetail[i], "alllist", false);
                  if (Number(goDet[i].type) === 5) {
                    this.$set(this.godsDetail[i], "showText", "图片");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "图片类型如.jpg,.png,.jpeg"
                    );
                    this.$set(this.godsDetail[i], "img", str + goDet[i].value);
                  }
                  if (Number(goDet[i].type) === 6) {
                    this.$set(this.godsDetail[i], "showText", "视频");
                    this.$set(this.godsDetail[i], "placeh", "视频类型如.mp4等");
                    this.$set(
                      this.godsDetail[i],
                      "video",
                      str + goDet[i].value
                    );
                  }
                } else if (
                  Number(goDet[i].type) > 6 &&
                  Number(goDet[i].type) < 11
                ) {
                  this.$set(this.godsDetail[i], "key", goDet[i].key);
                  this.$set(this.godsDetail[i], "showTextTiny", false);

                  this.$set(this.godsDetail[i], "disabled", true);
                  this.$set(this.godsDetail[i], "showBtn", false);
                  this.$set(this.godsDetail[i], "alllist", false);
                  if (Number(goDet[i].type) === 7) {
                    this.$set(this.godsDetail[i], "disabled", true);
                    this.$set(this.godsDetail[i], "showText", "时间");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "设备时间,系统补填"
                    );
                    var date = new Date(); // 获取系统当前时
                    const time = parseTime(date);
                    this.$set(this.godsDetail[i], "value", time);
                  } else if (Number(goDet[i].type) === 8) {
                    this.$set(this.godsDetail[i], "value", goDet[i].value);
                    this.$set(this.godsDetail[i], "showText", "定位");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "地理定位,系统补填"
                    );
                  } else if (Number(goDet[i].type) === 9) {
                    this.$set(this.godsDetail[i], "value", goDet[i].value);
                    this.$set(this.godsDetail[i], "showText", "溯源码");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "溯源码号,系统补填"
                    );
                  } else if (Number(goDet[i].type) === 10) {
                    this.$set(this.godsDetail[i], "value", goDet[i].value);
                    this.$set(this.godsDetail[i], "showText", "用户");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "账号姓名,系统补填"
                    );
                    // this.$set(this.godsDetail[i], 'value', this.adm_acc)
                  }
                } else if (Number(goDet[i].type) > 10) {
                  this.$set(this.godsDetail[i], "showTextTiny", false);
                  this.$set(this.godsDetail[i], "disabled", false);
                  this.$set(this.godsDetail[i], "showBtn", false);
                  this.$set(this.godsDetail[i], "alllist", true);
                  this.$set(this.godsDetail[i], "select", goDet[i].key.name);
                  this.$set(this.godsDetail[i], "key", goDet[i].key.title);
                  this.$set(this.godsDetail[i], "valueId", goDet[i].key.id);
                  this.$set(this.godsDetail[i], "value", goDet[i].value.n_id);
                  if (Number(goDet[i].type) === 11) {
                    this.searchInfo(1, i, goDet[i].key.id);
                    this.$set(this.godsDetail[i], "showText", "云仓");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "云仓列表,用户选填"
                    );
                  } else if (Number(goDet[i].type) === 12) {
                    this.searchInfo(4, i, goDet[i].key.id);
                    this.$set(this.godsDetail[i], "showText", "员工");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "员工列表,用户选填"
                    );
                  } else if (Number(goDet[i].type) === 13) {
                    this.searchInfo(3, i, goDet[i].key.id);
                    this.$set(this.godsDetail[i], "showText", "渠道");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "渠道列表,用户选填"
                    );
                  } else if (Number(goDet[i].type) === 14) {
                    this.searchInfo(5, i, goDet[i].key.id);
                    this.$set(this.godsDetail[i], "showText", "商品");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "商品列表,用户选填"
                    );
                  } else if (Number(goDet[i].type) === 15) {
                    this.searchInfo(2, i, goDet[i].key.id);
                    this.$set(this.godsDetail[i], "showText", "农资");
                    this.$set(
                      this.godsDetail[i],
                      "placeh",
                      "农资列表,用户选填"
                    );
                    this.$set(
                      this.godsDetail[i],
                      "matertype",
                      goDet[i].key.type
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
    city() {
      //定义获取城市方法
      const geolocation = new BMap.Geolocation();
      var _this = this;
      geolocation.getCurrentPosition(
        function getinfo(position) {
          let city = position.address.city; //获取城市信息
          let province = position.address.province; //获取省份信息
          _this.LocationCity = city;
        },
        function(e) {
          _this.LocationCity = "定位失败";
        },
        { provider: "baidu" }
      );
    },
    searchList(seltype, val) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      if (seltype === 1) {
        data.fla_id = val;
      }
      data.type = seltype;
      AddInfo(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            loading.close();
            if (seltype === 2) {
              const gos = { fla_id: 0, fla_name: "全部" };
              const goo_cla = dataRep.data;
              goo_cla.unshift(gos);
              this.tagList = goo_cla;
              if (this.edit === 0) {
                this.formList.fom_flaid = this.tagList[0].fla_id;
              }
            } else if (seltype === 1) {
              this.tempList = dataRep.data_info;
            }
          } else {
            this.$message.error(dataRep.data);
            loading.close();
            this.formList.fom_id = "";
            this.formList.fom_flaid = "";
            return;
          }
        })
        .catch(err => {
          this.$message.error("请求失败!");
          console.log("获取列表err", err);
        });
    },
    changeStatus: function($event) {
      // this.formList.tem_show=$event
    },
    searchInfo(selecttype, num, id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.yunCangList = [];
      this.materiaList = [];
      this.channelList = [];
      this.staffList = [];
      this.goodsList = [];

      var staff = [],
        channel = [],
        mater = [],
        goodss = [],
        cloudware = [];
      const search = {};
      search.type = selecttype;
      if (selecttype === 1) {
        search.rep_type = id;
      }
      if (selecttype === 2) {
        search.acl_id = id;
      }
      if (selecttype === 3) {
        search.dla_id = id;
      }
      if (selecttype === 4) {
        search.sec_id = id;
      }
      if (selecttype === 5) {
        search.cla_id = id;
      }
      searInfo(search)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            loading.close();
            if (selecttype === 1) {
              //云仓
              const cloud = dataRep.data;
              for (var i = 0; i < cloud.length; i++) {
                cloudware.push({
                  id: dataRep.data[i].rep_id,
                  name: dataRep.data[i].rep_name
                });
              }
              this.yunCangList = cloudware;
              this.$set(this.godsDetail[num], "materia", false);
              this.$set(this.godsDetail[num], "yuncang", true);
              this.$set(this.godsDetail[num], "goods", false);
              this.$set(this.godsDetail[num], "channel", false);
              this.$set(this.godsDetail[num], "staff", false);
              // this.$set(this.godsDetail[i], 'yunCangList', this.yunCangList)
              this.$set(this.godsDetail[num], "selectlist", this.yunCangList);
              // console.log(this.yunCangList)
              console.log(this.godsDetail[i]);
            } else if (selecttype === 2) {
              //农资品类
              const agric = dataRep.data;
              for (var i = 0; i < agric.length; i++) {
                mater.push({
                  id: dataRep.data[i].agr_id,
                  name: dataRep.data[i].agr_name
                });
              }
              this.materiaList = mater;
              this.$set(this.godsDetail[num], "materia", true);
              this.$set(this.godsDetail[num], "yuncang", false);
              this.$set(this.godsDetail[num], "goods", false);
              this.$set(this.godsDetail[num], "channel", false);
              this.$set(this.godsDetail[num], "staff", false);
              // this.$set(this.godsDetail[i], 'materiaList', this.materiaList)
              this.$set(this.godsDetail[num], "selectlist", this.materiaList);
            } else if (selecttype === 3) {
              //渠道标签
              const ditch = dataRep.data;
              for (var i = 0; i < dataRep.data.length; i++) {
                channel.push({
                  id: dataRep.data[i].dit_id,
                  name: dataRep.data[i].dit_name
                });
              }
              this.channelList = channel;
              this.$set(this.godsDetail[num], "channel", true);
              this.$set(this.godsDetail[num], "materia", false);
              this.$set(this.godsDetail[num], "yuncang", false);
              this.$set(this.godsDetail[num], "goods", false);
              this.$set(this.godsDetail[num], "staff", false);
              // this.$set(this.godsDetail[i], 'channelList', this.channelList)
              this.$set(this.godsDetail[num], "selectlist", this.channelList);
            } else if (selecttype === 4) {
              //部门班组
              const section = dataRep.data;
              for (var i = 0; i < section.length; i++) {
                staff.push({
                  id: dataRep.data[i].off_id,
                  name: dataRep.data[i].off_name
                });
              }
              this.staffList = staff;
              this.$set(this.godsDetail[num], "channel", false);
              this.$set(this.godsDetail[num], "materia", false);
              this.$set(this.godsDetail[num], "yuncang", false);
              this.$set(this.godsDetail[num], "goods", false);
              this.$set(this.godsDetail[num], "staff", true);
              // this.$set(this.godsDetail[i], 'yunCangList', this.yunCangList)
              this.$set(this.godsDetail[num], "selectlist", this.staffList);
            } else if (selecttype === 5) {
              //商品品类
              const goods = dataRep.data;
              for (var i = 0; i < goods.length; i++) {
                goodss.push({
                  id: dataRep.data[i].goo_id,
                  name: dataRep.data[i].goo_name
                });
              }
              this.goodsList = goodss;
              this.$set(this.godsDetail[num], "channel", false);
              this.$set(this.godsDetail[num], "materia", false);
              this.$set(this.godsDetail[num], "yuncang", false);
              this.$set(this.godsDetail[num], "goods", true);
              this.$set(this.godsDetail[num], "staff", false);
              // this.$set(this.godsDetail[i], 'yunCangList', this.yunCangList)
              this.$set(this.godsDetail[num], "selectlist", this.goodsList);
            }
          }
        })
        .catch(Error => {
          loading.close();
        });
    },
    findTag(val) {
      this.formList.fom_id = "";
      if (val) {
        this.searchList(1, val);
      }
    },
    findTemp(val) {
      for (var i in this.tempList) {
        if (this.tempList[i].fom_id === val) {
          this.godsDetail = eval(this.tempList[i].fom_content);
          const goDet = eval(this.tempList[i].fom_content);
          // console.log(this.godsDetail)
          for (const i in goDet) {
            if (Number(goDet[i].type) < 5) {
              this.$set(this.godsDetail[i], "showBtn", false);
              this.$set(this.godsDetail[i], "alllist", false);
              this.$set(this.godsDetail[i], "disabled", false);
              this.$set(this.godsDetail[i], "showTextTiny", false);
              if (Number(goDet[i].type) === 1) {
                this.$set(this.godsDetail[i], "showText", "文本");
                this.$set(this.godsDetail[i], "placeh", "普通文本，字数限制30");
              } else if (Number(goDet[i].type) === 2) {
                this.$set(this.godsDetail[i], "showText", "超文本");
                this.$set(this.godsDetail[i], "placeh", "超文本，不限制字符");
                this.$set(this.godsDetail[i], "showBtn", true);
                this.$set(this.godsDetail[i], "showTextTiny", true);
              } else if (Number(goDet[i].type) === 3) {
                this.$set(this.godsDetail[i], "showText", "网址");
                this.$set(
                  this.godsDetail[i],
                  "placeh",
                  "网址链接,类型如http://"
                );
                this.$set(this.godsDetail[i], "value", "http://");
              } else if (Number(goDet[i].type) === 4) {
                this.$set(this.godsDetail[i], "showText", "电话");
                this.$set(this.godsDetail[i], "placeh", "手机号码格式");
              }
            } else if (
              Number(goDet[i].type) === 6 ||
              Number(goDet[i].type) === 5
            ) {
              this.$set(this.godsDetail[i], "showTextTiny", false);
              this.$set(this.godsDetail[i], "showBtn", true);
              this.$set(this.godsDetail[i], "showBtn", true);
              this.$set(this.godsDetail[i], "disabled", false);
              this.$set(this.godsDetail[i], "alllist", false);
              if (Number(goDet[i].type) === 5) {
                this.$set(this.godsDetail[i], "showText", "图片");
                this.$set(
                  this.godsDetail[i],
                  "placeh",
                  "图片类型如.jpg,.png,.jpeg"
                );
              }
              if (Number(goDet[i].type) === 6) {
                this.$set(this.godsDetail[i], "showText", "视频");
                this.$set(this.godsDetail[i], "placeh", "视频类型如.mp4等");
              }
            } else if (
              Number(goDet[i].type) > 6 &&
              Number(goDet[i].type) < 11
            ) {
              this.$set(this.godsDetail[i], "showTextTiny", false);
              this.$set(this.godsDetail[i], "showBtn", false);
              this.$set(this.godsDetail[i], "disabled", true);
              this.$set(this.godsDetail[i], "alllist", false);
              if (Number(goDet[i].type) === 7) {
                this.$set(this.godsDetail[i], "disabled", true);
                this.$set(this.godsDetail[i], "showText", "时间");
                this.$set(this.godsDetail[i], "placeh", "设备时间,系统补填");
                var date = new Date(); // 获取系统当前时
                const time = parseTime(date);
                // this.$set(this.godsDetail[i], 'value', time)
              } else if (Number(goDet[i].type) === 8) {
                this.$set(this.godsDetail[i], "showText", "定位");
                this.$set(this.godsDetail[i], "placeh", "地理定位,系统补填");
                this.$set(this.godsDetail[i], "value", "");
              } else if (Number(goDet[i].type) === 9) {
                this.$set(this.godsDetail[i], "showText", "溯源码");
                this.$set(this.godsDetail[i], "placeh", "溯源码号,系统补填");
                this.$set(this.godsDetail[i], "value", "");
              } else if (Number(goDet[i].type) === 10) {
                this.$set(this.godsDetail[i], "showText", "用户");
                this.$set(this.godsDetail[i], "placeh", "账号姓名,系统补填");
                // this.$set(this.godsDetail[i], 'value', this.adm_acc)
              }
            } else if (Number(goDet[i].type) > 10) {
              this.$set(this.godsDetail[i], "showTextTiny", false);
              this.$set(this.godsDetail[i], "showBtn", false);
              this.$set(this.godsDetail[i], "disabled", false);
              this.$set(this.godsDetail[i], "alllist", true);
              this.$set(this.godsDetail[i], "select", goDet[i].key.name);
              this.$set(this.godsDetail[i], "key", goDet[i].key.title);
              this.$set(this.godsDetail[i], "valueId", goDet[i].key.id);
              // this.$set(this.godsDetail[i], 'value', goDet[i].value.n_id)
              if (Number(goDet[i].type) === 11) {
                this.searchInfo(1, i, goDet[i].key.id);
                this.$set(this.godsDetail[i], "showText", "云仓");
                this.$set(this.godsDetail[i], "placeh", "云仓列表,用户选填");
              } else if (Number(goDet[i].type) === 12) {
                this.searchInfo(4, i, goDet[i].key.id);
                this.$set(this.godsDetail[i], "showText", "员工");
                this.$set(this.godsDetail[i], "placeh", "员工列表,用户选填");
              } else if (Number(goDet[i].type) === 13) {
                this.searchInfo(3, i, goDet[i].key.id);
                this.$set(this.godsDetail[i], "showText", "渠道");
                this.$set(this.godsDetail[i], "placeh", "渠道列表,用户选填");
              } else if (Number(goDet[i].type) === 14) {
                this.searchInfo(5, i, goDet[i].key.id);
                this.$set(this.godsDetail[i], "showText", "商品");
                this.$set(this.godsDetail[i], "placeh", "商品列表,用户选填");
              } else if (Number(goDet[i].type) === 15) {
                this.searchInfo(2, i, goDet[i].key.id);
                this.$set(this.godsDetail[i], "showText", "农资");
                this.$set(this.godsDetail[i], "placeh", "农资列表,用户选填");
                this.$set(this.godsDetail[i], "matertype", goDet[i].key.type);
              }
            }
          }
        }
      }
    },
    textTincy(index) {
      this.showTincy = true;
      this.addCla.index = index;
      this.addCla.textContent = this.godsDetail[index].textbut;
    },
    // 提交
    submitInfo(formName) {
      const edit_id = this.editId;
      const list = this.formList;
      // console.log(this.formList,'1234')
      if (list.tem_title == "") {
        this.$message.error("请输入信息名称!");
        return false;
      }
      if (list.fom_flaid === "全部" || list.fom_flaid === 0) {
        list.fom_flaid = "";
        this.$message.error("请选择溯源标签!");
        return false;
      }
      if (list.fom_id === "全部" || list.fom_id === 0) {
        list.fom_id = "";
        this.$message.error("请选择溯源模板!");
        return false;
      }
      if (this.edit !== 0) {
        list.tem_id = this.editId;
      }
      const godsDetail = this.godsDetail;
      const info_name = [];
      const info_content = [];
      const info_show = [];
      const info_type = [];
      const allkey = [];
      const allValue = [];
      var selname = null;
      var seltype = null;
      var selid = null;
      var infoname = null;
      var nextid = null;
      var nextname = null;

      for (const i in godsDetail) {
        if (godsDetail[i].type === 3) {
          var reg = new RegExp(
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
          );
          if (!reg.test(godsDetail[i].value)) {
            this.$message.error("请输入正确的网址!");
            return false;
          }
        }
        if (godsDetail[i].type === 4) {
          if (!/^1[3456789]\d{9}$/.test(godsDetail[i].value)) {
            this.$message.error("请输入正确的手机号码!");
            return false;
          }
        }
        this.$set(this.godsDetail[i], "nothing1", false);
        this.$set(this.godsDetail[i], "nothing2", false);
        if (
          godsDetail[i].value === "" &&
          godsDetail[i].type !== 7 &&
          godsDetail[i].type !== 8 &&
          godsDetail[i].type !== 9 &&
          godsDetail[i].type !== 10
        ) {
          this.$message.error("请输入内容!");
          this.$set(this.godsDetail[i], "nothing2", true);
          return false;
        }
        if (Number(godsDetail[i].type) > 10) {
          var datainfo = godsDetail[i];
          console.log(godsDetail[i].value, 66667);
          console.log(datainfo.selectlist, 23567890);
          // for(var j in datainfo.selectlist){
          //   if(godsDetail[i].value === datainfo.selectlist[j].id){
          //      nextname = datainfo.selectlist[j].name
          //      nextid=datainfo.selectlist[j].id
          //     }
          //   }

          // nextname = godsDetail[i].value
          selid = godsDetail[i].valueId;
          selname = godsDetail[i].select;
          seltype = godsDetail[i].matertype;
          infoname = godsDetail[i].key;
          nextid = godsDetail[i].value;
          for (var j in datainfo.selectlist) {
            if (Number(nextid) === Number(datainfo.selectlist[j].id)) {
              nextname = datainfo.selectlist[j].name;
            }
          }
          allkey.push({
            id: selid,
            title: infoname,
            name: selname,
            type: seltype
          });
          allValue.push({
            id: selid,
            name: selname,
            type: seltype,
            n_id: nextid,
            n_name: nextname
          });
          //   }

          // }
        } else if (Number(godsDetail[i].type) === 5) {
          allkey.push(godsDetail[i].key);
          allValue.push(godsDetail[i].img);
        } else if (Number(godsDetail[i].type) === 6) {
          allkey.push(godsDetail[i].key);
          allValue.push(godsDetail[i].video);
        } else {
          allkey.push(godsDetail[i].key);
          allValue.push(godsDetail[i].value);
        }
        // info_content.push(godsDetail[i].value)
        info_show.push(godsDetail[i].show);
        info_type.push(Number(godsDetail[i].type));
      }

      list.temkey = allkey;

      if (this.tem_show == true) {
        list.tem_show = 1;
      } else if (this.tem_show == false) {
        list.tem_show = 2;
      }
      list.temvalue = allValue;
      list.temshow = info_show;

      // console.log()
      list.temtype = info_type;
      // console.log(list,'end')
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (edit_id === 0 && this.edit == 0) {
        AddInfo(list)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.$emit("listerToChild", "addPage"); // 返回
              this.$message.success(dataRep.data);
              this.$refs[formName].resetFields();
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
      } else {
        list.fom_id = this.formList.fom_id;
        // console.log('list-新增', list)
        if (this.edit === 1) {
          editInfo(list)
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
          copyInfo(list)
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
    // 显示与隐藏
    showOrHide(index, num) {
      if (num === 1) {
        this.godsDetail[index].show = 2;
      } else if (num === 2) {
        this.godsDetail[index].show = 1;
      }
    },
    // 触发上传事件--更换图片
    activeUpload(index) {
      var upImgVideo = null;
      if (index !== "null") {
        this.gosDetInp = index;
        upImgVideo = Number(this.godsDetail[index].type);
      } else {
        const index = this.gosDetInp;
        upImgVideo = Number(this.godsDetail[index].type);
      }
      if (upImgVideo === 5) {
        document.getElementById("upFile").click();
      } else {
        // console.log('shipin')
        document.getElementById("videoForm").click();
        // document.getElementById("submit").click();
      }
    },
    // 触发上传图片事件
    fileClick() {
      document.getElementById("fileIpt").click();
      this.upImgSta = 1;
    },
    // 上传商品图片
    changeGoodsImg(e) {
      const _this = this;
      const imgArrList = _this.imgArr;
      // 利用fileReader对象获取file
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        var imgcode = e.target.result;
        // console.log(imgcode);
        const leng = imgArrList.length;
        imgArrList.splice(leng, 0, imgcode);
        // console.log('length--', leng)
        if (leng === 4) {
          _this.allowAddImg = false;
        }
      };
    },
    // 删除商品图片
    deleteGoodsImg(index) {
      // console.log('---', index)
      this.imgArr.splice(index, 1);
      if (this.imgArr.length < 5) {
        this.allowAddImg = true;
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

              // console.log('index---', index)
              // console.log('godsDetail--', _this.godsDetail)
              _this.$set(_this.godsDetail[index], "showup", true);
              _this.$set(_this.godsDetail[index], "value", img_path);
              // console.log('godsDetail--', _this.godsDetail)
              const baseUrl = process.env.BASE_API;
              const str = baseUrl.replace("public", "/public/");
              _this.img.imgUrl = str + img_path;
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
    // 查看图片
    lookImg(index) {
      // console.log('---', index)
      const upImgVideo = Number(this.godsDetail[index].type);
      this.gosDetInp = index;
      const baseUrl = process.env.BASE_API;
      const url = this.godsDetail[index].value;
      
      let str;
      if(url.indexOf('storage') != -1){
        str = this.baseurl.replace('public', '')
      }else{
        str = this.baseurl.replace('public', 'public/')
      }

      if (this.edit === 1) {
        if (upImgVideo === 5) {
          this.img.imgUrl = str + url;
          this.img.showImg = true;
        } else if (upImgVideo === 6) {
          this.video.imgUrl = str + url;
          this.video.showImg = true;
        }
      } else if (this.edit === 0) {
        if (upImgVideo === 5) {
          this.img.imgUrl = str + url;
          this.img.showImg = true;
        } else if (upImgVideo === 6) {
          this.video.imgUrl = str + url;
          this.video.showImg = true;
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
          _this.video.imgUrl = str + img_path;
          _this.godsDetail[index].video = str + img_path;
          _this.chgvid = true;
        }
      });
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
              // const godDet = this.godsDetail
              // const data = {}
              // data.images = []
              // if (this.chgId.length > 0 || this.chgVideoId.length > 0) {
              //   for (const i in godDet) {
              //     if (Number(godDet[i].type) === 6 || Number(godDet[i].type) === 5) {
              //       data.images.push(godDet[i].value)
              //     }
              //     delImg(data).then(response => {
              //       if (errorStatus(response.data)) {
              //         this.$emit('listerToChild', 'addPage')
              //       }
              //     })
              //   }
              // } else {
              this.$emit("listerToChild", "addPage");
              // }
            })
            .catch(() => {});
          return false;
        } else {
          // const godDet = this.godsDetail
          // const data = {};
          // data.images = [];
          // const id=[];
          // for (const i in godDet) {
          //   if (godDet[i].value !== ''||godDet[i].key !== '') {
          //     id.push(i);
          //     if (Number(godDet[i].type) === 6 || Number(godDet[i].type) === 5) {
          //       data.images.push(godDet[i].value);
          //     }
          //   }
          // }
          if (id.length > 0) {
            this.$confirm("溯源信息未保存, 确定离开?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              // if(data.images.length>0){
              //   delImg(data).then(response => {
              //     if (errorStatus(response.data)) {
              //       this.$emit('listerToChild', 'addPage');
              //       return false
              //     }
              //   })
              // }
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
          // if (_this.chgImg || _this.chgVid) {
          //   if (_this.chgImg) {
          //     const godDet = this.godsDetail
          //     const data = {}
          //     data.images = []
          //     for (const i in godDet) {
          //       for (const j in _this.chgId) {
          //         if (i == _this.chgId[j]) {

          //           data.images.push(godDet[i].value)
          //         }
          //       }
          //     }
          //     delImg(data).then(response => {
          //       if (errorStatus(response.data)) {
          //         this.$emit('listerToChild', 'addPage')
          //       }
          //     })
          //   }
          //   if (_this.chgVid) {
          //     const godDet = this.godsDetail
          //     const data = {}
          //     data.video = []
          //     for (const i in godDet) {
          //       for (const j in _this.chgVideoId) {
          //         if (i == _this.chgVideoId[j]) {
          //           data.video.push(godDet[i].value)
          //         }
          //       }
          //     }
          //     // delVideo(data).then(response => {
          //     //   if (errorStatus(response.data)) {
          //     //     this.$emit('listerToChild', 'addPage')
          //     //   }
          //     // })
          //   }
          // } else {
          this.$emit("listerToChild", "addPage");
          // }
        });
      }
    },
    addClaTincy(formName) {
      this.showTincy = false;
      this.addCla.textContent = "";
      // this.addCla.index=''
    },
    addTincyBtn(formName) {
      var _this = this;

      // this.addCla.index=''
      this.showTincy = false;
      var index = this.addCla.index;
      this.$set(_this.godsDetail[index], "value", this.addCla.textContent);
      this.$set(_this.godsDetail[index], "textbut", this.addCla.textContent);
      this.addCla.textContent = "";
      // alert(_this.godsDetail[index].value)
      // this.godsDetail[index].textbut
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
