<template>
  <div style="position:relative;margin-top: 10rem">
    <div class="formBox" style="border: solid black 1px;padding: 10px;border-radius: 10px;box-shadow:2px 2px 10px #5a5e66">
      <el-form label-width="120px" ref="securityForm" :model="formData">
        <el-form-item label="实验室楼号：" prop="building_loc" >
          <el-input v-model="formData.building_loc" style="width: 200px" placeholder="1号楼:1"></el-input>
        </el-form-item>
        <el-form-item label="教室号：" prop="classroom_loc">
          <el-input v-model="formData.classroom_loc" style="width: 200px" placeholder="(例:101)"></el-input>
        </el-form-item>
        <el-form-item label="隐患信息介绍：" prop="introduce">
          <el-input v-model="formData.introduce" style=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";

export default {
  name: "submitSecurity",
  data(){
    return {
      formData: {},
    }
  },
  methods: {
    submitForm(){
      this.formData.findPersonId = localStorage.getItem('id')
      PostData('/security/submitSecurity',this.formData).then(res=>{
        console.log(res)
        this.$message.success('提交成功')
        this.$refs.securityForm.resetFields()
      })
    },
  }
}
</script>

<style scoped>
.formBox{
  position:absolute;
  width: 60%;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
}
</style>
