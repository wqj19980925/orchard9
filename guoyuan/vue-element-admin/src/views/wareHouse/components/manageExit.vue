<template>
	<div class="app-orderList">
			<el-row class="sd-module-box">
				<div class="sd-moudle-header mar-bot-10">
					<div class="sd-module-title">{{ware_ids.ware_name}} —— 库存</div>
					<div class="sd-module-btn">
						<el-button class="btn-mainCol" @click="addReceipt">返回</el-button>
					</div>
				</div>
				<el-form class="sd-form-box clearfix" size="medium" label-width="100px">
					<el-row>
						<el-col :span="5" class="lk-col-5">
							<el-form-item label="物品名称:" prop="managesList.goo_name" class="sd-form-item">
								<el-input v-model="managesList.goo_name" placeholder="请输入物品名称" />
							</el-form-item>
						</el-col>
						<el-col :span="5" class="lk-col-5">
							<el-form-item label="物品品类:" prop="managesList.cla_name" class="sd-form-item">
								<el-input v-model="managesList.cla_name" placeholder="请输入物品品类" />
							</el-form-item>
						</el-col>
						<el-col :span="4" class="lk-col-5" style="width:240px">
							<el-form-item label="库存数量:" prop="managesList.num_min" class="sd-form-item">
								<el-input :min="0" type="number" style="width:95%" v-model="managesList.num_min" placeholder="最小值" controls-position="right" />
							</el-form-item>
						</el-col>
						<el-col :span="3" class="sd-col-6" style="width:180px">
							<el-form-item label-width="20px" prop="managesList.num_max" class="sd-form-item">
								<el-input :min="1" type="number" style="width:80%" v-model="managesList.num_max" placeholder="最大值" controls-position="right" />
							</el-form-item>
						</el-col>
						<el-col :span="5" class="fr w200">
							<el-button type="primary" @click="getListInformation()">搜&nbsp;&nbsp;索</el-button>
							<el-button @click="resetForm()">重&nbsp;&nbsp;置</el-button>
						</el-col>
					</el-row>
				</el-form>
				<div class="lk-table-box amountQuan">
					<el-table :data="data_info" width="100%">
						<el-table-column type="selection" width="55" prop="stu_id" />
						<el-table-column label="物品名称" min-width align="center" prop="goo_name" />
						<el-table-column label="物品品类" min-width align="center" prop="cla_name" />
						<el-table-column label="库位名称" min-width align="center" prop="sto_name" />
						<el-table-column label="库存数量" min-width align="center" prop="stu_num" />
						<el-table-column label="所属农户" min-width align="center" prop="far_name" />
					</el-table>
				</div>
				<div class="lk-page-box">
					<el-pagination
						:current-page="current_page"
						:page-size="current_number"
						:total="total"
						layout="total, prev, pager, next, jumper"
						background
						@current-change="handleCurrentChange"
					/>
				</div>
			</el-row>
	</div>
</template>
<script>
import { checkSto, checkDish} from '@/api/wareHouse';
import { errorStatus } from '@/utils/index';
export default {
	props: {
	    ware_ids: {
	      type: Object,
	      default: 0,
	    }
	  },
	data() {
		return {
			current_page: '',
			total: '',
			current_number: '',
			last_page: '',
			page:1,
			managesList:{
				ware_id:'',
				goo_name:'',
				cla_name:'',
				num_min:'',
				num_max:'',
			},
			data_info:[],
		};
	},
	created() {
		// 页面加载时
         this.getListInformation();
	},
	methods: {
		getListInformation() {
			//请求列表数据
			const that = this;
			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			that.managesList.ware_id=this.ware_ids.ware_id;
			const ListData = that.managesList;
			ListData.page=this.page;
			checkSto(ListData)
				.then(response => {
					const dataRep = response.data
					if(errorStatus(dataRep)) {
					console.log(response);
					if (response.data.code == 200) {
						that.data_info = response.data.data.data_info;
						that.current_page = response.data.data.current_page;
						that.total = response.data.data.total;
						that.last_page = response.data.data.last_page;
						that.current_number = response.data.data.current_number;
						loading.close();
						this.$message.success('列表查询成功!');
					} else {
						loading.close();
						this.$message.error(response.data.data);
					}
					}
				})
				.catch(err => {
					loading.close();
					this.$message.error('列表查询失败!');
				});
		},
		resetForm(){
			this.managesList.goo_name='',
			this.managesList.cla_name='',
			this.managesList.num_min='',
			this.managesList.num_max='',
            this.getListInformation();
		},
		addReceipt(){
			this.$emit('submit')
		},
		handleCurrentChange(val){
			this.page=val;
			this.getListInformation();
		}
	}
};
</script>
<style rel="stylesheet/scss" lang="scss">
.inventory {
	display: inline-block;
}
.rec_order {
	cursor: pointer;
	text-decoration: underline;
}
.textsCent{
	text-align: center;
}
</style>
