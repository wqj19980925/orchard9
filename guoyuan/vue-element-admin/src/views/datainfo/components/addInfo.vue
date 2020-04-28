<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <el-form ref="formList":model="formList":rules="formRules"label-width="150px"class="lk-form-addGods">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">{{title}}</div>
        <div class="sd-module-btn">
          <el-button class="btn-mainCol"@click="submitInfo('formList',2)">立即发布</el-button>
          <el-button class="btn-mainCol"@click="submitInfo('formList',1)">保&nbsp;&nbsp;存</el-button>
          <el-button @click="back()">返&nbsp;&nbsp;回</el-button>
        </div>
      </div>
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="标题名称:" class="sd-form-item" prop="info_title"  >
            <el-input v-model="formList.info_title" placeholder="请输入标题名称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="信息类型" prop="info_type" >
            <el-select v-model="formList.info_type" placeholder="请选择信息类型" style="width:100%">
              <el-option v-for="items in infoType" :key="items.id" :label="items.name" :value="items.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="重要程度" prop="info_level" >
            <el-select v-model="formList.info_level" placeholder="请选择重要程度" style="width:100%">
              <el-option v-for="item in impDegree" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="是否置顶" prop="info_top" >
            <el-select v-model="formList.info_top" placeholder="请选择是否置顶" style="width:100%">
              <el-option v-for="items in infoTop" :key="items.id" :label="items.name" :value="items.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="发布对象" prop="info_region" >
            <el-select v-model="formList.info_region" placeholder="请选择发布对象" style="width:100%">
              <el-option v-for="item in regionList" :key="item.region_id" :label="item.region_name" :value="item.region_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="信息内容" prop="info_content" >
            <div class='main_cont_box'>
              <div class='comtain_box_edit'> 
                <Tinymce :height="400"v-model="formList.info_content"/> 
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
import {  addThisInfo, uploadImg, editThisInfo, recallInfo, pubThisInfo } from '@/api/map'
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
    editId: {
      type: Number,
      required: false
    },


  },
  data() {
    return {
      contain:'',
      title: '新增消息',
      formList: {
        info_title:'',
        info_level:'',
        info_region:'',
        info_content:'',
        info_type :'',
        info_state:'', 
        info_top:''
      },
      regionList:[],
      formRules: {
        info_title: [{ required: true, trigger: 'blur', message: '请输入标题名称' }],
        info_level: [{ required: true, trigger: 'change', message: '请输入重要程度' }],
        info_region: [{ required: true, trigger: 'change', message: '请选择果园' }],
        info_type: [{ required: true, trigger: 'change', message: '请输入信息类型' }],
        info_state: [{ required: true, trigger: 'change', message: '请选择发布状态' }, ],
      },
      infoType:[
        { id: 1, name: '信息通知 ' },
        { id: 2, name: '病虫害预警'},
      ],
      infoTop:[
        { id: 0, name: '不置顶 ' },
        { id: 1, name: '置顶'},
      ],
      impDegree:[
        { id: 1, name: '一般' },
        { id: 2, name: '重要' },
        { id: 3, name: '紧急' }
      ],
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    this.pageInfor()
  },
  methods: {
    pageInfor() {
      // const edit_id = this.editId;
      // const btnId = this.btnId;
      // console.log('edit_id----------', edit_id)
      const data = {}
      data.type = 1
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

        // console.log('新增-----edit_id', edit_id)
        addThisInfo(data)
          .then(response => {
            loading.close()
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              // console.log('新增dataRep----------', dataRep)/
              this.regionList = dataRep.data_info

            }
          })
          .catch(Error => {
            this.$message.error('请求数据失败')
            loading.close()
          })
       
      if (this.editId !== 0) {
          data.info_id=this.editId
           editThisInfo(data)
          .then(response => {
            loading.close()
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              // console.log('新增dataRep----------', dataRep)/
              this.formList=dataRep.data_info.info[0]

            }
          })
          .catch(Error => {
            this.$message.error('请求数据失败')
            loading.close()
          })
        }
      // } else if(btnId === 1){
      //   // var myDate = new Date() // 获取系统当前时间
      //   // console.log('获取当前秒数(0-59)', myDate)
      //   this.title = '编辑消息'
      //   data.edit_id=edit_id  

      // }
    },
    // 提交
    submitInfo(formName,type) {
      const list = this.formList
      if(list.info_title===''){
        this.$message.error("请输入标题名称!")
        return false
      }
      if(list.info_level===''){
        this.$message.error("请选择重要程度!")
        return false
      }
      if(list.info_region===''){
        this.$message.error("请选择发布对象!")
        return false
      }
      if(list.info_content===''){
        this.$message.error("请输入信息内容!")
        return false
      }
      if(list.info_type===''){
        this.$message.error("请输入信息类型!")
        return false
      }
      if(list.info_top===''){
        this.$message.error("请选择是否置顶!")
        return false
      }

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
       const _this = this
        this.$refs[formName].validate((valid) => {
        if (valid) {
        if (this.editId === 0) {
          if(type ===1){
            list.info_state=1
            // console.log('list-新增', list)
            addThisInfo(list)
              .then(response => {
                loading.close()
                const dataRep = response.data
                if (errorStatus(dataRep)) {
                  this.$emit('listerToChild', 'addPage') // 返回
                  this.$message.success(dataRep.data)
                  _this.$refs[formName].resetFields()
                }
                loading.close()
              })
              .catch(Error => {
                // this.$message.error("提交请求失败!");
                console.log('err--', Error)
                loading.close()
              })
          }else if(type ===2){
            list.info_state=2
            // console.log('list-新增', list)
            addThisInfo(list)
              .then(response => {
                loading.close()
                const dataRep = response.data
                if (errorStatus(dataRep)) {
                  this.$emit('listerToChild', 'addPage') // 返回
                  this.$message.success("立即发布成功!")
                  _this.$refs[formName].resetFields()

                }
                loading.close()
              })
              .catch(Error => {
                // this.$message.error("提交请求失败!");
                console.log('err--', Error)
                loading.close()
              })
          }
       
      } else {
        if(type ===1){
          list.info_id = this.editId
          list.info_state=1
          // console.log('list-新增', list)
          editThisInfo(list)
            .then(response => {
              loading.close()
              const dataRep = response.data
              if (errorStatus(dataRep)) {
                // console.log('response---', dataRep)
                this.$message.success(dataRep.data)
                this.$emit('listerToChild', 'addPage') // 返回
              }
            })
            .catch(Error => {
              loading.close()
              console.log('Error=>', Error)
            });
          }
          else if(type ===2){
            list.info_id = this.editId
            list.info_state=2
          // console.log('list-新增', list)
          editThisInfo(list)
            .then(response => {
              loading.close()
              const dataRep = response.data
              if (errorStatus(dataRep)) {
                // console.log('response---', dataRep)
                this.$message.success("立即发布成功!")
                this.$emit('listerToChild', 'addPage') // 返回
              }
            })
            .catch(Error => {
              loading.close()
              console.log('Error=>', Error)
            });
          }
      }
      }})
       
    },
    // 返回
    back() {
      const editId = this.editId
      const _this = this
      // console.log('000000')
      if (_this.formList.info_title !== '' ||
       _this.formList.info_level !== ''||
       _this.formList.info_region !== ''||
       _this.formList.info_type !== ''||
       _this.formList.info_state !== '') {
        // console.log(22222)
        _this.$confirm('添加信息未保存, 确定离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            _this.$emit('listerToChild', 'addPage')
            return false
        })
      }else{
        _this.$emit('listerToChild', 'addPage')
      }
    },
    cancleForm(formName) {
      this.showAddClas = false
      this.$refs[formName].resetFields()
      this.addClaForm.cla_name = ''
      this.addClaForm.cla_stase = this.diaState[0].name
    },
    cancleType(formName) {
      this.showAddType = false
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
</style>