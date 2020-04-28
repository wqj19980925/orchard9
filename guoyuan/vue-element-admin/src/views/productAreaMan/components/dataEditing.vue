<template>
	<div class="app-container1">
		<el-row class="sd-module-box">
			<div class="sd-moudle-header mar-bot-10">
				<div class="sd-module-title">
					<span>果园列表--{{devName}}</span>
				</div>
				<div class="sd-module-btn">
					<el-button :disabled="refreshDis" class="btn-mainCol" @click="refreshThis()">刷新</el-button>
					<el-button class="btn-mainCol" @click="addBtn()">新增</el-button>
					<el-button class="btn-delete" @click="delChoseBtn()">删除</el-button>
					<el-button class="openCol-btn" @click="backBtn()">返回</el-button>
				</div>
			</div>
			<div style="height:80px">
				<div class="tableButton" v-for="item in buttonList">
					<el-button @click="getPageInfo(item.id)" :class="item.primary" :plain="item.plain">{{item.name}}</el-button>
				</div>
			</div>
			<el-form ref="formList" :model="formList" class="sd-form-box clearfix" size="medium" label-width="100px">
				<el-row class="clearfix">
					<el-col :span="11" class="sd-col-6">
						<el-form-item prop="time" label="时间:">
							<el-date-picker v-model="formList.time" type="date" placeholder="请输入日期" class="lk-time-box" value-format="yyyy-MM-dd" :picker-options='pickerDateBefore' />
						</el-form-item>
					</el-col>
					<el-col class="pl-50 fr w250" style>
						<el-button class type="primary" @click="searchList('formList',1)">搜&nbsp;&nbsp;索</el-button>
						<el-button class @click="resetForm('formList')">重&nbsp;&nbsp;置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<div class="lk-table-box">
				<el-table :data="list" width="100%" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" />
					<el-table-column label="时间" prop="device_time" align="center" width="200" />
					<el-table-column label="降雨量(mm/min)" v-if="classType===1" prop="average" align="center" />
					<el-table-column label="风向(度)" prop="average" align="center" v-if="classType ===2" />
					<el-table-column label="风向" prop="averageName" align="center" v-if="classType ===2" />
					<el-table-column label="风速(m/s)" prop="average" align="center" v-if="classType ===3" />
					<el-table-column label="风速" prop="averageName" align="center" v-if="classType ===3" />
					<el-table-column label="土壤水分(%)" prop="average" align="center" v-if="classType ===4" />
					<el-table-column label="CO2(ppm)" prop="average" align="center" v-if="classType ===5" />
					<el-table-column label="光照度(Lux)" prop="average" align="center" v-if="classType ===6" />
					<el-table-column label="太阳辐射(W/㎡)" prop="average" align="center" v-if="classType ===7" />
					<el-table-column label="土壤电导率(μs/cm)" prop="average" align="center" v-if="classType ===8" />
					<el-table-column label="土壤温度(℃)" prop="average" align="center" v-if="classType ===9" />
					<el-table-column label="PM2.5(ug/m3)" prop="average" align="center" v-if="classType ===10" />
					<el-table-column label="空气温度(℃)" prop="average" align="center" v-if="classType ===11" />
					<el-table-column label="环境湿度(%)" prop="average" align="center" v-if="classType ===12" />
					<el-table-column label="二氧化硫(mg/m3)" prop="average" align="center" v-if="classType ===13" />
					<el-table-column label="二氧化氮(mg/m3)" prop="average" align="center" v-if="classType ===14" />
					<el-table-column label="蚊虫检测(次)" prop="average" align="center" v-if="classType ===17" />

					<el-table-column label="ph值" prop="ph" align="center" v-if="classType ===18" />
					<el-table-column label="浊度(NTU)" prop="turbid" align="center" v-if="classType ===18" />
					<el-table-column label="汞含量(mg/L)" prop="mercury" align="center" v-if="classType ===18" />
					<el-table-column label="砷含量(mg/L)" prop="arsenic" align="center" v-if="classType ===18" />
					<el-table-column label="镉含量(mg/L)" prop="cadmium" align="center" v-if="classType ===18" />
					<el-table-column label="铅含量(mg/L)" prop="lead" align="center" v-if="classType ===18" />
					<el-table-column label="铬含量(mg/L)" prop="large" align="center" v-if="classType ===18" />
					<el-table-column label="氟化物(mg/L)" prop="fluorine" align="center" v-if="classType ===18" />
					<el-table-column label="六价铬(mg/L)" prop="sexaval" align="center" v-if="classType ===18" />

					<el-table-column label="土壤ph值" prop="ph" align="center" v-if="classType ===19" />
					<el-table-column label="氮含量(ppm)" prop="nitrogen" align="center" v-if="classType ===19" />
					<el-table-column label="钾含量(ppm)" prop="potassium" align="center" v-if="classType ===19" />
					<el-table-column label="磷含量(ppm)" prop="phosphor" align="center" v-if="classType ===19" />
					<el-table-column label="汞含量(mg/kg)" prop="mercury" align="center" v-if="classType ===19" />
					<el-table-column label="砷含量(mg/kg)" prop="arsenic" align="center" v-if="classType ===19" />
					<el-table-column label="镉含量(mg/kg)" prop="cadmium" align="center" v-if="classType ===19" />
					<el-table-column label="铅含量(mg/kg)" prop="lead" align="center" v-if="classType ===19" />
					<el-table-column label="铜含量(mg/kg)" prop="copper" align="center" v-if="classType ===19" />
					<el-table-column label="铬含量(mg/kg)" prop="large" align="center" v-if="classType ===19" />
					<el-table-column label="操作" align="center" width="200">
						<template slot-scope="scope">
							<div class="opr-btn-box">
								<el-button size="mini" class="btn-mainCol" @click="editRow(scope.row)">编辑</el-button>
								<el-button size="mini" class="btn-delete" @click="delRow(scope.row)">删除</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div v-show="list.length>0" class="lk-page-box">
				<el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalNum" layout="total, prev, pager, next, jumper" background @current-change="handleCurrentChange" />
			</div>
			<!-- 弹窗 -->
			<el-dialog :visible.sync="showAddClas" :title="dialogTit" :close-on-click-modal="false" width="500px" @close="addClaForm('addCla')">
				<el-form ref="addCla" :model="addCla" :inline="true" label-width="100px">
					<el-form-item prop="time" label="时间:">
						<el-date-picker v-model="addCla.device_time" type="datetime" placeholder="请输入日期" class="lk-time-box" value-format="yyyy-MM-dd HH:mm:ss" :picker-options='pickerDateBefore1' />
					</el-form-item>
					<div class="formInput">
						<el-form-item label="降水量:" prop="average" v-if="classType===1">
							<el-input v-model="addCla.average" placeholder="mm/min" style="width:220px" />
						</el-form-item>
						<el-form-item label="风向:" prop="average" v-if="classType===2">
							<el-input v-model="addCla.average" placeholder="度" style="width:220px" />
						</el-form-item>
						<el-form-item label="风速:" prop="average" v-if="classType===3">
							<el-input v-model="addCla.average" placeholder="m/s" style="width:220px" />
						</el-form-item>
						<el-form-item label="土壤水分:" prop="average" v-if="classType===4">
							<el-input v-model="addCla.average" placeholder="%" style="width:220px" />
						</el-form-item>
						<el-form-item label="CO2:" prop="average" v-if="classType===5">
							<el-input v-model="addCla.average" placeholder="ppm" style="width:220px" />
						</el-form-item>
						<el-form-item label="光照度:" prop="average" v-if="classType===6">
							<el-input v-model="addCla.average" placeholder="Lux" style="width:220px" />
						</el-form-item>
						<el-form-item label="太阳辐射:" prop="average" v-if="classType===7">
							<el-input v-model="addCla.average" placeholder="W" style="width:220px" />
						</el-form-item>
						<el-form-item label="土壤电导率:" prop="average" v-if="classType===8">
							<el-input v-model="addCla.average" placeholder="μs/cm" style="width:220px" />
						</el-form-item>
						<el-form-item label="土壤温度:" prop="average" v-if="classType===9">
							<el-input v-model="addCla.average" placeholder="℃" style="width:220px" />
						</el-form-item>
						<el-form-item label="PM2.5:" prop="average" v-if="classType===10">
							<el-input v-model="addCla.average" placeholder="ug/m3" style="width:220px" />
						</el-form-item>
						<el-form-item label="空气温度:" prop="average" v-if="classType===11">
							<el-input v-model="addCla.average" placeholder="℃" style="width:220px" />
						</el-form-item>
						<el-form-item label="环境湿度:" prop="average" v-if="classType===12">
							<el-input v-model="addCla.average" placeholder="%" style="width:220px" />
						</el-form-item>
						<el-form-item label="二氧化硫:" prop="average" v-if="classType===13">
							<el-input v-model="addCla.average" placeholder="mg/kg" style="width:220px" />
						</el-form-item>
						<el-form-item label="二氧化氮:" prop="average" v-if="classType===14">
							<el-input v-model="addCla.average" placeholder="g/mL" style="width:220px" />
						</el-form-item>
						<el-form-item label="蚊虫检测:" prop="average" v-if="classType===17">
							<el-input v-model="addCla.average" placeholder="次" style="width:220px" />
						</el-form-item>

						<el-form-item label="ph值:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.ph" style="width:100px" />
						</el-form-item>
						<el-form-item label="浊度:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.turbid" style="width:100px" />
						</el-form-item>
						<el-form-item label="汞含量:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.mercury" style="width:100px" />
						</el-form-item>
						<el-form-item label="砷含量:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.arsenic" style="width:100px" />
						</el-form-item>
						<el-form-item label="镉含量:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.cadmium" style="width:100px" />
						</el-form-item>
						<el-form-item label="铅含量:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.lead" style="width:100px" />
						</el-form-item>
						<el-form-item label="硌含量:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.large" style="width:100px" />
						</el-form-item>
						<el-form-item label="氟化物:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.fluorine" style="width:100px" />
						</el-form-item>
						<el-form-item label="六价硌:" prop="average" v-if="classType===18">
							<el-input v-model="addCla.sexaval" style="width:100px" />
						</el-form-item>

						<el-form-item label="土壤ph值:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.ph" style="width:100px" />
						</el-form-item>
						<el-form-item label="氮含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.nitrogen" style="width:100px" />
						</el-form-item>
						<el-form-item label="钾含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.potassium" style="width:100px" />
						</el-form-item>
						<el-form-item label="磷含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.phosphor" style="width:100px" />
						</el-form-item>
						<el-form-item label="汞含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.mercury" style="width:100px" />
						</el-form-item>
						<el-form-item label="砷含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.arsenic" style="width:100px" />
						</el-form-item>
						<el-form-item label="镉含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.cadmium" style="width:100px" />
						</el-form-item>
						<el-form-item label="铅含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.lead" style="width:100px" />
						</el-form-item>
						<el-form-item label="铜含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.copper" style="width:100px" />
						</el-form-item>
						<el-form-item label="硌含量:" prop="average" v-if="classType===19">
							<el-input v-model="addCla.large" style="width:100px" />
						</el-form-item>
					</div>
				</el-form>
				<span slot="footer">
          <el-button @click="addClaForm('addCla')">取 消</el-button>
          <el-button  type="primary"@click="addThisBtn('addCla')">确 定</el-button>
        </span>
			</el-dialog>
		</el-row>
		<el-dialog :visible.sync="showDataClas" :title="dialogTit" :close-on-click-modal="false" width="500px" @close="addClaForm('addCla')">
			<el-form ref="addCla" :model="addCla" :inline="true" label-width="100px">
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
	import { deviceList, startEquipment, stopEquipment, searchBase, addEquipment, editEquipment, delEquipment, geteditEquipment, hideEquipment, showEquipment, getBinding, getEditBinding, getUntying, addDataManage, dataManageList, editDataManage, delDataManage, getDataManage, bindingThis, refreshBase, dataManage } from '@/api/productAreaMan'
	import { errorStatus } from '@/utils/index'

	export default {
		name: 'Account',
		props: {
			baseId: {
				type: Number,
				required: false
			},
			regId: {
				type: Number,
				required: false
			},
			disId: {
				type: Number,
				required: false
			},
			devName: {
				type: String,
				required: false
			},
			comId: {
				type: Number,
				required: false
			},
		},
		data() {
			return {
				refreshDis: false,
				paseSet: true,
				addCla: {
					device_time: '',
					average: ''
				},
				showDataClas: false,
				dialogTit: '新增',
				showAddClas: false,
				formList: {},
				edit_id: '',
				buttonList: [],
				classType: 1,
				list: [],
				currentPage: 1,
				pageSize: null,
				totalNum: null,

				chosed: [],
				pickerDateBefore: {
					disabledDate: time => {
						let _now = Date.now();
						let beginDateVal = this.formList.time;
						if(beginDateVal) {
							return time.getTime() > beginDateVal;
						} else {
							return time.getTime() > _now;
						}
					}
				},
				pickerDateBefore1: {
					disabledDate: time => {
						let _now = Date.now();
						let beginDateVal = this.addCla.device_time;
						if(beginDateVal) {
							return time.getTime() > beginDateVal;
						} else {
							return time.getTime() > _now;
						}
					}
				},
			}
		},
		created() {
			this.getButtonList()
			this.getPageInfo(1);
		},
		methods: {
			getPageInfo(classType) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				})
				const data = {};
				this.refreshDis = false
				if(this.buttonList.length !== 0) {
					for(var i in this.buttonList) {
						if(classType === this.buttonList[i].id) {
							this.buttonList[i].plain = true
							this.buttonList[i].primary = 'primary'
							if(this.buttonList[i].show == 1) {
								this.refreshDis = true
							} else {
								this.refreshDis = false
							}
						} else {
							this.buttonList[i].plain = false
							this.buttonList[i].primary = ''
						}
					}
				}
				if(classType === 18) {
					data.sign = 5
				} else if(classType === 19) {
					data.sign = 6
				} else {
					data.sign = 1
				}
				if(!this.pageSet) { //判断是否是当前选中tab跳转的页码
					this.currentPage = 1
				}
				data.disid = this.disId
				data.regid = this.regId
				data.class = classType
				data.page = this.currentPage

				dataManageList(data)
					.then(response => {
						loading.close()
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							this.pageSet = false
							if(classType == 2) {
								for(var i = 0; i < dataRep.data.length; i++) {
									console.log(dataRep.data[i]);
									if(348.75 <= dataRep.data[i].average && dataRep.data[i].average <= 360) {
										dataRep.data[i].averageName = '北风';
									} else if(0 <= dataRep.data[i].average && dataRep.data[i].average <= 11.25) {
										dataRep.data[i].averageName = '北风';
									} else if(11.25 < dataRep.data[i].average && dataRep.data[i].average <= 33.75) {
										dataRep.data[i].averageName = '东北偏北风';
									} else if(33.75 < dataRep.data[i].average && dataRep.data[i].average <= 56.25) {
										dataRep.data[i].averageName = '东北风';
									} else if(56.25 < dataRep.data[i].average && dataRep.data[i].average <= 78.75) {
										dataRep.data[i].averageName = '东北偏东风';
									} else if(78.75 < dataRep.data[i].average && dataRep.data[i].average <= 101.25) {
										dataRep.data[i].averageName = '东风';
									} else if(101.25 < dataRep.data[i].average && dataRep.data[i].average <= 123.75) {
										dataRep.data[i].averageName = '东南偏东风';
									} else if(123.75 < dataRep.data[i].average && dataRep.data[i].average <= 146.25) {
										dataRep.data[i].averageName = '东南风';
									} else if(146.25 < dataRep.data[i].average && dataRep.data[i].average <= 168.75) {
										dataRep.data[i].averageName = '东南偏南风';
									} else if(168.75 < dataRep.data[i].average && dataRep.data[i].average <= 191.25) {
										dataRep.data[i].averageName = '南风';
									} else if(191.25 < dataRep.data[i].average && dataRep.data[i].average <= 213.75) {
										dataRep.data[i].averageName = '西南偏南风';
									} else if(213.75 < dataRep.data[i].average && dataRep.data[i].average <= 236.25) {
										dataRep.data[i].averageName = '西南风';
									} else if(236.25 < dataRep.data[i].average && dataRep.data[i].average <= 258.75) {
										dataRep.data[i].averageName = '西南偏西风';
									} else if(258.75 < dataRep.data[i].average && dataRep.data[i].average <= 281.25) {
										dataRep.data[i].averageName = '西风';
									} else if(281.25 < dataRep.data[i].average && dataRep.data[i].average <= 303.75) {
										dataRep.data[i].averageName = '西北偏西风';
									} else if(303.75 < dataRep.data[i].average && dataRep.data[i].average <= 326.25) {
										dataRep.data[i].averageName = '西北风';
									} else if(326.25 < dataRep.data[i].average && dataRep.data[i].average < 348.75) {
										dataRep.data[i].averageName = '西北偏北风';
									} else {
										dataRep.data[i].averageName = '超出量程未知风向';
									}
								}
							}else if(classType == 3){
								for(var i = 0; i < dataRep.data.length; i++) {
									console.log(dataRep.data[i]);
									if(0 <= dataRep.data[i].average && dataRep.data[i].average <= 0.2) {
										dataRep.data[i].averageName = '平风';
									} else if(0.2 <= dataRep.data[i].average && dataRep.data[i].average <= 1.5) {
										dataRep.data[i].averageName = '轻风';
									} else if(1.5 < dataRep.data[i].average && dataRep.data[i].average <= 3.3) {
										dataRep.data[i].averageName = '微风';
									} else if(3.3 < dataRep.data[i].average && dataRep.data[i].average <= 5.4) {
										dataRep.data[i].averageName = '柔和的微风';
									} else if(5.4 < dataRep.data[i].average && dataRep.data[i].average <= 7.9) {
										dataRep.data[i].averageName = '和缓的风';
									} else if(7.9 < dataRep.data[i].average && dataRep.data[i].average <= 10.7) {
										dataRep.data[i].averageName = '清风';
									} else if(10.7 < dataRep.data[i].average && dataRep.data[i].average <= 13.8) {
										dataRep.data[i].averageName = '强风';
									} else if(13.8 < dataRep.data[i].average && dataRep.data[i].average <= 17.1) {
										dataRep.data[i].averageName = '疾风';
									} else if(17.1 < dataRep.data[i].average && dataRep.data[i].average <= 20.7) {
										dataRep.data[i].averageName = '风暴';
									} else if(20.7 < dataRep.data[i].average && dataRep.data[i].average <= 24.4) {
										dataRep.data[i].averageName = '狂风';
									} else if(24.4 < dataRep.data[i].average && dataRep.data[i].average <= 28.4) {
										dataRep.data[i].averageName = '强风暴';
									} else if(28.4 < dataRep.data[i].average && dataRep.data[i].average <= 32.6) {
										dataRep.data[i].averageName = '飓风式风暴';
									} else if(32.6 < dataRep.data[i].average && dataRep.data[i].average <= 36.9) {
										dataRep.data[i].averageName = '飓风';
									} else {
										dataRep.data[i].averageName = '超出量程，超强台风及毁灭性风暴';
									}
								}
							}
							this.list = dataRep.data
							this.currentPage = dataRep.current_page
							this.pageSize = dataRep.current_number
							this.totalNum = dataRep.total
							this.classType = classType
						}
					})
					.catch(Error => {
						loading.close()
						this.$message.error('请求失败')
						console.log('请求失败--', Error)
					})
			},
			getButtonList() {
				const data = {}
				dataManage(data)
					.then(response => {
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							this.buttonList = dataRep.data
							this.refreshDis = false
							for(var i in this.buttonList) {
								this.buttonList[i].name = this.buttonList[i].key
								this.buttonList[i].id = this.buttonList[i].sort
								this.buttonList[i].plain = true
								this.buttonList[i].primary = ''
								this.buttonList[i].refreshDis = false
							}
							if(this.buttonList[0].show == 1) {
								this.refreshDis = true
							} else {
								this.refreshDis = false
							}
							this.buttonList[0].plain = false
							this.buttonList[0].primary = 'primary'

							console.log(this.buttonList, 1111)
						}
					})
					.catch(Error => {
						this.$message.error('请求失败')
					})
			},
			// 搜索
			searchList(formName, page) {
				const search = this.formList
				for(var i in this.buttonList) {
					if(this.classType === this.buttonList[i].id) {
						this.buttonList[i].plain = true
						this.buttonList[i].primary = 'primary'
					} else {
						this.buttonList[i].plain = false
						this.buttonList[i].primary = ''
					}
				}
				if(this.classType === 18) {
					search.sign = 5
				} else if(this.classType === 19) {
					search.sign = 6
				} else {
					search.sign = 1
				}

				search.disid = this.disId
				search.baseid = this.baseId
				search.regid = this.regId
				search.class = this.classType
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				})
				// console.log('search--', search)
				search.page = page
				dataManageList(search)
					.then(response => {
						loading.close()
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(this.classType == 2) {
								for(var i = 0; i < dataRep.data.length; i++) {
									console.log(dataRep.data[i]);
									if(348.75 <= dataRep.data[i].average && dataRep.data[i].average <= 360) {
										dataRep.data[i].averageName = '北风';
									} else if(0 <= dataRep.data[i].average && dataRep.data[i].average <= 11.25) {
										dataRep.data[i].averageName = '北风';
									} else if(11.25 < dataRep.data[i].average && dataRep.data[i].average <= 33.75) {
										dataRep.data[i].averageName = '东北偏北风';
									} else if(33.75 < dataRep.data[i].average && dataRep.data[i].average <= 56.25) {
										dataRep.data[i].averageName = '东北风';
									} else if(56.25 < dataRep.data[i].average && dataRep.data[i].average <= 78.75) {
										dataRep.data[i].averageName = '东北偏东风';
									} else if(78.75 < dataRep.data[i].average && dataRep.data[i].average <= 101.25) {
										dataRep.data[i].averageName = '东风';
									} else if(101.25 < dataRep.data[i].average && dataRep.data[i].average <= 123.75) {
										dataRep.data[i].averageName = '东南偏东风';
									} else if(123.75 < dataRep.data[i].average && dataRep.data[i].average <= 146.25) {
										dataRep.data[i].averageName = '东南风';
									} else if(146.25 < dataRep.data[i].average && dataRep.data[i].average <= 168.75) {
										dataRep.data[i].averageName = '东南偏南风';
									} else if(168.75 < dataRep.data[i].average && dataRep.data[i].average <= 191.25) {
										dataRep.data[i].averageName = '南风';
									} else if(191.25 < dataRep.data[i].average && dataRep.data[i].average <= 213.75) {
										dataRep.data[i].averageName = '西南偏南风';
									} else if(213.75 < dataRep.data[i].average && dataRep.data[i].average <= 236.25) {
										dataRep.data[i].averageName = '西南风';
									} else if(236.25 < dataRep.data[i].average && dataRep.data[i].average <= 258.75) {
										dataRep.data[i].averageName = '西南偏西风';
									} else if(258.75 < dataRep.data[i].average && dataRep.data[i].average <= 281.25) {
										dataRep.data[i].averageName = '西风';
									} else if(281.25 < dataRep.data[i].average && dataRep.data[i].average <= 303.75) {
										dataRep.data[i].averageName = '西北偏西风';
									} else if(303.75 < dataRep.data[i].average && dataRep.data[i].average <= 326.25) {
										dataRep.data[i].averageName = '西北风';
									} else if(326.25 < dataRep.data[i].average && dataRep.data[i].average < 348.75) {
										dataRep.data[i].averageName = '西北偏北风';
									} else {
										dataRep.data[i].averageName = '超出量程未知风向';
									}
								}
							}else if(this.classType == 3){
								for(var i = 0; i < dataRep.data.length; i++) {
									console.log(dataRep.data[i]);
									if(0 <= dataRep.data[i].average && dataRep.data[i].average <= 0.2) {
										dataRep.data[i].averageName = '平风';
									} else if(0.2 <= dataRep.data[i].average && dataRep.data[i].average <= 1.5) {
										dataRep.data[i].averageName = '轻风';
									} else if(1.5 < dataRep.data[i].average && dataRep.data[i].average <= 3.3) {
										dataRep.data[i].averageName = '微风';
									} else if(3.3 < dataRep.data[i].average && dataRep.data[i].average <= 5.4) {
										dataRep.data[i].averageName = '柔和的微风';
									} else if(5.4 < dataRep.data[i].average && dataRep.data[i].average <= 7.9) {
										dataRep.data[i].averageName = '和缓的风';
									} else if(7.9 < dataRep.data[i].average && dataRep.data[i].average <= 10.7) {
										dataRep.data[i].averageName = '清风';
									} else if(10.7 < dataRep.data[i].average && dataRep.data[i].average <= 13.8) {
										dataRep.data[i].averageName = '强风';
									} else if(13.8 < dataRep.data[i].average && dataRep.data[i].average <= 17.1) {
										dataRep.data[i].averageName = '疾风';
									} else if(17.1 < dataRep.data[i].average && dataRep.data[i].average <= 20.7) {
										dataRep.data[i].averageName = '风暴';
									} else if(20.7 < dataRep.data[i].average && dataRep.data[i].average <= 24.4) {
										dataRep.data[i].averageName = '狂风';
									} else if(24.4 < dataRep.data[i].average && dataRep.data[i].average <= 28.4) {
										dataRep.data[i].averageName = '强风暴';
									} else if(28.4 < dataRep.data[i].average && dataRep.data[i].average <= 32.6) {
										dataRep.data[i].averageName = '飓风式风暴';
									} else if(32.6 < dataRep.data[i].average && dataRep.data[i].average <= 36.9) {
										dataRep.data[i].averageName = '飓风';
									} else {
										dataRep.data[i].averageName = '超出量程，超强台风及毁灭性风暴';
									}
								}
							}
							this.list = dataRep.data
							this.currentPage = dataRep.current_page
							this.pageSize = dataRep.current_number
							this.totalNum = dataRep.total
							this.serch_req = true
						}
					})
					.catch(Error => {
						loading.close()
						this.$message.error('请求失败')
					})
			},
			// choseTable(id){
			//   this.getPageInfo(id)
			// },
			addBtn() {
				this.dialogTit='新增'
				this.showAddClas = true
			},
			editRow(row) {
				this.showAddClas = true
				this.edit = true
        this.dialogTit='编辑'
				if(this.classType == 18) {
					this.$nextTick(() => {
						this.edit_id = row.id
						this.addCla.device_time = row.device_time
						this.addCla.ph = row.ph
						this.addCla.turbid = row.turbid
						this.addCla.mercury = row.mercury
						this.addCla.arsenic = row.arsenic
						this.addCla.cadmium = row.cadmium
						this.addCla.lead = row.lead
						this.addCla.large = row.large
						this.addCla.fluorine = row.fluorine
						this.addCla.sexaval = row.sexaval
					})
				} else if(this.classType == 19) {
					this.$nextTick(() => {
						this.edit_id = row.id
						this.addCla.device_time = row.device_time
						this.addCla.ph = row.ph
						this.addCla.nitrogen = row.nitrogen
						this.addCla.potassium = row.potassium
						this.addCla.phosphor = row.phosphor
						this.addCla.mercury = row.mercury
						this.addCla.arsenic = row.arsenic
						this.addCla.cadmium = row.cadmium
						this.addCla.lead = row.lead
						this.addCla.copper = row.copper
						this.addCla.large = row.large
					})
				} else {
					this.$nextTick(() => {
						this.edit_id = row.id
						this.addCla.device_time = row.device_time
						this.addCla.average = row.average
					})
				}

			},
			//新增提交
			addThisBtn(formName) {
				const data = this.addCla;
				data.device_time = this.addCla.device_time
				data.class = this.classType
				if(this.addCla.device_time === '' || !this.addCla.device_time) {
					this.$message.error('请输入日期')
					return false
				}
				if(this.regId) {
					data.regid = this.regId
				}
				if(this.disId) {
					data.disid = this.disId
				}
				if(this.classType === 18) {
					delete data.average
					if(this.addCla.ph === '' || !this.addCla.ph) {
						this.$message.error('请输入ph值')
						return false
					}
					if(isNaN(this.addCla.ph)) {
						this.$message.error('ph值只能输入数字')
						return
					}
					if(this.addCla.turbid === '' || !this.addCla.turbid) {
						this.$message.error('请输入浊度')
						return false
					}
					if(isNaN(this.addCla.turbid)) {
						this.$message.error('浊度只能输入数字')
						return
					}
					if(this.addCla.mercury === '' || !this.addCla.mercury) {
						this.$message.error('请输入汞含量')
						return false
					}
					if(isNaN(this.addCla.mercury)) {
						this.$message.error('汞含量只能输入数字')
						return
					}
					if(this.addCla.arsenic === '' || !this.addCla.arsenic) {
						this.$message.error('请输入砷含量')
						return false
					}
					if(isNaN(this.addCla.arsenic)) {
						this.$message.error('砷含量只能输入数字')
						return
					}
					if(this.addCla.cadmium === '' || !this.addCla.cadmium) {
						this.$message.error('请输入镉含量')
						return false
					}
					if(isNaN(this.addCla.cadmium)) {
						this.$message.error('镉含量只能输入数字')
						return
					}
					if(this.addCla.lead === '' || !this.addCla.lead) {
						this.$message.error('请输入铅含量')
						return false
					}
					if(isNaN(this.addCla.lead)) {
						this.$message.error('铅含量只能输入数字')
						return
					}
					if(this.addCla.large === '' || !this.addCla.large) {
						this.$message.error('请输入硌含量')
						return false
					}
					if(isNaN(this.addCla.large)) {
						this.$message.error('硌含量只能输入数字')
						return
					}
					if(this.addCla.fluorine === '' || !this.addCla.fluorine) {
						this.$message.error('请输入氟化物')
						return false
					}
					if(isNaN(this.addCla.fluorine)) {
						this.$message.error('氟化物只能输入数字')
						return
					}
					if(this.addCla.sexaval === '' || !this.addCla.sexaval) {
						this.$message.error('请输入六价硌')
						return false
					}
					if(isNaN(this.addCla.sexaval)) {
						this.$message.error('六价硌只能输入数字')
						return
					}
					data.ph = (parseFloat(this.addCla.ph)).toFixed(2);
					data.turbid = (parseFloat(this.addCla.turbid)).toFixed(2);
					data.mercury = (parseFloat(this.addCla.mercury)).toFixed(2);
					data.arsenic = (parseFloat(this.addCla.arsenic)).toFixed(2);
					data.cadmium = (parseFloat(this.addCla.cadmium)).toFixed(2);
					data.lead = (parseFloat(this.addCla.lead)).toFixed(2);
					data.large = (parseFloat(this.addCla.large)).toFixed(2);
					data.fluorine = (parseFloat(this.addCla.fluorine)).toFixed(2);
					data.sexaval = (parseFloat(this.addCla.sexaval)).toFixed(2);
					data.sort = 2
					data.node = '2122'
				} else if(this.classType === 19) {
					delete data.average
					if(this.addCla.ph === '' || !this.addCla.ph) {
						this.$message.error('请输入土壤ph')
						return
					}
					if(isNaN(this.addCla.ph)) {
						this.$message.error('土壤ph只能输入数字')
						return
					}
					if(this.addCla.nitrogen === '' || !this.addCla.nitrogen) {
						this.$message.error('请输入氮含量')
						return
					}
					if(isNaN(this.addCla.nitrogen)) {
						this.$message.error('氮含量只能输入数字')
						return
					}
					if(this.addCla.potassium === '' || !this.addCla.potassium) {
						this.$message.error('请输入钾含量')
						return
					}
					if(isNaN(this.addCla.potassium)) {
						this.$message.error('钾含量只能输入数字')
						return
					}
					if(this.addCla.phosphor === '' || !this.addCla.phosphor) {
						this.$message.error('请输入磷含量')
						return
					}
					if(isNaN(this.addCla.phosphor)) {
						this.$message.error('磷含量只能输入数字')
						return
					}
					if(this.addCla.mercury === '' || !this.addCla.mercury) {
						this.$message.error('请输入汞含量')
						return
					}
					if(isNaN(this.addCla.mercury)) {
						this.$message.error('汞含量只能输入数字')
						return
					}
					if(this.addCla.arsenic === '' || !this.addCla.arsenic) {
						this.$message.error('请输入砷含量')
						return
					}
					if(isNaN(this.addCla.arsenic)) {
						this.$message.error('砷含量只能输入数字')
						return
					}
					if(this.addCla.cadmium === '' || !this.addCla.cadmium) {
						this.$message.error('请输入镉含量')
						return
					}
					if(isNaN(this.addCla.cadmium)) {
						this.$message.error('镉含量只能输入数字')
						return
					}
					if(this.addCla.lead === '' || !this.addCla.lead) {
						this.$message.error('请输入铅含量')
						return
					}
					if(isNaN(this.addCla.lead)) {
						this.$message.error('铅含量只能输入数字')
						return
					}
					if(this.addCla.copper === '' || !this.addCla.copper) {
						this.$message.error('请输入铜含量')
						return
					}
					if(isNaN(this.addCla.copper)) {
						this.$message.error('铜含量只能输入数字')
						return
					}
					if(this.addCla.large === '' || !this.addCla.large) {
						this.$message.error('请输入硌含量')
						return
					}
					if(isNaN(this.addCla.large)) {
						this.$message.error('硌含量只能输入数字')
						return
					}
					data.ph = (parseFloat(this.addCla.ph)).toFixed(2);
					data.nitrogen = (parseFloat(this.addCla.nitrogen)).toFixed(2);
					data.potassium = (parseFloat(this.addCla.potassium)).toFixed(2);
					data.phosphor = (parseFloat(this.addCla.phosphor)).toFixed(2);
					data.mercury = (parseFloat(this.addCla.mercury)).toFixed(2);
					data.arsenic = (parseFloat(this.addCla.arsenic)).toFixed(2);
					data.cadmium = (parseFloat(this.addCla.cadmium)).toFixed(2);
					data.lead = (parseFloat(this.addCla.lead)).toFixed(2);
					data.copper = (parseFloat(this.addCla.copper)).toFixed(2);
					data.ph = (parseFloat(this.addCla.ph)).toFixed(2);
					data.sort = 3
					data.node = '2121'
				} else {
					data.sort = 1

					if(this.classType === 17) {
						if(this.addCla.average === '') {
							this.$message.error('请输入' + this.buttonList[this.classType - 3].name + '!')
							return
						}
						if(isNaN(this.addCla.average)) {
							this.$message.error(this.buttonList[this.classType - 3].name + '只能输入数字')
							return
						}
						data.node = '2183'
						data.unit = '次'
						data.average = this.addCla.average;
					} else {
						if(this.addCla.average === '') {
							this.$message.error('请输入' + this.buttonList[this.classType - 1].name + '!')
							return
						}
						if(isNaN(this.addCla.average)) {
							this.$message.error(this.buttonList[this.classType - 1].name + '只能输入数字')
							return
						}
						data.average = (parseFloat(this.addCla.average)).toFixed(2);
						data.node = '2118 '
						if(this.classType === 1) {
							data.unit = 'mm/min'
						}
						if(this.classType === 2) {
							data.unit = '度'
						}
						if(this.classType === 3) {
							data.unit = 'm/s'
						}
						if(this.classType === 4) {
							data.unit = '%'
						}
						if(this.classType === 5) {
							data.unit = 'ppm'
						}
						if(this.classType === 6) {
							data.unit = 'Lux'
						}
						if(this.classType === 7) {
							data.unit = 'W'
						}
						if(this.classType === 8) {
							data.unit = 'μs/cm'
						}
						if(this.classType === 9) {
							data.unit = '℃'
						}
						if(this.classType === 10) {
							data.unit = 'ug/m3'
						}
						if(this.classType === 11) {
							data.unit = '℃'
						}
						if(this.classType === 12) {
							data.unit = '%'
						}
						if(this.classType === 13) {
							data.unit = 'mg/kg'
						}
						if(this.classType === 14) {
							data.unit = 'g/mL'
						}
					}
				}
				if(this.edit) {
					data.sign = 3
					data.edit_id = this.edit_id
					dataManageList(data)
						.then(response => {
							const dataRep = response.data
							if(errorStatus(dataRep)) {
								if(this.classType == 2) {
								for(var i = 0; i < dataRep.data.length; i++) {
									console.log(dataRep.data[i]);
									if(348.75 <= dataRep.data[i].average && dataRep.data[i].average <= 360) {
										dataRep.data[i].averageName = '北风';
									} else if(0 <= dataRep.data[i].average && dataRep.data[i].average <= 11.25) {
										dataRep.data[i].averageName = '北风';
									} else if(11.25 < dataRep.data[i].average && dataRep.data[i].average <= 33.75) {
										dataRep.data[i].averageName = '东北偏北风';
									} else if(33.75 < dataRep.data[i].average && dataRep.data[i].average <= 56.25) {
										dataRep.data[i].averageName = '东北风';
									} else if(56.25 < dataRep.data[i].average && dataRep.data[i].average <= 78.75) {
										dataRep.data[i].averageName = '东北偏东风';
									} else if(78.75 < dataRep.data[i].average && dataRep.data[i].average <= 101.25) {
										dataRep.data[i].averageName = '东风';
									} else if(101.25 < dataRep.data[i].average && dataRep.data[i].average <= 123.75) {
										dataRep.data[i].averageName = '东南偏东风';
									} else if(123.75 < dataRep.data[i].average && dataRep.data[i].average <= 146.25) {
										dataRep.data[i].averageName = '东南风';
									} else if(146.25 < dataRep.data[i].average && dataRep.data[i].average <= 168.75) {
										dataRep.data[i].averageName = '东南偏南风';
									} else if(168.75 < dataRep.data[i].average && dataRep.data[i].average <= 191.25) {
										dataRep.data[i].averageName = '南风';
									} else if(191.25 < dataRep.data[i].average && dataRep.data[i].average <= 213.75) {
										dataRep.data[i].averageName = '西南偏南风';
									} else if(213.75 < dataRep.data[i].average && dataRep.data[i].average <= 236.25) {
										dataRep.data[i].averageName = '西南风';
									} else if(236.25 < dataRep.data[i].average && dataRep.data[i].average <= 258.75) {
										dataRep.data[i].averageName = '西南偏西风';
									} else if(258.75 < dataRep.data[i].average && dataRep.data[i].average <= 281.25) {
										dataRep.data[i].averageName = '西风';
									} else if(281.25 < dataRep.data[i].average && dataRep.data[i].average <= 303.75) {
										dataRep.data[i].averageName = '西北偏西风';
									} else if(303.75 < dataRep.data[i].average && dataRep.data[i].average <= 326.25) {
										dataRep.data[i].averageName = '西北风';
									} else if(326.25 < dataRep.data[i].average && dataRep.data[i].average < 348.75) {
										dataRep.data[i].averageName = '西北偏北风';
									} else {
										dataRep.data[i].averageName = '超出量程未知风向';
									}
								}
							}else if(this.classType == 3){
								for(var i = 0; i < dataRep.data.length; i++) {
									console.log(dataRep.data[i]);
									if(0 <= dataRep.data[i].average && dataRep.data[i].average <= 0.2) {
										dataRep.data[i].averageName = '平风';
									} else if(0.2 <= dataRep.data[i].average && dataRep.data[i].average <= 1.5) {
										dataRep.data[i].averageName = '轻风';
									} else if(1.5 < dataRep.data[i].average && dataRep.data[i].average <= 3.3) {
										dataRep.data[i].averageName = '微风';
									} else if(3.3 < dataRep.data[i].average && dataRep.data[i].average <= 5.4) {
										dataRep.data[i].averageName = '柔和的微风';
									} else if(5.4 < dataRep.data[i].average && dataRep.data[i].average <= 7.9) {
										dataRep.data[i].averageName = '和缓的风';
									} else if(7.9 < dataRep.data[i].average && dataRep.data[i].average <= 10.7) {
										dataRep.data[i].averageName = '清风';
									} else if(10.7 < dataRep.data[i].average && dataRep.data[i].average <= 13.8) {
										dataRep.data[i].averageName = '强风';
									} else if(13.8 < dataRep.data[i].average && dataRep.data[i].average <= 17.1) {
										dataRep.data[i].averageName = '疾风';
									} else if(17.1 < dataRep.data[i].average && dataRep.data[i].average <= 20.7) {
										dataRep.data[i].averageName = '风暴';
									} else if(20.7 < dataRep.data[i].average && dataRep.data[i].average <= 24.4) {
										dataRep.data[i].averageName = '狂风';
									} else if(24.4 < dataRep.data[i].average && dataRep.data[i].average <= 28.4) {
										dataRep.data[i].averageName = '强风暴';
									} else if(28.4 < dataRep.data[i].average && dataRep.data[i].average <= 32.6) {
										dataRep.data[i].averageName = '飓风式风暴';
									} else if(32.6 < dataRep.data[i].average && dataRep.data[i].average <= 36.9) {
										dataRep.data[i].averageName = '飓风';
									} else {
										dataRep.data[i].averageName = '超出量程，超强台风及毁灭性风暴';
									}
								}
							}
								this.$message.success(dataRep.data)
								this.showAddClas = false
								this.$refs[formName].resetFields()
								this.addCla.device_time = ''
								this.getPageInfo(this.classType)
							}
						})
						.catch(Error => {
							this.$message.error('请求失败')
						})
				} else {
					data.baseid = this.baseId
					data.sign = 2
					dataManageList(data)
						.then(response => {
							const dataRep = response.data
							if(errorStatus(dataRep)) {
								if(this.classType == 2) {
								for(var i = 0; i < dataRep.data.length; i++) {
									console.log(dataRep.data[i]);
									if(348.75 <= dataRep.data[i].average && dataRep.data[i].average <= 360) {
										dataRep.data[i].averageName = '北风';
									} else if(0 <= dataRep.data[i].average && dataRep.data[i].average <= 11.25) {
										dataRep.data[i].averageName = '北风';
									} else if(11.25 < dataRep.data[i].average && dataRep.data[i].average <= 33.75) {
										dataRep.data[i].averageName = '东北偏北风';
									} else if(33.75 < dataRep.data[i].average && dataRep.data[i].average <= 56.25) {
										dataRep.data[i].averageName = '东北风';
									} else if(56.25 < dataRep.data[i].average && dataRep.data[i].average <= 78.75) {
										dataRep.data[i].averageName = '东北偏东风';
									} else if(78.75 < dataRep.data[i].average && dataRep.data[i].average <= 101.25) {
										dataRep.data[i].averageName = '东风';
									} else if(101.25 < dataRep.data[i].average && dataRep.data[i].average <= 123.75) {
										dataRep.data[i].averageName = '东南偏东风';
									} else if(123.75 < dataRep.data[i].average && dataRep.data[i].average <= 146.25) {
										dataRep.data[i].averageName = '东南风';
									} else if(146.25 < dataRep.data[i].average && dataRep.data[i].average <= 168.75) {
										dataRep.data[i].averageName = '东南偏南风';
									} else if(168.75 < dataRep.data[i].average && dataRep.data[i].average <= 191.25) {
										dataRep.data[i].averageName = '南风';
									} else if(191.25 < dataRep.data[i].average && dataRep.data[i].average <= 213.75) {
										dataRep.data[i].averageName = '西南偏南风';
									} else if(213.75 < dataRep.data[i].average && dataRep.data[i].average <= 236.25) {
										dataRep.data[i].averageName = '西南风';
									} else if(236.25 < dataRep.data[i].average && dataRep.data[i].average <= 258.75) {
										dataRep.data[i].averageName = '西南偏西风';
									} else if(258.75 < dataRep.data[i].average && dataRep.data[i].average <= 281.25) {
										dataRep.data[i].averageName = '西风';
									} else if(281.25 < dataRep.data[i].average && dataRep.data[i].average <= 303.75) {
										dataRep.data[i].averageName = '西北偏西风';
									} else if(303.75 < dataRep.data[i].average && dataRep.data[i].average <= 326.25) {
										dataRep.data[i].averageName = '西北风';
									} else if(326.25 < dataRep.data[i].average && dataRep.data[i].average < 348.75) {
										dataRep.data[i].averageName = '西北偏北风';
									} else {
										dataRep.data[i].averageName = '超出量程未知风向';
									}
								}
							}else if(this.classType == 3){
								for(var i = 0; i < dataRep.data.length; i++) {
									console.log(dataRep.data[i]);
									if(0 <= dataRep.data[i].average && dataRep.data[i].average <= 0.2) {
										dataRep.data[i].averageName = '平风';
									} else if(0.2 <= dataRep.data[i].average && dataRep.data[i].average <= 1.5) {
										dataRep.data[i].averageName = '轻风';
									} else if(1.5 < dataRep.data[i].average && dataRep.data[i].average <= 3.3) {
										dataRep.data[i].averageName = '微风';
									} else if(3.3 < dataRep.data[i].average && dataRep.data[i].average <= 5.4) {
										dataRep.data[i].averageName = '柔和的微风';
									} else if(5.4 < dataRep.data[i].average && dataRep.data[i].average <= 7.9) {
										dataRep.data[i].averageName = '和缓的风';
									} else if(7.9 < dataRep.data[i].average && dataRep.data[i].average <= 10.7) {
										dataRep.data[i].averageName = '清风';
									} else if(10.7 < dataRep.data[i].average && dataRep.data[i].average <= 13.8) {
										dataRep.data[i].averageName = '强风';
									} else if(13.8 < dataRep.data[i].average && dataRep.data[i].average <= 17.1) {
										dataRep.data[i].averageName = '疾风';
									} else if(17.1 < dataRep.data[i].average && dataRep.data[i].average <= 20.7) {
										dataRep.data[i].averageName = '风暴';
									} else if(20.7 < dataRep.data[i].average && dataRep.data[i].average <= 24.4) {
										dataRep.data[i].averageName = '狂风';
									} else if(24.4 < dataRep.data[i].average && dataRep.data[i].average <= 28.4) {
										dataRep.data[i].averageName = '强风暴';
									} else if(28.4 < dataRep.data[i].average && dataRep.data[i].average <= 32.6) {
										dataRep.data[i].averageName = '飓风式风暴';
									} else if(32.6 < dataRep.data[i].average && dataRep.data[i].average <= 36.9) {
										dataRep.data[i].averageName = '飓风';
									} else {
										dataRep.data[i].averageName = '超出量程，超强台风及毁灭性风暴';
									}
								}
							}
								this.$message.success(dataRep.data)
								this.showAddClas = false
								this.$refs[formName].resetFields()
								this.addCla.device_time = ''
								this.getPageInfo(this.classType)
							}
						})
						.catch(Error => {
							this.$message.error('请求失败')
						})
				}

			},

			// 删除-这个
			delRow(row) {
				const data = {}
				// console.log('删除--', row)
				data.class = this.classType
				data.del_id = [row.id]
				data.sign = 4
				this.$confirm('请确认,是否删除该设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					dataManageList(data)
						.then(response => {
							// console.log('delAgric---', response)
							if(errorStatus(response.data)) {
								this.$message.success('删除成功!')
								this.getPageInfo(this.classType)
							}
						})
						.catch(Error => {
							// console.log("停用的分类err", err);
							this.$message.error('删除请求失败!')
						})
				})
			},
			//  删除--多选
			delChoseBtn() {
				const chosed = this.chosed
				if(chosed.length < 1) {
					this.$message.error('请选择要删除的设备!')
				} else {
					const data = {}
					data.del_id = []
					data.class = this.classType
					data.sign = 4
					// console.log('chosed---', chosed)
					for(const i in chosed) {
						data.del_id.push(chosed[i].id)
					}
					this.$confirm('请确认,是否删除所选中的设备?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						dataManageList(data)
							.then(response => {
								// console.log('delgo---', response)
								if(errorStatus(response.data)) {
									this.currentPage = 1
									this.getPageInfo(this.classType)
									this.$message.success('删除成功!')
								}
							})
							.catch(Error => {
								this.$message.error('请求失败')
							})
					})
				}
			},
			// 选中状态
			handleSelectionChange(val) {
				this.chosed = val
			},
			// 分页
			handleCurrentChange(val) {
				this.currentPage = val
				if(this.serch_req) {
					this.searchList('formList', val)
				} else {
					this.pageSet = true
					this.getPageInfo(this.classType)
				}
			},
			refreshThis() {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				})
				const data = {}
				for(var i in this.buttonList) {
					if(this.classType === this.buttonList[i].id) {
						data.nod_node = this.buttonList[i].nod_node
						data.nod_id = this.buttonList[i].nod_id
						data.sort = this.buttonList[i].sort
					}
				}
				refreshBase(data)
					.then(response => {
						loading.close()
						const dataRep = response.data
						if(errorStatus(dataRep)) {
							if(dataRep.code === 500) {
								this.$message.error(dataRep.data)
							} else {
								this.$message.success(dataRep.data)
								this.getPageInfo(1);

							}
						}
					})
					.catch(Error => {
						loading.close()
						this.$message.error('请求失败')
						console.log('请求失败--', Error)
					})
			},
			addClaForm(formName) {
				if(this.edit) {
					this.$nextTick(() => {
						this.$refs[formName].resetFields()
					})
					this.edit = false
				} else {

					this.$refs[formName].resetFields()
				}
				this.addCla.device_time = ''
				this.showAddClas = false

			},
			backBtn() {
				var tagName = {}

				// this.$confirm('确定离开当前列表?', '提示', {
				//    confirmButtonText: '确定',
				//    cancelButtonText: '取消',
				//    type: 'warning'
				//  })
				//  .then(() => {
				this.$emit('listerToChild', 'addPage')
				//   }).catch(() => {
				// })
			},

			resetForm(formName) {
				this.$refs[formName].resetFields()
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scope>
	@import "@/styles/variables.scss";
	.dialog_resetPwd {
		.resetPwd_box {
			// padding:0 70px;
			.succes-icon-box {
				padding: 8px 20px;
				height: 56px;
				float: left;
			}
			p {
				font-size: 16px;
				text-align: center;
				&.tip_success {
					// padding: 0 120px;
					font-size: 20px;
					font-weight: bold;
					.el-icon-success {
						color: $blue;
						font-size: 22px;
						padding-right: 16px;
					}
				}
				&.tip_suc {
					padding-top: 16px;
					.text-pwd {
						color: #333;
					}
				}
			}
		}
	}
</style>
<style rel="stylesheet/scss" lang="scss">
	.account_add {
		.account_add_form {
			.el-form-item__label {
				padding: 0 40px 0 0;
			}
			.el-input.is-disabled .el-input__inner {
				color: #666;
			}
		}
		.el-dialog__body {
			padding: 30px 20px 20px;
			.list_data_add .tip_box {
				color: #f35e5e;
				font-size: 12px;
				line-height: 20px;
			}
		}
	}
</style>
<style>
	.rightInfoWord {
		font-size: 13px
	}
	
	.rightInfoWord a {
		margin-left: 50px
	}
	
	.tableButton {
		float: left;
		margin: 0 10px 10px 10px !important;
	}
</style>
<style scoped>
	.primary {
		background: #409EFF !important;
		color: #fff !important;
		border: 1px solid #409EFF
	}
</style>