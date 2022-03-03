<template>
  <div>
    <el-dialog title="挂账结算(测试)" :visible.sync="creditPartVisible">
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
          <el-table-column label="序号" prop="id"></el-table-column>
          <el-table-column label="时间" prop="sTime"></el-table-column>
          <el-table-column label="应收" prop="money"></el-table-column>
        </el-table>
      </div>
      <div style="text-align: right;margin-top: 10px">
        <el-button type="primary" @click="creditPartCancel">取消</el-button>
        <el-button type="primary" @click="creditPartConfirm">确认</el-button>
      </div>
      <el-dialog width="30%" title="结算金额" :visible.sync="innerVisible" append-to-body>
        <el-form label-width="60px">
          <el-form-item label="应收">{{ creditPartMoney }}</el-form-item>
          <el-form-item label="实收">
            <el-input v-model="payNumber"></el-input>
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

export default {
  name: "PayPart",
  data(){
    return {
      creditPartData: [],
      payNumber: null,
      innerVisible: false,
      creditPartCondition: {
        name: null,
        startTime: null,
        endTime: null,
      },
      tempDate1: null,
      creditPartSelection: [],
      // creditPartVisible: false,
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
        total += selection.money
      }
      return total
    }
  },
  methods: {

    // 挂账结算查询
    creditPartSearch(){
      if(this.tempDate1){
        this.creditPartCondition.startTime = parseTime(this.tempDate1[0],'{y}-{m}-{d}')
        this.creditPartCondition.endTime = parseTime(this.tempDate1[1],'{y}-{m}-{d}')
      }
      //调用后端api查询，返回结果
      console.log('查询条件：'+this.creditPartCondition)
      console.log('调用api，返回结果')
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
      })
    },

    // 取消挂账结算弹窗
    creditPartCancel(){
      this.toggleSelection()
      this.creditPartVisible = false
      this.tempDate1 = null
      this.creditPartCondition = {
        name: null,
        startTime: null,
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
      this.payNumber = null
      this.innerVisible = false
    },

    // 挂账结算->确认金额
    payConfirm(){
      this.$confirm('请确认金额','提示', {
        type:'warning'
      }).then(()=>{
        console.log('金额确认')
        console.log('重新获取挂账交易记录信息')
        this.$message.success('成功')
        this.innerVisible = false
        this.creditPartVisible = false
        this.payNumber = null
        this.toggleSelection()
        this.creditPartCondition = {
          name: null,
          startTime: null,
          endTime: null,
        }
      }).catch(()=>{
        this.$message.error('支付失败，请重试')
      })
    },
  }
}
</script>

<style scoped>

</style>
