<template>
  <div class="container">
    <div class="formBox" v-if="!modifyInfo">
      <el-form label-width="120px" class="form" :model="personInfo">
        <el-form-item label="用户名：" prop="username">
          <span>{{personInfo.username}}</span>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <span>{{personInfo.phone}}</span>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <span>{{personInfo.sex===1?'男':'女'}}</span>

        </el-form-item>
        <el-form-item label="身份：" prop="roles">
          <span>{{personInfo.roles==='manager'?'管理员':personInfo.roles==='teacher'?'教师':'学生'}}</span>
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="email">
          <span>{{personInfo.email}}</span>
        </el-form-item>
        <el-form-item label="个人介绍：">
          <span>{{personInfo.introduce || '对方很懒，什么都没写'}}</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="modifyVisible = true">修改密码</el-button>
          <el-button type="primary" @click="modifyPersonInfo">修改信息</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="modifyInfo" class="formBox">
      <el-form label-width="120px" class="form" :model="formData" :rules="rules" ref="modifyInfo">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="formData.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份：" prop="roles">
          <el-select v-model="formData.roles">
            <el-option value="manager" label="管理员"></el-option>
            <el-option value="teacher" label="教师"></el-option>
            <el-option value="student" label="学生"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="个人介绍：">
          <el-input v-model="formData.introduce"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitModify">确定</el-button>
          <el-button type="primary" @click="cancelModify">取消</el-button>
        </el-form-item>
      </el-form>
    </div>


    <div>
      <el-dialog title="修改密码" :visible.sync="modifyVisible" @close="handleClose">
        <el-form label-width="120px" :model="formData" :rules="checkRules" ref="passwordForm">
          <el-form-item label="旧密码"  v-if="!confirmPassword" prop="oldPassword">
            <el-input v-model="formData.oldPassword" type="password" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item  v-if="!confirmPassword">
            <el-button type="primary" @click="validOldPwd">确认</el-button>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword"  v-if="confirmPassword">
            <el-input v-model="formData.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="repeatPassword" v-if="confirmPassword">
            <el-input v-model="formData.repeatPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item v-if="confirmPassword">
            <el-button type="primary" @click="confirmModify">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import {validPhone} from "@/utils/validate";

export default {
  name: "PersonInfo",
  data(){
    let checkPasswordRepeat = (rule,value,callback)=>{
      if(value !== this.formData.newPassword){
        callback(new Error('密码不一致'))
      }else{
        callback()
      }
    }
    return {
      personInfo: {},
      formData: {},
      modifyVisible:false,
      modifyInfo:false,
      confirmPassword: false,
      rules: {
        phone: [
          {required:true,trigger:'blur',message:'请输入手机号'},
          {validator: validPhone,trigger: 'blur'}
        ],
        email: [{required:true,trigger: 'blur', message: '请输入电子邮箱'}],
        username: [{required:true,trigger: 'blur', message: '请输入用户名'}],
        password: [{required:true,trigger: 'blur', message: '请输入密码'}],
        roles: [{required:true,trigger: 'blur', message: '请选择角色'}],
      },
      checkRules: {
        newPassword: [{required:true,trigger: 'blur', message: '请输入密码'}],
        repeatPassword: [
          {required: true, trigger: 'blur', message: '请再次输入密码'},
          {validator:checkPasswordRepeat, trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo(){
      PostData('/user/getInfo',{index: localStorage.getItem('id')}).then(res=>{
        this.personInfo = res
        this.formData = JSON.parse(JSON.stringify(this.personInfo))
      })
    },

    submitModify(){
      PostData('/user/updateUser',this.formData).then(()=>{
        this.personInfo = JSON.parse(JSON.stringify(this.formData))
        this.modifyInfo = false
      })
    },

    cancelModify(){
      // this.modifyInfo = false
      this.$refs.modifyInfo.resetFields()
      this.modifyInfo = false
    },

    modifyPersonInfo(){
      this.modifyInfo = true
      this.formData = JSON.parse(JSON.stringify(this.personInfo))
    },

    validOldPwd(){
      PostData('/user/validPassword',this.formData).then(res=>{
        console.log(res)
        if(res!=='密码错误'){
          this.confirmPassword = true
        }else{
          this.$message.error('密码错误，请重新输入')
        }
      })
    },

    confirmModify(){
      PostData('/user/modifyPassword',this.formData).then(res=>{
        console.log(res)
        this.$message.success('修改成功，下次登陆生效')
      }).catch(err=>{
        this.$message.error('修改失败，请重试')
      })
    },

    handleClose(){
      this.$refs.passwordForm.resetFields()
      this.confirmPassword = false
      this.modifyVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  //border:solid black 1px;
  min-height: calc(100vh - 50px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: darkgray;
}
.formBox{
  width: 60%;
  background-color: white;
  padding: 20px;
  overflow: hidden;
  border-radius: 10px;
}
.form{
  //position: relative;
  //top: 100px;
  .formInput {
    width: 120px;
  }
}
</style>
