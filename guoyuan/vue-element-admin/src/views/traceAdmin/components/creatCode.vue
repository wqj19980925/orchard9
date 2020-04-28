<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <div class="sd-moudle-header mar-bot-10">
      <div class="sd-module-title">申请发码</div>
      <div class="sd-module-btn">
        <el-button class="btn-mainCol" @click="submitInfo()">提交</el-button>
        <el-button class="btn-mainCol" @click="backBtn()">返回</el-button>
      </div>
    </div>
    <el-form
      ref="formList"
      :model="formList"
      :rules="formRules"
      label-width="150px"
      class="lk-form-addGods"
    >
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="选择农户:" class="sd-form-item" prop="far_id">
            <el-select
              v-model="formList.far_id"
              @change="changeFarmer"
              placeholder="请选择农民"
              class="allselect"
            >
              <el-option
                v-for="items in farList"
                :key="items.far_id"
                :label="items.far_name"
                :value="items.far_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="果园名称:" class="sd-form-item" prop="base_id">
            <el-select
              v-model="formList.base_id"
              @change="changeBase"
              placeholder="请选择果园名称"
              class="allselect"
              @click.native="getSelect(1)"
            >
              <el-option
                v-for="items in baseList"
                :key="items.base_id"
                :label="items.base_name"
                :value="items.base_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="生产编号:" class="sd-form-item" prop="pro_id">
            <el-select
              v-model="formList.pro_id"
              placeholder="请选择生产编号"
              class="allselect"
              @click.native="getSelect(2)"
            >
              <el-option
                v-for="items in NumList"
                :key="items.pro_id"
                :label="items.pro_number"
                :value="items.pro_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="商品品类:" class="sd-form-item" prop="cla_name">
            <el-select
              v-model="formList.cla_id"
              placeholder="请选择商品品类"
              class="allselect"
              @change="changeNum($event,2)"
            >
              <el-option
                v-for="items in classList"
                :key="items.cla_id"
                :label="items.cla_name"
                :value="items.cla_id"
              />
            </el-select>
            <!-- {{formList.cla_name}} -->
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="商品名称:" class="sd-form-item" prop="goo_id">
            <el-select
              v-model="formList.goo_id"
              placeholder="请选择商品名称"
              class="allselect"
              @change="changeNum(formList.goo_id,1)"
              @click.native="getSelect(3)"
            >
              <el-option
                v-for="items in goodsList"
                :key="items.goo_id"
                :label="items.goo_name"
                :value="items.goo_id"
              />
            </el-select>
            <!-- {{formList.goo_name}} -->
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="质检报告:" class="sd-form-item" prop="con_id">
            <el-select
              v-model="formList.con_id"
              placeholder="请选择质检报告"
              class="allselect"
              @click.native="getSelect(4)"
            >
              <el-option
                v-for="items in qualitylist"
                :key="items.con_id"
                :label="items.result+conResult[items.con_result-1]"
                :value="items.con_id"
              >
                {{items.result}}
                <span class="red" v-if="items.con_result===2">{{conResult[items.con_result-1]}}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="申请发码量:" class="sd-form-item" prop="code_num">
            <el-input v-model="formList.code_num" placeholder="请输入申请发码量" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="备注:" class="sd-form-item" prop="remark">
            <el-input v-model="formList.remark" placeholder="请输入备注" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="真伪防伪:" class="sd-form-item">
            <el-radio class="againstBut" v-model="fake_state" label="1" @change="serialNum(1)">序列号防伪</el-radio>
            <el-radio class="againstBut" v-model="fake_state" label="2" @change="serialNum(2)">计次防伪</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6" v-if="timeCount">
          <el-form-item label class="sd-form-item" prop="fake_num">
            <el-select class="allselect" v-model="formList.fake_num" placeholder="请选择防伪序列号">
              <el-option
                v-for="items in antiCounList"
                :key="items.fake_num"
                :label="items.fake_name"
                :value="items.fake_num"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
