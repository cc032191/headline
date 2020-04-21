<template>
  <div class="searchques">
    <!-- 搜索结果 -->
    <!-- 头部标题 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="onclickleft" />
    <!-- 内容 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in searchlist" :key="index" @click="todetail(item)">
        <template>
          <!-- 标题 -->
          <div>
            <span>{{item.title}}</span>
          </div>
          <van-divider />
          <!-- 图片 -->
          <div>
            <van-grid :border="false" :column-num="3" v-if="item.cover.type!==0">
              <van-grid-item v-for="(itemimg, indeximg) in item.cover.images" :key="indeximg">
                <van-image lazy-load :src="itemimg" />
              </van-grid-item>
            </van-grid>
          </div>
          <!-- 评论 -->
          <div class="content">
            <div class="left">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}} 条评论</span>
              <span>{{ item.pubdate | timeData }}</span>
            </div>
          </div>
          <!-- 底部区 -->
          <van-grid :column-num="3" border>
            <van-grid-item icon="comment" :text="item.comm_count.toString()" @click="comment" />
            <van-grid-item icon="like-o" text="点赞" @click="tags" />
            <van-grid-item icon="certificate" text="分享" />
          </van-grid>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// 获取搜索内容
import { apiGetsearch } from '../../api/search'
// 图片懒加载
import Vue from 'vue'
import { Lazyload } from 'vant'
Vue.use(Lazyload)
export default {
  data () {
    return {
      // 是否处于加载状态，加载过程中不触发load事件
      loading: false,
      // 是否已加载完成，加载完成后不再触发load事件
      finished: false,
      // 搜索内容
      searchcontent: {
        // 页数
        page: 1,
        // 容量
        perpage: 10,
        // 搜索关键词
        q: ''
      },
      // 获取到的数据
      searchlist: []
    }
  },
  created () {
    this.searchcontent.q = this.$route.query.key
  },
  methods: {
    // 跳转到文章详情页面
    todetail (item) {
      // window.console.log(item)
      this.$router.push(`/detail?artid=${item.art_id}`)
    },
    // 评论逻辑
    comment () {
      // 判断有没有登录
      if (!this.$login()) {
        // 未登录
        return
      }
      window.console.log('评论')
    },
    // 点赞逻辑
    tags () {
      // 判断有没有登录
      if (!this.$login()) {
        // 未登录
        return
      }
      window.console.log('点赞')
    },
    // 返回到上一个页面
    onclickleft () {
      // back()方法返回上一页
      this.$router.back()
    },
    // 下拉获取内容
    async onLoad () {
      // 获取内容
      const { data: res } = await apiGetsearch(this.searchcontent)
      // window.console.log(res)
      // 保存搜索数据
      this.searchlist = [...this.searchlist, ...res.data.results]
      // 将加载状态改为false
      this.loading = false
      // 页码++
      this.searchcontent.page++
      // 判断结果是否为空  如果没有数据 加载完成 不再触发load事件
      if (res.data.results.length === 0) {
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less'>
.searchques {
  width: 100%;
  height: 100%;
  background-color: #f5f7f9;
  .van-cell {
    margin-bottom: 10px;
  }
  .van-nav-bar__left {
    .van-icon.van-icon-arrow-left.van-nav-bar__arrow {
      color: #fff;
    }
  }
  .van-grid-item__content.van-grid-item__content--center {
    padding: 5px;
  }
  .van-divider.van-divider--hairline {
    margin: 5px 0;
  }
  .content {
    color: #999;
    font-size: 12px;
    .left {
      margin-right: 12px;
    }
  }
  .van-grid-item__content.van-grid-item__content--center.van-hairline {
    background-color: #fff;
    color: #333;
    flex-direction: row;
    font-size: 12px;
    padding: 10px;
    i.van-icon.van-icon-comment.van-grid-item__icon,
    i.van-icon.van-icon-like-o.van-grid-item__icon,
    i.van-icon.van-icon-certificate.van-grid-item__icon {
      font-size: 16px;
      color: #333;
      padding-top: 2px;
    }
  }
}
.searchques
  .van-grid-item__content.van-grid-item__content--center.van-hairline
  .van-grid-item__icon
  + .van-grid-item__text {
  margin-top: 0;
  margin-left: 8px;
}
</style>
