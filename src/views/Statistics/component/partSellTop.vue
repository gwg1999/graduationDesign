<template>
  <div class="container">
    <div :id="barType" style="width: 30rem;height: 15rem"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "partSellTop",
  data(){
    return {
      charts: '',
    }
  },
  props: {
    topData: Array,
    barType: String,
  },
  methods: {
    drawBar(id){
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: this.barType
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      })
      // this.charts.setOption({
      //   dataset: [
      //     {
      //       dimensions: ['name', 'age', 'profession', 'score', 'date'],
      //       source: [
      //         ['Hannah Krause', 41, 'Engineer', 314, '2011-02-12'],
      //         ['Zhao Qian', 20, 'Teacher', 351, '2011-03-01'],
      //         ['Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
      //         ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
      //         ['Karle Neumann', 25, 'Engineer', 253, '2011-04-02'],
      //         ['Adrian Groß', 19, 'Teacher', '-', '2011-01-16'],
      //         ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
      //         ['Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
      //         ['Han Meimei', 67, 'Engineer', 366, '2011-03-12']
      //       ]
      //     },
      //     {
      //       transform: {
      //         type: 'sort',
      //         config: { dimension: 'score', order: 'desc' }
      //       }
      //     }
      //   ],
      //   xAxis: {
      //     type: 'category',
      //     axisLabel: { interval: 0, rotate: 30 }
      //   },
      //   yAxis: {},
      //   series: {
      //     type: 'bar',
      //     encode: { x: 'name', y: 'score' },
      //     datasetIndex: 1
      //   }
      // })
    }
  },
  mounted() {
    this.$nextTick(function(){
      console.log(document.getElementById(this.barType))
      this.drawBar(this.barType)
    })
  }
}
</script>

<style scoped>

</style>
