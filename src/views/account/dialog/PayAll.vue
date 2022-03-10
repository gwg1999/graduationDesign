<template>
  <div>
    <el-dialog title="挂账结清" :visible.sync="allVisible" @close="creditAllCancel" :show-close="false">
      <div class="form-box">
        <el-form :inline="true" style="border-bottom: solid gainsboro 1px">
          <el-form-item label="客户姓名">
            <el-input v-model="creditAllCondition.name"></el-input>
          </el-form-item>
          <el-form-item label="交易时间">
            <el-date-picker
              v-model="tempDate2"
              type="daterange"
              start-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="creditAllSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          fit
          border
          highlight-current-row
          :data="creditAllData"
          height="300"
          @selection-change="creditAllSelectionChange"
          ref="creditAllTable">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" prop="id"></el-table-column>
          <el-table-column label="时间" prop="sTime"></el-table-column>
          <el-table-column label="应收" prop="money"></el-table-column>
        </el-table>
      </div>
      <div style="text-align: right;margin-top: 10px">
        <el-button type="primary" @click="creditAllCancel">取消</el-button>
        <el-button type="primary" @click="creditAllConfirm">确认</el-button>
      </div>
      <el-dialog width="30%" title="结算金额" :visible.sync="creditAllInnerVisible" append-to-body>
        <el-form label-width="60px" :rules="creditAllRules" :model="pay">
          <el-form-item label="应收">{{ creditAllMoney }}</el-form-item>
          <el-form-item label="实收" prop="payNumber">
            <el-input v-model="pay.payNumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="payAllCancel">取消</el-button>
            <el-button type="primary" @click="payAllConfirm">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {parseTime} from "@/utils";

export default {
  name: "PayAll",
  props: {
    allVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    creditAllMoney: function (){
      let total = 0
      for(let selection of this.creditAllSelection){
        total += selection.money
      }
      return total
    }
  },
  data(){
    return {
      creditAllCondition: {
        name: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
      },
      creditAllInnerVisible: false,
      tempDate2: null,
      creditAllData: [],
      creditAllRules:{
        payNumber: [
          {required: true, message: '请输入实收金额', trigger: ['blur', 'change']}
        ],
      },
      pay: {
        payNumber: null,
      },
      creditAllSelection: [],
      chargeSettleInfo: {
        alreadyIncome: null,
        alreadyOutcome: null,
        isDeal: null,
        realIncome: null,
        supposeIncome: null,
        supposeOutcome: null,
        wholePrice: null,
      },
    }
  },
  methods: {
    // 挂账结清取消多选
    toggleAllSelection(rows){
      if(rows){
        rows.forEach(row => {
          this.$refs.creditAllTable.toggleRowSelection(row)
        })
      }else{
        this.$refs.creditAllTable.clearSelection()
      }
    },

    // 挂账结清弹窗搜索
    creditAllSearch(){
      if(this.tempDate2){
        this.creditAllCondition.startTime = parseTime(this.tempDate2[0], '{y}-{m}-{d}')
        this.creditAllCondition.endTime = parseTime(this.tempDate2[1], '{y}-{m}-{d}')
        console.log(this.creditAllCondition)
      }
    },

    // 挂账结清弹窗取消
    creditAllCancel(){
      this.$emit('cancelClick')
      this.toggleAllSelection()
      this.tempDate2=null

    },

    // 挂账结清确认->打开金额弹窗
    creditAllConfirm(){
      this.$confirm('确认是否结清', '提示', {
        type: 'warning'
      }).then(()=>{
        this.creditAllInnerVisible = true
      }).catch()
    },

    // 挂账结清->金额弹窗关闭
    payAllCancel(){
      this.creditAllInnerVisible = false
      this.pay.payNumebr = null
    },

    // 挂账结清->金额确认
    payAllConfirm(){

      if(parseInt(this.pay.payNumber)!==this.creditAllMoney){
        this.$message.error("实收与应收不符，请确认金额")
      }else{
        this.$confirm('请确认是否结清', '提示', {
          type: 'warning'
        }).then(()=>{
          this.$message.success("结清成功")
          this.pay.payNumebr = null
          this.toggleAllSelection()
          this.creditAllInnerVisible = false
          this.$emit('cancelClick')
          // this.creditAllVisible = false
          this.creditAllCondition = {
            name: null,
            startTime: null,
            endTime: null,
          }
          this.tempDate2 = null
        }).catch(()=>{
          this.$message.error("结清失败，请重试")
        })
      }
    },

    // 挂账结清多选
    creditAllSelectionChange(val){
      this.creditAllSelection = val
    },
  }
}
</script>

<style scoped>

</style>
