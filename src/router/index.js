import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '../views/login/index.vue'
// 导入主页
import Index from '../views/index/index.vue'

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
  // 首页路由
  {
    path: '/index',
    component: Index
  }
]

const router = new VueRouter({
  routes
})

export default router
