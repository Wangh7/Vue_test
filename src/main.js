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
axios.defaults.withCredentials = true
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
  if (to.matched.length === 0) {
    next({
      path: '/error/404'
    })
  }
  if (to.path.startsWith('/login')) {
    if (store.state.user.username) {
      axios.get('/authentication').then(resp => {
        if (resp.data.code === 200) {
          next({
            path: '/index'
          })
        } else {
          next()
        }
      })
    } else {
      next()
    }
  }
  if (to.meta.requireAuth) { /* 要去的路径是否需要登录 */
    if (store.state.user.username) { /* 存储里是否有user信息 */
      axios.get('/authentication').then(resp => {
        if (resp.data.code === 200) { /* 前后端都正确 */
          axios.get('/auth', {
            params: {
              url: to.path
            }
          }).then(resp => {
            if (resp.data.code === 200) {
              next()
            } else {
              next({
                path: '/error/401'
              })
            }
          })
        } else { /* 前端正确，后端错误 */
          next({
            path: '/login',
            query: {redirect: to.fullPath}
          })
        }
      })
    } else { /* 前后端都错误 */
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
  if (store.state.user.username) {
    initNavMenu(router, store)
  }
})

/* 初始化菜单 */
const initNavMenu = (router, store) => {
  if (store.state.menus.length > 0) {
    return
  }
  axios.get('/menu').then(resp => {
    if (resp && resp.status === 200) {
      let fmtRoutes = formatRoutes(resp.data.result)
      router.addRoutes(fmtRoutes)
      store.commit('initMenu', fmtRoutes)
    }
  })
}

/* 后端菜单数据转换 */
const formatRoutes = (routes) => {
  let fmtRoutes = []
  routes.forEach(route => {
    if (route.children) {
      route.children = formatRoutes(route.children)
    }
    let fmtRoute = {
      path: route.path,
      component: resolve => {
        require(['./components' + route.component + '.vue'], resolve)
      },
      name: route.name,
      nameZh: route.nameZh,
      meta: {
        requireAuth: true
      },
      children: route.children
    }
    fmtRoutes.push(fmtRoute)
  })
  return fmtRoutes
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: {App},
  template: '<App/>'
})
