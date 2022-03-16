<template>
  <div class="app-container">
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写报价单信息" />
      <el-step title="添加零件或整件" />
    </el-steps>
    <div>
      <div class="app-container">
        <el-form label-width="120px" :rules="rules" :model="salesSlip" ref="salesSlip" >
          <el-form-item label="客户单位" prop="qCustomerId" style="width: 650px">
            <el-select
              v-model="salesSlip.qCustomerId" filterable clearable placeholder="请选择客户单位"
              ref="agentSelect"
              :filter-method="userFilter" style="width: 640px"
              @hook:mounted="cancalReadOnly"
              @visible-change="cancalReadOnly">
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
      //深拷贝中的浅拷
      this.salesSlip = Object.assign({}, this.$route.query.salesSlip)
    }
  },
  methods: {
    cancalReadOnly(onOff) {
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
    //客户单位模糊查询
    userFilter(query = '') {
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
