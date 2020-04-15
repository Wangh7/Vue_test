<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px;">
      <switch></switch>
      <SideMenu @indexSelect="listByTypeId" ref="sideMenu"></SideMenu>
    </el-aside>
    <el-main>
      <goods class="goods-area" ref="goodsArea"></goods>
    </el-main>
  </el-container>
</template>

<script>
import SideMenu from './SideMenu'
import goods from './Goods'

export default {
  name: 'Shop',
  components: {SideMenu, goods},
  methods: {
    listByTypeId () {
      let _this = this
      let typeId = this.$refs.sideMenu.typeCode
      let url = '/items/' + typeId
      this.$axios.get(url).then(resp => {
        if (resp && resp.status === 200) {
          _this.$refs.goodsArea.items = resp.data
        }
      })
    }
  }
}
</script>

<style scoped>
  .goods-area {
    margin-left: auto;
    margin-right: auto;
  }
</style>
