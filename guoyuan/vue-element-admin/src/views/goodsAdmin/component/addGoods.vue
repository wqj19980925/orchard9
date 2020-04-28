<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <el-form
      ref="formList"
      :model="formList"
      :rules="formRules"
      label-width="150px"
      class="lk-form-addGods"
    >
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">{{ title }}商品</div>
        <div class="sd-module-btn">
          <el-button class="btn-mainCol" @click="submitInfo('formList')">保&nbsp;&nbsp;存</el-button>
          <el-button @click="back()">返&nbsp;&nbsp;回</el-button>
        </div>
      </div>
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="商品名称:" class="sd-form-item" prop="goo_name">
            <el-input
              style="width:80%;"
              v-model="formList.goo_name"
              placeholder="请输入商品名称"
              :maxlength="25"
              @blur="godsNameBlur($event)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="商品编号:" class="sd-form-item" prop="goo_number">
            <el-input
              style="width:80%;"
              v-model="formList.goo_number"
              placeholder="请输入商品编号"
              :maxlength="20"
              @blur="godsNumBlur($event)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="销售价格:" class="sd-form-item" prop="goo_price">
            <el-input v-model="formList.goo_price" style="width:80%;" placeholder="请输入销售价格" @blur="godsPrice($event)" /> &nbsp;元/500g
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="应用导航" prop="nav_id">
            <el-select v-model="formList.nav_id"  placeholder="请选择导航名称" style="width:80%; ">
              <el-option
                v-for="items in navigation"
                :key="items.nav_id"
                :label="items.nav_name"
                :value="items.nav_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="商品品类" prop="goo_classifi">
            <el-select v-model="formList.goo_classifi" placeholder="请选择商品品类">
              <el-option
                v-for="item in goo_class"
                :key="item.cla_id"
                :label="item.cla_name"
                :value="item.cla_id"
              />
            </el-select>
            <el-button type="primary" class="add-class-btn" @click="showAddClas=true">添加品类</el-button>
          </el-form-item>
        </el-col>
        <!--  <el-col :span="8" class="sd-col-6">
         <el-form-item label="商品图片"prop="img_state">
           <el-switch v-model="formList.img_state"@change="upImg()"/>
         </el-form-item>
        </el-col>-->
        <el-col :span="24" class="sd-col-6">
          <el-form-item v-if="upImgShow" label="图片列表" prop="goo_picurl" class="addGods-upload-img">
            <div class="upload-img">
              <div v-for="(item,index) in imgArr" :key="index" class="img-list">
                <div class="img_show_box">
                  <img :src="item" alt />
                  <i class="img_delete el-icon-circle-close" @click="deleteGoodsImg(index)" />
                </div>
              </div>
              <div v-if="allowAddImg" class="upload-img-bd">
                <div class="add-img-box" @click="fileClick">
                  <input
                    id="fileIpt"
                    type="file"
                    accept="image/*"
                    class="ipt-add"
                    @change="changeGoodsImg($event)"
                  />
                  <span class="icon-add el-icon-plus" />
                </div>
              </div>
            </div>
            <!-- <el-upload
            v-if="upImgShow"
              :on-preview="handlePicBig"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :action="addUrl"
              :file-list="fileList"
              list-type="picture-card"
              multiple
            >
            <i class="el-icon-plus"/>-->
            <!-- </el-upload> -->
            <el-dialog :visible.sync="dialogVisible" width>
              <img :src="dialogImageUrl" width="100%" alt />
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">产品信息</div>
        <div class="sd-module-btn">
          <el-button class="add-goods-btn main-btn" @click="addInfor()">+ 增加信息项</el-button>
        </div>
      </div>
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
              :disabled="item.disabled"
              :class="item.nothing1?'border-red':''"
              placeholder="请输入名称,不超过8个字"
              @blur="blurKey($event,index)"
            />
          </el-col>
          <el-col :span="9" class="add-gods-title">
            <el-input
              v-if="!item.showBtn"
              v-model="item.value"
              :class="item.nothing2?'border-red':''"
              :placeholder="item.placeh"
              :disabled="item.disableIpt"
              :maxlength="item.length"
              @blur="blurValue($event,index)"
            />
            <el-button
              v-if="item.showBtn&&!item.showup"
              class="up_img_btn"
              @click="activeUpload(index)"
              style="width:365px"
            >点击上传</el-button>
            <el-button
              v-if="item.showBtn&&item.showup"
              class="up_img_btn"
              type="primary"
              @click="lookImg(index)"
              style="width:365px"
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

            <!-- <el-upload class="upload-demo"ref="upload":action="":file-list="fileList":auto-upload="false":on-preview="handlePreview"style="display:none;":show-file-list="false"accept= >
            </el-upload>-->
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
              :disabled="item.disabled"
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
      </el-row>
    </el-form>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="showAddClas"
      :close-on-click-modal="false"
      title="添加品类"
      width="500px"
      @close="cancleForm('addClaForm')"
    >
      <el-form ref="addClaForm" :model="addClaForm" :rules="addClaRules" label-width="80px">
        <el-form-item label="品类名称" prop="cla_name">
          <el-input
            v-model="addClaForm.cla_name"
            style="width:200px;"
            placeholder="请输入品类名称"
            @blur="blurClass($event)"
          />
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-select v-model="addClaForm.cla_stase" class>
            <el-option v-for="item in diaState" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancleForm('addClaForm')">取 消</el-button>
        <el-button type="primary" @click="addsubBtn('addClaForm')">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="showAddType"
      :close-on-click-modal="false"
      title="属性设置"
      width="500px"
      class="attri_dialog"
      @close="cancleType()"
    >
      <div class="attri_dia_box">
        <ul class="attri_dia_ul">
          <li
            v-for="(item,index) in Attribute"
            :key="item.id"
            :class="item.attib?'atti_dia_li on':'atti_dia_li'"
            @click="choseAttr(index)"
          >
            <i class="icon_suces el-icon-circle-check" />
            <svg-icon :icon-class="item.icon" class="svg_icon" />
            <span class="icon-text">{{ item.text }}</span>
          </li>
        </ul>
        <!-- <span v-show="showTip"class="red">提示:系统自动获取或生成的信息无法被修改或编辑</span> -->
      </div>
      <span slot="footer">
        <el-button @click="cancleType()">取 消</el-button>
        <el-button type="primary" @click="addtypeBtn()">提 交</el-button>
      </span>
    </el-dialog>
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
  </el-row>
