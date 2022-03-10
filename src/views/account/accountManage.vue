<template>
  <div style="display: flex;flex-flow:column nowrap;overflow: hidden;">
    <div class="form-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="客户姓名：">
<!--          <el-input placeholder="请输入姓名" v-model="orderQuery.name" clearable></el-input>-->
          <el-autocomplete
            class="inline-input"
            :fetch-suggestions="querySearch"
            v-model="orderQuery.cuUnitName"
            @select="handleSelect"
          ></el-autocomplete>
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
          <el-select v-model="orderQuery.orderType" placeholder="请选择类型" clearable>
            <el-option
              v-for="item in orderType"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="orderQuery.dealType" placeholder="请选择类型" clearable>
            <el-option
              v-for="item in dealType"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          <el-button type="primary" @click="creditPartVisible = true">挂账结算</el-button>
          <el-button type="primary" @click="creditAllVisible = true">挂账结清</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="overflow: auto;flex: 1;" class="content-box">
      <div class="table-box">
        <el-table
          :data="creditRecords"
          border
          fit
          highlight-current-row
          style="width: 100%">
          <el-table-column label="姓名" align="center" prop="customId"></el-table-column>
          <el-table-column label="已收" align="center" prop="alreadyIncome"></el-table-column>
          <el-table-column label="应收" align="center" prop="supposeIncome"></el-table-column>
          <el-table-column label="时间" align="center" prop="createTime"></el-table-column>
          <el-table-column label="应付" align="center" prop="supposeOutcome"></el-table-column>
          <el-table-column label="实付" align="center" prop="realOutcome"></el-table-column>
          <el-table-column label="实收" align="center" prop="realIncome"></el-table-column>
          <el-table-column label="已付" align="center" prop="alreadyOutcome"></el-table-column>
        </el-table>
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :page-size="orderQuery.pageSize"
          :current-page="orderQuery.pageNum"
          :total="pageTotal"
          style="padding: 30px 0; text-align: right;"
          @current-change="getList"
        />
      </div>
      <div class="total-box" >
        <div class="table-button-box">
          <el-button type="primary" @click="chargeVisible = true">挂账交易记录信息</el-button>
          <el-button type="primary" @click="chargeSettleVisible">挂账交易结清信息</el-button>
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
    <div>
      <pay-part :part-visible="creditPartVisible" @cancelClick="creditPartVisible = false"></pay-part>
    </div>

<!--    挂账结清弹窗-->
    <div>
      <pay-all :all-visible="creditAllVisible" @cancelClick="creditAllVisible = false"></pay-all>
    </div>

    <div>
      <charge-dialog :visible="chargeVisible" @chargeClose="chargeVisible = false"></charge-dialog>
    </div>
  </div>
</template>

<script>

// import {parseTime} from "@/utils";
import PayPart from "@/views/account/dialog/PayPart";
import PayAll from "@/views/account/dialog/PayAll";
import CreditRecordTable from "@/views/account/table/creditRecordTable";
import ChargeDialog from "@/views/account/dialog/ChargeDialog";
import {PostData} from "@/api";
import qs from "qs";
import {parseTime} from "@/utils";

export default {
  name: "accountManage",
  components: {
    CreditRecordTable,
    PayPart,
    PayAll,
    ChargeDialog
  },
  data(){
    return {
      creditPartVisible:false,
      tempDate: null,
      orderQuery: {
        CustomerId: null,
        name: null,
        dealType: null,
        orderType: null,
        pageSize:10,
        pageNum: 1,
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
      creditAllVisible: false,
      chargeVisible: false,
      chargeSettleVisible: false,
    }
  },
  computed: {
    totalMoney: function (){
      return this.accountDetail.cashMoney + this.accountDetail.buyerOnCredit + this.accountDetail.payOnLine
    },
  },
  methods: {
    getList(){
      PostData('/bill/getBillOrderList', this.orderQuery).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err);
      })
    },

    querySearch(queryString, cb){

    },

    handleSelect(item){

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
