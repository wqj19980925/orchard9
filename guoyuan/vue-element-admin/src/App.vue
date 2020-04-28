<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  beforeDestroy() {},
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  methods: {
    beforeunloadHandler() {
    }
  }
}
</script>
<style rel="stylesheet/scss" lang='scss'>
#app {
  min-width: 1200px;
}
</style>
