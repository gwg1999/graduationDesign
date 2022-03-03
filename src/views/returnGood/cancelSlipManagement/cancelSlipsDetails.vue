<template>
  <div>
    <div class="app-container" >
<!--      <el-form :inline="true" class="demo-form-inline" style="position: relative ">-->
<!--        <el-form-item>-->
<!--          <el-input v-model="queryCancelSlip.pName"  clearable placeholder="商品名称" style="width: 150px"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-select v-model="queryCancelSlip.qdType" clearable placeholder="商品类型" style="width: 200px">-->
<!--            <el-option :value="1" label="零件"/>-->
<!--            <el-option :value="0" label="整件"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" @click="getList(1)">查 询</el-button>-->
<!--      </el-form>-->
      <el-table
        :data="CancelSlipDetailsList"
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
        <el-table-column prop="partName" label="名称"  width="200px" align="center"/>
        <el-table-column prop="rdPartsType" label="类型" width="100px" align="center">
          <template slot-scope="scope">
            {{ scope.row.qdType===0?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column prop="rdType" width="150px" label="退货单类型"  align="center">
          <template slot-scope="scope">
            {{ scope.row.Type===0?'销售单退货单':'进货单退货单'}}
          </template>
        </el-table-column>
        <el-table-column prop="rdPartsType" width="100px" label="零件大小"  align="center">
          <template slot-scope="scope">
            {{ scope.row.rdPartsType===0?'大':'小'}}
          </template>
        </el-table-column>
        <el-table-column prop="rdRetailPrice" label="退货价格"  align="center"/>
        <el-table-column prop="rdPartsNum" label="数量"  align="center"/>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"  @click="deleteSalesSlip(scope.row.qdId)">删除</el-button>
          </template>
        </el-table-column>
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
import {getReturnDetail} from "../myApi"
import {PostData} from "@/api";
export default {
  data(){
    return{
      pageSize:5,
      pageNum:1,
      total:0,
      CancelSlipDetailsList:[],
      queryCancelSlip:{}
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(pageNum=1){
      this.pageNum=pageNum
      getReturnDetail(this.$route.query.qId,this.pageNum,this.pageSize).then(res=>{
        this.CancelSlipDetailsList=res.list
        this.total=res.total
      })
    },
    deleteSalesSlip(params){
      this.$confirm('是否将退货单详情表删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        PostData("/returnDetail/deleteReturnDetail",params).then(res=>{
          this.$message({
            type:'success',
            message:'删除退货单详情表成功'
          })
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>

