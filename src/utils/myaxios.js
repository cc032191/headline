// 封装axios
import axios from 'axios'
// 导入store
import store from '../store/index'
// 导入json-bigint
import JSONBigInt from 'json-bigint'

// 创建一个axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
  // transformResponse:这个配置会在服务器返回数据给axios时起作用
  transformResponse: [
    function (data) {
      try {
        // data就是服务器返回给axios的数据(JSON格式的字符串)
        return JSONBigInt.parse(data)
      } catch (error) {
        return data
      }
    }
  ]
})
// token过期 需要在请求头里面加上refresh_token,所以创建新的axios实例来更新token
const instanceone = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/'
})

// 设置拦截器
// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 判断token是否存在,存在就加到请求头中,不存在什么都不做
    if (store.state.userInfo.token) {
      config.headers.Authorization = 'Bearer ' + store.state.userInfo.token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) { // 响应失败的回调函数
    // window.console.dir(error)
    // 得到错误的状态  判断token过期
    // token过期应该把refresh_token发送给服务器获取新的token
    if (error.response.status === 401) {
      // 得到refresh_token
      var refreshtoken = store.state.userInfo.refresh_token
      // 将refresh_token发送给服务器得到新的token
      const {
        data: res
      } = await instanceone({
        url: '/authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${refreshtoken}`
        }
      })
      // window.console.log(res)
      // 得到新的token
      var newToken = res.data.token
      // window.console.log(newToken)
      // 用新的token覆盖过期的token
      store.commit('setToken', {
        token: newToken,
        refresh_token: refreshtoken
      })
      // 重新发送未完成的请求,并且将接受到的结果返回给外界
      return instance(error.config)
    }
    return Promise.reject(error)
  }
)

// 将对象暴露出去
export default instance
