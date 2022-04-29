<template>
  <div>


    <div class="formBox">
      <el-form :inline="true">
        <el-form-item label="设备名">
<!--          <el-autocomplete-->
<!--            v-model="equipmentQuery.equipmentName"-->
<!--            :fetch-suggestions="queryString"-->
<!--            placeholder="请输入设备名称"-->
<!--            @select="handleSelect"-->
<!--            :trigger-on-focus="false"-->
<!--          ></el-autocomplete>-->
          <el-input v-model="equipmentQuery.equipmentName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getEquipmentList(1)" type="primary">查询</el-button>
          <el-button type="primary" @click="getReturnList()" v-if="roles==='teacher'">归还</el-button>
        </el-form-item>
      </el-form>
    </div>


    <div class="tableBox">
      <el-table
        fit
        highlight-current-row
        border
        :data="equipmentData"
      >
        <el-table-column width="80" align="center">
          <template v-slot="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备名" prop="equipmentName"></el-table-column>
        <el-table-column label="库存数量" align="center" prop="stockNum"></el-table-column>
        <el-table-column label="外借数量" align="center" prop="lendNum"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-button type="primary" @click="checkInfo(scope.row)" v-if="roles==='teacher'">查看详情</el-button>
              <el-button type="primary" @click="lendEquip(scope.$index)" v-if="roles==='teacher'">外借</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>


      <el-pagination
        class="pagination"
        layout="total,prev,pager,next"
        :total="total"
        :current-page="equipmentQuery.pageNum"
        :page-size="equipmentQuery.pageSize"
        @current-change="getEquipmentList"
      ></el-pagination>
    </div>

    <div>
      <el-dialog title="信息维护" :visible.sync="maintainVisible">
        <el-form></el-form>
      </el-dialog>
    </div>

    <div v-if="roles">
      <el-dialog :visible.sync="dialogVisible" title="设备外借">
        <el-form :inline="true">
          <div class="doubleCol">
            <el-form-item label="设备名称">
              {{equipment.equipmentName}}
            </el-form-item>
            <el-form-item label="库存数量">
              {{equipment.stockNum}}
            </el-form-item>
          </div>
        </el-form>

        <el-divider></el-divider>

        <div style="display: flex;justify-content: space-around">
          <el-form label-width="80px">
            <el-form-item label="外借数量">
              <el-input v-model="equipment.otherLend"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="confirmLend" type="primary">确认</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog title="设备归还" :visible.sync="returnVisible" width="60rem">
        <el-table highlight-current-row fit border :data="returnList" height="25rem">
          <el-table-column width="80" align="center">
            <template v-slot="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column label="设备名称" align="center" prop="equipment.equipmentName"></el-table-column>
          <el-table-column label="借用时间" align="center" prop="borrowTime"></el-table-column>
          <el-table-column label="借用数量" align="center" prop="borrowNum"></el-table-column>
          <el-table-column label="状态" align="center">
            <template v-slot="scope">
              <div>
                <el-tag :type="scope.row.status===1?'danger':'success'">{{ scope.row.status===1?'未还':'已还' }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <div>
                <el-button type="primary" @click="returnEquip(scope.row)">归还</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {PostData} from "@/api";
import {parseTime} from "@/utils";

export default {
  name: "EquipmentManage",
  data(){
    return {
      equipmentData: [],
      equipmentQuery: {},
      total: 0,
      equipment: {},
      personInfo: {},
      dialogVisible: false,
      returnVisible: false,
      maintainVisible:false,
      returnList: [],
    }
  },
  computed: {
    roles(){
      return this.$store.getters.roles[0]
    }
  },
  created() {
    this.equipmentQuery = new this.queryObject()
    this.getEquipmentList(1)
  },
  methods: {
    // 初始化查询条件
    queryObject(){
      this.pageSize = 5
      this.pageNum = 1
      this.equipmentName = null
    },

    // 查看信息并维护-manager
    checkInfo(equip){
      console.log('equip',equip)
      this.$router.push({path: '/equipment/info',query: {equipmentId: equip.index}})
    },

    // 获取设备列表
    getEquipmentList(page=1){
      this.equipmentQuery.pageNum = page
      console.log(this.equipmentQuery)
      axios.post('http://localhost:7001/equipment/getAll',this.equipmentQuery).then(res=>{
        this.equipmentData = res.data[0]
        this.total = res.data[1]
        console.log(res)
      })
    },

    // 外借设备-teacher
    lendEquip(index){
      this.equipment = JSON.parse(JSON.stringify(this.equipmentData[index]))
      this.equipment.teacherId = localStorage.getItem('id')
      this.$set(this.equipment,'otherLend',0)
      this.dialogVisible  = true
      let personInfo = {}
    },

    confirmLend(){
      this.equipment.otherLend = parseInt(this.equipment.otherLend)
      if(this.equipment.otherLend<=this.equipment.stockNum){
        this.equipment.stockNum -= this.equipment.otherLend
        this.equipment.lendNum += this.equipment.otherLend
        console.log('equipment',this.equipment)
        PostData('/equipment/lend',this.equipment).then(res=>{
          console.log('res:',res)
          this.getEquipmentList(this.equipmentQuery.pageNum)
          this.dialogVisible = false
        })
      }
    },

    getReturnList(){
      this.returnVisible = true
      PostData('/equipment/getReturnList',{teacherId:localStorage.getItem('id')}).then(res=>{
        console.log(res)
        for(let item of res){
          item.borrowTime = parseTime(new Date(item.borrowTime),'{y}-{m}-{d} {h}:{i}:{s}')
        }
        this.returnList = res
      })
    },

    returnEquip(equip){
      let postData = JSON.parse(JSON.stringify(equip))
      PostData('/equipment/returnEquip',postData).then(res=>{
        console.log(res)
        this.getEquipmentList(this.equipmentQuery.pageNum)
        this.$message.success('归还成功')
        this.returnVisible = false
      })
    }
  },

}
</script>

<style scoped lang="scss">
.pagination{
  float:right
}
.formBox{
  padding: 10px;
  box-sizing: border-box;
}
.tableBox::after{
  clear: both;
  content: "";
}
.doubleCol{
  display: flex;
  justify-content: space-around;
}
</style>
