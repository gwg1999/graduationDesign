<template>
  <div>
    <div class="formBox">
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="userQuery.username"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="userQuery.roles" clearable>
            <el-option value="teacher" label="教师"></el-option>
            <el-option value="student" label="学生"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers(1)">查询</el-button>
          <el-button type="primary" @click="insertVisible = true">新增用户</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider></el-divider>

    <div>
      <el-table :data="userData" highlight-current-row fit border>
        <el-table-column align="center" width="80">
          <template v-slot="scope">
            {{scope.$index+(userQuery.pageNum-1)*userQuery.pageSize+1}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名" prop="username"></el-table-column>
        <el-table-column align="center" label="身份" prop="roles">
          <template v-slot="scope">
            {{scope.row.roles==='student'?'学生':scope.row.roles==='teacher'?'教师':'管理员'}}
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
        <el-table-column label="电子邮箱" align="center" prop="email"></el-table-column>
        <el-table-column label="性别" align="center">
          <template v-slot="scope">
            {{scope.row.sex===0?'女':'男'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-button type="primary" @click="deleteUser(scope.row)">注销</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="overflow: hidden">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :page-size="userQuery.pageSize"
          :current-page="userQuery.pageNum"
          @current-change="getUsers"
          class="pagination"
        ></el-pagination>
      </div>
    </div>

    <div>
      <el-dialog :visible.sync="insertVisible" title="添加用户">
        <el-form label-width="120px" :model="formData" :rules="rules" ref="insertUserForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" class="formInput"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="formData.password" class="formInput"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" class="formInput"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" class="formInput"></el-input>
          </el-form-item>
          <el-form-item label="身份" prop="roles">
            <el-select v-model="formData.roles">
              <el-option value="manager" label="管理员"></el-option>
              <el-option value="teacher" label="教师"></el-option>
              <el-option value="student" label="学生"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="formSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import {validEmail,validPhone} from "@/utils/validate";

export default {
  name: "staffManage",
  data(){
    return {
      userQuery: {},
      insertVisible: false,
      formData: {},
      userData: [],
      total: 0,
      rules:{
        phone: [
          {required:true,trigger:'blur',message:'请输入手机号'},
          {validator: validPhone,trigger: 'blur'}
        ],
        email: [{required:true,trigger: 'blur', message: '请输入电子邮箱'}],
        username: [{required:true,trigger: 'blur', message: '请输入用户名'}],
        password: [{required:true,trigger: 'blur', message: '请输入密码'}],
        roles: [{required:true,trigger: 'blur', message: '请选择角色'}],
      }
    }
  },
  created(){
    this.userQuery = new this.queryInit()
    this.getUsers(1)
  },
  methods: {
    queryInit(){
      this.pageSize = 5
      this.pageNum = 1
      this.username = null
      this.roles = null
    },

    deleteUser(userInfo){
      let temp = JSON.parse(JSON.stringify(userInfo))
      temp.status=0
      PostData('/user/deleteUser',temp).then(res=>{
        console.log(res)
        this.getUsers(this.userQuery.pageNum)
        this.$message.success('注销成功')
      })
    },

    getUsers(page=1){
      this.userQuery.pageNum = page
      PostData("/user/getUsers",this.userQuery).then(res=>{
        console.log(res)
        this.userData = res[0]
        this.total = res[1]
      })
    },

    formSubmit(){
      this.$refs.insertUserForm.validate((valid)=>{
        if(valid){
          PostData('/user/insertUser',this.formData).then(res=>{
            // console.log(res)
            this.$refs.insertUserForm.resetFields()
            this.insertVisible = false
            this.getUsers(this.userQuery.pageNum)
          })
        }else{
          this.$message.error('填写错误，请重新填写')
        }
      })
    },
  }
}
</script>

<style scoped>
.pagination{
  float: right;
}
.formInput{
  width: 200px;
}
</style>
