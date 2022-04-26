<template>
  <div style="position:relative">
    <div class="formBox">
      <el-form label-width="120px" ref="uploadForm">
        <el-form-item label="批改老师：">
          <el-input v-model="formData.teacherName"></el-input>
        </el-form-item>
        <el-form-item>
          <input type="file" v-show="false" @change="changeFile($event)" ref="fileInput"></input>
          <p v-if="files">{{files.name}}</p>
          <el-button @click="uploadImgs">{{ files?'重新上传':'上传文件' }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
<!--    <div>-->
<!--      <input v-show="false" type="file" accept="image/*" @change="changeFile($event)" ref="input"/>-->
<!--      <button @click="uploadImgs">上传图片</button>-->
<!--      <div v-for="(item,index) in imgList" class="imgList" :key="Math.random()">-->
<!--        <img style="max-height:100%;max-width:100%;" :src="item"/>-->
<!--        <span class="delete" @click="deleteImg(index)"> X </span>-->
<!--      </div>-->
<!--      <div v-for="(item,index) in imagesList" class="imgList" :key="Math.random()">-->
<!--        <img style="max-height:100%;max-width:100%;" :src="item"/>-->
<!--        <span class="delete" @click="deleteImg(index)"> X </span>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div>-->
<!--      <iframe :src="pSrc" width="100%" height="100%"></iframe>-->
<!--    </div>-->
<!--    <div>-->
<!--      <el-button @click="loadPDF">预览</el-button>-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "uploadReport",
  data(){
    return {
      imgList: [],
      imagesList: [],
      pSrc: '',
      files: null,
      formData: {
        teacherName: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    loadPDF(){
      let baseURL = URL.createObjectURL(this.files)
      const link = document.createElement('a')
      link.href = baseURL
      link.setAttribute('download', this.files.name)
      document.body.appendChild(link)
      link.click()
      // let pSrc = baseURL + '?r='+new Date()
      // this.pSrc = '../../pdf/web/viewer.html?file='+ encodeURIComponent(pSrc)+ '.pdf'
    },
    uploadImgs() {
      this.$refs.fileInput.click();
    },

    deleteImg(index) {
      this.imgList.splice(index, 1)
    },

    changeFile: function (e) {
      console.log("e", e)
      let file = e.target.files[0];
      this.files = file
      console.log("file:", file)
      //本地展示
      //把file对象/blob对象 转化为base64，可以预览
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let _this = this;
      reader.onload = function () {
        _this.imagesList.push(this.result)
        // _this.imagesList.push( "data:image/png;base64," + this.result.substring(this.result.indexOf(",") + 1))
      };
      //上传至服务器后本地展示
      //在上传图片，基本采用的是上传file formData方式。一般上传blob对象和file对象都是可以的，但是
      //有些后台只能是 file对象方式，这个时候需要把blob对象转化为file对象方式。
      let forms = new FormData()
      forms.append('file', file)
      // uploadImg(forms).then(res => {
      //   if (res.status == 200) {
      //     this.imgList.push(res.data.filePath)
      //   } else {
      //
      //   }
      // }).catch(res => {
      //
      // })
    },
  },
}
</script>

<style scoped>
.formBox{
  display: flex;
  justify-content: space-around;
  position:absolute;
  left: 50%;
  top: 50%;
  /*transform: translate(-50%,-50%);*/
}
</style>
