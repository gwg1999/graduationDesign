<template>
  <div>
    <div class="app-container">
      <el-form  :rules="rules" :model="princeSheetReturn" ref="princeSheetReturn" >
        <div v-for="(itemList, index) in princeSheetReturn.returnDetailList" :key="index">
          <el-form-item  label="商品选择" >
            <el-col :span="5" style="width: 210px;">
              <el-form-item :prop="`returnDetailList[${index}].odId`" :rules="rules.odId">
                <el-select  @change="changeSelect($event,index)" v-model="itemList.odId"  clearable placeholder="退货商品选择" style="width: 200px"  >
                  <el-option
                    v-for="good in returnGoodList"
                    :key="good.odId"
                    :label="good.partName"
                    :value="good.odId"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="width: 270px;">
              <el-form-item v-show="itemList.odId" label="退货数量:" label-width="100px"  :prop="`returnDetailList[${index}].odNumber`" :rules="rules.odNumber" style="width: 260px;">
                <el-input v-model="itemList.odNumber"  :placeholder="numberPlaceholder"/>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="width: 230px;">
              <el-form-item v-show="itemList.odId" label="当前数量:" label-width="80px"  style="width: 240px;">
                {{itemList.number}}
              </el-form-item>
            </el-col>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="addItem" type="primary">增加</el-button>
        </el-form-item>
        <el-form-item label="交易属性" prop="rType">
          <el-select v-model="princeSheetReturn.rType"   clearable placeholder="交易属性" style="width: 200px"  >
            <el-option value="0" label="退货退款"/>
            <el-option value="1" label="退换货"/>
            <el-option value="2" label="仅退款"/>
          </el-select>
        </el-form-item>
        <el-form-item label="退货原因" prop="rReason">
          <el-input v-model="princeSheetReturn.rReason" style="width: 400px"/>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="saveSalesSlip()">保存</el-button>
        </el-form-item>
      </el-form>
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
      queryDetails:{
        pageSize:0,
        pageNum:0
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
      returnGoodList:[],
      rules:{
        odId: [
          { required: true, message: '请选择退货商品', trigger: 'change' }
        ],
        odNumber: [
          { required: true, validator:validatePassCheck, trigger: 'change' }
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
    changeSelect(event,index){
      this.queryDetails.odId=event
      princeSlips.queryAllDetails(this.queryDetails.odOrderId, this.queryDetails.pName,
        this.queryDetails.odType, this.queryDetails.pageNum, this.queryDetails.pageSize)
        .then(res => {
          let returnList= res.list.filter((value)=>value.odStatus!=1)
          let number
          for (let returnListKey of returnList) {
            if(returnListKey.odId=event) number=returnListKey.odNumber
          }
          this.princeSheetReturn.returnDetailList[index].number=number
        })
    },
    getList(){
      this.queryDetails.odOrderId = this.$route.query.row.oId
      princeSlips.queryAllDetails(this.queryDetails.odOrderId, this.queryDetails.pName,
        this.queryDetails.odType, this.queryDetails.pageNum, this.queryDetails.pageSize)
        .then(res => {
          this.returnGoodList= res.list.filter((value)=>value.odStatus!=1
          )
        })
    },
    addItem () {
      this.princeSheetReturn.returnDetailList.push({
        odId: '',
        odNumber:''
      })
    },
    deleteItem (item, index) {
      this.princeSheetReturn.returnDetailList.splice(index, 1)
    },
    saveSalesSlip(){
      let state=-1
      if(this.princeSheetReturn.returnDetailList.length>=0)
        this.princeSheetReturn.returnDetailList.forEach((item)=>{
          if(item.number<item.odNumber)  {
            state=1
          }
          else state=0
        })
      if(state===0) {
        this.$refs['princeSheetReturn'].validate(value => {
          if (value) {
            let params = {}
            params = this.$route.query.row
            this.princeSheetReturn.operatorName = params.createPeopleName
            this.princeSheetReturn.customerUnitName = params.customerName
            this.princeSheetReturn.rOperatorId = params.oWarehouseOperaterId
            this.princeSheetReturn.orderType = 0
            this.princeSheetReturn.orderId = params.oId
            this.princeSheetReturn.rOrderType = 0
            this.princeSheetReturn.rOderId = params.oId
            this.princeSheetReturn.rIsReceive = 0
            this.princeSheetReturn.rIsPayment = 0
            let rPrice = 0
            for (let i = 0; i < this.princeSheetReturn.returnDetailList.length; i++) {
              for (let j = 0; j < this.returnGoodList.length; j++) {
                if (this.returnGoodList[j].odId === this.princeSheetReturn.returnDetailList[i].odId) {
                  rPrice += this.returnGoodList[j].odRetailPrice * this.returnGoodList[j].odNumber
                  this.princeSheetReturn.returnDetailList[i].rdPartsNum = this.returnGoodList[j].odNumber
                  this.princeSheetReturn.returnDetailList[i].rdPartsType = this.returnGoodList[j].odType
                  this.princeSheetReturn.returnDetailList[i].rdType = 0
                  this.princeSheetReturn.returnDetailList[i].rdRealOrderId = this.returnGoodList[j].odId
                  this.princeSheetReturn.returnDetailList[i].rdPartsId = this.returnGoodList[j].odPartsId
                  this.princeSheetReturn.returnDetailList[i].rdRetailPrice = this.returnGoodList[j].odRetailPrice * this.returnGoodList[j].odNumber
                }
              }
            }
            this.princeSheetReturn.rPrice = rPrice
            PostData('return/addReturn', this.princeSheetReturn)
              .then(res => {
                this.$message({
                  type: "success",
                  message: '退货成功'
                })
                this.$router.back()
              })
          }
        })
      }
      else {
        this.$message({
          type:'error',
          message:'您所退货的零件或者整件的数量是大于您原购买的数量的'
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
