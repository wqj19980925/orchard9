<template>
	<div class="app-orderList">
		<el-row class="sd-module-box">
			<div class="sd-moudle-header mar-bot-10">
				<div class="sd-module-title">库位库存记录</div>
				<div class="sd-module-btn">
					<el-button class="btn-mainCol" @click="librarys(0)">新增</el-button>
					<el-button class="btn-mainCol" @click="imports()">导入</el-button>
					<el-button class="btn-mainCol" @click="addReceipt">返回</el-button>
				</div>
			</div>
			<el-form class="sd-form-box clearfix" size="medium" label-width="100px">
				<el-row>
					<el-col :span="5" class="lk-col-5">
						<el-form-item label="库位名称:" prop="managesList.sto_name" class="sd-form-item">
							<el-input v-model="managesList.sto_name" placeholder="请输入库位名称" />
						</el-form-item>
					</el-col>
					<el-col :span="5" class="lk-col-5">
						<el-form-item label="库位状态:" prop="managesList.sto_state" class="sd-form-item">
							<el-select v-model="managesList.sto_state" value-key="dit_id" placeholder="全部">
								<el-option v-for="item in sto_state" :key="item.dit_id" :label="item.dit_name" :value="item.dit_id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="5" class="lk-col-5">
						<el-form-item label="超储存期:" prop="managesList.sto_isdue" class="sd-form-item">
							<el-select v-model="managesList.sto_isdue" value-key="dit_id" placeholder="全部">
								<el-option v-for="item in sto_isdue" :key="item.dit_id" :label="item.dit_name" :value="item.dit_id" />
							</el-select>
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
					<el-table-column type="selection" width="55" prop="sto_id" />
					<el-table-column label="库位名称" min-width align="center" prop="sto_name" />
					<el-table-column label="超存储期商品" min-width align="center" prop="sto_isdue">
						<template slot-scope="{ row }">
							<div v-if="row.sto_isdue == 1">没有</div>
							<div style="color: red;" v-else-if="row.sto_isdue == 2">有</div>
							<div v-else>暂无</div>
						</template>
					</el-table-column>
					<el-table-column label="库位状态" min-width align="center" prop="sto_state">
						<template slot-scope="{ row }">
							<div v-if="row.sto_state == 1">使用中</div>
							<div v-else-if="row.sto_state == 2">空闲中</div>
							<div v-else>暂无</div>
						</template>
					</el-table-column>
					<el-table-column label="物品数量" min-width align="center" prop="sto_number" />
					<el-table-column label="操作" align="center" width="300">
						<template slot-scope="{ row }">
							<el-button class="btn-mainCol" @click="inventory(row)" size="mini">盘库位</el-button>
							<el-button class="btn-mainCol" @click="librarys(row)" size="mini">编辑</el-button>
							<el-button class="btn-mainCol" @click="dishLosmain(row)" size="mini">损耗报备</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="lk-page-box"><el-pagination :current-page="current_page" :page-size="total" :total="last_page" layout="total, prev, pager, next, jumper" background /></div>

			<el-dialog :visible.sync="romewDialogVisible" :close-on-click-modal="false" title="添加库位" width="500px" @close="addCancel()">
				<el-form label-width="85px" ref="library" :model="library">
					<el-form-item label="库位名称:" prop="library.sto_name" class="sd-form-item">
						<el-input v-model="library.sto_name" placeholder="请输入库位名称" style="width:380px" />
					</el-form-item>
				</el-form>
				<span slot="footer">
					<el-button @click="addCancel()">取 消</el-button>
					<el-button type="primary" @click="stosAddmian()">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog :visible.sync="romewDialogVisibles" :close-on-click-modal="false" title="编辑库位" width="500px" @close="addCancel()">
				<el-form label-width="85px" ref="library" :model="library">
					<el-form-item label="库位名称:" prop="library.sto_name" class="sd-form-item">
						<el-input v-model="library.sto_name" placeholder="请输入库位名称" style="width:380px" />
					</el-form-item>
				</el-form>
				<span slot="footer">
					<el-button @click="addCancel()">取 消</el-button>
					<el-button type="primary" @click="stosAddmian()">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog :visible.sync="inventorysGoods" :close-on-click-modal="false" title="盘库" width="500px" @close="addCancel()">
				<div>
					库位名称：{{ receipt.sto_name }}
					<span style="float: right;">数量：{{ receipt.sto_number }}</span>
				</div>
				<el-table height="300" :data="goods" width="100%">
					<el-table-column label="商品/农资名称" min-width align="center" prop="goods_name" />
					<el-table-column label="存库数量" width="115" align="center" prop="stu_num" class="detail_num" />
					<el-table-column label="盘点数量" width="105" align="center" prop="cond_num" class="detail_num">
						<template slot-scope="{ row }">
							<el-input v-model="row.cond_num" class="textsCent" />
						</template>
					</el-table-column>
				</el-table>
				<span slot="footer">
					<el-button @click="addCancel()">取 消</el-button>
					<el-button type="primary" @click="invenGoods()">提 交</el-button>
				</span>
			</el-dialog>

			<el-dialog :visible.sync="dishLossMain" :close-on-click-modal="false" title="损耗报备" width="500px" @close="addCancel()">
				<div>
					库位名称：{{ receipt.sto_name }}
					<span style="float: right;">数量：{{ receipt.sto_number }}</span>
				</div>
				<el-table height="300" :data="goods" width="100%" style="margin-bottom: 20px;">
					<el-table-column label="商品/农资名称" min-width align="center" prop="goods_name" />
					<el-table-column label="数量" width="115" align="center" prop="stu_num" class="detail_num" />
					<el-table-column label="报损数量" width="105" align="center" prop="cond_num" class="detail_num">
						<template slot-scope="{ row }">
							<el-input v-model="row.cond_num" show-word-limit class="textsCent" />
						</template>
					</el-table-column>
				</el-table>
				<el-form label-width="85px" ref="remarks" :model="remarks">
					<el-form-item label="损耗备注:" prop="remarks" class="sd-form-item" style="margin-bottom: 10px;">
						<el-input v-model="remarks" placeholder="请输入损耗原因" style="width:380px" />
					</el-form-item>
				</el-form>
				<span slot="footer">
					<el-button @click="addCancel()">取 消</el-button>
					<el-button type="primary" @click="dishLossAddmian()">提 交</el-button>
				</span>
			</el-dialog>

			<el-dialog :visible.sync="exportsMains" :close-on-click-modal="false" title="导入库存文件" width="500px" @close="addCancel()">
				<div style="text-align: center;">
					<el-upload
						class="image-uploader"
						:multiple="false"
						:auto-upload="true"
						list-type="text"
						:show-file-list="true"
						:before-upload="beforeUpload"
						:drag="true"
						action=""
						:limit="1"
						:on-exceed="handleExceed"
						:http-request="uploadFile"
					>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
							将文件拖到此处，或
							<em>点击上传</em>
						</div>
						<div class="el-upload__tip" slot="tip">一次只能上传一个文件，单文件不超过5MB</div>
					</el-upload>
					<el-button style="margin-top: 20px;" type="primary" @click="loadingsEccel()">下载模板</el-button>
					<el-button style="margin-top: 20px;" type="primary" @click="upAddmian()">确认上传</el-button>
				</div>
			</el-dialog>
		</el-row>
	</div>
