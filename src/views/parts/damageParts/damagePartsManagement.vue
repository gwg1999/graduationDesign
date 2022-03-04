<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-input v-model="queryDamageParts.pName"  clearable placeholder="零件名称" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            v-model="queryDamageParts.DamagePartsCreateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="坏件信息创建日期"
            end-placeholder="坏件信息结束日期"
            @change="getList()"
            style="width: 420px">
          </el-date-picker>
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
            {{ (queryDamageParts.pageNum - 1) * queryDamageParts.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="parts.pName" label="零件名称" width="300px" align="center" />
        <el-table-column prop="number" label="损坏数量"  width="100px"   align="center"/>
        <el-table-column prop="amount" label="单价"  width="100px"   align="center"/>
        <el-table-column prop="date" label="产生日期"  width="100px"   align="center"/>
        <el-table-column prop="note" label="备注"   align="center"/>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"   @click="openDamageParts(scope.row)">修改</el-button>
            <!--            <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deleteDamageParts(scope.row.oId)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <!--      修改额外订单信息-->
      <el-dialog :visible.sync="dialogDamagePartsFormVisible" title="修改额外订单信息">
        <el-form :model="damagePartsModify" label-width="120px" :rules="rules" ref="damagePartsModify">
          <!--          <el-form-item label="支出费用" prop="number">-->
          <!--            <el-input v-model="damagePartsModify.odNumber"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="备注" prop="note">
            <el-input v-model="damagePartsModify.note"/>
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
import {getTime} from "@/views/Slips/myUtils";

export default {
  data(){
    return {
      total:0,
      damagePartsBtnButton:false,
      dialogDamagePartsFormVisible:false,
      damagePartsModify:{},
      queryDamageParts:{
        parts:{},
        pageNum:1,
        pageSize:10
      },
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
    getList(pageNum=1){
      this.queryDamageParts.pageNum=pageNum
      if(this.queryDamageParts.DamagePartsCreateTime){
        this.queryDamageParts.startTime=getTime(this.queryDamageParts.DamagePartsCreateTime[0])
        this.queryDamageParts.endTime=getTime(this.queryDamageParts.DamagePartsCreateTime[1])
      }else {
        this.queryDamageParts.startTime=undefined
        this.queryDamageParts.endTime=undefined
      }
      console.log(this.queryDamageParts)
      // this.queryDamageParts.parts.pName=this.queryDamageParts.pName
      PostData('partsBad/selectAllByLike',this.$qs.stringify(this.queryDamageParts)).then(res=>{
        res.list.forEach(value=>{
          value.date=getTime(value.date)
        })
        console.log(res.list)
        this.damagePartsList=res.list
        this.total=res.total
      })
    },
    //打开修改额外订单信息
    openDamageParts(params){
      this.dialogDamagePartsFormVisible=true
      this.damagePartsModify=JSON.parse(JSON.stringify(params))
    },
    //修改额外订单信息
    UpdateDamageParts(){
      this.$refs['damagePartsModify'].validate((valid)=>{
        PostData('partsBad/update',this.$qs.stringify(this.damagePartsModify)).then(res=>{
          this.$message({
            type: 'success',
            message: '修改额外订单信息成功'
          })
          this.dialogDamagePartsFormVisible=false
        })
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