</template>
<!--   <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=dnT9GV3Ryp2xLpkhKrcIFBwScizyZT0k"></script> -->
<script>
// import { addGoods,  } from '@/api/goods'
import {
  addfw,
  imgUp,
  editfw,
  subEditfw,
  videoUp,
  delImg,
  delVideo
} from "@/api/trace";
import {
  addGoods,
  duplication,
  editgo,
  addClass,
  getForInfo
} from "@/api/goods";
import { errorStatus, parseTime } from "@/utils/index";
import { mapGetters } from "vuex";
import { phoneTest, validateURL, getByteLen } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import Sticky from "@/components/Sticky";
export default {
  name: "AddTrace",
  props: {
    editId: {
      type: Number,
      required: true
    },
    btnId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      title: "新增",
      formList: {
        nav_id: "",
        goo_picurl: [],
        goo_name: "",
        goo_number: "",
        goo_price: "",
        goo_classifi: ""
      },
      formRules: {
        goo_classifi: [
          { required: true, trigger: "change", message: "请选择商品品类" }
        ],
        goo_price: [
          { required: true, trigger: "blur", message: "请输入销售价格" }
        ],
        nav_id: [
          { required: true, trigger: "change", message: "请选择样式导航" }
        ],
        goo_name: [
          { required: true, trigger: "blur", message: "请输入商品名称" }
        ],
        goo_number: [
          {
            required: true,
            trigger: "blur",
            message: "商品编号有误"
          }
        ]
      },
      upImgShow: true,
      allowAddImg: true,
      img_List: "",
      goo_class: null,
      navigation: null,
      dialogImageUrl: "",
      dialogVisible: false,
      godsDetail: [
        {
          key: "商品名称",
          value: "",
          disabled: true,
          disableIpt: true,
          length: 30,
          show: 1,
          nothing2: false,
          nothing1: false,
          showText: "文本",
          type: 1,
          // disableIpt: false,
          placeh: "",
          showBtn: false
        },
        {
          key: "商品编号",
          value: "",
          disabled: true,
          disableIpt: true,
          length: 30,
          show: 1,
          nothing1: false,
          nothing2: false,
          showText: "文本",
          type: 1,
          // disableIpt: false,
          placeh: "",
          showBtn: false
        }
      ],
      diaState: [{ id: 1, name: "启用" }, { id: 2, name: "停用" }],
      addClaRules: {
        cla_name: [
          { required: true, trigger: "blur", message: "品类名称不能为空" }
          // { min: 1, max: 20, message: '品类名称过长,字数不可超过20!', trigger: 'blur' }
        ]
      },
      addClaForm: {
        cla_name: "",
        cla_stase: ""
      },
      fileList: [],
      img_list: [],
      showAddType: false,
      showAddClas: false,
      imgArr: [],
      showTip: false,
      typeSta: [
        { text: "文本", show: true },
        { text: "视频", show: false },
        { text: "网址", show: false },
        { text: "电话", show: false },
        { text: "图片", show: false }
      ],
      Attribute: [
        { id: 1, text: "普通文本", icon: "documentation", attib: true },
        { id: 2, text: "上传视频", icon: "video", attib: false },
        { id: 3, text: "网址链接", icon: "bindData", attib: false },
        { id: 4, text: "电话号码", icon: "in-ex-hale", attib: false },
        { id: 5, text: "上传图片", icon: "pic", attib: false }
        // { id: 6, text: '', icon: 'pic', attib: false },
        // { id: 7, text: '上传视频', icon: 'video', attib: false }
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
      api: "/Goods/videoform",
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
    this.addClaForm.cla_stase = this.diaState[0].name;
    this.pageInfor();
  },
  methods: {
    pageInfor() {
      const edit_id = this.editId;
      const btnId = this.btnId;

      // console.log('edit_id----------', edit_id)
      const data = {};
      data.type = 1;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (btnId === 0) {
        // console.log('新增-----edit_id', edit_id)
        addGoods(data)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              // console.log('新增dataRep----------', dataRep)/
              this.goo_class = dataRep.data.goo_class;
              this.navigation = dataRep.data.navigation;
            }
          })
          .catch(Error => {
            this.$message.error("请求数据失败");
            loading.close();
          });
      } else if (btnId === 1) {
        // var myDate = new Date() // 获取系统当前时间
        // console.log('获取当前秒数(0-59)', myDate)
        this.title = "编辑";
        data.edit_id = edit_id;
        editgo(data)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              // console.log('编辑---dataRep', dataRep)
              const goods = dataRep.data.goods[0];
              this.formList.goo_name = goods.goo_name;
              this.formList.goo_price = goods.goo_price;
              this.formList.goo_number = goods.goo_number;
              const goo_class = dataRep.data.goo_class; //品类
              for (const i in goo_class) {
                if (Number(goods.goo_classifi) === goo_class[i].cla_id) {
                  this.formList.goo_classifi = goo_class[i].cla_name;
                }
              }
              this.goo_class = goo_class;
              const navigation = dataRep.data.navigation; //导航
              for (const i in navigation) {
                if (goods.goo_navid === navigation[i].nav_id) {
                  this.formList.nav_id = navigation[i].nav_name;
                }
                this.navigation = navigation;
                const pic = dataRep.data.goods[0].goo_picurl;
                if (pic.length === 5) {
                  this.allowAddImg = false;
                }

                const goo_pro = goods.goo_pro;
                this.godsDetail = goo_pro;

                for (const i in goo_pro) {
                  if (
                    goo_pro[i].key === "商品名称" ||
                    goo_pro[i].key === "商品编号"
                  ) {
                    goo_pro[i].disableIpt = true;
                    goo_pro[i].disabled = true;
                  } else {
                    goo_pro[i].disabled = false;
                    goo_pro[i].disableIpt = false;
                  }
                  if (goo_pro[i].type === 1) {
                    goo_pro[i].showText = "文本";
                  } else if (goo_pro[i].type === 2) {
                    goo_pro[i].showText = "视频";
                    goo_pro[i].showBtn = true;
                    goo_pro[i].showup = true;
                  } else if (goo_pro[i].type === 3) {
                    goo_pro[i].showText = "网址";
                  } else if (goo_pro[i].type === 4) {
                    goo_pro[i].showText = "电话";
                  } else {
                    goo_pro[i].showText = "图片";
                    goo_pro[i].showBtn = true;
                    goo_pro[i].showup = true;
                  }
                  goo_pro[i].nothing1 = false;
                  goo_pro[i].nothing2 = false;
                }
                this.godsDetail = goo_pro;
                const img = [];
                const baseUrl = process.env.BASE_API;
                const str = baseUrl.replace("/public", "/");
                for (const i in pic) {
                  if (pic[0] !== "") {
                    img.push(str + pic[i]);
                  }
                }
                this.imgArr = img;
              }
            }
          })
          .catch(Error => {
            this.$message.error("请求数据失败");
            loading.close();
          });
      } else if (btnId === 2) {
        this.title = "复制";
        data.goo_id = edit_id;
        data.type = 1;
        duplication(data)
          .then(response => {
            loading.close();
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              // console.log('编辑---dataRep', dataRep)
              const goods = dataRep.data.goods[0];
              this.formList.goo_name = goods.goo_name;
              this.formList.goo_price = goods.goo_price;
              this.formList.goo_number = goods.goo_number;
              const goo_class = dataRep.data.goo_class;
              for (const i in goo_class) {
                if (goods.goo_classifi === goo_class[i].cla_id) {
                  this.formList.goo_classifi = goo_class[i].cla_name;
                }
              }
              this.goo_class = goo_class;
              const navigation = dataRep.data.navigation;
              for (const i in navigation) {
                if (goods.goo_navid === navigation[i].nav_id) {
                  this.formList.nav_id = navigation[i].nav_name;
                }
                this.navigation = navigation;
                const pic = dataRep.data.goods[0].goo_picurl;
                if (pic.length === 5) {
                  this.allowAddImg = false;
                }

                const goo_pro = goods.goo_pro;
                this.godsDetail = goo_pro;
                for (const i in goo_pro) {
                  if (
                    goo_pro[i].key === "商品名称" ||
                    goo_pro[i].key === "商品编号"
                  ) {
                    goo_pro[i].disabled = true;
                    goo_pro[i].disableIpt = true;
                  } else {
                    goo_pro[i].disabled = false;
                    goo_pro[i].disableIpt = false;
                  }
                  if (goo_pro[i].type === 1) {
                    goo_pro[i].showText = "文本";
                  } else if (goo_pro[i].type === 2) {
                    goo_pro[i].showText = "视频";
                    goo_pro[i].showBtn = true;
                    goo_pro[i].showup = true;
                  } else if (goo_pro[i].type === 3) {
                    goo_pro[i].showText = "网址";
                  } else if (goo_pro[i].type === 4) {
                    goo_pro[i].showText = "电话";
                  } else {
                    goo_pro[i].showText = "图片";
                    goo_pro[i].showBtn = true;
                    goo_pro[i].showup = true;
                  }
                  goo_pro[i].nothing1 = false;
                  goo_pro[i].nothing2 = false;
                }
                this.godsDetail = goo_pro;
                const img = [];
                const baseUrl = process.env.BASE_API;
                const str = baseUrl.replace("/public", "/");
                for (const i in pic) {
                  if (pic[0] !== "") {
                    img.push(str + pic[i]);
                  }
                }
                this.imgArr = img;
              }
            }
          })
          .catch(Error => {
            this.$message.error("请求数据失败");
            loading.close();
          });
      }
    },

    // 提交
    submitInfo(formName) {
      const list = this.formList;
      list.type = 2;
      list.goo_picurl = this.imgArr;
      const btnId = this.btnId;
      const edit_id = this.editId;
      const godsDetail = this.godsDetail;
      const info_name = [];
      const info_content = [];
      const info_show = [];
      const info_type = [];
      if (this.formList.goo_name === "") {
        this.$message.error("请输入商品名称!");
        return false;
      }
      if (this.formList.goo_number === "") {
        this.$message.error("请输入商品编号!");
        return false;
      }
      if (this.formList.goo_price === "") {
        this.$message.error("请输入销售价格!");
        return false;
      }
      const leng = /^.{0,9}/;
      const pri = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if (pri.test(this.formList.goo_price)) {
        const goodsDet = this.godsDetail;
        for (let i in goodsDet) {
          if (goodsDet[i].key === "销售价格") {
            goodsDet[i].value = this.formList.goo_price;
            break;
          }
        }
      } else {
        this.formList.goo_price = "";
        this.$message.error(
          "输入销售价格错误,请输入小数点后面带有两位数字的价格"
        );
        return false;
      }

      const che = /^[0-9a-zA-Z]+$/;
      if (che.test(this.formList.goo_number)) {
        const goodsDet = this.godsDetail;
        for (let i in goodsDet) {
          if (goodsDet[i].key === "商品编号") {
            goodsDet[i].value = this.formList.goo_number;
            break;
          }
        }
      } else {
        this.formList.goo_number = "";
        this.$message.error("输入商品编号错误,请输入前两位为69的13位数字");
        return false;
      }

      if (this.formList.nav_id === "") {
        this.$message.error("请输入应用导航!");
        return false;
      }
      if (this.formList.goo_classifi === "") {
        this.$message.error("请选择商品品类!");
        return false;
      }
      const goo_class = this.goo_class;

      for (const i in goo_class) {
        if (list.goo_classifi === goo_class[i].cla_name) {
          list.goo_classifi = goo_class[i].cla_id;
        }
      }
      const navigation = this.navigation;

      for (const i in navigation) {
        if (list.nav_id === navigation[i].nav_name) {
          list.nav_id = navigation[i].nav_id;
        }
      }
      for (const i in godsDetail) {
        const val = this.godsDetail[i].value;
        if (val === "") {
          this.$set(this.godsDetail[i], "nothing2", true);
        } else {
          this.$set(this.godsDetail[i], "nothing2", false);
        }
        if (this.godsDetail[i].type === 4) {
          if (!phoneTest(val)) {
            this.$message.error("请输入正确的手机号!");
            return false;
          }
        }
        if (this.godsDetail[i].type === 3) {
          if (!validateURL(val)) {
            this.$message.error("请输入合法网址!");
            return false;
          }
        }
        this.$set(this.godsDetail[i], "nothing1", false);
        this.$set(this.godsDetail[i], "nothing2", false);
        if (godsDetail[i].key === "") {
          this.$message.error("请输入信息名称!");
          this.$set(this.godsDetail[i], "nothing1", true);
          return false;
        } else if (godsDetail[i].value === "") {
          this.$message.error("请输入信息内容! ");
          this.$set(this.godsDetail[i], "nothing2", true);
          return false;
        } else if (!leng.test(godsDetail[i].key)) {
          this.$message.error("信息名称超过8位!");
        }
        info_content.push(godsDetail[i].value);
        info_name.push(godsDetail[i].key);
        info_show.push(godsDetail[i].show);
        info_type.push(godsDetail[i].type);
      }
      list.info_name = info_name;
      list.info_content = info_content;
      list.info_show = info_show;
      list.info_type = info_type;

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (btnId === 0) {
            // console.log('list-新增', list)
            addGoods(list)
              .then(response => {
                loading.close();
                const dataRep = response.data;
                if (errorStatus(dataRep)) {
                  this.$emit("listerToChild", "addPage"); // 返回
                  // console.log('dataRep----------保存', dataRep)
                  this.$message.success(dataRep.data);
                  _this.$refs[formName].resetFields();
                  const godsDetail = this.godsDetail;
                  for (const i in godsDetail) {
                    this.godsDetail[i].key = "";
                    this.godsDetail[i].value = "";
                    this.godsDetail[i].showBtn = false;
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
          } else if (btnId === 1) {
            list.edit_id = edit_id;
            // console.log('list-新增', list)
            subEditfw(list)
              .then(response => {
                loading.close();
                const dataRep = response.data;
                if (errorStatus(dataRep)) {
                  // console.log('response---', dataRep)
                  this.$message.success(dataRep.data);
                  this.$emit("listerToChild", "addPage"); // 返回
                }
              })
              .catch(Error => {
                loading.close();
                console.log("Error=>", Error);
              });
          } else if (btnId === 2) {
            list.goo_id = edit_id;
            // console.log('list-新增', list)
            duplication(list)
              .then(response => {
                loading.close();
                const dataRep = response.data;
                if (errorStatus(dataRep)) {
                  // console.log('response---', dataRep)
                  this.$message.success(dataRep.data);
                  this.$emit("listerToChild", "addPage"); // 返回
                }
              })
              .catch(Error => {
                loading.close();
                console.log("Error=>", Error);
              });
          }
        }
      });
    },
    // 增加
    addInfor() {
      const godsDetail = this.godsDetail;
      const detail = {
        key: "",
        value: "",
        show: 1,
        type: 1,
        nothing2: false,
        nothing1: false,
        disableIpt: false,
        placeh: "请输入内容",
        showBtn: false,
        showText: "文本"
      };
      const leng = godsDetail.length;
      this.$set(this.godsDetail, leng, detail);
    },
    // 删除
    deleteInfo(index) {
      // console.log("index---------",index)
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
      // console.log("index---", index);
      if (index === 0) {
        return false;
      }
      // console.log("index---", index);
      const index_0 = index - 1;
      const goodsDetail = this.godsDetail;
      const infor = goodsDetail[index];
      const infor_0 = goodsDetail[index_0];
      this.$set(this.godsDetail, index, infor_0);
      this.$set(this.godsDetail, index_0, infor);
    },
    // 下移
    downInfor(index) {
      // console.log("index---", index);
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
      // console.log('index--12', index)
      // console.log('num--34', num)
      this.showAddType = true;
      this.godsDet_index = num;
      this.upImgVideo = index;
    },
    // 选择类型--设置属性
    choseAttr(index) {
      this.showTip = false;
      const num = index;
      // this.Attribute[num].attib=true;
      for (const i in this.Attribute) {
        this.$set(this.Attribute[i], "attib", false);
      }
      if (num === 1 || num === 2) {
        this.showTip = true;
      }
      this.$set(this.Attribute[num], "attib", true);
    },
    // 返回
    back() {
      const editId = this.editId;
      const _this = this;
      if (editId === 0) {
        // console.log('000000')
        if (this.formList.fom_title !== "" || this.formList.fom_label !== "") {
          // console.log(22222)
          this.$confirm("商品信息未保存, 确定离开?", "提示", {
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
                  if (godDet[i].type === 5 || godDet[i].type === 2) {
                    data.images.push(godDet[i].value);
                    // console.log('删除图片---')
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
          // console.log("111111")
          const godDet = this.godsDetail;
          const data = {};
          data.images = [];
          const id = [];
          for (const i in godDet) {
            if (godDet[i].value !== "" || godDet[i].key !== "") {
              id.push(i);
              // console.log('godDet--', godDet[i].type)
              if (godDet[i].type === 5 || godDet[i].type === 2) {
                // console.log('删除图片---')
                data.images.push(godDet[i].value);
              }
            }
          }
          // console.log("id--"+id)
          if (id.length > 0) {
            this.$confirm("信息未保存, 确定离开?", "提示", {
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
        this.$confirm("信息未保存, 确定离开?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (_this.chgImg || _this.chgVid) {
            if (_this.chgImg) {
              // console.log('删除图片---')
              // console.log('change-id--', _this.chgId)
              const godDet = this.godsDetail;
              const data = {};
              data.images = [];
              for (const i in godDet) {
                for (const j in _this.chgId) {
                  if (i == _this.chgId[j]) {
                    // console.log("0000000",i)
                    data.images.push(godDet[i].value);
                  }
                }
              }
              // console.log('删除图片数据--', data)
              delImg(data).then(response => {
                if (errorStatus(response.data)) {
                  this.$emit("listerToChild", "addPage");
                }
              });
            }
            if (_this.chgVid) {
              // console.log('删除视频---')
              // console.log('change-id--', _this.chgVideoId)
              const godDet = this.godsDetail;
              const data = {};
              data.video = [];
              for (const i in godDet) {
                for (const j in _this.chgVideoId) {
                  if (i == _this.chgVideoId[j]) {
                    // console.log("0000000",i)
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
      this.$refs[formName].resetFields();
      this.addClaForm.cla_name = "";
      this.addClaForm.cla_stase = this.diaState[0].name;
    },
    cancleType(formName) {
      this.showAddType = false;
    },
    // 弹窗-增加-提交
    addsubBtn(formName) {
      // console.log('login--', this.addClaForm)
      const addClas = this.addClaForm;
      if (addClas.cla_name === "") {
        this.$message.error("请输入品类名称!");
        return false;
      } else {
        if (addClas.cla_stase === "启用") {
          addClas.cla_stase = 1;
        }
        // console.log('data---addClas', addClas)
        addClass(addClas)
          .then(response => {
            // console.log('addClass---', response)
            if (errorStatus(response.data)) {
              this.$message.success("提交成功!");
              this.showAddClas = false;
              this.$refs[formName].resetFields();
              this.addClaForm.cla_name = "";
              this.addClaForm.cla_stase = this.diaState[0].name;
              this.pageInfor();
            }
          })
          .catch(Error => {
            console.log("Error", Error);
            this.$message.error("请求失败!");
          });
      }
    },
    // 弹窗-增加-提交
    addtypeBtn() {
      // console.log('-----', this.Attribute)
      // console.log('-num----', this.godsDet_index)
      const attrList = this.Attribute;
      const num = this.godsDet_index;
      for (const i in attrList) {
        if (attrList[i].attib === true) {
          // console.log('i----', i)
          this.upImgVideo = i;
          // console.log("i-type-", typeof i);
          if (i === "0" || i === "3") {
            this.$set(this.godsDetail[num], "showBtn", false);
            this.$set(this.godsDetail[num], "value", "");
            this.$set(this.godsDetail[num], "disableIpt", false);
            if (i === "0") {
              this.$set(this.godsDetail[num], "showText", "文本");
              this.$set(this.godsDetail[num], "type", 1);
              this.$set(this.godsDetail[num], "placeh", "请输入内容");
            } else {
              this.$set(this.godsDetail[num], "showText", "电话");
              this.$set(this.godsDetail[num], "type", 4);
              this.$set(this.godsDetail[num], "placeh", "请输入电话号码");
              this.$set(this.godsDetail[num], "length", 11);
            }
          } else if (i === "2") {
            this.$set(this.godsDetail[num], "showBtn", false);
            this.$set(this.godsDetail[num], "disableIpt", false);
            this.$set(this.godsDetail[num], "value", "http://");
            this.$set(this.godsDetail[num], "showText", "网址");
            this.$set(this.godsDetail[num], "type", 3);
          } else if (i === "4" || i === "1") {
            this.$set(this.godsDetail[num], "showBtn", true);
            if (i === "4") {
              this.$set(this.godsDetail[num], "showText", "图片");
              this.$set(this.godsDetail[num], "type", 5);
            } else {
              this.$set(this.godsDetail[num], "showText", "视频");
              this.$set(this.godsDetail[num], "type", 2);
            }
          }

          for (const j in this.typeSta) {
            this.$set(this.typeSta[j], "show", false);
            if (i === j) {
              this.$set(this.typeSta[j], "show", true);
            }
          }
          this.showAddType = false;
        }
      }
    },
    // upImg() {
    //   this.upImgShow = this.formList.img_state
    // },
    // 触发上传事件--更换图片
    activeUpload(index) {
      var upImgVideo = null;
      if (index !== "null") {
        this.gosDetInp = index;
        upImgVideo = this.godsDetail[index].type;
      } else {
        const index = this.gosDetInp;
        upImgVideo = this.godsDetail[index].type;
      }
      // console.log('更换图片index---', index)
      // console.log('更换图片this.gosDetInp--', upImgVideo)
      if (upImgVideo === 5) {
        document.getElementById("upFile").click();
      } else {
        // console.log('shipin')
        document.getElementById("videoForm").click();
        // document.getElementById("submit").click();
      }
    },
    // 商品名称 失去焦点时
    godsNameBlur(e) {
      const goodsDet = this.godsDetail;
      for (let i in goodsDet) {
        if (goodsDet[i].key === "商品名称") {
          goodsDet[i].value = e.target.value;
          break;
        }
      }
    },
    //销售价格失去焦点时
    godsPrice(e) {
      // const pri=/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
      // if(pri.test(e.target.value)){
      //   const goodsDet=this.godsDetail;
      //   for(let i in goodsDet){
      //     if(goodsDet[i].key ==='销售价格'){
      //       goodsDet[i].value=e.target.value;
      //       break
      //     }
      // }
      // }else{
      //   this.formList.goo_number=''
      //   this.$message.error("输入销售价格错误,请输入小数点后面带有两位数字的价格");
      // }
    },
    // 商品编号 失去焦点时
    godsNumBlur(e) {
      const reg = /^[0-9a-zA-Z]+$/;
      if (reg.test(e.target.value)) {
        const goodsDet = this.godsDetail;
        for (let i in goodsDet) {
          if (goodsDet[i].key === "商品编号") {
            goodsDet[i].value = e.target.value;
            break;
          }
        }
      } else {
        this.formList.goo_number = "";
        this.$message.error("输入的商品编号错误");
      }
    },
    blurKey(e, index) {
      // console.log('失去焦点时----', e)
      const val = e.target.value;
      if (val === "") {
        this.$set(this.godsDetail[index], "nothing1", true);
      } else {
        this.$set(this.godsDetail[index], "nothing1", false);
      }
    },
    blurValue(e, index) {
      const val = e.target.value;
      if (val === "") {
        this.$set(this.godsDetail[index], "nothing2", true);
      } else {
        this.$set(this.godsDetail[index], "nothing2", false);
      }
      // console.log('this.godsDetail[index].type', this.godsDetail[index].type)
      if (this.godsDetail[index].type === 4) {
        if (!phoneTest(val)) {
          this.$message.error("请输入正确的手机号!");
          return false;
        }
      } else if (this.godsDetail[index].type === 3) {
        if (!validateURL(val)) {
          this.$message.error("请输入合法网址!");
          return false;
        }
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
        console.log("length--", leng);
        if (leng === 4) {
          _this.allowAddImg = false;
        }
      };
    },
    // 删除商品图片
    deleteGoodsImg(index) {
      console.log("---", index);
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
      const upImgVideo = _this.godsDetail[index].type;
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
              // var imgtype = img_path.toString().split('.');
              // if (imgtype[1] !== 'png' &&  imgtype[1] !== 'jpeg' && imgtype[1] !== "bmp" && imgtype[1] !== "jpg")
              // {
              //   _this.$message.error('图片格式不正确,仅支持上传png,jpeg,bmp,jpg格式的图片！')
              //   // this.$message.error("图片格式不正确！");
              //   return
              // }
              // if(img_path)
              // console.log('index---', index)
              // console.log('godsDetail--', _this.godsDetail)
              _this.$set(_this.godsDetail[index], "showup", true);
              _this.$set(_this.godsDetail[index], "value", img_path);
              // console.log('godsDetail--', _this.godsDetail)
              const baseUrl = process.env.BASE_API;
              const str = baseUrl.replace("public", "/public/");
              _this.img.imgUrl = str + img_path;
            }
          });
        };
      } else if (upImgVideo === 2) {
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

      videoUp(formData).then(response => {
        // console.log('response--', response)
        const dataRep = response.data;
        // console.log('----', dataRep)
        if (errorStatus(dataRep)) {
          const index = _this.gosDetInp;
          const img_path = dataRep.videoSrc;
          // console.log('index---', index)
          // console.log('godsDetail--', _this.godsDetail)
          _this.$set(_this.godsDetail[index], "showup", true);
          _this.$set(_this.godsDetail[index], "value", img_path);
          // console.log('godsDetail--', _this.godsDetail)
          const baseUrl = process.env.BASE_API;
          const str = baseUrl.replace("public", "public/");
          _this.video.imgUrl = str + img_path;
          _this.chgvid = true;
        }
      });
    },
    // 查看图片
    lookImg(index) {
      // console.log('---', index)
      const upImgVideo = this.godsDetail[index].type;
      this.gosDetInp = index;
      const baseUrl = process.env.BASE_API;
      const url = this.godsDetail[index].value;
      // console.log('baseURL---', baseUrl)
      const str = baseUrl.replace("public", "public/");
      if (upImgVideo === 5) {
        this.img.imgUrl = str + url;
        this.img.showImg = true;
      } else if (upImgVideo === 2) {
        this.video.imgUrl = str + url;
        this.video.showImg = true;
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
      width: 1040px;
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
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.lk-addGoods-box {
  .lk-form-addGods {
    .add-class-btn {
      margin-left: 30px;
    }
    .addGods-infor-box {
      padding: 15px 0 0 20px;
      width: 1040px;
      .add-gods-title {
        text-align: center;
        .opre-btn {
          padding: 0 10px;
        }
      }
      .addGods-infor-ipt {
        // height: 56px;
        line-height: 56px;
      }
      .add-goods-btn.main-btn {
        margin: 10px 15px 0 0;
        float: right;
      }
    }
    .addGods-upload-img {
      .upload-img {
        .upload-img-bd {
          float: left;
          border: 1px dashed #ddd;
          width: 165px;
          height: 90px;
          cursor: pointer;
          &:hover {
            border: 1px dashed $blue;
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
        }
        .img-list {
          float: left;
          margin-right: 10px;
          .img_show_box {
            width: 160px;
            height: 90px;
            position: relative;
            overflow: hidden;
            img {
              width: 165px;
              // height: 120px;
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
          }
        }
      }
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
