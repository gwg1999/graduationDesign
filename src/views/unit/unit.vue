<template>
  <div class="app-container" style="background: white">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative;">
      <template slot-scope="scoped">
        <el-form-item>
          <!--          <el-input v-model="carQuery.cTypeName" clearable placeholder="车品牌名"  style="width: 150px"/>-->
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="请输入零件单位名"
            :trigger-on-focus="false"
            @select="handleSelect"
            clearable>
            <!--      <i-->
            <!--        class="el-icon-edit el-input__icon"-->
            <!--        slot="suffix"-->
            <!--        @click="handleIconClick">-->
            <!--      </i>-->
            <template slot-scope="{ item }">
              <div>{{ item.uName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查 询</el-button>


        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 30px" @click="openAdd">添加</el-button>
      </template>
    </el-form>
    <el-dialog
      title="添加零件单位"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form  ref="unit" :model="unit" label-width="120px" :rules="rules">
          <!--          <el-form-item label="车品牌ID" prop="cBrandId">-->
          <!--            <el-input v-model="car.cBrandId" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="零件单位名" prop="uName">
            <el-input v-model="unit.uName" style="width: 300px" placeholder="请输入零件单位名"/>
          </el-form-item>
          <!--          <el-form-item label="车工场ID" prop="cFactoryId">-->
          <!--            <el-input v-model="car.cFactoryId" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="车工场名" prop="cFactoryName">-->
          <!--            <el-input v-model="car.cFactoryName" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="车模型ID" prop="cModelId">-->
          <!--            <el-input v-model="car.cModelId" style="width: 300px"/>-->
          <!--          </el-form-item>-->
<!--          <el-form-item label="车模型名" prop="cModelName">-->
<!--            <el-input v-model="car.cModelName" style="width: 300px" placeholder="请输入车模型名"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车类型名" prop="cTypeName">-->
<!--            <el-input v-model="car.cTypeName" style="width: 300px" placeholder="请输入车类型名"/>-->
<!--          </el-form-item>-->
          <!--            <el-form-item>-->
          <!--              <el-button :disabled="saveBtnDisabled" type="primary" @click="save" >保存</el-button>-->
          <!--            </el-form-item>-->
          <!--        <div style="width: 50%;float: right">-->
          <!--&lt;!&ndash;          <el-form-item label="车价格" prop="cPrice">&ndash;&gt;-->
          <!--&lt;!&ndash;            <el-input v-model="car.cPrice" style="width: 300px"/>&ndash;&gt;-->
          <!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
          <!--&lt;!&ndash;          <el-form-item label="车状态" prop="cStatus">&ndash;&gt;-->
          <!--&lt;!&ndash;            <el-input v-model="car.cStatus" style="width: 300px"/>&ndash;&gt;-->
          <!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
          <!--&lt;!&ndash;          <el-form-item label="车类型ID" prop="cTypeId">&ndash;&gt;-->
          <!--&lt;!&ndash;            <el-input v-model="car.cTypeId" style="width: 300px"/>&ndash;&gt;-->
          <!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
          <!--          -->
          <!--        </div>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" :disabled='isEnable' @click="submitForm('unit')">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="修改零件单位"
      :visible.sync="dialogVisible1"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form  ref="unit1" :model="unit1" label-width="120px" :rules="rules">
          <el-form-item label="零件单位名" prop="uName">
            <el-input v-model="unit1.uName" style="width: 300px" placeholder="请输入零件单位名"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="submitForm1('unit1')">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;position: relative;">
      <el-table-column
        label="序号"
        width="300%"
        align="center">
        <template slot-scope="scope">
          {{ (unitQuery.pageNum - 1) * unitQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!--      <el-table-column prop="cBrandId" label="车品牌ID" width="100%"  align="center"/>-->
      <el-table-column prop="uId" label="零件单位id" width="280%"  align="center"/>
      <el-table-column prop="uName" label="零件单位名" width="400%"  align="center"/>
      <!--      <el-table-column prop="cFactoryId" label="车工场ID" width="100%"  align="center"/>-->
      <!--      <el-table-column prop="cFactoryName" label="车工厂名" width="120%" align="center" />-->
      <!--      <el-table-column prop="cModelId" label="车模型ID" width="120%" align="center"/>-->
<!--      <el-table-column prop="cModelName" label="车模型名" width="370%"  align="center"/>-->
      <!--      <el-table-column prop="cPrice" label="车价格" width="80%"  align="center"/>-->
      <!--      <el-table-column prop="cStatus" label="车状态" width="110%" align="center"/>-->
      <!--      <el-table-column prop="cTypeId" label="车类型ID" width="130%" align="center"/>-->
<!--      <el-table-column prop="cTypeName" label="车类型名" width="370%"  align="center"/>-->
      <!--      <el-table-column prop="cuDiscount" label="默认折扣" width="50%" align="center" />-->
      <!--      <el-table-column prop="cuDefaultPayment" label="默认支付方式" width="80%"  align="center"/>-->
      <!--      <el-table-column prop="cuName" label="联系人姓名" width="100%" align="center" />-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="unitQuery.pageSize"
      :current-page="unitQuery.pageNum"
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
      isEnable:false,
      unit: {
        uName:'',
      },
      unit1: {},
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      unitQuery:{
        uName:'',
        pageSize: 10,
        pageNum: 1,
      },
      unit1Query:{
        uId:null,
        pageSize: 10,
        pageNum: 1,
      },
      rules: {
        uName:[
          {required: true, message: "请输入零件单位名", trigger: "blur"}
        ]
      },
      saveBtnDisabled: false,
      dialogVisible1:false,
      selectCondition: {},
      pageTotal: 0,
      dialogVisible: false
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
      PostData('/unit/selectAll',qs.stringify(this.unitQuery))
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    getListByLike(){
      this.unitQuery.uName=this.state
      this.unitQuery.pageNum=1
      PostData('/unit/selectAll',qs.stringify(this.unitQuery))
        .then(res=>{
          this.list=res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    openAdd(){
      this.dialogVisible = true
      this.resetForm('unit')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //分页处理
    handlePageChange(val){
      this.unitQuery.pageNum = val
      this.getList()
    },
    search(){
      this.getListByLike()
      // this.getPageTotal()
      // alert(111)
    },
    //跳转详情页
    showDetails(index){
      // localStorage.setItem('uId',this.list[index].uId)
      // this.$router.push('/maintain/car/editCar')
      this.unit1Query.uId = this.list[index].uId
      this.getOne()
      this.dialogVisible1=true
    },
    getOne() {
      PostData('unit/selectOne',this.unit1Query)
        .then(res=>{
          this.unit1 = res
        })
    },
    querySearch(queryString, cb) {
      this.unitQuery.uName=queryString;
      this.unitQuery.pageNum=1;
      PostData('unit/selectAll',qs.stringify(this.unitQuery)).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.uName
    },
    enable(){
      setTimeout(()=>{
        this.isEnable=false
      },500)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.isEnable=true
        if (valid) {
          PostData('unit/insert',this.unit)
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
                  message:'添加零件单位成功'
                })
                this.dialogVisible=false
                this.enable()
                this.getList()
              }
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    },
    submitForm1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('unit/update',this.unit1)
            .then(res=>{
              console.log(res);
              if(res.code===500){
                this.$message({
                  type:'warning',
                  message:res.cause
                })
              }
              else{
                this.$message({
                  type:'success',
                  message:'修改零件单位成功'
                })
                this.dialogVisible1=false
                this.getList()
              }
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
