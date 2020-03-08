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
        <el-form-item label="礼品卡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡种类" prop="type">
          <el-select v-model="form.type" placeholder="请选择种类">
            <el-option label="京东E卡" value="jd"></el-option>
            <el-option label="苏宁易购" value="su"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="礼品卡面额" prop="oldPrice">
          <el-input v-model="form.oldPrice" placeholder="请输入面额"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡售价" prop="newPrice">
          <el-input v-model="form.newPrice" placeholder="请输入售价"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡到期时间" required>
          <el-col :span="10">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                              style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">-</el-col>
          <el-col :span="12">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="form.date2"
                              style="width: 100%;" value-format="HH:mm:ss"></el-time-picker>
            </el-form-item>
          </el-col>
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

export default {
  name: 'Selling',
  data () {
    return {
      form: {
        name: '',
        type: '',
        oldPrice: '',
        newPrice: '',
        date1: '',
        date2: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入礼品卡名称', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择礼品卡种类', trigger: 'change'}
        ],
        oldPrice: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: isPriceVlidator}
        ],
        newPrice: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: isPriceVlidator}
        ],
        date1: [
          {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
        ],
        date2: [
          {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/items', {
              userId: '1',
              oldPrice: parseFloat(this.form.oldPrice),
              newPrice: parseFloat(this.form.newPrice),
              itemName: this.form.name,
              image: '../../',
              dueDate: this.form.date1 + ' ' + this.form.date2
            }).then(resp => {
            if (resp && resp.status === 200) {
              alert('提交成功')
            } else {
              alert('提交失败')
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
      console.log(this.form.date1 + ' ' + this.form.date2)
    }
  }
}
</script>

<style scoped>

</style>
