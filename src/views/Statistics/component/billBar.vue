<template>
  <div>
    <div id="incomeBar" style="width: 300px;height: 300px"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "billBar",
  data(){
    return {
      charts: '',
      incomeData: this.opinionData[0],
      outcomeData: this.opinionData[1],
    }
  },
  props: {
    opinion: Array,
    opinionData: Array,
  },
  mounted() {
    this.$nextTick(function (){
      this.drawBar('incomeBar')
    })
  },
  methods: {
    drawBar(id){
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {text: '收支记录'},
        xAxis: [
          {
            type: 'category',
            data: this.opinion
          }
        ],
        yAxis: {},
        legend: {
          orient: 'vertical',
          x: 'right',
          data: [
            {
              name: '收入',
            },
            {
              name: '支出',
            }
          ]
        },
        series: [
          {
            name:'收入',
            type: 'bar',
            data: this.incomeData
          },
          {
            name:'支出',
            type: 'bar',
            data: this.outcomeData
          }
        ],
      })
    }
  },
  watch: {
    opinionData: {
      handler: function (){
        this.drawBar('incomeBar')
      }
    }
  }
}
</script>

<style scoped>

</style>
