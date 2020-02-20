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
    <a href="#nowhere" style="color: #222;float: right;padding: 20px;">更多功能</a>
  </el-menu>
</template>

<script>
export default {
    name: 'NavMenu',
    data (){
      return {
        navList: [
          {name: '/index', navItem: '浏览大厅'},
          {name: '/buy', navItem: '我买到的'},
          {name: '/sell', navItem: '我卖出的'},
          {name: '/info', navItem: '个人信息'}

        ]
      }
    }
}
</script>

<style scoped>

</style>
