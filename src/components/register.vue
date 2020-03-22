<template>
  <body class="poster">
  <el-form
    class="register-container"
    label-position="left"
    label-width="0px"
    :model="registerForm"
    ref="loginForm">
    <h3 class="register_title">用户注册</h3>
    <el-form-item>
      <el-input type="text" v-model="registerForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 30%;border: none" v-on:click="register">注册</el-button>
      <!--<el-button type="info" style="width: 30%;border: none" v-on:click="clear">重置</el-button>-->
      <el-button type="info" style="width: 30%;border: none" @click="resetForm('loginForm')">重置</el-button>
    </el-form-item>
  </el-form>
  </body>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      checked: true,
      registerForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    register () {
      let _this = this
      this.$axios
        .post('/register', {
          username: this.registerForm.username,
          password: this.registerForm.password,
          usertype: 'user'
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
