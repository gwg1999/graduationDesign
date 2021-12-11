<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-input v-model="queryPrinceSheet.name"  clearable placeholder="客户名称" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            v-model="queryPrinceSheet.princeCreateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="销售单创建时间开始日期"
            end-placeholder="销售单创建时间结束日期"
            style="width: 420px">
          </el-date-picker>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-date-picker-->
        <!--            v-model="queryPrinceSheet.updateTime"-->
        <!--            type="daterange"-->
        <!--            range-separator="至"-->
        <!--            start-placeholder="销售单更新时间开始日期"-->
        <!--            end-placeholder="销售单更新时间结束日期"-->
        <!--            style="width: 250px">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList(1)">查 询</el-button>
        <router-link to="/Slips/addSPriceSlips">
          <el-button type="primary"
                     icon="el-icon-circle-plus" style="position: absolute;right: 10px">添加</el-button>
        </router-link>
      </el-form>
      <el-table
        :data="princeSheetList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (queryPrinceSheet.pageNum - 1) * queryPrinceSheet.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column type="expand" label="详情" width="60px">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="创建人员">
                <span>{{ props.row.createPeopleName }}</span>
              </el-form-item>
              <el-form-item label="仓库操作人员">
                <span>{{ props.row.warehouseOperaterName }}</span>
              </el-form-item>
              <el-form-item label="应收价">
                <span>{{ props.row.oSupposeIncome }}</span>
              </el-form-item>
              <el-form-item label="实收价">
                <span>{{ props.row.oRealIncome }}</span>
              </el-form-item>
              <el-form-item label="支付方式">
                <span>{{ props.row.oPaymentWay }}</span>
              </el-form-item>
              <el-form-item label="发货方式">
                <span>{{ props.row.oDeliveryWay }}</span>
              </el-form-item>
              <el-form-item label="发票类型">
                <span>{{ props.row.oInvoiceTypeId===0?'无':props.row.oInvoiceTypeId===1?'普通发票':'增值税发票' }}</span>
              </el-form-item>
              <el-form-item label="备忘录:">
                <span>{{ props.row.oNote }}</span>
              </el-form-item>
              <el-form-item label="客户其他费用总金额:">
                <span>{{ props.row.oOtherCostMoney }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户" width="80" align="center" />
        <el-table-column prop="oCreateTime" label="创建时间"  width="150px"   align="center"/>
        <el-table-column prop="oResultTime" label="发货时间" width="160px"  align="center"/>
        <el-table-column prop="oIsPackage" label="是否打包" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.oIsPackage===0?'打包':'未打包'}}
          </template>
        </el-table-column>
        <el-table-column prop="oStatus" label="订单状态" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.oStatus===1?'未发货':'已发货'}}
          </template>
        </el-table-column>
        <el-table-column label="详情表信息"  align="center" width="120px">
          <template slot-scope="scope">
            <router-link :to="{path:'/Slips/princeSlipDetails',query:{oId:scope.row.oId,oStatus:scope.row.oStatus,oCustomerId:scope.row.oCustomerId}}">
              <el-button type="primary" size="mini" icon="el-icon-edit">查看详情</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
<!--            <el-button type="primary" size="mini" icon="el-icon-edit" @click="InverseSales(scope.row.oId)">转成报价单</el-button>-->
            <router-link :to="{path:'/returnGood/addCancelPriceSlips',query:{row:scope.row}}" style="margin-right: 10px">
              <el-button v-if="scope.row.isReturn===1" type="primary" size="mini" icon="el-icon-edit" >退货</el-button>
            </router-link>
            <el-button :disabled="scope.row.oStatus===2" type="primary" size="mini" icon="el-icon-bottom" @click="deliverGood(scope.row.oId)">发货</el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="!(scope.row.oIsPackage===1&&scope.row.oStatus===1)"  @click="openUpdatePrinceSlips(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deletePrinceSlips(scope.row.oId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogPrinceSheetFormVisible" title="修改销售单">
        <el-form :model="princeSheetModify" label-width="120px" :rules="rules" ref="princeSheetModify">
          <el-form-item label="发票类型" prop="oInvoiceTypeId">
            <el-select v-model="princeSheetModify.oInvoiceTypeId"    placeholder="发票类型" style="width: 200px"  >
              <el-option :value="0" label="无"/>
              <el-option :value="1" label="普通发票"/>
              <el-option :value="2" label="增值税发票"/>
            </el-select>
          </el-form-item>
          <el-form-item label="发货方式" prop="oDeliveryWay">
            <el-select v-model="princeSheetModify.oDeliveryWay"  placeholder="发货方式" style="width: 200px"  >
              <el-option value="线下交易" label="线下交易"/>
              <el-option value="快递" label="快递"/>
              <el-option value="托运" label="托运"/>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="oPaymentWay">
            <el-select v-model="princeSheetModify.oPaymentWay"   clearable placeholder="支付方式" style="width: 200px"  >
              <el-option value="挂账" label="挂账"/>
              <el-option value="线下" label="线下"/>
              <el-option value="线上" label="线上"/>
            </el-select>
          </el-form-item>
          <el-form-item label="其他费用" prop="oOtherCostMoney">
            <el-input v-model="princeSheetModify.oOtherCostMoney"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPrinceSheetFormVisible = false">取 消</el-button>
          <el-button :disabled="princeSheetBtnDisabled" type="primary"
                     @click="updatePrinceSlips()">确 定</el-button>
        </div>
      </el-dialog>
      <el-pagination
        :current-page="queryPrinceSheet.pageNum"
        :page-size="queryPrinceSheet.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>
  </div>
