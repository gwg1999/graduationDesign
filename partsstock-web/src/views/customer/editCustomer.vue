<template style="background: white">
  <div>
<!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="customer" :model="customer" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="单位名称" prop="cuUnitName">
            <el-input type="text" disabled v-model="customer.cuUnitName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="备用电话1" prop="cuPhoneNumber1">
            <el-input v-model="customer.cuPhoneNumber1" style="width: 300px"s/>
          </el-form-item>
          <el-form-item label="备用电话2" prop="cuPhoneNumber2">
            <el-input v-model="customer.cuPhoneNumber2" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="客户地址" prop="cuAddress">
            <el-input v-model="customer.cuAddress" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="银行卡账号" prop="cuAccount">
            <el-input v-model="customer.cuAccount" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="开户行" prop="cuBankName">
            <el-input v-model="customer.cuBankName" style="width: 300px"/>
          </el-form-item>
        </div>
        <div style="width: 50%;float: right">
          <el-form-item label="税号" prop="cuTaxNumber">
            <el-input type="text" disabled v-model="customer.cuTaxNumber" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="默认物流" prop="cuCourier">
            <el-input v-model="customer.cuCourier" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="备用物流" prop="cuSpareCourier">
            <el-input v-model="customer.cuSpareCourier" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="默认折扣" prop="cuDiscount">
<!--            <el-input v-model="customer.cuDiscount" style="width: 300px"/>-->
            <el-select v-model="customer.cuDiscount" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认支付方式" prop="cuDefaultPayment">
<!--            <el-input v-model="customer.cuDefaultPayment" style="width: 300px"/>-->
            <el-select v-model="customer.cuDefaultPayment" placeholder="请选择默认支付方式">
              <el-option label="微信" :value="0"></el-option>
              <el-option label="支付宝" :value="1"></el-option>
              <el-option label="信用卡" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户权限" prop="cuPermission">
            <el-select v-model="customer.cuPermission" placeholder="请选择用户权限">
              <el-option label="进货员" :value="0"></el-option>
              <el-option label="销售员" :value="1"></el-option>
              <el-option label="进货销售员" :value="2"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="联系人姓名" prop="cuName">-->
<!--            <el-input v-model="customer.cuName" style="width: 300px"/>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('customer')" >保存</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="backPre">返回</el-button>
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
      customer: {},
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      customerQuery: {
        cuId: 0,
        pageNum: 0,
        pageSize: 0,
      },
      options: [{
        value: '一级价格',
        label: '一级价格'
      }, {
        value: '二级价格',
        label: '二级价格'
      }, {
        value: '三级价格',
        label: '三级价格'
      }
      ],
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
        // cuName: [
        //   {required: true, message: "请输入联系人姓名", trigger: "blur"},
        // ],
        cuPermission: [
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

      parts: {},

    }

  },
  //路由监听  路由切换问题
  created() {
    this.customerQuery.cuId = localStorage.getItem('cuId')
    this.getList()
  },
  methods: {
    backPre(){
      this.$router.back()
    },//返回上一页
    getList() {
      PostData('customer/selectOne',this.customerQuery)
        .then(res=>{
          this.customer = res
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/customer/update',this.customer)
            .then(res=>{
              console.log(res);
              this.$message({
                type:'success',
                message:'修改用户成功'
              })
              this.$router.push({path:'/maintain/customer'})
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
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
