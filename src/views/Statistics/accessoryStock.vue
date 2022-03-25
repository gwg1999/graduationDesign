<template>
  <div>
    <div style="overflow: auto">
      <order-sum class="data-box" :cardData="cardData"></order-sum>
    </div>
    <div class="line"></div>
    <div style="overflow: auto;flex:1;">
      <div class="chart-box">
        <div id="sellPie" style="width: 600px;height: 400px"></div>
      </div>
      <div class="top10">
        <div style="justify-content: space-around;display: flex;margin-bottom: 10px">
          <el-button type="primary" @click="getTop('day')">当日top</el-button>
          <el-button type="primary">当月top</el-button>
        </div>
        <el-table
          :data="topData"
          border
          fit
          highlight-current-row
          style="width: 100%">
          <el-table-column
            label="排名"
            width="50%"
            align="center">
            <template slot-scope="scope">
              {{scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="零件类别" align="center"></el-table-column>
          <el-table-column label="售出数量" align="center" width="200"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import orderSum from "@/views/Statistics/component/orderSum";
import echarts from "echarts";

export default {
  name: "accessoryStock",
  components: {
    orderSum,
  },
  created(){
    this.getChartData()
    // this.drawPie('sellPie')
  },
  mounted() {
    this.$nextTick(function (){
      this.drawPie('sellPie')
    })
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
