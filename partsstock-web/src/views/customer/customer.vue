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
            placeholder="输入客户名称"
            :trigger-on-focus="false"
            @select="handleSelect">
            <!--      <i-->
            <!--        class="el-icon-edit el-input__icon"-->
            <!--        slot="suffix"-->
            <!--        @click="handleIconClick">-->
            <!--      </i>-->
            <template slot-scope="{ item }">
              <div>{{ item.cuUnitName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
          <el-input placeholder="请输入客户地址" type="text" v-model="customerQuery.cuAddress" style="width: 25%;left: 5px"></el-input>
          <el-input placeholder="请输入电话号码" type="text" v-model="customerQuery.cuPhoneNumber" style="width: 25%;left: 10px"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="search" style="position: relative;left: 15px">查 询</el-button>
        </el-form-item>
        <el-select v-model="value" placeholder="选择用户权限" @change="selectChang" style="position: relative;left: 1%">
          <el-option
            v-for="item in permissions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <span>{{ item.label }}</span>
<!--            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
          </el-option>
        </el-select>


        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="toInsert()">添加</el-button>
      </template>
    </el-form>
    <el-dialog
      :title=title
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
      <div>
        <el-form  ref="customer" :model="customer" label-width="120px" :rules="rules">
          <div style="width: 50%;float: left">
            <el-form-item label="客户名称" prop="cuUnitName">
              <el-input v-model="customer.cuUnitName" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="客户代码" prop="cuCode">
              <el-input v-model="customer.cuCode" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="电话号码" prop="cuPhoneNumber">
              <el-input v-model="customer.cuPhoneNumber" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="备用电话1" prop="cuPhoneNumber1">
              <el-input v-model="customer.cuPhoneNumber1" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="备用电话2" prop="cuPhoneNumber2">
              <el-input v-model="customer.cuPhoneNumber2" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="用户密码" prop="cuPassword">
              <el-input v-model="customer.cuPassword" show-password style="width: 300px"/>
            </el-form-item>
            <el-form-item label="客户地址" prop="cuAddress">
              <el-input v-model="customer.cuAddress" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="银行卡账号" prop="cuAccount">
              <el-input v-model="customer.cuAccount" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="联系人名称" prop="cuPersonId">
              <el-input v-model="customer.cuPersonId" style="width: 300px"/>
            </el-form-item>
          </div>
          <div style="width: 50%;float: right">
            <el-form-item label="开户行" prop="cuBankName">
              <el-input v-model="customer.cuBankName" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="税号" prop="cuTaxNumber">
              <el-input v-model="customer.cuTaxNumber" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="默认物流" prop="cuCourier">
              <el-input v-model="customer.cuCourier" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="备用物流" prop="cuSpareCourier">
              <el-input v-model="customer.cuSpareCourier" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="操作员" prop="cuAdminId">
              <el-select v-model="customer.cuAdminId">
                <el-option
                  v-for="item in admin"
                  :key="item.aId"
                  :label="item.aName"
                  :value="item.aId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="默认折扣" prop="cuDiscount">
              <el-select v-model="customer.cuDiscount" style="width: 230px" placeholder="请选择折扣">
                <el-option value="一级价格">一级价格</el-option>
                <el-option value="二级价格">二级价格</el-option>
                <el-option value="三级价格">三级价格</el-option>
              </el-select>
            </el-form-item>
            <!--          <el-form-item label="默认折扣" prop="cuDiscount">-->
            <!--&lt;!&ndash;            <el-input v-model="customer.cuDiscount" style="width: 300px"/>&ndash;&gt;-->
            <!--            <el-select v-model="customer.cuDiscount">-->
            <!--              <option value="" label="一级价格"></option>-->
            <!--              <option value="" label="二级价格"></option>-->
            <!--              <option value="" label="三级价格"></option>-->
            <!--            </el-select>-->
            <!--          </el-form-item>-->
            <el-form-item label="默认支付方式" prop="cuDefaultPayment">
              <!--            <el-input v-model="customer.cuDefaultPayment" style="width: 300px"/>-->
              <el-select v-model="customer.cuDefaultPayment" placeholder="请选择默认支付方式">
                <el-option label="微信" value="0"></el-option>
                <el-option label="支付宝" value="1"></el-option>
                <el-option label="信用卡" value="2"></el-option>
              </el-select>
            </el-form-item >
            <el-form-item label="用户权限" prop="cuPermission">
              <!--            <el-input v-model="admin.aPermission" style="width: 300px"/>-->
              <el-select v-model="customer.cuPermission" placeholder="请选择用户权限">
                <el-option label="进货员" :value="0"></el-option>
                <el-option label="销售员" :value="1"></el-option>
                <el-option label="进货销售员" :value="2"></el-option>
              </el-select>
            </el-form-item>
<!--            <el-form-item>-->
<!--              <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('customer')" >保存</el-button>-->
<!--            </el-form-item>-->
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" :disabled='isEnable' @click="submitForm('customer')">确 定</el-button>
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
          {{ (customerQuery.pageNum - 1) * customerQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="cuUnitName" label="客户名称" width="120%"  align="center"/>
      <el-table-column prop="cuCode" label="客户代码" width="120%"  align="center"/>
      <el-table-column prop="cuPhoneNumber" label="电话号码" width="110%"  align="center"/>
<!--      <el-table-column prop="cuPhoneNumber1" label="备用电话1" width="110%" align="center" />-->
<!--      <el-table-column prop="cuPhoneNumber2" label="备用电话2" width="110%"  align="center"/>-->
      <el-table-column prop="cuAddress" label="客户地址" width="130%"  align="center"/>
<!--      <el-table-column prop="cuAccount" label="银行卡账号" width="120%" align="center"/>-->
<!--      <el-table-column prop="cuBankName" label="开户行" width="80%"  align="center"/>-->
      <el-table-column prop="cuTaxNumber" label="税号" width="120%"  align="center"/>
      <el-table-column prop="cuCourier" label="默认物流" width="80%"  align="center"/>
<!--      <el-table-column prop="cuSpareCourier" label="备用物流" width="50%"  align="center"/>-->
      <el-table-column prop="cuDiscount" label="默认折扣" width="60%" align="center" />
      <el-table-column prop="cuDefaultPayment" label="默认支付方式" width="80%"  align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.cuDefaultPayment==='0'">微信</h3>
          <h3 v-if="scope.row.cuDefaultPayment==='1'">支付宝</h3>
          <h3 v-if="scope.row.cuDefaultPayment==='2'">信用卡</h3>
        </template>
      </el-table-column>
<!--      <el-table-column prop="cuName" label="联系人姓名" width="80%" align="center" />-->
      <el-table-column prop="cuPermission" label="用户权限" width="110%"  align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.cuPermission===0">进货客户</h3>
          <h3 v-if="scope.row.cuPermission===1">销售客户</h3>
          <h3 v-if="scope.row.cuPermission===2">进货销售客户</h3>
        </template>
      </el-table-column>
      <el-table-column label="归属业务员" width="120%" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showStaff(scope.row.cuId)">查看</el-button>
        </template>
      </el-table-column>
<!--      <el-table-column label="单位员工" width="120%" align="center" >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" size="mini" icon="el-icon-edit">查看</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="customerQuery.pageSize"
      :current-page="customerQuery.pageNum"
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
  name: "list",
  data(){//定义变量和初始值
    return{
      list: [], //查询之后接口返回集合
      list1:[],
      admin:[],
      customer:{},
      title:'',
      dialogVisible:false,
      isEnable:false,
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      customerQuery:{
        cuUnitName:'',
        cuPhoneNumber:'',
        cuAddress:'',
        pageSize: 10,
        pageNum: 1,
      },
      adminQuery:{
        pageSize: 10,
        pageNum: 1,
      },
      permissions: [{
        value: '-1',
        label: '全部'
      },
        {
        value: '0',
        label: '进货客户'
      }, {
        value: '1',
        label: '销售客户'
      }, {
        value: '2',
        label: '进货销售客户'
      }
      ],
      value: '',
      selectCondition: {},
      pageTotal: 0,
      rules: {
        cuUnitName: [
          {required: true, message: "请输入客户名", trigger: "blur"},
        ],
        cuCode:[
          {required: true, message: "请输入客户代码", trigger: "blur"},
        ],
        cuPhoneNumber: [
          {required: true, message: "请输入电话号码", trigger: "blur"},
          {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ],
        // cuPhoneNumber1: [
        //   {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        // ],
        // cuPhoneNumber2: [
        //   {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        // ],
        cuPersonId:[
          {required: true, message: "请输入联系人名称", trigger: "blur"},
        ],
        // cuPassword: [
        //   {required: true, message: "请输入用户密码", trigger: "blur"},
        // ],
        cuName: [
          {required: true, message: "请输入联系人姓名", trigger: "blur"},
        ],
        cuAdminId:[
          {required: true, message: "请选择操作员", trigger: "blur"},
        ],
        cuPermission: [
          {required: true, message: "请输入用户权限", trigger: "blur"},
        ],
        cuCourier: [
          {required: true, message: "请输入默认物流", trigger: "blur"},
        ],
        cuDiscount: [
          {required: true, message: "请输入默认折扣", trigger: "blur"},
        ],
        cuDefaultPayment: [
          {required: true, message: "请输入默认支付方式", trigger: "blur"},
        ],
        cuAddress: [
          {required: true, message: "请输入客户地址", trigger: "blur"},
        ],
        // cuAccount:[
        //   {required: true, pattern: /^([1-9]{1})(\d{14}|\d{18})$/,message: '银行卡号不正确',trigger: "blur"}
        // ]
      },
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    // this.getPageTotal()
  },
  methods:{//创建具体的方法
    getList() {
      PostData('customer/selectAllByLike',this.customerQuery)
        .then(res=>{
          this.list = res.list
          this.list1=res.list
          console.log(res.list);
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
      PostData('admin/selectAllByLike',qs.stringify(this.adminQuery))
        .then(res=>{
          this.admin = res.list
          console.log(this.admin);
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    selectChang(){
      if(parseInt(this.value)===-1){
        this.list=this.list1
      }
      else {
        this.list=this.list1.filter((item)=>{
          return item.cuPermission===parseInt(this.value)
        })
      }
    },//用户权限发生改变时调用该方法
    toInsert(){
      this.title='添加客户'
      this.customer={}
      this.dialogVisible=true
      // this.$router.push('/maintain/customer/customerAdd')
    },
    enable(){
      setTimeout(()=>{
        this.isEnable=false
      },500)
    },
    getListByLike(){
      this.customerQuery.cuUnitName=this.state
      this.customerQuery.pageNum=1
      PostData('customer/selectAllByLike',this.customerQuery)
        .then(res=>{
          this.list=res.list
          this.pageTotal=res.total
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
    getPageTotal(){
      this.selectCondition = JSON.parse(JSON.stringify(this.customerQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('/customer/selectAllByLike',this.selectCondition).then(res=>{
        this.pageTotal = res.length
      })
    },
    // 分页处理
    handlePageChange(val){
      this.customerQuery.pageNum = val
      this.getList()
    },
    search(){
       this.customerQuery.pageNum = 1
       this.getListByLike()
       // this.getPageTotal()
        // alert(111)
    },
    // 跳转详情页
    showDetails(data){
      console.log(data);
      this.title='客户详情'
      this.customer=Object.assign({},data)
      this.dialogVisible=true
      // localStorage.setItem('cuId',this.list[index].cuId)
      // this.$router.push('/maintain/customer/editCustomer')
    },
    showStaff(id){
      localStorage.setItem('cuId',id)
      this.$router.push('/maintain/customer/staffList')
    },
    editCancel(index,param){
      this.$confirm('是否将此零件'+(param.pPartsStatus===0?'上架':'下架')+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].pPartsStatus = 1 - this.list[index].pPartsStatus
        PostData('parts/update',this.list[index])
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
      this.customerQuery={
        cuUnitName:'',
        cuPhoneNumber:'',
        cuAddress:'',
        pageSize: 10,
        pageNum: 1,
      }
      this.customerQuery.cuUnitName=queryString;
      this.customerQuery.pageNum=1
      PostData('customer/selectAllByLike',this.customerQuery).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.cuUnitName
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.customer.cuId){
            PostData('/customer/update',this.customer)
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
            console.log(this.customer);
            PostData('customer/insert',this.customer)
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
                  this.dialogVisible=false
                  this.enable()
                  this.getList()
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
