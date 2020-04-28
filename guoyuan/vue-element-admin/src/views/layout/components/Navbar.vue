<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <el-tooltip content="使用手册" effect="dark" placement="bottom">
        <div class="right-menu-item">
          <svg-icon icon-class="wri_que" class="svg-que"/>
        </div>
      </el-tooltip>
      <!-- <el-tooltip content="消息中心" effect="dark" placement="bottom">
        <div class="infor-box right-menu-item">
          <svg-icon icon-class="wri_info" class="svg-infor"/> -->
          <!-- <i class="infor-num">{{ infor }}</i> -->
          <!-- <i class="infor-num">0</i>
        </div>
      </el-tooltip> -->
      <!-- <el-dropdown placement="bottom" class="right-menu-item">
        <div class>
          <svg-icon icon-class="tip" class="svg-que"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="time-down">
            <div>到期日期:
              <p class="time">2018-10-11 24:00:00</p>
            </div>
          </el-dropdown-item>
          <div class="btn-box">
            <el-button class="main-btn" size="mini">去支付</el-button>
          </div>
        </el-dropdown-menu>
      </el-dropdown>-->
      <el-dropdown class="avatar-container right-menu-item" trigger="hover">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar" class="user-avatar" v-if="avatar!=''">-->
          <svg-icon icon-class="icon_user" class="user-icon"/>
          {{ name }}
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link v-if="showPer" :to=" admins ">
            <el-dropdown-item style="text-align:center;">个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block; text-align:center;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {
  personal
} from '@/api/system'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      time: 2020 - 12 - 31,
      admins: '',
      showPer: true,
      name:''
    }
  },
  computed: {

    ...mapGetters(['sidebar', 'name', 'avatar', 'device', 'infor'])
  },
  created() {
    // console.log(this.$store.getters,245)
    this.personals()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    personals() {
      const data = {}
      personal(data)
        .then(response => {
          // console.log(response.data)
          if (response.data.code === 500) {
            this.showPer = false
          } else {
            this.name=response.data.admin.adm_name
            this.admins = '/System/Mypersonal'
          }
        })
        .catch(Error => {

        })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$message({
          message: '退出成功',
          type: 'success'
        })
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";

.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    width: 290px;
    padding-top: 7px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      float: left;
      line-height: 40px;
      width: 34px;
      height: 34px;
      text-align: center;
      border-radius: 25px;
      background-color: $blue;
      margin-right: 26px;
      cursor: pointer;
      .svg-icon {
        color: #666;
        width: 20px;
        height: 20px;
      }
      &.infor-box {
        position: relative;
        .infor-num {
          display: inline-block;
          min-width: 10px;
          text-align: center;
          line-height: 1;
          white-space: nowrap;
          vertical-align: middle;
          border-radius: 10px;
          background-color: #ff6c60;
          color: #fff;
          font-size: 12px;
          padding: 3px 7px;
          position: absolute;
          top: 0px;
          right: -16px;
          z-index: 100;
        }
      }
      &.avatar-container.el-dropdown {
        width: 150px;
        margin-right: 0;
        overflow: hidden;
        color: #fff;
        position: relative;
        line-height: 34px;
        padding-left: 24px;
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 20px;
          vertical-align: top;
          position: absolute;
          left: 0;
          z-index: 99;
          // margin-right:8px;
        }
        .user-icon {
          width: 26px;
          height: 26px;
          position: absolute;
          left: 12px;
          top:4px;
          z-index: 99;
        }
      }
    }
  }
}
.el-dropdown-menu {
  .time-down {
    &:hover {
      background-color: #fff;
    }
    p.time {
      font-size: 12px;
      font-weight: bold;
      margin: 0 0 6px;
      padding: 0;
    }
  }
  .btn-box {
    .main-btn {
      float: right;
      margin-right: 6px;
    }
  }
}
</style>
