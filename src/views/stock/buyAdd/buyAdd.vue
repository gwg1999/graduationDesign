<template>
  <div>
    <div class="app-container">
      <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写进货单信息" />
        <el-step title="添加零件" />
      </el-steps>
      <el-form label-width="120px" :rules="rules" :model="priceSlip" ref="priceSlip">

<!--        <el-form-item label="客户单位" prop="oCustomerId" style="width: 650px">-->
<!--          <el-select-->
<!--            v-model="priceSlip.oCustomerId" filterable clearable placeholder="请选择客户单位"-->
<!--            :filter-method="customerNameListFilter" style="width: 640px" @change="deliverWay($event)">-->
<!--            <el-option-->
<!--              v-for="customer in customerList"-->
<!--              :key="customer.cuId"-->
<!--              :label="`${customer.cuUnitName}(客户姓名)-${customer.cuPhoneNumber}(客户电话)-${customer.cuAddress}(客户地址)`"-->
<!--              :value="customer.cuId"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        <el-form-item label="仓库管理员" prop="swarehouseOperaterId" style="width: 500px">
          <el-select
            v-model="priceSlip.swarehouseOperaterId" clearable
            ref="agentSelect"
            :filter-method="warehouseOperatorListListFilter"
            @hook:mounted="cancelReadOnly"
            @visible-change="cancelReadOnly"
            filterable placeholder="请选择仓库管理员" style="width: 500px">
            <el-option
              v-for="WarehouseOperator in warehouseNameList"
              :key="WarehouseOperator.aId"
              :label="`${WarehouseOperator.aName}(仓库管理员姓名)-${WarehouseOperator.aUsername}(仓库管理员账号)`"
              :value="WarehouseOperator.aId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="厂家名" prop="sfactoryId">
          <el-select
            v-model="priceSlip.sfactoryId" filterable clearable placeholder="请选择厂家" style="width: 500px"
            ref="agentSelect1"
            @hook:mounted="cancelReadOnly"
            @visible-change="cancelReadOnly"
            :filter-method="factoryFilter">
            <el-option
              v-for="factory in factoryList"
              :key="factory.fId"
              :label="factory.fName"
              :value="factory.fId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式" prop="spaymentWay">
          <el-select v-model="priceSlip.spaymentWay" filterable placeholder="请选择">
            <el-option
              v-for="item in spaymentWay"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="snote">
          <el-input v-model="priceSlip.snote" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="saveSalesSlip()">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {commonList} from "@/views/Slips/myApi"
import Cookie from "js-cookie";
import {PostData} from "@/api";
export default {
  created() {
    if(this.$route.query.priceSlip){
      this.priceSlip = Object.assign({}, this.$route.query.priceSlip)
      this.value=this.$route.query.priceSlip.oDeliveryWay
    }
    this.getList()
  },
  data(){
    return{
      //发货方式
      value:'',
      oDeliveryWayList:[],
      optionDeliveryWayList:[],
      factoryList:[],
      totleFactoryList:[],
      priceSlip:{
        sisPayment:0,
        sstatus:0,
        stype:2,
        sorderStatus:0,
        srealIncome:0,
        orderDetailList:[],
        wholeDetailsList:[]
      },
      //客户单位
      spaymentWay:[
        {
          label:'线上',
          value:'1'
        },
        {
          label:'线下',
          value:'2'
        }
      ],
      customerList:[],
      customerNameList:[],
      //仓库管理员
      WarehouseOperatorList:[],
      warehouseNameList:[],
      rules: {
        spaymentWay:[
          {required:true,message:'请选择仓库管理员',trigger:'change'}
        ],
        swarehouseOperaterId:[
          {required:true,message:'请选择仓库管理员',trigger:'change'}
        ],
        sfactoryId: [
          { required: true, message: '请选择客户厂家', trigger: 'change' }
        ]
      }
    }
  },
  methods:{
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
    factoryFilter(query = '') {
      if(query!==''){
        let PinyinMatch = this.$pinyinmatch;
        if (query) {
          let result = [];
          this.totleFactoryList.forEach(i => {
            let m = PinyinMatch.match(i.fName, query);
            if (m) {
              result.push(i);
            }
          });
          if(result.length>20){
            this.factoryList = result.slice(0, 20);
          } else
          {
            this.factoryList=result
          }
        }
      }else {
        this.factoryList=[]
      }
    },
    voluation(){
      this.priceSlip.screateOperatorId=Cookie.get('aId')
      this.priceSlip.sCustomId=0
      // this.buyList.sCustomId=0
    },
    //ipad支持输入框
    cancelReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          const Selects = this.$refs
          if (Selects.agentSelect) {
            const input = Selects.agentSelect.$el.querySelector('.el-input__inner')
            input.removeAttribute('readonly')
          }
          if (Selects.agentSelect1) {
            const input = Selects.agentSelect1.$el.querySelector('.el-input__inner')
            input.removeAttribute('readonly')
          }
        }
      })
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
      // commonList("customer/selectAllByLike").then(res=>{
      //   console.log(res)
      //   this.customerNameList=res.list
      // })
      commonList("factory/selectAllByLike").then(res=>{
        this.totleFactoryList=res.list
        console.log(this.totleFactoryList);
      })
      commonList('admin/selectAllByLike').then(res=>{
        this.WarehouseOperatorList=res.list
      })
    },
    saveSalesSlip(){
      this.$refs['priceSlip'].validate((valid) => {
        if (valid) {
          this.voluation()
          console.log(this.priceSlip);
          PostData('/stock/addStock',this.priceSlip)
            .then(res=>{
              console.log(res.data);
              this.$router.push({
                path: '/stock/goodAdd',
                query:{
                  orderId:res.data,
                  factoryId:this.priceSlip.sfactoryId
                }
              })
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
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
        console.log(this.$refs.searchSelect)
        let input = this.$refs.searchSelect.$children[0].$refs.input;
        input.value = value;
      })
    },
    visibleChange(val){
      if(!val){
        let input = this.$refs.searchSelect.$children[0].$refs.input;
        input.blur();
      }
    }
  }
}
</script>

<style scoped>

</style>
