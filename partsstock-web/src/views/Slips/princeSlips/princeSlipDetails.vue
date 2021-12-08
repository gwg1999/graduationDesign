<template>
  <div>
    <div class="app-container" >
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <!--        <el-form-item>-->
        <!--          <el-input v-model="queryPrinceSheet.pName"  clearable placeholder="零件名称" style="width: 150px"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item >
          <el-select v-model="queryPrinceSheet.odType"   clearable placeholder="请选择商品类型" style="width: 200px"  >
            <el-option :value="0" label="整件"/>
            <el-option :value="1" label="零件"/>
          </el-select>
        </el-form-item>
        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList()">查 询</el-button>
<!--        <router-link :to="{path:'/Slips/addPrinceDetailsSlips',query:{oCustomerId:this.$route.query.oCustomerId,oId:this.$route.query.oId}}">-->
<!--          <el-button type="primary"-->
<!--                     icon="el-icon-circle-plus" style="position: absolute;right: 10px">添加</el-button>-->
<!--        </router-link>-->
      </el-form>
      <el-table
        :data="princeSheetList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (queryPrinceSheet.pageNum - 1) * queryPrinceSheet.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="partName" label="名称"  align="center" />
        <el-table-column prop="customerName" label="客户名称"  align="center" />
        <el-table-column prop="odType" label="零件类型"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odType===0?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column prop="Logistics_id" label="物流名称" align="center" />
        <el-table-column prop="odNumber" label="数量"  align="center" />
        <el-table-column prop="odRetailPrice" label="实时售价"  align="center" />
        <el-table-column prop="odStatus" label="零件状态"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odStatus===0?'正常':scope.row.odStatus===1?'退货':'结束'}}
          </template>
        </el-table-column>

        <el-table-column label="贵重物品序列号"  align="center" width="200">
          <template slot-scope="scope">
            <router-link  :to="{path:'/Slips/serialNumberManagement',query:{odId:scope.row.odId,oId:$route.query.oId}}">
              <el-button  v-if="scope.row.odType===1&&parseInt(flag)===2"  type="primary" size="mini" icon="el-icon-folder">查看贵重物品序列号</el-button>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope" >
            <el-button  :disabled="!(scope.row.odStatus===0)" type="primary" size="mini" icon="el-icon-edit"  @click="openInquirySheetDialog(scope.row)">修改</el-button>
            <el-button  :disabled="!(scope.row.odStatus===0)" type="primary" size="mini" icon="el-icon-delete"  @click="deleteInquirySheet(scope.row.odId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="queryPrinceSheet.pageNum"
        :page-size="queryPrinceSheet.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>

    <el-dialog :visible.sync="dialogPrinceSheetFormVisible" title="修改销售单详情表">
      <el-form :model="princeSheetModify" label-width="120px" :rules="rules" ref="princeSheetModify">
        <el-form-item label="零件数量" prop="odNumber">
          <el-input v-model="princeSheetModify.odNumber"/>
        </el-form-item>
        <el-form-item label="零件价格" prop="odRetailPrice">
          <el-input v-model="princeSheetModify.odRetailPrice"/>
        </el-form-item>
        <el-form-item label="零件状态" prop="odStatus">
          <el-select v-model="princeSheetModify.odStatus"   clearable placeholder="零件状态" style="width: 200px"  >
            <el-option :value="0" label="正常"/>
            <el-option :value="1" label="退货"/>
            <el-option :value="2" label="结束"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPrinceSheetFormVisible = false">取 消</el-button>
        <el-button :disabled="princeSheetBtnDisabled" type="primary"
                   @click="UpdateInquirySheet()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import princeSlips from "@/api/slips/princeSlips";
import {PostData} from "@/api";
import {validatePassCheck,twoPoint} from "@/views/Slips/ruleNumber";
export default {
  data(){
    return{
      flag:-1,
      disableBtn:false,
      total:0,
      dialogPrinceSheetFormVisible:false,
      princeSheetBtnDisabled:false,
      queryPrinceSheet:{
        pageNum:1,
        pageSize:8
      },
      princeSheetList:[],
      princeSheetModify:{},
      rules:{
        odNumber: [
          { required: true, validator:validatePassCheck, trigger: 'change' }
        ],
        odRetailPrice: [
          { required: true, message: '请写入零件实时售价', trigger: 'change' },
          {validator:twoPoint,  trigger: 'change' }
        ],
        odStatus: [
          { required: true, message: '请选择零件状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.flag=this.$route.query.oStatus
    console.log(this.flag)
  },
  methods:{
    getList(pageNum=1){
      this.queryPrinceSheet.pageNum=pageNum
      this.queryPrinceSheet.odOrderId=this.$route.query.oId
      princeSlips.queryAllDetails(this.queryPrinceSheet.odOrderId,this.queryPrinceSheet.pName,
        this.queryPrinceSheet.odType,this.queryPrinceSheet.pageNum,this.queryPrinceSheet.pageSize)
        .then(res=>{
          console.log(res)
          this.princeSheetList=res.list
          this.total=res.total
        })
    },
    openInquirySheetDialog(params){
      this.dialogPrinceSheetFormVisible=true
      if (this.$refs['princeSheetModify'] !== undefined)
        this.$refs['princeSheetModify'].resetFields();
      this.princeSheetModify=JSON.parse(JSON.stringify(params))
    },
    UpdateInquirySheet(){
      this.$refs['princeSheetModify'].validate((valid)=>{
        if(valid){
          let orderDetailList = []
          let SlipModify = {}
          orderDetailList.push(this.princeSheetModify)
          SlipModify.orderDetailList = orderDetailList
          SlipModify.oId=this.$route.query.oId
          PostData('OrderDetail/updateOrderDetail',SlipModify)
            .then(res=>{
              this.$message({
                type:'success',
                message:'修改销售单详情信息成功'
              })
              this.dialogPrinceSheetFormVisible=false
              this.getList()
            })
        }
      })

    },
    deleteInquirySheet(params){
      this.$confirm('是否将此销售单信息删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        if(this.total===1){
          this.$message({
            type:'error',
            message:"当前商品订单只有一条,请去销售单表中进行删除"
          })
        }else {
          princeSlips.deleteOrderDetail(params)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除销售单详情信息成功'
              })
              this.getList()
            })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
