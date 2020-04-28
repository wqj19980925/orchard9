<template>
	<el-row class="sd-module-box">
		<div class="sd-moudle-header mar-bot-10">
			<div class="sd-module-title">{{ware_ids.ware_name}} —— 出库</div>
		</div>
		<el-form ref="addReceipts" :model="addReceipts" :rules="rules" class="sd-form-box clearfix" size="medium" label-width="100px">
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="出库仓库:" prop="ware_ids.ware_name" class="sd-form-item">
						<el-input v-model="ware_ids.ware_name" style="width:430px" :disabled="true" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="选择农户:" prop="far_id" class="sd-form-item">
						<el-select v-model="addReceipts.far_id" style="width:430px" value-key="far_id" @change="warehouseGoods" placeholder="请选择农户">
							<el-option v-for="item in far_info" :key="item.far_id" :label="item.far_name" :value="item.far_id" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="备注:" prop="addReceipts.del_remarks" class="sd-form-item">
						<el-input v-model="addReceipts.del_remarks" style="width:430px" placeholder="请输入出库备注" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="ware_ids.type==1">
				<el-col class="lk-col-5">
					<el-form-item label="接收农户:" prop="far_ids" class="sd-form-item">
						<el-select v-model="farsidMain" style="width:430px" value-key="far_id" @change="warehouseGoodstwo" placeholder="请选择农户">
							<el-option v-for="item in far_infos" :key="item.far_id" :label="item.far_name" :value="item.far_id" />
						</el-select>
						<span style="color: red;">*</span>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div v-if="receiptList.length" class="lk-table-box amountQuan" style="width:700px;">
			<el-table :data="receiptList" height="300px" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" prop="goods_id" />
				<el-table-column prop="goods_name" label="商品名称" min-width align="center" />
				<el-table-column prop="stu_num" label="存储数量" min-width align="center" />
				<el-table-column label="出库数量" min-width align="center">
					<template slot-scope="{row}">
						<el-input v-model="row.det_real_actual" placeholder="请输入数量" />
					</template>
				</el-table-column>
				<el-table-column label="所在库位" min-width prop="sto_name" align="center" />
				<el-table-column label="所属农户" min-width prop="far_name" align="center" />
			</el-table>
		</div>
		<el-row>
			<el-col class="text_left">
				<el-button @click="handleCancel">返回</el-button>
				<el-button type="primary" @click="handleSubmit">提交出库</el-button>
			</el-col>
		</el-row>
		<el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" title="强制出库" width="500px">
			<el-form ref="add" class="sd-form-box clearfix" size="medium" label-width="100px">
				<div>出库数量大于仓库存储数量是否强制出库</div>
			</el-form>
			<span slot="footer">
				<el-button @click="cancel">修改出库数量</el-button>
				<el-button type="primary" @click="addFormNew()">强制出库</el-button>
			</span>
		</el-dialog>
	</el-row>
