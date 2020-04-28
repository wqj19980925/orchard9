<template>
  <el-row class="sd-module-box lk-addGoods-box">
    <div class="sd-moudle-header mar-bot-10">
      <div class="sd-module-title">申请发码</div>
       <div class="sd-module-btn">
          <el-button  class="btn-mainCol"@click="submitInfo()">提交</el-button>
          <el-button  class="btn-mainCol"@click="backBtn()">返回</el-button>
        </div>
    </div>
     <el-form ref="formList":model="formList":rules="formRules"label-width="150px"class="lk-form-addGods">
      <el-row :gutter="20" class="addGods-infor-box">
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="农民姓名:" class="sd-form-item" prop="far_id">
            <el-select v-model="formList.far_id" @change="changeFarmer" :disabled="disabl" placeholder="请选择农民姓名" class="allselect" >
              <el-option v-for="items in farList" :key="items.far_id" :label="items.far_name" :value="items.far_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
        <el-form-item label="果园名称:" class="sd-form-item" prop="base_id">
            <el-select v-model="formList.base_id"  :disabled="disabl"  @change="changeBase" placeholder="请选择果园名称" class="allselect"   >
              <el-option v-for="items in baseList" :key="items.base_id" :label="items.base_name" :value="items.base_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="生产编号:" class="sd-form-item" prop="pro_id">
            <el-select v-model="formList.pro_id"  :disabled="disabl"  placeholder="请选择生产编号" class="allselect"  @change='changeNum'>
              <el-option v-for="items in NumList" :key="items.pro_id" :label="items.pro_number" :value="items.pro_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="商品品类:" class="sd-form-item" prop="cla_name">
            {{formList.cla_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="商品名称:" class="sd-form-item" prop="goo_id">
            {{formList.goo_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="预估产量:" class="sd-form-item" prop="pro_estimate">
            {{formList.pro_estimate}}
          </el-form-item>
        </el-col>
        <el-col :span="12" class="sd-col-6">
          <el-form-item label="已发码量:" class="sd-form-item" prop="code_num">
            {{formList.pro_code}}
            <span class="rightInfoWords">不含本次发码量</span>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <template>
            <div class="lk-table-box">
              <el-table height="180" :data="list"width="100%" ref="table" @selection-change="handleSelectionChange" >
                <el-table-column type="selection"width="55"/>
                <el-table-column label="收货编号"min-width align="center">
                  <template slot-scope="scope">
                    {{scope.row.por_number}}
                    <span v-if="scope.row.por_state ===1">(已发码)</span>
                    <span v-if="scope.row.por_state ===2">(未发码)</span>
                    <span v-if="scope.row.por_state ===3">(审核中)</span>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称"min-width prop="goo_name" align="center"/>
                <el-table-column label="收获数量"align="center" prop="por_count" width="150"/>
              </el-table>
            </div>
          </template>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="质检报告:" class="sd-form-item" prop="con_id">
            <el-select v-model="formList.con_id" placeholder="请选择质检报告"  class="allselect" >
              <el-option v-for="items in qualitylist" :key="items.con_id" :label="items.dit_name +'['+ items.con_number+']'" :value="items.con_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="申请发码量:" class="sd-form-item" prop="pro_code" >
            <el-input v-model="formList.pro_code" placeholder="请输入申请发码量" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="备注:" class="sd-form-item" prop="remark">
            <el-input v-model="formList.remark" placeholder="请输入备注" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6">
          <el-form-item label="真伪防伪:" class="sd-form-item" >
            <el-radio class="againstBut" v-model="fake_state" label="1" @change="serialNum(1)">序列号防伪</el-radio>
            <el-radio class="againstBut" v-model="fake_state" label="2" @change="serialNum(2)" >计次防伪</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="sd-col-6" v-if="timeCount">
          <el-form-item label="" class="sd-form-item" prop="fake_num">
            <el-select class="allselect" v-model="formList.fake_num" placeholder="请选择防伪序列号" >
              <el-option  v-for="items in antiCounList" :key="items.fake_num" :label="items.fake_name" :value="items.fake_num" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
import { searchSendCode , applyCode ,manageReport} from '@/api/trace'
import {searchUp} from '@/api/ProductManage'
import { errorStatus } from '@/utils/index'
export default {
  name: 'AddTrace',
  data() {
    return {
      list:[],
      fake_state:'1',
      formRules:{},
      disabl:false,
      qualitylist:[],
      formList:{
        far_id:'',
        base_id:'',
        pro_id:'',
        con_id:'',
        pro_code:'',
        por_number:'',
        fake_num:'',
        remark:'',
        fake_state:'',
        goo_id:''
      },
      timeCount:true,
      NumList:[],
      farList:[],
      baseList:[],
      chosed:'',
      antiCounList:[
        {fake_num:1,fake_name:'请选择防伪序列号位数-该项为【不开启防伪】'},
        {fake_num:8,fake_name:'8位防伪序列号'},
        {fake_num:9,fake_name:'9位防伪序列号'},
        {fake_num:10,fake_name:'10位防伪序列号'},
        {fake_num:11,fake_name:'11位防伪序列号'},
        {fake_num:12,fake_name:'12位防伪序列号'},
        {fake_num:13,fake_name:'13位防伪序列号'},
        {fake_num:14,fake_name:'14位防伪序列号'},
        {fake_num:15,fake_name:'15位防伪序列号'},
      ]
    }
  },
  created() {
    
  this.searchQuality()
  this.searchFarmer()
  // this.changeFarmer()
  // this.changeNum()
  // this.changeBase()
   
    
  },
  methods: {
    //搜索质检
    searchQuality(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {};
      manageReport(data)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.qualitylist = dataRep.data
          }
        })
        .catch(Error => {
          loading.close()
          this.$message.error('请求数据失败')
        })
    },
    //搜索农户
    searchFarmer(){
      const data = {};
      data.type = 3
      searchSendCode(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.farList = dataRep.data
            this.formList.far_id = this.far_id
          }
        })
        .catch(Error => {
          this.$message.error('请求数据失败')
        })
    },
    //搜索果园
    changeFarmer(e){

      const data = {};
      data.type =4
      data.far_id =e
      this.formList.base_id=''
      this.formList.pro_id=''
      this.formList.cla_name = ''
      this.formList.goo_name = ''
      this.formList.pro_estimate = ''
      this.formList.pro_code = ''
      this.list=[]
      searchSendCode(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.baseList = dataRep.data   
            
          }
        })
        .catch(Error => {
          this.$message.error('请求数据失败')
        })
    },
    //搜索生产编号
    changeBase(e){
      const search = {};
      search.type=1
      search.base_id=e
      this.formList.pro_id=''
      this.formList.cla_name = ''
      this.formList.goo_name = ''
      this.formList.pro_estimate = ''
      this.formList.pro_code = ''
      this.list=[]
      searchSendCode(search)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.NumList = dataRep.data
          }
        })
        .catch(Error => {
          this.$message.error('请求数据失败')
        })
    },
    //搜索收货编号
    changeNum(e){
      for(var i in this.NumList){
        if(e === this.NumList[i].pro_id){
          this.formList.cla_name = this.NumList[i].cla_name
          this.formList.goo_name = this.NumList[i].goo_name
          this.formList.pro_estimate = this.NumList[i].pro_estimate
          this.formList.pro_code = this.NumList[i].pro_code
        }
      }
      const data = {};
      data.type=2
      data.pro_id=e
       searchSendCode(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.list = dataRep.data
            if(this.list.length === 1){
              this.$nextTick(() => {
                this.$refs.table.toggleRowSelection(this.list[0],true);
              })
            } 
          }
        })
        .catch(Error => {
          this.$message.error('请求数据失败')
        })
    },

      // 选中状态
    handleSelectionChange(val) {
      this.chosed = val
    },
    serialNum(type){
      if(type===2){
        this.timeCount=false 
      }else{
        this.timeCount=true
      } 
    },
    backBtn(){
      this.$confirm('确定离开当前页面?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.$emit('listerToChild', 'addPage')
          }).catch(() => {
        })
     },
    // 提交
    submitInfo(formName) {
        const list ={}
        for(var i in this.NumList){
          if(this.formList.goo_name = this.NumList[i].goo_name){
            list.goo_id = this.NumList[i].goo_id
          }
        }
        for(var i in this.NumList){
          if(this.formList.cla_name = this.NumList[i].cla_name){
            list.cla_id = this.NumList[i].cla_id
          }
        }
        if(this.chosed === ''){
          this.$message.error('请至少勾选一个收获编号!')
          return
        }
        if(this.formList.con_id === ''){
          this.$message.error('请选择质检报告!')
          return
        }
        
        if(this.formList.pro_code === '' || Number(this.formList.pro_code) === 0){
          this.$message.error('请输入不为0的申请发码量!')
          return
        }
        if(isNaN(this.formList.pro_code)){
          this.$message.error('申请发码量只能输入数字!')
          return
        }
        if(this.formList.remark === ''){
          this.$message.error('请输入备注!')
          return
        }
        if(this.fake_state === '1' && !this.formList.fake_num){
          this.$message.error('请选择防伪序列号!')
          return
        }
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
         const chosed = this.chosed
          list.por_id = []
        for (const i in chosed) {
          list.por_id.push(chosed[i].por_id)

        }
        list.code_num=Number(this.formList.pro_code)
        list.pro_id=this.pro_id
        list.con_id=this.formList.con_id
        list.code_num=this.formList.pro_code
        list.remark=this.formList.remark
        list.fake_state=Number(this.fake_state)
        list.fake_num=this.formList.fake_num
        applyCode(list)
        .then(response => {
          loading.close()
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            // console.log('response---', dataRep)
            this.$message.success(dataRep.data)
            this.$router.push('../traceAdmin/codeList');
          }
        })
        .catch(Error => {
          loading.close()
          console.log('Error=>', Error)
        });
      }

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
</style>