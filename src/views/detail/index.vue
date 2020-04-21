<template>
  <div class="detail">
    <!-- 导航 -->
    <van-nav-bar title="文章详情" left-arrow @click-left="onClickLeft" />
    <!-- 内容区 -->
    <div class="content">
      <!-- 标题 -->
      <div class="title">
        <h1>{{artlist.title}}</h1>
      </div>
      <!-- 作者区域 -->
      <van-sticky>
        <div class="author">
          <div class="headportrait">
            <img :src="artlist.aut_photo" />
          </div>
          <div class="author-content">
            <div class="username">{{artlist.aut_name}}</div>
            <div class="acttime">{{artlist.pubdate | timeData}}</div>
          </div>
          <!-- 按钮 -->
          <div class="author_btn">
            <van-button
              icon="plus"
              type="info"
              v-if="!artlist.is_followed"
              @click="concern(artlist.aut_id)"
              :loading="isLoading"
            >关注</van-button>
            <van-button type="info" @click="cancelconcern(artlist.aut_id)" v-else>已关注</van-button>
          </div>
        </div>
      </van-sticky>
      <!-- 文章内容 -->
      <van-cell class="actcomment">
        <template #title>
          <div v-html="artlist.content"></div>
        </template>
      </van-cell>
      <!-- 点赞不喜欢区域 -->
      <div class="btnbox">
        <!-- 点赞 -->
        <van-button
          round
          plain
          icon="like"
          type="danger"
          @click="dellikings(artlist.art_id)"
          v-if="artlist.attitude===1"
        >点赞</van-button>
        <van-button round icon="like" type="default" @click="likings(artlist.art_id)" v-else>点赞</van-button>
        <!-- 不喜欢 -->
        <van-button
          round
          plain
          icon="delete"
          type="danger"
          @click="deldislikes(artlist.art_id)"
          v-if="artlist.attitude===0"
        >不喜欢</van-button>
        <van-button round icon="delete" type="default" @click="dislikes(artlist.art_id)" v-else>不喜欢</van-button>
      </div>
      <!-- 猜你喜欢 -->
      <van-divider class="divider">猜你喜欢</van-divider>
      <!-- 评论区域 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="comment"
      >
        <comment
          :item="item"
          v-for="(item, index) in commentslist"
          :key="index"
          @changereply="v=>show=v"
          :showReply="true"
        ></comment>
      </van-list>
      <!-- 底部区域 -->
      <div class="leaveword">
        <leaveword :artlist="artlist" :isindex="true" @changgevalue="changgevalue"></leaveword>
      </div>
    </div>
    <reply v-model="show"></reply>
  </div>
</template>

<script>
// 导入评论组件
import reply from './com/reply'
import comment from './com/comment'
import leaveword from './com/leaveword'
import { apigetactDetails, apilikings, apidellikings, apidislikes, apideldislikes } from '../../api/article'
import { apigetcomments } from '../../api/comment'
import { apiconcern, apicancelconcern } from '../../api/user'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      // 文章详情
      artlist: [],
      // 文章id
      artid: '',
      // 加载动画
      isLoading: false,
      // 本次返回结果的最后一个评论id，作为请求下一页数据的offset参数，若本次无具体数据，则值为NULL
      last_id: null,
      // 所有评论或回复的最后一个id（截止offset值，小于此值的offset可以不用发送请求获取评论数据，已经没有数据），若无评论或回复数据，则值为NULL
      end_id: null,
      // 评论的内容
      commentslist: [],
      // 控制评论组件的显示与隐藏
      show: false
    }
  },
  components: {
    comment,
    leaveword,
    reply
  },
  created () {
    // 获取文章id
    this.artid = this.$route.query.artid
    this.getartlist()
  },
  methods: {
    // 新增加的评论放到评论数组中
    changgevalue (value) {
      this.commentslist.unshift(value)
    },
    // 获取文章详情
    async getartlist () {
      const { data: res } = await apigetactDetails(this.artid)
      // window.console.log(res)
      this.artlist = res.data
    },
    // 返回到上一页
    onClickLeft () {
      this.$router.back()
    },
    // 上啦刷新
    async onLoad () {
      // 获取评论或评论回复
      const { data: res } = await apigetcomments({
        type: 'a',
        source: this.artid,
        offset: this.last_id
      })
      // window.console.log(res)
      this.commentslist.push(...res.data.results)
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
    },
    // 关注
    async concern (id) {
      this.isLoading = true
      await apiconcern(id)
      this.artlist.is_followed = true
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    // 取消关注
    async cancelconcern (id) {
      this.isLoading = true
      await apicancelconcern(id)
      this.artlist.is_followed = false
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    // 点赞
    async likings (id) {
      await apilikings(id)
      this.artlist.attitude = 1
    },
    // &取消点赞
    async dellikings (id) {
      await apidellikings(id)
      this.artlist.attitude = -1
    },
    // 不喜欢
    async dislikes (id) {
      await apidislikes(id)
      this.artlist.attitude = 0
    },
    // 取消不喜欢
    async deldislikes (id) {
      await apideldislikes(id)
      this.artlist.attitude = -1
    }
  }
}
</script>

<style lang='less'>
.detail {
  i.van-icon.van-icon-arrow-left.van-nav-bar__arrow {
    color: #fff;
  }
  .content {
    display: block;
    padding: 8px;
    .title {
      width: 100%;
      h1 {
        font-size: 30px;
        font-weight: 400;
        color: #2c3e50;
        width: 100%;
        text-align: center;
        line-height: 30px;
      }
    }
    .author {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: #fff;
      padding: 5px 10px;
      .headportrait {
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
      .author-content {
        flex: 1;
        margin-left: 10px;
        font-size: 16px;
        color: #2c3e50;
        .username {
          margin-bottom: 5px;
        }
      }
    }
    .btnbox {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
    }
    .divider {
      font-weight: 700;
      color: #2c3e50;
    }
    .actcomment {
      margin-top: 10px;
    }
    .comment.van-list {
      margin-bottom: 54px;
      .van-cell {
        padding: 0 10px;
      }
    }
    .comment {
      margin-top: 10px;
    }
    .leaveword {
      position: fixed;
      width: 100%;
      height: 55px;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
