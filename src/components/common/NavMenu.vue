<template>
  <el-menu
    :default-active="currentPath"
    router
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="min-width: 1000px;">
    <el-menu-item v-for="(item,i) in menus" :key="i" :index="item.path">
      {{ item.nameZh }}
    </el-menu-item>

    <el-menu-item style="float: right;" v-on:click="logoff">
      退出登录
    </el-menu-item>
    <el-menu-item style="float: right;">
      欢迎您，{{ $store.state.user.nickname }}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'NavMenu',
  computed: {
    menus () {
      return this.$store.state.menus
    },
    currentPath () {
      return '/' + this.$route.path.split('/')[1]
    }
  },
  methods: {
    logoff () {
      let _this = this
      _this.$axios.get('/logout').then(resp => {
        if (resp.data.code === 200) {
          // 前后端状态保持一致
          this.$store.commit('logoff')
          this.$router.replace({path: '/login'})
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
