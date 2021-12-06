<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item >
          <el-input v-model="dishQuery.dishName" clearable placeholder="菜品名" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item >
          <el-select v-model="dishQuery.isCancel" clearable style="width: 150px" >
            <el-option label="注销" :value="0" key="2"></el-option>
            <el-option label="未注销" :value="1" key="3"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList(1)">查 询</el-button>
        <router-link to="/dishManagement/addDish">
          <el-button type="primary"
                     icon="el-icon-circle-plus" style="position: absolute;right: 10px">添加</el-button>
        </router-link>
      </el-form>
      <!-- 表格 -->
      <el-table
        :data="dishList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ (dishQuery.page - 1) * dishQuery.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="pName" label="零件名称" width="200" align="center" />
        <el-table-column prop="pNumber" label="零件号"  align="center"/>
        <el-table-column prop="pPlace" label="产地"  align="center"/>
        <el-table-column prop="pUnit" label="单位"  align="center"/>
        <el-table-column prop="pWholesalePrice" label="批发价"  align="center" />
        <el-table-column prop="pRetailPrice" label="零售价"  align="center" />

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope"  align="center">
            <el-button  size="mini" icon="el-icon-edit"
                        :type="scope.row.isCancel === 1
                        ? 'danger'
                        : scope.row.isCancel === 0
                        ? 'success'
                        : ''
                  "
                        @click="editCancel(scope.$index)">{{ scope.row.isCancel===1?'注销':'启用'}}</el-button>
            <router-link :to="'/dishManagement/editDish'" v-if="scope.row.isCancel===1">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="modifyDish(scope.$index)">修改</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="dishQuery.page"
        :page-size="dishQuery.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>

  </div>
</template>
<script>
import {} from "../../api/part";
export default {
  data(){//定义变量和初始值
    return{
      dishList: [], //查询之后接口返回集合
      total:0,//总记录数
      dishQuery:{
        dishName: '',
        page:1,
        pageSize: 5,
        isSellHot: null,
        isCancel: null,
        storeId: 1,
      },
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    // this.dishQuery.storeId = localStorage.getItem('storeId')
    this.getList()
  },
  methods:{
    getList(page=1) {
      this.dishQuery.page=page
      console.log(this.dishQuery)
      getDish(this.dishQuery).then(res=>{
        this.dishList = res.data.list
        this.total = res.data.total
        console.log(this.dishList)
      })
    },
    resetData(){
      //查询所有菜品信息
      this.getList()
    },

    //对状态的修改操作
    editCancel(index){

      this.$confirm('是否将此菜品'+(this.dishList[index].isCancel===1?'注销':'启用')+'?', '提示', {

        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dishList[index].isCancel = 1 - this.dishList[index].isCancel
        console.log(this.dishList[index])
        updateDish({id:this.dishList[index].id, isCancel: this.dishList[index].isCancel}).then(res=>{
          this.getList()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
      })
    },
    modifyDish(index){
      localStorage.setItem('dish',JSON.stringify(this.dishList[index]))
    },
  }
}
</script>

<style scoped>

</style>
