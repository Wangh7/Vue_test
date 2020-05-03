<template>
    <div>
      <nav-menu/>
      <el-row type="flex" justify="center">
        <el-col style="width: 1200px">
          <router-view/>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import NavMenu from '@/components/common/NavMenu'

export default {
  name: 'Home',
  components: {NavMenu}
}
</script>

<style scoped>

</style>
