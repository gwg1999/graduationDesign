<template>
  <div>
    <div class="app-container">
      <el-form :inline="true" class="demo-form-inline" style="position: relative">
        <el-form-item   style="width: 210px">
          <!--<el-input @keyup.enter.native="queryGoods" v-model="queryDetails.pName" clearable placeholder="请输入零件名" ></el-input>-->
        </el-form-item>
        <!--<el-button type="primary" style="position: absolute" icon="el-icon-search" @click="queryGoods">查询</el-button>-->
        <el-button type="primary" icon="el-icon-view" style="position: absolute;right:10px"  @click="showSelected">查看已选零件</el-button>
      </el-form>
      <el-table use-virtual
                :data="returnGoodList"
                border
                fit
                highlight-current-row
                style="width: 100%">
        <el-table-column
          label="序号"
          width="50%"
          align="center">
          <template slot-scope="scope">
            {{ (queryDetails.pageNum - 1) * queryDetails.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="partName" label="零件名" width="400px" align="center" />
        <el-table-column prop="odNumber" label="数量"  width="100px" align="center" />
        <el-table-column prop="odRetailPrice" label="价格"  width="100px" align="center" />
        <el-table-column prop="wId" label="零件数目和价格" align="center">
          <template slot-scope="scope">
            <el-form>
              <div style="display: flex;justify-content: space-evenly;font-size: 4px;height: 40px">
                <el-form-item>
                  <!--数量:<el-input style="width: 100px" @keyup.native="scope.row.number = number(scope.row.number)"  v-model = "scope.row.number"  size="small"></el-input>-->
                  数量:<el-input-number :min="0"  v-model="scope.row.number"  size="small"></el-input-number>
                </el-form-item>
                <el-form-item>
                  <el-switch
                    style="border-top: 10px"
                    v-model="scope.row.rdIsBad"
                    active-text="好件"
                    active-value="0"
                    inactive-value="1"
                    inactive-text="坏件">
                  </el-switch>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addPart(scope.row)">添加</el-button>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <!--        <el-pagination-->
      <!--          layout="total, prev, pager, next, jumper"-->
      <!--          :page-size="levelIV.pageSize"-->
      <!--          :current-page="levelIV.pageNum"-->
      <!--          :total="total"-->
      <!--          style="padding: 30px 0; text-align: right;"-->
      <!--          @current-change="queryGoods"-->
      <!--        />-->
      <!--      购物车-->
      <el-dialog
        :visible.sync="dialogVisible"
        width="80%"
        class="my-info-dialog"
        style="padding-top: 0;padding-bottom: 0"
      >
        <el-container class="my-info-container" style="padding-top: 0">
          <el-main style="padding-top: 0;padding-bottom: 0">
            <el-form :model="priceSlip" status-icon ref="priceSlip" label-width="100px" class="demo-ruleForm" style="padding-top: 0;padding-bottom: 0">
              <h4>零件信息</h4>
              <div style="float: top;padding:0" >
                <el-table
                  style="padding-top: 0"
                  :data="priceSlip.orderDetailList"
                  border
                  fit
                  highlight-current-row>
                  <el-table-column prop="partName" label="零件名" width="200px" align="center"/>
                  <el-table-column prop="number" label="退货数量" width="150px" align="center"/>
                  <el-table-column prop="odRetailPrice" label="单价" width="80px" align="center"/>
                  <el-table-column prop="totalPrice" label="总价" width="110px" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.number*scope.row.odRetailPrice}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" icon="el-icon-edit"  @click="openPartRecordDialog(scope.row)">修改</el-button>
                      <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deletePartRecord(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

            </el-form>
          </el-main>
          <el-footer style="padding-top: 10px">
            <el-button style="margin-left:70% " @click="dialogVisible = false">取 消</el-button>
            <el-button style="margin-right:5% " type="primary" @click="openSubmitForm">确 定</el-button>
          </el-footer>
        </el-container>
      </el-dialog>
      <!--下一步提交-->
      <el-dialog :visible.sync="dialogSubmitVisible"  title="其他信息填写" width="70%">
        <el-form :model="priceSlip" label-width="120px" ref="priceSlip" :rules="rules">
          <el-form-item label="交易属性" prop="type">
            <el-select v-model="priceSlip.type"   clearable placeholder="交易属性" style="width: 200px"  >
              <el-option value="0" label="退货退款"/>
              <el-option value="1" label="退换货"/>
              <el-option value="2" label="仅退款"/>
            </el-select>
          </el-form-item>
          <el-form-item label="总价格" prop="priceTotal">
            <el-input  @keyup.native="priceSlip.priceTotal = oninput(priceSlip.priceTotal)" v-model="priceSlip.priceTotal"  style="width: 200px"/>
          </el-form-item>
          <el-form-item label="退货原因" prop="note">
            <el-input v-model="priceSlip.note" style="width:80%"  rows="5" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSubmitVisible = false">取 消</el-button>
          <el-button :disabled="BtnDisabled" type="primary"
                     @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>

      <!--    修改购物车零件-->
      <el-dialog :visible.sync="dialogPartsVisible" title="修改购物车零件">
        <el-form :model="partsModify" label-width="120px" ref="partsModify" :rules="rules">
          <el-form-item label="零件数量" prop="odNumber">
            <el-input   v-model="partsModify.odNumber"/>
          </el-form-item>
          <el-form-item label="零件价格" prop="odRetailPrice">
            <el-input  @keyup.native="partsModify.odRetailPrice = oninput(partsModify.odRetailPrice)" v-model="partsModify.odRetailPrice"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPartsVisible = false">取 消</el-button>
          <el-button   type="primary"
                       @click="UpdateParts()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import princeSlips from "@/api/slips/princeSlips";
import {PostData} from "@/api";
import {validatePassCheck} from "@/views/Slips/ruleNumber"
export default {
  created() {
    this.getList()
  },
  data(){
    return{
      //重复网络请求
      BtnDisabled:false,
      dialogNote:false,
      queryDetails:{
        pageSize:1000,
        pageNum:1
      },
      // 购物车
      dialogVisible:false,
      priceSlip:{
        returnDetailList:[],
        orderDetailList:[]
      },
      //修改购物车零件信息
      dialogPartsVisible:false,
      partsModify:{

      },
      princeSheetReturn:{
        returnDetailList:[
          {
            odId:'',
            odNumber:'',
            number:''
          }
        ]
      },
      // 打开提交
      dialogSubmitVisible:false,
      returnGoodList:[],
      rules:{
        odId: [
          { required: true, message: '请选择退货商品', trigger: 'change' }
        ],
        rType:[
          { required: true, message: '请选择交易属性', trigger: 'change' }
        ],
        odNumber: [
          { required: true, validator:validatePassCheck, trigger: 'change' }
        ],
        priceTotal:[
          { required: true, message: '请输入总价格', trigger: 'change' }
        ]
      }
    }
  },
  computed:{
    numberPlaceholder(){
      return this.queryFlag===1 ? "请填写零件数量" : this.queryFlag===0?"请填写整件数量":'请先选择零件或整件'
    }
  },
  methods: {
    //向购物车中添加零件
    addPart(item){
      let temp=Object.assign({},item)
      let flag=false
      if(temp.number&&temp.odRetailPrice){
        for(let part of this.priceSlip.orderDetailList){
          if(item.odId===part.odId) {
            flag = true
            let num=part.number+item.number
            if(num>part.odNumber){
              this.$message({
                message: `现有数量大于退货的数量,现最多还可退${part.odNumber-part.number}件`,
                type: "error"
              })
            }else {
              part.number += item.number
              part.odRetailPrice=item.odRetailPrice
              part.priceTotal=part.number*part.odRetailPrice
              this.$message({
                message: '已修改零件数量',
                type: "success"
              })
            }
          }
        }
        if(!flag){
          if(temp.number<=temp.odNumber){
            temp.priceTotal=temp.number*temp.odRetailPrice
            this.priceSlip.orderDetailList.push(temp)
            this.$message({
              message:'已添加至已选零件库',
              type:"success"
            })
          }else{
            this.$message({
              message:'所退货数量大于现有的数量',
              type:"error"
            })
          }
        }
      }
      else {
        this.$message({
          message:'请输入零件数量或价格',
          type:"warning"
        })
      }
    },
    queryGoods(){
      this.queryDetails.odOrderId = this.$route.query.row.oId
      princeSlips.queryAllDetails(this.queryDetails.odOrderId, this.queryDetails.pName,
        this.queryDetails.odType, this.queryDetails.pageNum, this.queryDetails.pageSize)
        .then(res => {
          this.returnGoodList= res.list.filter((value)=>value.odStatus!==1)
        })
    },
    getList(){
      this.queryDetails.odOrderId = this.$route.query.row.oId
      princeSlips.queryAllDetails(this.queryDetails.odOrderId, this.queryDetails.pName,
        this.queryDetails.odType, this.queryDetails.pageNum, this.queryDetails.pageSize)
        .then(res => {
          res.list.forEach((item)=>{
            item.number=item.odNumber
          })
          this.returnGoodList=res.list
          this.returnGoodList=this.returnGoodList.filter((value)=>value.odStatus!==1)
          this.returnGoodList= JSON.parse(JSON.stringify(this.returnGoodList))
        })
    },
    //购物车
    showSelected(){
      this.dialogVisible=true
    },
    //购物车操作
    openPartRecordDialog(record){
      this.dialogPartsVisible=true
      this.partsModify=JSON.parse(JSON.stringify(record))
    },
    deletePartRecord(record){
      this.$confirm('是否将此条零件信息从购物车删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        for(let i=0;i<this.priceSlip.orderDetailList.length;i++){
          if(this.priceSlip.orderDetailList[i].odId===record.odId){
            this.priceSlip.orderDetailList.splice(i, 1)
          }
        }
      })
    },
    UpdateParts(){
      this.$refs['partsModify'].validate((valid)=>{
        if(valid){
          for(let i=0;i<this.priceSlip.orderDetailList.length;i++){
            if(this.priceSlip.orderDetailList[i].odId===this.partsModify.odId){
              this.priceSlip.orderDetailList[i].odNumber=this.partsModify.odNumber
              this.priceSlip.orderDetailList[i].odRetailPrice=this.partsModify.odRetailPrice
            }
          }
          this.dialogPartsVisible=false
        }
      })
    },
    //提交退货
    openSubmitForm(){
      if (this.$refs['priceSlip'] !== undefined)
        this.$refs['priceSlip'].resetFields();
      this.dialogSubmitVisible=true
      let totalPrice=0
      this.priceSlip.orderDetailList.forEach(value => {
        totalPrice+=value.priceTotal
      })
      this.priceSlip.priceTotal=parseInt(totalPrice)
      this.priceSlip=JSON.parse(JSON.stringify(this.priceSlip))
    },
    submitForm(){
      this.BtnDisabled = true
      setTimeout(() => {
        this.BtnDisabled = false
      }, 1000)
      this.$refs['priceSlip'].validate(valid=>{
        let params = {}
        params = this.$route.query.row
        this.priceSlip.orderId = params.oId
        this.priceSlip.orderType = 0
        this.priceSlip.customerUnitName = params.customerName
        this.priceSlip.operatorName = params.createPeopleName
        this.priceSlip.returnNumber=this.priceSlip.priceTotal
        this.priceSlip.returnDetailList=this.priceSlip.orderDetailList
        this.priceSlip.rOperatorId = params.oWarehouseOperaterId
        this.priceSlip.rOrderType = 0
        this.priceSlip.rOderId = params.oId
        this.priceSlip.rIsReceive = 0
        this.priceSlip.rIsPayment = 0
        this.priceSlip.rPrice=this.priceSlip.priceTotal
        this.priceSlip.rType=this.priceSlip.type;
        this.priceSlip.rReason=this.priceSlip.note
        this.priceSlip.rIsReceive=0
        console.log(this.priceSlip)
        for (let i = 0; i < this.priceSlip.orderDetailList.length; i++) {
          console.log(this.priceSlip.returnDetailList)
          this.priceSlip.returnDetailList[i].rdPartsNum = this.priceSlip.orderDetailList[i].number
          this.priceSlip.returnDetailList[i].rdPartsType = this.priceSlip.orderDetailList[i].odType
          this.priceSlip.returnDetailList[i].rdType = 0
          this.priceSlip.returnDetailList[i].rdRealOrderId = this.priceSlip.orderDetailList[i].odId
          this.priceSlip.returnDetailList[i].rdPartsId = this.priceSlip.orderDetailList[i].odPartsId
          this.priceSlip.returnDetailList[i].rdRetailPrice = this.priceSlip.orderDetailList[i].priceTotal
          if(this.priceSlip.returnDetailList[i].odType===1){
            this.priceSlip.returnDetailList[i].rdNumber=this.priceSlip.returnDetailList[i].parts.pNumber
          }
        }
        PostData('return/addReturn', this.priceSlip)
          .then(res => {
            this.$message({
              type: "success",
              message: '退货成功'
            })
            this.dialogVisible=false
            this.dialogSubmitVisible=false
            this.$router.push({
              path: "/returnGood/cancelSlipsManagement"
            });
          })
      })
    },
    number(value){
      let str = value;
      let len1 = str.substr(0, 1);
      let len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && (len2 == "0"||len2 != "^^")) {
        str = str.substr(1, 1);
      }
      //正则替换
      str = str.replace(/[^\d]+/g, "");
      str = str.replace(/^\D*([1-9]\d*)$/, "$1");
      return str;
    },
    //数字验证
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
