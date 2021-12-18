<template>
  <div>
    <div class="app-container" >
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-input v-model="querySalesSlip.name"   placeholder="客户" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            v-model="querySalesSlip.slipsCreateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="报价单创建时间开始日期"
            end-placeholder="报价单创建时间结束日期"
            style="width: 420px"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" style="position: absolute" @click="getList(1)">查 询</el-button>
        <router-link to="/Slips/addSlips">
          <el-button type="primary"
                     icon="el-icon-circle-plus" style="position: absolute;right: 10px">添加</el-button>
        </router-link>
      </el-form>
      <el-table
        :data="salesSlipsList"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (querySalesSlip.pageNum - 1) * querySalesSlip.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="createPeopleName" label="创建人员" width="100px" align="center"/>
        <el-table-column prop="customerName" label="客户" width="80" align="center"/>
        <el-table-column prop="partNumber" label="零件数量" width="80" align="center"/>
        <el-table-column prop="wholeNumber" label="整件数量" width="80" align="center"/>
        <el-table-column prop="qPrice" label="应收价" width="80px" align="center"/>
        <el-table-column prop="qCreateTime" label="创建时间" width="100" align="center"/>
        <el-table-column prop="qNote" label="备注"  align="center"/>
        <el-table-column label="查看详情" width="150px" align="center">
          <template slot-scope="scope">
            <router-link :to="{path:'/Slips/salesSlipDetails',query:{qId:scope.row.qId,qCustomerId:scope.row.qCustomerId}}">
              <el-button type="primary" size="mini" icon="el-icon-edit" >查看详情</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="openInverseOrder(scope.row.qId)">转成销售单</el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit"  @click="openSalesSheetDialog(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deleteSalesSlips(scope.row.qId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogSalesSheetFormVisible" title="修改报价单">
        <el-form :model="salesSlipsModify" label-width="120px" :rules="rules" ref="salesSlipsModify">
          <el-form-item label="客户名称" prop="customerName">
            <el-select
              v-model="salesSlipsModify.customerName" clearable placeholder="请选择客户名称">
              <el-option
                v-for="customer in customList"
                :key="customer.cuId"
                :label="customer.cuUnitName"
                :value="customer.cuId"/>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSalesSheetFormVisible = false">取 消</el-button>
          <el-button :disabled="salesSheetBtnDisabled" type="primary"
                     @click="UpdateSalesSlips()">确 定</el-button>
        </div>
      </el-dialog>
      <!--转销售单-->
      <el-dialog :visible.sync="dialogWarehouseOperatorFormVisible" title="转销售单">
        <el-form :model="warehouseOperatorModify" label-width="120px" :rules="rules" ref="warehouseOperatorModify">
          <el-form-item label="选择仓库管理员" prop="oWarehouseOperaterId">
            <el-select v-model="warehouseOperatorModify.oWarehouseOperaterId"  clearable filterable placeholder="选择仓库管理员" >
              <el-option
                v-for="warehouseOperator in warehouseOperatorList"
                :key="warehouseOperator.aId"
                :label="warehouseOperator.aName"
                :value="warehouseOperator.aId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentWay">
            <el-select v-model="warehouseOperatorModify.paymentWay"   clearable placeholder="立项状态" style="width: 200px"  >
              <el-option value="挂账" label="挂账"/>
              <el-option value="线下" label="线下"/>
              <el-option value="线上" label="线上"/>
            </el-select>
          </el-form-item>
          <el-form-item label="发货方式" prop="deliveryWay">
            <el-select v-model="warehouseOperatorModify.deliveryWay" clearable  placeholder="发货方式" style="width: 200px"  >
              <el-option value="线下交易" label="线下交易"/>
              <el-option value="快递" label="快递"/>
              <el-option value="托运" label="托运"/>
            </el-select>
          </el-form-item>
          <el-form-item label="其他费用">
            <el-input @keyup.native="warehouseOperatorModify.oOtherCostMoney = oninput(warehouseOperatorModify.oOtherCostMoney)" v-model="warehouseOperatorModify.oOtherCostMoney"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogWarehouseOperatorFormVisible = false">取 消</el-button>
          <el-button :disabled="warehouseOperatorBtnDisabled" type="primary"
                     @click="inverseOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <el-pagination
        :current-page="querySalesSlip.pageNum"
        :page-size="querySalesSlip.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
      <!--缺货备注提醒-->
      <el-dialog :visible.sync="dialogNote"  title="缺货备注提醒" width="70%">
        <el-form :model="priceNote" label-width="120px" ref="priceNote" :rules="rules">
          <el-form-item label="备注" prop="note">
            <el-input v-model="priceNote.note" style="width: 90%" rows="5" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogNote = false">取 消</el-button>
          <el-button  type="primary"
                      @click="UpdateNote()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import salesSlip from "@/api/slips/salesSlip";
import {reserveTime,getTime } from "../myUtils"
import {commonList} from "../myApi"
export default {
  name: "partSell",
  data(){
    return{
      //零件负数添加备注
      dialogNote:false,
      priceNote:{},
      //报价单转销售单
      warehouseOperatorBtnDisabled:false,
      total:0,
      dialogWarehouseOperatorFormVisible:false,
      warehouseOperatorModify:{},
      warehouseOperatorList:[],
      dialogSalesSheetFormVisible:false,
      salesSheetBtnDisabled:false,
      querySalesSlip:{
        pageSize:10,
        pageNum:1,
        createTimeSequence:0,
        slipsCreateTime: ''
      },
      salesSlipsList:[],
      salesSlipsModify:{},
      customList:[],
      rules:{
        customerName: [
          {required: true, message: '请选填入客户名称', trigger: 'change'}
        ],
        oWarehouseOperaterId:[
          {required: true, message: '请选选择仓库管理员', trigger: 'change'}
        ],
        paymentWay:[
          {required: true, message: '请选择支付方式', trigger: 'change'}
        ],
        deliveryWay:[
          {required: true, message: '请选择发货方式', trigger: 'change'}
        ],
      }
    }
  },
  mounted() {
    this.getList()
    this.getCommonList()
  },
  methods:{
    getCommonList(){
      commonList('customer/selectAllByLike').then(res=>{
        this.customList=res.list
      })
      commonList('admin/selectAllByLike').then(res=>{
        this.warehouseOperatorList=res.list
      })
    },
    openInverseOrder(params){
      this.dialogWarehouseOperatorFormVisible=true
      if (this.$refs['warehouseOperatorModify'] !== undefined)
        this.$refs['warehouseOperatorModify'].resetFields();
      this.warehouseOperatorModify.pId=JSON.parse(JSON.stringify(params))
    },
    //报价单转销售单
    inverseOrder(){
      this.$refs['warehouseOperatorModify'].validate((valid)=>{
        if(valid) {
          this.warehouseOperatorBtnDisabled = true
          this.enable();
          salesSlip.becomeOrder(this.warehouseOperatorModify.oWarehouseOperaterId,
            this.warehouseOperatorModify.pId,this.warehouseOperatorModify.paymentWay,this.warehouseOperatorModify.deliveryWay,this.warehouseOperatorModify.oOtherCostMoney)
            .then(res => {
              if (res.result === 'fails') {
                let note=''
                res.lackPartList.forEach((value) => {
                  let number = null
                  number = +value.lackNumber - (2 * value.lackNumber)
                  alert('由于' + value.pName + '数量不足,添加销售单失败,目前' + value.pName + '的数量为'
                    + value.pRealInventory + '还缺少' + number)
                  note += `${value.pName}缺${number}个.`
                })
                let Note = {}
                Note.status = 0
                Note.operateId = parseInt(Cookie.get('aId'))
                Note.type = 0
                Note.note = note
                this.priceNote=Note
                this.UpdateNote()
              }else{
                this.$message({
                  type: 'success',
                  message: '转销售单成功'
                })
                this.dialogWarehouseOperatorFormVisible = false
                this.warehouseOperatorBtnDisabled=false
                this.getList()
              }
            })
        }
      })
    },
    //负数零件备注增加
    UpdateNote(){
      this.$refs.priceNote.validate((valid)=>{
        if(valid){
          PostData('/note/insert', this.priceNote).then(res => {
            this.dialogNote=false
            this.$message({
              type: 'success',
              message: '转销售单成功'
            })
            this.dialogWarehouseOperatorFormVisible = false
            this.warehouseOperatorBtnDisabled=false
            this.getList()
          })
        }
      })
    },
    //拉列表
    getList(pageNum=1){
      this.querySalesSlip.pageNum=pageNum
      if(this.querySalesSlip.slipsCreateTime){
        this.querySalesSlip.beginTime=reserveTime(this.querySalesSlip.slipsCreateTime[0])
        this.querySalesSlip.endTime=reserveTime(this.querySalesSlip.slipsCreateTime[1])
      }else {
        this.querySalesSlip.beginTime=undefined
        this.querySalesSlip.endTime=undefined
      }
      salesSlip.queryAll(this.querySalesSlip.name,this.querySalesSlip.beginTime
        ,this.querySalesSlip.endTime,this.querySalesSlip.createTimeSequence,
        this.querySalesSlip.endTimeSequence, this.querySalesSlip.pageNum,
        this.querySalesSlip.pageSize).then(res=>{
        this.total=res.total
        if(res.list)
          for (let i=0;i<res.list.length;i++){
            res.list[i].qCreateTime=getTime(res.list[i].qCreateTime)
          }
        this.salesSlipsList=res.list
      })
    },
    //打开修改弹框
    openSalesSheetDialog(params){
      this.dialogSalesSheetFormVisible=true
      if (this.$refs['salesSlipsModify'] !== undefined)
        this.$refs['salesSlipsModify'].resetFields();
      this.salesSlipsModify=JSON.parse(JSON.stringify(params))

    },
    enable(){
      setTimeout(()=>{
        this.salesSheetBtnDisabled=false
      },1000);
    },
    //单个修改报价单
    UpdateSalesSlips(){
      this.$refs['salesSlipsModify'].validate((valid)=>{
        if(valid) {
          this.salesSheetBtnDisabled = true
          this.enable();
          this.salesSlipsModify.qCreateTime = null
            this.salesSlipsModify.qCustomerId=this.salesSlipsModify.customerName
          PostData('quotation/updateQuotation', this.salesSlipsModify)
            .then(res => {
              this.$message({
                type: 'success',
                message: '修改报价单信息成功'
              })
              this.dialogSalesSheetFormVisible = false
              this.getList()
            })
        }
      })
    },
    //删除报价单
    deleteSalesSlips(params){
      this.$confirm('是否将此报价单信息删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        salesSlip.deleteQuotation(params)
          .then(res=>{
            this.$message({
              type: 'success',
              message: '删除报价单成功'
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
