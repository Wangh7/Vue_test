<template>
  <div>
    404 Not found
    <br>
    <span id="num">{{count}}</span>秒后<a href="/index">返回首页</a>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      count: ''
    }
  },
  created () {
    this.goSec()
  },
  methods: {
    goSec () {
      let TIME_COUNT = 3
      if (!this.timer) {
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.$router.replace({path: '/index'})
          }
        }, 1000)
      }
    }
  }
}
</script>

<style scoped>

</style>