</template>

<script>
import princeSlips from "@/api/slips/princeSlips";
import {renderTime} from "@/utils/myValidate";
import {PostData} from "@/api";
import {reserveTime} from "../myUtils"
import {twoPoint} from "@/views/Slips/ruleNumber";
import {commonList} from "@/views/Slips/myApi";
export default {
  data(){
    return{
      //退货弹框
      dialogDetailsVisible:false,
      DetailsBtnDisabled:false,
      princeSheetReturn:{
        returnDetailList:[]
      },
      returnGoodList:[],
      //详情表信息查询
      queryDetails:{
        pageSize:0,
        pageNum:0
      },
      total:0,
      dialogPrinceSheetFormVisible:false,
      princeSheetBtnDisabled:false,

      queryPrinceSheet:{
        pageSize:5,
        pageNum:1,
        createTimeSequence:0,
        endTimeSequence:0,
      },
      princeSheetList:[
      ],
      princeSheetModify:{},
      queryDetailsSheet:{
        pageNum:0,
        pageSize:0
      },
      rules:{
        oStatus: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        oOrderClosingStatus: [
          { required: true, message: '请选择订单结清状态', trigger: 'change' }
        ],
        oInvoiceTypeId: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        oDeliveryWay: [
          { required: true, message: '请选择发货方式', trigger: 'change' }
        ],
        oPaymentWay: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        oOtherCostMoney: [
          { required: true, message: '请填写其他费用', trigger: 'change' },
          {validator:twoPoint,  trigger: 'change' }

        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deliverGood(oId){
      this.$confirm("是否将此销售单进行发货处理?",{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        let deliver={}
        deliver.oId=oId
        deliver.oStatus=2
        PostData("/order/deliverOrder",deliver).then(res=>{
          this.$message({
            type:'success',
            message:'发货成功'
          })
          this.getList()
        })

      })
    },
    //转销售单
    InverseSales(params){
      princeSlips.becomeQuotation(params)
        .then(res=>{
          this.$message({
            type:"success",
            message:'转化报价单成功'
          })
          this.getList()
        })
    },
    formatTime(time){
      return renderTime(time)
    },
    getList(pageNum=1){
      this.queryPrinceSheet.pageNum=pageNum
      if(this.queryPrinceSheet.princeCreateTime){
        this.queryPrinceSheet.beginTime=reserveTime(this.queryPrinceSheet.princeCreateTime[0])
        this.queryPrinceSheet.endTime=reserveTime(this.queryPrinceSheet.princeCreateTime[1])
      }else {
        this.queryPrinceSheet.beginTime=undefined
        this.queryPrinceSheet.endTime=undefined
      }
      // let args= {
      //   name:this.queryPrinceSheet.name||undefined,
      //   beginTime:this.queryPrinceSheet.beginTime||undefined,
      //   endTime:this.queryPrinceSheet.endTime||undefined,
      //   createTimeSequence:this.queryPrinceSheet.createTimeSequence,
      //   endTimeSequence:this.queryPrinceSheet.endTimeSequence,
      //   pageNum:this.queryPrinceSheet.pageNum,
      //   pageSize:this.queryPrinceSheet.pageSize
      // }
      // PostData("/order/getOrder",{},args).then(res=>{
      //   console.log(res)
      // })
      princeSlips.queryAll(this.queryPrinceSheet.name,this.queryPrinceSheet.beginTime
        ,this.queryPrinceSheet.endTime,this.queryPrinceSheet.createTimeSequence,
        this.queryPrinceSheet.endTimeSequence, this.queryPrinceSheet.pageNum,
        this.queryPrinceSheet.pageSize)
        .then(res=>{
          this.total=res.total
          for (let i=0;i<res.list.length;i++){
            res.list[i].oCreateTime=this.formatTime(res.list[i].oCreateTime)
            if(res.list[i].oResultTime)
              res.list[i].oResultTime=this.formatTime(res.list[i].oResultTime)
          }
          this.princeSheetList=res.list

        })
    },
    openUpdatePrinceSlips(params){
      this.dialogPrinceSheetFormVisible=true
      if (this.$refs['princeSheetModify'] !== undefined)
        this.$refs['princeSheetModify'].resetFields();
      this.princeSheetModify=JSON.parse(JSON.stringify(params))

    },
    updatePrinceSlips(){
      this.$refs['princeSheetModify'].validate((valid)=> {
        if(valid){
          this.princeSheetBtnDisabled = true
          setTimeout(() => {
            this.princeSheetBtnDisabled = false
          }, 1000)
          this.princeSheetModify.oCreateTime = null,
            this.princeSheetModify.oResultTime = null,
            PostData('order/updateOrder', this.princeSheetModify)
              .then(res => {
                console.log(res)
                this.$message({
                  type: 'success',
                  message: '修改销售单信息成功'
                })
                this.dialogPrinceSheetFormVisible = false
                this.getList()
              })
        }
      })
    },
    deletePrinceSlips(params){
      this.$confirm('是否将此销售单信息删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        princeSlips.deleteOrder(params)
          .then(res=>{
            this.$message({
              type:'success',
              message:'删除销售单信息成功'
            })
            this.getList()
          })
      })
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