</template>
<script>
import { posiList, position, edit, exports, lead, dishBank, dishLoss } from '@/api/wareHouse';
export default {
	props: {
		ware_ids: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			romewDialogVisible: false, //新增编辑库位
			romewDialogVisibles: false,
			exportsMains: false,
			inventorysGoods: false, //盘库位
			dishLossMain: false, //损耗报备
			goods: [], //盘库的商品列
			receipt: {}, //库位参数
			current_page: '',
			total: '',
			current_number: '',
			last_page: '',
			uploadmin: {},
			urles: '',
			remarks: '',
			sto_state: [
				{
					dit_name: '全部',
					dit_id: 0
				},
				{
					dit_name: '使用中',
					dit_id: 1
				},
				{
					dit_name: '空闲中',
					dit_id: 2
				}
			],
			sto_isdue: [
				{
					dit_name: '全部',
					dit_id: 0
				},
				{
					dit_name: '没有',
					dit_id: 1
				},
				{
					dit_name: '有',
					dit_id: 2
				}
			],
			managesList: {
				ware_id: '',
				sto_name: '',
				sto_state: '',
				sto_isdue: ''
			},
			data_info: [],
			librarymain: '0',
			library: {
				sto_id: '', //库位id
				sto_name: '', //库位名称
				rep_id: '' //仓库id
			},
			dishBanks: {
				type: '',
				sto_id: '',
				goods_info: ''
			}
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
			that.managesList.ware_id = that.ware_ids;
			that.library.rep_id = that.ware_ids;
			const ListData = that.managesList;
			console.log(ListData);
			posiList(ListData)
				.then(response => {
					console.log(response);
					if (response.data.code == 200) {
						that.data_info = response.data.data_info.data_info;
						that.current_page = response.data.data_info.current_page;
						that.total = response.data.data_info.total;
						that.last_page = response.data.data_info.last_page;
						that.page_size = response.data.data_info.page_size;
						loading.close();
						this.$message.success('列表查询成功!');
						console.log(this.data_info);
					} else {
						loading.close();
						this.$message.error(response.data.data);
					}
				})
				.catch(err => {
					loading.close();
					this.$message.error('列表查询失败!');
				});
		},
		resetForm() {
			(this.managesList.sto_name = ''), (this.managesList.sto_state = ''), (this.managesList.sto_isdue = ''), this.getListInformation();
		},
		addReceipt() {
			this.$emit('submit');
		},
		librarys(data) {
			//编辑添加库位
			if (data == 0) {
				this.librarymain = '添加库位';
				this.romewDialogVisible = true;
				this.library.sto_id = data.sto_id;
				console.log(this.library);
			} else {
				this.librarymain = '编辑库位';
				this.romewDialogVisibles = true;
				this.library.sto_id = data.sto_id;
				this.library.sto_name = data.sto_name;
				console.log(this.library);
			}
		},
		addCancel() {
			this.romewDialogVisible = false;
			this.romewDialogVisibles = false;
			this.exportsMains = false;
			this.inventorysGoods = false;
			this.dishLossMain = false;
			this.library.sto_id = '';
			this.library.sto_name = '';
			this.librarymain = '0';
		},
		stosAddmian() {
			if (this.library.sto_name == '') {
				this.$message.error('请输入库位名称!');
			} else {
				if (this.librarymain == '添加库位') {
					const that = this;
					const loading = this.$loading({
						lock: true,
						text: 'Loading',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					const ListData = that.library;
					console.log(ListData);
					position(ListData)
						.then(response => {
							console.log(response);
							if (response.data.code == 200) {
								loading.close();
								that.$message.success('添加库位成功!');
								this.addCancel();
								this.getListInformation();
							} else {
								loading.close();
								that.$message.error(response.data.data);
							}
						})
						.catch(err => {
							loading.close();
							this.$message.error('添加库位失败!');
						});
				} else {
					const that = this;
					const loading = this.$loading({
						lock: true,
						text: 'Loading',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					const ListData = that.library;
					edit(ListData)
						.then(response => {
							console.log(response);
							if (response.data.code == 200) {
								loading.close();
								that.$message.success('编辑库位成功!');
								this.addCancel();
								this.getListInformation();
							} else {
								loading.close();
								that.$message.error(response.data.data);
							}
						})
						.catch(err => {
							loading.close();
							this.$message.error('编辑库位失败!');
						});
				}
			}
		},
		imports() {
			const ListData = {};
			exports(ListData)
				.then(response => {
					console.log(response);
					if (response.data.code == 200) {
						this.$message.success('获取模板文件成功!');
						const str = response.data.url;
						console.log(str);
						this.urles = str;
						this.exportsMains = true;
					} else {
						this.$message.error(response.data.data);
					}
				})
				.catch(err => {
					this.$message.error('获取模板文件失败!');
				});
		},
		loadingsEccel() {
			const url = process.env.BASE_API;
			const base = url.replace('/public', '/');
			console.log(base + this.urles);
			window.location.href = base + this.urles;
		},
		beforeUpload(file) {
			console.log('beforeUpload');
			console.log(file.type);
			const isText = file.type === 'application/vnd.ms-excel';
			const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
			return isText | isTextComputer;
			this.uploadmin=file;
		},
		// 上传文件个数超过定义的数量
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
		},
		// 上传文件
		uploadFile(item) {
       const _file = item;
      // 通过 FormData 对象上传文件
      var formData = new FormData();
      formData.append("file", _file);
	  console.log(formData);
	  const ListData = {
	  	file: formData,
	  	rep_id: this.ware_ids
	  };
	  console.log(ListData);
	  lead(ListData)
	  	.then(response => {
	  		console.log(response);
	  		if (response.data.code == 200) {
	  			this.$message.success('上传成功!');
	  			this.exportsMains = false;
	  		} else {
	  			this.$message.error(response.data.data);
	  		}
	  	})
	  	.catch(err => {
	  		this.$message.error('上传失败!');
	  	});
		},

			

		upAddmian() {
			this.$refs.upload.submit();
		},
		inventory(data) {
			this.dishBanks.sto_id = data.sto_id;
			this.dishBanks.type = 1;
			this.inventorysGoods = true;
			const that = this;
			const ListData = that.dishBanks;
			dishBank(ListData)
				.then(response => {
					console.log(response);
					if (response.data.code == 200) {
						that.$message.success('查询库位信息成功!');
						that.goods = response.data.data_info.goods;
						that.receipt = response.data.data_info.receipt;
					} else {
						that.$message.error(response.data.data);
					}
				})
				.catch(err => {
					this.$message.error('查询库位信息成功失败!');
				});
		},
		invenGoods() {
			const ListData = {};
			ListData.type = 2;
			ListData.sto_id = this.dishBanks.sto_id;
			ListData.goods_info = JSON.stringify(this.goods);
			dishBank(ListData)
				.then(response => {
					console.log(response);
					if (response.data.code == 200) {
						this.$message.success('盘库成功!');
						this.addCancel();
					} else {
						this.$message.error(response.data.data);
					}
				})
				.catch(err => {
					this.$message.error('盘库失败!');
				});
		},
		dishLosmain(data) {
			this.dishBanks.sto_id = data.sto_id;
			this.dishBanks.type = 1;
			this.dishLossMain = true;
			const that = this;
			const ListData = that.dishBanks;
			dishLoss(ListData)
				.then(response => {
					console.log(response);
					if (response.data.code == 200) {
						that.$message.success('查询库位信息成功!');
						that.goods = response.data.data_info.goods;
						that.receipt = response.data.data_info.receipt;
					} else {
						that.$message.error(response.data.data);
					}
				})
				.catch(err => {
					this.$message.error('查询库位信息成功失败!');
				});
		},
		dishLossAddmian() {
			if (this.remarks == '') {
				this.$message.error('损耗备注不可为空!');
			} else {
				const ListData = {};
				ListData.type = 2;
				ListData.sto_id = this.dishBanks.sto_id;
				ListData.goods_info = JSON.stringify(this.goods);
				ListData.remark = this.remarks;
				dishLoss(ListData)
					.then(response => {
						console.log(response);
						if (response.data.code == 200) {
							this.$message.success('损耗报备成功!');
							this.addCancel();
						} else {
							this.$message.error(response.data.data);
						}
					})
					.catch(err => {
						this.$message.error('损耗报备失败!');
					});
			}
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
.textsCent {
	text-align: center;
}
</style>
