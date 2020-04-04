// 封装操作localostarage的方法

// 存
export function localSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

// 取
export function localGet(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

// 删除
export function localRemove(key) {
  window.localStorage.removeItem(key)
}
