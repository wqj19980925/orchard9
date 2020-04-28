<template>
  <div class="app-orderLists">
    <!-- 弹窗 -->
    <el-dialog :visible.sync="showAddClas":close-on-click-modal="false"title="编辑订单"width="600px"margin-top="10vh"@close="addClaForm('')">
      <div v-loading="editLoading">
        <el-form ref="user":model="user":rules="rulesPop"label-width="80px">
          <p class="addPop-header">客户信息</p>
          <el-row>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="客户姓名"prop="user_name">
                <el-input v-model="user.user_name" maxlength="10" style="width:180px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="联系电话"prop="user_tel">
                <el-input v-model="user.user_tel" maxlength="11"style="width:195px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="收货地址"prop="province"class="sd-form-item inventory">
                <el-select v-model="user.province"style="width:124px"clearable placeholder="省"@change="choseProvince">
                  <el-option v-for="item in province":key="item.id":label="item.value":value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label=""label-width="0px":class="warnBd.city?'sd-form-item inventory is-error is-required':'sd-form-item inventory'"> 
                <el-select v-model="user.city"class style="width:123px"clearable placeholder="市"@change="choseCity">
                  <el-option v-for="item in cityList":key="item.id":label="item.value":value="item.value"/>
                </el-select>
                <div class='el-form-item__error'v-show="warnBd.county">
                  请选择市
                </div>
              </el-form-item>
              <el-form-item label=""label-width="0px"class="sd-form-item inventory">
                <el-select v-model="user.county"class style="width:124px"clearable placeholder="县/区"@change="choseBlock">
                  <el-option v-for="item in countyList":key="item.id":label="item.value":value="item.value"/> 
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label prop="address">
            <el-input v-model="user.address"placeholder="请输入详细地址"/>
          </el-form-item>
        </el-form>
        <el-form ref="order":model="order":rules="rulesPop"label-width="80px">
          <p class="addPop-header">订单信息</p>
          <el-form-item label="系统单号"prop="sysNumber"class="sd-form-item">
            <el-input v-model="order.system_number"disabled />
          </el-form-item>
          <el-row>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="销售平台"prop="plat_ids"class="sd-form-item">
                <el-select v-model="order.plat_ids"placeholder="请输入销售平台"style="width:180px">
                  <el-option v-for="item in addPlat":key="item.plat_id":label="item.plat_name":value="item.plat_id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12"class="sd-col-6">
              <el-form-item label="客户账号">
                <el-input v-model="order.user_account" maxlength="20"style="width:195px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="平台单号">
            <el-input v-model="order.plat_number" />
          </el-form-item>
        </el-form>
      </div>
      <el-form ref="order":model="order"label-width="80px">
        <el-form-item label="订单商品"prop="orderGoods">
          <el-select v-model="order.orderGoods":remote-method="querySearchAsync":loading="goodSearchLoad"filterable remote placeholder="请输入订单商品 可搜索"@change="handleSelect">
            <el-option v-for="item in goodsList":key="item.goods_id":label="item.value":value="item.goods_id"/>
          </el-select>
        </el-form-item>

        <div class="addOutSp-table-box">
          <el-table :data="goods":border="false"width="100%"class="addOutsp-table"height="250"@selection-change="handleSelectionChange">
            <el-table-column label="商品名称"prop="goods_name"min-width align="center"/>
            <el-table-column label="数量"width="105"align="center">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.goods_number"placeholder="0"name="goods_number[]"class="lk-el-num"@focus="focusl($event)"@blur="goodsNum(scope.$index,scope.row,$event)"@keyup.native="goodsNumKeyup(scope.$index,$event,scope.row)"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价"width="105"align="center"  prop="goods_money">
              <!-- <template slot-scope="scope" width="130"align="center"/> -->
               <!--  <div>
                  <el-input v-model="scope.row.goods_money":min="0"placeholder="0"name="goods_number[]"class="lk-el-num"@focus="focusl($event)"@blur="goodsUnit(scope.$index,scope.row,$event)"@keyup.native="goodsUnitKeyup(scope.$index,$event,scope.row)"/>
                </div>
              </template> -->
            </el-table-column>
            <el-table-column label="操作"align="center"width="100">
              <template slot-scope="scope">
                <el-button class="operation-style btn-delete"@click="delenable(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <span slot="footer">
        <p style="padding-top:0px;color:#666;"class="fl">
          <span>合计金额：</span>
          <span class="black">￥{{ addPop.allMoney }}</span>
        </p>
        <el-button type="primary"@click="addsubBtn('user')">提 交</el-button>
        <el-button @click="addClaForm('')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getGooName, editOrder, getOrderEidt } from '@/api/orderAdmin'
