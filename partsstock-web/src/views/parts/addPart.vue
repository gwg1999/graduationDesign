<template>
  <div>
<!--    <div style="width: 30%;height:30%;float: left">-->
<!--      <img src="@/assets/404_images/404.png" width="100%" alt="图片无法显示" style="margin-top: 200px">-->
<!--    </div>-->
<!--    <h3>{{inPicturePar}}</h3>-->
    <el-dialog
      title="图片上传"
      :visible.sync="upLoadDialog"
      width="70%"
      top="3%"
      :before-close="handleClose">
<!--      <span>这是一段信息</span>-->
      <h3>内部图片</h3>
      <el-upload
        ref="inUpload"
        :action="baseURL+'/upload/image?'+inPicturePar"
        accept="image/png,image/gif,image/jpg,image/jpeg"
        list-type="picture-card"
        :limit=limitNum
        :auto-upload="false"
        :before-upload="handleBeforeUpload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只支持格式为png,gif,jpg,jpeg的图片,且小于2MB</div>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

      </el-upload>
      <h3>外部图片</h3>
      <el-upload
        ref="outUpload"
        :action="baseURL+'/upload/image?'+outPicturePar"
        accept="image/png,image/gif,image/jpg,image/jpeg"
        list-type="picture-card"
        :limit=limitNum
        :auto-upload="false"
        :before-upload="handleBeforeUpload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只支持格式为png,gif,jpg,jpeg的图片,且小于2MB</div>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-upload>
      <span slot="footer" class="dialog-footer">
    <el-button @click="noUpLoad">不上传图片</el-button>
    <el-button type="primary" @click="confirmUp">上传图片</el-button>
  </span>
    </el-dialog>
  <div class="app-container">
    <el-form  ref="partsa" :model="parts" label-width="120px" :rules="rules">
      <div style="width: 40%;float: left">
        <el-form-item label="零件类目" prop="pCategoryId">
          <el-cascader
            ref="pCatCascader"
            :options="categoryOption"
            :props="{value:'name', label:'name'}"
            @change="handlePcateChange(pCategoryList)"
            :show-all-levels="false"
            v-model="pCategoryList"
            clearable>
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="零件名称" prop="pName" v-if="parts.pName!==''">
          <el-input v-model="parts.pName" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="零件号" prop="pNumber">
          <el-input v-model="parts.pNumber" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="一级价格" prop="pLowPrice">
          <el-input v-model="parts.pLowPrice" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="二级价格" prop="pMiddlePrice">
          <el-input v-model="parts.pMiddlePrice" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="三级价格" prop="pHighPrice">
          <el-input v-model="parts.pHighPrice" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="进价" prop="pBuyingPrice">
          <el-input v-model="parts.pBuyingPrice" style="width: 400px"/>
        </el-form-item>

        <el-form-item label="上限" prop="pHighLimit">
          <el-input v-model="parts.pHighLimit" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="下限" prop="pLowLimit">
          <el-input v-model="parts.pLowLimit" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="实际库存数" prop="pRealInventory">
          <el-input v-model="parts.pRealInventory" style="width: 400px"/>
        </el-form-item>
      </div>
      <div style="width: 50%;float: right">
        <el-form-item label="货物位置" prop="positions">
          <el-cascader
            ref="cascader"
            :options="positionList"
            :props="{ multiple: true, checkStrictly: true, value:'name', label:'name'}"
            @change="getNode"
            v-model="showDetail"
            clearable>
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>



        <el-form-item label="产地或品牌" prop="pPlaceId">
          <el-select
            v-model="parts.pPlaceId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入产地或品牌"
            :remote-method="remotePlace"
            :loading="loading"
             @focus="getPlace">
            <el-option
              v-for="item in placeList"
              :key="item.plId"
              :label="item.plName"
              :value="item.plId">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="单位" prop="pUnitId">
          <el-select
            v-model="parts.pUnitId"
            placeholder="请输入单位">
            <el-option
              v-for="item in unitList"
              :key="item.uId"
              :label="item.uName"
              :value="item.uId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="零件尺寸" prop="pPartsSizeType">
          <el-select v-model="parts.pPartsSizeType" style="width: 400px" placeholder="请选择零件大小">
            <el-option label="小" value="1"></el-option>
            <el-option label="大" value="0"></el-option>
          </el-select>
        </el-form-item>
