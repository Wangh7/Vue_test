<template>
  <div>
    <nav-menu/>
    <el-row type="flex" justify="center">
      <el-col style="width: 1200px;min-height: 700px">
        <router-view/>
      </el-col>
    </el-row>
    <Footer/>
  </div>
</template>

<script>
import NavMenu from '@/components/common/NavMenu'
import Footer from '@/components/common/Footer'

export default {
  name: 'Home',
  components: {NavMenu, Footer}
}
</script>

<style scoped>

</style>
