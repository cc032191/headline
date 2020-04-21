// 关于评论的api
import instance from '../utils/myaxios'
// 获取评论或评论回复
export function apigetcomments({
  type,
  source,
  offset
}) {
  return instance({
    url: '/comments',
    params: {
      type,
      source,
      offset,
      limit: '10'
    }
  })
}
// 发送评论
export function apisendcomments({
  target,
  content,
  artid
}) {
  return instance({
    url: '/comments',
    method: 'POST',
    data: {
      target,
      content,
      art_id: artid
    }
  })
}
