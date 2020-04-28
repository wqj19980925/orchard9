<template>
	<el-row class="sd-module-box">
		<div class="sd-moudle-header mar-bot-10">
			<div class="sd-module-title">计数出库</div>
		</div>
		<el-form :model="receipt" class="sd-form-box clearfix" size="medium" label-width="100px">
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="出库单号:" class="sd-form-item">
						{{receipt.del_order}}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="收货人:" prop="far_id" class="sd-form-item">
						{{ditch.cli_name}}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="联系电话:" prop="far_id" class="sd-form-item">
						{{ditch.cli_mobile}}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="收货地址:" prop="far_id" class="sd-form-item">
						{{ditch.cli_address}}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="发货仓库:" prop="far_id" class="sd-form-item">
						{{del_id.rep_name}}
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div v-if="goods.length" class="lk-table-box amountQuan" style="width:850px;">
			<el-table :data="goods" height="300px">
				<el-table-column prop="goods_name" label="商品名称" min-width align="center" />
				<el-table-column prop="stu_num" label="存库数量" min-width align="center" />
				<el-table-column label="出库数量" prop="det_real_quantity" min-width align="center" />
				<el-table-column label="实际出库" min-width align="center" width='130'>
					<template slot-scope="{row}">
						<el-input v-model="row.det_real_actual" placeholder="请输入数量" />
					</template>
				</el-table-column>
				<el-table-column label="所属农户" min-width align="center" width='140'>
					<template slot-scope="{row}">
						<el-select v-model="row.far_id" value-key="far_id" style="width:125px" placeholder="请选择所属农户" :loading="loading" @focus="farListsmain(row)">
							<el-option v-for="item in farList" :key="item.far_id" :label="item.far_name" :value="item.far_id" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="出库库位" min-width align="center" width='140'>
					<template slot-scope="{row}">
						<el-select v-model="row.sto_id" style="width:125px" placeholder="请选择放置库位" :loading="loading" @focus="libraryListsmain(row)" @change="Librartnum(row)">
							<el-option v-for="item in libraryList" :key="item.sto_id" :label="item.sto_name" :value="item.sto_id" />
						</el-select>
					</template>
				</el-table-column>
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
				<div>出库数量大于库位存储数量是否强制出库</div>
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
		orderDeliver,
		getpeasants,
	} from '@/api/wareHouse';
	export default {
		props: {
			del_id: {
				type: Object,
				default: 0,
			}
		},
		data() {
			return {
				ditch: {}, //收货人信息
				goods: [], //出库商品信息
				receipt: {}, //出库单信息
				ware: [], //库位信息
				farList: [],
				libraryList: [],
				loading: false,
				dialogVisible:false,
			}
		},
		created() {
			this.peasantsMain();
		},
		methods: {
			peasantsMain() { //获取出库单信息
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				const ListData = {
					type: 1,
					del_id: this.del_id.del_id,
				}
				orderDeliver(ListData)
					.then(response => {
						if(response.data.code == 200) {
							this.ditch = response.data.data_info.ditch;
							this.receipt = response.data.data_info.receipt;
							this.ware = response.data.data_info.ware;
							for(var i = 0; i < response.data.data_info.goods.length; i++) {
								response.data.data_info.goods[i].stu_num = 0;
							}
							this.goods = response.data.data_info.goods;
							this.getfarmers();
							loading.close();
						} else {
							this.$message.error(response.data.data);
							loading.close();
						}
					})
					.catch(err => {
						loading.close();
						this.$message.error('列表查询失败!');
					});

			},
			getfarmers() { //获取农户
				for(var i = 0; i < this.goods.length; i++) {
					const c = i
					const ListData = {
						type: 4,
						goods_id: this.goods[i].goods_id,
						det_goodstype: this.goods[i].det_goodstype,
						del_id: this.receipt.del_id,
					}
					orderDeliver(ListData)
						.then(response => {
							if(response.data.code == 200) {
								this.goods[c].farList = response.data.data_info;
							} else {
								this.$message.error(response.data.data);
							}
						})
						.catch(err => {
							this.$message.error(err);
						});
				}
			},
			farListsmain(data) { //选择农户
				this.loading = true;
				this.farList = data.farList;
				this.loading = false;
			},
			libraryListsmain(data) { //选择库位
				this.loading = true;
				const ListData = {
					type: 5,
					goods_id: data.goods_id,
					det_goodstype: data.det_goodstype,
					del_id: this.receipt.del_id,
					far_id: data.far_id,
				}
				orderDeliver(ListData)
					.then(response => {
						if(response.data.code == 200) {
							this.libraryList = response.data.data_info;
							this.loading = false;
							this.$forceUpdate();
						} else {
							this.$message.error(response.data.data);
						}
					})
					.catch(err => {
						this.$message.error(err);
					});
			},
			handleCancel() {
				this.$emit('submit')
			},
			Librartnum(data) {
				for(var i = 0; i < this.libraryList.length; i++) {
					if(this.libraryList[i].sto_id == data.sto_id) {
						data.stu_num = this.libraryList[i].stu_num;
					}
				}
			},
			handleSubmit() {
				for(let i = 0; i < this.goods.length; i++) {
					console.log(this.goods[i].det_real_actual);
					if(this.goods[i].det_real_actual == '' || this.goods[i].det_real_actual == '0' || this.goods[i].det_real_actual == undefined) {
						this.$message.error("出库实际数量不能为空");
						return false;　　
					} else if(this.goods[i].far_id == '' || this.goods[i].far_id == '0' || this.goods[i].far_id == undefined) {
						this.$message.error("请选择农户");
						return false;　
					} else if(this.goods[i].sto_id == '' || this.goods[i].sto_id == '0' || this.goods[i].sto_id == undefined) {
						this.$message.error("请选择库位");
						return false;　
					} else if(this.goods[i].det_real_actual > this.goods[i].stu_num) {
						this.dialogVisible = true;
						return false;
					}
				}
				const ListData = {
					type: 2,
					del_id: this.receipt.del_id,
					del_remarks: this.receipt.del_remarks,
					del_order: this.receipt.del_order,
					goods_info: JSON.stringify(this.goods)
				}
				orderDeliver(ListData)
					.then(response => {
						if(response.data.code == 200) {
							this.$message.success('出库成功!');
							this.handleCancel();
						} else {
							this.$message.error(response.data.data);
						}
					})
					.catch(err => {
						this.$message.error(err);
					});

			},
			addFormNew() {
				console.log(this.receipt);
				const ListData = {
					type: 2,
					del_id: this.receipt.del_id,
					del_remarks: this.receipt.del_remarks,
					del_order: this.receipt.del_order,
					unusual: 1,
					goods_info: JSON.stringify(this.goods)
				}
				orderDeliver(ListData)
					.then(response => {
						if(response.data.code == 200) {
							this.$message.success('出库成功!');
							this.handleCancel();
						} else {
							this.$message.error(response.data.data);
						}
					})
					.catch(err => {
						this.$message.error(err);
					});

			},
			cancel() {
				this.dialogVisible = false
			},
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