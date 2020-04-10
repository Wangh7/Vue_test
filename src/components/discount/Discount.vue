<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px;">
      <switch></switch>
      <SideMenuDiscount></SideMenuDiscount>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import SideMenuDiscount from './SideMenuDiscount'

export default {
  name: 'Discount',
  components: {SideMenuDiscount}
}
</script>

<style scoped>

</style>
