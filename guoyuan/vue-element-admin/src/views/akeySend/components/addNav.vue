<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <!-- 标题 -->
      <!-- <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">导航-{{tit}}</div>
        <div class="sd-module-btn">
          <el-button class="btn-mainCol" @click="submit" :loading="submitLoading">保存</el-button>
          <el-button class="btn-delete" @click="backBtn()">返回</el-button>
        </div>
      </div>-->
      <!-- 输入信息 -->
      <div class="lk-form-box">
        <el-form
          ref="navList"
          :model="navList"
          :rules="navRules"
          label-width="100px"
          class="lk-form-addGods clearfix"
        >
          <el-form-item label="导航名称" class="lk-el-item" prop="nav_name">
            <el-input class="lk-input" v-model="navList.nav_name" placeholder="请输入导航名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 导航 -->
      <div class>
        <el-container>
          <!-- 图标 -->
          <el-aside width="450px" class="addNav-left-box">
            <div class="navTip-box">
              <!-- 上部标题 -->
              <div class="navTip-title-box">
                <div class="navTitle" @click="navSort">{{navTip.title}}</div>
              </div>
              <!-- 第一屏 不开启脱拽 -->
              <ul class="nav-no-sort" v-show="navTip.sortShow">
                <li
                  class="itemMainBox"
                  id="itemMainBox"
                  v-for="(item,index) in navTipList"
                  :key="index"
                  @mouseover="item.showTool=true"
                  @mouseout="item.showTool=false"
                >
                  <div :class="item.chose?'itemsBox on':'itemsBox'">
                    <div class="imgsBox" @click="handTip(item.icon_order)">
                      <img :src="item.img" class="img_nav" />
                    </div>
                    <p class="names" v-show="!item.showTool">{{item.name}}</p>
                    <p class="btnItem" v-show="item.showTool">
                      <span
                        class="looks tool_tip"
                        @click="item.showEye=!item.showEye"
                        type="1"
                        title="是否显示该导航按钮"
                      >
                        <i class="el-icon-view" v-if="item.showEye"></i>
                        <svg-icon icon-class="hidden" v-else />
                      </span>
                      <label
                        class="replaces tool_tip"
                        title="替换该导航按钮图片"
                        data="1"
                        @click="uploadFile(item.icon_order)"
                      >
                        <i class="el-icon-refresh"></i>
                      </label>
                      <span
                        class="deletes tool_tip"
                        type="1"
                        title="删除该导航按钮"
                        @click="delTip(item.icon_order,item.system_icon)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </p>
                  </div>
                </li>
                <li class="upload-img itemMainBox" v-if="navTipList.length<10">
                  <div class="itemsBox">
                    <div class="imgsBox uploadimg">
                      <p class="upload" @click="uploadImg(navTipList.length)">+</p>
                    </div>
                    <p class="names">上传图片</p>
                  </div>
                </li>
              </ul>
              <input
                type="file"
                style="display:none;"
                id="fileIpt"
                accept="image/*"
                @change="changeImg1($event)"
              />
              <!-- 第二屏-拖拽 -->
              <ul class="item_content" id="list" v-show="!navTip.sortShow">
                <li class="itemMainBox" v-for="item in navTipList" :key="item.icon_order">
                  <img :src="item.img" class="img_nav" />
                </li>
              </ul>
            </div>
          </el-aside>
          <!-- 内容 -->
          <el-main class="addNav-right-box">
            <el-form
              :model="addNavForm"
              :rules="addNavForm"
              label-width="80px"
              ref="addNavForm"
              class="lk-el-form"
            >
              <el-form-item label="信息名称">
                <el-input
                  placeholder="请输入信息名称"
                  v-model="addNavForm.name"
                  style="width:360px"
                  :maxlength="6"
                  @blur="inforName($event)"
                />
                <span class="tip_box">提示:为确保移动端效果,此项最多输入6个字符</span>
              </el-form-item>
              <el-form-item label="信息类型">
                <el-input
                  v-show="!navType.showSel"
                  placeholder
                  v-model="addNavForm.type2"
                  style="width:360px"
                  :disabled="navType.selDisabled"
                />
                <el-select
                  style="width:360px"
                  v-show="navType.showSel"
                  v-model="addNavForm.type2"
                  @change="navTypeChose($event)"
                  :disabled="navType.selDisabled"
                >
                  <el-option
                    v-for="type1 in typeNav"
                    :key="type1.id"
                    :label="type1.label"
                    :value="type1.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div class="right_bottom_detail" v-show="navType.show">
                <!-- 文本 -->
                <div class="text-box" v-show="navType.navType===1">
                  <div class>
                    <el-row class="addGods-infor-box" :gutter="10">
                      <el-col :span="9" class="add-gods-title">列表名称</el-col>
                      <el-col :span="13" class="add-gods-title">列表内容</el-col>
                      <el-col :span="2" class="add-gods-title">
                        <span class="opre-btn">删除</span>
                      </el-col>
                    </el-row>
                  </div>
                  <div class>
                    <el-row class="addGods-infor-box" :gutter="10">
                      <div v-for="(nav,ind) in navDetailArr" :key="ind">
                        <div
                          v-for="(item,index) in nav"
                          :key="index"
                          class="addGods-infor-ipt clearfix"
                        >
                          <el-row v-if="item.icon_order==navChanged.choseId" :gutter="5">
                            <el-col :span="9">
                              <el-input
                                v-model="item.key"
                                :class="item.nothing1?'border-red':''"
                                placeholder="长度限制8位"
                                :maxlength="8"
                                @blur="textTitlBlur($event.index)"
                              />
                            </el-col>
                            <el-col :span="13" class="add-gods-title">
                              <el-input
                                maxlength="30"
                                v-model="item.value"
                                :class="item.nothing2?'border-red':''"
                                placeholder
                              />
                            </el-col>
                            <el-col :span="2" class="add-gods-title">
                              <el-button
                                :disabled="nav.length===1"
                                icon="el-icon-delete"
                                class="btn-delete"
                                @click="deleteInfo(index)"
                              />
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </el-row>
                  </div>
                  <el-row>
                    <el-button type="primary" class="add-btn" @click="addBtn">新增</el-button>
                  </el-row>
                </div>
                <!-- 图文 -->
                <div class="imgText-box" v-show="navType.navType===2">
                  <div v-for="text in textArr" :key="text.icon_order">
                    <!-- <span>{{text.icon_order}}--{{navChanged.choseId}}</span> -->
                    <div v-show="text.icon_order==navChanged.choseId">
                      <!-- <span>{{text.icon_order}}--{{navChanged.choseId}}</span> -->
                      <Tinymce :height="400" v-model="text.imgText" />
                    </div>
                  </div>
                </div>
                <!-- 链接 -->
                <div class="url-box" v-show="navType.navType===3">
                  <div v-for="(url,index) in urlArr" :key="url.icon_order">
                    <div v-if="url.icon_order==navChanged.choseId">
                      <el-input
                        v-model="url.imgText"
                        placeholder="请输入网址"
                        style="width:360px;"
                        @blur="urlCheck($event,index)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </el-main>
        </el-container>
      </div>
    </el-row>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce";
