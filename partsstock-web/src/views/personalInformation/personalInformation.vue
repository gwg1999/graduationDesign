<template>
  <div class="app-container" style="background: white">
    <el-dialog
      title="修改个人信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <div>
        <el-form  ref="person" :model="person" label-width="120px" :rules="rules">
            <el-form-item label="用户名" prop="aName">
              <el-input v-model="person.aName" style="width: 50%"/>
            </el-form-item>
            <el-form-item label="用户账号" prop="aUsername">
              <el-input disabled v-model="person.aUsername" style="width: 50%"/>
            </el-form-item>
            <el-form-item label="微信号" prop="aWechat">
              <el-input v-model="person.aWechat" style="width: 50%"/>
            </el-form-item>
            <el-form-item label="用户手机号" prop="aPhoneNumber">
              <el-input  v-model="person.aPhoneNumber" style="width: 50%"/>
            </el-form-item>
          <el-form-item label="用户密码" prop="aPassword">
            <el-input  v-model="person.aPassword" style="width: 50%" type="password"/>
          </el-form-item>
          <el-form-item label="二级密码" prop="aSecondaryPassword">
            <el-input  v-model="person.aSecondaryPassword" style="width: 50%" type="password"/>
          </el-form-item>
            <el-form-item label="用户权限" prop="aPermission">
              <el-select v-model="person.aPermission" disabled placeholder="请选择用户权限">
                <el-option label="超级管理员" :value="0"></el-option>
                <el-option label="销售员" :value="1"></el-option>
                <el-option label="进货员" :value="2"></el-option>
                <el-option label="财务员" :value="3"></el-option>
                <el-option label="仓库管理员" :value="4"></el-option>
              </el-select>
            </el-form-item>
<!--          <el-form-item label="是否启用" prop="aIsEnable">-->
<!--            <el-select v-model="person.aIsEnable" disabled placeholder="请选择用户状态">-->
<!--              <el-option label="启用" value="1"></el-option>-->
<!--              <el-option label="禁用" value="0"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('person')">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 表格 -->
<!--    <el-table-->
<!--      :data="list"-->
<!--      highlight-current-row-->
<!--      style="width: 100%">-->
<!--      <el-table-column-->
<!--        label="序号"-->
<!--        width="50%"-->
<!--        align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ (personQuery.pageNum - 1) * personQuery.pageSize + scope.$index + 1 }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="aName" label="用户名" width="130%"  align="center"/>-->
<!--      <el-table-column prop="aUsername" label="用户账号" width="200%" align="center" />-->
<!--      <el-table-column prop="aPassword" label="用户密码" width="120%"  align="center"/>-->
<!--      <el-table-column prop="aSecondaryPassword" label="二级密码" width="120%"  align="center"/>-->
<!--      <el-table-column prop="aPhoneNumber" label="用户手机号" width="200%"  align="center"/>-->
<!--      &lt;!&ndash;      <el-table-column prop="aCreateTime" label="创建时间" width="160%" align="center"/>&ndash;&gt;-->
<!--      <el-table-column prop="aPermission" label="用户权限" width="130%"  align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <h3 v-if="scope.row.aPermission===0">超级管理员</h3>-->
<!--          <h3 v-if="scope.row.aPermission===1">销售员</h3>-->
<!--          <h3 v-if="scope.row.aPermission===2">进货员</h3>-->
<!--          <h3 v-if="scope.row.aPermission===3">财务员</h3>-->
<!--          <h3 v-if="scope.row.aPermission===4">仓库管理员</h3>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="aWechat" label="用户微信" width="200%"  align="center"/>-->
<!--      <el-table-column label="操作" align="center" width="200%">-->
<!--          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetail">修改个人信息</el-button>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

      <el-descriptions class="margin-top" title="个人中心" :column="2" :size="size" border>
        <template slot="extra">
          <el-button type="primary" @click="editInform">修改个人信息</el-button>
        </template>
        <el-descriptions-item style="height: 100px">
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{list.aName}}
        </el-descriptions-item>
        <el-descriptions-item style="height: 100px">
          <template slot="label">
            <i class="el-icon-user"></i>
            用户账号
          </template>
          {{list.aUsername}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{list.aPhoneNumber}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-message"></i>
            微信号
          </template>
          {{list.aWechat}}
        </el-descriptions-item>
<!--        <el-descriptions-item>-->
<!--          <template slot="label">-->
<!--            <i class="el-icon-tickets"></i>-->
<!--            备注-->
<!--          </template>-->
<!--          <el-tag size="small">学校</el-tag>-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item>-->
<!--          <template slot="label">-->
<!--            <i class="el-icon-office-building"></i>-->
<!--            联系地址-->
<!--          </template>-->
<!--          江苏省苏州市吴中区吴中大道 1188 号-->
<!--        </el-descriptions-item>-->
      </el-descriptions>
  </div>
</template>
<script>
import {PostData} from "../../api/index"
import Cookie from "js-cookie"
export default {
  name: "list",
  data(){//定义变量和初始值
    return{
      list: {}, //查询之后接口返回集合
      person: {},
      size: '',
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      personQuery:{
      },
      adminQuery: {
        aId: 1,
        aUsername:null,
        pageNum: 0,
        pageSize: 0,
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
          {required: true, pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ],
        aIsEnable:[
          {required: true, message: "请选择用户状态", trigger: "blur"}
        ],

      },
      saveBtnDisabled: false,
      selectCondition: {},
      pageTotal: 0,
      dialogVisible: false
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
  },
  methods:{//创建具体的方法
    getList() {
      this.personQuery.aId=Cookie.get('aId')
      PostData('/admin/selectOne',this.personQuery)
        .then(res=>{
          this.list = res
          console.log(res);
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    editInform(){
      this.person=Object.assign({},this.list)
      this.dialogVisible=true
    },
    getOne(){
      this.adminQuery.aId = 1
      // this.adminQuery.aUsername=Cookie.get('username')
      PostData('/admin/selectOne',this.adminQuery)
        .then(res=>{
          this.person = res
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    getListByLike(){
      PostData('/admin/selectAllByLike',this.personQuery)
        .then(res=>{
          this.list=res
          console.log(res);
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    showDetail(){
      this.dialogVisible=true
      this.getOne()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/admin/update',this.person)
            .then(res=>{
              console.log(res);
              this.$message({
                type:'success',
                message:'修改个人信息成功'
              })
              this.dialogVisible=false
              this.getList()
              this.getPageTotal()
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
<style scoped>

</style>
