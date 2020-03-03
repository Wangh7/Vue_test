import Vue from 'vue'
import Router from 'vue-router'
import AppIndex from '@/components/home/Appindex'
import Login from '@/components/login'
import Home from '@/components/Home'
import Shop from '@/components/shop/Shop'
import Buy from '@/components/buy/Buy'
import Sell from '@/components/sell/Sell'
import IndexSell from '@/components/sell/IndexSell'
import Selling from '@/components/sell/Selling'
import Sold from '@/components/sell/Sold'
import IndexBuy from '@/components/buy/IndexBuy'
import Bought from '@/components/buy/Bought'
import Buying from '@/components/buy/Buying'

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
          path: '/info',
          name: 'Info',
          component: Selling,
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
          redirect: '/buy/index',
          children: [
            {
              path: '/buy/index',
              name: 'IndexBuy',
              component: IndexBuy,
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/buy/buying',
              name: 'Buying',
              component: Buying,
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/buy/bought',
              name: 'Bought',
              component: Bought,
              meta: {
                requireAuth: true
              }
            }
          ]
        },
        {
          path: '/sell',
          name: 'Sell',
          component: Sell,
          redirect: '/sell/index',
          children: [
            {
              path: '/sell/index',
              name: 'IndexSell',
              component: IndexSell,
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/sell/selling',
              name: 'Selling',
              component: Selling,
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/sell/sold',
              name: 'Sold',
              component: Sold,
              meta: {
                requireAuth: true
              }
            }
          ]
        }
      ]
    }
  ]
})
