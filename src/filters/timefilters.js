// 导入vue
import Vue from 'vue'
// 导入dayjs
import dayjs from 'dayjs'
// 导入RelativeTime
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入语言包
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
// 全局注册
Vue.filter('timeData', function (value) {
  return dayjs().from(dayjs(value))
})
