// 关于频道的axios
import instance from '../utils/myaxios'

// 获取用户频道列表
export function apiGetchannel() {
  return instance({
    url: '/user/channels',
    method: 'GET'
  })
}
// 获取全部频道
export function apiGetAllchannel() {
  return instance({
    url: '/channels'
  })
}
// 封装一个重置频道的方法
export function apiresetchannel(channels) {
  return instance({
    url: '/user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })
}
