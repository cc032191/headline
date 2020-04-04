// 封装所有与用户相关的网络请求
import instance from '../utils/myaxios'

// 登录
export function apiLogin({
  mobile,
  code
}) {
  return instance({
    url: '/authorizations',
    method: 'POST',
    data: {
      mobile: mobile,
      code: code
    }
  })
}
