<template>
  <div>
    <el-table
      :data="creditRecord"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column label="序号"></el-table-column>
      <el-table-column label="金额"></el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="stockQuery.pageSize"
      :current-page="stockQuery.pageNum"
      :total="pageTotal"
      style="padding: 30px 0; text-align: right;"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
export default {
  name: "CreditRecordTable",
  data(){
    return {
      creditRecord: [],
      stockQuery: {

      },
      pageTotal: null,

    }
  },
  props: {

  },
  methods: {
    handlePageChange(){

    },
  }
}
</script>

<style scoped>

</style>
