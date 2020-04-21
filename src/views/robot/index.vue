<template>
  <div class="robot">
    <!-- 头部区域 -->
    <van-nav-bar title="阿信同学" left-arrow @click-left="$router.back()" />
    <!-- 内容区域 -->
    <div class="robot_content" ref="robot_content">
      <div
        :class="['robot_box',item.isRobot?'':'robot_rigth']"
        v-for="(item, index) in charArr"
        :key="index"
      >
        <span class="robot_img">
          <img
            :src="item.isRobot?'http://5b0988e595225.cdn.sohucs.com/images/20190521/3a36d3ba2e5e4be282b9ce8270f510ac.jpeg':$route.query.img"
            alt
          />
        </span>
        <span class="content">{{item.content}}</span>
      </div>
      <div class="user_box"></div>
    </div>
    <!-- 底部区域 -->
    <van-search
      v-model="value"
      show-action
      left-icon
      @search="onSearch"
      background="#3e9df8"
      class="robot_search"
    >
      <template #action>
        <div @click="onSearch(value)">发送</div>
      </template>
    </van-search>
  </div>
</template>
<script>
// 导入socket.io-client
import io from 'socket.io-client'
export default {
  data () {
    return {
      value: '',
      // 聊天的数据
      charArr: [
        { content: '你好,阿信', isRobot: false },
        { content: '嗨,苏苏', isRobot: true }
      ],
      // 服务器对象
      socket: null
    }
  },
  methods: {
    onSearch (val) {
      // window.console.log(val)
      // 将输入框的内容添加到charArr中
      this.charArr.push({
        content: this.value,
        isRobot: false
      })
      // 对话滚动到最底部
      this.$nextTick(() => {
        // 获取内容区域的dom
        var content = this.$refs.robot_content
        content.scrollTop = content.scrollHeight
      })
      // 发送内容到服务器
      this.socket.emit('message', {
        msg: this.value,
        timestamp: Date.now()
      })
      // 输入框中的内容清空
      this.value = ''
    }
  },
  created () {
    // 一打开页面的时候,连接服务器
    // 得到token
    var token = this.$store.state.userInfo.token
    // 连接服务器
    this.socket = io(`http://ttapi.research.itcast.cn?token=${token}`)
    // 接收服务器返回的数据
    this.socket.on('message', data => {
      // window.console.log(data)
      // 添加到charArr中
      this.charArr.push({
        content: data.msg,
        isRobot: true
      })
      // 对话滚动到最底部
      this.$nextTick(() => {
        // 获取内容区域的dom
        var content = this.$refs.robot_content
        content.scrollTop = content.scrollHeight
      })
    })
  }
}
</script>
<style lang='less'>
.robot {
  .van-nav-bar .van-icon {
    color: #fff;
  }
  .robot_content {
    width: 100%;
    position: fixed;
    top: 46px;
    bottom: 54px;
    background-color: #f5f7f9;
    box-sizing: border-box;
    padding: 10px;
    overflow: auto;
    .robot_box {
      display: flex;
      margin: 20px 10px;
      .robot_img {
        img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }
      }
      .content {
        margin: 0 10px;
        color: #222;
        background-color: #e0effb;
        border-radius: 8px;
        padding: 0 10px;
        font-size: 15px;
        border: 1px solid #c2d9ea;
        max-width: 70%;
        line-height: 36px;
      }
    }
    .robot_rigth {
      flex-direction: row-reverse;
    }
  }
  .robot_search {
    position: fixed;
    bottom: 0;
    width: 100%;
    .van-search__action {
      color: #fff;
      &:active {
        background-color: #ccc;
      }
    }
  }
}
</style>
