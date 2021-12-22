<template>
  <div class="app-container" style="background: white">
    <!--查询表单-->
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="buyList" ref="buyList" label-width="100px" class="demo-dynamic" :rules="rules">
        <el-form-item label="仓库管理员" prop="warehouseOperaterId">
          <el-select v-model="buyList.warehouseOperaterId" filterable placeholder="请选择" clearable>
            <el-option
              v-for="item in houseOperator"
              :key="item.aId"
              :label="item.aName"
              :value="item.aId">
            </el-option>
          </el-select>
        </el-form-item>
        <!--          <el-form-item label="用户ID" prop="aId">-->
        <!--            <el-input v-model="admin.aId" style="width: 300px"s/>-->
        <!--          </el-form-item>-->
        <el-form-item label="付款方式" prop="paymentWay">
          <el-select v-model="buyList.paymentWay" filterable placeholder="请选择" clearable>
            <el-option
              v-for="item in spaymentWay"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--          <el-form-item>-->
        <!--            <el-button type="primary" @click="submitForm('parts')">提交</el-button>-->
        <!--          </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('buyList')">提 交</el-button>
  </span>
    </el-dialog>
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
        <el-form-item>
          <!--          <el-input v-model="customerQuery.cuUnitName" clearable placeholder="用户名"  style="width: 150px"/>-->
          <el-autocomplete
            v-model="stockQuery.iCustomName"
            :fetch-suggestions="querySearch"
            placeholder="请输入客户名"
            :trigger-on-focus="false"
            @select="handleSelect"
            clearable>
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
          <el-select v-model="stockQuery.adminName" style="margin-left: 3px" placeholder="请选择操作员" clearable>
            <el-option :label="item.aName" :value="item.aName" v-for="item in adminList"></el-option>
          </el-select>
          <el-select v-model="stockQuery.iStatus" style="margin-left: 3px" placeholder="请选择订单状态" clearable>
            <el-option label="未询价" :value="0"></el-option>
            <el-option label="已询价" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查 询</el-button>


        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="toInsert()">添加</el-button>
      </template>
    </el-form>
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
        align="center"
        type="index">
