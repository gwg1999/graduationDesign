<template style="background: white">
  <div>
    <!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="oder" :model="order" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="支付订单号" prop="sOrderNumber">
            <el-input v-model="order.sOrderNumber" style="width: 300px" disabled/>
          </el-form-item>
          <el-form-item label="操作员" prop="adminName">
            <el-input v-model="order.adminName" style="width: 300px" disabled/>
          </el-form-item>
          <el-form-item label="应收价" prop="sPrice">
            <el-input v-model="order.sPrice" style="width: 300px" disabled/>
          </el-form-item>
          <el-form-item label="实收价" prop="sRealIncome">
            <el-input v-model="order.sRealIncome" style="width: 300px"/>
          </el-form-item>
        </div>
        <div style="width: 50%;float: right">
          <el-form-item label="是否已支付" prop="sIsPayment">
            <el-select v-model="order.sIsPayment" placeholder="选择订单状态">
              <el-option label="未支付" :value="0"></el-option>
              <el-option label="已支付" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="进货单类型" prop="sType">
            <el-select v-model="order.sType" placeholder="选择订单状态">
              <el-option label="部分退货" :value="0"></el-option>
              <el-option label="全部退货" :value="1"></el-option>
              <el-option label="普通进货单" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态" prop="sOrderStatus">
            <el-select v-model="order.sOrderStatus" placeholder="选择订单状态">
              <el-option label="未发货" :value="0"></el-option>
              <el-option label="部分发货" :value="1"></el-option>
              <el-option label="全部发货" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="用户ID" prop="aId">-->
          <!--            <el-input v-model="admin.aId" style="width: 300px"s/>-->
          <!--          </el-form-item>-->
          <el-form-item label="备注" prop="INote">
            <el-input  v-model="order.iNote" style="width: 300px" type="textarea"/>
          </el-form-item>
          <!--          <el-form-item label="用户密码" prop="aPassword">-->
          <!--            <el-input v-model="admin.aPassword" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="二级密码" prop="aSecondaryPassword">-->
          <!--            <el-input v-model="admin.aSecondaryPassword" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('oder')" >保存</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="backPre">返回</el-button>
<!--            <el-button @click="show">显示</el-button>-->
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>


import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import {PostData} from "../../api/index"
import qs from 'qs'

export default {
  components:{
    ImageCropper,
    PanThumb
  },
  data() {

    return {
      order: {
      }
    }

  },
  //路由监听  路由切换问题
  created() {
    this.getList()
  },
  methods: {
    backPre(){
      this.$router.back()
    },//返回上一页
    getList() {
      this.order=JSON.parse(this.$route.query.oneOrder)
      console.log(this.order);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/stock/updateStock',this.order)
            .then(res=>{
              this.$message({
                type:'success',
                message:'修改进货单成功'
              })
              this.$router.push({path:'/stock/buy'})
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    },
    show(){
      console.log(this.oder);
    }
  }
}
</script>

<style>
body{
  background: white;
}
.content{
  width: 20%;
  height: 20%;
  vertical-align: center;
}
</style>
