<template>
  <div class="leaveword">
    <van-search
      v-model="value"
      show-action
      placeholder="写评论"
      @search="onSearch"
      left-icon
      :class="['van_search',isindex?'van_search_90':'van_search_100']"
      shape="round"
    >
      <template #action>
        <div @click="onSearch">发送</div>
      </template>
    </van-search>
    <div v-if="isindex">
      <van-icon name="star" class="van_icon" v-if="artlist.is_collected" @click="delcollections" />
      <van-icon name="star-o" class="van_icon" v-else @click="collections" />
    </div>
  </div>
</template>

<script>
import { apicollections, apidelcollections } from '../../../api/article'
import { apisendcomments } from '../../../api/comment'
export default {
  props: ['artlist', 'isindex', 'commentlist'],
  data () {
    return {
      value: '',
      // 评论的内容
      valuelist: [],
      // 评论回复的内容
      valuereplylist: []
    }
  },
  methods: {
    // 发送评论
    async onSearch () {
      // 当isindex为true时,执行文章评论的逻辑,为false时,执行的是评论回复的逻辑
      // window.console.log(this.artlist)
      // window.console.log(this.value)
      if (this.isindex === true) {
        // 执行的是文章评论的逻辑
        const { data: res } = await apisendcomments({
          target: this.$route.query.artid,
          content: this.value,
          artid: null
        })
        // window.console.log(res)
        // 评论的数据保存起来,传给父组件
        this.valuelist = res.data.new_obj
        this.$emit('changgevalue', this.valuelist)
        // 清空输入框
        this.value = ''
      } else {
        // 执行的是评论回复的逻辑
        // window.console.log(this.commentlist.com_id.toString())
        const { data: res } = await apisendcomments({
          target: this.commentlist.com_id.toString(),
          content: this.value,
          artid: this.$route.query.artid
        })
        // window.console.log(res)
        // 评论的回复数据保存起来,传给父组件
        this.valuereplylist = res.data.new_obj
        this.$emit('changevaluereply', this.valuereplylist)
        // 清空输入框
        this.value = ''
      }
    },
    // 收藏文章
    async collections () {
      await apicollections(this.artlist.art_id)
      this.$parent.artlist.is_collected = true
      // this.$parent.getartlist()
    },
    // 取消收藏文章
    async delcollections () {
      await apidelcollections(this.artlist.art_id)
      this.$parent.artlist.is_collected = false
      // this.$parent.getartlist()
    }
  }
}
</script>

<style lang='less'>
.leaveword {
  display: flex;
  align-items: center;
  background-color: #3194ff;
  .van_search {
    background-color: #3194ff;
    .van-search__action {
      color: #fff;
    }
  }
  .van_search_90 {
    width: 90%;
  }
  .van_search_100 {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
  .van_icon {
    color: #fff;
    font-size: 20px;
    margin-left: 5px;
  }
  .van_icon_star {
    color: #fff;
  }
}
</style>
