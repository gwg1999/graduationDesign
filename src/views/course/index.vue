<template>
  <div>
    <div>
      <el-form :inline="true">
        <el-form-item label="课程名">
          <el-input v-model="courseQuery.courseName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCourseList(1)">查询</el-button>
          <el-button type="primary" @click="dialogVisible = true">添加课程</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table :data="courseList" highlight-current-row fit border>
        <el-table-column align="center" width="80">
          <template v-slot="scope">
            {{scope.$index+(courseQuery.pageNum-1)*courseQuery.pageSize+1}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="课程名" prop="courseName"></el-table-column>
        <el-table-column align="center" label="课程学分" prop="courseCredit"></el-table-column>
        <el-table-column align="center" label="开课时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="状态">
          <template v-slot="scope">
            <div>
              <el-tag :type="scope.row.status===0?'danger':'success'">{{scope.row.status===0?'已停课':'开课中'}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-button type="primary" @click="changeStatus(scope.row)">{{scope.row.status===0?'开课':'停课'}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div style="overflow: hidden">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :page-size="courseQuery.pageSize"
          :current-page="courseQuery.pageNum"
          @current-change="getCourseList"
          class="pagination"
        ></el-pagination>
      </div>
    </div>

    <div>
      <el-dialog title="课程开设" :visible.sync="dialogVisible">
        <el-form label-width="120px" :model="formData"  :rules="formRules" ref="courseForm">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="formData.courseName" class="formInput"></el-input>
          </el-form-item>
          <el-form-item label="学分" prop="courseCredit">
            <el-input v-model="formData.courseCredit" class="formInput"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="insertCourse">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import {parseTime} from "@/utils";

export default {
  name: "index",
  data(){
    return {
      courseQuery: {},
      dialogVisible: false,
      formData: {
        teacherId: localStorage.getItem('id'),
        status: 1,
      },
      courseList: [],
      total: 1,
      formRules: {
        courseName: [
          {required: true, trigger: 'blur', message: '请输入课程名'}
        ],
        courseCredit: [
          {required: true, trigger: 'blur', message: '请输入课程学分'}
        ]
      }
    }
  },
  created() {
    this.courseQuery = new this.queryInit()
    this.getCourseList(1)
  },
  methods: {
    queryInit(){
      this.pageSize = 5
      this.pageNum = 1
      this.courseName = null
      this.teacherId = localStorage.getItem('id')
    },
    getCourseList(page = 1){
      this.courseQuery.pageNum = page
      PostData('/course/getCourses',this.courseQuery).then(res=>{
        this.total = res[1]
        this.courseList = res[0]
        for(let item of this.courseList){

          item.createTime = parseTime(new Date(item.createTime),'{y}-{m}-{d} {h}:{i}:{s}')
        }
        console.log(res)
      })
    },

    changeStatus(course){
      console.log('course:',course)
      let temp = JSON.parse(JSON.stringify(course))
      temp.status = 1 - parseInt(temp.status)
      PostData('/course/changeStatus',temp).then(()=>{
        this.getCourseList(this.courseQuery.pageNum)
      })
    },

    insertCourse(){
      this.$refs.courseForm.validate((valid)=>{
        if(valid){
          PostData('/course/insertCourse',this.formData).then(res=>{
            console.log(res)
            this.dialogVisible = false
            this.$refs.courseForm.resetFields()
            this.getCourseList(this.courseQuery.pageNum)
          })
        }else{
          this.$message.error('信息不完整，提交失败')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.pagination{
  float: right;

}
.formInput{
  width: 200px;
}
</style>
