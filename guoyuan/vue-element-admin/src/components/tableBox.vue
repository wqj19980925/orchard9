<template>
  <div class="box box-solid">
    <div class="box-body">
      <table
        class
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
      >
        <tbody >
          <slot name="theader"/>
          <!-- <slot name="nodata" ></slot> -->
          <slot
            v-for="( item ) in listData"
            :item="item"
            name="row"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // creat(){
    // console.log("this--listData",this.listData);
    // 抛出data完整对象，以便父组件使用
    // this.$emit("afterFetchData", this.listData);
    // }
  }
}
</script>
<style>
</style>

