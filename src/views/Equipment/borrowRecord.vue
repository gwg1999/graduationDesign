<template>
  <div>
    <div class="infoBox" style="display: flex;">
      <el-form class="infoBox" :inline="true">
        <el-form-item label="设备名称">
          <span>{{ equipment.equipmentName }}</span>
        </el-form-item>
        <el-form-item label="库存数">
          <span>{{ equipment.stockNum }}</span>
        </el-form-item>
        <el-form-item label="外借数">
          <span>{{ equipment.lendNum}}</span>
        </el-form-item>
      </el-form>
    </div>

    <el-divider></el-divider>

    <div class="tableBox" style="overflow:hidden;">
      <el-table highlight-current-row fit border :data="recordData">
        <el-table-column width="80" align="center">
          <template v-slot="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="借用人" align="center" prop="borrower2.username"></el-table-column>
        <el-table-column label="借用时间" align="center" prop="borrowTime"></el-table-column>
        <el-table-column label="借用数量" align="center" prop="borrowNum"></el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="scope">
            <div>
              <el-tag :type="scope.row.status===1?'danger':'success'">{{ scope.row.status===1?'未还':'已还'}}</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        layout="total,prev,pager,next"
        :total="total"
        :current-page="recordQuery.pageNum"
        :page-size="recordQuery.pageSize"
        @current-change="getRecordList"
      ></el-pagination>
    </div>
    <div style="overflow: hidden">
      <el-button type="primary" style="float: right" @click="turnBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import {parseTime} from "@/utils";

export default {
  name: "borrowRecord",
  data(){
    return {
      equipment: {},
      recordData:[],
      recordQuery:{},
      total: 0,
    }
  },
  created(){
    this.recordQuery = new this.queryObject()
  },
  mounted() {
    this.getRecordList(1)
  },
  computed: {
    equipmentId(){
      return this.$route.query.equipmentId
    }
  },
  watch:{
    equipmentId: {
      handler(newValue,oldValue){
        this.getEquipmentInfo(newValue)
      },
      immediate:true
    }
  },
  methods: {
    queryObject(){
      this.pageSize = 5
      this.pageNum = 1
      this.equipmentId = null
    },
    getEquipmentInfo(equipmentId){
      PostData('/equipment/getOne',{equipmentId}).then(res=>{
        this.equipment = res
      })
    },

    turnBack(){
      this.$router.go(-1)
    },

    getRecordList(page=1){
      this.recordQuery.pageNum = page
      this.recordQuery.equipmentId = this.equipmentId
      PostData('/equipment/getRecordByEquip',this.recordQuery).then(res=>{
        this.recordData = res[0]
        for(let item of this.recordData){
          item.borrowTime = parseTime(new Date(item.borrowTime),'{y}-{m}-{d} {h}:{i}:{s}')
        }
        this.total = res[1]
        console.log(res[0])
      })
    }
  }
}
</script>

<style scoped>
.infoBox{
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
}
.pagination{
  float:right
}
</style>