<!--        v-model="parts.factory.fName"-->
        <el-form-item label="厂家" prop="pFactoryId">
          <el-select
            v-model="parts.pFactoryId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入厂家"
            :remote-method="remoteFactory"
            :loading="loading"
            @focus="getFactory">
            <el-option
              v-for="item in factoryList"
              :key="item.fId"
              :label="item.fName"
              :value="item.fId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型号" prop="pCarName">
          <el-cascader
            ref="carCascader"
            :options="options"
            :props="{value:'name', label:'name'}"
            @change="handleChange(carList)"
            :show-all-levels="false"
            v-model="carList"
            clearable>
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>

        </el-form-item>
<!--        <el-form-item label="供货商" prop="pSupplierId">-->
<!--          <el-select v-model="parts.pSupplierId" style="width: 400px" placeholder="请选择供货商" @click="getSupplierList">-->
<!--            <div class="el-input" style="width:90%;margin-left:5%;">-->
<!--              <input type="text" placeholder="请输入供货商名" style="width: 100%" class="el-input__inner" v-model="dropDownValue" @input="getSupplierByLike">-->
<!--            </div>-->
<!--            <el-option v-for = "item in supplierList"-->
<!--                       :key = "item.sId"-->
<!--                       :label = "item.sName"-->
<!--                       :value = "item.sId">-->

<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="售后周期" prop="pReturnCycle">
<!--          <el-input v-model="parts.pReturnCycle" style="width: 400px"/>-->
          <el-select v-model="parts.pReturnCycle" style="width: 400px" placeholder="请选择产品售后周期">
            <el-option label="原厂无三包" :value="0"></el-option>
            <el-option :label="item.rcAmount+'天'" :value="item.rcAmount" v-for="item in cycleList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="零件状态" prop="pPartsStatus">
          <el-select v-model="parts.pPartsStatus" placeholder="请选择零件状态">
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="pNote">
          <el-input v-model="parts.pNote" :rows="5" type="textarea" style="width: 400px"/>
        </el-form-item>


        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('partsa')" >保存</el-button>
          <el-button type="primary" @click="backPre" >返回</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
  </div>
