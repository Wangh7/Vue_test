<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px;">
      <switch></switch>
      <SideMenuCheck></SideMenuCheck>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>

import SideMenuCheck from './SideMenuCheck'

export default {
  name: 'Check',
  components: {SideMenuCheck}
}
</script>

<style scoped>

</style>
