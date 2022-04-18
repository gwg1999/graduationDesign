<template>
  <div>
    <div class="formBox">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="securityQuery.location"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getSecurityList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBox">
      <el-table fit highlight-current-row max-height="30rem" :data="securityData" border>
        <el-table-column align="center" width="80">
          <template v-slot="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="汇报人" prop="findPerson" align="center"></el-table-column>
        <el-table-column label="汇报日期" prop="submitTime" align="center"></el-table-column>
        <el-table-column label="地点" prop="location" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.status===0?'success':'danger'">
              {{scope.row.status===0?'已处理':'未处理'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-button type="primary">查看详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total,prev,pager,next"
        :total="total"
        :page-size="securityQuery.pageSize"
        :current-page="securityQuery.pageNum"
        @current-change="getSecurityList"
        class="pagination"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SecurityPage",
  data(){
    return {
      securityQuery: {},
      securityData: [
        {
          findPerson: '张三'
        }
      ],
      total: 0,
    }
  },
  created(){
    this.getSecurityList()
    this.securityQuery = new this.initQuery()
    console.log(this.securityQuery)
  },
  methods: {
    initQuery(){
      this.pageSize = 10
      this.pageNum = 1
      this.location = ''
    },
    getSecurityList(page=1){
      this.securityQuery.pageNum = page
      console.log('获取数据')
    },
  }
}
</script>

<style scoped>
.pagination{
  float: right
}
.formBox{
  display: flex;
  justify-content: space-around;
}
</style>
