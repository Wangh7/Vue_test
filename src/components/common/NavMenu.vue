<template>
  <el-menu
    :default-active="'/index'"
    router
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="min-width: 1000px;">
    <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
      {{ item.navItem }}
    </el-menu-item>

    <el-menu-item style="float: right;" v-on:click="logoff">
      退出登录
    </el-menu-item>
    <el-menu-item style="float: right;">
      欢迎您，{{ $store.state.user.username }}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      navList: [
        {name: '/index', navItem: '主页'},
        {name: '/shop', navItem: '浏览大厅'},
        {name: '/buy', navItem: '我买到的'},
        {name: '/sell', navItem: '我卖出的'},
        {name: '/info', navItem: '个人信息'}

      ]
    }
  },
  methods: {
    logoff () {
      this.$store.commit('logoff')
      this.$router.replace({path: '/login'})
    }
  }
}
</script>

<style scoped>

</style>
