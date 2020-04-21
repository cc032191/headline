<template>
  <div class="channel">
    <!-- 弹出框 -->
    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '90%' }"
      class="mypopup"
    >
      <!-- 我的频道 -->
      <van-cell title="我的频道">
        <template>
          <van-button
            v-if="isedit===false"
            round
            type="info"
            size="mini"
            plain
            @click="isedit=true"
          >编辑</van-button>
          <van-button v-else round type="info" size="mini" plain @click="isedit=false">完成</van-button>
        </template>
      </van-cell>
      <!-- 列表 -->
      <van-grid :gutter="15">
        <!-- <van-grid-item
          class="myitem"
          v-for="(item, index) in channellist"
          :key="index"
          @click.stop="index=>$emit('input',index)"
        >-->
        <van-grid-item
          class="myitem"
          v-for="(item, index) in channellist"
          :key="index"
          @click="changeactive(index)"
        >
          <template>
            <span :class="{active:active===index}">{{item.name}}</span>
            <van-icon v-if="isedit" class="myicon" name="clear" @click.stop="removechannel(index)" />
          </template>
        </van-grid-item>
      </van-grid>
      <!-- 频道推荐 -->
      <van-cell title="频道推荐"></van-cell>
      <!-- 列表 -->
      <van-grid :gutter="15">
        <van-grid-item
          :text="item.name"
          v-for="(item, index) in recommendchannel"
          :key="index"
          @click="addrecommend(item)"
        ></van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
// 导入操作local的方法
import { localSet } from '../../../utils/mylocal'
import { apiGetAllchannel, apiresetchannel } from '../../../api/channel'
export default {
  props: ['channellist', 'active'],
  data () {
    return {
      // 弹出框控制按钮
      show: false,
      // 是否编辑
      isedit: false,
      allchannellist: []
    }
  },
  computed: {
    recommendchannel () {
      // 获取我的频道的Id
      var ids = this.channellist.map(item => {
        return item.id
      })
      // 遍历所有的频道数据,从数组中删除我的频道,得到的新数组就是推荐频道
      return this.allchannellist.filter(item => {
        return !ids.includes(item.id)
      })
    }
  },
  created () {
    this.getallchannel()
  },
  methods: {
    // 改变显示的频道
    changeactive (index) {
      // 将数据传回到父组件，在父组件进行修改
      // this.$emit('changeactive', index)
      // 利用.sync
      this.$emit('update:active', index)
    },
    // 得到所有频道数据
    async getallchannel () {
      const { data: res } = await apiGetAllchannel()
      // window.console.log(res)
      this.allchannellist = res.data.channels
    },
    // 添加
    async addrecommend (item) {
      // window.console.log(item)
      // 直接添加到我的频道里面
      this.channellist.push(item)
      this.$set(item, 'articlelist', [])
      this.$set(item, 'isLoading', false)
      this.$set(item, 'loading', false)
      this.$set(item, 'finished', false)
      // window.console.log(this.channellist)
      // 判断有没有token,有的话就保存在服务器,没有的话就保存在本地
      var token = this.$store.state.userInfo.token
      if (!token) {
        localSet('channellist', this.channellist)
      } else {
        // 登录了,就保存在服务器
        // 生成一个接口需要的数组   去掉第一项 第一项不可变
        var channels = this.channellist.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        // window.console.log(channels)
        // window.console.log(this.channellist)
        // 发送请求保存数据
        try {
          await apiresetchannel(channels)
        } catch {
          this.$toast('频道操作失败')
        }
        // this.$parent.getChannel()
      }
    },
    // 删除
    async removechannel (index) {
      // 将index对应的下标的元素从我的频道中删除
      this.channellist.splice(index, 1)
      // 保存删除之后的状态
      var token = this.$store.state.userInfo.token
      if (!token) {
        // 保存在本地
        localSet('channellist', this.channellist)
      } else {
        // 保存在服务器  去掉第一项 第一项不可变
        var channels = this.channellist.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        // 发送数据保存起来
        try {
          await apiresetchannel(channels)
        } catch {
          this.$toast('频道操作失败')
        }
      }
    }
  }
}
</script>

<style lang='less'>
.channel {
  .mypopup {
    .van-cell {
      margin-top: 44px;
    }
  }
  .myitem {
    position: relative;
    .myicon {
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 20px;
      color: #ccc;
    }
  }
  .van-grid-item__content.van-grid-item__content--center.van-hairline {
    color: #fff;
    font-size: 12px;
    background-color: #1989fa;
    padding: 10px;
    .van-grid-item__text {
      color: #fff;
    }
  }
  .active {
    color: greenyellow;
  }
}
</style>
