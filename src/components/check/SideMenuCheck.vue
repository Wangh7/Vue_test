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
  name: 'SideMenuCheck',
  computed: {
    currentPath () {
      return '/check/' + this.$route.path.split('/')[2]
    }
  },
  data () {
    return {
      sidelist: [
        {name: '概览', index: '/check/index', icon: 'el-icon-menu'},
        {name: '审查商品', index: '/check/item', icon: 'el-icon-setting'},
        {name: '审查完成', index: '/check/checked', icon: 'el-icon-setting'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
