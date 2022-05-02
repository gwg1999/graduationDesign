<template>
  <div>
    <div class="formBox" style="padding: 10px">
      <el-form :inline="true">
        <el-form-item label="楼号">
          <el-input v-model="libraryQuery.building_loc"></el-input>
        </el-form-item>
        <el-form-item label="教室号">
          <el-input v-model="libraryQuery.classroom_loc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getLibraryList(1)">查询</el-button>
          <el-button type="primary" @click="getReserveRecord">预定信息</el-button>
          <el-button type="primary" @click="getAllReserve">查看所有预定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="tableBox">
      <el-table :data="libraryData" fit highlight-current-row border>
        <el-table-column width="80" align="center">
          <template v-slot="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="位置" align="center">
          <template v-slot="scope">
            {{scope.row.building_loc}}-{{scope.row.classroom_loc}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template v-slot="scope">
            <div>
              <el-tag :type="tagDic[scope.row.status].type">{{tagDic[scope.row.status].str}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实验室简介" align="center">
          <template v-slot="scope">
            <p style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap">{{scope.row.notes}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-button type="primary" v-if="roles==='teacher'" @click="scheduleLib(scope.row)">预定</el-button>
              <el-button type="primary" v-if="roles==='teacher'" @click="modifyLib(scope.row)">查看信息</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="total,prev,pager,next"
        :total="total"
        :page-size="libraryQuery.pageSize"
        :current-page="libraryQuery.pageNum"
        @current-change="getLibraryList"
        class="pagination"
      ></el-pagination>
    </div>

    <div>
      <el-dialog :visible.sync="dialogVisible" title="预定信息">
        <el-table :data="reserveData" highlight-current-row fit border height="20rem">
          <el-table-column align="center" width="80px">
            <template v-slot="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column label="位置" align="center">
            <template v-slot="scope">
              {{scope.row.library.building_loc+'-'+scope.row.library.classroom_loc}}
            </template>
          </el-table-column>
          <el-table-column label="日期" align="center">
            <template v-slot="scope">
              {{scope.row.reserveDate+'第'+scope.row.reserveTime+'节'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="primary" @click="cancelReserve(scope.row)">取消预订</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import {PostData} from "@/api";

export default {
  name: "libraryPage",
  data(){
    return {
      libraryData: [],
      reserveData: [],
      libraryQuery: {},
      roles: this.$store.getters.roles[0],
      library: {},
      dialogVisible: false,
      total: 0,
      tagDic: [
        {type:'info',str: '维修中'},
        {type: 'success', str: '空闲'},
        {type: 'warning', str: '占用中'},
      ]
    }
  },
  created(){
    this.libraryQuery = new this.queryObject()
    this.getLibraryList(1)
  },
  methods: {
    queryObject(){
      this.pageSize = 10
      this.pageNum = 1
      this.building_loc = null
      this.classroom_loc = null
    },

    getReserveRecord(){
      PostData('/library/getByTeacher',{teacherId: localStorage.getItem('id')}).then(res=>{
        console.log(res)
        this.reserveData = res
      })
      this.dialogVisible = true
    },

    getLibraryList(page=1){
      this.libraryQuery.pageNum = page
      for(let key in this.libraryQuery){
        if(!this.libraryQuery[key]) this.libraryQuery[key] = null
      }
      console.log(this.libraryQuery)
      PostData('/library/getAll',this.libraryQuery).then(res=>{
        this.libraryData = res[0]
        this.total = res[1]
        console.log(res)
      })
    },
    scheduleLib(library){
      console.log('library',library)
      this.$router.push({path: '/library/libraryReserve',query: {libraryId: library.libraryId}})
    },
    modifyLib(library){
      this.$router.push({path: '/library/libraryReserveManage',query: {libraryId: library.libraryId}})
    },

    getAllReserve(){
      this.$router.push('/library/libraryReserveManage')
    },

    cancelReserve(reserveInfo){
      PostData('/library/cancelReserve',reserveInfo).then(res=>{
        console.log(res)
        this.$message.success('取消预定成功')
        this.getReserveRecord()
      })
    }
  }
}
</script>

<style scoped>
.pagination{
  float: right;
}
</style>
