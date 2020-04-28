<template>
  <div class="app-orderLists">
    <!-- 弹窗 -->
    <el-dialog :visible.sync="showAddClas":close-on-click-modal="false"title="新增订单"width="600px"margin-top="10vh"@close="addClaForm('addPop')">
      <div>
        <el-form ref="addPop":model="addPop":rules="rulesPop"label-width="80px">
          <p class="addPop-header">客户信息</p>
          <el-row>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="客户姓名"prop="name">
                <el-input v-model="addPop.name" maxlength='10'style="width:180px"placeholder="请输入客户姓名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="联系电话"prop="phonr">
                <el-input v-model="addPop.phonr" maxlength='11'style="width:195px"placeholder="请输入联系电话"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="收货地址"prop="province"class="sd-form-item inventory">
                <el-select v-model="addPop.province"style="width:124px"clearable placeholder="省"@change="choseProvince">
                  <el-option v-for="item in province":key="item.value":label="item.value":value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label=""label-width="0px":class="warnBd.city?'sd-form-item inventory is-error is-required':'sd-form-item inventory'"> 
                <el-select v-model="addPop.city"class style="width:123px"clearable placeholder="市"@change="choseCity">
                  <el-option v-for="item in cityList":key="item.value":label="item.value":value="item.value"/>
                </el-select>
                <div class='el-form-item__error'v-show="warnBd.city">
                  请选择市
                </div>
              </el-form-item>
              <el-form-item label=""label-width="0px"class="sd-form-item inventory">
                <el-select v-model="addPop.county"class style="width:124px"clearable placeholder="县/区"@change="choseBlock">
                  <el-option v-for="item in countyList":key="item.value":label="item.value":value="item.value"/> 
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label prop="address">
            <el-input v-model="addPop.address"placeholder="请输入详细地址"/>
          </el-form-item>
          <p class="addPop-header">订单信息</p>
          <el-form-item label="系统单号"prop="sysNumber"class="sd-form-item">
            <el-input v-model="addPop.sysNumber"disabled />
          </el-form-item>
          <el-row>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="销售平台"class="sd-form-item">
                <el-select v-model="addPop.states"class placeholder="请选择销售平台"style="width:180px">
                  <el-option v-for="item in addPlat":key="item.plat_id":label="item.plat_name":value="item.plat_id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="客户账号">
                <el-input v-model="addPop.customer" maxlength="20"style="width:195px"placeholder="请输入客户账号"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="平台单号">
            <el-input v-model="addPop.platform"placeholder="请输入平台单号"/>
          </el-form-item>
          <el-form-item label="订单商品"prop="orderGoods">
            <el-select v-model="addPop.orderGoods":remote-method="querySearchAsync":loading="goodSearchLoad"filterable remote placeholder="请输入订单商品 可搜索"@change="handleSelect">
              <el-option v-for="item in goodsList":key="item.goods_id":label="item.value":value="item.goods_id"/>
            </el-select>
          </el-form-item>

          <div class="addOutSp-table-box">
            <el-table :data="list":border="false"width="100%"class="addOutsp-table"height="250"@selection-change="handleSelectionChange">
              <el-table-column label="商品名称"prop="goods_name"min-width align="center"/>
              <el-table-column label="数量"width="150"align="center"> 
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.goods_number":min="0"placeholder="0"name="goods_number[]"class="lk-el-num"@focus="focusl($event)"@blur="goodsOutNum(scope.$index,scope.row,$event)"@keyup.native="goodsNumKeyup(scope.$index,$event,scope.row)"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单价" prop="goods_money" width="130"align="center"/>
               <!--  <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.goods_money":min="0"placeholder="0"name="goods_number[]"class="lk-el-num"@focus="focusl($event)"@blur="goodsUnit(scope.$index,scope.row,$event)"@keyup.native="goodsUnitKeyup(scope.$index,$event,scope.row)"/> 
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column label="操作"align="center"width="60">
                <template slot-scope="scope">
                  <el-button class="operation-style btn-delete"@click="delenable(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

        </el-form>
      </div>
      <span slot="footer">
        <p style="padding-top:0px; color:#666;"class="fl">
          <span>合计金额：</span>
          <span class="black"> ￥{{ addPop.allMoney }}</span>
        </p>
        <el-button type="primary"@click="addsubBtn('addPop')">提 交</el-button>
        <el-button @click="addClaForm('addPop')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addOrderpage, getGooName, addOrder } from '@/api/orderAdmin'
