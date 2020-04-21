<template>
  <div>
    <!-- 回复评论组件 -->
    <van-popup
      :value="value"
      @input="v=>$emit('input',v)"
      position="bottom"
      :style="{ height: '70%' }"
    >
      <!-- 当前的评论 -->
      <van-cell title="当前评论" />
      <comment :item="commentlist" :showReply="false"></comment>
      <van-cell title="当前评论回复" />
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <comment
          :showReply="false"
          :item="item"
          v-for="(item, index) in commentreplylist"
          :key="index"
        ></comment>
      </van-list>
      <!-- 回复框组件 -->
      <leaveword :isindex="false" :commentlist="commentlist" @changevaluereply="changevaluereply"></leaveword>
    </van-popup>
  </div>
</template>

<script>
import leaveword from './leaveword'
import bus from '../../../utils/bus'
import comment from './comment'
import { apigetcomments } from '../../../api/comment'
export default {
  // value控制按钮的开关
  props: ['value'],
  data () {
    return {
      loading: false,
      finished: false,
      // 当前评论的数据
      commentlist: '',
      // 本次返回结果的最后一个评论id，作为请求下一页数据的offset参数，若本次无具体数据，则值为NULL
      last_id: null,
      // 所有评论或回复的最后一个id（截止offset值，小于此值的offset可以不用发送请求获取评论数据，已经没有数据），若无评论或回复数据，则值为NULL
      end_id: null,
      // 评论的回复
      commentreplylist: []
    }
  },
  components: {
    comment,
    leaveword
  },
  created () {
    // 得到bus数据
    bus.$on('passItem', item => {
      this.commentlist = item
      // 每次进入页面清空数据
      this.loading = false
      this.finished = false
      this.last_id = null
      this.end_id = null
      this.commentreplylist = []
    })
  },
  methods: {
    changevaluereply (value) {
      this.commentreplylist.unshift(value)
      // window.console.log(this.commentlist)
      this.commentlist.reply_count++
    },
    async onLoad () {
      // 获取评论回复
      // window.console.log(this.commentlist)
      const { data: res } = await apigetcomments({
        type: 'c',
        source: this.commentlist.com_id.toString(),
        offset: this.last_id
      })
      // window.console.log(res)
      this.commentreplylist.push(...res.data.results)
      // 给last_id重新赋值
      this.last_id = res.data.last_id
      // 给end_id重新赋值
      this.end_id = res.data.end_id
      // 当last_id=end_id时,表示没有数据
      if (this.last_id === this.end_id) {
        this.finished = true
      }
      // 修改加载状态
      this.loading = false
    }
  }
}
</script>

<style lang='less'>
.van-list {
  margin-bottom: 54px;
}
</style>
