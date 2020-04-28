<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <el-form
      ref="formList"
      :model="formList"
      :rules="formRules"
      label-width="150px"
      class="lk-form-addGods"
    >
      <sticky>
        <div class="sd-moudle-header mar-bot-10">
          <div class="sd-module-title">商品模板--查看</div>
          <div class="sd-module-btn">
            <!-- <el-button class="btn-mainCol" @click="submitGoods('formList')">保存</el-button> -->
            <el-button @click="back()">返回</el-button>
          </div>
        </div>
      </sticky>
      <div style="width:100%;height:20px;"/>
      <el-form-item label="模板名称" prop="for_name">
        <el-input v-model="formList.for_name" disabled class="w340"/>
      </el-form-item>
      <el-form-item label="商品图片"> 
        <el-switch v-model="formList.img_state" disabled/>
      </el-form-item>
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="6" class="add-gods-title">信息名称</el-col>
        <el-col :span="15" class="add-gods-title" style='text-align:left'>内容</el-col>
        <el-col :span="3" class="add-gods-title">
          <!-- <span class="opre-btn">上移</span>
          <span class="opre-btn">下移</span>-->
          <span class="opre-btn">显/隐</span>
          <!-- <span class="opre-btn">删除</span> -->
        </el-col>
      </el-row>
      <el-row :gutter="20" class="addGods-infor-box">
        <div v-for="(item,index) in godsDetail" :key="index" class="addGods-infor-ipt">
          <el-col :span="5">
            <!-- <span style='display:block;width:180px;float:left; text-align:right;color:#888; line-height:30px;padding:10px 0px 10px 0 ;'>{{item.key}}</span> -->
            <el-input
              v-model="item.key"
              disabled
              :class="item.nothing1?'border-red':''"
              placeholder="请输入名称,不超过6个字"
            />
          </el-col>
          <el-col :span="16" class="add-gods-title">
            <!-- <span style='display:block;width:500px;float:left; text-align:left;color:#888; line-height:30px;padding:10px 0;'>{{item.value}}</span> -->
            <el-input
              v-model="item.value"
              :class="item.nothing2?'border-red':''"
              disabled
            />
          </el-col>
          <el-col :span="3" class="add-gods-title">
         <!-- <el-button icon="el-icon-arrow-up" size="mini" @click="upInfor(index)"/> -->
            <!-- <el-button icon="el-icon-arrow-down" size="mini" @click="downInfor(index)"/> -->
            <el-button
              v-if="item.show===1"
              icon="el-icon-view"
              size="mini"
              @click="showOrHide(index,1)"
              disabled
            />
            <el-button v-else size="mini" @click="showOrHide(index,2)" disabled>
              <svg-icon icon-class="hidden" class/>
            </el-button> 
            <!-- <i class='el-icon-arrow-down'></i> -->
            <!-- <el-button
              :disabled="item.disabled"
              icon="el-icon-delete"
              size="mini"
              class="btn-delete"
              @click="deleteInfo(index)"
            /> -->
          </el-col>
        </div>
        <!-- <el-button class="add-goods-btn main-btn" @click="addInfor()">+ 增加信息项</el-button> -->
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
import { addgf, editgf } from '@/api/goods'
import { errorStatus } from '@/utils/index'
import Sticky from '@/components/Sticky'
export default {
  name: 'AddTemp',
  components: { Sticky },
  props: {
    editId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tit: '添加',
      formList: {
        for_name: '',
        img_state: false
      },
      img_List: '',
      goo_class: null,
      goo_formwork: null,
      dialogImageUrl: '',
      dialogVisible: false,
      godsDetail: [
        {
          key: '商品名称',
          value: '',
          disabled: true,
          show: 1,
          nothing2: false,
          nothing1: false
        },
        {
          key: '条码编号',
          value: '',
          disabled: true,
          show: 1,
          nothing1: false,
          nothing2: false
        }
      ],
      showAddClas: false,
      formRules: {
        for_name: [
          { required: true, trigger: 'blur', message: '模板名称不能为空!' }
        ]
      }
    }
  },
  created() {
    this.formList.img_state = false
    this.pageInfor()
  },
  methods: {
    // 编辑时请求数据
    pageInfor() {
      const _this = this
      const edit_id = _this.editId
      const data = {}
      data.type = 1
      if (edit_id !== 0) {
        // 编辑
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        data.edit_id = edit_id
        this.tit = '编辑'
        editgf(data)
          .then(response => {
            loading.close()
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              // console.log('dataRep----------', dataRep)
              _this.formList.for_name = dataRep.data.for_name
              const for_img = dataRep.data.for_img
              if (for_img === 1) {
                this.formList.img_state = true
              } else {
                this.formList.img_state = false
              }
              const for_content = dataRep.data.for_content
              for (const i in for_content) {
                if (
                  for_content[i].key === '商品名称' ||
                  for_content[i].key === '条码编号'
                ) {
                  for_content[i].disabled = true
                } else {
                  for_content[i].disabled = false
                }
                for_content[i].nothing1 = false
                for_content[i].nothing2 = false
              }
              this.godsDetail = for_content
            }
          })
          .catch(Error => {
            this.$message.error('请求数据失败')
          })
      }
    },

    // 保存
    submitGoods(formName) {
      const edit_id = this.editId
      // const _this = this;
      const data = this.formList
      data.type = 2
      if (data.for_name === '') {
        this.$message.error('模板名称不能为空')
        return false
      }
      // 图片是否上传
      if (data.img_state) {
        data.for_img = 1 // 传
        delete data.img_state
      } else if (!data.img_state) {
        data.for_img = 2
        delete data.img_state
      }
      const godsDetail = this.godsDetail
      const info_name = []
      const info_content = []
      const info_show = []
      const leng = /^.{0,7}/
      for (const i in godsDetail) {
        this.$set(this.godsDetail[i], 'nothing1', false)
        this.$set(this.godsDetail[i], 'nothing2', false)
        if (godsDetail[i].key === '') {
          this.$message.error('请输入信息名称!')
          this.$set(this.godsDetail[i], 'nothing1', true)
          return false
        } else if (godsDetail[i].value === '') {
          this.$message.error('请输入信息内容! ')
          this.$set(this.godsDetail[i], 'nothing2', true)
          return false
        } else if (!leng.test(godsDetail[i].key)) {
          this.$message.error('信息名称超过6位!')
        }

        info_content.push(godsDetail[i].value)
        info_name.push(godsDetail[i].key)
        info_show.push(godsDetail[i].show)
      }
      data.info_name = info_name
      data.info_content = info_content
      data.info_show = info_show
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      if (edit_id === 0) {
        // console.log('data--', data)
        addgf(data)
          .then(response => {
            loading.close()
            const dataRep = response.data
            // console.log('提交----dataRep', dataRep)
            if (errorStatus(dataRep)) {
              this.$message.success('模板保存成功!')
              this.$refs[formName].resetFields()
              this.formList.img_state = false
              const godsDetail = this.godsDetail
              for (const i in godsDetail) {
                this.godsDetail[0].value = ''
                this.godsDetail[1].value = ''
                if (i > 1) {
                  delete godsDetail[i]
                }
              }
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
            loading.close()
          })
      } else {
        data.edit_id = edit_id
        editgf(data)
          .then(response => {
            loading.close()
            const dataRep = response.data
            // console.log('提交----dataRep', dataRep)
            if (errorStatus(dataRep)) {
              this.$message.success('模板修改成功!')
              this.$emit('listerToChild', 'addPage')
            }
          })
          .catch(Error => {
            this.$message.error('请求失败!')
            loading.close()
          })
      }
    },
    // 新增信息
    addInfor() {
      const godsDetail = this.godsDetail
      const detail = {
        key: '',
        value: '',
        disabled: false,
        show: 1,
        nothing1: false,
        nothing2: false
      }
      const leng = godsDetail.length
      this.$set(this.godsDetail, leng, detail)
    },
    // 删除
    deleteInfo(index) {
      this.godsDetail.splice(index, 1)
    },
    // 显示与隐藏
    showOrHide(index, num) {
      if (num === 1) {
        this.godsDetail[index].show = 2
      } else if (num === 2) {
        this.godsDetail[index].show = 1
      }
    },
    // 上移
    upInfor(index) {
      if (index === 0) {
        return false
      }
      const index_0 = index - 1
      const goodsDetail = this.godsDetail
      const infor = goodsDetail[index]
      const infor_0 = goodsDetail[index_0]
      this.$set(this.godsDetail, index, infor_0)
      this.$set(this.godsDetail, index_0, infor)
    },
    // 下移
    downInfor(index) {
      // console.log("index---", index);
      const leng = this.godsDetail.length - 1
      const godsDetail = this.godsDetail
      if (index === leng) {
        return false
      }
      const index_0 = index + 1
      const infor = godsDetail[index]
      const infor_0 = godsDetail[index_0]
      this.$set(this.godsDetail, index, infor_0)
      this.$set(this.godsDetail, index_0, infor)
    },
    // 返回
    back() {
      this.$emit('listerToChild', 'addPage')
      // const editId = this.editId
      // const formList = this.formList
      // console.log('editId--', editId)
      // if (editId === 0) {
      //   if (formList.for_name !== '' || formList.img_state) {
      //     this.$confirm('当前填写信息未保存,是否确认离开?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     })
      //       .then(() => {
      //         this.$emit('listerToChild', 'addPage')
      //       })
      //       .catch(Error => {
      //         return false
      //       })
      //   } else {
      //     this.$emit('listerToChild', 'addPage')
      //   }
      // } else {
      //   this.$confirm('是否放弃该模板的修改?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   })
      //     .then(() => {
      //       this.$emit('listerToChild', 'addPage')
      //     })
      //     .catch(Error => {
      //       return false
      //     })
      // }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.lk-addGoods-box {
  .lk-form-addGods {
    .add-class-btn {
      margin-left: 30px;
    }
    .addGods-infor-box {
      padding: 15px 0 0 20px;
      width: 900px;
      .add-gods-title {
        text-align: center;
        .opre-btn {
          padding: 0 10px;
        }
      }
      .addGods-infor-ipt {
        height: 56px;
        line-height: 56px;
      }
      .add-goods-btn.main-btn {
        margin: 10px 15px 0 0;
        float: right;
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
    .el-select {
      width: 300px;
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
        .el-button {
          i {
            font-weight: 800;
          }
        }
      }
    }
  }
  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover{
    color:#666;
  }
}
</style>
