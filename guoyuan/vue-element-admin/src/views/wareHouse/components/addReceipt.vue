<template>
	<el-row v-loading="loading" class="sd-module-box">
		<div class="sd-moudle-header mar-bot-10">
			<div class="sd-module-title">{{ware_ids.ware_name}} —— 入库</div>
		</div>
		<el-form ref="addReceipts" :model="addReceipts" :rules="rules" class="sd-form-box clearfix" size="medium" label-width="100px">
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="入库仓库:" prop="ware_ids.ware_name" class="sd-form-item">
						<el-input v-model="ware_ids.ware_name" style="width:430px" :disabled="true" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="选择农户:" prop="far_id" class="sd-form-item">
						<el-select v-model="addReceipts.far_id" style="width:430px" value-key="dit_id" placeholder="请选择农户">
							<el-option v-for="item in far_info" :key="item.far_id" :label="item.far_name" :value="item.far_id" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5">
					<el-form-item label="备注:" prop="addReceipts.rec_remarks" class="sd-form-item">
						<el-input v-model="addReceipts.rec_remarks" style="width:430px" placeholder="请输入入库备注" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="lk-col-5" style="width:640px; position: relative;">
					<el-form-item label="入库物品:" class="sd-form-item" style="width:535px">
						<el-autocomplete v-model="goods" :fetch-suggestions="querySearchAsync" style="width:430px" placeholder="请输入商品名称/条形编码 检索商品" @select="handleSelect" />
					</el-form-item>
					<el-button class="primary" style="position: absolute;right: 0;top: 0;" @click="addGoodsMian()">添加物品</el-button>
				</el-col>
			</el-row>
		</el-form>
		<div v-if="receiptList.length" class="lk-table-box amountQuan" style="width:700px;">
			<el-table :data="receiptList" height="300px">
				<el-table-column prop="goods_name" label="商品名称" min-width align="center" />
				<el-table-column prop="stu_num" label="存库数量" min-width align="center" />
				<el-table-column label="入库数量" min-width align="center">
					<template slot-scope="{row}">
						<el-input v-model="row.det_real_actual" placeholder="请输入数量" />
					</template>
				</el-table-column>
				<el-table-column label="放置库位" min-width align="center" width='160'>
					<template slot-scope="{row}">
						<el-select v-model="row.sto_id" style="width:150px" value-key="dit_id" placeholder="请选择放置库位">
							<el-option v-for="item in storehouse" :key="item.sto_id" :label="item.sto_name" :value="item.sto_id" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width align="center">
					<template slot-scope="row">
						<el-button @click.native.prevent="deleteRow(row.$index, receiptList)" type="text" size="small">
							移除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<el-row>
			<el-col class="text_left">
				<el-button @click="handleCancel">返回</el-button>
				<el-button type="primary" @click="handleSubmit">提交入库</el-button>
			</el-col>
		</el-row>

		<el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" title="添加非仓库已有物品" width="500px">
			<el-form ref="add" v-model="addFormNew" class="sd-form-box clearfix" size="medium" label-width="100px">
				<el-form-item label="商品名称:" class="sd-form-item">
					<el-input v-model="addFormNew.goods_name" placeholder="请输入商品名称" />
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="addFormNews()">确 定</el-button>
			</span>
		</el-dialog>
	</el-row>
