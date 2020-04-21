<template>
  <div>
    <!-- 文章组件 -->
    <van-cell>
      <template #title>
        <!-- 评论区 -->
        <div class="comment">
          <div class="headbox">
            <!-- 头像 -->
            <div class="headimg">
              <img :src="item.aut_photo" alt />
            </div>
            <!-- 名字 -->
            <div class="comment_name">{{item.aut_name}}</div>
            <div class="likebox">
              <van-icon name="like" class="likebox_icon" />
              <span>{{item.like_count}}</span>
            </div>
          </div>
          <!-- 评论内容 -->
          <div class="commentbox">{{item.content}}</div>
          <!-- 时间&回复 -->
          <div class="timereply">
            <div class="time">{{item.pubdate | timeData}}</div>
            <div class="reply">
              <van-button
                round
                type="default"
                class="reply_btn"
                @click="changereply"
                v-if="showReply"
              >回复{{item.reply_count}}</van-button>
            </div>
          </div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 导入bus
import bus from '../../../utils/bus'
export default {
  // item传过来的单个评论数据
  // showReply控制回复按钮的显示与隐藏   文章回复页面显示   评论回复页面隐藏
  props: ['item', 'showReply'],
  data () {
    return {

    }
  },
  methods: {
    // 打开回复评论的按钮
    changereply () {
      // 打开回复按钮
      this.$emit('changereply', true)
      // 顺便把当前评论的信息传入bus中
      bus.$emit('passItem', this.item)
    }
  }
}
</script>

<style lang='less'>
.comment {
  .headbox {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .headimg {
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .comment_name {
      flex: 1;
      font-size: 16px;
      line-height: 16px;
      padding-bottom: 10px;
      margin-left: 10px;
    }
    .likebox {
      display: flex;
      align-items: center;
      .likebox_icon {
        font-size: 25px;
        color: #ccc;
      }
    }
  }
  .commentbox {
    padding-left: 49px;
  }
  .timereply {
    display: flex;
    align-items: center;
    padding-left: 49px;
    .time {
      padding-top: 10px;
    }
    .reply {
      margin-left: 10px;
      margin-top: 10px;
      .reply_btn {
        height: 30px;
        line-height: 25px;
        background-color: #ccc;
      }
    }
  }
}
</style>
