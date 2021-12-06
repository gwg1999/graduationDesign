<template style="background: white">
  <div>
<!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="place" :model="place" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="产地或品牌名" prop="plName">
            <el-input type="text" v-model="place.plName" style="width: 300px"/>
          </el-form-item>
<!--          <el-form-item label="产地或品牌地址" prop="plAddress">-->
<!--            <el-input v-model="place.plAddress" style="width: 300px"/>-->
<!--          </el-form-item>-->
          <el-form-item label="备注信息" prop="aInformation">
            <el-input v-model="place.plImformation" style="width: 300px" type="textarea"/>
          </el-form-item>
          <!--          <el-form-item label="备用电话2" prop="cuPhoneNumber2">-->
          <!--            <el-input v-model="car.cBrandName" style="width: 300px"/>-->
          <!--          </el-form-item>-->
<!--          <el-form-item label="状态" prop="plIsEnabled">-->
<!--&lt;!&ndash;            <el-input v-model="place.plIsEnabled" style="width: 300px"/>&ndash;&gt;-->
<!--            <el-select v-model="place.plIsEnabled" placeholder="请选择是否启用该产地">-->
<!--              <el-option label="启用" value="1"></el-option>-->
<!--              <el-option label="不启用" value="0"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate" >保存</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="backPre">返回</el-button>
          </el-form-item>
<!--          <el-form-item label="车工厂名" prop="cFactoryName">-->
<!--            <el-input v-model="car.cFactoryName" style="width: 300px"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="车模型ID" prop="cModelId">-->
<!--            <el-input v-model="car.cModelId" style="width: 300px"/>-->
<!--          </el-form-item>-->
        </div>
<!--        <div style="width: 50%;float: right">-->
<!--&lt;!&ndash;          <el-form-item label="车模型名" prop="cModelName">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input type="text" disabled v-model="car.cModelName" style="width: 300px"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-form-item label="车价格" prop="cPrice">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input v-model="car.cPrice" style="width: 300px"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-form-item label="车状态" prop="cStatus">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input v-model="car.cStatus" style="width: 300px"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-form-item label="车类型ID" prop="cTypeId">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input v-model="car.cTypeId" style="width: 300px"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-form-item label="车模型名" prop="cTypeName">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input v-model="car.cTypeName" style="width: 300px"/>&ndash;&gt;-->
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
      place: {},
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      placeQuery: {
        plId: 0,
        pageNum: 0,
        pageSize: 0,
      },
      rules: {
        plName:[
          {required: true, message: "请输入产地名", trigger: "blur"}
        ]
      },

      parts: {},

    }

  },
  //路由监听  路由切换问题
  created() {
    this.placeQuery.plId = localStorage.getItem('plId')
    this.getList()
  },
  methods: {
    backPre(){
      this.$router.back()
    },//返回上一页
    getList() {
      PostData('place/selectOne',this.placeQuery)
        .then(res=>{
          this.place = res
        })
    },
    saveOrUpdate(){
      PostData('place/update',this.place)
        .then(res=>{
          console.log(res);
          this.$message({
            type:'success',
            message:'保存信息成功'
          })
        })
      this.$router.push({path:'/maintain/place'})
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
