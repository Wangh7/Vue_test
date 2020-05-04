<template>
  <el-menu
    :default-active="currentPath"
    class="el-menu-vertical-demo"
    style="min-height: 650px;"
    router>
    <el-menu-item v-for="(side,i) in sidelist" :key="i" :index="side.index">
      <i :class="side.icon"/>
      {{side.name}}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'SideMenuInfo',
  computed: {
    currentPath () {
      return '/info/' + this.$route.path.split('/')[2]
    }
  },
  data () {
    return {
      sidelist: [
        {name: '个人信息', index: '/info/profile', icon: 'el-icon-menu'},
        {name: '修改密码', index: '/info/pass', icon: 'el-icon-setting'},
        {name: '账户金额', index: '/info/price', icon: 'el-icon-setting'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
