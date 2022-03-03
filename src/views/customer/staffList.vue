<template>
  <div class="app-container" style="background: white">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
        <el-form-item>
          <!--          <el-input v-model="supplierQuery.sName" clearable placeholder="供应商"  style="width: 150px"/>-->
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="请输入业务员名称"
            :trigger-on-focus="false"
            @select="handleSelect">
            <!--      <i-->
            <!--        class="el-icon-edit el-input__icon"-->
            <!--        slot="suffix"-->
            <!--        @click="handleIconClick">-->
            <!--      </i>-->
            <template slot-scope="{ item }">
              <div>{{ item.sName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查 询</el-button>


        <el-button type="primary" icon="el-icon-circle-plus"style="position: absolute;right: 10px" @click="openAdd">添加</el-button>
      </template>
    </el-form>
    <el-dialog
      :title=title
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form  ref="staffList" :model="staffList" label-width="120px" :rules="rules">
          <el-form-item label="业务员名" prop="sName">
            <el-input v-model="staffList.sName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="业务员职位" prop="sJob">
            <el-input v-model="staffList.sJob" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="业务员住址" prop="sAddress">
            <el-input v-model="staffList.sAddress" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="联系方式" prop="sTelephone">
            <el-input v-model="staffList.sTelephone" style="width: 300px"/>
          </el-form-item>
<!--          <el-form-item label="备注信息" prop="aInformation">-->
<!--            <el-input v-model="staffList.sInformation" style="width: 300px" type="textarea"/>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('staffList')">确 定</el-button>
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
          {{ (staffQuery.pageNum - 1) * staffQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="sName" label="业务员名" width="250%"  align="center"/>
      <el-table-column prop="sJob" label="业务员职位" width="250%"  align="center"/>
      <!--      <el-table-column prop="sCity" label="供应商所在城市" width="120%"  align="center"/>-->
      <!--      <el-table-column prop="sImage" label="供应商形象" width="100%"  align="center"/>-->
      <!--      <el-table-column prop="sInformation" label="供应商信息" width="150%" align="center" />-->
      <!--      <el-table-column prop="sIsEnabled" label="是否正常供货" width="120%" align="center"/>-->
      <el-table-column prop="sAddress" label="业务员住址" width="300%"  align="center"/>
      <!--      <el-table-column prop="sProvince" label="所在省份" width="100%" align="center"/>-->
      <!--      <el-table-column prop="sRegion" label="所在区域" width="200%" align="center"/>-->
      <el-table-column prop="sTelephone" label="联系方式" width="150%"  align="center"/>
      <!--      <el-table-column prop="sIsEnabled" label="状态" width="80%" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag-->
      <!--            :type="scope.row.sIsEnabled === 1-->
      <!--                    ? 'success'-->
      <!--                    : scope.row.sIsEnabled === 0-->
      <!--                    ? 'danger'-->
      <!--                    : ''-->
      <!--               "-->
      <!--          >{{scope.row.sIsEnabled===1?'启用':'未启用'}}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="cuDiscount" label="默认折扣" width="50%" align="center" />-->
      <!--      <el-table-column prop="cuDefaultPayment" label="默认支付方式" width="80%"  align="center"/>-->
      <!--      <el-table-column prop="cuName" label="联系人姓名" width="100%" align="center" />-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.row)">查看详情</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteStaff(scope.row)">删 除</el-button>
          <!--          <el-button  size="mini" icon="el-icon-edit"-->
          <!--                      :type="scope.row.sIsEnabled === 1-->
          <!--                                ? 'danger'-->
          <!--                                : scope.row.sIsEnabled === 0-->
          <!--                                ? 'success'-->
          <!--                                : ''-->
          <!--                          "-->
          <!--                      @click="editCancel(scope.$index,scope.row)">{{ scope.row.sIsEnabled===1?'注销':'启用'}}-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="staffQuery.pageSize"
      :current-page="staffQuery.pageNum"
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
      staffList: {
        sName:'',
        sJob:'',
        sAddress:'',
        sTelephone:''
      },
      title:'',
      list: [], //查询之后接口返回集合
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      staffQuery:{
        pageNum:1,
        pageSize:10
      },
      deleteQuery:{},
      selectCondition: {},
      pageTotal: 0,
      dialogVisible: false,
      rules:{
        sName:[
          {required: true, message: "请输入业务员", trigger: "blur"}
        ],
        sTelephone:[
          {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ]
      }
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    // this.getPageTotal()
  },
  resetData(){
    this.getList()
    this.getPageTotal()
  },
  methods:{//创建具体的方法
    getList() {
      this.staffQuery.sCustomerId=localStorage.getItem('cuId')
      PostData('/staff/selectAll',this.staffQuery)
        .then(res=>{
          this.list = res.list
          console.log(this.list);
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    openAdd(){
      this.title='添加附属业务员'
      this.staffList={
        sName:'',
        sJob:'',
        sAddress:'',
        sTelephone:''
      }
      this.dialogVisible=true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getListByLike(){
      this.staffQuery.sName=this.state
      this.staffQuery.sCustomerId=localStorage.getItem('cuId')
      PostData('/staff/selectAll',this.staffQuery)
        .then(res=>{
          this.list=res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },

    getPageTotal(){
      this.selectCondition = JSON.parse(JSON.stringify(this.staffQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('/staff/selectAll',this.selectCondition).then(res=>{
        this.pageTotal = res.length
      })
    },
    //分页处理
    handlePageChange(val){
      this.staffQuery.pageNum = val
      this.getList()
    },
    search(){
      this.staffQuery.pageNum = 1
      this.getListByLike()
      // alert(111)
    },
    //跳转详情页
    showDetails(data){
      console.log(data);
      this.staffList=data
      this.title='修改附属业务员信息'
      this.dialogVisible=true
      // localStorage.setItem('sId',this.list[index].sId)
      // this.$router.push('/maintain/customer/editStaffList')
    },
    editCancel(index,param){
      this.$confirm('是否将此零件'+(param.sIsEnabled===0?'上架':'下架')+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].sIsEnabled = 1 - this.list[index].sIsEnabled
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
      this.staffQuery.sName=queryString;
      this.staffQuery.sCustomerId=localStorage.getItem('cuId')
      console.log(this.staffQuery);
      PostData('/staff/selectAll',this.staffQuery).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.sName
    },
    deleteStaff(data){
      console.log(data);
      this.deleteQuery.sId=data.sId
      PostData('/staff/delete',this.deleteQuery).then(ref=>{
        this.$message({
          type:"success",
          message:'删除成功'
        })
        this.getList()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.staffList.sId){
            PostData('/staff/update',this.staffList)
              .then(res=>{
                console.log(res);
                this.$message({
                  type:'success',
                  message:'保存信息成功'
                })
                this.getList()
                this.dialogVisible=false
              })
          }
          else {
            this.staffList.sCustomerId=localStorage.getItem('cuId')
            PostData('/staff/insert',this.staffList)
              .then(res=>{
                console.log(res);
                this.$message({
                  type:'success',
                  message:'添加业务员成功'
                })
                this.dialogVisible=false
                this.getList()
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

</style>

