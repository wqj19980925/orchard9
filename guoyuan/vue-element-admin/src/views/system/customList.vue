<template>
	<div class="app-container">
		<el-row  v-if="showList" class="sd-module-box">
		    <div class="sd-moudle-header mar-bot-10">
		        <div class="sd-module-title">客户列表</div>
		        <div class="sd-module-btn">
		          <el-button class="btn-mainCol" v-if='btnShow.addBtn'@click="addCustBtn()">新增
		          </el-button>
		          <el-button class="openCol-btn" v-if='btnShow.startBtn' @click="enableClas(1)">启用</el-button>
		          <el-button class="stopCol-btn" v-if='btnShow.stopBtn' @click="enableClas(2)">停用</el-button>
		        </div>
			</div>
			<el-form ref="custformList" :model="custformList"  :rules="rules" class="sd-form-box clearfix" size="medium" label-width="100px" >
		        <el-row class="clearfix">
		          <el-col :span="5" class="sd-col-6" >
		            <el-form-item label="会员名称:" class="sd-form-item" prop="com_name" >
		              <el-input class='lk-inp'v-model="custformList.com_name" placeholder="请输入会员名称" />
		            </el-form-item>
		          </el-col>
		          <el-col :span="5" class="sd-col-6" >
		            <el-form-item label="联系人:" class="sd-form-item" prop="adm_name" >
		              <el-input class='lk-inp' v-model="custformList.adm_name" placeholder="请输入联系人" />
		            </el-form-item>
		          </el-col>
		          <el-col :span="5" class="sd-col-6" >
		            <el-form-item label="联系电话:" class="sd-form-item" prop="adm_mobile" >
		              <el-input class='lk-inp' v-model="custformList.adm_mobile" placeholder="请输入联系电话" />
		            </el-form-item>
		          </el-col>
		          <el-col :span="4" class="sd-col-4" >
		            <el-form-item label="状态:"  prop="com_stase" >
		            	<el-select class='lk-sel' v-model="custformList.com_stase"  >
	                		<el-option v-for="item in state" :key="item.id" :label="item.name" :value="item.id" />
	              		</el-select>
		            </el-form-item>
		          </el-col>
		          <el-col  class="pl-50 fr w250" style >
	            	<el-button class type="primary" @click="getinfo(1)" >搜&nbsp;&nbsp;索</el-button>
	            	<el-button class @click="resetForm('custformList')" >重&nbsp;&nbsp;置</el-button>
	          	  </el-col>
		      </el-row>
      		</el-form>
      		<div class="lk-table-box">
        		<el-table :data="custList" width="100%" @selection-change="handleSelectionChange">
          			<el-table-column type="selection" width="55" />
          			<el-table-column label="客户名称" prop="com_name" min-width align="center"/>
          			<el-table-column label="联系人" prop="adm_name" min-width align="center"/>
          			<el-table-column label="联系电话" prop="adm_mobile" min-width align="center"/>
          			<el-table-column label="登录账号" prop="adm_acc" min-width align="center"/>
          			<el-table-column label="到期时间" prop="com_expiretime" min-width align="center"/>
          			<el-table-column label="状态" min-width align="center">
          				<template slot-scope="scope">
		            		<div v-if="scope.row.com_stase == 1">启用</div>
		            		<div v-else>停用</div>
            			</template>
            		</el-table-column>
          			<el-table-column label="操作" prop="adm_pre" min-width align="center">
          				<template slot-scope="scope">
          					<div class="opr-btn-box">
          						<el-button size="mini" class="btn-mainCol" @click="editRow(scope.row)">编辑</el-button>
                				<el-button v-if="scope.row.com_stase==2" size="mini" class="openCol-btn" @click="enableThisClas(scope.row,1)" >启用</el-button>
                				<el-button v-if="scope.row.com_stase==1" size="mini" class="stopCol-btn" @click="enableThisClas(scope.row,2)" >停用</el-button>
          					</div>
          				</template>
          			</el-table-column>
          		</el-table>
          	</div>
          	<div  v-show="custList.length>0" class="lk-page-box" >
		        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalNum" layout="total, prev, pager, next, jumper" background @current-change="handleCurrentChange" />
		    </div>
		</el-row>
		<!-- 新增 -->
		 <addCustomer v-if="!showList" :edit-id="edit_id" :admPre='adm_pre' @listerToChild="showListPages()"/>
      	
	</div>
