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
          <el-button type="primary" @click="creditAllVisible = true">挂账结清</el-button>
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
  </div>
</template>

<script>

import {parseTime} from "@/utils";
import PayPart from "@/views/account/dialog/PayPart";
import PayAll from "@/views/account/dialog/PayAll";

export default {
  name: "accountManage",
  components: {
    PayPart,
    PayAll,
  },
  data(){
    return {
      testVisible:false,
      tempDate: null,
      queryCondition: {
        name: null,
        dealType: null,
        orderType: null,
        pageSize:5,
        pageNum: 1,
        tableType: 0, // 0:记录信息，1：结清信息
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
      pageTotal: 0,
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
