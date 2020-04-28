<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    imgUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { imgUrl, title } = context.props
    const vnodes = []
    const baseUrl = process.env.BASE_API
    if (imgUrl) {
      // vnodes.push(<svg-icon icon-class={imgUrl} />);
      vnodes.push(<img src={baseUrl + '/' + imgUrl} style='width:20px;height:20px;margin-right:10px;'/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>)
    }
    return vnodes
  }
}
</script>
