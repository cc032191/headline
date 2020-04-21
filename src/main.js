import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
// 导入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入字体样式
import './style/index.css'
// 导入timefilter过滤器
import './filters/timefilters'
// 导入自己得插件
import myplugin from './utils/myplugin'
// 注册自己得方法
Vue.use(myplugin) // 这里相当于调用myplugin的install方法
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
