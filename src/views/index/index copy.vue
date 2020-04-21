<template>
  <div class="index">
    <!-- 头部标题 -->
    <van-search
      v-model="value"
      shape="round"
      background="#3e9df8"
      placeholder="请输入搜索关键词"
      show-action
    >
      <template #left>
        <van-icon name="wap-nav" style="font-size:20px" />
      </template>
      <template #action>
        <van-icon name="search" />
      </template>
    </van-search>
    <!-- 频道区域 -->
    <van-tabs>
      <van-tab v-for="index in 8" :key="index" :title="'标签 ' + index">
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <!-- 上滑加载数据 -->
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in list" :key="item" :title="item" />
          </van-list>
        </van-pull-refresh>
        <!-- 文章区域结构 -->
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { apiGetchannel } from '../../api/channel'
export default {
  data () {
    return {
      // 搜索
      value: '',
      // 自定义底部加载中提示 true加载中 false 加载完成
      loading: false,
      // 自定义加载完成后的提示文案 true 加载完成  false还未加载完成
      finished: false,
      list: [],
      // true 刷新完成   false 刷新未完成
      isLoading: false
    }
  },
  created() {
    this.getChannel()
  },
  methods: {
    // 滚动条与底部距离小于 offset 时触发
    onLoad () {
      setTimeout(() => {
        for (let i = 1; i <= 20; i++) {
          this.list.push(i)
        }
        // 当触底时会执行onLoad,loading会改为true,显示加载中
        this.loading = false
        // 当list的长度>60的话,finished改为true,加载完成
        if (this.list.length >= 60) {
          this.finished = true
        }
      }, 1000)
    },
    // 下拉时执行,会把isLoading改为true   下拉完成   需要手动关闭
    onRefresh () {
      setTimeout(() => {
        // 将list长度重置
        this.list = []
        // 将上滑finished状态改为未加载完成
        this.finished = false
        // 将下拉状态改为false
        this.isLoading = false
        this.onLoad()
      }, 1000)
    },
    // 获取频道
    async getChannel () {
      const { data: res } = await apiGetchannel()
      window.console.log(res)
    }
  }
}
</script>

<style lang="less">
.van-search {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  height: 50px;
  width: 100%;
  .van-search__content.van-search__content--round {
    margin-left: 12px;
    height: 34px;
    margin-right: 10px;
  }
}
.van-icon-wap-nav.van-icon-wap-nav {
  font-size: 20px;
  color: #fff;
}
div.van-search__action {
  padding: 0 8px 0 0;
  line-height: 10px;
}
.van-field__left-icon {
  .van-icon.van-icon-search {
    color: #32363a;
  }
}
.van-icon.van-icon-search {
  font-size: 24px;
  color: #fff;
}
.index {
  margin-top: 90px;
  margin-bottom: 50px;
  .van-tabs__wrap.van-tabs__wrap--scrollable.van-hairline--top-bottom {
    position: fixed;
    top: 50px;
    width: 100%;
    z-index: 999;
  }
}
</style>
