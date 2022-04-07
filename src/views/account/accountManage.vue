<template>
  <div style="display: flex;flex-flow:column nowrap;overflow: hidden;">
    <div class="form-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="客户：">
<!--          <el-input placeholder="请输入姓名" v-model="orderQuery.name" clearable></el-input>-->
          <el-autocomplete
            class="inline-input"
            :fetch-suggestions="querySearch"
            v-model="orderQuery.cuUnitName"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <div v-if="orderQuery.cuUnitName" style="display: inline-block;">
          <el-form-item label="交易时间">
            <el-date-picker
              v-model="tempDate"
              type="daterange"
              start-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="交易类型">
            <el-select v-model="orderQuery.paymentWay" placeholder="请选择类型" clearable>
              <el-option
                v-for="item in paymentWay"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          </el-form-item>
        </div>
        <el-form-item>

          <el-button type="primary" @click="creditPartVisible = true">挂账结算</el-button>
          <el-button type="primary" @click="creditAllVisible = true">挂账结清</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="overflow: auto;flex: 1;" class="content-box">
      <div class="table-box">
        <el-table
          :data="orders"
          border
          fit
          highlight-current-row
          style="width: 100%">
          <el-table-column
            label="序号"
            width="50%"
            align="center">
            <template slot-scope="scope">
              {{ (orderQuery.pageNum - 1) * orderQuery.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="发货方式" align="center" prop="oDeliveryWay"></el-table-column>
          <el-table-column label="支付方式" align="center" prop="oPaymentWay"></el-table-column>
          <el-table-column label="时间" align="center" prop="oCreateTime"></el-table-column>
          <el-table-column label="应收" align="center" prop="oSupposeIncome"></el-table-column>
          <el-table-column label="实收" align="center" prop="oRealIncome"></el-table-column>
<!--          <el-table-column label="结清状态" align="center"></el-table-column>-->
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
          <el-button type="primary" @click="chargeVisible = true">挂账结算记录</el-button>
          <el-button type="primary" @click="chargeSettleVisible = true">挂账结清记录</el-button>
        </div>
        <div class="detail-box">
          <div class="partAccount" style="font-size: x-large">
            金额详细统计
          </div>
          <div class="partAccount">
            挂账应收(￥)：
            <div class="accountNumber" style="color: red">{{accountDetail.chargeNumber}}</div>
          </div>
          <div class="partAccount">
            线上应收(￥)：
            <div class="accountNumber" style="color: red">{{accountDetail.onlineNumber}}</div>
          </div>
          <div class="partAccount">
            线下应收(￥)：
            <div class="accountNumber" style="color: red">{{accountDetail.outlineNumber}}</div>
          </div>
          <div class="totalAccount partAccount">
            总金额应收(￥)：
            <div class="accountNumber" style="color: red">{{accountDetail.allNumber}}</div>
          </div>
        </div>
      </div>
    </div>

<!--    挂账结算弹窗-->
    <div>
      <pay-part :part-visible="creditPartVisible" @cancelClick="payPartClose" :custom="orderQuery"></pay-part>
    </div>

<!--    挂账结清弹窗-->
    <div>
      <pay-all :all-visible="creditAllVisible" @cancelClick="payAllClose" :customer="orderQuery"></pay-all>
    </div>

<!--    挂账交易记录弹窗-->
    <div>
      <charge-dialog :visible="chargeVisible" @chargeClose="chargeVisible = false" :customer="orderQuery"></charge-dialog>
    </div>

<!--    挂账结清记录弹窗-->
    <div>
      <charge-settle-dialog :visible="chargeSettleVisible" @chargeClose="chargeSettleVisible = false" :customer="orderQuery"></charge-settle-dialog>
    </div>
  </div>
</template>

<script>

// import {parseTime} from "@/utils";
import PayPart from "@/views/account/dialog/PayPart";
import PayAll from "@/views/account/dialog/PayAll";
import ChargeDialog from "@/views/account/dialog/ChargeDialog";
import ChargeSettleDialog from "@/views/account/dialog/ChargeSettleDialog";
import {PostData} from "@/api";
import {parseTime} from "@/utils";

export default {
  name: "accountManage",
  components: {
    PayPart,
    PayAll,
    ChargeDialog,
    ChargeSettleDialog,
  },
  data(){
    return {
      creditPartVisible:false,
      tempDate: null,
      orderQuery: {
        customerId: null,
        name: null,
        closeStatus: 2,
        paymentWay: null,  // 交易类型：挂账，线上，线下
        orderType: 0,  // 订单类型：销售单
        pageSize: 10,
        pageNum: 1,
        startTime: null,
        endTime: null,
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
      paymentWay: [
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
        chargeNumber: 0,  //挂账
        onlineNumber: 0,  //线上
        outlineNumber: 0,  //线下
        allNumber: 0,
      },
      orders: [],
      pageTotal: 0,
      creditAllVisible: false,
      chargeVisible: false,
      chargeSettleVisible: false,
    }
  },
  computed: {

  },
  methods: {
    getList(){
      console.log('orderQuery:')
      console.log(this.orderQuery)
      PostData('/bill/getBillOrderList', this.orderQuery).then(res=>{
        this.accountDetail = res
        console.log(res)
        let temp = JSON.parse(res.orders)
        this.orders = temp.list
        for(let order of this.orders){
          order.oCreateTime = parseTime(order.oCreateTime,'{y}-{m}-{d} {h}:{i}:{s}')
        }
        this.pageTotal = temp.total
        console.log(temp)
      }).catch(err=>{
        console.log(err);
      })
    },

    querySearch(queryString, cb){
      PostData('customer/selectAllByLike', {cuUnitName: queryString, pageSize: 10000,pageNum: 1}).then(res=>{
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
      console.log('selectItem:')
      console.log(item)
      this.orderQuery.customerId = item.cuId
      this.orderQuery.name = item.cuUnitName
    },

    payPartClose(){
      this.creditPartVisible = false
      this.getList()
    },

    payAllClose(){
      this.creditAllVisible = false
      this.getList()
    }
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
  display: flex;
  justify-content: space-around;
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
