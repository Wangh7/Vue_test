<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px;">
      <switch></switch>
      <SideMenu></SideMenu>
    </el-aside>
    <el-main>
      <goods class="goods-area"></goods>
    </el-main>
  </el-container>
</template>

<script>
import SideMenu from './SideMenu'
import goods from './Goods'
export default {
    name: 'Shop',
    components: {SideMenu, goods}
}
</script>

<style scoped>
  .goods-area {
    margin-left: auto;
    margin-right: auto;
  }
</style>
