<template>
  <div class="app-container" style="background: white">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
        <el-form-item>
          <!--          <el-input v-model="customerQuery.cuUnitName" clearable placeholder="用户名"  style="width: 150px"/>-->
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="请输入用户名"
            :trigger-on-focus="false"
            @select="handleSelect">
            <!--      <i-->
            <!--        class="el-icon-edit el-input__icon"-->
            <!--        slot="suffix"-->
            <!--        @click="handleIconClick">-->
            <!--      </i>-->
            <template slot-scope="{ item }">
              <div>{{ item.aName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
          <el-input type="text" v-model="adminQuery.aPhoneNumber" placeholder="请输入手机号" style="width: 45%;left: 10px"></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查 询</el-button>


        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="toInsert()">添加</el-button>
      </template>
    </el-form>
    <el-dialog
      :title=title
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
      <div>
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
                <!--              <el-option label="超级管理员" value="0"></el-option>-->
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
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注信息" prop="aInformation">
              <el-input v-model="admin.aInformation" style="width: 300px" type="textarea"/>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" :disabled='isEnable' @click="submitForm('admin')">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="序号"
        width="50%"
        align="center">
        <template slot-scope="scope">
          {{ (adminQuery.pageNum - 1) * adminQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="aName" label="用户名" width="130%"  align="center"/>
      <el-table-column prop="aUsername" label="用户账号" width="200%" align="center" />
<!--      <el-table-column prop="aPassword" label="用户密码" width="120%"  align="center"/>-->
      <el-table-column prop="aPhoneNumber" label="用户手机号" width="200%"  align="center"/>
<!--      <el-table-column prop="aCreateTime" label="创建时间" width="160%" align="center"/>-->
<!--      <el-table-column prop="aSecondaryPassword" label="二级密码" width="120%"  align="center"/>-->
      <el-table-column prop="aPermission" label="用户权限" width="130%"  align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.aPermission===0">超级管理员</h3>
          <h3 v-if="scope.row.aPermission===1">销售员</h3>
          <h3 v-if="scope.row.aPermission===2">进货员</h3>
          <h3 v-if="scope.row.aPermission===3">财务员</h3>
          <h3 v-if="scope.row.aPermission===4">仓库管理员</h3>
        </template>
      </el-table-column>
      <el-table-column prop="aWechat" label="用户微信" width="200%"  align="center"/>
<!--      <el-table-column prop="cuCourier" label="默认物流" width="50%"  align="center"/>-->
<!--      <el-table-column prop="cuDiscount" label="默认折扣" width="50%" align="center" />-->
<!--      <el-table-column prop="cuDefaultPayment" label="默认支付方式" width="80%"  align="center"/>-->
<!--      <el-table-column prop="cuName" label="联系人姓名" width="100%" align="center" />-->
      <el-table-column prop="aIsEnable" label="状态" width="90%" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.aIsEnable === 1
                    ? 'success'
                    : scope.row.aIsEnable === 0
                    ? 'danger'
                    : ''
               "
          >{{scope.row.aIsEnable===1?'启用':'禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.row)">查看详情</el-button>
          <el-button  size="mini" icon="el-icon-edit"
                      :type="scope.row.aIsEnable === 1
                                ? 'danger'
                                : scope.row.aIsEnable === 0
                                ? 'success'
                                : ''
                          "
                      @click="editCancel(scope.$index,scope.row)">{{ scope.row.aIsEnable===1?'禁用':'启用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="adminQuery.pageSize"
      :current-page="adminQuery.pageNum"
      :total="pageTotal"
      style="padding: 30px 0; text-align: right;"
      @current-change="handlePageChange"
    />
  </div>
</template>
<script>
import {PostData} from "../../api/index"
import qs from 'qs'
export default {
  name: "staff",
  data(){//定义变量和初始值
    return{
      list: [], //查询之后接口返回集合
      title:'',
      isEnable:false,
      dialogVisible:false,
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      adminQuery:{
        aId:null,
        aName:null,
        aPhoneNumber:null,
        aPermission:null,
        pageSize: 10,
        pageNum: 1,
      },
      admin:{},
      selectCondition: {},
      pageTotal: 0,
      rules:{
        aName:[
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        aUsername:[
          {required: true, message: "请输入用户账号", trigger: "blur"},
          { pattern: /^[\w\-\_]+\-[\w\-\_]+$/,message: '用户账号格式不正确,例如：Ad-wzs001'}
        ],
        aPassword:[
          {required: true, message: "请输入用户密码", trigger: "blur"}
        ],
        // aSecondaryPassword:[
        //   {required: true, message: "请输入二级密码", trigger: "blur"}
        // ],
        // aWechat:[
        //   {required: true, message: "请输入微信号", trigger: "blur"}
        // ],
        // aPhoneNumber:[
        //   {required: true, message: "请输入手机号", trigger: "blur"},
        //   {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        // ],
        aPermission:[
          {required: true, message: "请填写用户权限", trigger: "blur"}
        ],
        aIsEnable:[
          {required: true, message: "请选择用户状态", trigger: "blur"}
        ],
      }
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    // this.getPageTotal()
  },
  resetData(){
    this.getList()
    // this.getPageTotal()
  },
  methods:{//创建具体的方法
    getList() {
      PostData('admin/selectAllByLike',qs.stringify(this.adminQuery))
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    enable(){
      setTimeout(()=>{
        this.isEnable=false
      },500)
    },
    toInsert(){
      this.admin={aIsEnable:1}
      this.title='添加操作员'
      this.dialogVisible=true
    },
    getListByLike(){
      this.adminQuery.aName=this.state
      this.adminQuery.pageNum=1
      PostData('admin/selectAllByLike',qs.stringify(this.adminQuery))
        .then(res=>{
          this.list=res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },

    getPageTotal(){
      this.selectCondition = JSON.parse(JSON.stringify(this.adminQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('admin/selectAdmin',this.selectCondition).then(res=>{
        this.pageTotal = res.length
      })
    },
    // 分页处理
    handlePageChange(val){
      this.adminQuery.pageNum = val
      this.getList()
    },
    search(){
      this.adminQuery.pageNum = 1
      this.getListByLike()
      // this.getPageTotal()
      // alert(111)
    },
    // 跳转详情页
    showDetails(data){
      this.admin=Object.assign({},data)
      this.title='操作员详情'
      console.log(this.admin);
      this.dialogVisible=true
      // localStorage.setItem('aId',index)
      // this.$router.push('/maintain/editStaff')
    },
    editCancel(index,param){
      this.$confirm('是否将该用户'+(param.aIsEnable===0?'启用':'禁用')+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].aIsEnable = 1 - this.list[index].aIsEnable
        PostData('admin/update',this.list[index])
          .then(res=>{
            this.getList()
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          })
      })
    },
    querySearch(queryString, cb) {
      this.adminQuery.aName=queryString;
      this.adminQuery.pageNum=1
      PostData('admin/selectAllByLike',qs.stringify(this.adminQuery)).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleSelect(item) {
      this.state=item.aName
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.admin.aId){
            PostData('/admin/update',this.admin)
              .then(res=>{
                console.log(res);
                if(res.code===500){
                  this.$message({
                    type:'warning',
                    message:res.cause
                  })
                }
                else {
                  this.$message({
                    type:'success',
                    message:'修改用户成功'
                  })
                  this.dialogVisible=false
                  this.getList()
                }
              }).catch(()=>{})
          }
          else {
            this.isEnable=true
            PostData('admin/insert',this.admin)
              .then(res=>{
                console.log(res);
                if(res.code===500){
                  this.$message({
                    type:'warning',
                    message:res.cause
                  })
                  this.enable()
                }
                else {
                  this.$message({
                    type:'success',
                    message:'添加用户成功'
                  })
                  this.enable()
                  this.getList()
                  this.dialogVisible=false
                }
              }).catch(()=>{})
          }
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
.dialog-footer{
  margin-right: 100px;
}
</style>
