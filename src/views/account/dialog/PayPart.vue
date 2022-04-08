<template>
  <div>
    <el-dialog title="挂账结算" :visible.sync="dialogVisible" @close="creditPartCancel" width="1000px">
      <div class="form-box">
        <el-form :inline="true" style="border-bottom: solid gainsboro 1px">
          <el-form-item label="客户姓名">
            <el-autocomplete v-model="creditPartCondition.name" :fetch-suggestions="querySearch" @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <div style="display: inline-block" v-if="creditPartCondition.name">
            <el-form-item label="交易时间">
              <el-date-picker
                v-model="tempDate1"
                type="daterange"
                start-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="creditPartSearch">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div>
        <el-table
          fit
          border
          highlight-current-row
          :data="creditPartData"
          height="300"
          @selection-change="creditPartSelectionChange"
          ref="creditPartTable">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="客户名称" prop="customerName" align="center"></el-table-column>
          <el-table-column label="时间" prop="oCreateTime" align="center"></el-table-column>
          <el-table-column label="应收" prop="oSupposeIncome" align="center"></el-table-column>
          <el-table-column label="支付方式" prop="oPaymentWay"></el-table-column>
          <el-table-column label="账单状态" prop="oOrderClosingStatus" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.oOrderClosingStatus===2?'danger':'info'">{{scope.row.oOrderClosingStatus===2?'未结':'部分结清'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.oStatus===1?'info':'success'">{{scope.row.oStatus===1?'未发货':'已发货'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
<!--        <el-pagination-->
<!--          layout="total, prev, pager, next, jumper"-->
<!--          :page-size="orderQuery.pageSize"-->
<!--          :current-page="orderQuery.pageNum"-->
<!--          :total="pageTotal"-->
<!--          style="padding: 30px 0; text-align: right;"-->
<!--          @current-change="getList"-->
<!--        />-->
      </div>
      <div style="text-align: right;margin-top: 10px">
        <el-button type="primary" @click="creditPartCancel">取消</el-button>
        <el-button type="primary" @click="creditPartConfirm">确认</el-button>
      </div>


      <el-dialog width="30%" title="结算金额" :visible.sync="innerVisible" append-to-body>
        <el-form label-width="60px" :rules="creditPartRules" :model="chargeInfo.charge" ref="payForm">
          <el-form-item label="应收">{{ chargeInfo.charge.supposeIncome }}</el-form-item>
          <el-form-item label="已收" prop="alreadyIncome">
            <el-input v-model="chargeInfo.charge.alreadyIncome"></el-input>
          </el-form-item>
          <el-form-item label="实收" prop="realIncome">
            <el-input v-model="chargeInfo.charge.realIncome"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="payCancel">取消</el-button>
            <el-button type="primary" @click="payConfirm">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {parseTime} from "@/utils";
import princeSlips from "@/api/slips/princeSlips";
import {PostData} from "@/api";
import qs from 'qs'

export default {
  name: "PayPart",
  data(){
    return {
      creditPartData: [],
      pay: {
        payNumber: null,
      },
      innerVisible: false,
      creditPartCondition: {
        OCustomerId: null,  // 客户id
        startTime: null,
        OExistBill: 1,  //
        endTime: null,
        OOrderClosingStatus: 2,  //结清状态
        pageSize: 10000,
        pageNum: 1,
        name: this.custom
      },
      tempDate1: null,
      creditPartSelection: [],
      creditPartRules: {
        realIncome: [
          {required: true, message: '请输入实收金额', trigger: ['change', 'blur']}
        ],
        alreadyIncome: [
          {required: true, message: '请输入已收金额', trigger: ['change', 'blur']}
        ]
      },
      chargeInfo: {
        charge: {
          alreadyIncome: null,
          alreadyOutcome: 0,
          customId: null,
          dealPicture: null,
          isDeal: 0,
          realIncome: null,
          realOutcome: 0,
          supposeIncome: null,
          supposeOutcome: 0,
          wholePrice: 0,
        },
        orderList: [],
      },
      dialogVisible: false,
    }
  },
  props: {
    partVisible: {
      type: Boolean,
      default: false
    },
    custom: {
      type: Object,
      default(){
        return {

        }
      }
    },
  },
  computed: {
    creditPartMoney: function (){
      let total = 0
      for(let selection of this.creditPartSelection){
        total += selection.oSupposeIncome
      }
      this.chargeInfo.charge.supposeIncome = total
      return total
    }
  },
  watch: {
    partVisible: {
      handler:function (){
        this.dialogVisible = this.partVisible
        this.creditPartCondition.name = this.custom.name
        this.creditPartCondition.OCustomerId = this.custom.customerId
        console.log(this.dialogVisible)
      }
    },
    custom: {
      handler: function (){
        this.creditPartCondition.name = this.custom.name
        this.creditPartCondition.OCustomerId = this.custom.customerId
        console.log('customer:')
        console.log(this.creditPartCondition.name)
      }
    },
  },
  methods: {
    querySearch(queryString,cb){
      PostData('customer/selectAllByLike', {cuUnitName: queryString, pageSize: 10000,pageNum: 1}).then(res=>{
        console.log(res.list)
        let customers = res.list
        for(let i in customers){
          customers[i].value = customers[i].cuUnitName
        }
        cb(customers)
      }).catch(err=>{
        console.log(err)
      })
    },

    handleSelect(item){
      this.creditPartCondition.OCustomerId = item.cuId
      console.log(item);
    },

    // 挂账结算查询
    creditPartSearch(){
      if(this.tempDate1){
        this.creditPartCondition.startTime = parseTime(this.tempDate1[0],'{y}-{m}-{d}')
        this.creditPartCondition.endTime = parseTime(this.tempDate1[1],'{y}-{m}-{d}')
      }else{
        this.creditPartCondition.startTime = this.creditPartCondition.endTime = null
      }
      console.log(this.creditPartCondition)
      PostData('/order/getOrderByObject', qs.stringify(this.creditPartCondition)).then(res=>{
        this.creditPartData = res.list
        for(let data of this.creditPartData){
          data.oCreateTime = parseTime(data.oCreateTime,'{y}-{m}-{d} {h}:{i}:{s}')
        }
        console.log('order:')
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    },

    // 挂账结算多选
    creditPartSelectionChange(val){
      this.creditPartSelection = val
    },

    // 挂账结算弹窗确认
    creditPartConfirm(){
      this.$confirm("确认是否结账",'提示',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.innerVisible = true
        this.chargeInfo.charge.alreadyIncome = this.chargeInfo.charge.realIncome = this.chargeInfo.charge.supposeIncome = this.creditPartMoney
        this.chargeInfo.charge.customId = this.creditPartSelection[0].OCustomerId
        this.chargeInfo.orderList = this.creditPartSelection

        // this.chargeInfo.charge.supposeIncome = this.creditPartMoney
        console.log(this.creditPartSelection)
      })
    },

    // 取消挂账结算弹窗
    creditPartCancel(){
      this.toggleSelection()
      this.$emit('cancelClick')
      this.tempDate1 = null
      this.creditPartData = null
      this.creditPartCondition = {
        OCustomerId: this.custom.customerId,  // 客户id
        startTime: null,
        OExistBill: 1,  //
        endTime: null,
        OOrderClosingStatus: 2,  //结清状态
        pageSize: 10000,
        pageNum: 1,
      }
    },

    // 挂账结算取消多选
    toggleSelection(rows){
      if(rows){
        rows.forEach(row => {
          this.$refs.creditPartTable.toggleRowSelection(row)
        })
      }else{
        this.$refs.creditPartTable.clearSelection()
      }
    },

    // 挂账结算->金额弹窗取消
    payCancel(){
      this.pay.payNumber = null
      this.innerVisible = false
    },

    // 挂账结算->确认金额
    payConfirm(){
      this.chargeInfo.charge.customId = this.creditPartCondition.OCustomerId
      console.log("chargeInfo");
      console.log(this.chargeInfo)
      let postData = JSON.parse(JSON.stringify(this.chargeInfo))
      for(let order of postData.orderList){
        delete order.oCreateTime
      }
      if(parseInt(this.chargeInfo.charge.alreadyIncome)>this.creditPartMoney){
        this.$message.error("已收金额大于应收金额，请重新确认")
      }else{
        this.$confirm('请确认金额','提示', {
          type:'warning'
        }).then(()=>{
          PostData('/bill/charge',postData).then((res)=>{
            console.log(res)
            this.creditPartData = []
            this.$message.success('成功')
            this.innerVisible = false
            this.$emit('cancelClick')
            this.pay.payNumber = null
            this.toggleSelection()
            this.creditPartCondition = {
              OCustomerId: null,  // 客户id
              startTime: null,
              OExistBill: 1,  //
              endTime: null,
              OOrderClosingStatus: 2,  //结清状态
              pageSize: 10000,
              pageNum: 1,
            }
          })
        }).catch(()=>{
          this.$message.error('支付失败，请重试')
        })
      }
    },
  }
}
</script>

<style scoped>

</style>
