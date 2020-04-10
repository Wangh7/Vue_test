<template>
  <div>
    <el-form :model="form">
      <el-form-item>
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="sub">测试</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'SellEdit',
  data () {
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {
    sub () {
      this.$axios
        .get('/items/test', {
          params: {
            name: this.form.name
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
