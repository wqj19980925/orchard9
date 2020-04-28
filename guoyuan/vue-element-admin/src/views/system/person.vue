<template>
  <div class="app-container">
    <el-row class="sd-module-box per-infor">
      <el-form ref="perInfoForm" :model="perInfoForm" label-width="150px">
        <div class="sd-moudle-header mar-bot-10">
          <div class="sd-module-title">账号信息</div>
<!--           <div class="sd-module-btn">
            <el-button v-if="!showEditInfor" class="btn-mainCol" @click="editPerInfor()">编辑</el-button>
            <el-button v-else class="btn-mainCol" @click="savePerInfor()">保存</el-button>
          </div> -->
        </div>
        <div v-if="!showEditInfor" class="person-infor-box">
          <ul>
            <li>
              <span class="infor-tit">用户名:</span>
              <span class="infor-con">{{ perInfo.adm_acc }}</span>
              <span class="infor-btn" @click="showModify = true">修改密码</span>
            </li>
            <li>
              <span class="infor-tit">联系电话:</span>
              <span class="infor-con">{{ perInfo.adm_mobile }}</span>
               <span class="infor-btn" @click="showModifyTel=true">更改电话</span>
            </li>
            <li>
              <span class="infor-tit">员工姓名:</span>
              <span class="infor-con">{{ perInfo.adm_name }}</span>
            </li>
          </ul>
        </div>
        <div v-else class="person-edit-box">
          <el-form-item label="用户名:" class="per_edit_item">
            <el-input v-model="perInfoForm.adm_acc" class="w340" disabled="true"/>
          </el-form-item>
          <el-form-item label="联系电话:" class="per_edit_item">
            <el-input v-model="perInfoForm.adm_mobile" class="w340"/>
          </el-form-item>
          <el-form-item label="员工姓名:" class="per_edit_item">
            <el-input v-model="perInfoForm.adm_name" class="w340"/>
          </el-form-item>
        </div>
      </el-form>
    </el-row>
    <el-row  class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">企业信息</div>
        <div class="sd-module-btn" v-if="perInfo.adm_leave===1">
          <el-button v-if="inputDisabled" class="btn-mainCol" @click="editCompany">编辑</el-button>
          <el-button v-else class="btn-mainCol" @click="saveCopInfo('perInfo')">保存</el-button>
        </div>
      </div>
      <div class="person-infor-box company-infor-box">
        <div class="company-logo-box">
          <div class="upload-img">
            <div v-if="allowAddImg" class="upload-img-bd">
              <div class="add-img-box" @click="fileClick">
                <input id="fileIpt"type="file"accept="image/*"class="ipt-add"@change="changeImg($event)">
                <span class="icon-add el-icon-plus"/>
                <p class="logo-text">上传公司logo</p>
              </div>
            </div>
            <div v-else class="img-list">
              <div class="img_show_box" @click="imgClick()">
                <img :src="imgArr[0]" alt>
                <input id="fileIpt"type="file"accept="image/*"class="ipt-add"@change="changeImg($event)">
              </div>
            </div>
          </div>
        </div>
        <el-form ref="perInfo" :form="perInfo" label-width="140px" class="company-form">
          <el-form-item label="企业名称:">
            <el-input v-model="perInfo.com_name":disabled="inputDisabled"type class="w340"placeholder />
          </el-form-item>
          <el-form-item label="客服热线:">
            <el-input v-model="perInfo.info_telephone":disabled="inputDisabled"type class="w340"placeholder />
          </el-form-item>
          <el-form-item label="公司地址:">
            <el-input v-model="perInfo.info_address" :disabled="inputDisabled" placeholder/>
          </el-form-item>
          <el-form-item label="营业执照:" >
            <el-button v-if="!inputDisabled"class="up_img_btn"@click="changelicen()">
              更换营业执照
            </el-button><span  v-if="!inputDisabled" class="infor-btn-red"  >上传营业执照前请添加水印</span>
            <el-button v-if="inputDisabled" class="up_img_btn"type="primary"@click="lookImg()">
              点击预览
            </el-button> 
           <!--   <el-input v-if ="!perInfo.showBtn"v-model="perInfo.value":class="perInfo.nothing2?'border-red':''"
              :placeholder   ="perInfo.placeh" :disabled ="perInfo.disabled"@blur="blurValue($event,index)"/>
            <span class="infor-btn" @click="showlicen()" >营业执照</span>
          </el-form-item>
           <el-form-item label="营业执照:" :disabled="inputDisabled" v-else>
             <el-input v-if ="!perInfo.showBtn"v-model="perInfo.value":class="perInfo.nothing2?'border-red':''"
              :placeholder   ="perInfo.placeh" :disabled ="perInfo.disabled"@blur="blurValue($event,index)"/>
            <span class="infor-btn" @click="changelicen()" >更换营业执照</span> -->
          </el-form-item>
        </el-form>

         <input id ="upFile"type="file"style="display:none;"@change="uploadlicen($event)">
      </div>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog :visible.sync="showModify" :close-on-click-modal="false" title="修改密码" width="30%" @close="canModPwd()">
      <el-form ref="form" :model="form" label-width="100px" class="modify-pwd-dialog">
        <div v-if="!showNewPwd">
          <el-form-item label="原密码">
            <el-input v-model="form.oldPwd" class="w200" type="password"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="oldpwdLoading"type="primary"class="modifyPwd-btn"@click="subOldpwd()">
              下一步
            </el-button>
          </el-form-item>
        </div>
        <div v-if="showNewPwd">
          <el-form-item label="新密码">
            <el-input v-model="form.new_password" class="w200" type="password"/>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="form.renew_password" class="w200" type="password"/>
          </el-form-item>
          <el-form-item>
            <el-button class="modifyPwd-btn" @click="cancleModify('form')">取 消</el-button>
            <el-button
              :loading="newpwdLoading"
              type="primary"
              class="modifyPwd-btn"
              @click="subNewpwd('form')"
            >提 交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
    <!-- 弹窗修改电话 -->
    <el-dialog :visible.sync="showModifyTel" :close-on-click-modal="false" title="更改电话" width="30%" @close="canModPwd()">
      <el-form ref="telform" :model="telform" label-width="100px" class="modify-pwd-dialog">
        <div v-if="!showNewTel">
          <el-form-item label="原手机号码">
            {{telform.oldTel}}
          </el-form-item>
      
            <el-input placeholder="请输入验证码" v-model="telform.veriCode" style=" width: 300px;">
              <template slot="append"> 
                <el-button v-show="showCode" @click="verificateCode(2)" >获取验证码</el-button>
                <span v-show="!showCode" class="count">{{count}} s</span>
              </template>
            </el-input>
     
          <el-form-item>
            <el-button :loading="oldpwdLoading"type="primary"class="modifyPwd-btn"@click="verificateCode(3)">
              下一步
            </el-button>
          </el-form-item>
        </div>
        <div v-if="showNewTel">
          <el-form-item label="新手机号码">
             <el-input v-model="telform.newtel" class="w200" />
          </el-form-item>
      
            <el-input placeholder="请输入新手机验证码" v-model="telform.verinewCode" style=" width: 300px;">
              <template slot="append"> 
                <el-button v-show="showNewCode" @click="verificateNewCode(1)" disabled>获取验证码</el-button>
                <span v-show="!showNewCode" class="count">{{count}} s</span>
              </template>
            </el-input>
     
          <el-form-item style="margin-top:20px;">
             <el-button class="modifyPwd-btn" @click="cancleModify('telform')">取 消</el-button>
            <el-button :loading="newpwdLoading" type="primary"class="modifyPwd-btn"@click="verificateNewCode(2,telform.verinewCode)">
              提交
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
    <!-- 营业执照 -->
    <el-dialog :visible.sync="img.showImg":close-on-click-modal="false"title="营业执照"width="400px"class="lookimg-dialog"@close="img.showImg=false">
       <img :src="img.imgUrl"alt class="img-lookup">
      <span slot="footer">
        <el-button type="primary"@click="img.showImg=false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {personal, oldpwd, newpwd, editlogo, companyedit, personaledit, showlicense ,newTel,agoTel} from '@/api/system'
