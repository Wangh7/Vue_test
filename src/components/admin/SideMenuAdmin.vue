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
  name: 'SideMenuAdmin',
  computed: {
    currentPath () {
      return '/admin/' + this.$route.path.split('/')[2]
    }
  },
  data () {
    return {
      sidelist: [
        // {name: '概览', index: '/admin/index', icon: 'el-icon-menu'},
        {name: '用户管理', index: '/admin/user', icon: 'el-icon-user'},
        {name: '角色管理', index: '/admin/role', icon: 'el-icon-key'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
