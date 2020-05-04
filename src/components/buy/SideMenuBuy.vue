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
  name: 'SideMenuBuy',
  computed: {
    currentPath () {
      return '/buy/' + this.$route.path.split('/')[2]
    }
  },
  data () {
    return {
      sidelist: [
        {name: '概 览', index: '/buy/index', icon: 'el-icon-menu'},
        {name: '立即结算', index: '/buy/buying', icon: 'el-icon-setting'},
        {name: '我已购买', index: '/buy/bought', icon: 'el-icon-setting'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
