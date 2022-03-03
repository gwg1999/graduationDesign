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
            placeholder="请输入供应商名"
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


        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="openAdd">添加</el-button>
      </template>
    </el-form>
    <el-dialog
      title="添加供货商"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form  ref="supplier" :model="supplier" label-width="120px" :rules="rules">
            <el-form-item label="供应商名" prop="sName">
              <el-input v-model="supplier.sName" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="供应商地址" prop="sAddress">
              <el-input v-model="supplier.sAddress" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="负责人" prop="sPersonName">
              <el-input v-model="supplier.sPersonName" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="供应商电话" prop="sTelephone">
              <el-input v-model="supplier.sTelephone" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="备注信息" prop="sInformation">
              <el-input v-model="supplier.sInformation" style="width: 300px" type="textarea"/>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" :disabled='isEnable' @click="submitForm('supplier')">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column
        label="序号"
        width="50%"
        align="center">
        <template slot-scope="scope">
          {{ (supplierQuery.pageNum - 1) * supplierQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="sName" label="供货商名" width="250%"  align="center"/>
      <el-table-column prop="sAddress" label="供货商详细地址" width="250%"  align="center"/>
<!--      <el-table-column prop="sCity" label="供应商所在城市" width="120%"  align="center"/>-->
<!--      <el-table-column prop="sImage" label="供应商形象" width="100%"  align="center"/>-->
<!--      <el-table-column prop="sInformation" label="供应商信息" width="150%" align="center" />-->
<!--      <el-table-column prop="sIsEnabled" label="是否正常供货" width="120%" align="center"/>-->
      <el-table-column prop="sPersonName" label="负责人" width="180%"  align="center"/>
<!--      <el-table-column prop="sProvince" label="所在省份" width="100%" align="center"/>-->
<!--      <el-table-column prop="sRegion" label="所在区域" width="200%" align="center"/>-->
      <el-table-column prop="sTelephone" label="供货商电话" width="200%"  align="center"/>
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
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>
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
      :page-size="supplierQuery.pageSize"
      :current-page="supplierQuery.pageNum"
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
      supplier: {
        sName:'',
        sAddress:'',
        sPersonName:'',
        sTelephone:'',
        sInformation:''
      },
      list: [], //查询之后接口返回集合
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      isEnable:false,
      supplierQuery:{
        sName:'',
        pageSize: 10,
        pageNum: 1,
      },
      selectCondition: {},
      pageTotal: 0,
      dialogVisible: false,
      rules:{
        sName:[
          {required: true, message: "请输入供应商名", trigger: "blur"}
        ],
        sTelephone:[
          {required: true, pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
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
      PostData('/supplier/selectAllByLike',qs.stringify(this.supplierQuery))
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    openAdd() {
      this.dialogVisible=true
      this.resetForm('supplier')
    },
    toInsert(){
      this.$router.push('/maintain/supplier/addSupplier')
    },
    getListByLike(){
      this.supplierQuery.sName=this.state
      this.supplierQuery.pageNum=1
      PostData('/supplier/selectAllByLike',qs.stringify(this.supplierQuery))
        .then(res=>{
          this.list=res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },

    getPageTotal(){
      this.selectCondition = JSON.parse(JSON.stringify(this.supplierQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('/supplier/selectAllByLike',this.selectCondition).then(res=>{
        this.pageTotal = res.length
      })
    },
    //分页处理
    handlePageChange(val){
      this.supplierQuery.pageNum = val
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    search(){
      this.getListByLike()
      // this.getPageTotal()
      // alert(111)
    },
    //跳转详情页
    showDetails(index){
      localStorage.setItem('sId',this.list[index].sId)
      this.$router.push('/maintain/supplier/editSupplier')
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
      this.supplierQuery.sName=queryString;
      this.supplierQuery.pageNum=1
      PostData('supplier/selectAllByLike',qs.stringify(this.supplierQuery)).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.sName
    },
    enable(){
      setTimeout(()=>{
        this.isEnable=false
      },500)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isEnable=true
          PostData('supplier/insert',this.supplier)
            .then(res=>{
              this.enable()
              this.$message({
                type:'success',
                message:'添加供应商成功'
              })
              this.getList()
              this.getPageTotal()
              this.dialogVisible=false
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

