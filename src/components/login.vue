<template>
  <body class="poster">
  <el-form class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">系统登录</h3>
    <el-form-item>
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-form-item>
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 30%;border: none" v-on:click="login">登录</el-button>
      <el-button type="info" style="width: 30%;border: none" v-on:click="clear">重置</el-button>
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
        password: ''
      },
      responseResult: []
    }
  },
  methods: {
    login () {
      var _this = this
      console.log(this.$store.state)
      this.$axios
        .post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            _this.$store.commit('login', _this.loginForm) // 触发store中的login方法 把loginform对象传递给store中的user对象
            // var path = this.$route.query.redirect
            // this.$route.replace({path: path === '/' || path === undefined ? '/index' : path})
            // 获取登录前页面的路径并跳转，如果该路径不存在，则跳转到首页
            this.$router.replace({path: '/index'})
          }
        })
        .catch(failResponse => {
        })
    }
  }
}
</script>

<style>
  .poster{
    background: url("../assets/bg.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
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
