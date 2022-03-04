<template>
  <div class="table-box">
    <el-table
      :data="creditRecords"
      border
      fit
      highlight-current-row
      style="width: 100%"
      v-if="tableType===0">
      <el-table-column label="序号" align="center"></el-table-column>
      <el-table-column label="金额" align="center"></el-table-column>
    </el-table>
    <el-table
      :data="creditRecords"
      border
      fit
      highlight-current-row
      style="width: 100%"
      v-if="tableType===1">
      <el-table-column label="序号" align="center"></el-table-column>
      <el-table-column label="数量" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CreditRecordTable",
  data(){
    return {

    }
  },
  props: {
    creditRecords: {
      type: Array,
      default: []
    },
    tableType: Number,
  },
  methods: {
    handlePageChange(){

    },
  }
}
</script>

<style scoped>

</style>
