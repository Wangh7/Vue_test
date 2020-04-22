<template>
  <div>
    <div>您在本站一共售卖了{{index.totalItem}}件商品，共帮您赚到了{{index.totalPrice}}元</div>
    <div>您已发布的商品中有{{index.totalSellF}}件商品未通过审核，{{index.totalSellN}}件商品待审核</div>
  </div>
</template>

<script>
export default {
  name: 'IndexSell',
  data () {
    return {
      index: ''
    }
  },
  mounted () {
    this.loadIndex()
  },
  methods: {
    loadIndex () {
      this.$axios.get('/items/index/sell').then(resp => {
        if (resp && resp.status === 200) {
          this.index = resp.data
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