import { errorStatus } from '@/utils/index'
import axios from 'axios'
// import { getToken } from '@/utils/auth'
export default {
  components: {},
  data(){
    return {
      loading:false,
      mapJson: '../../../static/map/map.json',
      rulesPop: {
        name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        phonr: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        states: [
          { }
        ],
        customer: [
          {}
        ],
        platform: [
          { }
        ],
        orderGoods: [
          { required: true, message: '请输入订单商品', trigger: 'blur' }
        ],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      showAddClas: true,
      addPop: {// 我的云仓里的input框里的数据
        name: '',
        phonr: '',
        province: '',
        city: '',
        county: '',
        address: '',
        sysNumber: null,
        states: '',
        customer: '',
        platform: '',
        orderGoods: '',
        goods_id: [],
        goods_number: [],
        goods_money: [],
        allMoney: 0,
        customer_user: ''
      },
      provinceList: [],
      province: [],
      sheng: '',
      shi: '',
      qu: '',
      city: '',
      block: '',
      cityList: [],
      countyList: [],
      list: [],
      type: [
        { id: 0, name: '全部' }
      ],
      addPlat: [],
      goodsList: [],
      goodSearchLoad: false,
      warnBd:{
        city:false
      }
    }
  },
  created() {
    this.getaddOrderpage()
    this.getCityData()
  },
  methods: {
    // 加载china地点数据，三级

    getCityData: function() {
      var that = this
      axios.get(this.mapJson).then(function(response) {
        if (response.status === 200) {
          var data = response.data
          that.province = []
          that.city = []
          that.block = []
          // 省市区数据分类
          for (var item in data) {
            if (item.match(/0000$/)) { // 省
              that.province.push({ id: item, value: data[item], children: [] })
            } else if (item.match(/00$/)) { // 市
              that.city.push({ id: item, value: data[item], children: [] })
            } else { // 区
              that.block.push({ id: item, value: data[item] })
            }
          }
          // 分类市级
          for (var index in that.province) {
            for (var index1 in that.city) {
              if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                that.province[index].children.push(that.city[index1])
              }
            }
          }
          // 分类区级
          for (var item1 in that.city) {
            for (var item2 in that.block) {
              if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                that.city[item1].children.push(that.block[item2])
              }
            }
          }
        } else {
          // console.log(response.status)
        }
      }).catch(function(error) { console.log(typeof +error) })
    },
    // 选省
    choseProvince: function(e) {
       this.warnBd.city=false;
      this.addPop.city = ''
      this.addPop.county = ''
      this.addPop.address = ''
      for (var index2 in this.province) {
        if (e === this.province[index2].value) {
          this.cityList = this.province[index2].children
          this.shi = this.province[index2].children[0].value
          this.countyList = this.province[index2].children[0].children
          this.qu = this.province[index2].children[0].children[0].value
          this.E = this.countyList[0].value
        }
      }
    },
    // 选市
    choseCity: function(e) {
       this.warnBd.city=false;
      this.addPop.county = ''
      this.addPop.address = ''
      for (var index3 in this.city) {
        if (e === this.city[index3].value) {
          this.countyList = this.city[index3].children
          this.qu = this.city[index3].children[0].value
          this.E = this.countyList[0].value
        }
      }
    },
    // 选区
    choseBlock: function(e) {
      //  this.addPop.county='';
      this.addPop.address = ''
      this.E = e
    },
    getaddOrderpage() {
      const that = this
      this.loading=true;
      const data = {}
      // 搜索仓库
      // console.log(data)
      addOrderpage(data)
        .then(response => {
          this.loading=false;
          // console.log('获取订单列表--', response.data)
          if (errorStatus(response.data)) {
            // console.log(response.data)
            that.addPop.sysNumber = response.data.data.system_number
            that.addPlat = response.data.data.plat
            that.goodsList = response.data.data.goods
          } else {
            this.$message.error(response.data.data)
          }
          // loading.close()
        })
        .catch(err => {
           this.loading=false;
          // loading.close()
          this.$message.error(err)
          console.log('获取列表err', err)
        })
    },
    addClaForm() {
      this.$emit('childByValue', 1)
    },
    handleSelectionChange() {

    },
    querySearchAsync(query) {
      if (query !== '') {
        this.goodSearchLoad = true
        const data = {}
        data.goods_name = query
        // setTimeout(() => {
        getGooName(data).then(response => {
          this.goodSearchLoad = false
          if (errorStatus(response.data)) {
            this.goodsList = response.data.data
          }
        }).catch(Error => {
          console.log('err--', Error)
        })
        // }, 200);
      }
    },
    handleSelect(val) {
      // console.log('订单商品-选中值--', val)
      const that = this
      const lists = that.list
      const goodsList = that.goodsList

      if (lists.length === 0) {
        // console.log('length--0')
        for (const i in goodsList) {
          if (goodsList[i].goods_id === val) {
            lists.push(goodsList[i])
          }
        }

      } else {
          var addTrue=false;
        // console.log('length-1')
        for (var j = 0; j < lists.length; j++) {
          console.log('list.id', lists[j].goods_id)
          if (lists[j].goods_id === val) {
            addTrue=true;
            that.$message.error('请勿重复添加')
            return false
          } 
        }
        if(!addTrue){
           for (const i in goodsList) {
              if (goodsList[i].goods_id === val) {
                lists.push(goodsList[i])
                return false
              }
            }

        }
      }
       let count = 0
      for (var i = 0; i < lists.length; i++) {
        count += lists[i].goods_money * lists[i].goods_number
      }
      // console.log(count)
      this.addPop.allMoney = count
    },

    deleArry(a, sub) {
      let i = a.length
      while (i--) {
        if (a[i].goods_id === sub) {
          return i
        }
      }
      return false
    },
    delenable(scope) {
      const that = this;
      const count =Number(scope.row.goods_money)*Number(scope.row.goods_number);
      let allMoney=this.addPop.allMoney -count;
      if(allMoney<0){
        allMoney=0
      }
      this.addPop.allMoney=allMoney;
       const arrlist = that.list
      const arrId = this.deleArry(arrlist, scope.row.goods_id);
      arrlist[arrId].goods_money=0;
      arrlist[arrId].goods_number=0;
      arrlist.splice(arrId, 1)
      // console.log(arrlist)
    },
    focusl(e) {
      e.target.value = ''
    },
    addsubBtn(formName) {
      // 添加确定按钮后要做的操作
      const that = this
      if(that.addPop.province !=='香港特别行政区'&&that.addPop.province !=='澳门特别行政区'){
        if(that.addPop.city===''){
           this.warnBd.city=true;
           this.$message.error("提交数据不完整,请完善")
           return false
        }
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const datarr = {}
      // data.type = 1
      datarr.plat_id = that.addPop.states
      datarr.plat_number = that.addPop.platform
      datarr.system_number = that.addPop.sysNumber
      datarr.user_name = that.addPop.name
      datarr.user_tel = that.addPop.phonr
      datarr.user_account = that.addPop.customer
      datarr.customer_user = that.addPop.customer_user
      datarr.province = that.addPop.province
      datarr.city = that.addPop.city
      datarr.county = that.addPop.county
      datarr.address = that.addPop.address
      const goodsId=[]
      const goodsNum=[]
      const goodsMoney=[]
      for(var i in  that.list){
        goodsId.push(that.list[i].goods_id)
        goodsNum.push(that.list[i].goods_number)
        goodsMoney.push(that.list[i].goods_money)
      }
      datarr.goods_id=goodsId
      datarr.goods_number=goodsNum
      datarr.goods_money=goodsMoney
          addOrder(datarr)
            .then(response => {
              if (response.data.code === 200) {
                this.$emit('childByValue', 0)
                that.list = []
                that.$refs[formName].resetFields()
              } else {
                this.$message.error(response.data.data)
              }
              loading.close()
            })
            .catch(err => {
              loading.close()
              this.$message.error(err)
              console.log('获取列表err', err)
            })
        // } else {
        //   loading.close();
        //   this.$message.error("提交数据不完整,请完善")
        //   console.log('error submit!!')
        //   return false
        // }
      // })
    },
    // 弹窗--出库数量
    goodsOutNum(index, row, e, out) {
      // console.log(index, row, e, out)
      // console.log(this.list)
      const lists = this.list

      let count = 0
      var s1 = ''
      var m = 0;
      for (var i = 0; i < lists.length; i++) {
        s1=lists[i].goods_money.toString()
        try {
          m += s1.split(".")[1].length;
          // alert(s1.split(".")[1].length)
        } catch (e) {}
        // alert((Number(s1.replace(".", ""))*lists[i].goods_number)/ Math.pow(10, m))
        count += lists[i].goods_money * lists[i].goods_number
      }
      // console.log(count)
      // if (out === 1) {
      //   if (row.count > row.goods_number) {
      //     row.count = row.goods_number
      //   }
      //   this.outStockGoods[index] = row
      //   let rowAlldata = 0
      //   for (let i = 0; i < this.outStockGoods.length; i++) {
      //     rowAlldata += parseInt(this.outStockGoods[i].count)
      //   }
      //   this.total = rowAlldata
      //   if (parseInt(row.count) !== parseInt(row.number)) {
      //     this.abnormal = true
      //   }
      // } else {
      //   if (row.count > row.goods_number) {
      //     row.count = row.goods_number
      //   }
      //   this.diolag.list[index] = row
      //   let rowAlldata = 0
      //   for (let i = 0; i < this.diolag.list.length; i++) {
      //     rowAlldata += parseInt(this.diolag.list[i].count)
      //   }
      //   this.total = rowAlldata
      // }

      this.addPop.allMoney = count
    },
    // 单价--失去焦点
    goodsUnit(index, row, e) {
      const lists = this.list
      // console.log('e--value', e.target.value)
      lists[index].goods_money = e.target.value
      let count = 0
      for (var i = 0; i < lists.length; i++) {
        count += lists[i].goods_money * lists[i].goods_number
      }
      // console.log(count)
      this.addPop.allMoney = count
    },
    // 单价--键盘抬起事件
    goodsUnitKeyup(index, e, row) {
      // console.log('e--value', e.target.value)
      // console.log('e--index', index)
      // console.log('e--row', row)
      const lists = this.list
      const value = e.target.value
      const value1 = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      const value2 = value1.replace(/^\./g, '') // 验证第一个字符是数字而不是.
      // const val1 = value2.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的.
      const val1 = value2.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 只保留第一个. 清除多余的.
      const val2 = val1.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      lists[index].goods_money = val2
    },
    goodsNumKeyup(index, e, row) {
      // console.log('e--value', e.target.value)
      // console.log('e--index', index)
      // console.log('e--row', row)
      const lists = this.list
      const value1 = e.target.value
      const value2 = value1.replace(/\D/g, '') // 只能输入数字
      const value = value2.replace(/^[0]*/g, '') // 第一个数字不能为0
      lists[index].goods_number = value
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.app-orderListes {
  padding: 20px;
  .addPop-autoc {
    width: 100%;
  }
  .inventory {
    display: inline-block;
  }
  .operation-style {
    padding: 6px 4px;
    font-size: 10px;
  }
  .primary-absolute {
    position: absolute;
    right: 0;
  }
  .app-orderLists {
    .el-dialog__wrapper {
      .el-dialog {
        .el-table th.is-leaf {
          border-bottom: 0px;
        }
        margin-top: 10vh;
        .el-dialog__body {
          overflow: auto;
          height: 500px;
          padding: 10px 20px;
          .addPop-header {
            background: #f0f2f5;
            padding: 5px 10px;
            margin: 10px 0;
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>
