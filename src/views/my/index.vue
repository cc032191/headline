<template>
  <div class="my">
    <!-- 头部 -->
    <div class="header">
      <div class="header_box">
        <div class="header_box_img" @click="openusermsg">
          <img :src="userinfo.photo" alt />
        </div>
        <div class="header_box_content">{{userinfo.name}}</div>
      </div>
      <div class="header_content">
        <van-grid :column-num="3" class="header_content_box">
          <van-grid-item>
            <template>
              <div class="margin_bottom_8">{{userinfo.art_count}}</div>
              <div>动态</div>
            </template>
          </van-grid-item>
          <van-grid-item>
            <template>
              <div class="margin_bottom_8">{{userinfo.follow_count}}</div>
              <div>关注</div>
            </template>
          </van-grid-item>
          <van-grid-item>
            <template>
              <div class="margin_bottom_8">{{userinfo.fans_count}}</div>
              <div>粉丝</div>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 今日阅读 -->
      <div class="todayread">
        <div>今日阅读</div>
        <div>111分钟</div>
      </div>
    </div>
    <!-- 中间 -->
    <div class="content">
      <van-grid :column-num="3" class="content_grid">
        <van-grid-item icon="star-o" text="收藏" />
        <van-grid-item icon="underway-o" text="历史" />
        <van-grid-item icon="records" text="作品" />
      </van-grid>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <van-cell title="阿信同学" is-link @click="openrobot" />
    </div>
  </div>
</template>

<script>
import { apigetusermsg } from '../../api/user'
export default {
  data () {
    return {
      // 用户信息
      userinfo: []
    }
  },
  created () {
    this.getuserinfo()
  },
  methods: {
    // 获取用户信息
    async getuserinfo () {
      const { data: res } = await apigetusermsg()
      // window.console.log(res)
      this.userinfo = res.data
    },
    // 打开用户信息页面
    openusermsg () {
      this.$router.push('/userinfo')
    },
    // 打开小智机器人
    openrobot () {
      this.$router.push(`/robot?img=${this.userinfo.photo}`)
    }
  }
}
</script>

<style lang='less'>
.my {
  background: #f5f7f9;
  height: 100%;
  .header {
    position: relative;
    height: 200px;
    background-color: #3e9df8;
    .header_box {
      display: flex;
      padding-top: 34px;
      padding-left: 45px;
      .header_box_img {
        img {
          width: 66px;
          height: 66px;
          border-radius: 50%;
        }
      }
      .header_box_content {
        color: #fff;
        margin-left: 10px;
        font-weight: 400;
        font-size: 18px;
      }
    }
    .header_content {
      .header_content_box {
        color: #fff;
        font-size: 16px;
        font-weight: 400;
        .van-grid-item__content {
          background-color: #3e9df8;
          &::after {
            z-index: 1;
            border-width: 0;
          }
        }
        .margin_bottom_8 {
          margin-bottom: 5px;
        }
      }
    }
    [class*="van-hairline"]::after {
      border: none;
    }
    .todayread {
      box-sizing: border-box;
      position: absolute;
      right: 0;
      top: 60px;
      border-radius: 22px 0 0 22px;
      width: 78px;
      height: 44px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      font-size: 12px;
      font-weight: normal;
      padding: 6px 15px;
    }
  }
  .content {
    width: 100%;
    .content_grid {
      height: 110px;
      width: 100%;
      .van-grid-item__icon {
        font-size: 35px;
      }
      .van-icon-star-o::before {
        color: red;
      }
      .van-icon-underway-o::before {
        color: rgb(255, 158, 31);
      }
      .van-icon-records::before {
        color: rgb(106, 147, 255);
      }
      .van-grid-item__text {
        font-size: 16px;
      }
    }
  }
  .footer {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
