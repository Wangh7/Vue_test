<template>
  <body class="poster">
  <el-form
    class="register-container"
    label-position="left"
    label-width="0px"
    :model="registerForm"
    :rules="rules"
    ref="registerForm">
    <h3 class="register_title">用户注册</h3>
    <el-form-item prop="username">
      <el-input prefix-icon="el-icon-user" type="text" v-model="registerForm.username" auto-complete="off"
                placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input prefix-icon="el-icon-key" type="password" v-model="registerForm.password" auto-complete="off"
                placeholder="密码"
                show-password></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input prefix-icon="el-icon-key" type="password" v-model="registerForm.checkPass" auto-complete="off"
                placeholder="确认密码"
                show-password></el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input prefix-icon="el-icon-mobile-phone" type="text" v-model="registerForm.phone" auto-complete="off"
                placeholder="手机号码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-popover
        placement="top"
        trigger="click">
        <slide-verify
          ref="slideblock"
          @again="onAgain"
          @success="onSuccess"
          @fulfilled="onFulfilled"
          @fail="onFail"
          @refresh="onRefresh"
          :accuracy="5"
          :slider-text="'滑动验证'"
        ></slide-verify>
        <el-button :type="btStyle.type" style="width: 100%;" slot="reference">{{btStyle.name}}</el-button>
      </el-popover>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 30%;border: none" v-on:click="register('registerForm')">注册</el-button>
      <el-button type="info" style="width: 30%;border: none" @click="resetForm('registerForm')">重置</el-button>
      <el-button type="info" style="width: 30%;border: none" @click="$router.replace({path: '/login'})">返回</el-button>
    </el-form-item>
  </el-form>
  </body>
</template>

<script>

import {isPassword, isUsername, isPhone} from '../utils/validator'

export default {
  name: 'Register',
  data () {
    let rePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      checked: true,
      verify: false,
      btStyle: {
        type: '',
        name: '点我验证',
        icon: ''
      },
      registerForm: {
        username: '',
        password: '',
        phone: ''
      },
      loading: false,
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {validator: isUsername}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {validator: isPassword}
        ],
        checkPass: [
          {validator: rePassword}
        ],
        phone: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {validator: isPhone}
        ]
      }
    }
  },
  methods: {
    register (formName) {
      this.$refs[formName].validate((valid) => {
        if (!this.verify) {
          this.onForget()
        } else {
          if (valid) {
            let _this = this
            this.$axios
              .post('/register', {
                username: this.registerForm.username,
                password: this.registerForm.password,
                nickname: '用户',
                phone: this.registerForm.phone
              })
              .then(resp => {
                if (resp.data.code === 200) {
                  this.$alert('注册成功', '提示', {
                    confirmButtonText: '确定'
                  })
                  _this.$router.replace('/login')
                } else {
                  this.$alert(resp.data.message, '提示', {
                    confirmButtonText: '确定'
                  })
                }
              })
              .catch(failResponse => {
              })
          }
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$refs.slideblock.reset()
    },
    onSuccess () {
      this.verify = true
      this.btStyle.type = 'success'
      this.btStyle.name = '验证成功'
    },
    onFail () {
      this.verify = false
      this.btStyle.type = 'danger'
      this.btStyle.name = '验证失败'
    },
    onRefresh () {
      this.verify = false
      this.btStyle.type = ''
      this.btStyle.name = '点我验证'
    },
    onFulfilled () {
      this.verify = false
      this.btStyle.type = ''
      this.btStyle.name = '点我验证'
    },
    onForget () {
      this.verify = false
      this.btStyle.type = 'warning'
      this.btStyle.name = '你还没有通过验证(´･ω･｀)'
    }
  }
}
</script>

<style scoped>

  .poster {
    background: url("../assets/bg.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  body {
    margin: 0px;
  }

  .register-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .register_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

</style>
