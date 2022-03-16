<template>
  <div class="app-container">
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写询价单信息" />
      <el-step title="添加零件" />
    </el-steps>
    <div>
      <div class="app-container">
        <el-form label-width="120px" :rules="rules" :model="inPrice" ref="salesSlip" >
          <el-form-item label="客户单位" prop="indCustomerId" style="width: 650px">
            <el-select
              v-model="inPrice.indCustomerId" filterable clearable placeholder="请选择客户单位" style="width: 640px" :filter-method="userFilter">
              <el-option
                v-for="customer in customerList"
                :key="customer.cuId"
                :label="`${customer.cuUnitName}(客户姓名)-${customer.cuPhoneNumber}(客户电话)-${customer.cuAddress}(客户地址)`"
                :value="customer.cuId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="厂家名" prop="factoryId">
            <el-select
              v-model="inPrice.factoryId" filterable clearable placeholder="请选择厂家" style="width: 640px" :filter-method="factoryFilter">
              <el-option
                v-for="factory in factoryList"
                :key="factory.fId"
                :label="factory.fName"
                :value="factory.fId"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSalesSlip()">添加零件</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {commonList} from "@/views/Slips/myApi";

export default {
  name: "stockAdd",
  data(){
    return{
      inPrice:{},
      totleCustomerList:[],
      customerList:[],
      factoryList:[],
      totleFactoryList:[],
      rules:{
        indCustomerId: [
          { required: true, message: '请选择客户单位', trigger: 'change' }
        ],
        factoryId: [
          { required: true, message: '请选择客户厂家', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //客户单位模糊查询
    userFilter(query = '') {
      if(query!==''){
        let PinyinMatch = this.$pinyinmatch;
        if (query) {
          let result = [];
          this.totleCustomerList.forEach(i => {
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
    getList(){
      commonList("customer/selectAllByLike").then(res=>{
        this.totleCustomerList=res.list
      })
      commonList("factory/selectAllByLike").then(res=>{
        this.totleFactoryList=res.list
      })
    },
    saveSalesSlip() {
      this.$refs['salesSlip'].validate((valid) => {
        if (valid) {
          this.$router.push({
            path: '/goodAdd',
            query:{
              inPrice:this.inPrice
            }
          });
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
