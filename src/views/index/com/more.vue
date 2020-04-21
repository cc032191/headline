<template>
  <div>
    <!-- 弹出框外层 -->
    <van-popup v-model="show">
      <van-cell-group v-if="isOK">
        <van-cell value="不感兴趣" icon="bill-o" border @click="dislike" />
        <van-cell icon="info-o" title="反馈垃圾内容" is-link border @click="isOK=false" />
        <van-cell icon="delete" value="拉黑作者" border @click="shielding" />
      </van-cell-group>
      <!-- 弹出框内层 -->
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isOK=true"></van-cell>
        <van-cell
          v-for="(item, index) in reportslist"
          :key="index"
          :title="item.type"
          @click="reportart(index)  "
        ></van-cell>
      </van-cell-group>
      <!-- {{artid}} -->
    </van-popup>
  </div>
</template>

<script>
// 导入不喜欢的方法
// 导入举报文章的方法
import { apiDislike, apireport } from '../../../api/article'
// 导入拉黑作者的方法
import { apishielding } from '../../../api/user'
export default {
  props: ['artid', 'autid'],
  data () {
    return {
      show: false,
      // 对文章不喜欢
      reportslist: [
        { id: 0, type: '其他问题' },
        { id: 1, type: '标题夸张' },
        { id: 2, type: '低俗色情' },
        { id: 3, type: '错别字多' },
        { id: 4, type: '旧闻重复' },
        { id: 5, type: '广告软文' },
        { id: 6, type: '内容不实' },
        { id: 7, type: '涉嫌违法犯罪' },
        { id: 8, type: '侵权' }
      ],
      // 判断是否处于举报页面
      isOK: true
    }
  },
  methods: {
    // 不感兴趣
    async dislike () {
      // 提交到服务器标示为不喜欢
      const { data: res } = await apiDislike(this.artid)
      window.console.log(res)
      // 文章在主页面,删除主页面的文章,应该把artid传回去,在主页面上删除
      this.$emit('delarticle', this.artid)
    },
    // 举报文章
    async reportart (index) {
      try {
        await apireport({
          artid: this.artid,
          type: index
        })
        this.$toast.success('举报成功')
      } catch (error) {
        this.$toast.fail('举报失败')
      }
      // 关闭面板
      this.show = false
      // 切换为不喜欢面板
      this.isOK = true
    },
    // 拉黑作者
    async shielding () {
      try {
        await apishielding(this.autid)
        this.$toast.success('拉黑成功')
      } catch (error) {
        this.$toast.fail('拉黑失败')
      }
      // 关闭面板
      this.show = false
    }
  }
}
</script>

<style lang='less'>
.van-popup {
  width: 80%;
}
</style>
