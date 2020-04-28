
<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {

  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  //  created() {
  //  // console.log(this.$store.getters.permission_routers,23567)
  // },
}
</script>
<style rel="stylesheet/scss" lang="scss">
.logo-left-img{
  margin:15px 15px 5px;
  width:134px;
  height: 34px;
}
.logo-biao-img{
 margin:15px 3px 5px;;
 width:28px;
 height:34px;
}
</style>
