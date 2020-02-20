// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
// 设置反向代理 前端请求发送到8443/api
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8443/api'
// 全局注册 其他组件可通过this.$axios 发送数据
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
// 判断路径是否需要登录 需要：判断store是否存储user 存在放行 否则跳转登录页面 全局钩子
/* router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { /!* 要去的路径是否需要登录 *!/
    if (store.state.user.username) { /!* 存储里是否有user信息 *!/
      next() /!* 放行 *!/
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      }) /!* 跳转登录页面 *!/
    }
  } else {
    next()
  }
}) */

router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    if (store.state.user.username) {
      next({
        path: 'index'
        // query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  }
  if (to.meta.requireAuth) { /* 要去的路径是否需要登录 */
    if (store.state.user.username) { /* 存储里是否有user信息 */
      next() /* 放行 */
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      }) /* 跳转登录页面 */
    }
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: {App},
  template: '<App/>'
})