</template>
<script>
	import {getCustInfo,addCustom,editCustom,startComp,stopComp} from '@/api/system'
	import { errorStatus } from '@/utils/index'
	import addCustomer from './components/addCus'
	export default {
	 name: 'Account',
  	 components: { addCustomer},
	 data() {
	 	return {
	 	 	custformList:{
		 		adm_acc: '',
		        adm_name: '',
		        adm_mobile: '',
		        com_stase: '',
		        com_name:''
	 		},
	 		showList: true,
	 		edit_id: 0,
	 		adm_pre:null,
	 		btnShow: {},
	 		custList: [],
	 		currentPage: 1,
		    pageSize: null,
		    totalNum: null,
		    state: [
		        { id: 0, name: '全部' },
		        { id: 1, name: '启用' },
		        { id: 2, name: '停用' }
		      ],
		    state1: [{ id: 1, name: '启用' }, { id: 2, name: '停用' }],
		    addialog: {
		        title: '新增',
		        show: false,
		        addLoading: false,
		        addshow: false,
		        edit_id: 0
      		},
      		chosed:null,
      		rules:{},
      		addRules:{},
      		addForm: {
		        adm_name: '',
		        adm_acc: '',
		        adm_mobile: '',
		        com_name: '',
		        com_stase: '',
		        adm_pas: ''
		    },
	 	}
	 },
	 created() {
	 	this.getinfo();
 	},
 	 methods: {
 	 	//客户列表
 	 	getinfo(num){
 	 		const loading = this.$loading({
		        lock: true,
		        text: 'Loading',
		        spinner: 'el-icon-loading',
		        background: 'rgba(0, 0, 0, 0.7)'
		      })
 	 		 const data = this.custformList;
		      if(num){
		        data.page = num;
		      }else{
		        data.page = this.currentPage;
		      }
		      if(data.com_stase =='全部'){
		        data.com_stase=''
		      }
	      	data.pri_id = this.$route.meta.pri_id// 传入按钮id
	     	getCustInfo(data).then(response => {
          		loading.close()
	            const dataRep = response.data
	            if (errorStatus(dataRep)) {
			        this.custList = dataRep.data_info.data;
			        this.currentPage = dataRep.data_info.current_page
			        this.pageSize = dataRep.data_info.current_number
			        this.totalNum = dataRep.data_info.total
			        const btnList = response.data.button
			       	for (const i in btnList) {
		              if (btnList[i].pri_funname === '添加') {
		                this.$set(this.btnShow, 'addBtn', true)
		              } else if (btnList[i].pri_funname === '编辑') {
		                this.$set(this.btnShow, 'editBtn', true)
		                // this.$set(this.btnId, 'addBtn', btnList[i].pri_id)
		              } else if (btnList[i].pri_funname === '启用') {
		                this.$set(this.btnShow, 'startBtn', true)
		                // this.$set(that.btnId, 'startBtn', btnList[i].pri_id)
		              } else if (btnList[i].pri_funname === '停用') {
		                this.$set(this.btnShow, 'stopBtn', true)
		                // this.$set(that.btnId, 'stopBtn', btnList[i].pri_id)
		              }
            		}
			    }
        	}).catch(Error => {
	          loading.close()
	          this.$message.error('请求失败')
	          console.log('请求失败--', Error)
        	})
 	 	},     
 	 	resetForm(formName) {
	      this.$refs[formName].resetFields()
	    },
 	 	 showListPages() {
	      this.edit_id=0;
	      this.showList = true
	      this.getinfo()
	    },
	    editRow(row){
	      // console.log("row--",row);
	      this.edit_id=row.com_id;
	      this.adm_pre=row.adm_pre;
	      this.showList=false;
	    },
	    // 停 启用--单个
	    enableThisClas(row,num){
	      const data={};
	      data.com_id=[row.com_id];
	      // console.log("停 启用--单个--",data)
	      if(num===1){
	        startComp(data).then(response=>{
	          if(errorStatus(response.data)){
	            this.$message.success(response.data.data)
	            row.com_stase=1;
	          }
	        })
	      }else{
	        stopComp(data).then(response=>{
		        if(errorStatus(response.data)){
		            this.$message.success(response.data.data)
		            row.com_stase=2;
		        }
	          })
		  }
	    },
	        //停 启用--多个
    	enableClas(num){
	      const chosed=this.chosed;
	      // console.log("chosed--",chosed)
	      if(num===1){
	          // 启用
	          if(chosed===null){
	            this.$message.error("请选中要启用的客户");
	            return  false
	          }
	       	  var id=[];
	          for(let i in chosed){
		        if(chosed[i].com_stase===2){
		        id.push(chosed[i].com_id)
		        }  
	       	  }
		      if(id.length>0){
		        const data={};
		        data.com_id=id;
		        this.$confirm('请确认,是否启用选中的客户?', '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		        }).then(()=>{
		            startComp(data).then(response=>{
			            if(errorStatus(response.data)){
			             this.$message.success(response.data.data);
			             for(let i in id){
			               for(let j in this.list){
			                 if (id[i] === this.list[j].adm_id) {
			                   list[j].adm_stase = 1
			                  }
			                }
			              }
			            }
		           })
		        })
		       }else{
	          this.$confirm("选中客户的状态全部为'启用'", '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'error'
	          }).then(() => {})

	       }
	      }else{
	        // 停用
	        if(chosed===null){
	          this.$message.error("请选中要停用的客户");
	          return  false
	        }
	        var id=[];
	        for(let i in chosed){
	        if(chosed[i].com_stase===1){
	          id.push(chosed[i].com_id)
	        }  
	         if(id.length>0){
	         const data={};
	         data.com_id=id;
	          this.$confirm('请确认,是否停用选中的客户?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	          }).then(()=>{
	            stopComp(data).then(response=>{
		           if(errorStatus(response.data)){
		             this.$message.success(response.data.data);
		             for(let i in id){
		               for(let j in this.list){
		                 if (id[i] === this.list[j].adm_id) {
		                   list[j].adm_stase = 2
		                  }
		                }
		              }
		            }
	           })
	        })
	       }else{
		          this.$confirm("选中客户的状态全部为'停用'", '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'error'
		          }).then(() => {})
		       	}
		       }
		      }
	    },
 	 	 // 添加
	    addCustBtn() {
	    	this.edit_id = 0
      		this.showList = false
	  /*    this.addialog.title = '新增'
	      this.addialog.edit_id = 0
	      this.addForm.com_stase = this.state1[0].name
	      const data={};
	      addCustom(data).then(response=>{
	        if(response.data){
	          //  console.log("11111111111111111111",response.data.roleinfo)
	     
	          this.addialog.show = true
	          this.addialog.editshow = false;
	        }
	      }).catch(Error=>{
	        console.log("Error--",Error)
	      })*/
	    },
	    // 选中状态
	    handleSelectionChange(val) {
	      this.chosed = val
	    },
	    // 分页
	    handleCurrentChange(val) {
	      this.currentPage = val;
	      this.getPageInfo();
	    },
 	 }	 
  }
</script>
<style>
	
</style>