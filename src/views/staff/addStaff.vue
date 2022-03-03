<template>
  <div>
<!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="admin" :model="admin" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="用户名" prop="aName">
            <el-input v-model="admin.aName" style="width: 300px"/>
          </el-form-item>
<!--          <el-form-item label="用户ID" prop="aId">-->
<!--            <el-input v-model="admin.aId" style="width: 300px"s/>-->
<!--          </el-form-item>-->
          <el-form-item label="用户账号" prop="aUsername">
            <el-input v-model="admin.aUsername" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="用户密码" prop="aPassword">
            <el-input  v-model="admin.aPassword" show-password style="width: 300px"/>
          </el-form-item>
          <el-form-item label="二级密码" prop="aSecondaryPassword">
            <el-input v-model="admin.aSecondaryPassword" show-password style="width: 300px"/>
          </el-form-item>
          <el-form-item label="微信号" prop="aWechat">
            <el-input v-model="admin.aWechat" style="width: 300px"/>
          </el-form-item>
        </div>
        <div style="width: 50%;float: right">
          <el-form-item label="用户手机号" prop="aPhoneNumber">
            <el-input  v-model="admin.aPhoneNumber" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="用户权限" prop="aPermission">
<!--            <el-input v-model="admin.aPermission" style="width: 300px"/>-->
            <el-select v-model="admin.aPermission" placeholder="请选择用户权限">
              <el-option label="超级管理员" :value="0"></el-option>
              <el-option label="销售员" :value="1"></el-option>
              <el-option label="进货员" :value="2"></el-option>
              <el-option label="财务员" :value="3"></el-option>
              <el-option label="仓库管理员" :value="4"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="创建时间" prop="aCreateTime">-->
<!--            <el-input disabled v-model="admin.aCreateTime" style="width: 300px"/>-->
<!--          </el-form-item>-->
          <el-form-item label="是否启用" prop="aIsEnable">
<!--            <el-input v-model="admin.aIsEnable" style="width: 300px"/>-->
            <el-select v-model="admin.aIsEnable" placeholder="请选择用户状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息" prop="aInformation">
            <el-input v-model="admin.aInformation" style="width: 300px" type="textarea"/>
          </el-form-item>
          <el-form-item style="position: absolute; right: 37%;bottom: 5%">
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('admin')" >保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import {PostData} from "@/api";
export default {
  components:{
    ImageCropper,
    PanThumb
  },
  data() {
    return {
      admin: {},
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      adminQuery:{
        pageSize: 10,
        pageNum: 1,
        aId: 0
      },
      query:{
        pageSize: 10,
        pageNum: 1
      },
      rules:{
        aName:[
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        aUsername:[
          {required: true, message: "请输入用户账号", trigger: "blur"},
          {required: true, pattern: /^[\w\-\_]+\-[\w\-\_]+$/,message: '用户账号格式不正确,例如：Ad-wzs001',trigger: "blur"}
        ],
        aPassword:[
          {required: true, message: "请输入用户密码", trigger: "blur"}
        ],
        aSecondaryPassword:[
          {required: true, message: "请输入二级密码", trigger: "blur"}
        ],
        aWechat:[
          {required: true, message: "请输入微信号", trigger: "blur"}
        ],
        aPhoneNumber:[
          {required: true, message: "请输入手机号", trigger: "blur"},
          {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ],
        aPermission:[
          {required: true, message: "请填写用户权限", trigger: "blur"}
        ],
        aIsEnable:[
          {required: true, message: "请选择用户状态", trigger: "blur"}
        ],
      }
    }
  },
  created() {
  },
  // computed:{
  //   isSubmit(){
  //     return (this.admin.aName==='' && this.admin.aUsername==='' && this.admin.aSecondaryPassword==='' && this.admin.aWechat==='' && this.admin.aPhoneNumber==='' && this.admin.aPermission==='' && this.admin.aIsEnable==='')
  //   }
  // },
  methods: {
    save(){

    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.admin);
          PostData('admin/insert',this.admin)
            .then(res=>{
              console.log(res);
              this.$message({
                type:'success',
                message:'添加用户成功'
              })
              this.$router.push({path:'/maintain/staff'})
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    },
  }
}
</script>

<style>
body{
  background: white;
}

</style>
