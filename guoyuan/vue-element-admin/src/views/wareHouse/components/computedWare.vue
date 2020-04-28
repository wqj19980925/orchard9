<template>
	<el-row v-loading="loading" class="sd-module-box">
		<div class="sd-moudle-header mar-bot-10"><div class="sd-module-title">计数入库</div></div>
		<el-row class="mt20">
			<el-col>系统编号 : {{ detail.receipt.rec_order }}</el-col>
		</el-row>
		<el-row class="mt20">
			<el-col :md="12">&#12288;&#12288;数量 : {{ detail.receipt.rec_count }}</el-col>
		</el-row>
		<div v-if="detail.ditch=='企业自产'">
			<el-row class="mt20">
				<el-col :md="12">&#12288;发货单位 : {{ detail.ditch }}</el-col>
			</el-row>
		</div>
		<div v-if="detail.ditch!='企业自产'">
			<el-row class="mt20">
				<el-col :md="12">&#12288;发货人 : {{ detail.ditch.dit_person }}</el-col>
			</el-row>
			<el-row class="mt20">
				<el-col :md="12">联系电话 : {{ detail.ditch.dit_tel }}</el-col>
			</el-row>
			<el-row class="mt20">
				<el-col>发货地址 : {{ detail.ditch.dit_address }}</el-col>
			</el-row>
		</div>
		<el-row class="mt20">
			<el-col>&#12288;&#12288;备注 : <el-input v-model="detail.receipt.rec_remarks" style="width:280px" placeholder="请输入备注" /> </el-col>
		</el-row>
		<el-row class="mt20">
			<el-col>
				<label for="">存放位置 :</label>
				<el-select  style="width:280px" v-model="position"><el-option v-for="item in detail.ware" :key="item.sto_id" :label="item.sto_name" :value="item.sto_id" /></el-select>
			</el-col>
		</el-row>
		<div class="lk-table-box amountQuan"  style="width: 600px;">
			<el-table :data="detail.goods" width="100%" height="300px">
				<el-table-column prop="goods_name" label="商品名称" min-width align="center" />
				<el-table-column prop="stu_num" label="库存数量" min-width align="center" />
				<el-table-column prop="det_real_quantity" label="入库数量" min-width align="center" />
				<el-table-column label="实际数量" min-width align="center">
					<template slot-scope="{ row }">
						<el-input v-model="row.det_real_actual" placeholder="请输入数量" />
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-row>
			<el-col class="text_left">
				<el-button @click="handleCancel">返回</el-button>
				<el-button type="primary" @click="handleSubmit">提交</el-button>
			</el-col>
		</el-row>
		<el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" title="添加" width="500px">
			<el-form ref="add" v-model="addForm" class="sd-form-box clearfix" size="medium" label-width="100px">
				<el-form-item label="商品名称:" class="sd-form-item">{{ addForm.goods_name }}</el-form-item>
				<el-form-item label="入库数量:" class="sd-form-item"><el-input v-model="addForm.det_real_quantity" placeholder="请输入入库数量" /></el-form-item>
				<el-form-item label="入库方式">
					<el-radio-group v-model="addForm.type">
						<el-radio :label="1">扫码入库</el-radio>
						<el-radio :label="2">计数入库</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
	</el-row>
</template>
<script>
import { writeAssess } from '@/api/wareHouse';
export default {
	props: {
		id: {
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			receiptList: [],
			condition: 1,
			type: 1,
			ditch: '', // 渠道列表
			ware: '', // 仓库列表
			receputNumber: 0, // 数量
			rec_order: '', // 单号
			rec_shipper: '',
			ware_id: '',
			addReceipts: {
				condition: '',
				type: 1,
				ware_id: '', // 仓库ID
				rec_order: '', // 入库单ID
				rec_shipper_type: '', // 发货方类型
				rec_shipper: '', // 渠道商id
				rec_remarks: '', // 备注
				condition: '', // 区分添加
				goods_info: '' // 商品信息
			},
			selfUses: {
				dit_name: '企业自产',
				dit_id: 0
			},
			form: {
				ware_id: '',
				rec_order: '',
				rec_shipper_type: '',
				rec_shipper: '',
				rec_remarks: '',
				condition: '',
				goods_info: [],
				receputNumber: 0
			},
			loading: false,
			goods: '',
			dialogVisible: false,
			addForm: {
				goods_name: '',
				goods_id: '',
				det_real_quantity: '',
				type: 1
			},
			rules: {
				rec_shipper_type: [{ required: true, message: '必填项', trigger: 'change' }],
				ware_id: { required: true, message: '必填项', trigger: 'change' }
			},
			detail: {
				goods: [],
				receipt: {},
				ditch: {},
				ware: []
			},
			position: ''
		};
	},
	async created() {
		// 页面加载时
		this.loading = true;
		await this.writeintos();
		this.loading = false;
	},
	methods: {
		async writeintos() {
			const { data } = await writeAssess({
				type: 1,
				rec_id: this.id
			});
			console.log(data)
			this.detail = {
				...data.data_info,
				ditch: data.data_info.ditch || {},
				goods: data.data_info.goods.map(item => ({
					...item,
					det_real_actual: ''
				}))
			};
			this.$message.success('列表查询成功!');
		},
		handleCancel() {
			this.$emit('submit');
		},
		async handleSubmit() {
			if (!this.position) return this.$message.error('请选择存放位置');
			const payload = {
				type: 2,
				rec_id: this.detail.receipt.rec_id,
				rec_order: this.detail.receipt.rec_order,
				rec_remarks: this.detail.receipt.rec_remarks,
				sto_id: this.position,
				goods_info: JSON.stringify(this.detail.goods)
			};
			await writeAssess(payload);
			this.$message.success('操作成功!');
			this.$emit('submit');
		},
		handleSubmitWare() {
			this.handleSubmit();
		},
		querySearchAsync(queryString, cb) {
			console.log(queryString);
			getgoods({ ware_id: this.form.ware_id }).then(({ data }) => {
				cb(data.data_info.map(item => ({ ...item, value: item.goods_name })));
			});
		},
		handleSelect(item) {
			console.log(item);
			this.addForm = {
				...this.addForm,
				...item
			};
			this.dialogVisible = true;
		},
		cancel() {
			this.dialogVisible = false;
		},
		submit() {
			console.log(this.addForm);
			this.receiptList.push(this.addForm);
			console.log(this.receiptList);
			this.dialogVisible = false;
		}
	}
};
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
.mt20 {
	margin-top: 20px;
	padding: 0 20px;
	label {
		font-weight: 400;
	}
}
</style>
