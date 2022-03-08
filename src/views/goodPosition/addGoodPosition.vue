<template>
  <div>
    <el-tabs >
      <el-tab-pane label="货物位置管理" name="first">
        <Position></Position>
      </el-tab-pane>
      <el-tab-pane label="车型号目录管理" name="second">
        <Car></Car>
      </el-tab-pane>
      <el-tab-pane label="零件类目管理" name="three">
        <Pcategory></Pcategory>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Position from '@/views/goodPosition/Position'
import Car from '@/views/goodPosition/car'
import Pcategory from '@/views/goodPosition/pCategory'
export default {
  name: "addGoodPosition",
  data() {
    return {
      activeName: 'second'
    };
  },
  components:{
    Position,
    Car,
    Pcategory
  }
}
</script>

<style scoped>

</style>
