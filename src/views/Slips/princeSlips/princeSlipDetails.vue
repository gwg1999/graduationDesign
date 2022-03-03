<template>
  <div>
    <div class="app-container" >
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item >
          <el-select v-model="queryPrinceSheet.odType" @change="getList()"  clearable placeholder="请选择商品类型" style="width: 200px"  >
            <el-option :value="0" label="整件"/>
            <el-option :value="1" label="零件"/>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList()">查 询</el-button>
        </el-form-item >
        <el-form-item style="position: absolute ;right: 110px">
          <router-link :to="{path:'/Slips/princeSlipManagement'}">
            <el-button type="primary" icon="el-icon-d-arrow-left">返回</el-button>
          </router-link>
        </el-form-item >

        <el-form-item v-show="parseInt(flag)!==parseInt('0')" style="position: absolute ;right: 10px">
          <router-link :to="{path:'/Slips/addPriceDetailsGoods',query:{oCustomerId:this.$route.query.oCustomerId,oId:this.$route.query.oId}}">
            <el-button type="primary"
                       icon="el-icon-circle-plus">添加</el-button>
          </router-link>
        </el-form-item >
      </el-form>
      <!--      销售单详情表信息-->
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
        <el-table-column prop="customerName" label="客户名称" width="150px" align="center" />
        <el-table-column prop="odType" label="零件类型" width="100px"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odType===0?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column prop="odNumber" label="数量" width="80px" align="center" />
        <el-table-column prop="odRetailPrice" label="实时售价" width="100px" align="center" />
        <el-table-column prop="odStatus" label="零件状态" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.odStatus===0?'正常':scope.row.odStatus===1?'退货':'结束'}}
          </template>
        </el-table-column>
        <el-table-column label="贵重物品序列号"  align="center" width="180px">
          <template slot-scope="scope">
            <el-button  v-if="scope.row.odType===1"  type="primary" size="mini" icon="el-icon-folder" @click="openSerialNumber(scope.row.odId)">查看贵重物品序列号</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope" >
            <el-button  :disabled="!(scope.row.odStatus===0)||parseInt(flag)===0" type="primary" size="mini" icon="el-icon-edit"  @click="openInquirySheetDialog(scope.row)">修改</el-button>
            <el-button  :disabled="!(scope.row.odStatus===0)||parseInt(flag)===0" type="primary" size="mini" icon="el-icon-delete"  @click="deleteInquirySheet(scope.row.odId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <!--修改销售单详情表-->
    <el-dialog :visible.sync="dialogPrinceSheetFormVisible" title="修改销售单详情表">
      <el-form :model="princeSheetModify" label-width="120px" :rules="rules" ref="princeSheetModify">
        <el-form-item label="零件数量" prop="odNumber">
          <el-input v-model="princeSheetModify.odNumber"/>
        </el-form-item>
        <el-form-item label="零件价格" prop="odRetailPrice">
          <el-input v-model="princeSheetModify.odRetailPrice"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPrinceSheetFormVisible = false">取 消</el-button>
        <el-button :disabled="princeSheetBtnDisabled" type="primary"
                   @click="UpdateInquirySheet()">确 定</el-button>
      </div>
    </el-dialog>
    <!--    序列号表-->
    <el-dialog :visible.sync="dialogSerialNumberVisible" title="序列号信息表">
      <el-table
        :data="serialNumberList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (querySerialNumber.pageNum - 1) * querySerialNumber.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="序列号"   align="center"/>
        <el-table-column prop="updateDate" label="创建时间"  align="center"/>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import princeSlips from "@/api/slips/princeSlips";
import {PostData} from "@/api";
import {validatePassCheck,twoPoint} from "@/views/Slips/ruleNumber";
import {querySerialNumber} from "@/views/Slips/myApi";
import {getTime} from "@/views/Slips/myUtils"
export default {
  data(){
    return{
      //序列号列表
      serialNumberList:[],
      querySerialNumber:{
        pageNum:1,
        pageSize:8
      },
      //序列号弹框
      dialogSerialNumberVisible:false,
      flag:-1,
      disableBtn:false,
      total:0,
      dialogPrinceSheetFormVisible:false,
      princeSheetBtnDisabled:false,
      queryPrinceSheet:{
        pageNum:1,
        pageSize:10
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
    console.log(this.$route.query.oStatus)
    this.flag=this.$route.query.oStatus
  },
  methods:{
    //序列号列表
    openSerialNumber(odId){
      this.querySerialNumber.orderId=this.$route.query.oId
      this.querySerialNumber.detailId=odId
      querySerialNumber(this.querySerialNumber,this.pageNum=1,this.pageSize=10).then(res=>{
        if(res.list&&res.list.length>0)
          res.list.forEach((item) => {
            item.updateDate = getTime(item.updateDate)
          })
        console.log(res.list)
        this.serialNumberList=res.list
      })
      this.dialogSerialNumberVisible=true
    },
    getList(pageNum=1){
      this.queryPrinceSheet.pageNum=pageNum
      this.queryPrinceSheet.odOrderId=this.$route.query.oId
      princeSlips.queryAllDetails(this.queryPrinceSheet.odOrderId,this.queryPrinceSheet.pName,
        this.queryPrinceSheet.odType,this.queryPrinceSheet.pageNum,this.queryPrinceSheet.pageSize)
        .then(res=>{
          console.log(res.list)
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
