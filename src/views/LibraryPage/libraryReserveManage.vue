<template>
  <div>
    <div class="formBox">
      <el-form :inline="true">
        <el-form-item label="预定教师:">
          <el-input v-model="reserveQuery.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getAllReserve(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider></el-divider>

    <div>
      <el-table :data="libReserveData" highlight-current-row fit border>
        <el-table-column align="center" width="80">
          <template v-slot="scope">
            {{scope.$index}}
          </template>
        </el-table-column>
        <el-table-column label="预定教师" align="center" prop="user.username"></el-table-column>
        <el-table-column label="预定时间" align="center">
          <template v-slot="scope">
            <div>
              <span>{{scope.row.reserveDate}}&nbsp;&nbsp;&nbsp;{{'第'+scope.row.reserveTime+'节课'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实验室位置" align="center">
          <template v-slot="scope">
            {{scope.row.library.building_loc+'-'+scope.row.library.classroom_loc}}
          </template>
        </el-table-column>
        <el-table-column label="实验室介绍" align="center">
          <template v-slot="scope">
            <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.library.notes}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div style="overflow: hidden">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :page-size="reserveQuery.pageSize"
          :current-page="reserveQuery.pageNum"
          @current-change="getAllReserve"
          class="pagination"
        ></el-pagination>
      </div>

      <div style="overflow: hidden">
        <el-button type="primary" style="float: right" @click="turnBack()">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";

export default {
  name: "libraryReserveManage",
  data(){
    return {
      libraryInfo: {},
      reserveQuery: {},
      libReserveData: [],
      total: 0,
      timeDic: [
        {key: 1,time: '8:05-8:50'},
        {key: 2,time: '8:55-9:40'},
        {key: 3,time: '10:00-10:45'},
        {key: 4,time: '10:50-11:35'},
        {key: 5,time: '11:40-12:25'},
        {key: 6,time: '13:30-14:15'},
        {key: 7,time: '14:20-15:05'},
        {key: 8,time: '15:15-16:00'},
        {key: 9,time: '16:05-16:50'},
        {key: 10,time: '18:30-19:15'},
        {key: 11,time: '19:20-20:05'},
        {key: 12,time: '20:10-20:55'},
      ],
    }
  },
  beforeCreate() {

  },
  created() {
    this.reserveQuery = new this.queryInit()
    this.getAllReserve()
  },
  methods: {
    queryInit(){
      this.pageSize = 2
      this.pageNum = 1
      this.username = null
    },
    getAllReserve(page=1){
      this.reserveQuery.pageNum = page
      PostData('/library/getAllReserve',this.reserveQuery).then(res=>{
        this.libReserveData = res[0]
        this.total = res[1]
        console.log(res)
      })
    },

    turnBack(){
      this.$router.push('/library/index')
    }
  }
}
</script>

<style scoped>
.pagination{
  float: right;
}
</style>
