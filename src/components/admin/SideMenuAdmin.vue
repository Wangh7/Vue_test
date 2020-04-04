<template>
  <el-menu
    default-active="/admin/index"
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
  name: 'SideMenuAdmin',
  data () {
    return {
      sidelist: [
        {name: '概览', index: '/admin/index', icon: 'el-icon-menu'},
        {name: '用户管理', index: '/admin/user', icon: 'el-icon-setting'},
        {name: '角色管理', index: '/admin/role', icon: 'el-icon-setting'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
