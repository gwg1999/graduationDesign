<template>
  <div>
    <div class="app-container" >
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-select v-model="queryCancelSlip.rIsPayment"  clearable placeholder="是否已打款" style="width: 120px">
            <el-option label="已打款" :value="1"/>
            <el-option label="未打款" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryCancelSlip.rIsReceive"  clearable placeholder="是否收货" style="width: 120px">
            <el-option label="正在退货" :value="0"/>
            <el-option label="退货结束" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryCancelSlip.ResultTime"
            type="daterange"
            range-separator="至"
            start-placeholder="退货单创建时间开始日期"
            end-placeholder="退货单创建时间结束日期"
            style="width: 250px">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList(1)">查 询</el-button>
        <!--        <router-link to="/Slips/addSalesSlip">-->
        <!--          <el-button type="primary"-->
        <!--                     icon="el-icon-circle-plus" style="position: absolute;right: 10px">添加</el-button>-->
        <!--        </router-link>-->
      </el-form>
      <el-table
        :data="CancelSlipList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column type="expand" label="详情" width="50px">
          <template slot-scope="props">
            <el-form label-position="right" inline class="demo-table-expand" label-width="80px">
              <el-form-item label="退货原因:">
                <span>{{ props.row.rReason }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="rOrderType" label="订单类别" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderType===1?'进货单':'销售单'}}
          </template>
        </el-table-column>
        <el-table-column prop="rCreateTime" width="100px" label="创建时间"  align="center"/>
        <el-table-column prop="rResultTime" width="100px"  label="结束时间"  align="center"/>
        <el-table-column prop="rType" label="交易属性" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.rType===0?'退货退款':scope.row.rType===1?'退换货':'仅退款'}}
          </template>
        </el-table-column>
        <el-table-column prop="rIsPayment" label="是否打款" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.rIsPayment===1?'已打款':'未打款'}}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="rReason" label="退货原因" width="100" align="center"/>-->
        <el-table-column prop="rIsReceive" label="是否结束" width="80px" align="center">
          <template slot-scope="scope">
            {{scope.row.rIsReceive===0?'正在退货':"退货结束"}}
          </template>
        </el-table-column>
        <el-table-column prop="rPrice" label="退货总价" width="80px" align="center"/>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <router-link :to="{path:'/Slips/cancelSlipsDetails',query:{qId:scope.row.rId}}">
              <el-button type="primary"  size="mini" icon="el-icon-edit" >查看详情</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button  v-show="scope.row.rType===0" type="primary" size="mini" icon="el-icon-edit"  @click="openPaymentDialog(scope.row)">打款</el-button>
            <el-button  v-show="scope.row.rType===1" type="primary" size="mini" icon="el-icon-edit"  @click="takeDelivery(scope.row)">收货</el-button>
            <el-button  v-show="scope.row.rType===1" type="primary" size="mini" icon="el-icon-edit"  @click="deliverGood(scope.row)">发货</el-button>
            <el-button  v-show="scope.row.rType===3" type="primary" size="mini" icon="el-icon-edit"  @click="refund(scope.row)">退款</el-button>
            <el-button :disabled="scope.row.rIsReceive===0" type="primary" size="mini" icon="el-icon-edit"  @click="openReturnSheetDialog(scope.row)">修改</el-button>
            <el-button :disabled="scope.row.rIsReceive===1"  type="danger" size="mini" icon="el-icon-edit"  @click="deleteReturnSlip(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--修改-->
      <el-dialog :visible.sync="dialogSalesSheetFormVisible" title="修改退货单">
        <el-form :model="returnGoodSlipsModify" label-width="120px" :rules="rules" ref="returnGoodSlipsModify">
          <!--          <el-form-item label="退货物流号" prop="qdNumber">-->
          <!--            <el-input v-model="returnGoodSlipsModify.rReturnLogistics"/>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="发货物流号" prop="qdNumber">-->
          <!--            <el-input v-model="returnGoodSlipsModify.rDeliverLogistics"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="订单状态" prop="Type">
            <el-select v-model="returnGoodSlipsModify.Type" placeholder="请选择订单状态">
              <el-option label="退货退款" :value="0"/>
              <el-option label="退换货" :value="1"/>
              <el-option label="仅退款" :value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否已收款" prop="IsPayment">
            <el-select v-model="returnGoodSlipsModify.IsPayment" placeholder="请选择是否已收款">
              <el-option label="未收款" :value="0"/>
              <el-option label="已收款" :value="1"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSalesSheetFormVisible = false">取 消</el-button>
          <el-button :disabled="salesSheetBtnDisabled" type="primary"
                     @click="UpdateReturnSlips()">确 定</el-button>
        </div>
      </el-dialog>
      <!--打款-->
      <el-dialog :visible.sync="dialogPaymentFormVisible" title="打款">
        <el-form :model="returnGoodSlipsModify" label-width="120px" :rules="rules" ref="returnGoodSlipsModify">
          <el-form-item label="退款金额" prop="qdNumber">
            <el-input :disabled="true" v-model="returnGoodSlipsModify.rReturnLogistics"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPaymentFormVisible = false">取 消</el-button>
          <el-button :disabled="salesSheetBtnDisabled" type="primary"
                     @click="UpdatePaymentSlips()">确 定</el-button>
        </div>
      </el-dialog>
      <!--收货-->
      <!--      <el-dialog :visible.sync="dialogPaymentFormVisible" title="收货">-->
      <!--        <el-form :model="returnGoodSlipsModify" label-width="120px" :rules="rules" ref="returnGoodSlipsModify">-->
      <!--          <el-form-item label="退款金额" prop="qdNumber">-->
      <!--            <el-input :disabled="true" v-model="returnGoodSlipsModify.rReturnLogistics"/>-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--        <div slot="footer" class="dialog-footer">-->
      <!--          <el-button @click="dialogPaymentFormVisible = false">取 消</el-button>-->
      <!--          <el-button :disabled="salesSheetBtnDisabled" type="primary"-->
      <!--                     @click="UpdatePaymentSlips()">确 定</el-button>-->
      <!--        </div>-->
      <!--      </el-dialog>-->
      <!--发货-->
      <el-dialog :visible.sync="dialogPaymentFormVisible" title="发货">
        <el-form :model="returnGoodSlipsModify" label-width="120px" :rules="rules" ref="returnGoodSlipsModify">
          <el-form-item label="退款金额" prop="qdNumber">
            <el-input :disabled="true" v-model="returnGoodSlipsModify.rReturnLogistics"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPaymentFormVisible = false">取 消</el-button>
          <el-button :disabled="salesSheetBtnDisabled" type="primary"
                     @click="UpdatePaymentSlips()">确 定</el-button>
        </div>
      </el-dialog>
      <!--退款-->
      <el-dialog :visible.sync="dialogPaymentFormVisible" title="退款">
        <el-form :model="returnGoodSlipsModify" label-width="120px" :rules="rules" ref="returnGoodSlipsModify">
          <el-form-item label="退款金额" prop="qdNumber">
            <el-input :disabled="true" v-model="returnGoodSlipsModify.rReturnLogistics"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPaymentFormVisible = false">取 消</el-button>
          <el-button :disabled="salesSheetBtnDisabled" type="primary"
                     @click="UpdatePaymentSlips()">确 定</el-button>
        </div>
      </el-dialog>

      <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>
  </div>
