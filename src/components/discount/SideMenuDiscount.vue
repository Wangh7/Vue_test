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
  name: 'SideMenuDiscount',
  computed: {
    currentPath () {
      return '/discount/' + this.$route.path.split('/')[2]
    }
  },
  data () {
    return {
      sidelist: [
        // {name: '促销公告', index: '/discount/index', icon: 'el-icon-menu'},
        {name: '商品折扣', index: '/discount/item', icon: 'el-icon-setting'},
        {name: '时间折扣', index: '/discount/time', icon: 'el-icon-setting'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
