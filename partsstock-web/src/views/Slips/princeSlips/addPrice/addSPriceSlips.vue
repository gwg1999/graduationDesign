<template>
  <div>
    <div class="app-container">
      <h2 style="text-align: center;">添加销售单</h2>
      <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写销售单信息" />
        <el-step title="添加零件或整件" />
      </el-steps>
      <el-form label-width="120px" :rules="rules" :model="priceSlip" ref="priceSlip">
        <el-form-item label="客户单位" prop="oCustomerId">
          <el-select
            v-model="priceSlip.oCustomerId" filterable placeholder="请选择客户单位">
            <el-option
              v-for="customer in customerNameList"
              :key="customer.cuId"
              :label="customer.cuUnitName"
              :value="customer.cuId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库管理员" prop="oWarehouseOperaterId">
          <el-select
            v-model="priceSlip.oWarehouseOperaterId" filterable placeholder="请选择仓库管理员" >
            <el-option
              v-for="WarehouseOperator in WarehouseOperatorList"
              :key="WarehouseOperator.aId"
              :label="WarehouseOperator.aName"
              :value="WarehouseOperator.aId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发票类型" prop="oInvoiceTypeId">
          <el-select v-model="priceSlip.oInvoiceTypeId"   clearable placeholder="发票类型" style="width: 200px"  >
            <el-option :value="0" label="无"/>
            <el-option :value="1" label="普通发票"/>
            <el-option :value="2" label="增值税发票"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发货方式" prop="oDeliveryWay">
          <el-select v-model="priceSlip.oDeliveryWay"   clearable placeholder="发货方式" style="width: 200px"  >
            <el-option value="快递" label="快递"/>
            <el-option value="托运" label="托运"/>
            <el-option value="线下交易" label="线下交易"/>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="oPaymentWay">
          <el-select v-model="priceSlip.oPaymentWay"   clearable placeholder="支付方式" style="width: 200px"  >
            <el-option value="挂账" label="挂账"/>
            <el-option value="线下" label="线下"/>
            <el-option value="线上" label="线上"/>
          </el-select>
        </el-form-item>
        <el-form-item label="其他费用">
          <el-input @keyup.native="priceSlip.oOtherCostMoney = oninput(priceSlip.oOtherCostMoney)" v-model="priceSlip.oOtherCostMoney" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="priceSlip.oNote" style="width: 90%"  rows="5" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="saveSalesSlip()">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import Cookie from "js-cookie";
import {validatePassCheck,twoPoint} from "@/views/Slips/ruleNumber";
import {commonList} from "../../myApi"
export default {
  created() {
    if(this.$route.query.priceSlip){
      this.priceSlip = Object.assign({}, this.$route.query.priceSlip)
    }
    this.getList()
  },
  data(){
    return{
      priceSlip:{
        orderDetailList:[],
        wholeDetailsList:[]
      },
      customerNameList:[],
      WarehouseOperatorList:[],
      rules: {
        oCustomerId: [
          {required: true, message: '请选择客户单位', trigger: 'change'}
        ],
        oWarehouseOperaterId: [
          {required: true, message: '请选仓库管理员', trigger: 'change'}
        ],
        oInvoiceTypeId: [
          {required: true, message: '请选择发票类型', trigger: 'change'}
        ],
        oDeliveryWay: [
          {required: true, message: '请选择选择发货方式', trigger: 'change'}
        ],
        oPaymentWay: [
          {required: true, message: '请选择支付方式', trigger: 'change'}
        ]
      }
    }
  },
  methods:{
    getList(){
      commonList("customer/selectAllByLike").then(res=>{
        this.customerNameList=res.list
      })
      commonList('admin/selectAllByLike').then(res=>{
        this.WarehouseOperatorList=res.list
      })
    },
    saveSalesSlip(){
      this.$refs['priceSlip'].validate((valid) => {
        if (valid) {
          this.$router.push({
            path: '/Slips/addPriceGoods',
            query:{
              priceSlip:this.priceSlip
            }
          })
        }
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
