<template>
  <div class="search">
    <!-- 搜索区域 -->
    <van-search
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
      @input="think"
    />
    <!-- 联想区域 -->
    <van-cell-group v-if="suggeslist.length!==0">
      <van-cell title="联想区域" />
      <van-cell
        icon="search"
        v-for="(item, index) in suggeslist"
        :key="index"
        @click="onSearch(item.olditem)"
      >
        <template #title>
          <div v-html="item.newitem"></div>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 历史区域 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template #right-icon>
          <van-icon name="delete" @click="delAll" />
        </template>
      </van-cell>
      <van-cell
        v-for="(item, index) in historylist"
        :key="index"
        :title="item"
        @click="clickhistory(item)"
      >
        <template #right-icon>
          <van-icon name="cross" @click.stop="del(index)" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 获取联想建议
import { apiGetsugges } from '../../api/search'
// 导入操作local的方法
import { localSet, localGet, localRemove } from '../../utils/mylocal'
export default {
  data () {
    return {
      // 输入框里面的值
      value: '',
      // 联想到的数据
      suggeslist: [],
      //  定义定时器
      timer: null,
      // 保存历史搜索
      historylist: localGet('historylist') || []
    }
  },
  methods: {
    // 联想
    think () {
      // 解决防抖
      // 清空计时器 500ms获取一次
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        // 判断是否为空,为空的话就retrue出去,不用联想
        if (this.value.trim().length === 0) {
          // 没有内容   suggeslist清空
          this.suggeslist = []
          return
        }
        // 搜索框的值发生改变,获取联想到的内容,显示到页面上
        const { data: res } = await apiGetsugges(this.value)
        this.suggeslist = res.data.options
        // window.console.log(this.suggeslist)
        // 遍历suggeslist,将里面包含的value的关键字改为红色
        this.suggeslist = this.suggeslist.map(item => {
          return {
            // olditem  用于联想搜索传值
            olditem: item,
            newitem: item.replace(this.value, `<span style="color:red">${this.value}</span>`)
          }
        })
      }, 500)
    },
    // 点击手机完成触发的事件
    onSearch (value) {
      // value就是输入框里面的值   跳转到搜索结果页面   传过去value
      this.$router.push('/searchques?key=' + value)
      // 将搜索的结果保存到历史中   unshfit从头部加进去
      this.historylist.unshift(value)
      // 去重
      this.historylist = [...new Set(this.historylist)]
      // 保存到本地
      localSet('historylist', this.historylist)
    },
    // 点击历史记录
    clickhistory (item) {
      this.value = item
      this.$router.push('/searchques?key=' + this.value)
    },
    // 删除历史数据
    del (index) {
      this.historylist.splice(index, 1)
      localSet('historylist', this.historylist)
    },
    // 删除全部历史数据
    delAll () {
      this.$dialog.confirm({
        title: '警告',
        message: '确认删除历史记录'
      }).then(() => {
        // 确认删除执行的逻辑
        this.historylist = []
        // 删除本地
        localRemove('historylist')
      }).catch(() => {
        window.console.log('取消')
      })
    },
    // 点击取消触发的事件
    onCancel () {
    }
  }
}
</script>

<style lang='less'>
.search {
  background-color: #f5f7f9;
  height: 100%;
  width: 100%;
  .van-search.van-search--show-action {
    background-color: #3194ff;
    .van-search__action {
      color: #fff;
    }
    .van-search__action:active {
      background-color: #ccc;
    }
  }
  .van-cell {
    .van-icon.van-icon-cross {
      line-height: 24px;
    }
    .van-icon.van-icon-delete {
      line-height: 24px;
    }
  }
}
</style>
