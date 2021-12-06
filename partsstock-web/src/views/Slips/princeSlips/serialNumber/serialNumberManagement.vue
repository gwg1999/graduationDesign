<template>
  <div>
    <div class="app-container" >
      <!-- 表格 -->
      <el-table
        :data="serialNumberList"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="序列号"   align="center"/>
        <el-table-column prop="updateDate" label="创建时间"  align="center"/>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>
  </div>
</template>

<script>
import {querySerialNumber} from "../../myApi"
export default {
  data(){
    return{
      total:0,
      pageSize:5,
      pageNum:1,
      querySerialNumber:{
        detailId:this.$route.query.odId,
        orderId:this.$route.query.oId,
      },
      serialNumberList:[]

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getTime(data){
      let time = new Date(data);
      let Y = time.getFullYear();
      let Mon = time.getMonth() + 1;
      let Day = time.getDate();
      return `${Y}-${Mon}-${Day}`
    },
    getList(pageNum=1){
      this.pageNum=pageNum
      querySerialNumber(this.querySerialNumber,this.pageNum,this.pageSize).then(res=>{
        if(res.list&&res.list.length>0)
          res.list.forEach((item) => {
            item.updateDate = this.getTime(item.updateDate)
          })
        this.serialNumberList=res.list
        this.total=res.total
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>

