<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-input v-model="queryDamageParts.name" @keyup.enter.native="getList()" clearable placeholder="零件名称" style="width: 150px"></el-input>
        </el-form-item>
        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList(1)">查 询</el-button>
      </el-form>
      <!--      销售单管理列表-->
      <el-table
        :data="damagePartsList"
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
        <el-table-column prop="number" label="零件名称" width="80px" align="center" />
        <el-table-column prop="badNum" label="损坏数量"  width="100px"   align="center"/>
        <el-table-column prop="note" label="备注" width="100px"  align="center"/>
        <!--        <el-table-column prop="type" label="订单类型" width="80px" align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.oIsPackage===0?'销售单':scope.row.oIsPackage===1?'进货单':'退货单'}}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"   @click="openDamageParts(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deleteDamageParts(scope.row.oId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      修改额外订单信息-->
      <el-dialog :visible.sync="dialogDamagePartsFormVisible" title="修改额外订单信息">
        <el-form :model="damagePartsModify" label-width="120px" :rules="rules" ref="princeSheetModify">
          <el-form-item label="支出费用" prop="number">
            <el-input v-model="damagePartsModify.odNumber"/>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="damagePartsModify.odRetailPrice"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDamagePartsFormVisible = false">取 消</el-button>
          <el-button :disabled="damagePartsBtnButton" type="primary"
                     @click="UpdateDamageParts()">确 定</el-button>
        </div>
      </el-dialog>
      <!--      分页-->
      <el-pagination
        :current-page="queryDamageParts.pageNum"
        :page-size="queryDamageParts.pageSize"
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
      damagePartsBtnButton:false,
      dialogDamagePartsFormVisible:false,
      damagePartsModify:{},
      queryDamageParts:{},
      damagePartsList:[],
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
      PostData('otherFee/selectAllByLike',this.queryDamageParts).then(res=>{
        //--todo
      })
    },
    //打开修改额外订单信息
    openDamageParts(){
      this.dialogDamagePartsFormVisible=true
    },
    //修改额外订单信息
    UpdateDamageParts(){
      PostData('otherFee/update',this.damagePartsModify).then(res=>{
        //--todo
        this.dialogDamagePartsFormVisible=false
      })
    },
    //删除额外订单信息
    deleteDamageParts(params){
      PostData('otherFee/delete',params).then(res=>{
        //--todo
      })
    }
  }
}
</script>

<style scoped>

</style>
