<template>
  <div class="userinfo">
    <!-- 头部区域 -->
    <div class="header">
      <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <van-cell-group>
        <van-cell title="头像" is-link class="content_box" @click="openupload">
          <template>
            <img class="content_img" :src="userinfo.photo" alt />
          </template>
        </van-cell>
        <van-cell title="昵称" is-link :value="userinfo.name" @click="openname" />
        <van-cell title="介绍" is-link :value="userinfo.intro" @click="openintro" />
      </van-cell-group>
      <van-cell-group class="content_footer">
        <van-field
          readonly
          clickable
          label="性别"
          :value="userinfo.gender?'女':'男'"
          right-icon="arrow"
          @click="opengender"
          input-align="right"
        />
        <van-cell title="生日" is-link :value="userinfo.birthday" @click="openbirthday()" />
      </van-cell-group>
    </div>
    <!-- 昵称面板 -->
    <van-popup v-model="showname" position="bottom" :style="{ height: '7%' }">
      <van-field v-model="name" center clearable label="昵称" placeholder="请输入昵称">
        <template #button>
          <van-button size="small" type="primary" @click="onClickRight">确认</van-button>
        </template>
      </van-field>
    </van-popup>
    <!-- 介绍 -->
    <van-popup v-model="showintro" position="bottom" :style="{ height: '7%' }">
      <van-field v-model="intro" center clearable label="介绍" placeholder="请输入介绍">
        <template #button>
          <van-button size="small" type="primary" @click="onClickRight">确认</van-button>
        </template>
      </van-field>
    </van-popup>
    <!-- 修改性别 -->
    <van-popup v-model="showgender" position="bottom" :style="{ height: '40%' }">
      <van-picker
        show-toolbar
        title="性别"
        :columns="genderlist"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 选择年月 -->
    <van-popup v-model="showbirthday" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showbirthday=false"
        @confirm="birthdayconfirm"
      />
    </van-popup>
    <!-- 用户头像面板 -->
    <upload ref="upload" @changeimg="v=>userinfo.photo=v"></upload>
  </div>
</template>

<script>
import { apigetusermsg, apigetuserinfo, apieditprofile } from '../../api/user'
import upload from './com/upload'
export default {
  data () {
    return {
      // 用户信息
      userinfo: {
        photo: '',
        name: '',
        intro: '',
        birthday: '',
        gender: ''
      },
      name: null,
      intro: null,
      showname: false,
      showintro: false,
      showgender: false,
      showbirthday: false,
      genderlist: ['男', '女'],
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    }
  },
  components: {
    upload
  },
  created () {
    this.getuserinfo()
  },
  methods: {
    // 获取个人信息
    async getuserinfo () {
      const { data: res } = await apigetusermsg()
      // window.console.log(res)
      this.userinfo.photo = res.data.photo
      this.userinfo.name = res.data.name
      this.userinfo.intro = res.data.intro
      const { data: res1 } = await apigetuserinfo()
      window.console.log(res1)
      this.userinfo.birthday = res1.data.birthday
      this.userinfo.gender = res1.data.gender
    },
    // 修改昵称
    openname () {
      this.name = this.userinfo.name
      this.showname = true
    },
    // 修改简介
    openintro () {
      this.intro = this.userinfo.intro
      this.showintro = true
    },
    // 修改性别
    opengender () {
      this.showgender = true
    },
    onConfirm (value, index) {
      // window.console.log(`当前值：${value}, 当前索引：${index}`)
      this.userinfo.gender = index
      // window.console.log(this.userinfo.gender)
      this.onClickRight()
    },
    // 取消选择性别
    onCancel () {
      this.showgender = false
    },
    // 修改生日
    openbirthday () {
      if (this.userinfo.birthday !== '') {
        this.currentDate = this.userinfo.birthday
      }
      this.showbirthday = true
    },
    // 确认生日
    birthdayconfirm () {
      this.onClickRight()
    },
    // 保存个人信息
    async onClickRight () {
      // window.console.log('11')
      const { data: res } = await apieditprofile({
        name: this.name,
        gender: this.userinfo.gender,
        intro: this.intro,
        birthday: this.currentDate
      })
      // window.console.log(res)
      if (res.message === 'OK') {
        this.getuserinfo()
        this.showname = false
        this.showintro = false
        this.showgender = false
      }
    },
    // 打开上传面板
    openupload () {
      this.$refs.upload.show = true
    }
  }
}
</script>

<style lang='less'>
.userinfo {
  height: 100%;
  background-color: #f5f7f9;
  .header {
    .van-nav-bar .van-icon {
      color: #fff;
    }
  }
  .content {
    width: 100%;
    display: block;
    .content_box {
      padding: 7px 16px;
    }
    .content_img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
    }
    .content_footer {
      margin-top: 15px;
    }
  }
  .van-button--primary {
    background-color: #3e9df8;
    border: 1px solid #3e9df8;
  }
}
</style>
