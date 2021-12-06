<template style="background: white">
  <div>
    <!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 400px;top: 60px">
      <el-form  ref="staffList" :model="staffList" label-width="120px" :rules="rules">
<!--        <div style="width: 50%;float: left">-->
          <el-form-item label="业务员名" prop="sName">
            <el-input disabled v-model="staffList.sName" style="width: 300px"/>
          </el-form-item>
          <!--          <el-form-item label="用户ID" prop="aId">-->
          <!--            <el-input v-model="admin.aId" style="width: 300px"s/>-->
          <!--          </el-form-item>-->
          <el-form-item label="业务员职位" prop="sJob">
            <el-input v-model="staffList.sJob" style="width: 300px"/>
          </el-form-item>
          <!--          <el-form-item label="用户密码" prop="aPassword">-->
          <!--            <el-input v-model="admin.aPassword" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="二级密码" prop="aSecondaryPassword">-->
          <!--            <el-input v-model="admin.aSecondaryPassword" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="业务员住址" prop="sAddress">
            <el-input v-model="staffList.sAddress" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="联系方式" prop="sTelephone">
            <el-input  v-model="staffList.sTelephone" style="width: 300px"/>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="backpre">返回</el-button>
          </el-form-item>
<!--        </div>-->
<!--        <div style="width: 50%;float: right">-->
<!--          <el-form-item label="联系方式" prop="aPhoneNumber">-->
<!--            <el-input  v-model="staffList.aPhoneNumber" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="用户权限" prop="aPermission">-->
<!--            &lt;!&ndash;            <el-input v-model="admin.aPermission" style="width: 300px"/>&ndash;&gt;-->
<!--            <el-select v-model="staffList.aPermission" placeholder="请选择用户权限">-->
<!--              <el-option label="超级管理员" value="0"></el-option>-->
<!--              <el-option label="销售员" value="1"></el-option>-->
<!--              <el-option label="进货员" value="2"></el-option>-->
<!--              <el-option label="财务员" value="3"></el-option>-->
<!--              <el-option label="仓库管理员" value="4"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          &lt;!&ndash;          <el-form-item label="创建时间" prop="aCreateTime">&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-input disabled v-model="admin.aCreateTime" style="width: 300px"/>&ndash;&gt;-->
<!--          &lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--          <el-form-item label="是否启用" prop="aIsEnable">-->
<!--            &lt;!&ndash;            <el-input v-model="admin.aIsEnable" style="width: 300px"/>&ndash;&gt;-->
<!--            <el-select v-model="staffList.aIsEnable" placeholder="请选择用户状态">-->
<!--              <el-option label="启用" value="1"></el-option>-->
<!--              <el-option label="禁用" value="0"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="备注信息" prop="aInformation">-->
<!--            <el-input v-model="staffList.aInformation" style="width: 300px" type="textarea"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate" >保存</el-button>-->
<!--          </el-form-item>-->
<!--        </div>-->
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
      staffList: {},
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      staffQuery: {
        sId: 0,
        sName: '',
        sTelephone:'',
        sJob:'',
        sAddress:''
      },
      rules:{
        aName:[
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        aUsername:[
          {required: true, message: "请输入用户账号", trigger: "blur"}
        ],
        // aSecondaryPassword:[
        //   {required: true, message: "请输入二级密码", trigger: "blur"}
        // ],
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
  //路由监听  路由切换问题
  created() {
    this.staffQuery.sId = localStorage.getItem('sId')
    this.getList()
  },
  methods: {
    backpre(){
      this.$router.back()
    },
    getList() {
      console.log(this.staffQuery)
      PostData('/staff/selectOne',this.staffQuery)
        .then(res=>{
          this.staffList = res
        })
    },
    saveOrUpdate(){
      PostData('/staff/update',this.staffList)
        .then(res=>{
          console.log(res);
          this.$message({
            type:'success',
            message:'保存信息成功'
          })
        })
      this.$router.push({path:'/maintain/customer/staffList'})
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
