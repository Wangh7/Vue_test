<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px;">
      <switch></switch>
      <SideMenuInfo></SideMenuInfo>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import SideMenuInfo from './SideMenuInfo'

export default {
  name: 'Info',
  components: {SideMenuInfo}
}
</script>

<style scoped>

</style>
