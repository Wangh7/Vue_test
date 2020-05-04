<template>
  <div>
    <el-divider>
      <i class="el-icon-arrow-up"></i>
    </el-divider>
    <el-row type="flex" justify="center" style="padding-top: 20px;">
      <el-col style="width: 1200px;">
        <el-link :underline="false">关于我们</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-popover
          placement="top"
          trigger="click">
          <img :src="'/static/index/aboutme.JPG'" style="width: 250px;">
          <el-link :underline="false" slot="reference">联系作者</el-link>
        </el-popover>
        <el-divider direction="vertical"></el-divider>
        <el-link :underline="false" href="http://nas.wangh7.com">友情链接</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link :underline="false">隐私政策</el-link>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="padding-top: 20px;">
      <el-col style="width: 1200px;">
        <el-divider/>
        <span style="color: #909399;font-size: smaller;">Copyright © 2019-2020 王浩潼 wangh7.com 版权所有</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>

</style>
