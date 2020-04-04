<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px;">
      <switch></switch>
      <SideMenuAdmin></SideMenuAdmin>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import SideMenuAdmin from './SideMenuAdmin'

export default {
  name: 'Admin',
  components: {SideMenuAdmin}
}
</script>

<style scoped>

</style>
