<template>
  <div>
    <div style="overflow: auto">
      <order-sum class="data-box" :cardData="cardData"></order-sum>
    </div>
    <div class="line"></div>
    <div>

    </div>
    <div style="overflow: auto;flex:1;">
      <div class="chart-box">
        <bill-bar :opinion-data="[incomeData,outcomeData]" :opinion="['挂账','线上','线下']"></bill-bar>
      </div>
      <div class="top10">

      </div>
    </div>
  </div>
</template>

<script>
import orderSum from "@/views/Statistics/component/orderSum";
import echarts from "echarts";
import billBar from "@/views/Statistics/component/billBar";

export default {
  name: "accessoryStock",
  components: {
    billBar,
    orderSum,
  },
  created(){
    this.getChartData()
    // this.drawPie('sellPie')
  },
  mounted() {
  },
  data(){
    return {
      topData: [],
      cardData: [
        {
          label: '今日零件进货数',
          number: 1,
        },
        {
          label: '今日零件进货金额',
          number: 1,
        },
        {
          label: '当月零件进货数',
          number: 1,
        },
        {
          label: '当月零件进货金额',
          number: 1,
        }
      ],
      charts: '',
      opinion: ['男', '女'],
      opinionData: [
        {value: 330,name: '男'},
        {value: 130,name: '女'}
      ],
      incomeData: [10,20,15],
      outcomeData: [20,12,10]
    }
  },
  methods: {
    drawPie(id){
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          data: this.opinion
        },
        series: [
          {
            name: '性别',
            type: 'pie',
            radius: '50%',
            avoidLabelOverlap: true,
            data: this.opinionData
          }
        ]
      })
    },

    getChartData(){  // 获取饼状图数据
      this.opinion = ['男', '女']
      this.opinionData = [
        {value: 330,name: '男'},
        {value: 130,name: '女'}
      ]
    },

    getTop(time){  //获取当月或当日的top10

    }
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
