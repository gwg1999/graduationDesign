<template>
  <div class="app-container" style="background: white">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative;">
      <template slot-scope="scoped">
        <el-form-item>
<!--          <el-input v-model="placeQuery.plName" clearable placeholder="产地名"  style="width: 150px"/>-->
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="请输入产品名"
            :trigger-on-focus="false"
            @select="handleSelect"
            clearable>
            <!--      <i-->
            <!--        class="el-icon-edit el-input__icon"-->
            <!--        slot="suffix"-->
            <!--        @click="handleIconClick">-->
            <!--      </i>-->
            <template slot-scope="{ item }">
              <div>{{ item.plName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查 询</el-button>


        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 30px" @click="openAdd">添加</el-button>
      </template>
    </el-form>
    <el-dialog
      :title=title
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form  ref="place" :model="place" label-width="120px" :rules="rules">
            <el-form-item label="产地或品牌名" prop="plName">
              <el-input v-model="place.plName" style="width: 300px"/>
            </el-form-item>
<!--            <el-form-item label="产地地址" prop="plAddress">-->
<!--              <el-input v-model="place.plAddress" style="width: 300px"/>-->
<!--            </el-form-item>-->
            <el-form-item label="备注信息" prop="plImformation">
              <el-input v-model="place.plImformation" style="width: 300px" type="textarea"/>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" :disabled='isEnable' @click="submitForm('place')">确 定</el-button>
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
        width="280%"
        align="center">
        <template slot-scope="scope">
          {{ (placeQuery.pageNum - 1) * placeQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="plName" label="产地或品牌" width="600%" align="center"/>
<!--      <el-table-column prop="plAddress" label="产地详细地址" width="400%"  align="center"/>-->
<!--      <el-table-column prop="plImage" label="产地形象" width="200%"  align="center"/>-->
<!--      <el-table-column prop="plImformation" label="产地信息" width="200%"  align="center"/>-->
<!--      <el-table-column prop="plIsEnabled" label="产地是否可供应" width="200%" align="center" />-->
<!--      <el-table-column prop="cModelName" label="车模型名" width="170%"  align="center"/>-->
<!--      <el-table-column prop="cPrice" label="车价格" width="80%"  align="center"/>-->
<!--      <el-table-column prop="cStatus" label="车状态" width="110%" align="center"/>-->
<!--      <el-table-column prop="cTypeId" label="车类型ID" width="130%" align="center"/>-->
<!--      <el-table-column prop="cTypeName" label="车类型名" width="80%"  align="center"/>-->
      <!--      <el-table-column prop="cuDiscount" label="默认折扣" width="50%" align="center" />-->
      <!--      <el-table-column prop="cuDefaultPayment" label="默认支付方式" width="80%"  align="center"/>-->
      <!--      <el-table-column prop="cuName" label="联系人姓名" width="100%" align="center" />-->
<!--      <el-table-column prop="plIsEnabled" label="状态" width="80%" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag-->
<!--            :type="scope.row.plIsEnabled === 1-->
<!--                    ? 'success'-->
<!--                    : scope.row.plIsEnabled === 0-->
<!--                    ? 'danger'-->
<!--                    : ''-->
<!--               "-->
<!--          >{{scope.row.plIsEnabled===1?'启用':'未启用'}}</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.row)">查看详情</el-button>
<!--          <el-button  size="mini" icon="el-icon-edit"-->
<!--                      :type="scope.row.plIsEnabled === 1-->
<!--                                ? 'danger'-->
<!--                                : scope.row.plIsEnabled === 0-->
<!--                                ? 'success'-->
<!--                                : ''-->
<!--                          "-->
<!--                      @click="editCancel(scope.$index,scope.row)">{{ scope.row.plIsEnabled===1?'注销':'启用'}}-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="placeQuery.pageSize"
      :current-page="placeQuery.pageNum"
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
      place: {
        plName:'',
        plImformation:''
      },
      title:'',
      list: [], //查询之后接口返回集合
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      isEnable:false,
      placeQuery:{
        plName:null,
        pageSize: 10,
        pageNum: 1,
      },
      dialogVisible: false,
      rules: {
        plName:[
          {required: true, message: "请输入产地名", trigger: "blur"}
        ]
      },
      selectCondition: {},
      pageTotal: 0,
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
      PostData('/place/selectAllByLike',qs.stringify(this.placeQuery))
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    openAdd(){
      this.title='添加产地或品牌'
      this.place={}
      this.dialogVisible=true
      this.resetForm('place')
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
    toInsert(){
      this.$router.push('/maintain/place/addPlace')
    },
    getListByLike(){
      this.placeQuery.plName=this.state
      this.placeQuery.pageNum=1
      PostData('/place/selectAllByLike',qs.stringify(this.placeQuery))
        .then(res=>{
          this.list=res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },

    getPageTotal(){
      this.selectCondition = JSON.parse(JSON.stringify(this.placeQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('/place/selectAllByLike',this.selectCondition).then(res=>{
        this.pageTotal = res.length
      })
    },
    //分页处理
    handlePageChange(val){
      this.placeQuery.pageNum = val
      this.getList()
    },
    search(){
      this.getListByLike()
      // this.getPageTotal()
      // alert(111)
    },
    //跳转详情页
    showDetails(data){
      console.log(data)
      this.title='修改产地或品牌'
      this.place=Object.assign({},data)
      this.dialogVisible=true
      // localStorage.setItem('plId',this.list[index].plId)
      // this.$router.push('/maintain/place/editPlace')
    },
    editCancel(index,param){
      this.$confirm('是否将此零件'+(param.plIsEnabled===0?'上架':'下架')+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].plIsEnabled = 1 - this.list[index].plIsEnabled
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
      this.placeQuery.plName=queryString;
      this.placeQuery.pageNum=1
      PostData('place/selectAllByLike',qs.stringify(this.placeQuery)).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.plName
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
          if(this.place.plId){
            PostData('place/update',this.place)
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
                    message:'保存信息成功'
                  })
                  this.dialogVisible=false
                  this.enable()
                  this.getList()
                }
              })
          }
          else {
            PostData('place/insert',this.place)
              .then(res=>{
                console.log(res);
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
                    message:'添加产地或品牌成功'
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

</style>
