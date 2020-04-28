<template>
	<div class="app-orderList">
		<div v-if="closeAdd">
			<el-row class="sd-module-box">
				<div class="sd-moudle-header mar-bot-10">
					<div class="sd-module-title">入库</div>
					<div class="sd-module-btn">
						<el-button class="btn-mainCol" @click="addReceipt">新增入库单</el-button>
						<el-button class="openCol-btn" @click="enables(1)">导出</el-button>
						<el-button class="btn-delete" @click="enables(2)">删除</el-button>
					</div>
				</div>
				<el-form ref="formList" :model="formList" class="sd-form-box clearfix" size="medium" label-width="100px">
					<el-row>
						<el-col :span="7" class="lk-col-5" style="width:450px">
							<el-form-item label="添加时间:" prop="timesmain" class="sd-form-item">
								<el-date-picker
									v-model="timesmain"
									type="daterange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="yyyy-MM-dd HH:mm:ss"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="5" class="lk-col-5">
							<el-form-item label="系统单号:" prop="rec_order" class="sd-form-item">
								<el-input v-model="formList.rec_order" placeholder="请输入系统单号" />
							</el-form-item>
						</el-col>
						<el-col :span="5" class="lk-col-5">
							<el-form-item label="收货信息:" prop="rep_name" class="sd-form-item">
								<el-input v-model="formList.rep_name" placeholder="请输入收货信息" />
							</el-form-item>
						</el-col>
						<el-col :span="4" class="lk-col-5">
							<el-form-item label="添加人:" prop="adm_name" class="sd-form-item"><el-input v-model="formList.adm_name" placeholder="请输入添加人" /></el-form-item>
						</el-col>
						<el-col :span="5" class="fr w200">
							<el-button type="primary" @click="getListInformation()">搜&nbsp;&nbsp;索</el-button>
							<el-button @click="resetForm()">重&nbsp;&nbsp;置</el-button>
						</el-col>
					</el-row>
				</el-form>
				<div class="lk-table-box amountQuan">
					<el-table :data="tableList" width="100%" @selection-change="handleSelectionChange" @sort-change="sortChang">
						<el-table-column type="selection" width="55" prop="rec_id" />
						<el-table-column label="操作时间" min-width align="center" prop="rec_createtime" />
						<el-table-column label="系统单号" min-width align="center" prop="rec_order" width="250px">
							<template slot-scope="{ row }">
								<span class="rec_order" @click="handleInfo(row.rec_id)">{{ row.rec_order }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量" min-width align="center" prop="rec_count" />
						<el-table-column label="添加人" min-width align="center" prop="adm_name" />
						<el-table-column label="类型" min-width align="center" prop="rec_shipper_type" />
						<el-table-column label="发货信息" min-width align="center" prop="rec_shipper" />
						<el-table-column label="收货信息" min-width align="center" prop="rep_name" />
						<el-table-column label="备注" min-width align="center" prop="rec_remarks" />
						<el-table-column label="操作" align="center" width="100">
							<template slot-scope="{ row }">
								<el-button class="btn-mainCol" size="mini" @click="computed(row.rec_id)">计数入库</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="lk-page-box">
					<el-pagination
						:current-page="current_page"
						:page-size="current_number"
						:total="total"
						layout="total, prev, pager, next, jumper"
						background
						@current-change="handleCurrentChanges"
					/>
				</div>
			</el-row>
		</div>
		<!-- 新增页面 -->
		<addReceipt v-if="showAdd" v-bind:ware_ids="formList.ware_id" @submit="submit" @listerToChild="showListPages()" />
		<computedWare v-if="computedVisible" :id="rec_id" @submit="submitWare" />
		<DialogInfo v-if="dialogInfo" :visible.sync="dialogInfo" :id="id" />
	</div>
</template>
<script>
import { writeLists, educeEcxel, writedelete } from '@/api/wareHouse';
import addReceipt from './components/addReceipt';
import computedWare from './components/computedWare';
import DialogInfo from './components/DialogInfo';
export default {
	components: { addReceipt, DialogInfo, computedWare },
	data() {
		return {
			tableList: [],
			timesmain: '',
			ware_id: '', // 仓库ID
			rec_createtime: '', // 添加时间
			rec_order: '', // 订单编号
			rec_count: '', // 总入库量
			adm_name: '', // 添加入
			rep_name: '', // 收货信息
			rec_shipper_type: '', // 订单类型
			rec_shipper: '', // 发货信息
			rec_remarks: '', // 备注信息
			rec_id: '', // 入库单ID
			current_page: '',
			total: '',
			current_number: '',
			last_page: '',
			radio: [], // 被选中的id
			showAdd: false,
			closeAdd: true,
			formList: {
				ware_id: '', // 仓库ID
				rec_createtime0: '', // 起始时间
				rec_createtime1: '', // 结束时间
				rec_order: '', // 订单编号
				rec_count: '', // 总入库量
				adm_name: '', // 添加入
				rep_name: '', // 收货信息
				rec_shipper_type: '', // 订单类型
				rec_shipper: '', // 发货信息
				rec_remarks: '', // 备注信息
				rec_id: '' // 入库单ID
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
			that.formList.ware_id=this.$route.query.ware_id;
			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			if (that.timesmain != '') {
				if (that.timesmain[0] == that.timesmain[1]) {
					const reg = new RegExp('00:00:00'); //g代表全部
					let newMsg = that.timesmain[1].replace(reg, '23:59:59');
					console.log(newMsg);
					that.formList.rec_createtime0 = that.timesmain[0];
					that.formList.rec_createtime1 = newMsg;
				} else {
					that.formList.rec_createtime0 = that.timesmain[0];
					that.formList.rec_createtime1 = that.timesmain[1];
				}
			}
			const ListData = that.formList;
			console.log(that.formList);
			writeLists(ListData)
				.then(response => {
					console.log(response);
					if (response.data.code == 200) {
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
				})
				.catch(err => {
					loading.close();
					console.log(err);
					this.$message.error('列表查询失败!');
				});
		},
		handleCurrentChanges(val) {
			console.log(val);
		},
		resetForm() {
			this.timesmain = '';
			this.formList.rec_order = '';
			this.formList.rep_name = '';
			this.formList.adm_name = '';
			this.getListInformation();
		},
		handleSelectionChange(val) {
			// 单选框被选中的

			const that = this;
			that.chosed = val;
			that.radio = [];
			for (var i = 0; i < val.length; i++) {
				that.radio.push(val[i].rec_id);
			}
			console.log(that.radio);
		},

		enables(data) {
			if (this.radio != '') {
				const that = this;
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				const radioList = {};
				radioList.rec_id = that.radio;
				if (data == 1) {
					educeEcxel(radioList)
						.then(response => {
							console.log(response);
							if (response.data.code == 200) {
								loading.close();
								this.$message.success('导出文件生成成功!');
								const url = process.env.BASE_API;
								const str = response.data.data;
								const base = url.replace('/public', '/');
								console.log();
								window.location.href = base + str;
							} else {
								loading.close();
								this.$message.error(response.data.data);
							}
						})
						.catch(err => {
							loading.close();
							console.log(err);
							this.$message.error('导出入库单失败!');
						});
				} else {
					// 删除入库单
					writedelete(radioList)
						.then(response => {
							console.log(response);
							if (response.data.code == 200) {
								loading.close();
								this.$message.success('删除入库单成功!');
								this.getListInformation();
							} else {
								loading.close();
								this.$message.error(response.data.data);
							}
						})
						.catch(err => {
							loading.close();
							console.log(err);
							this.$message.error('删除入库单失败!');
						});
				}
			} else {
				this.$message.error('请选择需要操作的入库单!');
			}
		},
		sortChang(column, prop, order) {
			// 列表排序
			console.log(column);
			if (column.prop == 'good_number') {
				// 库存
				if (column.order == 'descending') {
					this.formList.order = 2;
					this.getListInformation();
				} else {
					this.formList.order = 1;
					this.getListInformation();
				}
			} else if (column.prop == 'due_time') {
				// 预警值
			}
		},
		addReceipt() {
			this.showAdd = true;
			this.closeAdd = false;
		},
		showListPages() {
			this.showAdd = false;
			this.closeAdd = true;
		},
		submit() {
			this.showListPages();
			this.getListInformation();
		},
		handleInfo(id) {
			this.id = id;
			this.dialogInfo = true;
		},
		computed(id) {
			this.rec_id = id;
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
