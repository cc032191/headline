// 用来封装所有与文章相关的网络请求
import instance from '../utils/myaxios'
// 封装一个得到频道下文章的接口
export function apiGetarticle({
  channelid,
  timestamp
}) {
  return instance({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: {
      channel_id: channelid,
      timestamp: timestamp,
      with_top: 0
    }
  })
}

// 封装不喜欢文章的方法
export function apiDislike(artid) {
  return instance({
    url: '/article/dislikes',
    method: 'POST',
    data: {
      target: artid
    }
  })
}

// 封装举报文章的方法
export function apireport({
  artid,
  type
}) {
  return instance({
    url: '/article/reports',
    method: 'POST',
    data: {
      target: artid,
      type: type,
      remark: ''
    }
  })
}
// 获取文章详情
export function apigetactDetails(artid) {
  return instance({
    url: `/articles/${artid}`
  })
}
// 对文章点赞
export function apilikings(artid) {
  return instance({
    url: '/article/likings',
    method: 'POST',
    data: {
      target: artid
    }
  })
}
// 取消点赞
export function apidellikings(artid) {
  return instance({
    url: `/article/likings/${artid}`,
    method: 'DELETE'
  })
}
// 对文章不喜欢
export function apidislikes(artid) {
  return instance({
    url: '/article/dislikes',
    method: 'POST',
    data: {
      target: artid
    }
  })
}
// 取消对文章不喜欢
export function apideldislikes(artid) {
  return instance({
    url: `/article/dislikes/${artid}`,
    method: 'DELETE'
  })
}
// 收藏文章
export function apicollections(artid) {
  return instance({
    url: '/article/collections',
    method: 'POST',
    data: {
      target: artid
    }
  })
}
// 取消收藏
export function apidelcollections(artid) {
  return instance({
    url: `/article/collections/${artid}`,
    method: 'DELETE'
  })
}
