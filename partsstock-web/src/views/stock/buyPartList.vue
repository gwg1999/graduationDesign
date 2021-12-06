<template>
  <div class="app-container" style="background: white">
    <el-dialog
      title="修改零件数量"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="editPartNum" status-icon :rules="rules" ref="editPartNum" label-width="100px" class="demo-ruleForm">
        <el-form-item label="零件名" prop="pName">
          <el-input v-model="editPartNum.sdPartsName" disabled></el-input>
        </el-form-item>
        <el-form-item label="零件数量" prop="indNumber">
          <el-input-number v-model="editPartNum.sdNumber" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="零件价格" prop="sdPrice">
          <el-input v-model="editPartNum.sdPrice"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmEdit('editPartNum')">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="添加零件"
      :visible.sync="addVisible"
      width="40%"
      :before-close="handleClose">
      <el-form :model="addPart" status-icon :rules="rules" ref="addPart" label-width="100px" class="demo-ruleForm">
        <el-form-item label="零件名" prop="sdPartsName">
          <el-autocomplete
            v-model="addPart.sdPartsName"
            :fetch-suggestions="querySearch"
            placeholder="请输入零件名"
            :trigger-on-focus="false"
            @select="handleSelect">
            <template slot-scope="{ item }">
              <div>{{ item.pName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
        </el-form-item>
<!--        <el-form-item label="类型" prop="sdType">-->
<!--          <el-select v-model="addPart.sdType" placeholder="请选择">-->
<!--            <el-option label="整件" :value="0"></el-option>-->
<!--            <el-option label="零件" :value="1"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="零件数量" prop="sdNumber">
          <el-input-number v-model="addPart.sdNumber" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="供货周期" prop="sdDeliveryCycle">
          <el-input v-model="addPart.sdDeliveryCycle" style="width: 30%"></el-input>
        </el-form-item>
<!--        <el-form-item label="发货周期" prop="indDeliveryNum">-->
<!--          <el-input v-model="addPart.indDeliveryNum" style="width: 30%"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="价格" prop="sdPrice">
          <el-input v-model="addPart.sdPrice" style="width: 30%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmAdd('addPart')">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="添加整件"
      :visible.sync="addWholeVisible"
      width="40%"
      :before-close="handleClose">
      <el-form :model="addWhole" status-icon :rules="rules" ref="wholeForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="整件名" prop="sdPartsName">
          <el-autocomplete
            v-model="addWhole.sdPartsName"
            :fetch-suggestions="SearchWhole"
            placeholder="请输入整件名"
            :trigger-on-focus="false"
            @select="handleWholeSelect">
            <template slot-scope="{ item }">
              <div>{{ item.wName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
        </el-form-item>
        <!--        <el-form-item label="类型" prop="indType">-->
        <!--          <el-select v-model="addPart.indType" placeholder="请选择">-->
        <!--            <el-option label="整件" :value="0"></el-option>-->
        <!--            <el-option label="零件" :value="1"></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="整件数量" prop="sdNumber">
          <el-input-number v-model="addWhole.sdNumber" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="供货周期" prop="sdDeliveryCycle">
          <el-input v-model="addWhole.sdDeliveryCycle" style="width: 30%"></el-input>
        </el-form-item>
<!--        <el-form-item label="发货周期" prop="indDeliveryNum">-->
<!--          <el-input v-model="addWhole.indDeliveryNum" style="width: 30%"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="价格" prop="sdPrice">
          <el-input v-model="addWhole.sdPrice" style="width: 30%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addWholeVisible= false">取 消</el-button>
    <el-button type="primary" @click="confirmWholeAdd('wholeForm')">确 定</el-button>
  </span>
    </el-dialog>
    <el-button type="primary" style="margin-bottom: 3px" @click="addPartMethod">添加零件</el-button>
    <el-button type="primary" style="margin-bottom: 3px" @click="addWholeMethod">添加整件</el-button>
    <el-table
      :data="list"
      border
      fit
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
      <el-table-column prop="sdPartsName" label="零件名" width="200%"  align="center"/>
      <!--      <el-table-column prop="type" label="类型" width="200%" align="center"/>-->
      <el-table-column prop="sdType" label="类型" width="80%"  align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.sdType===0">整件</h3>
          <h3 v-if="scope.row.sdType===1">零件</h3>
        </template>
      </el-table-column>
      <el-table-column prop="sdNumber" label="零件数量" width="120%"  align="center"/>
<!--      <el-table-column prop="indType" label="类型" width="120%"  align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <h3 v-if="scope.row.indType===0">零件</h3>-->
<!--          <h3 v-else>整件</h3>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="sdDeliveryCycle" label="供货周期" width="130%"  align="center"/>
<!--      <el-table-column prop="indDeliveryNum" label="发货数量" width="120%" align="center" />-->
      <!--      <el-table-column prop="aPassword" label="用户密码" width="120%"  align="center"/>-->
      <el-table-column prop="sdPrice" label="零件价格" width="120%"  align="center"/>
      <el-table-column prop="sdIsDelivery" label="是否能供货" width="100%" align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.sdIsDelivery===0">
            <el-tag type="danger">否</el-tag>
          </h3>
          <h3 v-else>
            <el-tag>是</el-tag>
          </h3>
        </template>
      </el-table-column>
      <el-table-column prop="sdStatus" label="状态" width="80%"  align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.sdStatus===0">未收货</h3>
          <h3 v-if="scope.row.sdStatus===1">退货</h3>
          <h3 v-if="scope.row.sdStatus===2">已收货</h3>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" style="width: auto" @click="editPartNumMethod(scope.row)">修改零件数量</el-button>
          <el-button type="danger" style="width: auto" @click="deletePart(scope.row.sdId)">删除该零件</el-button>
          <el-button type="warning" style="width: auto" @click="received(scope.row)">收 货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="backPre" style="float: right;margin-top: 2%">返 回</el-button>
  </div>
</template>
<script>
import {PostData} from "../../api/index"
import qs from 'qs'
export default {
  name: "staff",
  data(){//定义变量和初始值
    return{
      buyPartListQuery:{
        pageNum: 0,
        pageSize: 0
      },
      list: [], //查询之后接口返回集合
      partState:'',//模糊查询后返回的值
      wholeState:'',
      total:0,//总记录数
      stockQuery:{
        pageSize: 10,
        pageNum: 1
      },
      editPartNum:{
        sdNumber:1,
        sdPrice:0,
        sdStatus:0
      },
      deletePartList:{},
      addPart:{
        sdNumber:1,
        sdType:1,
        sdIsDelivery:0,
        sdPartsName:'',
        sdDeliveryCycle:'',
        sdPrice:'',
      },
      addWhole:{
        sdNumber:1,
        sdType:0,
        sdIsDelivery:0,
        sdPartsName:'',
        sdDeliveryCycle:'',
        sdPrice:'',
      },
      addSubmitInfo:{
        stockDetailList:[]
      },
      receivedQuery: {
      },
      rules:{
        sdPrice:[
          { required: true, message: '请输入价格', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '只能输入数字',trigger: "blur"}
        ],
        sdPartsName:[
          { required: true, message: '请输入零整件名', trigger: 'blur' }
        ],
        wName:[
          { required: true, message: '请输入整件名', trigger: 'blur' }
        ],
        sdDeliveryCycle:[
          { required: true, message: '请输入供货周期', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+$/,message: '只能输入数字',trigger: "blur"}
        ],
        sdDeliveryNum:[
          { required: true, message: '请输入发周期', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+$/,message: '只能输入数字',trigger: "blur"}
        ]
      },
      dialogVisible:false,
      addVisible:false,
      addWholeVisible:false,
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
  },
  methods:{//创建具体的方法
    getList() {
      this.buyPartListQuery.orderId=this.$route.query.orderId.toString()
      console.log(this.buyPartListQuery.orderId);
      PostData('/stock/queryStockDetail',qs.stringify(this.buyPartListQuery)).then(ref=>{
        console.log(ref.list);
        this.list=ref.list
        this.addPart.factoryId=this.list[0].factoryId
        this.addSubmitInfo.orderId=this.list[0].sdOrderId
        this.addPart.sdCustomerId=this.list[0].sdCustomerId
        this.addPart.sdStatus=0
        this.addWhole.factoryId=this.list[0].factoryId
        this.addWhole.sdCustomerId=this.list[0].sdCustomerId
        this.addWhole.sdStatus=0
      })
    },
    backPre(){
      this.$router.back()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    editPartNumMethod(row){
      console.log(row);
      this.editPartNum.sdPartsName=row.sdPartsName
      this.editPartNum.sdNumber=row.sdNumber
      this.editPartNum.sdPartsId=row.sdPartsId
      this.editPartNum.sdPrice=row.sdPrice
      this.editPartNum.factoryId=row.factoryId
      this.editPartNum.sdId=row.sdId
      this.editPartNum.sdOrderId=row.sdOrderId
      this.editPartNum.sdCustomerId=row.sdCustomerId
      this.editPartNum.sdType=row.sdType
      this.editPartNum.sdIsDelivery=row.sdIsDelivery
      this.editPartNum.sdDeliveryCycle=row.sdDeliveryCycle
      this.editPartNum.sdPackedId=row.sdPackedId
      this.dialogVisible=true
    },
    confirmEdit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/stock/updateStockDetail',this.editPartNum).then(res=>{
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible=false
            this.getList()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    deletePart(id){
      this.deletePartList.sdId=id
      PostData('/stock/deleteStockDetail',qs.stringify(this.deletePartList)).then(res=>{
        this.$message({
          showClose: true,
          message: '删除成功成功',
          type: 'success'
        })
        this.getList()
      })
    },
    addPartMethod(){
      this.addPart.sdPartsName=''
      this.addPart.sdDeliveryCycle=''
      this.addPart.sdPrice=''
      this.addPart.sdNumber=1
      this.addVisible=true
    },
    addWholeMethod(){
      this.addWhole.sdPartsName=''
      this.addWhole.sdDeliveryCycle=''
      this.addWhole.sdPrice=''
      this.addWhole.sdNumber=1
      this.addWholeVisible=true
    },
    querySearch(queryString, cb) {
      this.addPart.pName=queryString;
      this.addPart.pageNum=1
      PostData('/inquiry/selectPartsByFactoryId',qs.stringify(this.addPart)).then(ref=>{
        cb(ref.list)
        console.log(ref.list);
      })

      // 调用 callback 返回建议列表的数据
    },
    SearchWhole(queryString, cb){
      this.addWhole.wName=queryString;
      this.addWhole.pageNum=1
      PostData('/whole/selectAllByLike',qs.stringify(this.addWhole)).then(ref=>{
        cb(ref.list)
        console.log(ref.list);
      })
    },
    handleSelect(item) {
      this.partState=item.pName
      this.addPart.sdPartsName=item.pName
      this.addPart.sdPartsId=item.pId
    },
    handleWholeSelect(item){
      this.wholeState=item.wName
      this.addWhole.sdPartsName=item.wName
      this.addWhole.sdPartsId=item.wId
    },
    confirmAdd(formName){
      this.addSubmitInfo.stockDetailList.splice(0,this.addSubmitInfo.stockDetailList.length)
      this.addSubmitInfo.stockDetailList[0]=this.addPart
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/stock/addStockDetail',this.addSubmitInfo).then(ref=>{
            this.$message({
              type:"success",
              message:"添加成功",
            })
            this.addVisible=false
            this.getList()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    confirmWholeAdd(formName){
      console.log(this.addWhole);
      this.addSubmitInfo.stockDetailList.splice(0,this.addSubmitInfo.stockDetailList.length)
      this.addSubmitInfo.stockDetailList[0]=this.addWhole
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/stock/addStockDetail',this.addSubmitInfo).then(ref=>{
            this.$message({
              type:"success",
              message:"添加成功",
            })
            this.addWholeVisible=false
            this.getList()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    received(item){
      console.log(item);
      this.receivedQuery=item
      this.$confirm('是否确认收货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receivedQuery.sdStatus=2
        PostData('/stock/updateStockDetail',this.receivedQuery).then(ref=>{
          this.$message({
            type:"success",
            message:"收货成功",
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }
}
</script>
<style scoped>

</style>
