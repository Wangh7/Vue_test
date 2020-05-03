<template>
  <div>
    <div>
      <span>您在本站一共审核了</span>
      <span style="font-size: 28px;font-weight: bold">{{index.totalCheck}}</span>
      <span>件商品</span>
    </div>
    <div>
      <span>今日待审核队列共</span>
      <span style="font-size: 28px;color: #d00;font-weight: bold">{{index.waitCheck}}</span>
      <span>件商品</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexCheck',
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
      this.$axios.get('/check/index').then(resp => {
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
