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
import Register from '@/components/register'
import UserManager from '@/components/admin/UserManager'
import CheckItem from '@/components/check/CheckItem'
import Admin from '@/components/admin/Admin'
import IndexAdmin from '@/components/admin/IndexAdmin'
import RoleManager from '@/components/admin/RoleManager'
import Profile from '@/components/Info/Profile'
import Info from '@/components/Info/Info'
import Pass from '@/components/Info/Pass'
import NotFound from '@/components/error/NotFound'
import Forbidden from '@/components/error/Forbidden'
import UnAuthorized from '@/components/error/UnAuthorized'
import Check from '@/components/check/Check'
import IndexCheck from '@/components/check/IndexCheck'
import CheckedItem from '@/components/check/CheckedItem'
import Discount from '@/components/discount/Discount'
import IndexDiscount from '@/components/discount/IndexDiscount'
import ItemDiscount from '@/components/discount/ItemDiscount'
import TimeDiscount from '@/components/discount/TimeDiscount'
import Price from '@/components/Info/Price'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: '注册'
      }
    },
    {
      path: '/error/404',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '404'
      }
    },
    {
      path: '/error/403',
      name: 'Forbidden',
      component: Forbidden,
      meta: {
        title: '403'
      }
    },
    {
      path: '/error/401',
      name: 'UnAuthorized',
      component: UnAuthorized,
      meta: {
        title: '401'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/index', // 仍然通过/index访问首页
      children: [
        {
          path: '/check',
          name: 'Check',
          component: Check,
          redirect: '/check/index',
          children: [
            {
              path: '/check/index',
              name: 'IndexCheck',
              component: IndexCheck,
              meta: {
                title: '商品审核',
                requireAuth: true
              }
            },
            {
              path: '/check/item',
              name: 'CheckItem',
              component: CheckItem,
              meta: {
                title: '待审核',
                requireAuth: true
              }
            },
            {
              path: '/check/checked',
              name: 'CheckedItem',
              component: CheckedItem,
              meta: {
                title: '已审核',
                requireAuth: true
              }
            }
          ]
        },
        {
          path: '/discount',
          name: 'Discount',
          component: Discount,
          redirect: '/discount/item',
          children: [
            {
              path: '/discount/index',
              name: 'IndexDiscount',
              component: IndexDiscount,
              meta: {
                title: '折扣设置',
                requireAuth: true
              }
            },
            {
              path: '/discount/item',
              name: 'ItemDiscount',
              component: ItemDiscount,
              meta: {
                title: '商品折扣',
                requireAuth: true
              }
            },
            {
              path: '/discount/time',
              name: 'TimeDiscount',
              component: TimeDiscount,
              meta: {
                title: '时间折扣',
                requireAuth: true
              }
            }
          ]
        },
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex,
          meta: {
            title: '首页',
            requireAuth: true
          }
        },
        {
          path: '/info',
          name: 'Info',
          component: Info,
          redirect: '/info/profile',
          children: [
            {
              path: '/info/profile',
              name: 'Profile',
              component: Profile,
              meta: {
                title: '个人中心',
                requireAuth: true
              }
            },
            {
              path: '/info/pass',
              name: 'Pass',
              component: Pass,
              meta: {
                title: '修改密码',
                requireAuth: true
              }
            },
            {
              path: '/info/price',
              name: 'Price',
              component: Price,
              meta: {
                title: '账户余额',
                requireAuth: true
              }
            }
          ]
        },
        {
          path: '/shop',
          name: 'Shop',
          component: Shop,
          meta: {
            title: '商品大厅',
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
                title: '我要购买',
                requireAuth: true
              }
            },
            {
              path: '/buy/buying',
              name: 'Buying',
              component: Buying,
              meta: {
                title: '立即结算',
                requireAuth: true
              }
            },
            {
              path: '/buy/bought',
              name: 'Bought',
              component: Bought,
              meta: {
                title: '我已购买',
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
                title: '我要出售',
                requireAuth: true
              }
            },
            {
              path: '/sell/selling',
              name: 'Selling',
              component: Selling,
              meta: {
                title: '立即发布',
                requireAuth: true
              }
            },
            {
              path: '/sell/sold',
              name: 'Sold',
              component: Sold,
              meta: {
                title: '我已售出',
                requireAuth: true
              }
            }
          ]
        },
        {
          path: '/admin',
          name: 'Admin',
          component: Admin,
          redirect: '/admin/user',
          children: [
            {
              path: '/admin/index',
              name: 'IndexAdmin',
              component: IndexAdmin,
              meta: {
                title: '用户管理',
                requireAuth: true
              }
            },
            {
              path: '/admin/user',
              name: 'UserManager',
              component: UserManager,
              meta: {
                title: '用户管理',
                requireAuth: true
              }
            },
            {
              path: '/admin/role',
              name: 'RoleManager',
              component: RoleManager,
              meta: {
                title: '角色管理',
                requireAuth: true
              }
            }
          ]
        }
      ]
    }
  ]
})
