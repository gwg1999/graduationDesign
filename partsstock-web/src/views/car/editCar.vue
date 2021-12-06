<template style="background: white">
  <div>
<!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="car" :model="car" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
<!--          <el-form-item label="车品牌ID" prop="cBrandId">-->
<!--            <el-input type="text" disabled v-model="car.cBrandId" style="width: 300px"/>-->
<!--          </el-form-item>-->
          <el-form-item label="车品牌名" prop="cBrandName">
            <el-input v-model="car.cBrandName" style="width: 300px"s/>
          </el-form-item>
          <el-form-item label="车模型名" prop="cModelName">
            <el-input type="text" v-model="car.cModelName" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="车类型名" prop="cTypeName">
            <el-input v-model="car.cTypeName" style="width: 300px"/>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('car')" >保存</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="backPre">返回</el-button>
          </el-form-item>
<!--          <el-form-item label="备用电话2" prop="cuPhoneNumber2">-->
<!--            <el-input v-model="car.cBrandName" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车工厂ID" prop="cFactoryId">-->
<!--            <el-input v-model="car.cFactoryId" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车工厂名" prop="cFactoryName">-->
<!--            <el-input v-model="car.cFactoryName" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车模型ID" prop="cModelId">-->
<!--            <el-input v-model="car.cModelId" style="width: 300px"/>-->
<!--          </el-form-item>-->
        </div>
<!--        <div style="width: 50%;float: right">-->
<!--          -->
<!--&lt;!&ndash;          <el-form-item label="车价格" prop="cPrice">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input v-model="car.cPrice" style="width: 300px"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-form-item label="车状态" prop="cStatus">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input v-model="car.cStatus" style="width: 300px"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-form-item label="车类型ID" prop="cTypeId">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input v-model="car.cTypeId" style="width: 300px"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--          -->
<!--        </div>-->
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
      car: {},
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      carQuery: {
        cId: 0,
        pageNum: 0,
        pageSize: 0,
      },

      parts: {},
      rules: {
        cTypeName:[
          {required: true, message: "请输入车类型名", trigger: "blur"}
        ]
      }

    }

  },
  //路由监听  路由切换问题
  created() {
    this.carQuery.cId = localStorage.getItem('cId')
    this.getList()
  },
  methods: {
    backPre(){
      this.$router.back()
    },//返回上一页
    getList() {
      PostData('car/selectOne',this.carQuery)
        .then(res=>{
          this.car = res
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/car/update',this.car)
            .then(res=>{
              console.log(res);
              this.$message({
                type:'success',
                message:'修改车型成功'
              })
              this.$router.push('/maintain/car')
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
