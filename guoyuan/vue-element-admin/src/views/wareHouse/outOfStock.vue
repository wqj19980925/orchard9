<template>
	<div class="app-orderList">
		<div v-if="closeAdd">
			<el-row class="sd-module-box">
				<div class="sd-moudle-header mar-bot-10">
					<div class="sd-module-title">订单出库</div>
					<div class="sd-module-btn">
						<el-button class="openCol-btn" @click="enables(1)">导出</el-button>
						<el-button class="btn-delete" @click="enables(2)">删除</el-button>
					</div>
				</div>
				<el-form ref="formList" :model="formList" class="sd-form-box clearfix" size="medium" label-width="100px">
					<el-row>
						<el-col :span="7" class="lk-col-5" style="width:450px">
							<el-form-item label="添加时间:" prop="timesmain" class="sd-form-item">
								<el-date-picker v-model="timesmain" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" />
							</el-form-item>
						</el-col>
						<el-col :span="5" class="lk-col-5">
							<el-form-item label="系统单号:" prop="del_order" class="sd-form-item">
								<el-input v-model="formList.del_order" placeholder="请输入系统单号" />
							</el-form-item>
						</el-col>
						<el-col :span="5" class="lk-col-5">
							<el-form-item label="收货信息:" prop="rep_name" class="sd-form-item">
								<el-input v-model="formList.rep_name" placeholder="请输入收货信息" />
							</el-form-item>
						</el-col>
						<el-col :span="4" class="lk-col-5">
							<el-form-item label="添加人:" prop="adm_name" class="sd-form-item">
								<el-input v-model="formList.adm_name" placeholder="请输入添加人" /></el-form-item>
						</el-col>
						<el-col :span="5" class="fr w200">
							<el-button type="primary" @click="getListInformation()">搜&nbsp;&nbsp;索</el-button>
							<el-button @click="resetForm()">重&nbsp;&nbsp;置</el-button>
						</el-col>
					</el-row>
				</el-form>
				<div class="lk-table-box amountQuan">
					<el-table :data="tableList" width="100%" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55" prop="del_id" />
						<el-table-column label="操作时间" min-width align="center" prop="del_createtime" />
						<el-table-column label="系统单号" min-width align="center" prop="del_order" width="250px">
							<template slot-scope="{ row }">
								<span class="rec_order" @click="handleInfo(row.del_id)">{{ row.del_order }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量" min-width align="center" prop="del_count" />
						<el-table-column label="添加人" min-width align="center" prop="adm_name" />
						<el-table-column label="类型" min-width align="center" prop="del_shipper_type" />
						<el-table-column label="发货信息" min-width align="center" prop="rep_name" />
						<el-table-column label="收货信息" min-width prop="del_receiving" align="center" />
						<el-table-column label="备注" min-width align="center" prop="del_remarks" />
						<el-table-column label="操作" align="center" width="180">
							<template slot-scope="{ row }">
								<el-button class="btn-mainCol" size="mini" @click="refusal(row)">拒单</el-button>
								<el-button class="btn-mainCol" size="mini" @click="computed(row)">计数出库</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="lk-page-box">
					<el-pagination :current-page="current_page" :page-size="current_number" :total="total" layout="total, prev, pager, next, jumper" background @current-change="handleCurrentChange" />
				</div>
			</el-row>
		</div>
		<!-- 新增页面 -->
		<computedWare v-if="computedVisible" v-bind:del_id="del_id" @submit="submitWare" />
		<DialogInfo v-if="dialogInfo" :visible.sync="dialogInfo" :id="id" />
	</div>
</template>
<script>
	import { writeLists, educeEcxel, writedelete,refuse } from '@/api/outWareHouse';
	import computedWare from './components/computedWareOut';
	import DialogInfo from './components/DialogInfoOut';
	import { errorStatus } from '@/utils/index';
	export default {
		components: {
			DialogInfo,
			computedWare
		},
		data() {
			return {
				tableList: [],
				timesmain: '',
				ware_id: '', // 仓库ID
				del_createtime: '', // 添加时间
				del_order: '', // 订单编号
				del_count: '', // 总入库量
				adm_name: '', // 添加入
				rep_name: '', // 收货信息
				del_shipper_type: '', // 订单类型
				del_shipper: '', // 发货信息
				del_remarks: '', // 备注信息
				del_id: '', // 入库单ID
				current_page: '',
				total: '',
				page: 1,
				current_number: '',
				last_page: '',
				radio: [], // 被选中的id
				showAdd: false,
				closeAdd: true,
				formList: {
					ware_id: '', // 仓库ID
					del_createtime0: '', // 起始时间
					del_createtime1: '', // 结束时间
					del_order: '', // 订单编号
					del_count: '', // 总入库量
					adm_name: '', // 添加入
					rep_name: '', // 收货信息
					del_shipper_type: '', // 订单类型
					del_shipper: '', // 发货信息
					del_remarks: '', // 备注信息
					del_id: '' // 入库单ID
				},
				id: '',
				dialogInfo: false,
				computedVisible: false
			};
		},
		created() {
			// 页面加载时
			this.getListInformation();
		},
		methods: {
			getListInformation() {
				// 请求列表数据
				const that = this;
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				if(that.timesmain != '' && that.timesmain != null) {
					if(that.timesmain[0] == that.timesmain[1]) {
						const reg = new RegExp('00:00:00'); //g代表全部
						let newMsg = that.timesmain[1].replace(reg, '23:59:59');
						that.formList.del_createtime0 = that.timesmain[0];
						that.formList.del_createtime1 = newMsg;
					} else {
						that.formList.del_createtime0 = that.timesmain[0];
						that.formList.del_createtime1 = that.timesmain[1];
					}
				} else {
					this.formList.del_createtime0 = ''
					this.formList.del_createtime1 = ''
				}
				const ListData = that.formList;
				ListData.page = this.page;
				writeLists(ListData)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
								that.tableList = response.data.data_info.data_info;
								that.current_page = response.data.data_info.current_page;
								that.total = response.data.data_info.total;
								that.current_number = response.data.data_info.current_number;
								that.last_page = response.data.data_info.last_page;
								loading.close();
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
			refusal(data){
				console.log(data.del_id);
				const ListData = {
					del_id:data.del_id
				};
				refuse(ListData)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
							this.$message.success('拒单成功!');
							this.getListInformation();
							} else {
								loading.close();
								this.$message.error(response.data.data);
							}
						}
					})
					.catch(err => {
						loading.close();
						this.$message.error(err.data.data);
					});
			},
			resetForm() {
				this.timesmain = '';
				this.formList.del_order = '';
				this.formList.rep_name = '';
				this.formList.adm_name = '';
				this.formList.del_createtime0 = ''
				this.formList.del_createtime1 = ''
				this.getListInformation();
			},
			handleSelectionChange(val) {
				// 单选框被选中的
				const that = this;
				that.chosed = val;
				that.radio = [];
				for(var i = 0; i < val.length; i++) {
					that.radio.push(val[i].del_id);
				}
			},

			enables(data) {
				if(this.radio != '') {
					const that = this;
					const loading = this.$loading({
						lock: true,
						text: 'Loading',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					const radioList = {};
					radioList.del_id = that.radio;
					if(data == 1) {
						educeEcxel(radioList)
							.then(response => {
								const dataRep = response.data
								if(errorStatus(dataRep)) {
									if(response.data.code == 200) {
										loading.close();
										const url = process.env.BASE_API;
										const str = response.data.data;
										const base = url.replace('/public', '/');
										window.location.href = base + str;
									} else {
										loading.close();
										this.$message.error(response.data.data);
									}
								}
							})
							.catch(err => {
								loading.close();
								this.$message.error('导出出库单失败!');
							});
					} else {
						// 删除入库单
						writedelete(radioList)
							.then(response => {
								const dataRep = response.data
								if(errorStatus(dataRep)) {
									if(response.data.code == 200) {
										loading.close();
										this.$message.success('删除出库单成功!');
										this.getListInformation();
									} else {
										loading.close();
										this.$message.error(response.data.data);
									}
								}
							})
							.catch(err => {
								loading.close();
								this.$message.error('删除出库单失败!');
							});
					}
				} else {
					this.$message.error('请选择需要操作的出库单!');
				}
			},
			showListPages() {
				this.showAdd = false;
				this.closeAdd = true;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getListInformation();
			},

			submit() {
				console.log(2222222);
				this.showListPages();
				this.getListInformation();
			},
			handleInfo(id) {
				this.id = id;
				this.dialogInfo = true;
			},
			computed(id) {
				this.del_id = id;
				this.computedVisible = true;
				this.closeAdd = false;
			},
			submitWare() {
				this.computedVisible = false;
				this.closeAdd = true;
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
</style>