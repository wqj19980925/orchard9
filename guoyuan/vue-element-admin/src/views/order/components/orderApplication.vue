<template>
  <div class="app-orderLists">
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="showApplication"
      :close-on-click-modal="false"
      title="派发订单"
      width="800px"
      margin-top="10vh"
      @close="addClaForm('addPop')"
    >
      <div v-loading="showLoading" class="lk-table-box amountQuanss">
        <el-table
          :data="goods_list"
          width="100%"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="系统单号(后18位)" prop="system_number" min-width fixed align="center"/>
          <el-table-column label="订单商品" fixed width="140" min-width align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.goods_name }}</p>
              <p>{{ scope.row.number }}</p>
            </template>
          </el-table-column>
          <el-table-column label="数量" fixed prop="goods_number" width="100" align="center"/>
          <el-table-column label="出库云仓" fixed width="280" align="center">
            <template slot-scope="scope">
              <!-- <p>{{ scope.row.warelist }}</p> -->
              <el-select v-model="scope.row.ware_id" style="width:240px" placeholder="请选择出库云仓" clearable >
                <el-option v-for="item in scope.row.warelist":key="item.ware_id":label="item.ware_name":value="item.ware_id"/>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="addsubBtn('addPop')">提 交</el-button>

        <el-button @click="addClaForm('addPop')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getDistriOrder, distriware } from '@/api/orderAdmin'
import { errorStatus } from '@/utils/index'
export default {
  components: {},
  props: {
    inputName: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      mapJson: '../../../static/map/map.json',
      exitMlist: [],
      rulesPop: {
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }]
      },
      goods_list: [],
      showApplication: true,
      addPop: {
        // 我的云仓里的input框里的数据
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
        allMoney: 0,
        customer_user: ''
      },
      showLoading: false
    }
  },
  created() {
    this.getaddorderpage()
  },
  methods: {
    getaddorderpage() {
      const that = this
      that.showLoading = true
      const data = {}
      // console.log('搜索仓库', this.inputName)
      // 搜索仓库
      // console.log(data)
      data.order_id = this.inputName
      getDistriOrder(data)
        .then(response => {
          that.showLoading = false
          // console.log(response)
          if (errorStatus(response.data)) {
            const goodsList = response.data.data.goods_list
            for (const i in goodsList) {
              if (goodsList[i].ware_id === 0) {
                goodsList[i].ware_id = null
              }
            }
            that.goods_list = goodsList
          }
        })
        .catch(err => {
          that.showLoading = false
          console.log('获取列表err', err)
        })
    },
    addClaForm() {
      this.$emit('childByValues', 1)
    },
    handleSelectionChange() {},
    querySearchAsync(queryString, callback) {},
    handleSelect(item) {
      const that = this
      that.list.push(item)
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
      const that = this
      const arrlist = that.list
      const arrId = this.deleArry(arrlist, scope.row.goods_id)
      arrlist.splice(arrId, 1)
      // console.log(arrlist)
    },
    focusl(e) {
      e.target.value = ''
    },
    addsubBtn(formName) {
      // 添加确定按钮后要做的操作
      const that = this
      const data = {}
      // console.log('goods_list---', that.goods_list)
      const goods_idList = []
      const ware_idList = []
      const order_idList = []
      for (var i = 0; i < that.goods_list.length; i++) {
        if (that.goods_list[i].ware_id === '' || that.goods_list[i].ware_id === null) {
          this.$message.error('请给订单内所有商品选择出库云仓')
          return false
        }
        goods_idList.push(that.goods_list[i].goods_id)
        ware_idList.push(that.goods_list[i].ware_id)
        order_idList.push(that.goods_list[i].order_id)
      }
      // console.log('that.goods_idList---', goods_idList)
      data.goods_id = goods_idList
      data.ware_id = ware_idList
      data.order_id = order_idList
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      distriware(data)
        .then(response => {
          // console.log(response)
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data)
            this.$emit('childByValues', 0)
          }
          loading.close()
        })
        .catch(err => {
          loading.close()
          this.$message.error('请求失败!')
          console.log('获取列表err', err)
        })
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
          height: 400px;
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
