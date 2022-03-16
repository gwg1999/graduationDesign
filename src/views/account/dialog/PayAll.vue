<template>
  <div>
    <el-dialog title="挂账结清" :visible.sync="dialogVisible" @close="creditAllCancel">
      <div class="form-box">
        <el-form :inline="true" style="border-bottom: solid gainsboro 1px">
          <el-form-item label="客户姓名">
<!--            <el-input v-model="creditAllCondition.name"></el-input>-->
            <el-autocomplete v-model="creditAllCondition.name" :fetch-suggestions="querySearch" @select="handleSelect"></el-autocomplete>
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
          <el-table-column label="时间" align="center" prop="createTime"></el-table-column>
          <el-table-column label="应收" align="center" prop="supposeIncome"></el-table-column>
          <el-table-column label="实收" align="center" prop="realIncome"></el-table-column>
          <el-table-column label="已收" align="center" prop="alreadyIncome"></el-table-column>
        </el-table>
      </div>
      <div style="text-align: right;margin-top: 10px">
        <el-button type="primary" @click="creditAllCancel">取消</el-button>
        <el-button type="primary" @click="creditAllConfirm">确认</el-button>
      </div>
      <el-dialog width="30%" title="结算金额" :visible.sync="creditAllInnerVisible" append-to-body>
        <el-form label-width="60px" :rules="creditAllRules" :model="chargeSettleInfo.chargeSettle">
          <el-form-item label="应收">{{ creditAllMoney }}</el-form-item>
          <el-form-item label="已收" prop="alreadyIncome">
            <el-input v-model="chargeSettleInfo.chargeSettle.alreadyIncome"></el-input>
          </el-form-item>
          <el-form-item label="实收" prop="realIncome">
            <el-input v-model="chargeSettleInfo.chargeSettle.realIncome"></el-input>
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
import {PostData} from "@/api";

export default {
  name: "PayAll",
  props: {
    allVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    allVisible: {
      handler: function (){
        this.dialogVisible = this.allVisible
      }
    }
  },
  computed: {
    creditAllMoney: function (){
      let total = 0
      for(let selection of this.creditAllSelection){
        total += (selection.supposeIncome-selection.alreadyIncome)
      }
      this.chargeSettleInfo.chargeSettle.supposeIncome = total
      return total
    }
  },
  data(){
    return {
      creditAllCondition: {
        customId: null,
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
        chargeSettle: {
          alreadyIncome: 0,
          alreadyOutcome: 0,
          customId: 0,
          isDeal: 0,
          realIncome: 0,
          realOutcome: 0,
          supposeIncome: 0,
          supposeOutcome: 0,
          wholePrice: 0
        },
        chargeList: []
      },
      dialogVisible: false,
    }
  },
  methods: {

    // 输入框搜索建议
    querySearch(queryString, cb){
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
      this.creditAllCondition.customId = item.cuId
      console.log('creditAllCondition')
      console.log(item);
    },


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
      if(!this.creditAllCondition.name){
        this.$message.warning('请选择客户后搜索')
      }else{
        PostData('/bill/getChargeList', this.creditAllCondition).then((res)=>{
          console.log("chargeList:")
          console.log(res);
          this.creditAllData = res.list
          for(let record of this.creditAllData){
            record.createTime = parseTime(record.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
          this.pageTotal = res.total
        })
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
        this.chargeSettleInfo.chargeList = this.creditAllSelection
        for(let charge of this.chargeSettleInfo.chargeList){
          delete charge.createTime
        }
        this.chargeSettleInfo.chargeSettle.customId = this.creditAllCondition.customId
        this.creditAllInnerVisible = true
        console.log('chargeSettleInfo:')
        console.log(this.chargeSettleInfo)
      }).catch()
    },

    // 挂账结清->金额弹窗关闭
    payAllCancel(){
      this.creditAllInnerVisible = false
      this.pay.payNumebr = null
    },

    // 挂账结清->金额确认
    payAllConfirm(){
      console.log('chargeSettleInfo:')
      console.log(this.chargeSettleInfo)
      if(parseInt(this.chargeSettleInfo.chargeSettle.alreadyIncome)!==this.creditAllMoney){
        this.$message.error("实收与应收不符，请确认金额")
      }else{
        this.$confirm('请确认是否结清', '提示', {
          type: 'warning'
        }).then(()=>{
          PostData('/bill/chargeSettle', this.chargeSettleInfo).then(res=>{
            console.log('res:')
            console.log(res);
            this.$message.success("结清成功")
            this.pay.payNumebr = null
            this.toggleAllSelection()
            this.creditAllInnerVisible = false
            this.$emit('cancelClick')
            this.creditAllCondition = {}
            this.tempDate2 = null
          }).catch(err=>{
            console.log('err:')
            console.log(err);
          })
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
