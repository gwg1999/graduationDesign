<template>
  <div>
    <div class="formBox">
      <el-form :inline="true">
        <el-form-item>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getLibraryList(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="tableBox">
      <el-table :data="libraryData" fit highlight-current-row border>
        <el-table-column>
          <template v-slot="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="位置" align="center" prop="libraryLoc"></el-table-column>
        <el-table-column label="当前人数" align="center" prop="presentNum"></el-table-column>
        <el-table-column>
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
  </div>
</template>

<script>
export default {
  name: "libraryPage",
  data(){
    return {
      libraryData: [],
      libraryQuery: {},
      roles: this.$store.getters.roles[0]
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
      console.log(page)
    },
    scheduleLib(){
      console.log(this.roles)
    },
    modifyLib(index){
      let lib = JSON.parse(JSON.stringify(this.libraryData[index]))

    },
  }
}
</script>

<style scoped>

</style>
