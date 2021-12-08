<template>
  <div class="app-container">
    <h2 style="text-align: center;">添加报价单</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写报价单信息" />
      <el-step title="添加零件或整件" />
      <!--      <el-step title="提交审核" />-->
    </el-steps>
    <div>
      <div class="app-container">
        <el-form label-width="120px" :rules="rules" :model="salesSlip" ref="salesSlip" >
          <el-form-item label="客户单位" prop="qCustomerId">
            <el-select
              v-model="salesSlip.qCustomerId" filterable placeholder="请选择客户单位">
              <el-option
                v-for="customer in customerNameList"
                :key="customer.cuId"
                :label="customer.cuUnitName"
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
