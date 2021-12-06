<template style="background: white">
  <div>
    <!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="oder" :model="oder" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="客户" prop="customName">
            <el-input v-model="oder.customName" style="width: 300px" disabled/>
          </el-form-item>
          <el-form-item label="操作员" prop="adminName">
            <el-input v-model="oder.adminName" style="width: 300px" disabled/>
          </el-form-item>
          <el-form-item label="总价格" prop="indPrice">
            <el-input v-model="oder.iPrice" style="width: 300px" disabled/>
          </el-form-item>
        </div>
        <div style="width: 50%;float: right">
          <el-form-item label="订单状态" prop="iStatus">
            <el-select v-model="oder.iStatus" placeholder="选择订单状态">
              <el-option label="询价中" :value="0"></el-option>
              <el-option label="已询价" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="用户ID" prop="aId">-->
          <!--            <el-input v-model="admin.aId" style="width: 300px"s/>-->
          <!--          </el-form-item>-->
          <el-form-item label="备注" prop="INote">
            <el-input  v-model="oder.iNote" style="width: 300px" type="textarea"/>
          </el-form-item>
          <!--          <el-form-item label="用户密码" prop="aPassword">-->
          <!--            <el-input v-model="admin.aPassword" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="二级密码" prop="aSecondaryPassword">-->
          <!--            <el-input v-model="admin.aSecondaryPassword" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('oder')" >保存</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="backPre">返回</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>


import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import {PostData} from "../../api/index"

export default {
  components:{
    ImageCropper,
    PanThumb
  },
  data() {

    return {
      oder: {
      }
    }

  },
  //路由监听  路由切换问题
  created() {
    this.getList()
  },
  methods: {
    backPre(){
      this.$router.back()
    },//返回上一页
    getList() {
      this.oder=JSON.parse(this.$route.query.oneOder)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/inquiry/ediInquiry',this.oder)
            .then(res=>{
              this.$message({
                type:'success',
                message:'修改成功'
              })
              this.$router.push({path:'/stock'})
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    },
    show(){
      console.log(this.oder);
    }
  }
}
</script>

<style>
body{
  background: white;
}
.content{
  width: 20%;
  height: 20%;
  vertical-align: center;
}
</style>
