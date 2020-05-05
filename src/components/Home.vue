<template>
  <div>
    <nav-menu/>
    <el-row type="flex" justify="center">
      <el-col style="float: left;">
        <div class="img"/>
        <!--<img style="float: right;" :src="'../static/index/welcome.png'">-->
      </el-col>
      <el-col style="min-width: 1200px;min-height: 700px;">
        <div style="height: 100%;border-left: 1px solid #DCDFE6;border-right: 1px solid #DCDFE6">
          <router-view/>
        </div>
      </el-col>
      <el-col style="float: right;">
        <div class="img"/>
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
  .img{
    /*background: url("/static/index/welcome.png") repeat-y;*/
    /*background: linear-gradient(180deg, #F2F6FC 0%, #fff 100%);*/
    height: 100%;
    width: 100%;
    float: left;
  }
</style>
