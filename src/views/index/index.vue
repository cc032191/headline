<template>
  <div class="index">
    <!-- 头部标题 -->
    <van-nav-bar fixed title="首页" />
    <!-- 频道区域 -->
    <div class="box">
      <van-tabs v-model="active" animated>
        <van-tab v-for="(item,index) in channellist" :key="index" :title="item.name">
          <!-- 下拉刷新 -->
          <van-pull-refresh v-model="item.isLoading" @refresh="onRefresh">
            <!-- 上滑加载数据 -->
            <van-list
              v-model="item.loading"
              :finished="item.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="(subitem,subindex) in item.articlelist"
                :key="subindex"
                @click="indextodetail(subitem)"
              >
                <template>
                  <div>
                    <!-- 标题 -->
                    <div class="header">
                      <span>{{subitem.title}}</span>
                    </div>
                    <!-- 图片 -->
                    <div>
                      <van-grid v-if="subitem.cover.type!==0" :border="false" :column-num="3">
                        <van-grid-item
                          v-for="(imgitem, imgindex) in subitem.cover.images"
                          :key="imgindex"
                        >
                          <van-image lazy-load :src="imgitem" />
                        </van-grid-item>
                      </van-grid>
                    </div>
                    <!-- 作者评论区 -->
                    <div class="content">
                      <div class="left">
                        <span>{{subitem.aut_name}}</span>
                        <span>{{ subitem.comm_count }} 条评论</span>
                        <span>{{ subitem.pubdate | timeData }}</span>
                      </div>
                      <div class="right" @click="ismore(subitem)">
                        <van-icon name="cross" />
                      </div>
                    </div>
                  </div>
                </template>
              </van-cell>
            </van-list>
          </van-pull-refresh>
          <!-- 文章区域结构 -->
        </van-tab>
      </van-tabs>
    </div>
    <!-- 频道操作按钮 -->
    <div class="channelBtn" @click="openchannel">
      <van-icon name="wap-nav" />
    </div>
    <!-- 编辑页面 -->
    <!-- <channel ref="channel" :active="active" @input="v=>active=v" :channellist="channellist"></channel> -->
    <!-- <channel ref="channel" :active="active" @update:active="v=>active=v" :channellist="channellist"></channel> -->
    <!-- 使用.sync来进行简写 -->
    <channel ref="channel" :active.sync="active" :channellist="channellist"></channel>
    <more ref="more" @delarticle="delarticle" :artid="artid" :autid="autid"></more>
  </div>
</template>

<script>
import { apiGetarticle } from '../../api/article'
import { apiGetchannel } from '../../api/channel'
// 导入操作local的方法
import { localGet } from '../../utils/mylocal'
// 导入编辑页面
import channel from './com/channel'
// 导入more页面
import more from './com/more'
// 图片懒加载
import Vue from 'vue'
import { Lazyload } from 'vant'
Vue.use(Lazyload)
export default {
  data () {
    return {
      // channel列表
      channellist: [],
      // 当前点击的索引值
      active: '',
      // 当前被点击文章的id
      artid: 0,
      // 作者id
      autid: 0
    }
  },
  components: {
    channel,
    more
  },
  created () {
    this.getChannel()
  },
  methods: {
    // 传到文章页面
    indextodetail (subitem) {
      // window.console.log(subitem)
      this.$router.push(`/detail?artid=${subitem.art_id}`)
    },
    // 打开编辑页面
    openchannel () {
      this.$refs.channel.show = true
    },
    // 打开more页面
    ismore (subitem) {
      // window.console.log(subitem)
      // 文章id
      this.artid = subitem.art_id
      this.$refs.more.show = true
      // 传过去作者id
      this.autid = subitem.aut_id
    },
    // 在页面上删除频道里面对应的文章
    delarticle (artid) {
      // 找到当前artid对应的文章然后删除
      this.channellist[this.active].articlelist.forEach((item, index) => {
        if (artid === item.art_id) {
          this.channellist[this.active].articlelist.splice(index, 1)
        }
      })
    },
    // 滚动条与底部距离小于 offset 时触发
    async onLoad () {
      // 取到当前点击的频道信息
      var currentchannel = this.channellist[this.active]
      // 得到id
      var id = currentchannel.id
      // 获取到文章
      const { data: res } = await apiGetarticle({
        channelid: id,
        timestamp: Date.now()
      })
      // 将当前的数据拼接起来
      currentchannel.articlelist.push(...res.data.results)
      // 当前list的加载状态改为false
      currentchannel.loading = false
      // 添加一个没有数据的判断
      if (currentchannel.articlelist.length === 0) {
        // 说明没有数据  finished改为true
        currentchannel.finished = true
      }
    },
    // 下拉操作
    onRefresh () {
      // 得到当前频道
      var currentchannel = this.channellist[this.active]
      // 清空
      currentchannel.articlelist = []
      currentchannel.loading = false
      currentchannel.isLoading = false
      currentchannel.finished = false
      // 重新调用方法   解决数据不够而导致不能加载数据的bug
      this.onLoad()
      this.onLoad()
    },
    // 获取频道
    async getChannel () {
      // 判断token是否存在,如果有就取用户的channel,如果没有就从本地取出channel,本地如果没有就取出默认的channel
      try {
        if (this.$store.state.userInfo.token) {
          const { data: res } = await apiGetchannel()
          // window.console.log(res)
          this.channellist = res.data.channels
        } else {
          if (localGet('channellist')) {
            this.channellist = localGet('channellist')
          } else {
            const { data: reslogin } = await apiGetchannel()
            // window.console.log(res)
            this.channellist = reslogin.data.channels
          }
        }
      } catch {
        this.$toast.fail('获取数据失败')
      }
      // 添加属性
      this.addOtherProps()
    },
    // 给channellist添加属性
    addOtherProps () {
      this.channellist.forEach(item => {
        // // 添加articlelist属性 展示不同的页面
        // item.articlelist = [item.name]
        // // 添加下拉刷新组件的刷新状态
        // item.isLoading = false
        // // 添加list组件的加载状态
        // item.loading = false
        // // 添加list组件中数据加载完毕的状态
        // item.finished = false
        // 使用this.$set方法  第一项要添加的目标  第二项要添加的键  第三项要添加的值
        this.$set(item, 'articlelist', [])
        this.$set(item, 'isLoading', false)
        this.$set(item, 'loading', false)
        this.$set(item, 'finished', false)
      })
      // window.console.log(this.channellist)
    }
  }
}
</script>

<style lang="less">
.van-nav-bar.van-hairline--bottom {
  background-color: #3e9df8;
  .van-nav-bar__title {
    color: #fff;
  }
}

.index {
  margin-top: 90px;
  margin-bottom: 50px;
  .van-tabs__wrap.van-hairline--top-bottom {
    position: fixed;
    top: 46px;
    left: 0;
    width: 90%;
    z-index: 999;
  }
  .channelBtn {
    position: fixed;
    top: 46px;
    right: 0px;
    height: 44px;
    width: 10%;
    text-align: center;
    line-height: 44px;
    background-color: #ccc;
    color: #fff;
  }
  .box {
    position: fixed;
    top: 90px;
    bottom: 50px;
    overflow: scroll;
    width: 100%;
  }
}
.header {
  font-weight: 700;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 12px;
  .left {
    span {
      margin-right: 12px;
    }
  }
  .right {
    .van-icon {
      height: 14px;
      padding: 0 5px;
      border: 0.5px solid #edeff3;
      line-height: 14px;
    }
  }
}
</style>