import { errorStatus } from "@/utils/index";
import { validateURL } from "@/utils/validate";
import {
  startNav,
  navList,
  stopNav,
  delNav,
  editNav,
  addNav
} from "@/api/goods";
import { akeyCodeing } from "@/api/trace";
import Sortable from "sortablejs";
export default {
  name: "navList",
  components: { Tinymce },
  data() {
    return {
      tit: "新增",
      submitLoading: false,
      navStyle: [
        { navid: 0, navname: "全部" },
        { navid: 1, navname: "主题样式 " },
        { navid: 2, navname: "星空滑屏" },
        { navid: 3, navname: "黑调滑屏" }
      ],
      navList: {
        nav_name: "",
        nav_style: ""
      },
      navRules: {
        nav_name: [
          {
            min: 1,
            max: 20,
            message: "导航名称过长,字数不可超过20!",
            trigger: "blur"
          },
          { required: true, message: "请输入导航名称!", trigger: "blur" }
        ],
        nav_style: [
          { required: true, trigger: "change", message: "请选择样式导航" }
        ]
      },
      navTip: {
        title: "开启手动拖拽排序",
        sortShow: true
      },
      navTipList: [],
      navType: {
        show: false,
        showSel: true,
        imgText: "",
        navType: 1,
        selDisabled: true
      },
      addNavForm: {
        name: "",
        type2: ""
      },
      typeNav: [
        { id: 1, label: "文本" },
        { id: 2, label: "图文" },
        { id: 3, label: "网址" }
      ],
      navDetailArr: [],
      textArr: [],
      urlArr: [],
      navChanged: {
        ImgId: null,
        choseId: null,
        navDetaiInd: null,
        changeImg: false
      }
    };
  },
  created() {
    this.navList.nav_style = this.navStyle[0].navname;
    this.getPageInfo();
  },
  mounted() {
    var _this = this;
    var $ul = this.$el.querySelector("#list");
    new Sortable($ul, {
      onUpdate: function(event) {
        // console.log("event--", event);
        //修改items数据顺序;
        var newIndex = event.newIndex,
          oldIndex = event.oldIndex,
          $li = $ul.children[newIndex],
          $oldLi = $ul.children[oldIndex];
        // 先删除移动的节点
        $ul.removeChild($li);
        // 再插入移动的节点到原有节点，还原了移动的操作
        if (newIndex > oldIndex) {
          $ul.insertBefore($li, $oldLi);
        } else {
          $ul.insertBefore($li, $oldLi.nextSibling);
        }
        // 更新items数组
        var navTipList = _this.navTipList.splice(oldIndex, 1);
        _this.navTipList.splice(newIndex, 0, navTipList[0]);
        // 下一个tick就会走patch更新
      },
      animation: 500
    });
  },
  methods: {
    getPageInfo() {
      const data = {};
      data.type = 1;
      const apiBase = process.env.BASE_API;
      const str = apiBase.replace("/public", "/");
      this.tit = "新增";
      addNav(data)
        .then(response => {
          if (errorStatus(response.data)) {
            const dataRep = response.data.data.nav_icon;
            // console.log("新增--", dataRep);
            for (let i in dataRep) {
              const obj = {};
              this.navTipList.push(obj);
              this.$set(this.navTipList[i], "name", dataRep[i].name); //导航名称
              this.$set(
                this.navTipList[i],
                "icon_order",
                dataRep[i].icon_order
              ); //系统自带导航的 唯一标识 1产品信息 2溯源真伪 3防伪查询
              this.$set(this.navTipList[i], "icon_type", dataRep[i].icon_type); //  1，文本  2.图文  3 链接
              this.$set(this.navTipList[i], "content", dataRep[i].content); // 右侧内容
              this.$set(this.navTipList[i], "showEye", dataRep[i].show); // 导航是否显示
              this.$set(this.navTipList[i], "img", str + dataRep[i].pic); //导航图片
              this.$set(
                this.navTipList[i],
                "system_icon",
                dataRep[i].system_icon
              ); //是否是系统固有的导航
              this.$set(this.navTipList[i], "chose", false); //判断是否选中---自加
              this.$set(this.navTipList[i], "showTool", false); //判断是否显示导航下部操作按钮---自加
            }
            this.$set(this.navTipList[0], "type_cont", "商品管理中的商品信息");
            this.$set(this.navTipList[1], "type_cont", "溯源管理中的溯源信息");
            this.$set(
              this.navTipList[2],
              "type_cont",
              "防伪管理中的真伪设置信息"
            );
            this.$set(this.navTipList[3], "type_cont", "产区管理中的环境信息");
            this.$set(this.navTipList[4], "type_cont", "溯源管理中的发码信息");
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败!");
        });
    },
    //  提交
    submit() {
      if (this.navList.nav_name === "") {
        this.$message.error("请输入导航名称");
        return false;
      }
      if (!this.navTip.sortShow) {
        this.$message.error("请先保存拖拽顺序后,再提交");
        return false;
      }
      const navdetail = this.navDetailArr;
      const textArr = this.textArr;
      const urlArr = this.urlArr;
      var navName = [],
        navTYpe = [],
        navCont = [],
        navIcon = [],
        navPic = [],
        nacShow = [],
        system_icon = [],
        icon_order = [];
      for (let i in this.navTipList) {
        // console.log(i, this.navTipList[i])
        if (this.navTipList[i].icon_type === 1) {
          // console.log('12navdetail', navdetail)
          for (let j in navdetail) {
            if (navdetail[j][0].icon_order === this.navTipList[i].icon_order) {
              // console.log('navdetail', j, navdetail)
              var key = [],
                value = [];
              for (let k in navdetail[j]) {
                if (navdetail[j][k].key === "") {
                  // this.$message.error(this.navTipList[i].name + "内列表名称存在空项,请您添加完成后再点击保存!");
                  this.$message.error(
                    "自定义导航信息内容存在空项，请您添加完成后再点击保存！"
                  );
                  return false;
                  break;
                }
                if (navdetail[j][k].value === "") {
                  // this.$message.error(this.navTipList[i].name + "内列表内容存在空项,请您添加完成后再点击保存!");
                  this.$message.error(
                    "自定义导航信息内容存在空项，请您添加完成后再点击保存！"
                  );
                  return false;
                  break;
                }
                // console.log('navdetail[j][k].key', j, navdetail[j][k].key)
                key.push(navdetail[j][k].key);
                value.push(navdetail[j][k].value);
              }
              // console.log("key-", key)
              // console.log("value-", value)
              this.$set(this.navTipList[i].content, "key", key);
              this.$set(this.navTipList[i].content, "value", value);
            }
          }
          // console.log("导航列表--", this.navTipList)
        } else if (this.navTipList[i].icon_type === 2) {
          for (let j in textArr) {
            if (textArr[j].icon_order === this.navTipList[i].icon_order) {
              if (textArr[j].imgText === "") {
                //  this.$message.error(this.navTipList[i].name + ",请您添加完成后再点击保存!");
                this.$message.error(
                  "自定义导航信息内容存在空项，请您添加完成后再点击保存！"
                );
                return false;
                break;
              }
              this.navTipList[i].content = textArr[j].imgText;
            }
          }
        } else {
          for (let j in urlArr) {
            if (urlArr[j].icon_order === this.navTipList[i].icon_order) {
              if (urlArr[j].imgText === "http://" || urlArr[j].imgText === "") {
                //  this.$message.error(this.navTipList[i].name + ",请您添加完成后再点击保存!");
                this.$message.error(
                  "自定义导航信息内容存在空项，请您添加完成后再点击保存！"
                );
                return false;
                break;
              }
              this.navTipList[i].content = urlArr[j].imgText;
            }
          }
        }
        navName.push(this.navTipList[i].name);
        navTYpe.push(this.navTipList[i].icon_type);
        navCont.push(this.navTipList[i].content);
        nacShow.push(this.navTipList[i].showEye);
        navPic.push(this.navTipList[i].img);
        system_icon.push(this.navTipList[i].system_icon);
        icon_order.push(this.navTipList[i].icon_order);
      }
      this.submitLoading = true;
      const data = {};
      data.nav_name = this.navList.nav_name;
      data.nav_style = 1; //暂时终端样式默认为1
      data.name = navName;
      data.icon_type = navTYpe;
      data.content = navCont;
      data.icon_order = icon_order;
      data.pic = navPic;
      data.show = nacShow;
      data.type = 5;
      data.nav_type = 2;
      data.system_icon = system_icon;
      akeyCodeing(data)
        .then(response => {
          this.submitLoading = false;
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data);
            this.$emit("setInfos", response.data.nav_id);
          }
        })
        .catch(Error => {
          this.submitLoading = false;
          this.$message.error("添加请求失败");
          console.log("Error", Error);
        });
    },
    // 查看详情
    lokPic() {},
    // 返回
    backBtn() {
      this.$confirm("导航信息未保存,是否离开?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("listerToChild", "addPage");
        })
        .catch(() => {});
    },
    // 点击-图片
    handTip(id) {
      // console.log("点击-图片--", id);
      const navTipList = this.navTipList;

      if (id === this.navChanged.choseId) {
        // 取消选中状态
        for (let i in navTipList) {
          navTipList[i].chose = false;
        }
        this.navChanged.choseId = null;
        this.addNavForm = {
          name: "",
          type2: ""
        };
        this.$set(this.navType, "show", false);
        // this.$set(this.navType, 'selDisabled', true); // 去掉下拉框的不可选择
        // this.$set(this.navType, 'showSel', true); // 设置 navdetail 的index
        this.$set(this.navChanged, "navDetaiInd", null); // 设置 navdetail 的index

        // navType.showSel
      } else {
        // 显示选中状态--
        for (let i in navTipList) {
          // console.log("i--", i)
          if (id === navTipList[i].icon_order) {
            // 找到选中导航
            navTipList[i].chose = true;
            this.$set(this.addNavForm, "name", navTipList[i].name);
            if (navTipList[i].system_icon == true) {
              // console.log("判断是否是固有导航", navTipList[i])
              // 判断是否是固有导航
              this.$set(this.navType, "show", false);
              this.$set(this.addNavForm, "type2", navTipList[i].type_cont);
              // this.$set(this.navType, 'showSel', false); //
              this.$set(this.navType, "selDisabled", true); // 去掉下拉框的不可选择
              this.$set(this.navType, "showSel", false); // 显示文本框
              // navType.showSel
              // console.log("this.addNavForm", this.addNavForm)
              // break
            } else {
              // console.log("选中--i", i);
              // 新增导航
              this.$set(this.navType, "show", true);
              this.$set(this.navType, "navType", navTipList[i].icon_type);
              this.addNavForm.type2 = this.typeNav[
                Number(navTipList[i].icon_type) - 1
              ].label; // 下拉框显示 文本
              this.$set(this.navType, "selDisabled", false); // 去掉下拉框的不可选择
              this.$set(this.navType, "showSel", true); //显示下拉框
              // alert(navTipList[i].icon_order)
              this.$set(
                this.navChanged,
                "navDetaiInd",
                navTipList[i].icon_order - 6
              );

              // console.log("点击navDetaiInd--", this.navChanged.navDetaiInd)
              // console.log("000", this.textArr)
              // console.log("navDetailArr", this.navDetailArr)
            }
          } else {
            navTipList[i].chose = false;
          }
        }
        this.navChanged.choseId = id;
      }
      // console.log("choseId--", this.navChanged.choseId)
    },
    moveNav() {},
    // 手动拖拽--保存
    navSort() {
      const navTip = this.navTip.sortShow;
      // console.log("手动拖拽--保存", navTip)
      if (navTip) {
        // 手动拖拽
        this.navTip.title = "保存";
        this.$set(this.navTip, "sortShow", false);
        this.moveNav();
      } else {
        this.navTip.title = "开启手动拖拽模式";
        this.$set(this.navTip, "sortShow", true);
      }
    },
    // 删除
    delTip(id, sysIcon) {
      // console.log("删除--", id);

      if (sysIcon === true) {
        this.$message.error("系统默认导航,不可删除");
      } else {
        this.$confirm("请确认,是否删除该导航?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const navTipList = this.navTipList;
          for (var i = 0; i < navTipList.length; i++) {
            // console.log('i--', i)
            this.$set(this.navTipList[i], "chose", false);
            if (navTipList[i].icon_order === id) {
              this.navTipList.splice(i, 1);
              this.$set(this.navType, "show", false);
              this.$set(this.navType, "selDisabled", true); // 去掉下拉框的不可选择
              this.$set(this.navChanged, "navDetaiInd", null); // 设置 navdetail 的index
              this.$set(this.navType, "showSel", true); // 设置 navdetail 的index
              this.addNavForm = {
                name: "",
                type2: ""
              };
              i--;
            }
          }
          this.$forceUpdate();
          // console.log('this.navTipList--', this.navTipList)
        });
      }
    },
    // 修改图片
    uploadFile(id) {
      this.navChanged.ImgId = id;
      document.getElementById("fileIpt").click();
      this.navChanged.changeImg = true; //修改图片
    },
    // 上传图片--建立新的导航
    uploadImg(id) {
      //当前id为导航信息的总长度
      this.navChanged.changeImg = false; //新增图片不修改图片
      var icon_order = null;
      // alert(id)
      if (id === 5) {
        icon_order = 6;
        this.navDetailArr = [];
        this.textArr = [];
        this.urlArr = [];
      } else {
        // icon_order = Number(this.navTipList[id - 1].icon_order) + 1;
        icon_order = id + 1; //新增的导航id等于当前导航信息的总长+1
      }
      this.$set(this.navType, "selDisabled", true); // 开启放开下拉框的选择
      this.$set(this.navType, "showSel", true); // 放开下拉框的选择,隐藏默认导航的文本框
      this.navChanged.ImgId = icon_order;
      document.getElementById("fileIpt").click();
    },
    // 图片上传
    changeImg1(e) {
      const _this = this;
      const navTipList = _this.navTipList; //前面几个导航的数据信息
      const imgId = _this.navChanged.ImgId; //第几个导航(包括默认导航)

      // 利用fileReader对象获取file
      var file = e.target.files[0];
      var reader = new FileReader();
      // console.log("file---", file)
      if (file == undefined || file == null) {
        return false;
      }
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        var imgcode = e.target.result;
        const leng = navTipList.length;

        if (!_this.navChanged.changeImg) {
          //是否是更改图片
          _this.navChanged.choseId = imgId;
          // 建 新导航
          for (let i in navTipList) {
            navTipList[i].chose = false; //把当前选中的导航取消选中
          }
          const nav = {
            name: "新导航",
            showTool: false,
            showEye: 1,
            chose: true,
            content: "",
            icon_order: imgId,
            icon_type: 1,
            system_icon: "false",
            content: { key: [], value: [] }
          };
          nav.img = imgcode;
          _this.$set(_this.addNavForm, "name", "新导航");
          _this.$set(_this.navType, "show", true); // 右侧显示下拉框内容

          _this.$set(_this.navType, "selDisabled", false); // 去掉下拉框的不可选择
          _this.$set(_this.navType, "navType", 1); // 显示 文本内容
          _this.addNavForm.type2 = _this.typeNav[0].label; // 下拉框显示 文本

          const leng1 = _this.navDetailArr.length; //导航新增的个数

          navTipList.splice(leng, 0, nav); //在导航列表中 新增;
          let navDetails = [
            {
              icon_order: imgId,
              key: "",
              value: "",
              disabled: true,
              nothing2: false,
              nothing1: false
            }
          ];
          let textdetails = {
            icon_order: imgId,
            imgText: ""
          };

          let urlDetails = {
            icon_order: imgId,
            imgText: "http://"
          };

          _this.navChanged.navDetaiInd = leng1;

          _this.navDetailArr.splice(leng1, 0, navDetails);
          _this.textArr.splice(leng1, 0, textdetails);
          _this.urlArr.splice(leng1, 0, urlDetails);
          // console.log("新增--navDetailArr", _this.navDetailArr)
          // console.log("新增--choseId", imgId)
        } else {
          for (let i in navTipList) {
            if (navTipList[i].icon_order === imgId) {
              _this.$set(navTipList[i], "img", imgcode);
            }
          }
        }
        _this.navChanged.ImgId = null;
      };
    },
    // 信息类型--选择
    navTypeChose(e) {
      // console.log("信息类型--选择-e--", e);
      if (this.navType.navType == e) {
        return false;
      }

      this.$confirm("切换后已写入内容会清空,请确认是否切换?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.navType.navType = e;
          // console.log("改变navDetaiInd---", this.navChanged.navDetaiInd);
          const index = this.navChanged.navDetaiInd; //当前导航的下标(不包括默认导航)

          if (e != 1) {
            //切换清空

            this.navDetailArr[index] = [
              {
                key: "",
                value: "",
                disabled: true,
                nothing2: false,
                nothing1: false
              }
            ];
          }
          if (e != 2) {
            // console.log("2222222")
            this.textArr[index] = {
              imgText: ""
            };
          }
          if (e != 3) {
            // console.log("3333333")
            this.urlArr[index] = {
              imgText: "http://"
            };
          }
          // console.log(this.urlArr,'this.urlArr[index]')
          // console.log("navChanged.choseId[i]--", this.navChanged.choseId);
          const navTipList = this.navTipList;
          for (var i = 0; i < navTipList.length; i++) {
            // console.log("navTipList[i]--", navTipList[i]);
            if (navTipList[i].icon_order == this.navChanged.choseId) {
              this.$set(navTipList[i], "icon_type", e);
              if (e == 1) {
                this.$set(
                  this.navDetailArr[index][0],
                  "icon_order",
                  navTipList[i].icon_order
                );
                break;
              } else if (e == 2) {
                // console.log("e-2-", e)
                this.$set(
                  this.textArr[index],
                  "icon_order",
                  navTipList[i].icon_order
                );
                break;
              } else if (e == 3) {
                // console.log("e-3-", e)
                this.$set(
                  this.urlArr[index],
                  "icon_order",
                  navTipList[i].icon_order
                );
                break;
              }
            }
          }
          this.$set(this.navType, "navType", e);
          this.$set(this.navType, "show", true);
          // console.log("this.urlArr---", this.urlArr)
          // console.log("this.textArr---", this.textArr)
          // console.log("this.navDetailArr---", this.navDetailArr)
          this.$forceUpdate();
          // console.log("信息类型--选择.choseId---", this.navChanged.choseId)
        })
        .catch(Error => {
          this.addNavForm.type2 = this.navType.navType;
        });
    },
    // 信息名称
    inforName(e) {
      // console.log("e--", e.target.value)
      for (let i in this.navTipList) {
        if (this.navTipList[i].icon_order === this.navChanged.choseId) {
          this.addNavForm.name = e.target.value;
          this.navTipList[i].name = e.target.value;
        }
      }
    },
    // 文本--新增
    addBtn() {
      const choseId = this.navChanged.choseId;
      const navDetaiInd = this.navChanged.navDetaiInd;
      // console.log("文本--新增choseId--", choseId);
      // console.log("文本--navDetaiInd--", navDetaiInd)
      const textDetail = {
        icon_order: choseId,
        key: "",
        value: "",
        disabled: true,
        nothing2: false,
        nothing1: false
      };

      // const leng = this.navDetailArr.length

      // this.$set( this.navDetailArr[choseId] , leng, textDetail)
      // console.log(this.navDetailArr[navDetaiInd],123)
      // const leng = this.navDetailArr[navDetaiInd].length
      // this.$set(this.navDetailArr[navDetaiInd], leng, textDetail)
      this.navDetailArr[navDetaiInd].splice(
        this.navDetailArr[navDetaiInd].length,
        0,
        textDetail
      );
      // console.log("文本--新增",this.navDetailArr[navDetaiInd])
      // this.navDetailArr[navDetaiInd].splice(this.navDetailArr[navDetaiInd].length, 0, textDetail);
      // console.log("this.navDetailArr",this.navDetailArr);
      this.$forceUpdate();
    },
    // w文本--删除
    deleteInfo(index) {
      // console.log("删除--navDetaiInd", this.navChanged.navDetaiInd)
      const ind = this.navChanged.navDetaiInd;

      this.navDetailArr[ind].splice(index, 1);
      this.$forceUpdate();
    },
    // 文本 --列表名称
    textTitlBlur(e, index) {},
    // 验证网址
    urlCheck(e, index) {
      // console.log("e--",e.target.value);
      if (!validateURL(e.target.value)) {
        this.$message.error("网址格式错误");
        this.urlArr[index].imgText = "http://";
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.app-container {
  padding-bottom: 0;
  .sd-module-box {
    padding-bottom: 0;
    .lk-form-box {
      .lk-el-item {
        width: 500px;
        float: left;
        .lk-input {
          width: 336px;
        }
      }
      .text-btn.blue {
        margin-left: 20px;
      }
    }
    .addNav-left-box {
      padding: 0 15px;
    }
    .navTip-box {
      .navTip-title-box {
        background-color: $light-blue;
        width: 420px;
        height: 36px;
        line-height: 36px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        .navTitle {
          cursor: pointer;
        }
      }
      .nav-no-sort {
        width: 420px;
        min-height: 700px;
        border: 1px solid #ddd;
        border-top: none;
        padding: 0px 14px 10px;
        margin-top: 0;
        .itemMainBox {
          width: 120px;
          height: 172px;
          float: left;
          margin-right: 15px;
          padding-top: 10px;
          cursor: pointer;
          &:nth-child(3n) {
            margin-right: 0px;
          }
          .itemsBox {
            width: 120px;
            &.on {
              border: 2px solid $light-blue;
            }
          }
          .imgsBox {
            display: block;
            padding-top: 10px;
            &.uploadimg {
              .upload {
                width: 120px;
                height: 120px;
                border: 1px solid #ddd;
                margin: 0;
                text-align: center;
                line-height: 120px;
                font-size: 24px;
                color: #666;
              }
            }
            img {
              display: block;
              width: 106px;
              height: 106px;
              margin: 0 auto 20px auto;
            }
          }
          .names {
            background-color: #f1f1f1;
            color: #666666;
            text-align: center;
            font-size: 14px;
            line-height: 30px;
            display: block;
            margin: 0;
          }
          .btnItem {
            background-color: #f1f3f3ea;
            height: 30px;
            margin: 0;

            .tool_tip {
              display: block;
              width: 33.3%;
              float: left;
              height: 30px;
              line-height: 30px;
              text-align: center;
              &.looks {
              }
              &.replaces {
                cursor: pointer;
              }
            }
          }
        }
      }
      .item_content {
        width: 420px;
        min-height: 700px;
        border: 1px solid #ddd;
        border-top: none;
        padding: 10px 14px 10px;
        margin-top: 0;
        position: relative;
        .itemMainBox {
          width: 120px;
          height: 120px;
          float: left;
          margin-right: 15px;
          padding-top: 10px;
          cursor: pointer;
          &:nth-child(3n) {
            margin-right: 0px;
          }
          .img_nav {
            display: block;
            width: 106px;
            height: 106px;
            margin: 0 auto 20px auto;
          }
        }
      }
    }
    .addNav-right-box {
      padding: 20px 10px;
      .lk-el-form {
        .tip_box {
          color: red;
          font-size: 12px;
          display: block;
          line-height: 18px;
        }
        .addGods-infor-box {
          // float: left;
          min-width: 500px;
          max-width: 800px;
          margin-bottom: 10px;
          .add-gods-title {
            text-align: center;
          }
        }
        .add-btn {
          float: right;
          margin-right: 10px;
        }
        .imgText-box {
          min-height: 500px;
          margin: 0 0 30px;
        }
        .url-box {
          margin: 20px 0 0 80px;
        }
        .addGods-infor-ipt {
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" >
.app-container {
  .addNav-right-box {
    .lk-el-form {
      .el-input.is-disabled .el-input__inner {
        background-color: #fff;
        color: #666;
      }
    }
  }
}
</style>