</template>

<script>
import returnGood from '@/api/returnGood/returnGood'
import {PostData} from "@/api";
import {getTime} from '@/views/Slips/myUtils'
export default {
  data(){
    return{
      //打款
      dialogPaymentFormVisible:false,
      //修改退货单
      dialogSalesSheetFormVisible:false,
      salesSheetBtnDisabled:false,
      pageSize:5,
      pageNum:1,
      queryCancelSlip:{
        rOrderType:0
      },
      CancelSlipList:[],
      total:0,
      //退货单修改
      returnGoodSlipsModify:{},
      rules:{
        qdNumber: [
          {required: true, message: '请选填入快递单号', trigger: 'change'}
        ],
        ReturnReason:[
          {required: true, message: '请选选择仓库管理员', trigger: 'change'}
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods:{
    //发货
    deliverGood(){
      this.$confirm('是否确认发货'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.returnGoodSlipsModify=JSON.parse(JSON.stringify(params))
        this.returnGoodSlipsModify.rIsReceive=2
        PostData('return/updateReturn', this.returnGoodSlipsModify)
          .then(res => {
            this.$message({
              type: 'success',
              message: '发货成功'
            })
            this.dialogSalesSheetFormVisible = false
            this.getList()
          })
      })
    },
    //退款
    refund(params){
      this.$confirm('是否将进行退款'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.returnGoodSlipsModify=JSON.parse(JSON.stringify(params))
        this.returnGoodSlipsModify.rIsReceive=3
        PostData('return/updateReturn', this.returnGoodSlipsModify)
          .then(res => {
            this.$message({
              type: 'success',
              message: '退款成功'
            })
            this.dialogSalesSheetFormVisible = false
            this.getList()
          })
      })
    },
    //收货
    takeDelivery(params){
      this.$confirm('是否收货'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.returnGoodSlipsModify=JSON.parse(JSON.stringify(params))
        this.returnGoodSlipsModify.rIsReceive=1
        PostData('return/updateReturn', this.returnGoodSlipsModify)
          .then(res => {
            this.$message({
              type: 'success',
              message: '收货成功'
            })
            this.dialogSalesSheetFormVisible = false
            this.getList()
          })
      })
    },
    //打款操作
    openPaymentDialog(params){
      this.dialogPaymentFormVisible=true
      this.returnGoodSlipsModify=JSON.parse(JSON.stringify(params))
    },
    UpdatePaymentSlips(){
      this.returnGoodSlipsModify.rIsReceive=3
      PostData('return/updateReturn', this.returnGoodSlipsModify)
        .then(res => {
          this.$message({
            type: 'success',
            message: '打款成功'
          })
          this.dialogSalesSheetFormVisible = false
          this.getList()
        })
    },
    //拉列表
    getList(pageNum=1){
      this.pageNum=pageNum
      if(this.queryCancelSlip.ResultTime){
        this.queryCancelSlip.beginTime=getTime(this.queryCancelSlip.ResultTime[0])
        this.queryCancelSlip.endTime=getTime(this.queryCancelSlip.ResultTime[1])
      }else {
        this.queryCancelSlip.beginTime=undefined
        this.queryCancelSlip.endTime=undefined
      }
      returnGood.queryAll(this.queryCancelSlip,this.pageNum,this.pageSize)
        .then(res=>{
          for (let i=0;i<res.list.length;i++){
            res.list[i].rCreateTime=getTime(res.list[i].rCreateTime)
            if(res.list[i].oResultTime)
              res.list[i].rResultTime=getTime(res.list[i].rResultTime)
          }
          this.CancelSlipList=res.list
          this.total=res.total
        })
    },
    //修改
    openReturnSheetDialog(params){
      this.dialogSalesSheetFormVisible=true
      this.returnGoodSlipsModify=JSON.parse(JSON.stringify(params))
      console.log(this.returnGoodSlipsModify)
    },
    UpdateReturnSlips(){
      this.$refs['returnGoodSlipsModify'].validate((valid)=>{
        if(valid) {
          this.salesSheetBtnDisabled = true
          setTimeout(()=>{
            this.salesSheetBtnDisabled=false
          },1000);
          PostData('return/updateReturn', this.returnGoodSlipsModify)
            .then(res => {
              this.$message({
                type: 'success',
                message: '修改报价单信息成功'
              })
              this.dialogSalesSheetFormVisible = false
              this.getList()
            })
        }
      })
    },
    //删除退货单成功
    deleteReturnSlip(params){
      this.$confirm(`是否将此${params.orderType===1?'进货单':'销售单'}退货单删除?`,'提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        if(params.orderType===0){
          returnGood.deleteReturnGood(params)
            .then(res=>{
              this.$message({
                type:'success',
                message:'删除退货单成功'
              })
              this.getList()
            })
        }
      })
    }
  }
}
</script>

<style scoped>

.demo-table-expand {
  border-top: 1px solid #000000;
  border-left:1px solid #000000;
  border-right:1px solid #000000;
  border-bottom:1px solid #000000;
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  border-right:1px solid #000000;
  margin-right: 0;
  margin-bottom: 0;
  width: 10%;
}
</style>
