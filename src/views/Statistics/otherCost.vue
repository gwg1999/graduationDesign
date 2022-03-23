<template>
  <div>
    <div style="overflow: auto">
      <order-sum class="data-box" :cardData="cardData"></order-sum>
    </div>
    <div class="line"></div>
    <div style="overflow: auto;flex:1;">
      <div class="chart-box">
        <div class="card-box">
          <el-row :gutter="12">
            <el-col :span="8" v-for="item in 3" :key="item">
              <el-card shadow="hover" class="data-card">
                {{item}}
              </el-card>
            </el-col>
          </el-row>
        </div>
        <other-cost-pie :opinion="opinion" :opinion-data="opinionData"></other-cost-pie>
      </div>
      <div class="top10">
        <top-ten></top-ten>
      </div>
    </div>
  </div>
</template>

<script>
import orderSum from "@/views/Statistics/component/orderSum";
import otherCostPie from "@/views/Statistics/component/otherCostPie";
import topTen from "@/views/Statistics/component/topTen";

export default {
  name: "index",
  components: {
    orderSum,
    otherCostPie,
    topTen
  },
  data(){
    return {
      cardData: [],
      opinion: [],
      opinionData: [],
    }
  },
  created() {
    this.getCardData()
    this.getChartData()
  },
  methods:{
    getCardData(){
      this.cardData = [
        {
          label: '今日总支出',
          number: 1,
        },
        {
          label: '当月支出金额',
          number: 1,
        },
        {
          label: '今日总支出订单数',
          number: 1,
        },
        {
          label: '当月支出总订单数',
          number: 1,
        }
      ]
    },

    getChartData(){
      this.opinion = ['男', '女']
      this.opinionData = [
        {value: 330,name: '男'},
        {value: 130,name: '女'}
      ]
    },
  }
}
</script>

<style scoped>
.data-box{
  margin-top: 10px;
}
.chart-box{
  float: left;
  /*border: solid 2px black;*/
}
.top10{
  overflow: hidden;
  /*border: solid 2px blue;*/
  padding: 10px;
}
.line{
  height: 1px;
  margin-top: 10px;
  border-top: 1px solid #000000;
  text-align: center;
}
</style>
