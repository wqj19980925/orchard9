<template>
  <el-dialog
    v-bind="$attrs"
    class="small-dialog common-dialog"
    title="入库详情"
    v-on="$listeners"
  >
    <!-- 主体内容 -->
    <div class="content">
      <el-row>
        <el-col>
          系统编号 : {{ list.receipt.rec_order }}
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col :md="12">
          数量 : {{ list.receipt.rec_count }}
        </el-col>
        <el-col :md="12">
          状态 : 未入库
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col>
          <el-table
            :data="list.goods"
            width="100%"
            height="300px"
          >
            <el-table-column
              prop="goods_name"
              label="商品名称"
              min-width
              align="center"
            />
            <el-table-column
              prop="stu_num"
              label="存库数量"
              min-width
              align="center"
            />
            <el-table-column
              prop="det_real_quantity"
              label="入库数量"
              min-width
              align="center"
            />
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col>
          发货方 : {{ list.ditch.dit_name }}
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col :md="12">
          姓名 : {{ list.ditch.dit_person }}
        </el-col>
        <el-col :md="12">
          电话 : {{ list.ditch.dit_tel }}
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col>
          备注 : {{ list.receipt.rec_remarks }}
        </el-col>
      </el-row>
    </div>
    <span slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { lookWrite } from '@/api/wareHouse';
export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      list: {
        receipt: {},
        goods: [],
        ditch: {
          dit_name: '',
          dit_person: '',
          dit_tel: ''
        }
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    /**
     * 关闭弹窗
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },
    /**
     * 确认
     */
    handleConfirm() {
      this.handleCancel()
    },
    /**
     * 弹窗内容初始化
     */
    async initData() {
      const { data } = await lookWrite({
        rec_id: this.id
      })
      this.list = { ...data.data_info, ditch: data.data_info.ditch || {}}
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin: 20px;
  min-height: 200px;

  &-item {
    height: 30px;
    line-height: 30px;
  }

  .el-input {
    width: calc(100% - 30px);
  }
}
.mt20 {
  margin-top: 20px;
}
</style>
