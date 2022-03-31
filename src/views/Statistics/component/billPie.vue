<template>
  <div id="billPie"></div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "billPie",
  data(){
    return {
      charts: ''
    }
  },
  props: {
    data: Array,
  },
  methods: {
    drawBillPie(id){
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '总收支'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          data: ['收入','支出']
        },
        series: [
          {
            name: '收支',
            type: 'pie',
            radius: ['50%','70%'],
            avoidLabelOverlap: true,
            data: this.data,
            label: {
              formatter: '{b}:{c}'
            }
          },
        ],
      })
    }
  },
  mounted() {
    this.$nextTick(function(){
      this.drawBillPie('billPie')
    })
  }
}
</script>

<style scoped>
#billPie{
  width: 400px;
  height: 300px;
}
</style>
