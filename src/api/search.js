// 搜索之内的请求
import instance from '../utils/myaxios'

// 获取联想建议（自动补全）
export function apiGetsugges(value) {
  return instance({
    url: `/suggestion?q=${value}`
  })
}
// 获取搜索结果
export function apiGetsearch({
  page,
  perpage,
  q
}) {
  return instance({
    url: '/search',
    params: {
      page,
      per_page: perpage,
      q
    }
  })
}
