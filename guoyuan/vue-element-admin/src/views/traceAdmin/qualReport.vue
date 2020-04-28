<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <div class="sd-moudle-header mar-bot-10">
      <div class="sd-module-title">质检报告</div>
    </div>
     <el-form ref="formList":model="formList":rules="formRules"label-width="150px"class="lk-form-addGods">
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="申请时间:" class="sd-form-item" prop="far_id">
            {{formList.app_contime}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="农户姓名:" class="sd-form-item" prop="far_id">
            {{formList.far_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="果园名称:" class="sd-form-item" prop="base_id">
            {{formList.base_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="生产编号:" class="sd-form-item" prop="pro_id">
            {{formList.pro_number}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="品类名称:" class="sd-form-item" prop="cla_name">
            {{formList.cla_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="商品名称:" class="sd-form-item" prop="goo_id">
            {{formList.goo_name}}
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <div class="sd-moudle-header mar-bot-10">
            <div class="sd-module-title secondTitle">质检信息</div>
          </div>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="质检单位:" class="sd-form-item" prop="goo_id">
            {{formList.dit_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="质检结果:" class="sd-form-item" prop="code_num">
            <span v-if="formList.con_result === 1" >合格</span>
            <span v-else>不合格</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="质检时间:" class="sd-form-item" prop="goo_id">
            {{formList.con_qc_time}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="质检人员:" class="sd-form-item" prop="code_num">
            {{formList.con_people}} 
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <div class="sd-moudle-header mar-bot-10">
            <div class="sd-module-title secondTitle">检测报告</div>
          </div>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item  class="sd-form-item" >
            <div v-for="item in formList.picList">
              <img :src="item"alt class="img-lookup imgThis">
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
import {  showNumber} from '@/api/trace'
import {searchUp} from '@/api/ProductManage'
import { errorStatus } from '@/utils/index'
export default {
  name: 'AddTrace',
  data() {
    return {
      formRules:{},
      formList:{
         picList:''
      },
      app_id:'',
      baseurl: process.env.BASE_API,
      imgThisUrl:''
    }
  },
  created() {
    this.app_id=this.$route.query.app_id
    this.getThisInfo()    
  },
  methods: {
    getThisInfo(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data={}
      data.app_id=this.app_id
       showNumber(data).then(response=>{
        const dataRep=response.data
        loading.close()
        if(errorStatus(dataRep)){
          this.formList=dataRep.data
          const url = process.env.BASE_API
          const baseUrl=url.replace('/public','/')
          const picUrl=[]
          const imgurl =dataRep.data.con_pic.split(',')
          for(var i in  imgurl ){
            picUrl.push(baseUrl+imgurl[i])
          }
          var imlist = {};
          for (var key in picUrl) {
              imlist[key] = picUrl[key];
          }
          this.formList.picList=imlist
        }
      }).catch(Error=>{
        loading.close()
        this.$message.error("请求失败")
      })
    },


  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
@import "src/styles/mixin.scss";
.lk-addGoods-box {
  .lk-form-addGods {
    .addGods-infor-box {
      padding: 15px 0 0 20px;;
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
.againstBut{
  width:25%;
  margin:0px auto !important;
}
.allselect{
  width:100%
}
.rightInfoWords {
  font-size:13px;
  color: #909399;
}
.imgThis{
  width:400px;
  height:400px
}
.secondTitle{
  font-size:16px !important
}
</style>