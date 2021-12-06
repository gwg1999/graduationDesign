<template style="background: white">
  <div>
<!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="factory" :model="factory" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="厂家名称" prop="fName">
            <el-input type="text" v-model="factory.fName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="厂家地址" prop="fAddress">
            <el-input v-model="factory.fAddress" style="width: 300px"/>
          </el-form-item>
          <!--          <el-form-item label="备用电话2" prop="cuPhoneNumber2">-->
          <!--            <el-input v-model="car.cBrandName" style="width: 300px"/>-->
          <!--          </el-form-item>-->
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
        </div>
        <div style="width: 50%;float: right">
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
          <el-form-item style="position: absolute; right: 30%;bottom: 5%">
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('factory')" >保存</el-button>
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
      factory: {},
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      factoryQuery: {
        fId: 0,
        pageNum: 0,
        pageSize: 0,
      },
      rules:{
        fName:[
          {required: true, message: "请输入工厂名", trigger: "blur"}
        ],
        fPhoneNumber:[
          {required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '手机号码格式不正确',trigger: "blur"}
        ]
      },

      parts: {},

    }

  },
  //路由监听  路由切换问题
  created() {
    this.factoryQuery.fId = localStorage.getItem('fId')
    this.getList()
  },
  methods: {
    backPre(){
      this.$router.back()
    },//返回上一页
    getList() {
      PostData('factory/selectOne',this.factoryQuery)
        .then(res=>{
          this.factory = res
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('factory/update',this.factory)
            .then(res=>{
              console.log(res);
              this.$message({
                type:'success',
                message:'修改工厂成功'
              })
              this.$router.push('/maintain/factory')
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
