import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 使用本地存储，判断是否有user 有就读出 没有清空 只要不清除缓存 就一直保持登录状态
export default new Vuex.Store({
  state: {
    user: {
      userId: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).userId,
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
      nickname: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).nickname
    },
    menus: []
  },
  mutations: {
    login (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
    logoff (state) {
      state.user = []
      window.localStorage.removeItem('user')
      state.menus = []
    },
    initMenu (state, menus) {
      state.menus = menus
    }
  }
})
