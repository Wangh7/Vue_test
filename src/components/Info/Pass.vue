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
        <el-form-item label="原密码" prop="oldPass">
          <el-input prefix-icon="el-icon-key" v-model="form.oldPass" type="password" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input prefix-icon="el-icon-key" v-model="form.newPass" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePass">
          <el-input prefix-icon="el-icon-key" v-model="form.rePass" type="password" placeholder="请确认新密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">修改密码</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>

import {isPassword} from '../../utils/validator'

export default {
  name: 'Pass',
  data () {
    let rePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      checked: true,
      form: {
        oldPass: '',
        newPass: ''
      },
      rules: {
        newPass: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {validator: isPassword}
        ],
        rePass: [
          {validator: rePassword}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/user/single/pass', {
              oldPass: this.form.oldPass,
              newPass: this.form.newPass
            })
            .then(resp => {
              if (resp.data.code === 200) {
                this.resetForm(formName)
                this.$alert(resp.data.message, '提示', {
                  confirmButtonText: '确定'
                })
              } else {
                this.$alert(resp.data.message, '提示', {
                  confirmButtonText: '确定'
                })
              }
            })
            .catch(failResponse => {
            })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
