<template>
  <div>
    <div>
      <span>您在本站一共购买了</span>
      <span style="font-size: 28px;font-weight: bold">{{index.totalItem}}</span>
      <span>件商品，共为您节省了</span>
      <span style="font-size: 28px;font-weight: bold">{{index.totalPrice}}</span>
      <span>元</span>
    </div>
    <div>
      <span>您的购物车中共有</span>
      <span style="font-size: 28px;color: #d00;font-weight: bold">{{index.totalBuyCar}}</span>
      <span>件商品即将到期，请及时处理</span>
    </div>
    <div>
      <span>您购买的商品中共有</span>
      <span style="font-size: 28px;color: #d90;font-weight: bold">{{index.totalBought}}</span>
      <span>件商品即将到期，请及时消费</span>
    </div>
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
