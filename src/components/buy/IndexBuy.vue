<template>
  <div>
    <div>您在本站一共购买了{{index.totalItem}}件商品，共为您节省了{{index.totalPrice}}元</div>
    <div>您的购物车中共有{{index.totalBuyCar}}件商品即将到期，请及时处理</div>
    <div>您购买的商品中共有{{index.totalBought}}件商品即将到期，请及时消费</div>
  </div>

</template>

<script>
export default {
  name: 'IndexBuy',
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
      this.$axios.get('/items/index/buy').then(resp => {
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
