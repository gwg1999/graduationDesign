<template>
  <div style="display: flex;flex-flow:column nowrap;overflow: hidden;">
    <div class="form-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="客户姓名：">
          <el-input placeholder="请输入姓名" v-model="queryCondition.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="交易时间">
          <el-date-picker
            v-model="tempDate"
            type="daterange"
            start-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="queryCondition.orderType" placeholder="请选择类型" clearable>
            <el-option
              v-for="item in orderType"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="queryCondition.dealType" placeholder="请选择类型" clearable>
            <el-option
              v-for="item in dealType"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="testVisible = true">挂账结算</el-button>
          <el-button type="primary" @click="creditAll">挂账结清</el-button>
          <el-button type="primary" @click="creditAllVisible = true">挂账结清(测试)</el-button>
          <!--          <el-button type="primary" @click="testVisible = true">测试</el-button>-->
        </el-form-item>
      </el-form>
    </div>

    <div>
      <pay-part :part-visible="testVisible" @cancelClick="testVisible = false"></pay-part>
    </div>

    <div>
      <pay-all :all-visible="creditAllVisible" @cancelClick="creditAllVisible = false"></pay-all>
    </div>

    <div style="overflow: auto;flex: 1;" class="content-box">
      <div class="table-box">
        <!--        可变表格-->
        <el-table
          :data="creditRecords"
          border
          fit
          highlight-current-row
          style="width: 100%"
          v-if="queryCondition.tableType===0">
          <el-table-column label="序号" align="center"></el-table-column>
          <el-table-column label="金额" align="center"></el-table-column>
        </el-table>
        <el-table
          :data="creditRecords"
          border
          fit
          highlight-current-row
          style="width: 100%"
          v-if="queryCondition.tableType===1">
          <el-table-column label="序号" align="center"></el-table-column>
          <el-table-column label="数量" align="center"></el-table-column>
        </el-table>
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :page-size="queryCondition.pageSize"
          :current-page="queryCondition.pageNum"
          :total="pageTotal"
          style="padding: 30px 0; text-align: right;"
          @current-change="handlePageChange"
        />
      </div>
      <div class="total-box" >
        <div class="table-button-box">
          <el-button type="primary" @click="changeTableType(0)" :disabled="queryCondition.tableType===0">挂账交易记录信息</el-button>
          <el-button type="primary" @click="changeTableType(1)" :disabled="queryCondition.tableType===1">挂账交易结清信息</el-button>
        </div>
        <div class="detail-box">
          <div class="partAccount" style="font-size: x-large">
            金额详细统计
          </div>
          <div class="partAccount">
            挂账应收应付(￥)：
            <div class="accountNumber" v-if="accountDetail.buyerOnCredit>=0" style="color: green">{{accountDetail.buyerOnCredit}}</div>
            <div class="accountNumber" v-if="accountDetail.buyerOnCredit<0" style="color: red">{{accountDetail.buyerOnCredit}}</div>
          </div>
          <div class="partAccount">
            线上应收应付(￥)：
            <div class="accountNumber" v-if="accountDetail.payOnLine>=0" style="color: green">{{accountDetail.payOnLine}}</div>
            <div class="accountNumber" v-if="accountDetail.payOnLine<0" style="color: red">{{accountDetail.payOnLine}}</div>
          </div>
          <div class="partAccount">
            线下应收应付(￥)：
            <div class="accountNumber" v-if="accountDetail.cashMoney>=0" style="color: green">{{accountDetail.cashMoney}}</div>
            <div class="accountNumber" v-if="accountDetail.cashMoney<0" style="color: red">{{accountDetail.cashMoney}}</div>
          </div>
          <div class="totalAccount partAccount">
            总金额应收应付(￥)：
            <div class="accountNumber" v-if="accountDetail.cashMoney>=0" style="color: green;font-size: xxx-large">{{totalMoney}}</div>
            <div class="accountNumber" v-if="accountDetail.cashMoney<0" style="color: red;font-size: xxx-large">{{totalMoney}}</div>
          </div>
        </div>
      </div>
    </div>

    <!--    挂账结算弹窗-->
    <!--    <div>-->
    <!--      <el-dialog title="挂账结算" :visible.sync="creditPartVisible">-->
    <!--        <div class="form-box">-->
    <!--          <el-form :inline="true" style="border-bottom: solid gainsboro 1px">-->
    <!--            <el-form-item label="客户姓名">-->
    <!--              <el-input v-model="creditPartCondition.name" clearable></el-input>-->
    <!--            </el-form-item>-->
    <!--            <el-form-item label="交易时间">-->
    <!--              <el-date-picker-->
    <!--                v-model="tempDate1"-->
    <!--                type="daterange"-->
    <!--                start-separator="至"-->
    <!--                start-placeholder="开始日期"-->
    <!--                end-placeholder="结束日期"-->
    <!--              ></el-date-picker>-->
    <!--            </el-form-item>-->
    <!--            <el-form-item>-->
    <!--              <el-button type="primary" icon="el-icon-search" @click="creditPartSearch">查询</el-button>-->
    <!--            </el-form-item>-->
    <!--          </el-form>-->
    <!--        </div>-->
    <!--        <div>-->
    <!--          <el-table-->
    <!--            fit-->
    <!--            border-->
    <!--            highlight-current-row-->
    <!--            :data="creditPartData"-->
    <!--            height="300"-->
    <!--            @selection-change="creditPartSelectionChange"-->
    <!--            ref="creditPartTable">-->
    <!--            <el-table-column type="selection" width="55"></el-table-column>-->
    <!--            <el-table-column label="序号" prop="id"></el-table-column>-->
    <!--            <el-table-column label="时间" prop="sTime"></el-table-column>-->
    <!--            <el-table-column label="应收" prop="money"></el-table-column>-->
    <!--          </el-table>-->
    <!--        </div>-->
    <!--        <div style="text-align: right;margin-top: 10px">-->
    <!--          <el-button type="primary" @click="creditPartCancel">取消</el-button>-->
    <!--          <el-button type="primary" @click="creditPartConfirm">确认</el-button>-->
    <!--        </div>-->
    <!--        <el-dialog width="30%" title="结算金额" :visible.sync="innerVisible" append-to-body>-->
    <!--          <el-form label-width="60px" :rules="creditPartRules" :model="pay">-->
    <!--            <el-form-item label="应收">{{ creditPartMoney }}</el-form-item>-->
    <!--            <el-form-item label="实收" prop="payNumber">-->
    <!--              <el-input v-model="pay.payNumber"></el-input>-->
    <!--            </el-form-item>-->
    <!--            <el-form-item>-->
    <!--              <el-button type="primary" @click="payCancel">取消</el-button>-->
    <!--              <el-button type="primary" @click="payConfirm">确认</el-button>-->
    <!--            </el-form-item>-->
    <!--          </el-form>-->
    <!--        </el-dialog>-->
    <!--      </el-dialog>-->
    <!--    </div>-->

    <!--    挂账结清弹窗-->
    <!--    <div>-->
    <!--      <el-dialog title="挂账结清" :visible.sync="creditAllVisible">-->
    <!--        <div class="form-box">-->
    <!--          <el-form :inline="true" style="border-bottom: solid gainsboro 1px">-->
    <!--            <el-form-item label="客户姓名">-->
    <!--              <el-input v-model="creditAllCondition.name"></el-input>-->
    <!--            </el-form-item>-->
    <!--            <el-form-item label="交易时间">-->
    <!--              <el-date-picker-->
    <!--                v-model="tempDate2"-->
    <!--                type="daterange"-->
    <!--                start-separator="至"-->
    <!--                start-placeholder="开始日期"-->
    <!--                end-placeholder="结束日期"-->
    <!--              ></el-date-picker>-->
    <!--            </el-form-item>-->
    <!--            <el-form-item>-->
    <!--              <el-button type="primary" icon="el-icon-search" @click="creditAllSearch">查询</el-button>-->
    <!--            </el-form-item>-->
    <!--          </el-form>-->
    <!--        </div>-->
    <!--        <div>-->
    <!--          <el-table-->
    <!--            fit-->
    <!--            border-->
    <!--            highlight-current-row-->
    <!--            :data="creditAllData"-->
    <!--            height="300"-->
    <!--            @selection-change="creditAllSelectionChange"-->
    <!--            ref="creditAllTable">-->
    <!--            <el-table-column type="selection" width="55"></el-table-column>-->
    <!--            <el-table-column label="序号" prop="id"></el-table-column>-->
    <!--            <el-table-column label="时间" prop="sTime"></el-table-column>-->
    <!--            <el-table-column label="应收" prop="money"></el-table-column>-->
    <!--          </el-table>-->
    <!--        </div>-->
    <!--        <div style="text-align: right;margin-top: 10px">-->
    <!--          <el-button type="primary" @click="creditAllCancel">取消</el-button>-->
    <!--          <el-button type="primary" @click="creditAllConfirm">确认</el-button>-->
    <!--        </div>-->
    <!--        <el-dialog width="30%" title="结算金额" :visible.sync="creditAllInnerVisible" append-to-body>-->
    <!--          <el-form label-width="60px" :rules="creditAllRules" :model="pay">-->
    <!--            <el-form-item label="应收">{{ creditAllMoney }}</el-form-item>-->
    <!--            <el-form-item label="实收">-->
    <!--              <el-input v-model="pay.payNumber"></el-input>-->
    <!--            </el-form-item>-->
    <!--            <el-form-item>-->
    <!--              <el-button type="primary" @click="payAllCancel">取消</el-button>-->
    <!--              <el-button type="primary" @click="payAllConfirm">确认</el-button>-->
    <!--            </el-form-item>-->
    <!--          </el-form>-->
    <!--        </el-dialog>-->
    <!--      </el-dialog>-->
    <!--    </div>-->
  </div>
