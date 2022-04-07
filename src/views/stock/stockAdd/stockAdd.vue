<template>
  <div class="app-container">
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写询价单信息" />
      <el-step title="添加零件" />
    </el-steps>
    <div>
      <div class="app-container">
        <el-form label-width="120px" :rules="rules" :model="inPrice" ref="salesSlip" >
<!--          <el-form-item label="客户单位" prop="indCustomerId" style="width: 650px">-->
<!--            <el-select-->
<!--              v-model="inPrice.indCustomerId" filterable clearable placeholder="请选择客户单位" style="width: 640px" :filter-method="userFilter">-->
<!--              <el-option-->
<!--                v-for="customer in customerList"-->
<!--                :key="customer.cuId"-->
<!--                :label="`${customer.cuUnitName}(客户姓名)-${customer.cuPhoneNumber}(客户电话)-${customer.cuAddress}(客户地址)`"-->
<!--                :value="customer.cuId"/>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="厂家名" prop="factoryId">
<!--            <el-input v-model="salesSlip.qNote" style="width: 90%" rows="5" type="textarea"/>-->
            <el-select
              v-model="inPrice.factoryId" filterable clearable placeholder="请选择厂家" style="width: 640px"
              ref="agentSelect"
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
          <el-form-item label="供货周期" prop="indDeliveryCycle">
            <el-select  v-model="inPrice.indDeliveryCycle" style="margin-left: 3px;width: 300px"  placeholder="请选择供货周期" clearable>
              <el-option v-for="item in cycleList"  :key="item.rcId" :label="`${item.rcAmount}${item.rcType}`" :value="item.rcAmount" ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="inPrice.iNote" style="width: 90%"  rows="5" type="textarea"/>
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
import {PostData} from "@/api";

export default {
  name: "stockAdd",
  data(){
    return{
      inPrice:{},
      cycleList:[],
      totleCustomerList:[],
      customerList:[],
      factoryList:[],
      totleFactoryList:[],
      rules:{
        factoryId: [
          { required: true, message: '请选择客户厂家', trigger: 'change' }
        ],
        indDeliveryCycle:[
          { required: true, message: '请选择供货周期', trigger: 'change' }
        ],
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
    cancelReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          const Selects = this.$refs
          if (Selects.agentSelect) {
            const input = Selects.agentSelect.$el.querySelector('.el-input__inner')
            input.removeAttribute('readonly')
          }
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
    getList(){
      commonList("customer/selectAllByLike").then(res=>{
        this.totleCustomerList=res.list
        console.log(this.totleCustomerList);
      })
      commonList("factory/selectAllByLike").then(res=>{
        this.totleFactoryList=res.list
        console.log(this.totleFactoryList);
      })
      PostData('returnCycle/selectAll',{pageNum:1,pageSize:10}).then(res=>{
        this.cycleList=res.list
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