import { errorStatus } from '@/utils/index'
import { valiPassword, phoneTest } from '@/utils/validate'
import { isSame } from '@/utils/main'
export default {
  name: 'Person',
  data() {
    return {
      showEditInfor: false,
      perInfo: {
        adm_acc: '',
        info_license:'',
        placeh:'',
        value:'', 
      },
      perInfoForm: {
        adm_acc: '',
        adm_mobile: '',
        adm_name: ''
      },
      count: '',
      timer: null,
      showCode:true,
      showNewCode:true,
      showModify: false,
      showNewPwd: false,
      showModifyTel:false,
      showNewTel:false,
      form: {
        oldPwd: '',
        new_password: '',
        renew_password: ''
      },
      telform:{
        oldTel:'',
        veriCode:'',
        verinewCode:'',
        newtel:''
      },
      tel:'',
      img: {
        showImg: false,
        imgUrl: ''
      },
      linDetInp: null,
      Businesslice:'',
      oldpwdLoading: false,
      newpwdLoading: false,
      allowAddImg: true,
      imgArr: [],
      inputDisabled: true
    }
  },
  created() {
    // 页面加载时
    this.getPageInfo()
  },
  methods: {
    getPageInfo() {
      const data = {}
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
 
      personal(data)

        .then(response => {
          loading.close()
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.perInfo = dataRep.admin
            
            //手机号脱敏
            this.tel=dataRep.admin.adm_mobile
            var aogtel=dataRep.admin.adm_mobile
            var pat=/(\d{3})\d*(\d{4})/
            var telhide=aogtel.replace(pat,'$1****$2');
            this.perInfo.adm_mobile=telhide
            this.telform.oldTel=telhide

            const baseUrl = process.env.BASE_API
            const str = baseUrl.replace('/public', '/public/')
            if (dataRep.admin.com_logo !== '') {
              const img = [
                str + dataRep.admin.com_logo
              ]
              this.imgArr = img
              this.allowAddImg = false
            }
            if (
                dataRep.admin.com_name === '' ||
                dataRep.admin.info_telephone === '' ||
                dataRep.admin.info_address === ''
              ){
                this.inputDisabled = false
              }
            }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求失败!')
        })
    },
    // 编辑个人信息
    editPerInfor() {
      this.perInfoForm.adm_acc = this.perInfo.adm_acc
      this.perInfoForm.adm_mobile = this.perInfo.adm_mobile
      this.perInfoForm.adm_name = this.perInfo.adm_name
      this.showEditInfor = true
    },
    // 保存个人信息
    savePerInfor() {
      const data = this.perInfoForm
      // console.log('个人信息--', data)
      if (!phoneTest(data.adm_mobile)) {
        this.$message.error('请输入正确的手机号!')
        return false
      }
      personaledit(data)
        .then(response => {
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.perInfo.adm_acc = this.perInfoForm.adm_acc
            this.perInfo.adm_mobile = this.perInfoForm.adm_mobile
            this.perInfo.adm_name = this.perInfoForm.adm_name
            this.$message.success('修改成功')
          }
          this.showEditInfor = false
        })
        .catch(Error => {
          this.$message.error('请求失败')
          this.showEditInfor = false
        })
    },
    // 编辑公司信息--按钮
    editCompany() {
      this.inputDisabled = false
    },
    // 提交公司信息--按钮
    saveCopInfo() {
      const company = {}
      company.com_name= this.perInfo.com_name
      company.info_telephone= this.perInfo.info_telephone
      company.info_address=this.perInfo.info_address
      company.info_license=this.Businesslice
      // delete company.adm_acc;
      // delete company.adm_mobile;
      // delete company.com_logo;
      // delete company.adm_mobile;
      if (company.com_name === '') {
        this.$message.error('请输入公司名称')
        return false
      } else if (company.info_address === '') {
        this.$message.error('请输入公司地址')
        return false
      } else if (company.info_telephone === '') {
        this.$message.error('请输入客服热线')
        return false
      }
      companyedit(company).then(response => {
        const dataRep = response.data
        // console.log('提交公司信息--', dataRep)
        if (errorStatus(dataRep)) {
          this.inputDisabled = true;
          this.$message.success(dataRep.data)
        }
      })
    },
    //旧手机号验证码
    verificateCode(type){
      if(type === 2){
        const TIME_COUNT = 60;
         if (!this.timer) {
           this.count = TIME_COUNT;
           this.showCode = false;
           this.timer = setInterval(() => {
           if (this.count > 0 && this.count <= TIME_COUNT) {
             this.count--;
            } else {
             this.showCode = true;
             clearInterval(this.timer);
             this.timer = null;
            }
           }, 1000)
          }
        }
      var data ={}
       data.phone=parseInt(this.tel)
       data.type=parseInt(type)
       if(type === 3){
        if(this.telform.veriCode !== ''){
          data.code=parseInt(this.telform.veriCode)
        }else{
          this.$message.error("请输入验证码")
          return false
        }
       } 
       this.oldpwdLoading = true
        agoTel(data)
        .then(response => {
          this.oldpwdLoading = false
            const dataRep = response.data
            // console.log('验证原密码', dataRep)
            if (errorStatus(dataRep)) {
              if(type === 3){
                 this.showNewTel =true
              }else{
                  this.$message.success(response.data.data)
              }
          }
        })
        .catch(Error => {
          this.oldpwdLoading = false
        })
    },
    //新手机号验证码
    verificateNewCode(newtype,code){
       if (this.telform.newtel === '') {
        this.$message.error('手机号码不能为空')
        return false
      }
      if (code === '') {
        this.$message.error('验证码不能为空')
        return false
      }
       if(newtype === 1){
        const TIME_COUNT = 60;
         if (!this.timer) {
           this.count = TIME_COUNT;
           this.showNewCode = false;
           this.timer = setInterval(() => {
           if (this.count > 0 && this.count <= TIME_COUNT) {
             this.count--;
            } else {
             this.showNewCode = true;
             clearInterval(this.timer);
             this.timer = null;
            }
           }, 1000)
          }
        }
       var data ={}
       data.phone=parseInt(this.telform.newtel)
       data.type=parseInt(newtype)
       if(newtype === 2){
          if(this.telform.veriNewCode !== ''){
            data.code=parseInt(code)
          }else{
            this.$message.error("请输入验证码")
            return false
          }
        }
        this.newpwdLoading  = true
         newTel(data)
        .then(response => {
          this.newpwdLoading = false
            const dataRep = response.data
            // console.log('验证原密码', dataRep)
            if (errorStatus(dataRep)) {
              this.$message.success(response.data.data)
              if(newtype === 2){
                this.showNewTel=false
                this.showModifyTel =false
                this.getPageInfo()
              }
          }
        })
        .catch(Error => {
          this.newpwdLoading = false
        })

    },
    // 验证原密码
    subOldpwd() {
      this.oldpwdLoading = true
      const data = {}
      const _this = this
      data.old_pwd = _this.form.oldPwd
      // console.log('data.old_pwd---', data)
      oldpwd(data)
        .then(response => {
          _this.oldpwdLoading = false
          const dataRep = response.data
          // console.log('验证原密码', dataRep)
          if (errorStatus(dataRep)) {
            _this.showNewPwd = true
          }
        })
        .catch(Error => {
          _this.oldpwdLoading = false
        })
    },
    // 修改新密码
    subNewpwd(formName) {
      const _this = this
      const data = _this.form
      delete data.oldPwd
      if (data.new_password === '') {
        this.$message.error('新密码不能为空')
        return false
      } else if (data.renew_password === '') {
        this.$message.error('请再次输入密码')
        return false
      }
      if (!valiPassword(data.new_password)) {
        _this.newpwdLoading = false
        this.$message.error('格式错误,密码应为6~20位数字字母组合')
        // callback(new Error());
        return false
      }
      if (!isSame(data.new_password, data.renew_password)) {
        _this.newpwdLoading = false
        this.$message.error('两次密码不一致')
        return false
      }

      // console.log('新密码---', data)
      this.newpwdLoading = true
      newpwd(data)
        .then(response => {
          _this.newpwdLoading = false
          const dataRep = response.data
          // console.log('新密码', dataRep)
          if (errorStatus(dataRep)) {
            this.$refs[formName].resetFields()
            this.showModify = false
            this.showNewPwd = false
            this.$message.success('密码修改成功')
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          _this.newpwdLoading = false
        })
    },
    changelicen(){
      document.getElementById('upFile').click()
    },
    // lookImg(){
    //   const baseUrl = process.env.BASE_API
    //   const url = this.perInfo.info_license
    //   const str = baseUrl.replace('public', 'public/')
    //   this.img.imgUrl = str + url
    //   this.img.showImg = true
    // },
    //查看营业执照
    lookImg(){
      const data = {}
      showlicense(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.img.showImg = true
            const img_path = dataRep.data.info_license
             const baseUrl = process.env.BASE_API
             const str = baseUrl.replace('public', '/')
              this.img.imgUrl = str + img_path
              this.img.showImg = true
          }
        })
        .catch(Error => {
          this.$message.error('请求失败')
          _this.newpwdLoading = false
        })
    },
    uploadlicen(e){
      const _this = this
      // const imgArrList = _this.imgArr
      const index = _this.linDetInp
      var file = e.target.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
      // 读取到的图片base64 数据编码 
        var imgcode = e.target.result
        _this.Businesslice=imgcode
        _this.perInfo.value= imgcode
        _this.$message.success('上传营业执照成功!')

      }
    },
    
    // 触发上传图片事件
    fileClick() {
     if(this.inputDisabled === false){
        document.getElementById('fileIpt').click()
      }else{
        return false
      }
    },
    imgClick() {
      if(this.inputDisabled === false){
        document.getElementById('fileIpt').click()
      }else{
        return false
      }   
    },
    // 上传图片
    changeImg(e) {
      // console.log('22222')
      const _this = this
      const imgArrList = _this.imgArr
      var file = e.target.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        var imgcode = e.target.result
        // console.log(imgcode);
        imgArrList.splice(0, 0, imgcode)
        _this.allowAddImg = false
        // console.log('上传logo---', imgArrList)
        const data = {}
        data.logophoto = imgcode
        editlogo(data)
          .then(response => {
            const dataRep = response.data
            // console.log('上传logo1212', dataRep)
            if (errorStatus(dataRep)) {
              // console.log("1212")
              _this.$message.success(dataRep.data)
            }
          })
          .catch(Error => {
            console.log('err--', Error)
          })
      }
    },
    cancleModify(formName) {
      this.telform.veriCode = ''
      this.telform.verinewCode = ''
      this.telform.newtel = ''
      this.$refs[formName].resetFields()
      this.showModify = false
      this.showNewPwd = false
      this.showModifyTel=false
      this.showNewTel=false
    },
    canModPwd() {
      this.form.oldPwd = ''
      this.showModify = false
      this.showNewPwd = false
      this.telform.veriCode = ''
      this.telform.verinewCode = ''
      this.telform.newtel = ''
      this.showModifyTel=false
      this.showNewTel=false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.app-container {
  .sd-module-box {
    &.per-infor {
      margin-bottom: 10px;
    }
    .person-infor-box {
      &.company-infor-box {
        padding-left: 40px;
      }
      padding-left: 16px;
      ul {
        li {
          height: 60px;
          line-height: 60px;
          span {
            display: block;
            float: left;
            &.infor-tit {
              width: 100px;
              letter-spacing: 3px;
              color: #666;
            }
            &.infor-con {
              width: 200px;
              color: #333;
            }
            &.infor-btn {
              color: $blue;
              cursor: pointer;
              font-size: 14px;
            }
          }
        }
      }
      .company-logo-box {
        float: left;
        padding-right: 30px;
        // width: 200px;
        // height: 200px;
        .upload-img {
          .upload-img-bd {
            float: left;
            border: 1px dashed #999;
            width: 160px;
            height: 160px;
            cursor: pointer;
            &:hover {
              border: 1px dashed $blue;
              .icon-add {
                color: $blue;
              }
              .logo-text {
                color: $blue;
              }
            }
            .icon-add {
              width: 160px;
              text-align: center;
              display: block;
              margin-top: 30px;
              line-height: 74px;
            }
            .logo-text {
              width: 160px;
              text-align: center;
              color: #666;
              margin-top: 0;
            }
          }
          .img-list {
            float: left;
            margin-right: 10px;
            .img_show_box {
              width: 160px;
              height: 160px;
              cursor: pointer;
              // position: relative;
              img {
                width: 160px;
                height: 160px;
              }
            }
          }
          .ipt-add {
            display: none;
          }
        }
      }
      .company-form {
        float: left;
      }
    }
  }
  .modify-pwd-dialog {
    .modifyPwd-btn {
      float: right;
      margin-right: 20px;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" >
.person-edit-box {
  padding-top: 20px;
  .per_edit_item {
    .el-form-item__label {
      font-size: 16px;
      color: #666;
      font-weight: normal;
      letter-spacing: 3px;
    }
    line-height: 60px;
  }
}
.person-infor-box {
  .company-form {
    .el-form-item__label {
      font-size: 16px;
      color: #666;
      font-weight: normal;
      letter-spacing: 3px;
    }
    .el-input--medium {
      .el-input__inner {
        border: 1px solid #bbb;
      }
    }
    .el-input--medium.is-disabled {
      .el-input__inner {
        background-color: #fff;
        border: #fff;
        color: #333;
        cursor: default;
      }
    }
   
  }
}

.modify-pwd-dialog {
  .el-form-item__label {
    padding: 0 20px 0 0;
  }
}
</style>
<style>
  .infor-btn {
      color: #409EFF;
      cursor: pointer;
      font-size: 14px;
    }
  .infor-btn-red{
      color: #F56C6C;
      font-size: 14px;
    }
    .img-lookup {
      width: 240px;
      height: 300px;
      margin: auto;
      display: block;
    }
</style>