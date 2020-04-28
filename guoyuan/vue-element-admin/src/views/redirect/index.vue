<script>
export default {
  beforeCreate() {
    const { params, query } = this.$route
    const { path } = params
    // console.log('path-----------', path)
    // console.log('query-----------', query)
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