import {
  searchSendCode,
  applyCode,
  manageReport,
  searInfo,
  searTemp
} from "@/api/trace";
import { searchUp } from "@/api/ProductManage";
import { errorStatus } from "@/utils/index";
export default {
  name: "AddTrace",
  data() {
    return {
      fake_state: "1",
      formRules: {},
      qualitylist: [],
      formList: {
        far_id: "",
        base_id: "",
        pro_id: "",
        con_id: "",
        por_number: "",
        fake_num: "",
        remark: "",
        fake_state: "",
        goo_id: ""
      },
      timeCount: true,
      NumList: [],
      farList: [],
      baseList: [],
      classList: [],
      goodsList: [],
      antiCounList: [
        { fake_num: 1, fake_name: "请选择防伪序列号位数-该项为【不开启防伪】" },
        { fake_num: 8, fake_name: "8位防伪序列号" },
        { fake_num: 9, fake_name: "9位防伪序列号" },
        { fake_num: 10, fake_name: "10位防伪序列号" },
        { fake_num: 11, fake_name: "11位防伪序列号" },
        { fake_num: 12, fake_name: "12位防伪序列号" },
        { fake_num: 13, fake_name: "13位防伪序列号" },
        { fake_num: 14, fake_name: "14位防伪序列号" },
        { fake_num: 15, fake_name: "15位防伪序列号" }
      ],
      conResult: ["", "不合格"]
    };
  },
  created() {
    this.searchFarmer();
  },
  methods: {
    //搜索质检
    searchQuality(Id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      data.type = 2;
      data.goo_id = Id;
      manageReport(data)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.qualitylist = dataRep.data;
            var reslt = [];
            for (var i in dataRep.data) {
              if (dataRep.data[i].con_result === 1) {
                this.qualitylist[i].result =
                  dataRep.data[i].dit_name +
                  "[" +
                  dataRep.data[i].con_number +
                  "] ";
              } else {
                this.qualitylist[i].result =
                  dataRep.data[i].dit_name +
                  "[" +
                  dataRep.data[i].con_number +
                  "]";
              }
            }
          }
        })
        .catch(Error => {
          loading.close();
          this.$message.error("请求数据失败");
        });
    },
    //搜索农户
    searchFarmer() {
      const data = {};
      data.type = 3;
      searchSendCode(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.farList = dataRep.data;
            this.formList.far_id = this.far_id;
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
      const lis = {};
      lis.type = 5;
      searTemp(lis)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.classList = dataRep.data;
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    //搜索果园
    changeFarmer(e) {
      const data = {};
      data.type = 4;
      data.far_id = e;
      this.formList.base_id = "";
      this.formList.pro_id = "";
      this.formList.cla_name = "";
      this.formList.goo_name = "";
      this.formList.con_id = "";
      searchSendCode(data)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.baseList = dataRep.data;
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    //搜索生产编号
    changeBase(e) {
      const search = {};
      search.type = 1;
      search.base_id = e;
      this.formList.pro_id = "";
      this.formList.cla_name = "";
      this.formList.goo_name = "";
      this.formList.con_id = "";
      searchSendCode(search)
        .then(response => {
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            this.NumList = dataRep.data;
          }
        })
        .catch(Error => {
          this.$message.error("请求数据失败");
        });
    },
    getSelect(listType) {
      if (listType === 1) {
        if (this.formList.far_id === "" || !this.formList.far_id) {
          this.$message.error("请先选择农户姓名");
        }
      }
      if (listType === 2) {
        if (this.formList.base_id === "" || !this.formList.base_id) {
          this.$message.error("请先选择果园名称");
        }
      }
      if (listType === 3) {
        if (this.formList.cla_id === "" || !this.formList.cla_id) {
          this.$message.error("请先选择商品品类");
        }
      }
      if (listType === 4) {
        if (this.formList.goo_id === "" || !this.formList.goo_id) {
          this.$message.error("请先选择商品名称");
        }
      }
    },
    //搜索收货编号
    changeNum(e, type) {
      if (type === 1) {
        this.formList.con_id = "";
        this.searchQuality(e);
      } else {
        this.formList.goo_id = "";
        this.formList.con_id = "";
        const data = {};
        data.type = 5;
        data.cla_id = this.formList.cla_id;
        searInfo(data)
          .then(response => {
            const dataRep = response.data;
            if (errorStatus(dataRep)) {
              this.goodsList = dataRep.data;
            }
          })
          .catch(Error => {
            this.$message.error("请求数据失败");
          });
      }
    },

    serialNum(type) {
      if (type === 2) {
        this.timeCount = false;
      } else {
        this.timeCount = true;
      }
    },
    backBtn() {
      this.$confirm("确定离开当前页面?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("listerToChild", "addPage");
        })
        .catch(() => {});
    },
    // 提交
    submitInfo(formName) {
      const list = {};
      if (this.formList.far_id === "") {
        this.$message.error("请选择农户!");
        return;
      }
      if (this.formList.cla_id === "") {
        this.$message.error("请选择商品品类!");
        return;
      }
      if (this.formList.goo_id === "") {
        this.$message.error("请选择商品名称!");
        return;
      }
      if (this.formList.con_id === "") {
        this.$message.error("请选择质检报告!");
        return;
      }
      if (
        this.formList.code_num === "" ||
        Number(this.formList.code_num) === 0
      ) {
        this.$message.error("请输入不为0的申请发码量!");
        return;
      }
      if (isNaN(this.formList.code_num)) {
        this.$message.error("申请发码量只能输入数字!");
        return;
      }
      if (this.fake_state === "1" && !this.formList.fake_num) {
        this.$message.error("请选择防伪序列号!");
        return;
      } else {
        list.fake_num = this.formList.fake_num;
      }
      if (this.fake_state === "2") {
        list.fake_num = 0;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      list.far_id = this.formList.far_id;
      list.goo_id = this.formList.goo_id;
      list.cla_id = this.formList.cla_id;
      list.code_num = Number(this.formList.code_num);
      list.pro_id = this.formList.pro_id;
      list.con_id = this.formList.con_id;
      list.remark = this.formList.remark;
      list.fake_state = Number(this.fake_state);
      applyCode(list)
        .then(response => {
          loading.close();
          const dataRep = response.data;
          if (errorStatus(dataRep)) {
            // console.log('response---', dataRep)
            this.$message.success(dataRep.data);
            // this.$router.push('../traceAdmin/codeList');
            this.$emit("listerToChild", "addPage");
          }
        })
        .catch(Error => {
          loading.close();
          // console.log("Error=>", Error);
        });
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
      width: 800px;
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
      width: 800px;
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
<style>
.againstBut {
  width: 25%;
  margin: 0px auto !important;
}
.allselect {
  width: 100%;
}
.rightInfoWords {
  font-size: 13px;
  color: #909399;
}
</style>