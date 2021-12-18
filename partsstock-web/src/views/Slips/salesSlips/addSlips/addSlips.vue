<template>
  <div class="app-container">
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写报价单信息" />
      <el-step title="添加零件或整件" />
    </el-steps>
    <div>
      <div class="app-container">
        <el-form label-width="120px" :rules="rules" :model="salesSlip" ref="salesSlip" >
          <el-form-item label="客户单位" prop="qCustomerId" style="width: 500px">
            <el-select
              v-model="salesSlip.qCustomerId" filterable clearable placeholder="请选择客户单位"
              :filter-method="userFilter" style="width: 500px">
              <el-option
                v-for="customer in customerList"
                :key="customer.cuId"
                :label="`${customer.cuUnitName}(客户姓名)-${customer.cuPhoneNumber}(客户电话)-${customer.cuAddress}(客户地址)`"
                :value="customer.cuId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="salesSlip.qNote" style="width: 90%" rows="5" type="textarea"/>
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
  data() {
    return {
      salesSlip:{
        quotationDetailList:[],
        wholeDetailsList:[]
      },
      customerList:[],
      customerNameList:[],
      rules:{
        qCustomerId: [
          { required: true, message: '请选择客户单位', trigger: 'change' }
        ]
      }
    };
  },

  created() {
    this.getList()
    if(this.$route.query.salesSlip){
      this.salesSlip = Object.assign({}, this.$route.query.salesSlip)
    }
  },
  methods: {
    userFilter(query = '') {
      let arr = this.customerNameList.filter((item) => {
        return item.cuUnitName.includes(query)
      })
      if (arr.length > 50) {
        this.customerList = arr.slice(0, 50)
      } else {
        this.customerList = arr
      }
    },
    getList(){
      commonList("customer/selectAllByLike").then(res=>{
        this.customerNameList=res.list
      })
    },
    saveSalesSlip() {
      this.$refs['salesSlip'].validate((valid) => {
        if (valid) {
          this.$router.push({
            path: '/Slips/addSlipsGoods',
            query:{
              salesSlips:this.salesSlip
            }
          });
        }
      })
    }
  }
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
