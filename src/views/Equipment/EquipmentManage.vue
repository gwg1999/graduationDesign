<template>
  <div>


    <div class="formBox">
      <el-form :inline="true">
        <el-form-item>
          <el-autocomplete
            v-model="equipmentQuery.equipmentName"
            :fetch-suggestions="queryString"
            placeholder="请输入设备名称"
            @select="handleSelect"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button @click="getEquipmentList(1)" type="primary">查询</el-button>
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
              <el-button type="primary" @click="checkInfo(scope.$index)" v-if="roles==='manager'">信息维护</el-button>
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
          <div class="doubleCol">
            <el-form-item label="设备地址">
              {{equipment.location}}
            </el-form-item>
          </div>
        </el-form>

        <el-divider></el-divider>

        <el-form :inline="true">
          <div>
            <el-form-item></el-form-item>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EquipmentManage",
  data(){
    return {
      equipmentData: [
        {
          equipmentName: '电路板',
          stockNum: 100,
          lendNum: 20,
        }
      ],
      equipmentQuery: {},
      total: 0,
      equipment: {},
      personInfo: {},
      dialogVisible: false,
    }
  },
  computed: {
    roles(){
      return this.$store.getters.roles[0]
    }
  },
  created() {
    this.equipmentQuery = new this.queryObject()
  },
  methods: {
    // 初始化查询条件
    queryObject(){
      this.pageSize = 10
      this.pageNum = 1
      this.equipmentName = ''
    },

    // 查看信息并维护-manager
    checkInfo(){
      console.log('checkInfo')
    },

    // 获取设备列表
    getEquipmentList(page=1){
      this.equipmentQuery.pageNum = page
      this.equipmentQuery = new this.queryObject()
      console.log(this.equipmentQuery)
      axios.post('http://localhost:8080',)
    },

    // 外借设备-teacher
    lendEquip(index){
      this.equipment = JSON.parse(JSON.stringify(this.equipmentData[index]))
      this.dialogVisible  = true
      let personInfo = {}
    },

    // 查询设备
    queryString(queryString,cb){
      console.log(queryString)
    },

    // 查询表单-设备选择
    handleSelect(item){
      console.log('select')
    },
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
