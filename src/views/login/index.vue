<template>
  <div class="divsty">
    <!-- 标题 -->
    <van-nav-bar class="barsty" title="登录" />
    <!-- 输入框 -->
    <van-cell-group>
      <van-field v-model="obj.phone" placeholder="请输入手机号" :error-message="msg.phone">
        <template #left-icon>
          <i style="font-size: 18px; color: #666666;" class="iconfont icon-shouji"></i>
        </template>
      </van-field>
      <van-field v-model="obj.code" placeholder="请输入验证码" :error-message="msg.code">
        <template #left-icon>
          <i style="font-size: 18px; color: #666666;" class="iconfont icon-suo"></i>
        </template>
        <template #right-icon>
          <i style="font-size: 30px; color: #ccc;" class="iconfont icon-vertical_line"></i>
        </template>
        <template #button>
          <van-button size="small" round type="info">发送验证码</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <!-- 登录 -->
    <div class="btnlogin">
      <van-button type="primary" block @click="login">登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      obj: {
        phone: '', // 手机号
        name: ''
      },
      msg: {
        phone: '',
        code: ''
      }
    }
  },
  methods: {
    // 完成验证登录
    login () {
      if (this.checkData()) {
        window.console.log(11111)
      } else {
        window.console.log(22222)
      }
    },
    // 封装合法性验证逻辑
    checkData () {
      // 判断合法性
      const checkArr = []
      // 验证手机号
      if (this.obj.phone.length !== 11) {
        this.msg.phone = '手机号长度不合法'
        checkArr.push(false)
      } else {
        this.msg.phone = ''
        checkArr.push(true)
      }
      // 验证验证码
      if (this.obj.code !== 6) {
        this.msg.code = '验证码不合法'
        checkArr.push(false)
      } else {
        this.msg.code = ''
        checkArr.push(true)
      }
      // 判断是否验证通过
      if (!checkArr.includes(false)) {
        // 如果不包含false 则验证通过
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.divsty {
  height: 100%;
  width: 100%;
  background-color: #f5f7f9;
  .barsty {
    background-color: #3296fa;
    .van-nav-bar__title {
      color: #fff;
    }
  }
}
.van-field__button {
  .van-button--info {
    background-color: #ededed;
    border: 1px solid #ededed;
    color: #666666;
  }
}
.van-field__left-icon {
  display: flex;
  align-items: center;
}
.btnlogin {
  padding: 30px 24px;
  .van-button {
    border-radius: 5px;
    background-color: #3296fa;
  }
}
.van-field__body {
  .van-field__right-icon {
    display: flex;
    margin-right: -17px;
  }
}
</style>
