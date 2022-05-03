<template>
  <div>
    <div class="formBox">
      <el-form :inline="true">
        <el-form-item label="实验室楼号">
          <el-input v-model="securityQuery.building_loc"></el-input>
        </el-form-item>
        <el-form-item label="实验室教室号">
          <el-input v-model="securityQuery.classroom_loc"></el-input>
        </el-form-item>
        <el-form-item label="状态">

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getSecurityList(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBox">
      <el-table fit highlight-current-row max-height="30rem" :data="securityData" border>
        <el-table-column align="center" width="80">
          <template v-slot="scope">
            {{scope.$index+(securityQuery.pageNum-1)*securityQuery.pageSize+1}}
          </template>
        </el-table-column>
        <el-table-column label="汇报人" prop="findPerson.username" align="center"></el-table-column>
        <el-table-column label="汇报日期" prop="submitTime" align="center"></el-table-column>
        <el-table-column label="地点" align="center" prop="location"></el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.status===1?'success':'danger'">
              {{scope.row.status===1?'已处理':'未处理'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-button type="primary" @click="showDetail(scope.row)">查看详情</el-button>
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

    <div>
      <el-dialog title="安全问题" :visible.sync="detailVisible">
        <el-form label-width="80px" :inline="true">
          <div>
            <el-form-item label="汇报人" style="width: 45%">
              <span>{{ securityInfo.findPerson?securityInfo.findPerson['username']:null }}</span>
            </el-form-item>
            <el-form-item label="汇报时间" style="width: 45%">
              <span>{{securityInfo.submitTime}}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="位置" style="width: 45%">
              <span>{{securityInfo.location}}</span>
            </el-form-item>
            <el-form-item label="状态" style="width: 45%">
              <span>{{securityInfo.status===1?'已处理':'未处理'}}</span>
            </el-form-item>
          </div>
          <div v-if="securityInfo.resolver2">
            <el-form-item label="处理人" style="width: 45%">
              <span>{{securityInfo.resolver2.username}}</span>
            </el-form-item>
            <el-form-item label="处理时间" style="width: 45%">
              <span>{{securityInfo.resolveTime}}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="介绍" style="width: 45%">
              <p style="width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin: 0">{{securityInfo.introduce}}</p>
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-around;" v-if="!securityInfo.resolver">
            <el-form-item>
              <el-button type="primary" @click="handleSecurity">处理</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import {parseTime} from "@/utils";

export default {
  name: "SecurityPage",
  data(){
    return {
      securityQuery: {},
      securityData: [],
      total: 0,
      detailVisible:false,
      securityInfo: {},
    }
  },
  created(){
    this.securityQuery = new this.initQuery()
    this.getSecurityList(1)
  },
  methods: {
    initQuery(){
      this.pageSize = 5
      this.pageNum = 1
      this.building_loc = null
      this.classroom_loc = null
      this.status = 0
    },

    showDetail(securityInfo){
      this.securityInfo = JSON.parse(JSON.stringify(securityInfo))
      console.log(this.securityInfo)
      this.detailVisible = true
    },

    handleSecurity(){
      this.securityInfo.resolver = localStorage.getItem('id')
      PostData('/security/handleSecurity',this.securityInfo).then(res=>{
        this.getSecurityList(this.securityQuery.pageNum)
        this.detailVisible = false
        console.log(res)
      })
    },

    getSecurityList(page=1){
      this.securityQuery.pageNum = page

      Object.keys(this.securityQuery).forEach((key)=>{
        if(!this.securityQuery[key]){this.securityQuery[key] = null}
      })
      console.log(this.securityQuery)
      PostData('/security/getSecurityList',this.securityQuery).then(res=>{
        console.log('res',res)
        this.total = res[1]
        this.securityData = res[0]
        for(let item of this.securityData){
          item.submitTime = parseTime(new Date(item.submitTime),'{y}-{m}-{d}')
          item.location = item.building_loc + '-' + item.classroom_loc
        }
      })
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
