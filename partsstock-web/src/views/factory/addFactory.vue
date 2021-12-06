<template>
  <div>
<!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="factory" :model="factory" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="厂家名" prop="fName">
            <el-input v-model="factory.fName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="厂家地址" prop="fAddress">
            <el-input v-model="factory.fAddress" style="width: 300px"s/>
          </el-form-item>
          <el-form-item label="负责人" prop="fPersonName">
            <el-input v-model="factory.fPersonName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="负责人电话" prop="fPhoneNumber">
            <el-input v-model="factory.fPhoneNumber" style="width: 300px"/>
          </el-form-item>
<!--          <el-form-item label="状态" prop="fIsEnabled">-->
<!--&lt;!&ndash;            <el-input v-model="factory.fIsEnabled" style="width: 300px"/>&ndash;&gt;-->
<!--            <el-select v-model="factory.fIsEnabled" placeholder="请选择是否启用该厂商">-->
<!--              <el-option label="启用" value="1"></el-option>-->
<!--              <el-option label="不启用" value="0"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="备注信息" prop="aInformation">
            <el-input v-model="factory.fInformation" style="width: 300px" type="textarea"/>
          </el-form-item>
<!--          <el-form-item label="车模型名" prop="cModelName">-->
<!--            <el-input v-model="factory.cModelName" style="width: 300px"/>-->
<!--          </el-form-item>-->
        </div>
        <div style="width: 50%;float: right">
<!--          <el-form-item label="车价格" prop="cPrice">-->
<!--            <el-input v-model="car.cPrice" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车状态" prop="cStatus">-->
<!--            <el-input v-model="car.cStatus" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车类型ID" prop="cTypeId">-->
<!--            <el-input v-model="car.cTypeId" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车类型名" prop="cTypeName">-->
<!--            <el-input v-model="car.cTypeName" style="width: 300px"/>-->
<!--          </el-form-item>-->
          <el-form-item style="position: absolute; right: 30%;bottom: 5%">
            <el-button :disabled="saveBtnDisabled" type="primary" @click="save" >保存</el-button>
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
    // let validatepName = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请填写正确车品牌名'));
    //   }
    // }
    // let validatepUnit = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请填写正确车工厂名'));
    //   }
    // };
    return {
      factory: {},
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
      rules:{
        fName:[
          {required: true, message: "请输入工厂名", trigger: "blur"}
        ],
        fPhoneNumber:[
          {required: true, pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ]
      }
      // rules: {
      //   cBrandName: [
      //     {required: true, message: "请输入车品牌名", trigger: "blur"},
      //     {validator: validatepName, trigger: 'blur'}
      //   ],
      //   cBrandId: [
      //     {required: true, message: "请输入正确的车品牌ID", trigger: "blur"},
      //     {required: true, pattern: /^[A-Za-z0-9]+$/, message: '车品牌ID为字母和数字',trigger: 'blur'}///
      //   ],
      //   cFactoryId: [
      //     {required: true, message: "请输入正确的厂家ID", trigger: "blur"},
      //     {required: true, pattern: /^[A-Za-z0-9]+$/, message: '厂家ID为字母和数字',trigger: 'blur'}///
      //   ],
      //   cFactoryName: [
      //     {required: true, message: "请输入车工厂名", trigger: "blur"},
      //     {validator: validatepUnit, trigger: 'blur'},
      //
      //   ],
      //   pHighLimit: [
      //     {required: true, message: "请输入零件上限数目", trigger: "blur"},
      //     {required: true, pattern: /[0-9]+$/,message: '上限数目为数字',trigger: "blur"},
      //
      //   ],
      //   pLowLimit: [
      //     {required: true, message: "请输入零件下限数目", trigger: "blur"},
      //     {required: true, pattern: /[0-9]+$/,message: '下限数目为数字',trigger: "blur"},
      //
      //   ],// /^[0-9]+\.[0-9]{2}$/
      //   pWholesalePrice:[
      //     {required: true, message: "请输入批发价", trigger: "blur"},
      //     {required: true, pattern: /^[0-9]+\.[0-9]{2}$/,message: '批发价为小数',trigger: "blur"},
      //   ],
      //   pRetailPrice:[
      //     {required: true, message: "请输入零售价", trigger: "blur"},
      //     {required: true, pattern: /^[0-9]+\.[0-9]{2}$/,message: '零售价为小数',trigger: "blur"},
      //   ],
      //   pFloorPrice:[
      //     {required: true, message: "请输入低价", trigger: "blur"},
      //     {required: true, pattern: /^[0-9]+\.[0-9]{2}$/,message: '低价为小数',trigger: "blur"},
      //   ],
      //   pRealInventory:[
      //     {required: true, message: "请输入实际库存数", trigger: "blur"},
      //     {required: true, pattern: /[0-9]+$/,message: '实际库存数为小数',trigger: "blur"},
      //   ],
      //   pGoodsNum: [
      //     {required: true, message: "请输入货物编码", trigger: "blur"},
      //     {required: true, pattern: /[0-9]+$/,message: '实际库存数为小数',trigger: "blur"},
      //   ],
      //   pReturnCycle:[
      //     {required: true, message: "请输入实际库存数", trigger: "blur"},
      //     {required: true, pattern: /[0-9]+$/,message: '实际库存数为小数',trigger: "blur"},
      //   ]
      // },
    }
  },
  created() {
  },
  methods: {
    save(){
      PostData('factory/insert',this.factory)
        .then(res=>{
          console.log(res);
          this.$message({
            type:'success',
            message:'添加工厂成功'
          })
        }).catch(()=>{})
      this.$router.push({path:'/maintain/factory'})
    }
  }
}
</script>

<style>
body{
  background: white;
}

</style>
