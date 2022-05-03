<template>
  <div>
    <div class="formBox">
      <el-form :inline="true">
        <el-form-item label="导师姓名">
          <el-input v-model="reportQuery.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="reportQuery.courseName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getReportList(1)">查询</el-button>
          <el-button type="primary" @click="reportVisible = true">报告上传</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider></el-divider>

    <div class="tableBox">
      <el-table :data="reportData" highlight-current-row fit border>
        <el-table-column align="center" width="80">
          <template v-slot="scope">
            {{scope.$index+(reportQuery.pageNum-1)*reportQuery.pageSize+1}}
          </template>
        </el-table-column>
        <el-table-column label="课程名" align="center" prop="course.courseName"></el-table-column>
        <el-table-column label="导师姓名" align="center" prop="teacher.username"></el-table-column>
        <el-table-column label="实验报告(点击下载)" align="center">
          <template v-slot="scope">
            <a :href="scope.row.filePath" :download="scope.row.fileName">{{scope.row.fileName}}</a>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.score?'success':'danger'">{{scope.row.score?'已批改':'未批改'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="得分" align="center" prop="score"></el-table-column>

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
      <el-dialog title="报告上传" :visible.sync="reportVisible">
        <el-form label-width="120px" ref="uploadForm" :model="formData">
          <el-form-item label="批改老师：" prop="teacherName">
            <el-autocomplete
              class="inline-input"
              v-model="formData.teacherName"
              :fetch-suggestions="teacherQueryString"
              placeholder="请输入内容"
              @select="selectTeacher"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="课程：" prop="courseName">
            <el-autocomplete
              class="inline-input"
              v-model="formData.courseName"
              :fetch-suggestions="courseQueryString"
              placeholder="请输入内容"
              @select="selectCourse"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <input type="file" v-show="false" @change="changeFile($event)" ref="fileInput"></input>
            <p v-if="files">{{files.name}}</p>
            <el-button @click="uploadImgs" type="primary">{{ files?'重新上传':'上传文件' }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {PostData} from "@/api";

export default {
  name: "uploadReport",
  data(){
    return {
      reportData: [],
      reportQuery: {},
      files: null,
      formData: {
        teacherName: ''
      },
      reportVisible:false,
      total: 0,
    }
  },
  created() {
    this.reportQuery = new this.queryInit()
    this.reportQuery.studentId = parseInt(localStorage.getItem('id')) || ''
    this.getReportList(1)
  },
  methods: {
    queryInit(){
      this.pageSize = 5
      this.pageNum = 1
      this.teacherName = null
      this.courseName = null
    },
    getReportList(page=1){
      this.reportQuery.pageNum = page
      console.log('reportQuery',this.reportQuery)
      PostData('/report/getReportList',this.reportQuery).then(res=>{
        console.log(res)
        this.reportData = res[0]
        this.total = res[1]
      })
    },

    loadPDF(){
      let baseURL = URL.createObjectURL(this.files)
      const link = document.createElement('a')
      link.href = baseURL
      link.setAttribute('download', this.files.name)
      document.body.appendChild(link)
      link.click()
    },
    uploadImgs() {
      this.$refs.fileInput.click();
    },

    changeFile: function (e) {
      this.files = e.target.files[0];
    },

    submitForm(){
      const form = new FormData()
      form.append('file',this.files)
      console.log('files:',form)
      axios.post('http://localhost:7001/report/upload',form,{headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
        console.log('res',res)
        this.formData.index = res.data.index;
        this.formData.studentId = parseInt(localStorage.getItem('id'))
        PostData('/report/uploadAgain',this.formData).then(res=>{
          this.$message.success('提交成功')
          this.$refs.uploadForm.resetFields()
          this.files = null
          this.reportVisible = false
          this.getReportList(this.reportQuery.pageNum)
        }).catch(()=>{
          this.$message.error('上传失败，请重试')
        })
      }).catch(()=>{
        this.$message.error('上传失败，请重试')
      })
    },

    teacherQueryString(queryString,cb){

      PostData('/user/getTeachers',{teacherName: queryString}).then(res=>{
        console.log(res)
        let teachers = res
        teachers.forEach((item)=>{
          item.value = item.username
        })
        cb(teachers)
      })
    },
    selectTeacher(item){
      this.formData.teacherId = item.index
    },

    courseQueryString(queryString,cb){
      PostData('/course/getCourses',{courseName: queryString}).then(res=>{
        console.log(res)
        let courses = res
        courses.forEach((item)=>{
          item.value = item.courseName
        })
        cb(courses)
      })
    },
    selectCourse(item){
      this.formData.courseId = item.courseId
    },
  },
}
</script>

<style scoped>
.pagination{
  float: right;
}
</style>
