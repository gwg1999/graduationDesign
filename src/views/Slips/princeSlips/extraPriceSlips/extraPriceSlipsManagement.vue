<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-select v-model="queryPrinceSheet.type"   clearable placeholder="请选择订单信息" style="width: 200px">
            <el-option :value="0" label="销售单"></el-option>
            <el-option :value="1" label="进货单"></el-option>
            <el-option :value="2" label="退货单"></el-option>
            <el-option :value="3" label="其他"></el-option>
          </el-select>
          <!--          <el-input v-model="queryPrinceSheet.type" @keyup.enter.native="getList()" clearable placeholder="客户名称" style="width: 150px"></el-input>-->
        </el-form-item>
        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList(1)">查 询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus" style="position: absolute;right: 10px" @click="openAddExtraPrice">添加</el-button>
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
        <el-table-column prop="note" label="备注"   align="center"/>
        <el-table-column prop="type" label="订单类型" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.type===0?'销售单':scope.row.type===1?'进货单':scope.row.type===2?'退货单':'其他'}}
          </template>
        </el-table-column>

        <el-table-column label="查看关联订单"  align="center" width="120px">
          <template slot-scope="scope">
<!--            <router-link :to="{path:'/Slips/extraPriceSlipsDetails',query:{orderId:scope.row.orderId,type:scope.row.type}}">-->
              <el-button type="primary" :disabled="scope.row.type===3" size="mini" icon="el-icon-edit" @click="checkDetails(scope.row)">查看详情</el-button>
