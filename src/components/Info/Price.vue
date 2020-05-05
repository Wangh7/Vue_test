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
        <div>¥{{form.price}}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="moneyInVisible = true">充值</el-button>
        <el-button type="warning" @click="moneyOutVisible = true">提现</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="充值" :visible.sync="moneyInVisible">
      <div>
        <el-radio v-model="radio" label="10" border>¥10</el-radio>
        <el-radio v-model="radio" label="20" border>¥20</el-radio>
        <el-radio v-model="radio" label="50" border>¥50</el-radio>
        <el-radio v-model="radio" label="100" border>¥100</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moneyInVisible = false">取消</el-button>
        <el-button type="primary" @click="moneyIn(radio)">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提现" :visible.sync="moneyOutVisible">
      <div>
        <el-radio v-model="radio" label="10" border>¥10</el-radio>
        <el-radio v-model="radio" label="20" border>¥20</el-radio>
        <el-radio v-model="radio" label="50" border>¥50</el-radio>
        <el-radio v-model="radio" label="100" border>¥100</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moneyOutVisible = false">取消</el-button>
        <el-button type="primary" @click="moneyOut(radio)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Price',
  data () {
    return {
      moneyInVisible: false,
      moneyOutVisible: false,
      form: {
        price: ''
      },
      radio: ''
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
    moneyIn (money) {
      this.$axios.post('/user/single/price', {
        money: money,
        status: '+'
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$message({
            message: '充值成功',
            type: 'success',
            center: true
          })
        }
      })
      this.moneyInVisible = false
      setTimeout(this.loadPrice, 1000)
    },
    moneyOut (money) {
      this.$axios.post('/user/single/price', {
        money: money,
        status: '-'
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$message({
            message: '提现成功',
            type: 'success',
            center: true
          })
        }
      })
      this.moneyOutVisible = false
      setTimeout(this.loadPrice, 1000)
    }
  }
}
</script>

<style scoped>

</style>
