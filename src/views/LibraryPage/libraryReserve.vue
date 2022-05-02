<template>
  <div>
    <div style="display: flex">
      <el-form :inline="true" style="display: flex;justify-content: space-around;flex-grow: 1">
        <el-form-item label="实验室位置">
          <span>{{libraryInfo.building_loc + '-' + libraryInfo.classroom_loc}}</span>
        </el-form-item>
        <el-form-item label="实验室类型">
          <span> {{ libraryInfo.libType===1?'教室':'自习室' }}</span>
        </el-form-item>
        <el-form-item label="实验室介绍">
          <p style="width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin: 0">{{libraryInfo.notes}}</p>
        </el-form-item>
      </el-form>
    </div>

    <div style="overflow: hidden">
      <div style="float: right">
        <el-button type="primary" @click="turnBack">返回</el-button>
        <el-button type="primary" @click="openDialog">预定</el-button>
      </div>
    </div>

    <el-divider></el-divider>

    <div>
      <el-table :data="libReserveData" highlight-current-row fit border height="30rem">
        <el-table-column label="时间" align="center">
          <template v-slot="scope">
            {{timeDic[scope.$index].time}}
          </template>
        </el-table-column>
        <el-table-column label="周一" align="center" prop="0">
          <template v-slot="scope">
            <el-tag :type="scope.row['0']?'danger':'success'">{{ scope.row['0']?scope.row['0'].user.username:'空闲' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="周二" align="center" prop="1">
          <template v-slot="scope">
            <el-tag :type="scope.row['1']?'danger':'success'">{{ scope.row['1']?scope.row['1'].user.username:'空闲' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="周三" align="center" prop="2">
          <template v-slot="scope">
            <el-tag :type="scope.row['2']?'danger':'success'">{{ scope.row['2']?scope.row['2'].user.username:'空闲' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="周四" align="center" prop="3">
          <template v-slot="scope">
            <el-tag :type="scope.row['3']?'danger':'success'">{{ scope.row['3']?scope.row['3'].user.username:'空闲' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="周五" align="center" prop="4">
          <template v-slot="scope">
            <el-tag :type="scope.row['4']?'danger':'success'">{{ scope.row['4']?scope.row['4'].user.username:'空闲' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="周六" align="center" prop="5">
          <template v-slot="scope">
            <el-tag :type="scope.row['5']?'danger':'success'">{{ scope.row['5']?scope.row['5'].user.username:'空闲' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="周日" align="center" prop="6">
          <template v-slot="scope">
            <el-tag :type="scope.row['6']?'danger':'success'">{{ scope.row['6']?scope.row['6'].user.username:'空闲' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog title="实验室预定" :visible.sync="dialogVisible">
        <el-form label-width="80px">
          <el-form-item label="时间段">
            <el-select v-model="formData.reserveTime">
              <el-option v-for="item in timeDic" :value="item.key" :key="item.key" :label="item.time"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="formData.reserveDate"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reserveLibrary">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";

export default {
  name: "libraryReserve",
  data(){
    return {
      libReserveData: [],
      libraryInfo: {},
      dialogVisible:false,
      formData: {
        reserveTime: null,
        reserveDate: null,
        userId: localStorage.getItem('id')
      },
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
      ]
    }
  },
  computed: {
    libraryId(){
      return this.$route.query.libraryId
    }
  },
  watch:{
    'formData.reserveDate':{
      handler(newValue,oldValue) {
        let timestamp = new Date(newValue).getTime()
        let now = new Date().getTime()
        if(now>timestamp && timestamp){
          this.$message.warning('选择的时间早于当前时间，请重新选择')
        }
      },
      deep: true,
    }
  },
  created() {
    this.getReserveList(1)
    this.getLibraryInfo()
  },
  methods: {
    turnBack(){
      this.$router.push('/library/index')
    },

    openDialog(){
      this.dialogVisible = true
      this.formData.libraryId= this.libraryInfo.libraryId
    },

    reserveLibrary(){
      console.log(this.formData)
      PostData('library/libraryReserve',this.formData).then(res=>{
        this.dialogVisible = false
        this.getReserveList(1)
      })
    },
    getReserveList(page=1){
      PostData('/library/getPreList',{libraryId:this.libraryId}).then(res=>{
        this.libReserveData = res
        console.log(res)
      })
    },
    getLibraryInfo(){
      PostData('library/getById',{libraryId: this.libraryId}).then(res=>{
        this.libraryInfo = res
        console.log('libraryInfo',res)
      })
    }
  }
}
</script>

<style scoped>

</style>
