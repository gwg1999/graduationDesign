<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-select v-model="queryPrinceSheet.type" @change="getList" filterable placeholder="请选择订单信息" style="width: 200px">
            <el-option :value="0" label="销售单"></el-option>
            <el-option :value="1" label="进货单"></el-option>
            <el-option :value="2" label="退货单"></el-option>
          </el-select>
<!--          <el-input v-model="queryPrinceSheet.type" @keyup.enter.native="getList()" clearable placeholder="客户名称" style="width: 150px"></el-input>-->
        </el-form-item>
        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList(1)">查 询</el-button>
      </el-form>
      <!--      销售单管理列表-->
      <el-table
        :data="princeSheetList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            {{ (queryPrinceSheet.pageNum - 1) * queryPrinceSheet.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="支出费用" width="80px" align="center" />
        <el-table-column prop="date" label="日期"  width="100px"   align="center"/>
        <el-table-column prop="note" label="备注" width="100px"  align="center"/>
        <el-table-column prop="type" label="订单类型" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.oIsPackage===0?'销售单':scope.row.oIsPackage===1?'进货单':'退货单'}}
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"   @click="openExtraPrinceSlips(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deleteExtraPrinceSlips(scope.row.oId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      修改额外订单信息-->
      <el-dialog :visible.sync="dialogExtraPriceSheetFormVisible" title="修改额外订单信息">
        <el-form :model="ExtraPriceSheetModify" label-width="120px" :rules="rules" ref="princeSheetModify">
          <el-form-item label="支出费用" prop="number">
            <el-input v-model="ExtraPriceSheetModify.odNumber"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ExtraPriceSheetModify.odRetailPrice"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPrinceSheetFormVisible = false">取 消</el-button>
          <el-button :disabled="ExtraPriceSheetBtnDisabled" type="primary"
                     @click="UpdateExtraPriceSheet()">确 定</el-button>
        </div>
      </el-dialog>
      <!--      分页-->
      <el-pagination
        :current-page="queryPrinceSheet.pageNum"
        :page-size="queryPrinceSheet.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>
  </div>
</template>
<script>
import {PostData} from "@/api";

export default {
  data(){
    return {
      total:0,
      ExtraPriceSheetBtnDisabled:false,
      dialogExtraPriceSheetFormVisible:false,
      ExtraPriceSheetModify:{},
      queryPrinceSheet:{},
      princeSheetList:[],
      rules:{
        number:[
          {required:true,message:'请填写额外费用',trigger:"change"}
        ],
        // note:[
        //   {required:true,message:"请填写备注信息",trigger:'change'}
        // ]
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {
    //获取额外订单信息列表
    getList(){
      PostData('otherFee/selectAllByLike',this.queryPrinceSheet).then(res=>{
        console.log(res)
        //--todo
      })
    },
    //打开修改额外订单信息
    openExtraPrinceSlips(){
      this.dialogExtraPriceSheetFormVisible=true
    },
    //修改额外订单信息
    UpdateExtraPriceSheet(){
      PostData('otherFee/update',this.ExtraPriceSheetModify).then(res=>{
        //--todo
        this.dialogExtraPriceSheetFormVisible=false
      })
    },
    //删除额外订单信息
    deleteExtraPrinceSlips(params){
      PostData('otherFee/delete',params).then(res=>{
        //--todo
      })
    }
  }
}
</script>

<style scoped>

</style>
