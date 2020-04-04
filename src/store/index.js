import Vue from 'vue'
import Vuex from 'vuex'

// 导入操作local的方法
import {
  localSet,
  localGet
} from '../utils/mylocal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用来保存用户token信息
    // 默认打开页面时,先取出 token,没有就位空
    userInfo: localGet('userInfo') || {}
  },
  mutations: {
    setToken: function (state, payload) {
      // token保存到vuex中
      state.userInfo = payload
      // token信息保存到本地
      localSet('userInfo', payload)
    }
  }
})
