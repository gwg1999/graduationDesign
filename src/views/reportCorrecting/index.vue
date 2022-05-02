<template>
  <div>
    <div class="formBox">
      <el-form :inline="true">
        <el-form-item label="课程名">
          <el-input v-model="reportQuery.courseName"></el-input>
        </el-form-item>
        <el-form-item label="学生名">
          <el-input v-model="reportQuery.studentName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getReportList(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider></el-divider>

    <div class="tableBox">
      <el-table :data="reportData" highlight-current-row fit border>
        <el-table-column width="80" align="center">
          <template v-slot="scope">
            {{scope.$index}}
          </template>
        </el-table-column>
        <el-table-column label="课程名" align="center" prop="course.courseName"></el-table-column>
        <el-table-column label="学生名" align="center" prop="student.username"></el-table-column>
        <el-table-column label="报告文件(点击下载)" align="center">
          <template v-slot="scope">
            <a :href="scope.row.filePath" :download="scope.row.fileName">{{scope.row.fileName}}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="primary" @click="correctReport(scope.row)">批改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="overflow: hidden">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :page-size="reportQuery.pageSize"
          :current-page="reportQuery.pageNum"
          @current-change="getReportList"
          class="pagination"
        ></el-pagination>
      </div>
    </div>


    <div>
      <el-dialog title="批改" :visible.sync="dialogVisible">
        <el-form label-width="80px">
          <el-form-item label="成绩">
            <el-input v-model="formData.score" placeholder="请输入成绩" class="formInput"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";

export default {
  name: "index",
  data(){
    return {
      reportQuery: {},
      reportData:[],
      dialogVisible: false,
      formData: {},
      total: 0,
    }
  },
  created(){
    this.reportQuery = new this.queryObject()
    this.getReportList(1)
  },
  methods: {
    queryObject(){
      this.teacherId = parseInt(localStorage.getItem('id')) || ''
      this.courseName = null
      this.studentName = null
      this.pageSize = 10
      this.pageNum = 1
    },
    getReportList(page=1){
      this.reportQuery.pageNum = page
      console.log('reportQuery',this.reportQuery)
      PostData('/report/getReportList',this.reportQuery).then(res=>{
        this.reportData = res[0]
        this.total = res[1]
        console.log(res)
      })
    },
    correctReport(report){
      this.dialogVisible = true
      this.formData = JSON.parse(JSON.stringify(report))
    },
  }
}
</script>

<style scoped>
.formBox{
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.formInput{
  width: 120px;
}
.pagination{
  float: right;
}
</style>
