<template>
  <div class="divsty">
    <!-- 标题 -->
    <van-nav-bar class="barsty" title="登录" />
    <!-- 输入框 -->
    <van-cell-group>
      <van-field v-model="obj.mobile" placeholder="请输入手机号" :error-message="msg.mobile">
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
      <van-button type="primary" block @click="login" :loading="isLoading">登录</van-button>
    </div>
  </div>
</template>

<script>
import { apiLogin } from '../../api/user'
export default {
  data () {
    return {
      obj: {
        mobile: '18611111111', // 手机号
        code: '246810'
      },
      msg: {
        mobile: '',
        code: ''
      },
      // 设置按钮的加载状态
      isLoading: false
    }
  },
  methods: {
    // 完成验证登录
    async login () {
      // 登陆的时候,按钮状态开启
      this.isLoading = true
      if (this.checkData()) {
        // 捕获登陆失败信息
        try {
          // 验证通过的逻辑
          const { data: res } = await apiLogin(this.obj)
          window.console.log(res)
          // 将服务器返回的token保存到vuex和本地
          this.$store.commit('setToken', res.data)
          this.$router.push('index')
        } catch {
          this.$toast.fail('登陆失败')
        }
      } else {
        window.console.log('验证不通过')
      }
      // 加载完毕,按钮状态关闭
      this.isLoading = false
    },
    // 封装合法性验证逻辑
    checkData () {
      // 判断合法性
      const checkArr = []
      // 验证手机号
      if (this.obj.mobile.length !== 11) {
        this.msg.mobile = '手机号长度不合法'
        checkArr.push(false)
      } else {
        this.msg.mobile = ''
        checkArr.push(true)
      }
      // 验证验证码
      if (this.obj.code.length !== 6) {
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