</template>
<script>
import ImageCropper from '@/components/ImageCropper'
import {baseURL} from '@/api/http'
import PanThumb from '@/components/PanThumb'
import {PostData} from "@/api/index";
import qs from 'qs'
import submitPic from "@/components/submitPic/submitPic";
import part from "@/views/parts/part";
export default {
  components:{
    ImageCropper,
    PanThumb,
    submitPic
  },
  data() {
     let validateUnit = (rule, value, callback) => {
       if (!value) {
         callback(new Error('请输入单位'));
       }else{
         callback()
       }
    };
    return {
      showDetail:[],
      handledData:[],
      image_uri: [],
      fileList: [],
      carList:[],
      factoryList:[],
      placeList:[],
      categoryList:[],
      pCategoryList:[],
      positionList:[],
      supplierList:[],
      unitList:[],
      cycleList:[],
      parts: {
        pPartsStatus:1,
        pName:''
      },
      loading: false,
      position:{},
      baseURL:baseURL,
      dialogImageUrl:'',
      upLoadDialog:false,
      dialogVisible: false,
      formLabelWidth: '80px',
      limitNum: 3,
      form: {},
      inPicPar:{
        pId:-1,
        type:0
      },
      outPicPar:{
        pId:-1,
        type:1
      },
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      placeQuery:{
        pageSize: 10,
        pageNum: 1,
        plName:''
      },
      unitQuery:{
        pageSize: 0,
        pageNum: 0,
        uName:''
      },
      factoryQuery:{
        pageSize: 10,
        pageNum: 1,
        fName:''
      },
      supplierQuery:{
        pageSize: 10,
        pageNum: 1,
        sName:''
      },
      carQuery:{
        pageSize: 10,
        pageNum: 1,
        cTypeName:''
      },
      categoryQuery:{
        cName:'',
        pageSize: 10,
        pageNum: 1,
      },
      positionQuery:{
        status:1,
        type:0
      },
      pCateQuery:{
        status:1,
        type:2
      },
      levCategoryQuery:{
        status:1,
        type:1
      },
      highFiveQuery:{},
      cycleQuery:{
        pageSize: 0,
        pageNum: 0,
      },
      value: [],
      options: [],
      highFactory:[],
      highPlace:[],
      categoryOption:[],
      query:{
        pageSize: 10,
        pageNum: 1
      },
      rules: {
        pName: [
          {required: true, message: "请输入零件名", trigger: "blur"},
        ],
        pNumber: [
          {required: true, message: "请输入零件号", trigger: "blur"},
          // {required: true, pattern: /^[0-9]+$/, message: '零件号为数字',trigger: 'blur'}///
        ],
        // pUnit: [
        //   {required: true, message: "请输入单位", trigger: "blur"},
        //   {validator: validatepUnit, trigger: 'blur'},
        //
        // ],
        pPlaceId:[
          {required: true, message: "请输入产地或品牌", trigger: "change"}
        ],
        pBuyingPrice:[
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '进价只能为数字',trigger: "blur"},
        ],
        pLowPrice: [
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '一级价只能为数字',trigger: "blur"},

        ],
        pCategoryId:[
          {required: true, message: "请输入零件类目", trigger: "blur"}
        ],
        pMiddlePrice: [
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '二级价只能为数字',trigger: "blur"},

        ],
        pHighPrice: [
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '三级价只能为数字',trigger: "blur"},

        ],
        pUnitId:[
          {required: true, message: "请选择单位",trigger:"change"}
          // { validator: validateUnit, trigger: 'change' }
        ],
        pPartsSizeType:[
          {required: true, message: "请选择零件尺寸", trigger: "blur"}
        ],
        pFactoryId:[
          {required: true, message: "请选择厂家", trigger: "change"}
        ],
        pPartsStatus:[
          {required: true, message: "请选择零件状态", trigger: "blur"}
        ],
        pWholesalePrice:[
          {required: true, message: "请输入批发价", trigger: "blur"},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '批发价只能为数字',trigger: "blur"},
        ],
        pRetailPrice:[
          {required: true, message: "请输入零售价", trigger: "blur"},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '零售价只能为数字',trigger: "blur"},
        ],
        pFloorPrice:[
          {required: true, message: "请输入底价", trigger: "blur"},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '底价只能为数字',trigger: "blur"},
        ],
        pRealInventory:[
          {required: true, message: "请输入实际库存数", trigger: "blur"},
          {required: true, pattern: /^[0-9]+$/,message: '实际库存数为小数',trigger: "blur"},
        ],
        positions: [
          {required: true, message: "请输入货物编码", trigger: "blur"}
        ],
        pReturnCycle:[
          {required: true, message: "请输入周期数", trigger: "blur"},
          {required: true, pattern: /^[0-9]+$/,message: '输入为数字',trigger: "blur"},
        ]
      },
    }
  },
  created() {
    this.getCarList()
    this.getLevelCat()
    this.getPositionCat()
    this.getPCate()
    this.getRycle()
    this.getUnitList()
    this.getHighFive()
  },
  computed: {
    partId(){
      return 1
    },
    inPicturePar(){
      return qs.stringify(this.inPicPar)
    },
    outPicturePar(){
      return qs.stringify(this.outPicPar)
    }
  },
  methods: {
    showdata(){
      console.log(this.showDetail.join('/'));
    },
    upload(event){
      let file = event.target.files[0]; //获取input的图片file值
      let param = new FormData(); // 创建form对象
      param.append("file", file); //对应后台接收图片名
      PostData('upload/image',param)
        .then(res =>{
          console.log(res);
          let url = res;
          this.parts.pPicture = + url;
          // this.dropDownValue = null
        })
    },
    getRycle(){
      PostData('/returnCycle/selectAll',qs.stringify(this.cycleQuery))
        .then(res=>{
          this.cycleList = res.list
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    getHighFive(){
      PostData('/parts/selectHighFive',this.highFiveQuery).then((ref)=>{
        console.log(ref);
        this.highFactory=ref.factories
        this.highPlace=ref.places
      })
    },
    backPre(){
      this.$router.back()
    },
    getNode(){
      this.parts.positions=[]
      console.log(this.showDetail);
      for(let i=0;i<this.showDetail.length;i++){
        console.log(this.showDetail[i].join("/"));
        this.position={}
        this.position.position=this.showDetail[i].join("/")
        this.parts.positions.push(this.position)
      }
      console.log(this.parts.positions);
    },
    getPositionCat(){
      PostData('/position/selectCatalogue',qs.stringify(this.positionQuery)).then((ref)=>{
        this.positionList=this.getTreeData(ref)
        console.log(this.positionList);
      })
    },
    getPCate(){
      PostData('/position/selectCatalogue',qs.stringify(this.pCateQuery)).then((ref)=>{
        this.categoryOption=this.getTreeData(ref)
        console.log(this.categoryOption);
      })
    },
    getLevelCat(){
      PostData('/position/selectCatalogue',qs.stringify(this.levCategoryQuery)).then(ref=>{
          this.options=this.getTreeData(ref)
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },//获取四级联动所有数据
    getTreeData(data){
      for(let i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    getCarList(){
      PostData('car/selectAllByLike',qs.stringify(this.carQuery))
        .then(res =>{
          this.carList = res.list
        })
    },
    getFactoryList(queryString){
      this.factoryQuery.fName = queryString;
      PostData('factory/selectAllByLike',this.factoryQuery)
        .then(res =>{
          this.factoryList=res.list
          console.log(this.factoryList);
          this.loading=false
        })
    },
    getPlace(){
      this.placeList=this.highPlace
    },
    getFactory(){
      this.factoryList=this.highFactory
    },
    remoteFactory(query) {
      console.log(query);
      if (query!=='') {
        this.loading = true;
        this.getFactoryList(query)
      } else {
        this.factoryList=[]
      }
    },
    remotePlace(query){
      if (query!=='') {
        this.loading = true;
        this.getPlaceList(query)
      } else {
        this.placeList=[]
      }
    },
    remoteUnit(query){
      if (query!=='') {
        this.loading = true;
        this.getUnitList(query)
      } else {
        this.unitList=[]
      }
    },
    getPlaceList(queryString){
      this.placeQuery.plName = queryString;
      PostData('place/selectAllByLike',qs.stringify(this.placeQuery))
        .then(res =>{
          this.placeList=res.list
          this.loading=false
        })
    },
    getUnitList(){
      PostData('unit/selectAll',qs.stringify(this.unitQuery))
        .then(res =>{
          this.unitList=res.list
          console.log(this.unitList);
        })
    },
    handleChange(value) {
      this.parts.pCarName=value.join("/")
      console.log(this.parts.pCarName);
    },
    handlePcateChange(value){
      console.log(value);
      this.parts.pName=value[value.length-1]
      this.parts.pCategoryId=value.join("/")
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$router.push({path:'/parts/part'})
          done();
        })
        .catch(_ => {});
    },
    handleRemove(file, fileList) {
      console.log(file,fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    onSuccess(res,file){
      if(res.code==200){
        this.parts.pPicture = res.data.data;
        this.$message.success("图片上传成功");
      }else{
        this.$message.error("图片上传失败，请重新上传");
      }
    },
    handleBeforeUpload(file){
      console.log('before')
      if(!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
        })
      }
      let size = file.size / 1024 / 1024 / 2
      if(size > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2M'
        })
      }
    },
    // 文件超出个数限制时的钩子
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadFile() {
      this.$refs.inUpload.submit()
      this.$refs.outUpload.submit()
    },
    noUpLoad(){
      this.upLoadDialog=false
      this.$message({
        type:'success',
        message:'添加零件成功'
      })
      this.$router.push({path:'/parts/part'})
    },
    confirmUp(){
      this.upLoadDialog=false
      this.uploadFile()
      this.$message({
        type:'success',
        message:'添加零件成功'
      })
      this.$router.push({path:'/parts/part'})
    },
    // save(){
    //   PostData('parts/insert',this.parts)
    //   .then(res=>{
    //     console.log(res);
    //     this.$message({
    //       type:'success',
    //       message:'添加零件成功'
    //     })
    //   }).catch(()=>{})
    //   //   }else{
    //   //     this.$message.error('信息未完善')
    //   //   }
    //   this.$router.push({path:'/parts/part'})
    submitForm(formName) {
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.parts);
          PostData('parts/insert',this.parts)
            .then(res=>{
              console.log(res);
              if(res.code===500){
                this.$message({
                  type:"warning",
                  message:res.cause
                })
              }
              else {
                console.log('-----------------------------------')
                console.log(res)
                this.inPicPar.pId=parseInt(res.data)
                this.outPicPar.pId=parseInt(res.data)
                this.upLoadDialog=true
              }
              // this.$router.push({path:'/parts/part'})
            }).catch(()=>{
              this.$message({
                type:'warning',
                message:'请检查输入信息是否正确'
              })
          })
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
