<template>
  <div class="app-container" style="background: white">
    <el-button type="primary" icon="el-icon-circle-plus" style="float: left;margin-bottom: 18px" @click="openAdd">添加</el-button>
    <el-dialog
      title="添加周期数"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form  ref="cycle" :model="cycle" label-width="120px" :rules="rules">
          <el-form-item label="周期数" prop="rcAmount">
            <el-input v-model="cycle.rcAmount" style="width: 300px" placeholder="请输入周期数"/>
          </el-form-item>
<!--          <el-form-item label="类型（天丶周丶月丶年）" prop="rcType">-->
<!--            <el-input v-model="cycle.rcType" style="width: 300px" placeholder="请输入类型"/>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" :disabled='isEnable' @click="submitForm('cycle')">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="修改周期数"
      :visible.sync="dialogVisible1"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form  ref="cycle1" :model="cycle1" label-width="120px" :rules="rules">
          <el-form-item label="周期数" prop="rcAmount">
            <el-input v-model="cycle1.rcAmount" style="width: 300px" placeholder="请输入周期数"/>
          </el-form-item>
<!--          <el-form-item label="类型（天丶周丶月丶年）" prop="rcType">-->
<!--            <el-input v-model="cycle1.rcType" style="width: 300px" placeholder="请输入类型"/>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="submitForm1('cycle1')">确 定</el-button>
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
          {{ (cycleQuery.pageNum - 1) * cycleQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="rcAmount" label="周期数" width="280%"  align="center"/>
      <el-table-column prop="rcType" label="天" width="400%"  align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="cycleQuery.pageSize"
      :current-page="cycleQuery.pageNum"
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
      cycle: {
        rcAmount:'',
        rcType:'天'
      },
      cycle1: {
        rcType:'天'
      },
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      cycleQuery:{
        pageSize: 10,
        pageNum: 1,
      },
      cycle1Query:{
        pageSize: 10,
        pageNum: 1,
      },
      rules: {
        rcAmount:[
          {required: true, message: "请输入周期数", trigger: "blur"},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '只能输入数字',trigger: "blur"},
        ],
        // rcType:[
        //   {required: true, message: "请输入类型—例如（天丶月丶年）", trigger: "blur"}
        // ]
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
      PostData('/returnCycle/selectAll',qs.stringify(this.cycleQuery))
        .then(res=>{
          this.list = res.list
          console.log(this.list);
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    openAdd(){
      this.dialogVisible = true
      this.resetForm('cycle')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getListByLike(){
      this.cycleQuery.rcAmount=this.state
      PostData('/unit/selectAllByLike',this.cycleQuery)
        .then(res=>{
          this.list=res
        }).catch(err=>{
        this.$message.error(err.message);
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
      this.selectCondition = JSON.parse(JSON.stringify(this.cycleQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('/returnCycle/selectAll',this.selectCondition).then(res=>{
        this.pageTotal = res.length
      })
    },
    //分页处理
    handlePageChange(val){
      this.cycleQuery.pageNum = val
      this.getList()
    },
    search(){
      this.cycleQuery.pageNum = 1
      this.getPageTotal()
      this.getListByLike()
      // alert(111)
    },
    //跳转详情页
    showDetails(index){
      // localStorage.setItem('uId',this.list[index].uId)
      // this.$router.push('/maintain/car/editCar')
      this.cycle1Query.rcId = this.list[index].rcId
      this.getOne()
      this.dialogVisible1=true
    },
    getOne() {
      PostData('returnCycle/selectOne',this.cycle1Query)
        .then(res=>{
          this.cycle1 = res
        })
    },
    querySearch(queryString, cb) {
      this.cycleQuery.rcAmount=queryString;
      PostData('unit/selectAllByLike',this.cycleQuery).then(ref=>{
        cb(ref)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.rcAmount
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
          PostData('returnCycle/insert',this.cycle)
            .then(res=>{
              if(res.code===500){
                this.$message({
                  type:"warning",
                  message:res.cause
                })
                this.enable()
              }
              else {
                this.$message({
                  type:'success',
                  message:'添加售后周期成功'
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
          PostData('returnCycle/update',this.cycle1)
            .then(res=>{
              if(res.code===500){
                this.$message({
                  type:'warning',
                  message:res.cause
                })
              }
              else {
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
