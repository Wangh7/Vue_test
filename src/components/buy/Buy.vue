<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px;">
      <switch></switch>
      <SideMenuBuy></SideMenuBuy>
    </el-aside>
    <el-main>
      <goods class="goods-area"></goods>
    </el-main>
  </el-container>
</template>

<script>
import SideMenuBuy from './SideMenuBuy'
export default {
    name: 'Buy',
    components: {SideMenuBuy}
}
</script>

<style scoped>

</style>