</template>
<script>
	import {
		writeAssess,
		deliverAssess,
	} from '@/api/wareHouse';
	import { errorStatus } from '@/utils/index';
	export default {
		props: {
			ware_ids: {
				type: Object,
				default: 0,
			},
			typeId: {
				default: 1,
			}
		},
		data() {
			return {
				far_info: [], //农户信息
				far_infos: [], //所有农户
				receiptList: [], //农户物品
				receiptMainList: [], //出库物品
				dialogVisible: false,
				far_idmain: '',
				addReceipts: {
					del_remarks: '', //备注
					rep_id: '', //仓库ID
					far_id: '', //农户id
					goods_info: '', //入库信息
				},
				farsidMain: '',
				rules: {
					far_id: [{
						required: true,
						message: '请选择农户',
						trigger: 'change'
					}],
				},

			}
		},
		created() {
			this.peasantsMain();
			this.peasantsMains();
		},
		methods: {
			peasantsMain() { //获取农户信息
				console.log(this.ware_ids);
				const interfaces = {
					type: 5,
					rep_id: this.ware_ids.ware_id,
				}
				deliverAssess(interfaces)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
								console.log(response);
								this.far_info = response.data.data_info;
								console.log(this.far_info);
							} else {
								this.$message.error(response.data.data);
							}
						}
					})
					.catch(err => {
						this.$message.error(err.data.data);
					});
			},
			peasantsMains() { //获取农户信息
				console.log(this.ware_ids);
				const interfaces = {
					type: 1
				}
				writeAssess(interfaces)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
								this.far_infos = response.data.data_info.far_info;
							} else {
								this.$message.error(response.data.data);
							}
						}
					})
					.catch(err => {
						this.$message.error(err.data.data);
					});
			},
			warehouseGoods(val) {
				this.far_idmain = val
				const interfaces = {
					type: 2,
					rep_id: this.ware_ids.ware_id,
					far_id: this.far_idmain
				}
				deliverAssess(interfaces)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
								console.log(response);
								this.receiptList = [];
								this.receiptList = response.data.data_info;
								// console.log(this.typeId,'this.typeId')
								for(let j in this.receiptList){
									if(this.typeId == 1){
										if(this.receiptList[j].agr_unit == 1){
											this.receiptList[j].stu_num = this.receiptList[j].stu_num + ' 个'
										}else{
											this.receiptList[j].stu_num = this.receiptList[j].stu_num + ' kg'
										}
									}else{
										if(this.receiptList[j].agr_unit == 1){
											this.receiptList[j].stu_num = this.receiptList[j].stu_num
										}else{
											this.receiptList[j].stu_num = this.receiptList[j].stu_num
										}
									}
								}
							} else {
								this.$message.error(response.data);
							}
						}
					})
					.catch(err => {
						console.log(err);
						this.$message.error(err.data.data);
					});
			},
			warehouseGoodstwo(val) {
				console.log(val, this.far_infos);
				this.farsidMain = val;
			},
			handleSelectionChange(val) {
				this.receiptMainList = val;
			},
			handleCancel() {
				this.$emit('submit')
			},
			cancel() {
				this.dialogVisible = false
			},
			handleSubmit() {
				if(this.addReceipts.far_id == '') {
					this.$message.error("请选择农户");
				} else if(this.receiptMainList.length == '0') {
					this.$message.error("请完善出库物品");
				} else if(this.ware_ids.type == '1' && this.farsidMain == '') {
					this.$message.error("农资请选择接收人");
				} else {
					for(let i = 0; i < this.receiptMainList.length; i++) {
						if(this.receiptMainList[i].det_real_actual == '') {
							this.$message.error("出库数量不能为空");
							return false;
						} else if(this.receiptMainList[i].det_real_actual == '0') {
							this.$message.error("出库数量不能为0");
							return false;
						} else if(this.receiptMainList[i].det_real_actual == undefined) {
							this.$message.error("出库数量不能为空");
							return false;
						} else if(!/^[0-9]*$/.test(this.receiptMainList[i].det_real_actual)){
							this.$message.error('出库数量必须是整数')
							return false;
						} else if(parseInt(this.receiptMainList[i].det_real_actual) > parseInt(this.receiptMainList[i].stu_num)) {
							this.dialogVisible = true;
							return false;
						}
					}
					const datasmain = {
						type: 4,
						rep_id: this.ware_ids.ware_id,
						far_id: this.far_idmain,
						del_remarks: this.addReceipts.del_remarks,
						peasant_id: this.farsidMain,
						goods_info: JSON.stringify(this.receiptMainList).replace(/stu_type/g, 'det_goodstype')
					}
					deliverAssess(datasmain)
						.then(response => {
							const dataRep = response.data
							if(errorStatus(dataRep)) {
								if(response.data.code == 200) {
									console.log(response);
									this.$message.success('出库成功!');
									this.receiptMainList = '';
									this.farsidMain = '';
									this.far_idmain = '';
									this.addReceipts.del_remarks = '';
									this.receiptList = []; //农户物品
									this.receiptMainList = []; //出库物品
									this.addReceipts.far_id = '';
								} else {
									this.$message.error(response.data.data);
								}
							}
						})
						.catch(err => {
							console.log(err);
							this.$message.error(err.data.data);
						});
				}
			},
			addFormNew() {
				const datasmain = {
					type: 4,
					rep_id: this.ware_ids.ware_id,
					far_id: this.far_idmain,
					del_remarks: this.addReceipts.del_remarks,
					unusual: 1,
					peasant_id: this.farsidMain,
					goods_info: JSON.stringify(this.receiptMainList).replace(/stu_type/g, 'det_goodstype')
				}
				deliverAssess(datasmain)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
								console.log(response);
								this.$message.success('出库成功!');
								this.receiptMainList = '';
								this.farsidMain = '';
								this.far_idmain = '';
								this.addReceipts.del_remarks = '';
								this.receiptList = []; //农户物品
								this.receiptMainList = []; //出库物品
								this.addReceipts.far_id = '';
							} else {
								this.$message.error(response.data.data);
							}
						}
					})
					.catch(err => {
						console.log(err);
						this.$message.error(err.data.data);
					});

			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.inventory {
		display: inline-block;
	}
	
	.text_left {
		text-align: left;
		padding-left: 200px;
		padding-top: 20px;
	}
	
	.amountQuan {
		padding: 0 20px;
	}
</style>