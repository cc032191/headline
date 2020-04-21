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
// 封装拉黑作者的方法
export function apishielding(autid) {
  return instance({
    url: '/user/blacklists',
    method: 'POST',
    data: {
      target: autid
    }
  })
}
// 关注
export function apiconcern(autid) {
  return instance({
    url: '/user/followings',
    method: 'POST',
    data: {
      target: autid
    }
  })
}
// 取消关注
export function apicancelconcern(autid) {
  return instance({
    url: `/user/followings/${autid}`,
    method: 'DELETE'
  })
}
// 获取用户自己信息
export function apigetusermsg() {
  return instance({
    url: '/user'
  })
}
// 获取用户个人资料
export function apigetuserinfo() {
  return instance({
    url: '/user/profile'
  })
}
// 上传头像
export function apiaddphoto(photo) {
  // 将头像放入fromData中
  var fd = new FormData()
  // 添加参数
  fd.append('photo', photo)
  return instance({
    url: '/user/photo',
    method: 'PATCH',
    data: fd
  })
}
// 编辑用户个人资料
export function apieditprofile({
  name,
  gender,
  birthday,
  intro
}) {
  return instance({
    url: '/user/profile',
    method: 'PATCH',
    data: {
      name,
      gender,
      birthday,
      intro
    }
  })
}
