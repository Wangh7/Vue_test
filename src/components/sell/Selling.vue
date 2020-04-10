<template>
  <div>
    <el-col style="width: 600px">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="礼品卡种类" prop="type">
          <el-select v-model="form.type" placeholder="请选择种类">
            <el-option v-for="(item,i) in types" :key="i"
                       :label="item.typeName"
                       :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="礼品卡卡号" prop="cardNum">
          <el-input v-model="form.cardNum" placeholder="请输入卡号"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡密码" prop="cardPass">
          <el-input v-model="form.cardPass" placeholder="请输入卡密"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡余额" prop="price">
          <el-input v-model="form.price" placeholder="请输入余额"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡到期日期" required>
          <el-form-item prop="date">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date"
                            style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即发布</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button type="warning" @click="test">测试</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>

// 数据验证器
import {isPriceVlidator} from '../../utils/validator'

let cTime = function () {
  let myDate = new Date()
  let hour = myDate.getHours() > 9 ? myDate.getHours() : '0' + myDate.getHours()
  let min = myDate.getMinutes() > 9 ? myDate.getMinutes() : '0' + myDate.getMinutes()
  let sec = myDate.getSeconds() > 9 ? myDate.getSeconds() : '0' + myDate.getSeconds()
  let year = myDate.getFullYear()
  let mon = myDate.getMonth() > 9 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1)
  let day = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate()
  let str = year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec
  console.log(str)
  return str
}
export default {
  name: 'Selling',
  data () {
    return {
      types: [],
      form: {
        name: '',
        type: '',
        price: '',
        date: '',
        cardNum: '',
        cardPass: ''
      },
      rules: {
        cardNum: [
          {required: true, message: '请输入礼品卡卡号', trigger: 'blur'}
        ],
        cardPass: [
          {required: true, message: '请输入礼品卡卡密', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择礼品卡种类', trigger: 'change'}
        ],
        price: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: isPriceVlidator}
        ],
        date: [
          {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
        ]
      }
    }
  },
  // 钩子函数
  mounted: function () {
    this.loadItemsType()
  },
  methods: {
    loadItemsType () {
      let _this = this
      this.$axios.get('/items/types').then(resp => {
        if (resp && resp.status === 200) {
          _this.types = resp.data
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/items/sell', {
              userId: this.$store.state.user.userId,
              managerId: '0',
              price: parseFloat(this.form.price),
              cardNum: this.form.cardNum,
              cardPass: this.form.cardPass,
              createTime: cTime(),
              dueTime: this.form.date + ' 00:00:00',
              itemType: {typeId: this.form.type},
              status: 'N'
            }).then(resp => {
            if (resp && resp.data.code === 200) {
              alert(resp.data.message)
              this.resetForm(formName)
            } else {
              alert(resp.data.message)
              return false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    test () {
      let myDate = new Date()
      let hour = myDate.getHours() > 9 ? myDate.getHours() : '0' + myDate.getHours()
      let min = myDate.getMinutes() > 9 ? myDate.getMinutes() : '0' + myDate.getMinutes()
      let sec = myDate.getSeconds() > 9 ? myDate.getSeconds() : '0' + myDate.getSeconds()
      let year = myDate.getFullYear()
      let mon = myDate.getMonth() > 9 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1)
      let day = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate()
      console.log(year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec)
    }
  }
}
</script>

<style scoped>

</style>
