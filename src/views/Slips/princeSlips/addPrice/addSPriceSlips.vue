<template>
  <div>
    <div class="app-container">
      <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写销售单信息" />
        <el-step title="添加零件或整件" />
      </el-steps>
      <el-form label-width="120px" :rules="rules" :model="priceSlip" ref="priceSlip">

        <el-form-item label="客户单位" prop="oCustomerId" style="width: 650px">
          <el-select
            v-model="priceSlip.oCustomerId"
            ref="agentSelect"
            filterable clearable placeholder="请选择客户单位"
            :filter-method="customerNameListFilter" style="width: 640px" @change="deliverWay($event)"
            @hook:mounted="cancalReadOnly"
            @visible-change="cancalReadOnly"
          >
            <el-option
              v-for="customer in customerList"
              :key="customer.cuId"
              :label="`${customer.cuUnitName}(客户姓名)-${customer.cuPhoneNumber}(客户电话)-${customer.cuAddress}(客户地址)`"
              :value="customer.cuId"/>
          </el-select>
        </el-form-item>

        <el-form-item label="仓库管理员" prop="oWarehouseOperaterId" style="width: 500px">
          <el-select
            v-model="priceSlip.oWarehouseOperaterId" clearable
            ref="agent2Select"
            :filter-method="warehouseOperatorListListFilter"
            filterable placeholder="请选择仓库管理员" style="width: 500px"
            @hook:mounted="cancalReadOnly"
            @visible-change="cancalReadOnly">
            <el-option
              v-for="WarehouseOperator in warehouseNameList"
              :key="WarehouseOperator.aId"
              :label="`${WarehouseOperator.aName}(仓库管理员姓名)-${WarehouseOperator.aUsername}(仓库管理员账号)`"
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
        <el-form-item label="发货方式" >
          <el-select  id="selectInput" v-model="value"
                      style="width: 200px"
                      clearable filterable placeholder="请选择"
                      ref="searchSelect" :filter-method="dataFilter"
                      @hook:mounted="cancalReadOnly"
                      @visible-change="cancalReadOnly"
                      @focus="selectFocus"
          >
            <el-option
              v-for="item in oDeliveryWayList"
              :key="item.cuCourier"
              :label="`${item.cuCourier}-${item.way}`"
              :value="item.cuCourier"/>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="oPaymentWay">
          <el-select v-model="priceSlip.oPaymentWay"   clearable placeholder="支付方式" style="width: 200px"  >
            <el-option value="挂账" label="挂账"/>
            <el-option value="线下" label="线下"/>
            <el-option value="线上" label="线上"/>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="其他费用">-->
        <!--          <el-input @keyup.native="priceSlip.oOtherCostMoney = oninput(priceSlip.oOtherCostMoney)" v-model="priceSlip.oOtherCostMoney" style="width: 400px"/>-->
        <!--        </el-form-item>-->
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
import {commonList} from "../../myApi"
export default {
  created() {
    this.getList()
  },
  data(){
    return{
      //发货方式
      value:'',
      oDeliveryWayList:[],
      optionDeliveryWayList:[],
      priceSlip:{
        orderDetailList:[],
        wholeDetailsList:[]
      },
      //客户单位
      customerList:[],
      customerNameList:[],
      //仓库管理员
      WarehouseOperatorList:[],
      warehouseNameList:[],
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
    cancalReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          console.log(this)
          const Selects = this.$refs
          // console.log(Selects)　　　　　　// 如果只有1个下拉框，这段就足够了---start
          if (Selects.agentSelect) {
            const input = Selects.agentSelect.$el.querySelector('.el-input__inner')
            input.removeAttribute('readonly')
          }　　　　　　// 如果只有1个下拉框，这段就足够了---end　　　　　　// 如果有多个，就加多几个，代码可以优化，我懒了
          if (Selects.agent2Select) {
            const appinput = Selects.agent2Select.$el.querySelector('.el-input__inner')
            appinput.removeAttribute('readonly')
          }
          if (Selects.searchSelect) {
            const gameinput = Selects.searchSelect.$el.querySelector('.el-input__inner')
            gameinput.removeAttribute('readonly')
          }
        }
      })
    },
    deliverWay(event){
      this.customerNameList.forEach((value)=>{
        if(value.cuId===event){
          this.value=value.cuCourier
          let oDeliveryWayListCopy=[]
          let obj={
            cuCourier:value.cuCourier,
            way:"默认物流"
          }
          if(value.cuSpareCourier){
            let obj2={
              cuCourier:value.cuSpareCourier,
              way:"备用"
            }
            oDeliveryWayListCopy.push(obj2)
          }
          oDeliveryWayListCopy.push(obj)
          this.oDeliveryWayList=oDeliveryWayListCopy
          this.optionDeliveryWayList=oDeliveryWayListCopy
        }
      })
    },
    //客户单位模糊查询
    customerNameListFilter(query = '') {
      if(query!==''){
        let PinyinMatch = this.$pinyinmatch;
        if (query) {
          let result = [];
          this.customerNameList.forEach(i => {
            let m = PinyinMatch.match(i.cuUnitName, query);
            if (m) {
              result.push(i);
            }
          });
          if(result.length>20){
            this.customerList = result.slice(0, 20);
          } else
          {
            this.customerList=result
          }
        }
      }else {
        this.customerList=[]
      }
    },
    warehouseOperatorListListFilter(query = '') {
      if(query!==''){
        let PinyinMatch = this.$pinyinmatch;
        if (query) {
          let result = [];
          this.WarehouseOperatorList.forEach(i => {
            let m = PinyinMatch.match(i.aName, query);
            if (m) {
              result.push(i);
            }
          });
          if(result.length>20){
            this.warehouseNameList = result.slice(0, 20);
          } else
          {
            this.warehouseNameList=result
          }
        }
      }else {
        this.warehouseNameList=[]
      }
    },
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
        this.priceSlip.oDeliveryWay=this.value
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
    },



    dataFilter(val) {
      this.value = val;
      if (val) {
        this.oDeliveryWayList = this.optionDeliveryWayList.filter((item) => {
          if (item.cuCourier.includes(val) || item.cuCourier.toUpperCase().includes(val.toUpperCase())) {
            return true
          }
        })
      } else {
        this.oDeliveryWayList = this.optionDeliveryWayList;
      }
    },
    selectFocus(e){
      let value = e.target.value;
      setTimeout(() => {
        let input = this.$refs.searchSelect.$children[0].$refs.input;
        input.value = value;
      })
    }
  }
}
</script>

<style scoped>

</style>
