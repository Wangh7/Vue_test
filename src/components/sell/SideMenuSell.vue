<template>
  <el-menu
    :default-active="currentPath"
    class="el-menu-vertical-demo"
    router>
    <el-menu-item v-for="(side,i) in sidelist" :key="i" :index="side.index">
      <i :class="side.icon"/>
      {{side.name}}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'SideMenuSell',
  computed: {
    currentPath () {
      return '/sell/' + this.$route.path.split('/')[2]
    }
  },
  data () {
    return {
      sidelist: [
        {name: '概览', index: '/sell/index', icon: 'el-icon-menu'},
        {name: '我要发布', index: '/sell/selling', icon: 'el-icon-setting'},
        {name: '我已卖出', index: '/sell/sold', icon: 'el-icon-setting'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