</template>

<script>

import {parseTime} from "@/utils";
import PayPart from "@/views/account/dialog/PayPart";
import PayAll from "@/views/account/dialog/PayAll";

export default {
  name: "accountManageBackUp",
  components: {
    PayPart,
    PayAll,
  },
  data(){
    return {
      testVisible:false,
      tempDate: null,
      // tempDate1: null,
      tempDate2: null,
      queryCondition: {
        name: null,
        dealType: null,
        orderType: null,
        pageSize:5,
        pageNum: 1,
        tableType: 0, // 0:记录信息，1：结清信息
      }, // 查询信息表单
      // creditPartCondition:{
      //   startTime: null,
      //   endTime: null,
      //   name: null,
      // },
      creditAllCondition: {
        startTime: null,
        endTime: null,
        name: null,
      },
      orderType: [
        {
          label: '销售单',
          value: 0
        },
        {
          label: '进货单',
          value: 1
        }
      ],
      dealType: [
        {
          label: '挂账',
          value: 0
        },
        {
          label: '线上',
          value: 1
        },
        {
          label: '线下',
          value: 2
        }
      ],
      accountDetail: {
        buyerOnCredit: -10,  //挂账
        payOnLine: 12.3,  //线上
        cashMoney: 200,  //线下
      },
      creditRecords: [],
      // creditPartData: [],
      // creditAllData: [],
      pageTotal: 0,
      creditPartVisible:false,
      creditAllVisible:false,
      innerVisible: false,
      creditAllInnerVisible: false,
      creditPartSelection: [],
      creditAllSelection: [],
      pay: {
        payNumber: null,
      },
      // creditPartRules: {
      //   payNumber: [
      //     {required: true, message: '请输入实收金额', trigger: ['change', 'blur']}
      //   ]
      // },
      creditAllRules: {
        payNumber: [
          {required: true, message: '请输入实收金额', trigger: ['blur', 'change']}
        ]
      },
    }
  },
  computed: {
    totalMoney: function (){
      return this.accountDetail.cashMoney + this.accountDetail.buyerOnCredit + this.accountDetail.payOnLine
    },
    creditPartMoney: function (){
      let total = 0
      for(let selection of this.creditPartSelection){
        total += selection.money
      }
      return total
    },
    creditAllMoney: function (){
      let total = 0
      for(let selection of this.creditAllSelection){
        total += selection.money
      }
      return total
    }
  },
  methods: {
    // 分页获取数据
    handlePageChange(){

    },

    //更改表格内容
    changeTableType(type){
      this.queryCondition.tableType = type
    },


    //  挂账结算相关函数

    // 挂账结算弹窗弹出
    creditPart(){
      this.creditPartVisible = true
      console.log('获取表格初始数据')
      // console.log('1')
    },

    // // 挂账结算查询
    // creditPartSearch(){
    //   if(this.tempDate1){
    //     this.creditPartCondition.startTime = parseTime(this.tempDate1[0],'{y}-{m}-{d}')
    //     this.creditPartCondition.endTime = parseTime(this.tempDate1[1],'{y}-{m}-{d}')
    //   }
    //   //调用后端api查询，返回结果
    //   console.log('查询条件：'+this.creditPartCondition)
    //   console.log('调用api，返回结果')
    // },
    //
    // // 挂账结算多选
    // creditPartSelectionChange(val){
    //   this.creditPartSelection = val
    // },
    //
    // // 挂账结算弹窗确认
    // creditPartConfirm(){
    //   if(this.creditPartSelection.length>0){
    //     this.$confirm("确认是否结账",'提示',{
    //       confirmButtonText: '确认',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(()=>{
    //       this.innerVisible = true
    //     })
    //   }else{
    //     this.$message.error('未勾选任何账单，请重新勾选')
    //   }
    //
    // },
    //
    // // 取消挂账结算弹窗
    // creditPartCancel(){
    //   this.toggleSelection()
    //   this.creditPartVisible = false
    //   this.tempDate1 = null
    //   this.creditPartCondition = {
    //     name: null,
    //     startTime: null,
    //     endTime: null,
    //   }
    // },
    //
    // // 挂账结算取消多选
    // toggleSelection(rows){
    //   if(rows){
    //     rows.forEach(row => {
    //       this.$refs.creditPartTable.toggleRowSelection(row)
    //     })
    //   }else{
    //     this.$refs.creditPartTable.clearSelection()
    //   }
    // },
    //
    // // 挂账结算->金额弹窗取消
    // payCancel(){
    //   this.pay.payNumber = null
    //   this.innerVisible = false
    // },
    //
    // // 挂账结算->确认金额
    // payConfirm(){
    //   if(parseInt(this.pay.payNumber)>this.creditPartMoney){
    //     this.$message.error("实收金额大于应收金额，请重新确认")
    //   }else{
    //     this.$confirm('请确认是否支付'+this.pay.payNumber,'提示', {
    //       type:'warning'
    //     }).then(()=>{
    //       console.log('金额确认')
    //       console.log('重新获取挂账交易记录信息')
    //       this.$message.success('成功')
    //       this.innerVisible = false
    //       this.creditPartVisible = false
    //       this.pay.payNumber = null
    //       this.toggleSelection()
    //       this.creditPartCondition = {
    //         name: null,
    //         startTime: null,
    //         endTime: null,
    //       }
    //     }).catch(()=>{
    //       this.$message.error('支付失败，请重试')
    //     })
    //   }
    //
    // },



    //  挂账结清相关函数

    // 挂账结清弹窗弹出
    creditAll(){
      this.creditAllVisible = true
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
    },

    // 挂账结清弹窗取消
    creditAllCancel(){
      this.creditAllVisible = false
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
      if(parseInt(this.payNumber)!==this.creditAllMoney){
        this.$message.error("实收与应收不符，请确认金额")
      }else{
        this.$confirm('请确认是否结清', '提示', {
          type: 'warning'
        }).then(()=>{
          this.$message.success("结清成功")
          this.payNumebr = null
          this.toggleAllSelection()
          this.creditAllInnerVisible = false
          this.creditAllVisible = false
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
  },
}
</script>

<style scoped>
.table-box{
  width: 80%;
  float: left;
  /*border-right: solid black 1px;*/
  height: 100%;
}
.total-box{
  overflow: hidden;
  border-left: black 1px solid;
}
.table-button-box{
  margin-top: 10px;
  margin-left: 10px;
}
.accountNumber{
  font-size: xx-large;
}
.detail-box{
  text-align: center;
  height: 100%;

}
.partAccount{
  margin-top: 20%;
}
.totalAccount{
  font-size: xx-large;
}
.form-box{
  overflow: auto;
  margin-top: 10px;
  padding-left: 10px;
  border-bottom: solid gainsboro 1px;
  /*margin-left: 10px;*/
  /*height: 60px;*/
}
/*.content-box{*/
/*  position: absolute;*/
/*  top: 60px;*/
/*  bottom: 0px;*/
/*  left: 10px;*/
/*}*/
</style>
