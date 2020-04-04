import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
// 导入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入字体样式
import './style/index.css'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
