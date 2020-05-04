<template>
  <body class="poster">
  <el-form
    class="login-container"
    label-position="left"
    label-width="0px"
    :model="loginForm"
    ref="loginForm">
    <h3 class="login_title">系统登录</h3>
    <el-form-item>
      <el-input prefix-icon="el-icon-user" type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input prefix-icon="el-icon-key" type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 30%;border: none" v-on:click="login">登录</el-button>
      <el-button type="info" style="width: 30%;border: none" @click="resetForm('loginForm')">重置</el-button>
      <el-button type="warning" stype="width: 30%;border: none" v-on:click="register">注册</el-button>
    </el-form-item>
  </el-form>
  </body>

  <!--el-card>
    username:<input type="text" v-model="loginForm.username" placeholder="please input"/>
    <br><br>
    password:<input type="password" v-model="loginForm.password" placeholder="please input"/>
    <br><br>
    <button v-on:click="login">login</button>
  </el-card-->
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      responseResult: []
    }
  },
  methods: {
    login () {
      let _this = this
      this.$axios
        .post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password,
          remember: this.loginForm.rememberMe
        })
        .then(resp => {
          if (resp.data.code === 200) {
            let data = resp.data.result
            _this.$store.commit('login', data)
            let path = this.$route.query.redirect
            // this.$router.replace({path: '/index'})
            this.$router.replace({path: path === '/' || path === undefined ? '/index' : path})
          } else {
            this.$alert(resp.data.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
        .catch(failResponse => {
        })
    },
    clear () {
      this.form = {
        username: '',
        password: ''
      }
    },
    register () {
      this.$router.replace({path: '/register'})
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
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

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

</style>
