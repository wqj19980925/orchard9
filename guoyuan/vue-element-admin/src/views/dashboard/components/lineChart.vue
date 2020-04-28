<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <el-form ref="formList" style="":model="formList"label-width="150px"class="lk-form-addGods ">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">{{title}}</div>
        <div class="sd-module-btn">
          <el-button @click="back()">返&nbsp;&nbsp;回</el-button>
        </div>
      </div>
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="标题名称:" class="sd-form-item" prop="info_title"  >
            {{regionList.info_title}}
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="信息类型" prop="info_type" >
             <span v-if="regionList.info_type===1">信息通知</span>
             <span v-else>病虫害预警</span>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="重要程度" prop="info_level" >
            <span v-if="regionList.info_level===1">一般</span>
            <span v-if="regionList.info_level===2">重要</span>  
            <span v-if="regionList.info_level===3">紧急</span>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="发布人" prop="info_region" >
            {{regionList.info_adm_name}}
          </el-form-item>
        </el-col
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="发布时间" prop="info_region" >
            {{regionList.info_issue_time}}
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="信息内容" prop="info_content" >
           <div v-html='regionList.info_content'></div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
import { topTipList,homeList,topDetail } from '@/api/goods'
import Tinymce from '@/components/Tinymce'
import { errorStatus, parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import { phoneTest, validateURL,getByteLen } from '@/utils/validate'
import { getToken } from '@/utils/auth'
import Sticky from '@/components/Sticky'
export default {
  name: 'AddInfo',
  components: { Tinymce },
  props: {
    infoId: {
      type: Number,
      required: false
    },
  },
  data() {
    return {
      contain:'',
      formList: {
      },
      title:'消息详情',
      regionList:[]
    }
  },
  created() {
    this.pageInfor()
  },
  methods: {
    pageInfor() {
   
      const data = {}
      data.info_id =this.infoId
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

        // console.log('新增-----edit_id', edit_id)
        topDetail(data)
          .then(response => {
            loading.close()
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              // console.log('新增dataRep----------', dataRep)/
              this.regionList = dataRep.date_info
             
            }
          })
          .catch(Error => {
            this.$message.error('请求数据失败')
            loading.close()
          })
    },
    // 返回
    back() {
      const _this = this

        // console.log(22222)
        _this.$confirm('确定离开当前消息详情?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            _this.$emit('listerToChild', 'addPage')
            return false
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
  .main_cont_box {
    border-top: 8px solid #fefefe;
  }
  .contain_box {
    padding: 20px 0;
  }
  .comtain_box_edit {
    padding-bottom: 30px;
  }
  img {
    width: 100%;
  }
.mce-content-body{
  p{
    .wscnph{
      width:100%
    }
  }
}
</style>
<style scoped>

.wscnph{
  width:1px
  
}
.thisfor{background:#fff}
.el-form-item__content img{
  width:50%
}
</style>