<template>
  <el-menu
    default-active="all"
    @select="handleSelect"
    style="min-height: 650px;">
    <div>请选择种类</div>
    <el-menu-item :index="'all'">所有种类</el-menu-item>
    <el-menu-item v-for="(type,i) in types" :key="i" :index="type.typeCode">{{type.typeName}}</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'SideMenu',
  data () {
    return {
      types: [],
      typeCode: ''
    }
  },
  mounted () {
    this.loadTypes()
  },
  methods: {
    loadTypes () {
      let _this = this
      this.$axios.get('/items/types').then(resp => {
        if (resp && resp.status === 200) {
          _this.types = resp.data
        }
      })
    },
    handleSelect (index) {
      this.typeCode = index
      this.$emit('indexSelect')
    }
  }
}
</script>

<style scoped>

</style>
