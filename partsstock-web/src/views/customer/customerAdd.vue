<template>
  <div>
<!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 20px">
      <el-form  ref="customer" :model="customer" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="单位名称" prop="cuUnitName">
            <el-input v-model="customer.cuUnitName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="电话号码" prop="cuPhoneNumber">
            <el-input v-model="customer.cuPhoneNumber" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="备用电话1" prop="cuPhoneNumber1">
            <el-input v-model="customer.cuPhoneNumber1" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="备用电话2" prop="cuPhoneNumber2">
            <el-input v-model="customer.cuPhoneNumber2" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="用户密码" prop="cuPassword">
            <el-input v-model="customer.cuPassword" show-password style="width: 300px"/>
          </el-form-item>
          <el-form-item label="客户地址" prop="cuAddress">
            <el-input v-model="customer.cuAddress" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="银行卡账号" prop="cuAccount">
            <el-input v-model="customer.cuAccount" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="联系人名称" prop="cuPersonId">
            <el-input v-model="customer.cuPersonId" style="width: 300px"/>
          </el-form-item>
        </div>
        <div style="width: 50%;float: right">
          <el-form-item label="开户行" prop="cuBankName">
            <el-input v-model="customer.cuBankName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="税号" prop="cuTaxNumber">
            <el-input v-model="customer.cuTaxNumber" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="默认物流" prop="cuCourier">
            <el-input v-model="customer.cuCourier" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="备用物流" prop="cuSpareCourier">
            <el-input v-model="customer.cuSpareCourier" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="默认折扣" prop="cuDiscount">
            <el-select v-model="customer.cuDiscount" style="width: 230px" placeholder="请选择折扣">
              <el-option value="一级价格">一级价格</el-option>
              <el-option value="二级价格">二级价格</el-option>
              <el-option value="三级价格">三级价格</el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="默认折扣" prop="cuDiscount">-->
<!--&lt;!&ndash;            <el-input v-model="customer.cuDiscount" style="width: 300px"/>&ndash;&gt;-->
<!--            <el-select v-model="customer.cuDiscount">-->
<!--              <option value="" label="一级价格"></option>-->
<!--              <option value="" label="二级价格"></option>-->
<!--              <option value="" label="三级价格"></option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="默认支付方式" prop="cuDefaultPayment">
<!--            <el-input v-model="customer.cuDefaultPayment" style="width: 300px"/>-->
            <el-select v-model="customer.cuDefaultPayment" placeholder="请选择默认支付方式">
              <el-option label="微信" :value="0"></el-option>
              <el-option label="支付宝" :value="1"></el-option>
              <el-option label="信用卡" :value="2"></el-option>
            </el-select>
          </el-form-item >
          <el-form-item label="用户权限" prop="cuPermission">
            <!--            <el-input v-model="admin.aPermission" style="width: 300px"/>-->
            <el-select v-model="customer.cuPermission" placeholder="请选择用户权限">
              <el-option label="进货员" :value="0"></el-option>
              <el-option label="销售员" :value="1"></el-option>
              <el-option label="进货销售员" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('customer')" >保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import {PostData} from "@/api";
export default {
  components:{
    ImageCropper,
    PanThumb
  },
  data() {
    return {
      customer: {},
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      customerQuery:{
        pageSize: 10,
        pageNum: 1,
        plName:''
      },
      query:{
        pageSize: 10,
        pageNum: 1
      },
      rules: {
        cuUnitName: [
          {required: true, message: "请输入单位名", trigger: "blur"},
        ],
        cuPhoneNumber: [
          {required: true, message: "请输入电话号码", trigger: "blur"},
          {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ],
        // cuPhoneNumber1: [
        //   {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        // ],
        // cuPhoneNumber2: [
        //   {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        // ],
        cuPassword: [
          {required: true, message: "请输入用户密码", trigger: "blur"},
        ],
        cuName: [
          {required: true, message: "请输入联系人姓名", trigger: "blur"},
        ],
        cuPermission: [
          {required: true, message: "请输入用户权限", trigger: "blur"},
        ],
        cuPersonId:[
          {required: true, message: "请输入用户权限", trigger: "blur"},
        ],
        cuCourier: [
          {required: true, message: "请输入默认物流", trigger: "blur"},
        ],
        cuDiscount: [
          {required: true, message: "请输入默认折扣", trigger: "blur"},
        ],
        cuDefaultPayment: [
          {required: true, message: "请输入默认支付方式", trigger: "blur"},
        ],
        cuAddress: [
          {required: true, message: "请输入客户地址", trigger: "blur"},
        ],
        cuAccount:[
          {required: true, pattern: /^([1-9]{1})(\d{14}|\d{18})$/,message: '银行卡号不正确',trigger: "blur"}
        ]
      },
    }
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('customer/insert',this.customer)
            .then(res=>{
              console.log(res);
              this.$message({
                type:'success',
                message:'添加用户成功'
              })
              this.$router.push({path:'/maintain/customer'})
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    },
  }
}
</script>

<style>
body{
  background: white;
}

</style>
