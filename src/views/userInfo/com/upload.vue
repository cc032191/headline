<template>
  <div class="upload">
    <!-- 展示弹出层 -->
    <van-popup v-model="show" :close-on-click-overlay="false">
      <van-cell-group>
        <van-cell title="从相册选择" @click="openfile" />
        <!-- 头像上传 -->
        <div>
          <input ref="inputfile" type="file" style="display:none" @change="changeimg" />
        </div>
        <van-cell title="拍照" />
        <van-cell title="取消" @click="show=false" />
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
// 预览组件
import { apiaddphoto } from '../../../api/user'
import Vue from 'vue'
import { ImagePreview } from 'vant'
// 全局注册
Vue.use(ImagePreview)
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    // 打开头像选择器
    openfile () {
      this.$refs.inputfile.click()
    },
    // 图片改变的事件
    changeimg () {
      // 得到选择的图片
      var file = this.$refs.inputfile.files[0]
      // window.console.log(file)
      // 转换图片地址
      var reader = new FileReader()
      reader.readAsDataURL(file)
      // 接受转换的结果
      reader.addEventListener('load', () => {
        // 得到转换后的结果
        var path = reader.result
        // 预览图片
        ImagePreview({
          images: [path],
          // 预览框的关闭事件  调用确认框的方法
          onClose: this.closeaffirm()
        })
      })
    },
    // 是否改变图片
    closeaffirm () {
      // 关闭上传的组件
      this.show = false
      // 询问是否删除
      this.$dialog.confirm({
        title: '提示',
        message: '是否将图片设置为头像'
      }).then(async () => {
        // 得到选中的图片
        var file = this.$refs.inputfile.files[0]
        // 将头像上传到服务器
        const { data: res } = await apiaddphoto(file)
        // window.console.log(res)
        // 得到上传的图片路径传到父组件修改父组件的头型显示
        var imgpath = res.data.photo
        this.$emit('changeimg', imgpath)
        // 提示用户上传成功
        this.$toast.success('上传成功')
      }).catch(() => {
        console.log('你已经取消')
      })
    }
  }
}
</script>

<style lang='less'>
.upload {
  .van-popup--center {
    border-radius: 5px;
    .van-cell {
      text-align: center;
    }
  }
}
</style>
