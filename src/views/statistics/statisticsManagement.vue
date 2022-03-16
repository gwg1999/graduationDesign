<template>
  <div>
    <el-card class="box-card">
      <div id="main" style="width: 1000px; height: 200px;"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods:{
    chartReview(){
      let  myChart = this.$echarts.init(document.getElementById('main'))
      myChart.setOption()
    }
  }
}
</script>

<style scoped>

</style>
