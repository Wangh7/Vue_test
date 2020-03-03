import Vue from 'vue'
import Router from 'vue-router'
import AppIndex from '@/components/home/Appindex'
import Login from '@/components/login'
import Home from '@/components/Home'
import Shop from '@/components/shop/Shop'
import Buy from '@/components/buy/Buy'
import Sell from '@/components/sell/Sell'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: Home,
      component: Home,
      redirect: '/index', // 仍然通过/index访问首页
      children: [
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/shop',
          name: 'Shop',
          component: Shop,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/buy',
          name: 'Buy',
          component: Buy,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/sell',
          name: 'Sell',
          component: Sell,
          meta: {
            requireAuth: true
          }
        }
      ]
    }
  ]
})
