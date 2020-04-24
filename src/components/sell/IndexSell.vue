<template>
  <div>
    <div>
      <span>您在本站一共售卖了</span>
      <span style="font-size: 28px;font-weight: bold">{{index.totalItem}}</span>
      <span>件商品，共帮您赚到了</span>
      <span style="font-size: 28px;font-weight: bold">{{index.totalPrice}}</span>
      <span>元</span>
    </div>
    <div>
      <span>您已发布的商品中有</span>
      <span style="font-size: 28px;color: #d00;font-weight: bold">{{index.totalSellF}}</span>
      <span>件商品未通过审核，</span>
      <span style="font-size: 28px;color: #d90;font-weight: bold">{{index.totalSellN}}</span>
      <span>件商品待审核</span>
    </div>
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