<!--        <template slot-scope="scope">-->
<!--          {{ (adminQuery.pageNum - 1) * adminQuery.pageSize + scope.$index + 1 }}-->
<!--        </template>-->
      </el-table-column>
      <el-table-column prop="customName" label="客户" width="210%"  align="center"/>
      <el-table-column prop="adminName" label="操作员" width="170%" align="center" />
      <!--      <el-table-column prop="aPassword" label="用户密码" width="120%"  align="center"/>-->
      <el-table-column prop="iPrice" label="订单总价" width="170%"  align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.iPrice===0&&scope.row.iStatus===0">未报价</h3>
          <h3 v-else>{{scope.row.iPrice}}</h3>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="aCreateTime" label="创建时间" width="160%" align="center"/>-->
      <!--      <el-table-column prop="aSecondaryPassword" label="二级密码" width="120%"  align="center"/>-->
      <el-table-column prop="iStatus" label="订单状态" width="150%"  align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.iStatus === 1
                    ? 'success'
                    : scope.row.iStatus === 0
                    ? 'danger'
                    : ''
               "
          >{{scope.row.iStatus===1?'已询价':'询价中'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="询价零件" width="160%" align="center" prop="">
        <template slot-scope="scope">
          <router-link :to="{path:'showParts',query:{iId:JSON.stringify(scope.row.iId),factoryId:scope.row.detailPartsPoJos[0].factoryId}}">
            <el-button type="primary" size="small" @click="">查看</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
<!--          <router-link :to="{path:'/editStock',query: {oneOder:JSON.stringify(scope.row)}}">-->
<!--            <el-button type="primary" icon="el-icon-edit" style="margin-right: 2%">查看详情</el-button>-->
<!--          </router-link>-->
          <el-popover
            placement="right"
            width="400"
            trigger="click"
            @show="showDetails(scope.row)"
            @hide="submitUpdate('oder')"
          >
            <el-form ref="oder" :model="oder" label-width="120px">
              <div>
                <el-form-item label="客户" prop="customName">
                  <el-input v-model="oder.customName" style="width: 200px" disabled/>
                </el-form-item>
                <el-form-item label="操作员" prop="adminName">
                  <el-input v-model="oder.adminName" style="width: 200px" disabled/>
                </el-form-item>
                <el-form-item label="总价格" prop="indPrice">
                  <el-input v-model="oder.iPrice" style="width: 200px" disabled/>
                </el-form-item>
                <el-form-item label="订单状态" prop="iStatus">
                  <el-select v-model="oder.iStatus" placeholder="选择订单状态">
                    <el-option label="询价中" :value="0"></el-option>
                    <el-option label="已询价" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <!--          <el-form-item label="用户ID" prop="aId">-->
                <!--            <el-input v-model="admin.aId" style="width: 300px"s/>-->
                <!--          </el-form-item>-->
                <el-form-item label="备注" prop="INote">
                  <el-input  v-model="oder.iNote" style="width: 200px" type="textarea"/>
                </el-form-item>
                <!--          <el-form-item label="用户密码" prop="aPassword">-->
                <!--            <el-input v-model="admin.aPassword" style="width: 300px"/>-->
                <!--          </el-form-item>-->
                <!--          <el-form-item label="二级密码" prop="aSecondaryPassword">-->
                <!--            <el-input v-model="admin.aSecondaryPassword" style="width: 300px"/>-->
                <!--          </el-form-item>-->
<!--                <el-form-item>-->
<!--                  <el-button type="primary" @click="submitUpdate('oder')" style="margin-left: 130px">保存</el-button>-->
<!--                </el-form-item>-->
              </div>
            </el-form>
            <el-button type="primary" icon="el-icon-magic-stick" slot="reference" style="margin-right: 2%">查看详情</el-button>
          </el-popover>
          <el-button type="primary" icon="el-icon-edit" style="margin-right: 2%" @click="transOrder(scope.row)">转为进货单</el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteOder(scope.row.iId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="stockQuery.pageSize"
      :current-page="stockQuery.pageNum"
      :total="pageTotal"
      style="padding: 30px 0; text-align: right;"
      @current-change="handlePageChange"
    />
  </div>
</template>
<script>
import {GetData,PostData} from "../../api/index"
import qs from 'qs'
export default {
  name: "staff",
  data(){//定义变量和初始值
    return{
      dialogVisible:false,
      list: [], //查询之后接口返回集合
      buyList: {},
      houseOperator:[],
      houseOperatorQuery:{
        type:4
      },
      adminQuery:{
        pageNum: 0,
        pageSize: 0
      },
      adminList:[],
      customerQuery:{},
      oder: {
        customName:'',
        adminName:'',
        iPrice:'',
        iStatus:'',
        iNote:''
      },
      oldOder:{},
      rules:{
        warehouseOperaterId:[
          { required: true, message: '请输入选择仓库管理员', trigger: 'blur' }
        ],
        paymentWay:[
          {required:true,message:'请选择付款方式',trigger:'blur'}
        ]
      },
      visible:false,
      spaymentWay:[
        {
          label:'挂账',
          value:'0'
        },
        {
          label:'线上',
          value:'1'
        },
        {
          label:'线下',
          value:'2'
        }
      ],
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      route:{
        name:'/showParts'
      },
      stockQuery:{
        iCustomName:'',
        adminName:'',
        iStatus:null,
        pageSize: 10,
        pageNum: 1
      },
      deleteQuery:{
        iId:-1
      },
      selectCondition: {},
      pageTotal: 0,
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    this.getHouseOperator()
    this.getAdmins()
  },
  resetData(){
    this.getList()
    // this.getPageTotal()
  },
  methods:{//创建具体的方法
    getList() {
      PostData('/inquiry/queryInquiry',this.stockQuery)
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
          console.log(res);
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    getAdmins(){
      PostData('admin/selectAllByLike',qs.stringify(this.adminQuery))
        .then(res=>{
          this.adminList = res.list
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    backPre(){
      this.$router.back()
    },
    toInsert(){
      this.$router.push('/stockAdd')
    },
    // getListByLike(){
    //   this.adminQuery.aName=this.state
    //   this.adminQuery.pageNum=1
    //   PostData('admin/selectAllByLike',qs.stringify(this.adminQuery))
    //     .then(res=>{
    //       this.list=res.list
    //       this.pageTotal=res.total
    //     }).catch(err=>{
    //     this.$message.error(err.message);
    //   })
    // },

    // 分页处理
    handlePageChange(val){
      this.stockQuery.pageNum = val
      this.getList()
    },
    search(){
      this.stockQuery.pageNum=1
      console.log(this.stockQuery);
      this.getList()
    },
    // 跳转详情页
    showDetails(data){
      this.oder=data
      Object.assign(this.oldOder,data)
      console.log(this.oder);
    },
    isChange(){
      for(let key  in this.oder){
        if(this.oder[key]!==this.oldOder[key]){
          return true
        }
      }
      return false
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
      this.customerQuery.cuUnitName=queryString;
      PostData('/customer/selectAllByLike',this.customerQuery).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.stockQuery.iCustomName=item.cuUnitName
    },
    getHouseOperator(){
      GetData('/admin/selectAdminByType',this.houseOperatorQuery).then(res=>{
        this.houseOperator=res
      })
    },
    deleteOder(id){
      this.deleteQuery.iId=id
      console.log(id);
      PostData('/inquiry/deleteInquiry',qs.stringify(this.deleteQuery)).then((res)=>{
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.getList()
      })
    },
    transOrder(data){
      console.log(data)
      this.buyList.iId=data.iId
      this.dialogVisible=true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData("/inquiry/oneKeyConversionInquiry",qs.stringify(this.buyList)).then((ref)=>{
            this.$message({
              message: '转换成功',
              type: 'success'
            });
            this.dialogVisible=false
            this.getList()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.isChange()){
            PostData('/inquiry/ediInquiry',this.oder)
              .then(res=>{
                this.$message({
                  type:'success',
                  message:'修改成功'
                })
                this.visible=false
              }).catch(()=>{})
          }
          else {}
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
