<template>
  <div>
    <div>
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
        <el-table-column label="税务所名称" align="center"></el-table-column>
        <el-table-column label="稽查/支付金额" align="center" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "topTen",
  data(){
    return{
      topData: [],
    }
  }
}
</script>

<style scoped>

</style>
