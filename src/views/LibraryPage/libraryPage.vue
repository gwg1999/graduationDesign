<template>
  <div>
    <div class="formBox" style="padding: 10px">
      <el-form :inline="true">
        <el-form-item label="楼号">
          <el-input v-model="libraryQuery.buildingLoc"></el-input>
        </el-form-item>
        <el-form-item label="教室号">
          <el-input v-model="libraryQuery.classroomLoc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getLibraryList(1)">查询</el-button>
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
            {{scope.row.buildingLoc}}-{{scope.row.classroomLoc}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template v-slot="scope">
            <div>
              <el-tag :type="tagDic[scope.row.status].type">{{tagDic[scope.row.status].str}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="当前人数" align="center" prop="presentNum"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-button type="primary" v-if="roles==='manager'" @click="modifyLib(scope.$index)">修改信息</el-button>
              <el-button type="primary" v-if="roles==='teacher'" @click="scheduleLib">预定</el-button>
              <el-button type="primary" v-if="roles==='student'" @click="scheduleLib">预定</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog :visible.sync="dialogVisible" title="实验室信息">

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
      libraryData: [
        {
          buildingLoc: '七教',
          classroomLoc: '402',
          presentNum: 0,
          status: 1,
        }
      ],
      libraryQuery: {
        buildingLoc: null,
        classroomLoc: null,
      },
      roles: this.$store.getters.roles[0],
      library: {},
      tagDic: [
        {type:'info',str: '维修中'},
        {type: 'success', str: '空闲'},
        {type: 'warning', str: '占用中'},
      ]
    }
  },
  created(){
    this.getLibraryList(1)
  },
  mounted() {
    this.libraryQuery = new this.queryObject()
  },
  methods: {
    queryObject(){
      this.pageSize = 10
      this.pageNum = 1
      this.isSchedule = null
      this.status = 0
    },

    getLibraryList(page=1){
      this.libraryQuery.pageNum = page
      PostData('/library/getAll',this.libraryQuery).then(res=>{
        this.libraryData = res
      })
    },
    scheduleLib(){
      console.log(this.roles)
    },
    modifyLib(index){
      this.library = JSON.parse(JSON.stringify(this.libraryData[index]))

    },
  }
}
</script>

<style scoped>

</style>
