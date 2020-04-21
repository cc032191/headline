// 用来封装登录方法的插件
// 导入router
import router from '../router/index'
// 导入store
import store from '../store/index'
// 导入Toast
import {
  Toast
} from 'vant'
// 定义一个插件
const myplugin = {
  install(Vue) {
    // 给Vue添加一个全局方法
    Vue.prototype.$login = function () {
      // 得到用户的登录信息
      var token = store.state.userInfo.token
      // 判断用户token
      if (!token) {
        // 没有token则跳转到登录页面
        router.push('/checklogin')
        // 提示
        Toast.fail('你还没有登录')
        // 返回为登录的标识
        return false
      } else {
        // 有token的话可以执行后面的逻辑
        return true
      }
    }
  }
}
// 暴露出去
export default myplugin