<!--            </router-link>-->
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"   @click="openExtraPrinceSlips(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"  @click="deleteExtraPrinceSlips(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      修改额外订单信息-->
      <el-dialog :visible.sync="dialogExtraPriceSheetFormVisible" title="修改其他费用信息"
     >
        <el-form :model="ExtraPriceSheetModify" label-width="120px" :rules="rules" ref="ExtraPriceSheetModify">
          <el-form-item label="支出费用" prop="number">
            <el-input @keyup.native="ExtraPriceSheetModify.number = oninput(ExtraPriceSheetModify.number)" v-model="ExtraPriceSheetModify.number"/>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="ExtraPriceSheetModify.note" style="width: 90%" rows="5" type="textarea"/>
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


      <!--     其他费用添加-->
      <el-dialog :visible.sync="openAddExtraPriceDialog" title="其他费用添加"  width="60%">
        <el-form :model="ExtraPrice" label-width="80px" :rules="rules" ref="ExtraPrice">
          <el-form-item  label="订单类型" style="width: 200px" prop="type">
            <el-select v-model="ExtraPrice.type" @change="slipsSelect($event)" clearable placeholder="请选择订单类型" style="width: 200px"  >
              <el-option :value="0" label="销售单"/>
              <el-option :value="1" label="进货单"/>
              <el-option :value="3" label="其他"/>
            </el-select>
          </el-form-item>

          <el-form-item label="订单id" v-show="ExtraPrice.type!==3" prop="orderId" style="width: 400px">
            <el-select
              v-model="ExtraPrice.orderId"  filterable clearable placeholder="请选择订单"
             style="width: 400px">
              <el-option
                v-for="part in priceList"
                :key="part.oId"
                :label="part.oId"
                :value="part.oId"/>
            </el-select>
          </el-form-item>

          <el-form-item label="支出费用" prop="number" style="width: 600px">
            <el-input @keyup.native="ExtraPrice.number = oninput(ExtraPrice.number)" v-model="ExtraPrice.number"/>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="ExtraPrice.note" style="width: 90%"  rows="5" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="openAddExtraPriceDialog = false">取 消</el-button>
          <el-button :disabled="ExtraPriceSheetBtnDisabled" type="primary"
                     @click="AddExtraPrice()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {PostData} from "@/api";
import {getTime} from "@/views/Slips/myUtils";
import princeSlips from "@/api/slips/princeSlips";
import qs from "qs";

export default {
  data(){
    return {
      //其他
      priceList:[],
      priceListOther:[],
      //其他费用添加弹框
      openAddExtraPriceDialog:false,
      ExtraPrice:{},
      //列表总数
      total:0,
      ExtraPriceSheetBtnDisabled:false,
      dialogExtraPriceSheetFormVisible:false,
      ExtraPriceSheetModify:{
      },
      queryPrinceSheet:{
        pageSize:10,
        pageNum:1
      },
      princeSheetList:[],
      rules:{
        number:[
          {required:true,message:'请填写费用',trigger:"change"}
        ],
        type:[
          {required:true,message:'请选择订单类型',trigger:"change"}
        ]
      }

    }
  },
  created() {
    this.getList()
    // this.priceSlipsList()
  },
  methods: {
    //收货
    checkDetails(params){
      this.$router.push({path:'/Slips/extraPriceSlipsDetails',query:{orderId:params.orderId,type:params.type}})
    },
    slipsSelect(params){
      if(params===0){
        new Promise((resolve,reject)=>{
          princeSlips.queryAll(this.queryPrinceSheet.name,this.queryPrinceSheet.beginTime
            ,this.queryPrinceSheet.endTime,0,
            0, 1,
            100000,0)
            .then(res=>{
              resolve(res.list)
            })
        }).then(res=>{
          this.priceList=res
        })
      }else{
        new Promise((resolve,reject)=>{
          PostData('/stock/queryStock',qs.stringify({pageSize: 100000,
            pageNum: 1}))
            .then(res=>{
              res.list.map((value)=>{
                value.oId=value.sId
              })
              resolve(res.list)
            })
        }).then(res=>{
          this.priceList=res
        })
      }
    },
    //添加其他费用
    openAddExtraPrice(){
      if (this.$refs['ExtraPrice'] !== undefined)
        this.$refs['ExtraPrice'].resetFields();
      this.openAddExtraPriceDialog=true
    },
    AddExtraPrice(){
      console.log(this.ExtraPrice)
      this.$refs['ExtraPrice'].validate((valid)=>{
        if(valid){
          PostData('/otherFee/insert',this.$qs.stringify(this.ExtraPrice)).then(res=>{
            this.$message({
              type: 'success',
              message: '添加其他费用成功'
            })
            this.openAddExtraPriceDialog=false
            this.getList()
          })
        }
      })
    },


    //获取额外订单信息列表
    getList(pageNum = 1) {
      this.queryPrinceSheet.pageNum = pageNum
      PostData('otherFee/selectAllByLike', this.$qs.stringify(this.queryPrinceSheet)).then(res => {
        res.list.forEach(value => {
          value.date = getTime(value.date)
        })
        console.log(res)
        this.princeSheetList = res.list
        this.total = res.total
      })
    },
    //打开修改额外订单信息
    openExtraPrinceSlips(params) {
      this.dialogExtraPriceSheetFormVisible = true
      this.ExtraPriceSheetModify = JSON.parse(JSON.stringify(params))
    },
    //修改额外订单信息
    UpdateExtraPriceSheet() {
      this.$refs['ExtraPriceSheetModify'].validate((valid) => {
        let ExtraPriceSheetModifyCopy={}
        ExtraPriceSheetModifyCopy.id=this.ExtraPriceSheetModify.id
        ExtraPriceSheetModifyCopy.note=this.ExtraPriceSheetModify.note
        ExtraPriceSheetModifyCopy.number=this.ExtraPriceSheetModify.number
        ExtraPriceSheetModifyCopy.orderId=this.ExtraPriceSheetModify.orderId
        ExtraPriceSheetModifyCopy.type=this.ExtraPriceSheetModify.type
        PostData('otherFee/update', this.$qs.stringify(ExtraPriceSheetModifyCopy)).then(res => {
          this.$message({
            type: 'success',
            message: '修改额外订单信息成功'
          })
          this.dialogExtraPriceSheetFormVisible = false
          this.getList()
        })
      })
    },
    //删除额外订单信息
    deleteExtraPrinceSlips(params) {
      this.$confirm('是否将进行退款' + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let deleteOtherFee={}
        deleteOtherFee.id=params
        console.log(deleteOtherFee)
        PostData('otherFee/delete', this.$qs.stringify(deleteOtherFee)).then(res => {
          this.$message({
            type: 'success',
            message: '删除其他费用信息成功'
          })
          this.getList()
        })
      })
    },
    oninput(value) {
      let str = value;
      let len1 = str.substr(0, 1);
      let len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      //第一位不能是.
      if (len1 == ".") {
        str = "";
      }
      if (len1 == "+") {
        str = "";
      }
      if (len1 == "-") {
        str = "";
      }

      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        let str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, "$1"); // 小数点后只能输 2 位
      return str;
    }
  }
}
</script>

<style scoped>

</style>
