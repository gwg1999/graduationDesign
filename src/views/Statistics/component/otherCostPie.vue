<template>
  <div style="justify-content: center;padding: 10px">

    <div id="percentPie" style="width: 600px;height: 400px"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "otherCostPie",
  data(){
    return {
      charts: '',
      // opinion: ['男','女'],
      // opinionData: [
      //   {value: 330,name: '男'},
      //   {value: 130,name: '女'}
      // ]
    }
  },
  props: {
    opinionData: Array,
    opinion: Array,
  },
  methods: {
    drawPie(id){
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"  // 用匿名函数自定义格式
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
    }
  },
  mounted(){
    this.$nextTick(function (){
      this.drawPie('percentPie')
    })
  },
}
</script>

<style scoped>
.card-box{
  margin-bottom: 20px;
  justify-content: center;
}
</style>
