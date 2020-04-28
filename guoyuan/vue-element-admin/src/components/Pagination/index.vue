<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
      >
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },

    layout: {
      type: String,
      default: 'total, prev, pager, next,jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        console.log('1111111111111',this.page)
        return this.page
      },
      set(val) {
        // 抛给父组件
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        // 抛给父组件
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    // 每页?条
    // handleSizeChange(val) {
    //   this.$emit('pagination', { page: this.currentPage, limit: val })
    //   if (this.autoScroll) {
    //     scrollTo(0, 800)
    //   }
    // },
    // 当前页
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val ,limit: this.pageSize})
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  text-align: right;
}
.pagination-container.hidden {
  display: none;
}
</style>
