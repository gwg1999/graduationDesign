<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <!--        <el-form-item>-->
        <!--          <el-input v-model="querySalesSlip.pName"  clearable placeholder="名称" style="width: 150px"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-select v-model="querySalesSlip.qdType" @change="getList()" clearable placeholder="类型" style="width: 200px"  >
            <el-option :value="1" label="零件"/>
            <el-option :value="0" label="整件"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" style="position: absolute" @click="getList(1)">查 询</el-button>
        </el-form-item>
        <router-link :to="{path:'/Slips/addSlipsDetailsGoods',query:{qId:this.$route.query.qId,qCustomerId:this.$route.query.qCustomerId}}">
          <el-button type="primary"
                     icon="el-icon-circle-plus" style="position: absolute;right: 10px">添加</el-button>
        </router-link>
        <el-form-item style="position: absolute;right: 90px">
          <router-link :to="{path:'/Slips/salesSlipManagement'}">
            <el-button type="primary"
                       icon="el-icon-d-arrow-left" style="position: absolute;right: 10px">返回</el-button>
          </router-link>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
        :data="salesSlipList"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (querySalesSlip.pageNum - 1) * querySalesSlip.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="pname" label="名称"   align="center"/>
        <el-table-column prop="cname" label="客户名称" width="100px" align="center" />
        <el-table-column prop="qdType" label="类型" width="70px" align="center">
          <template slot-scope="scope">
            {{ scope.row.qdType===0?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column prop="qdNumber" label="购买数量" width="110px" align="center"/>
        <!--        <el-table-column prop="qdDeliveryNum" label="发货数量" width="200" align="center"/>-->
        <el-table-column prop="qdRealTimePrice" width="110px" label="实时售价"  align="center"/>
        <el-table-column prop="qdUpdateTime" width="110px"  label="最近修改时间"  align="center"/>
        <el-table-column label="操作"  align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"  @click="openSalesSlipDialog(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deleteSalesSlip(scope.row.qdId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="querySalesSlip.pageNum"
        :page-size="querySalesSlip.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>

    <el-dialog :visible.sync="dialogSalesSlipFormVisible" title="修改报价单详情表">
      <el-form :model="salesSlipModify" label-width="120px" :rules="rules" ref="salesSlipModify">
        <el-form-item label="购买数量" prop="qdNumber">
          <el-input v-model="salesSlipModify.qdNumber"/>
        </el-form-item>
        <el-form-item label="实时售价" prop="qdRealTimePrice">
          <el-input v-model="salesSlipModify.qdRealTimePrice"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSalesSlipFormVisible  = false">取 消</el-button>
        <el-button :disabled="salesSlipBtnDisabled" type="primary"
                   @click="UpdateSalesSlip()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {PostData} from "@/api";
import salesSlip from "@/api/slips/salesSlip";
import {renderTime} from "@/utils/myValidate";
import {getTime} from "@/views/Slips/myUtils"
import {validatePassCheck,twoPoint} from "../ruleNumber"
export default {
  data(){
    return{
      total:0,
      dialogSalesSlipFormVisible:false,
      salesSlipBtnDisabled:false,
      querySalesSlip:{
        pageSize:10,
        pageNum:1
      },
      salesSlipList:[],
      salesSlipModify:{},
      multipleSelection: [],
      rules:{
        qdDeliveryNum: [
          { required: true, message: '请填写发货数量', trigger: 'change' }
        ],
        qdRealTimePrice: [
          { required: true, message: '请写入零件实时售价', trigger: 'change' },
          {validator:twoPoint,  trigger: 'change' }
        ],
        qdNumber: [
          {required: true, message: '请填写发货数量', trigger: 'change' },
          {  validator:validatePassCheck, trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(pageNum=1){
      this.querySalesSlip.pageNum=pageNum
      this.querySalesSlip.qdOrderId=this.$route.query.qId
      salesSlip.queryAllDetails(this.querySalesSlip.qdOrderId,this.querySalesSlip.pName,
        this.querySalesSlip.qdType,this.querySalesSlip.pageNum,this.querySalesSlip.pageSize)
        .then(res=>{
          this.total=res.total
          for (let i=0;i<res.list.length;i++){
            res.list[i].qdUpdateTime=getTime(res.list[i].qdUpdateTime)
          }
          this.salesSlipList=res.list
        })
    },
    openSalesSlipDialog(params){
      this.dialogSalesSlipFormVisible=true
      if (this.$refs['salesSlipModify'] !== undefined)
        this.$refs['salesSlipModify'].resetFields();
      this.salesSlipModify=JSON.parse(JSON.stringify(params))
    },
    UpdateSalesSlip(){
      this.$refs['salesSlipModify'].validate((valid)=> {
        if(valid){
          this.salesSlipModify.qdUpdateTime = null
          this.salesSlipModify.qId = this.$route.query.qId
          let quotationDetailList = []
          let SlipModify = {}
          quotationDetailList.push(this.salesSlipModify)
          SlipModify.quotationDetailList = quotationDetailList
          PostData('quotationDetail/updateQuotationDetail', SlipModify)
            .then(res => {
              this.$message({
                type: 'success',
                message: '修改报价单详情表信息成功'
              })
              this.dialogSalesSlipFormVisible = false
              this.getList()
            })
        }
      })
    },
    deleteSalesSlip(params){
      this.$confirm('是否将此报价单信息删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        if(this.total===1){
          this.$message({
            type:'error',
            message:"当前商品订单只有一条,请去报价单表中进行删除记录"
          })
        }
        else{
          salesSlip.deleteQuotationDetail(params).
          then(res=>{
              this.$message({
                type:'success',
                message:'删除报价单详情表成功'
              })
              this.getList()
            }
          )
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>