import { errorStatus } from '@/utils/index'
import axios from 'axios'
// import { getToken } from '@/utils/auth'
export default {
  components: {},
  props: {
    inputName: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      mapJson: '../../../static/map/map.json',
      rulesPop: {
        user_name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        user_tel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        user_account: [
          {}
        ],
        plat_number: [
          {}
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
      user: {},
      order: {},
      goods: [],
      customer_user: '',
      addPop: {// 我的云仓里的input框里的数据
        name: '',
        phonr: '',
        province: '',
        city: '',
        county: '',
        address: '',
        sysNumber: null,
        states: 1,
        customer: '',
        platform: '',
        orderGoods: '',
        goods_id: [],
        goods_number: [],
        goods_money: [],
        allMoney: 0

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
      editLoading: false,
      goodSearchLoad: false,
      goodsList: null,
      warnBd:{
        city:false
      }
    }
  },
  created() {
    this.getaddorderpage()
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
            //  console.log("that.province--",that.province)
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
      console.log("-- that.province = []---",e)
       this.warnBd.city=false;
      this.user.city = ''
      this.user.county = ''
      this.user.address = ''
      for (var index2 in this.province) {
        if (e === this.province[index2].value) {
          this.cityList = this.province[index2].children
          this.shi = this.province[index2].children[0].value
          this.countyList = this.province[index2].children[0].children
          this.qu = this.province[index2].children[0].children[0].value
          this.E = this.countyList[0].value
        }
      }
      console.log("-- t this.city = []---",  this.city)
     
    },
    // 选市
    choseCity: function(e) {
       this.warnBd.city=false;
      this.user.county = ''
      this.user.address = ''
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
      this.user.address = ''
      this.E = e
    },
    // 页面加载
    getaddorderpage() {
      this.editLoading = true
      // console.log(this.inputName)
      const that = this
      const data = {}
      data.order_id = this.inputName
      // 搜索仓库
      // console.log(data)
      getOrderEidt(data)
        .then(response => {
          that.editLoading = false
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            console.log(dataRep)
            that.addPlat = dataRep.data.plat
            // plat_ids
            that.user = response.data.data.user
            that.order = response.data.data.order
            // console.log('that.user--', that.user)
            // console.log('that.order--', that.order)
            that.goods = response.data.data.goods
            const monet = response.data.data.goods
            let allmon = 0
            for (var i = 0; i < monet.length; i++) {
              allmon += monet[i].goods_money * monet[i].goods_number
            }
            that.addPop.allMoney = allmon;
            that.goodsList = response.data.data.new_goods;
            // 销售平台为空
            if (that.order.plat_ids === 0) {
              that.order.plat_ids = ''
            }
            // this.cityList=[];
             for (var index2 in this.province) {
         if (response.data.data.user.province === this.province[index2].value) {
          this.cityList = this.province[index2].children
          this.shi = this.province[index2].children[0].value
          this.countyList = this.province[index2].children[0].children
          this.qu = this.province[index2].children[0].children[0].value
          this.E = this.countyList[0].value
        }
      }
       for (var index3 in this.city) {
        if (response.data.data.user.city === this.city[index3].value) {
          this.countyList = this.city[index3].children
          this.qu = this.city[index3].children[0].value
          this.E = this.countyList[0].value
        }
      }
          }
        })
        .catch(err => {
          console.log('获取列表err', err)
        })
    },
    addClaForm() {
      this.$emit('childByPops', 1)
    },
    handleSelectionChange() {},
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
      }
    },
    handleSelect(val) {
      console.log('订单商品-选中值--', val)
      const that = this
      const lists = that.goods
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
        for (var j = 0; j < lists.length; j++) {
          console.log('list.id', lists[j].goods_id)
          if (lists[j].goods_id === val) {
            addTrue=true;
            that.$message.error('请勿重复添加');
            return false
          } else {
            
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
      // console.log(that.list)
      }
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
      const arrlist = that.goods
      const arrId = this.deleArry(arrlist, scope.row.goods_id);
       arrlist[arrId].goods_money=0;
      arrlist[arrId].goods_number=0;
      arrlist.splice(arrId, 1)
    },
    focusl(e) {
      e.target.value = ''
    },
    // 提交
    addsubBtn(formName) {
      // 添加确定按钮后要做的操作
      const that = this
      if(that.user.province !=='香港特别行政区'&&that.user.province !=='澳门特别行政区'){
        if(that.user.city===''){
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
      const data = {}
      data.type = 1
      data.order_id = this.inputName
      data.plat_id = that.order.plat_ids
      data.plat_number = that.order.plat_number
      data.system_number = that.order.system_number
      data.user_name = that.user.user_name
      data.user_tel = that.user.user_tel
      data.user_account = that.order.user_account
      data.customer_user = that.customer_user
      data.province = that.user.province
      data.city = that.user.city
      data.county = that.user.county
      data.address = that.user.address
      // data.goods = that.goods
      const goodsId=[]
      const goodsNum=[]
      const goodsMoney=[]
      for(var i in  that.goods){
        goodsId.push(that.goods[i].goods_id)
        goodsNum.push(that.goods[i].goods_number)
        goodsMoney.push(that.goods[i].goods_money)
      }
      data.goods_id=goodsId
      data.goods_number=goodsNum
      data.goods_money=goodsMoney
      // console.log('-----', this.$refs)
      this.$refs[formName].validate(valid => {
        // console.log('----111-')
        if (valid) {
          // console.log('----222-')
          this.$refs.order.validate(valide => {
            // console.log('----333-')
            if (valide) {
              // console.log('00000')
              editOrder(data)
                .then(response => {
                  loading.close()
                  if (errorStatus(response.data)) {
                    this.$emit('childByPops', 0)
                    that.list = []
                    that.$refs[formName].resetFields()
                  }
                })
                .catch(err => {
                  loading.close()
                  this.$message.error(err)
                  console.log('获取列表err', err)
                })
            } else {
              loading.close()
              // console.log('error submit!!')
              return false
            }
          }
          )
        } else {
          loading.close();
          this.$message.error("提交数据不完整,请完善")
          // console.log('error submit!!')
          return false
        }
      })
    },
    goodsNum(index, row, e) {
      const lists = this.goods
      // console.log('e--value', e.target.value)
      lists[index].goods_number = e.target.value
      let count = 0
      for (var i = 0; i < lists.length; i++) {
        count += lists[i].goods_number * lists[i].goods_money
      }
      // console.log(count)
      this.addPop.allMoney = count
    },
    // 单价--失去焦点
    goodsUnit(index, row, e) {
      const lists = this.goods
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
      const lists = this.goods
      const value = e.target.value
      const value1 = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      const value2 = value1.replace(/^\./g, '') // 验证第一个字符是数字而不是.
      const val1 = value2.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
      const val2 = val1.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      lists[index].goods_money = val2
    },
    // 数量--键盘抬起事件
    goodsNumKeyup(index, e, row) {
      // console.log('e--value', e.target.value)
      // console.log('e--index', index)
      // console.log('e--row', row)
      const lists = this.goods
      const value1 = e.target.value
      const value2 = value1.replace(/\D/g, '') // 只能输入数字;
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