</template>
<script>
	import {
		writeAssess,
		getgoods,
		withoutGoods
	} from '@/api/wareHouse';
	import { errorStatus } from '@/utils/index';
	export default {
		props: {
			ware_ids: {
				type: Object,
				default: 0,
			},
			typeId: {
				type: Number,
				default: 1,
			}
		},
		data() {
			return {
				far_info: [], //农户信息
				storehouse: [], //库位信息
				goods: '', //商品类
				receiptList: [], //入库商品
				dialogVisible: false,
				addReceipts: {
					rec_remarks: '', //备注
					rep_id: '', //仓库ID
					far_id: '', //农户id
					goods_info: '', //入库信息
				},
				addFormNew: {
					goods_id: '', //商品或农资id
					goods_name: '',
					det_real_actual: '', //真实入库数量
					stu_num: '', //库存量
					det_goodstype: '', //入库类别 1商品或者农资   2自建商品
					sto_id: '', //库位id
				},
				addForm: {
					goods_id: '', //商品或农资id
					goods_name: '',
					det_real_actual: '', //真实入库数量
					stu_num: '', //库存量
					det_goodstype: '', //入库类别 1商品或者农资   2自建商品
					sto_id: '', //库位id
				},
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
			this.storehouseMain();
		},
		methods: {
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			peasantsMain() { //获取农户信息
				console.log(this.ware_ids);
				const interfaces = {
					type: 1
				}
				writeAssess(interfaces)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
								this.far_info = response.data.data_info.far_info;
							} else {
								this.$message.error(response.data.data);
							}
						}
					})
					.catch(err => {
						this.$message.error(err.data.data);
					});
			},
			storehouseMain() { //获取库位信息
				const interfaces = {
					rep_id: this.ware_ids.ware_id,
					type: 2
				}
				writeAssess(interfaces)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
								this.storehouse = response.data.data_info
							} else {
								this.$message.error(response.data.data);
							}
						}

					})
					.catch(err => {
						this.$message.error(err.data.data);
					});
			},
			querySearchAsync(queryString, cb) { //匹配产品信息
				getgoods({
						ware_id: this.ware_ids.ware_id,
						far_id:this.addReceipts.far_id,
					})
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(response.data.code == 200) {
								console.log(response.data.data_info);
								var restaurants = response.data.data_info
								var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
								console.log(results);
								cb(results.map(item => ({ ...item,
									value: item.goods_name
								})));

							} else {
								this.$message.error(response.data.data);
							}
						}
					})
					.catch(err => {
						this.$message.error(err.data.data);
					});
			},
			createFilter(queryString) {
				return(restaurant) => {
					return(restaurant.goods_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			handleSelect(item) {
				console.log(item,'item')
				this.addForm = {};
				this.addForm.goods_id = item.goods_id;
				this.addForm.goods_name = item.goods_name;
				this.addForm.det_real_actual = '';
				this.addForm.det_goodstype = item.goodstype;
				if(this.typeId == 1){
					if(item.agr_unit == 1){
						this.addForm.stu_num = item.stu_num + ' 个';
					}else{
						this.addForm.stu_num = item.stu_num + ' kg';
					}
				}else{
					if(item.agr_unit == 1){
						this.addForm.stu_num = item.stu_num;
					}else{
						this.addForm.stu_num = item.stu_num;
					}
				}
				
				this.receiptList.push(this.addForm)
			},
			addGoodsMian() {
				this.dialogVisible = true
			},
			cancel() {
				this.dialogVisible = false
			},
			addFormNews() {
				console.log();
				if(this.addFormNew.goods_name.length >= 2) {
					const payload = {
						with_name: this.addFormNew.goods_name,
					}
					withoutGoods(payload)
						.then(response => {
							const dataRep = response.data
							if(errorStatus(dataRep)) {
								console.log(response)
								if(response.data.code == 200) {
									this.addFormNew.goods_id = response.data.data;
									this.addForm = {};
									this.addForm.goods_id = response.data.data;
									this.addForm.goods_name = this.addFormNew.goods_name;
									this.addForm.det_real_actual = '';
									this.addForm.det_goodstype = 2;
									this.addForm.stu_num = 0;
									this.receiptList.push(this.addForm)
									this.dialogVisible = false
								} else {
									this.$message.error(response.data.data);
									this.addForm.goods_name = item.goods_name;
								}
							}
						})
						.catch(err => {
							this.$message.error(err.data.data);
						});
				} else {
					this.$message.error("物品名称不能为空，并需大于等于2个字符");
				}
			},
			handleCancel() {
				this.$emit('submit')
			},
			handleSubmit() {
				console.log(this.receiptList);

				if(this.addReceipts.far_id == '') {
					this.$message.error("请选择农户");　
				} else if(this.receiptList.length == '0') {
					this.$message.error("请完善入库物品");　
				} else {
					for(let i = 0; i < this.receiptList.length; i++) {
						if(this.receiptList[i].det_real_actual == '') {
							this.$message.error("入库数量不能为空");
							return false;　　
						} else if(this.receiptList[i].det_real_actual == '0') {
							this.$message.error("入库数量不能为0");
							return false;　
						} else if(this.receiptList[i].sto_id == '') {
							this.$message.error("请选择放置库位");
							return false;　
						}
					}
					const payload = {
						type: 3,
						rec_remarks: this.addReceipts.rec_remarks,
						rep_id: this.ware_ids.ware_id,
						far_id: this.addReceipts.far_id,
						goods_info: JSON.stringify(this.receiptList)
					}
					writeAssess(payload)
						.then(response => {
							const dataRep = response.data
							if(errorStatus(dataRep)) {
								console.log(response);
								if(response.data.code == 200) {
									console.log(response);
									this.$message.success('入库成功!');
									this.receiptList = [];
									this.addReceipts = {};
									this.goods = '';
								} else {
									this.$message.error(response.data.data);
								}
							}
						})
						.catch(err => {
							this.$message.error(err.data.data);
						});
				}

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