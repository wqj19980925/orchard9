<template>
  <div class="app-container">
    <!-- <router-link tag='a' :to="'www.baidu.com'" >跳转demo</router-link> -->
  </div>
</template>
<script >
import {
  getToken
} from '@/utils/auth' // getToken from cookie

export default {
  name: 'dataPage',
  data () {
    return {}
  },
  beforeCreate () {
    var to = getToken()
    // var toekn = encodeURIComponent(to)
    // http://gy.bluearp.com/public/dataTable/index4.html
    window.location.href = 'http://gy.bluearp.com/public/dataTable?'+to
  }
}
</script>
