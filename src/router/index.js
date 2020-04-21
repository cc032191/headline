import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '../views/login/index.vue'
// 导入主页
import Index from '../views/index/index.vue'
// 导入底部
import Layout from '../views/layout/index.vue'
// 导入主体
import My from '../views/my/index.vue'
// 导入搜索页面
import Search from '../views/search/index.vue'
// 搜索结果页面
import Searchques from '../views/searchques/index.vue'
// 导入详情页面
import Detail from '../views/detail/index.vue'
// 导入用户详情页面
import Userinfo from '../views/userInfo/index.vue'
// 小智机器人
import Robot from '../views/robot/index.vue'

Vue.use(VueRouter)

const routes = [
  // 设置重定向
  {
    path: '/',
    redirect: 'index'
  },
  // 登录路由
  {
    path: '/login',
    component: Login
  },
  // 验证路由
  {
    path: '/checklogin',
    component: Login
  },
  // 设置底部layout
  {
    path: '/layout',
    component: Layout,
    children: [
      // 首页路由
      {
        path: '/index',
        component: Index
      },
      // 主体内容my路由
      {
        path: '/my',
        component: My
      },
      // 搜索路由
      {
        path: '/search',
        component: Search
      }
    ]
  },
  // 搜索结果页面
  {
    path: '/searchques',
    component: Searchques
  },
  // 文章详情页面
  {
    path: '/detail',
    component: Detail
  },
  // 用户详情页面
  {
    path: '/userinfo',
    component: Userinfo
  },
  // 小智机器人
  {
    path: '/robot',
    component: Robot
  }
]

const router = new VueRouter({
  routes
})

export default router
