<template>
  <div>
    <el-form
      :model="form"
      ref="form"
      label-width="150px"
      class="demo-ruleForm"
      style="text-align: left">
      <!-- prop和v-model的名称需要一致 -->
      <el-form-item label="账户余额">
        <div>{{form.price}}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="moneyIn()">充值</el-button>
        <el-button type="warning" @click="moneyOut()">提现</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Price',
  data () {
    return {
      dialogFormVisible: false,
      form: {
        price: ''
      }
    }
  },
  mounted () {
    this.loadPrice()
  },
  methods: {
    // 利用axios发送get请求，接收到成功200代码后，把data数据替换为后端返回的数据
    // 利用data和template里相应元素双向绑定，实现页面动态渲染
    loadPrice () {
      let _this = this
      this.$axios.get('/user/single/price')
        .then(resp => {
          if (resp && resp.status === 200) {
            _this.form.price = resp.data.money.amount
          }
        })
    },
    moneyIn () {
      this.$axios.post('/user/single/price', {
        money: 10.23,
        status: '+'
      }).then()
      this.loadPrice()
    },
    moneyOut () {
      this.$axios.post('/user/single/price', {
        money: 1.44,
        status: '-'
      }).then()
      this.loadPrice()
    }
  }
}
</script>

<style scoped>

</style>
