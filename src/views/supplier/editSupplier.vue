<template style="background: white">
  <div>
<!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 100%;position: absolute;left: 200px;top: 60px" >
      <el-form  ref="supplier" :model="supplier" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="供货商名" prop="sName">
            <el-input type="text" v-model="supplier.sName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="供货商地址" prop="sAddress">
            <el-input v-model="supplier.sAddress" style="width: 300px"/>
          </el-form-item>
          <!--          <el-form-item label="备用电话2" prop="cuPhoneNumber2">-->
          <!--            <el-input v-model="car.cBrandName" style="width: 300px"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="负责人" prop="sPersonName">
            <el-input v-model="supplier.sPersonName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="供货商电话" prop="sTelephone">
            <el-input v-model="supplier.sTelephone" style="width: 300px"/>
          </el-form-item>
<!--          <el-form-item label="状态" prop="sIsEnabled">-->
<!--&lt;!&ndash;            <el-input v-model="supplier.sIsEnabled" style="width: 300px"/>&ndash;&gt;-->
<!--            <el-select v-model="supplier.sIsEnabled" placeholder="请选择是否启用该供应商">-->
<!--              <el-option label="启用" value="1"></el-option>-->
<!--              <el-option label="不启用" value="0"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="备注信息" prop="aInformation">
            <el-input v-model="supplier.sInformation" style="width: 300px" type="textarea"/>
          </el-form-item>
        </div>
        <div style="width:50%;position: absolute;right: 20%;bottom: 5%">
<!--          <el-form-item label="车模型名" prop="cModelName">-->
<!--            <el-input type="text" disabled v-model="car.cModelName" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车价格" prop="cPrice">-->
<!--            <el-input v-model="car.cPrice" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车状态" prop="cStatus">-->
<!--            <el-input v-model="car.cStatus" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车类型ID" prop="cTypeId">-->
<!--            <el-input v-model="car.cTypeId" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车模型名" prop="cTypeName">-->
<!--            <el-input v-model="car.cTypeName" style="width: 300px"/>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('supplier')" >保存</el-button>
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

export default {
  components:{
    ImageCropper,
    PanThumb
  },
  data() {

    return {
      supplier: {},
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      supplierQuery: {
        sId: 0,
        pageNum: 0,
        pageSize: 0,
      },

      parts: {},
      rules:{
        sName:[
          {required: true, message: "请输入供货商名", trigger: "blur"}
        ],
        sTelephone:[
          {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ]
      }

    }

  },
  //路由监听  路由切换问题
  created() {
    this.supplierQuery.sId = localStorage.getItem('sId')
    this.getList()
  },
  methods: {
    backPre(){
      this.$router.back()
    },//返回上一页
    getList() {
      PostData('supplier/selectOne',this.supplierQuery)
        .then(res=>{
          this.supplier = res
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/supplier/update',this.supplier)
            .then(res=>{
              this.$message({
                type:'success',
                message:'修改供货商成功'
              })
              this.$router.push('/maintain/supplier')
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
