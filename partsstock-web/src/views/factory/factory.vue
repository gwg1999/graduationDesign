<template>
  <div class="app-container" style="background: white;">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
        <el-form-item>
<!--          <el-input v-model="factoryQuery.fName" clearable placeholder="厂家名"  style="width: 150px"/>-->
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="请输入厂家名"
            :trigger-on-focus="false"
            @select="handleSelect">
            <!--      <i-->
            <!--        class="el-icon-edit el-input__icon"-->
            <!--        slot="suffix"-->
            <!--        @click="handleIconClick">-->
            <!--      </i>-->
            <template slot-scope="{ item }">
              <div>{{ item.fName }}</div>
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
      width="50%"
      :before-close="handleClose">
      <div>
        <el-form  ref="factory" :model="factory" label-width="120px" :rules="rules">
          <div style="display: flex;justify-content: space-around">
            <div>
              <el-form-item label="厂家名" prop="fName">
                <el-input v-model="factory.fName" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="厂家地址" prop="fAddress">
                <el-input v-model="factory.fAddress" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="负责人" prop="fPersonName">
                <el-input v-model="factory.fPersonName" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="银行账号" prop="fAccount">
                <el-input v-model="factory.fAccount" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="默认物流" prop="fCurier">
                <el-input v-model="factory.fCurier" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="备用物流" prop="fSpareCourier">
                <el-input v-model="factory.fSpareCourier" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="开户行" prop="fBankName">
                <el-input v-model="factory.fBankName" style="width: 200px"/>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="负责人电话" prop="fPhoneNumber">
                <el-input v-model="factory.fPhoneNumber" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="备用电话" prop="fPhoneNumber2">
                <el-input v-model="factory.fPhoneNumber2" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="微信号" prop="fWechat">
                <el-input v-model="factory.fWechat" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="税号" prop="fTaxNumber">
                <el-input v-model="factory.fTaxNumber" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="三级价格描述" prop="fDiscount">
                <el-input v-model="factory.fDiscount" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="备注信息" prop="fInformation">
                <el-input v-model="factory.fInformation" style="width: 200px" type="textarea"/>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" :disabled='isEnable' @click="submitForm('factory')">确 定</el-button>
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
          {{ (factoryQuery.pageNum - 1) * factoryQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="fName" label="厂家名" width="120" align="center"/>
      <el-table-column prop="fAddress" label="厂家地址" width="180"  align="center"/>
<!--      <el-table-column prop="fImage" label="厂家形象" width="150%"  align="center"/>-->
<!--      <el-table-column prop="fInformation" label="厂家信息" width="180%"  align="center"/>-->
      <el-table-column prop="fPersonName" label="负责人" width="80"  align="center"/>
      <el-table-column prop="fPhoneNumber" label="负责人电话" width="120"  align="center"/>
      <el-table-column prop="fPhoneNumber2" label="备用号码" width="120"  align="center"/>
      <el-table-column prop="fWechat" label="微信号" width="160"  align="center"/>
      <el-table-column prop="fBankName" label="开户行" width="80"  align="center"/>
      <el-table-column prop="fAccount" label="银行卡账号" width="180"  align="center"/>
      <el-table-column prop="fCurier" label="默认物流" width="80"  align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.row)">查看详情</el-button>
<!--          <el-button  size="mini" icon="el-icon-edit"-->
<!--                      :type="scope.row.fIsEnabled === 1-->
<!--                                ? 'danger'-->
<!--                                : scope.row.fIsEnabled === 0-->
<!--                                ? 'success'-->
<!--                                : ''-->
<!--                          "-->
<!--                      @click="editCancel(scope.$index,scope.row)">{{ scope.row.fIsEnabled===1?'注销':'启用'}}-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="factoryQuery.pageSize"
      :current-page="factoryQuery.pageNum"
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
      factory: {
        fName:'',
        fAddress:'',
        fPersonName:'',
        fPhoneNumber:'',
        fInformation:''
      },
      title:'',
      isEnable:false,
      list: [], //查询之后接口返回集合
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      factoryQuery:{
        fName:null,
        pageSize: 10,
        pageNum: 1,
      },
      dialogVisible: false,
      selectCondition: {},
      pageTotal: 0,
      rules:{
        fName:[
          {required: true, message: "请输入工厂名", trigger: "blur"}
        ],
        fPhoneNumber:[
          {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ],
        fPhoneNumber2:[
          {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ],
        fAccount:[

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
      PostData('/factory/selectAllByLike',this.factoryQuery)
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
          console.log(this.list);
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
    openAdd(){
      this.factory={}
      this.dialogVisible = true
      // this.$refs['factory'].resetFields()

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toInsert(){
      this.$router.push('/maintain/factory/addFactory')
    },
    getListByLike(){
      this.factoryQuery.fName=this.state
      this.factoryQuery.pageNum=1
      PostData('/factory/selectAllByLike',this.factoryQuery)
        .then(res=>{
          this.list=res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },

    //分页处理
    handlePageChange(val){
      this.factoryQuery.pageNum = val
      this.getList()
    },
    search(){
      // this.factoryQuery.pageNum = 1
      this.getListByLike()
      // this.getPageTotal()
      // alert(111)
    },
    //跳转详情页
    showDetails(data){
      console.log(data);
      this.factory=Object.assign({},data)
      this.title='修改厂家信息'
      this.dialogVisible=true
      // localStorage.setItem('fId',this.list[index].fId)
      // this.$router.push('/maintain/factory/editFactory')
    },
    editCancel(index,param){
      this.$confirm('是否将此厂商'+(param.fIsEnabled===0?'启用':'不启用')+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].fIsEnabled = 1 - this.list[index].fIsEnabled
        PostData('/factory/update',this.list[index])
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
      this.factoryQuery.fName=queryString;
      this.factoryQuery.pageNum=1
      PostData('factory/selectAllByLike',this.factoryQuery).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.fName
    },
    enable(){
      setTimeout(()=>{
        this.isEnable=false
      },500)
    },
    submitForm(formName) {
      this.$refs.factory.validate((valid) => {
        if (valid) {
          this.isEnable=true
          if(this.factory.fId){
            PostData('factory/update',this.factory)
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
                    message:'修改工厂信息成功'
                  })
                  this.dialogVisible=false
                  this.enable()
                  this.getList()
                }
              }).catch(()=>{})
          }
          else {
            this.isEnable=true
            PostData('factory/insert',this.factory)
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
                    message:'添加工厂成功'
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
