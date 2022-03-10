<template>
  <div>
    <el-dialog title="挂账结算" :visible.sync="partVisible" @close="creditPartCancel" :show-close="false">
      <div class="form-box">
        <el-form :inline="true" style="border-bottom: solid gainsboro 1px">
          <el-form-item label="客户姓名">
            <el-input v-model="creditPartCondition.name" clearable></el-input>
          </el-form-item>
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
          <el-table-column label="客户名称" prop="customerName"></el-table-column>
          <el-table-column label="时间" prop="oCreateTime"></el-table-column>
          <el-table-column label="应收" prop="oSupposeIncome"></el-table-column>
          <el-table-column label="支付方式" prop="oPaymentWay"></el-table-column>
          <el-table-column label="账单状态" prop="oOrderClosingStatus"></el-table-column>
          <el-table-column label="状态" prop="oStatus"></el-table-column>
        </el-table>
      </div>
      <div style="text-align: right;margin-top: 10px">
        <el-button type="primary" @click="creditPartCancel">取消</el-button>
        <el-button type="primary" @click="creditPartConfirm">确认</el-button>
      </div>


      <el-dialog width="30%" title="结算金额" :visible.sync="innerVisible" append-to-body>
        <el-form label-width="60px" :rules="creditPartRules" :model="pay" ref="payForm">
          <el-form-item label="应收">{{ creditPartMoney }}</el-form-item>
          <el-form-item label="实收" prop="payNumber">
            <el-input v-model="pay.payNumber"></el-input>
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
        name: null,
        startTime: null,
        beginTime: null,
        createTimeSequence: 0,
        endTimeSequence: 0,
        isExistBill: 1,
        endTime: null,
      },
      tempDate1: null,
      creditPartSelection: [],
      creditPartRules: {
        payNumber: [
          {required: true, message: '请输入实收金额', trigger: ['change', 'blur']}
        ]
      },
      chargeInfo: {
        charge: {
          alreadyIncome: 0,
          alreadyOutcome: 0,
          customId: null,
          dealPicture: null,
          isDeal: 0,
          realIncome: 0,
          realOutcome: 0,
          supposeIncome: 0,
          supposeOutcome: 0,
          wholePrice: 0,
        },
        orderList: []
      },
    }
  },
  props: {
    partVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    creditPartVisible: function (){
      return this.partVisible
    },
    creditPartMoney: function (){
      let total = 0
      for(let selection of this.creditPartSelection){
        total += selection.oSupposeIncome
      }
      this.chargeInfo.charge.supposeIncome = total
      return total
    }
  },
  methods: {

    // 挂账结算查询
    creditPartSearch(){
      if(this.tempDate1){
        this.creditPartCondition.beginTime = parseTime(this.tempDate1[0],'{y}-{m}-{d}')
        this.creditPartCondition.endTime = parseTime(this.tempDate1[1],'{y}-{m}-{d}')
      }
      console.log(this.creditPartCondition)
      princeSlips.queryAll(this.creditPartCondition.name,this.creditPartCondition.beginTime
        ,this.creditPartCondition.endTime,this.creditPartCondition.createTimeSequence,
        this.creditPartCondition.endTimeSequence, this.creditPartCondition.pageNum,
        this.creditPartCondition.pageSize,this.creditPartCondition.isExistBill)
        .then(res=>{
          console.log(res);
          this.creditPartData = res.list
          for(let data of this.creditPartData){
            data.oCreateTime = parseTime(data.oCreateTime, '{y}-{m}-{d}')
          }
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
        this.chargeInfo.charge.customId = this.creditPartSelection[0].oCustomerId
        this.chargeInfo.orderList = this.creditPartSelection
        console.log(this.creditPartSelection)
      })
    },

    // 取消挂账结算弹窗
    creditPartCancel(){
      this.toggleSelection()
      this.$emit('cancelClick')
      this.tempDate1 = null
      this.creditPartCondition = {
        name: null,
        startTime: null,
        beginTime: null,
        createTimeSequence: 0,
        endTimeSequence: 0,
        isExistBill: 1,
        endTime: null,
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
      console.log("chargeInfo");
      console.log(this.chargeInfo)
      if(parseInt(this.pay.payNumber)>this.creditPartMoney){
        this.$message.error("实收金额大于应收金额，请重新确认")
      }else{
        this.$confirm('请确认金额','提示', {
          type:'warning'
        }).then(()=>{
          this.chargeInfo.charge.realIncome = this.pay.payNumber
          PostData('/bill/charge',this.chargeInfo).then(()=>{
            this.$message.success('成功')
            this.innerVisible = false
            this.$emit('cancelClick')
            this.pay.payNumber = null
            this.toggleSelection()
            this.creditPartCondition = {
              name: null,
              startTime: null,
              beginTime: null,
              createTimeSequence: 0,
              endTimeSequence: 0,
              isExistBill: 1,
              endTime: null,
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
